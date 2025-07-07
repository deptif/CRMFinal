
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Opportunity } from '@/types';

export const useSupabaseOpportunities = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const mountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastFetchRef = useRef<number>(0);
  const isInitializedRef = useRef(false);

  const fetchOpportunities = useCallback(async () => {
    if (!mountedRef.current) return;

    const now = Date.now();
    if (now - lastFetchRef.current < 1000) {
      console.log('Skipping fetch - too soon');
      return;
    }
    lastFetchRef.current = now;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      console.log('Fetching opportunities...');
      setIsLoading(true);
      setHasError(false);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session || !mountedRef.current) {
        console.log('No session or component unmounted');
        setOpportunities([]);
        setIsLoading(false);
        return;
      }

      const { data: opportunitiesData, error } = await supabase
        .from('opportunities')
        .select(`
          *,
          accounts(name),
          contacts(first_name, last_name),
          profiles!opportunities_owner_id_fkey(name)
        `)
        .order('created_at', { ascending: false })
        .abortSignal(abortControllerRef.current.signal);

      if (!mountedRef.current) return;

      if (error) {
        if (error.code !== 'PGRST301') {
          console.error('Erro ao buscar oportunidades:', error);
          setHasError(true);
          toast.error('Erro ao carregar oportunidades');
        }
        setOpportunities([]);
        return;
      }

      const mappedOpportunities: Opportunity[] = (opportunitiesData || []).map(opp => ({
        id: opp.id,
        name: opp.name || '',
        account_id: opp.account_id || '',
        account_name: opp.accounts?.name || 'Sem conta',
        contact_id: opp.contact_id || '',
        contact_name: opp.contacts ? `${opp.contacts.first_name} ${opp.contacts.last_name}` : 'Sem contacto',
        amount: opp.amount || 0,
        stage: (opp.stage || 'lead') as Opportunity['stage'],
        probability: opp.probability || 0,
        close_date: new Date(opp.close_date || new Date()),
        description: opp.description || '',
        owner_id: opp.owner_id || session.user.id,
        owner_name: opp.profiles?.name || 'Não atribuído',
        created_at: new Date(opp.created_at)
      }));

      setOpportunities(mappedOpportunities);
      console.log('Opportunities loaded:', mappedOpportunities.length);
    } catch (error) {
      if (!mountedRef.current) return;
      
      console.error('Erro ao buscar oportunidades:', error);
      
      if ((error as any).name !== 'AbortError') {
        setHasError(true);
        toast.error('Erro ao carregar oportunidades');
      }
      setOpportunities([]);
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  const createOpportunity = useCallback(async (opportunityData: Omit<Opportunity, 'id' | 'created_at'>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Você precisa estar autenticado para criar oportunidades');
        return { data: null, error: new Error('Not authenticated') };
      }

      const { data, error } = await supabase
        .from('opportunities')
        .insert([{
          name: opportunityData.name,
          account_id: opportunityData.account_id,
          contact_id: opportunityData.contact_id,
          amount: opportunityData.amount,
          stage: opportunityData.stage,
          probability: opportunityData.probability,
          close_date: opportunityData.close_date.toISOString().split('T')[0],
          description: opportunityData.description,
          owner_id: session.user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar oportunidade:', error);
        toast.error('Erro ao criar oportunidade');
        return { data: null, error };
      }

      toast.success('Oportunidade criada com sucesso!');
      setTimeout(() => fetchOpportunities(), 100);
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao criar oportunidade:', error);
      toast.error('Erro ao criar oportunidade');
      return { data: null, error };
    }
  }, [fetchOpportunities]);

  const updateOpportunity = useCallback(async (opportunityId: string, updates: Partial<Opportunity>) => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .update({
          name: updates.name,
          account_id: updates.account_id,
          contact_id: updates.contact_id,
          amount: updates.amount,
          stage: updates.stage,
          probability: updates.probability,
          close_date: updates.close_date?.toISOString().split('T')[0],
          description: updates.description
        })
        .eq('id', opportunityId)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar oportunidade:', error);
        toast.error('Erro ao atualizar oportunidade');
        return { data: null, error };
      }

      toast.success('Oportunidade atualizada com sucesso!');
      setTimeout(() => fetchOpportunities(), 100);
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao atualizar oportunidade:', error);
      toast.error('Erro ao atualizar oportunidade');
      return { data: null, error };
    }
  }, [fetchOpportunities]);

  const deleteOpportunity = useCallback(async (opportunityId: string) => {
    try {
      const { error } = await supabase
        .from('opportunities')
        .delete()
        .eq('id', opportunityId);

      if (error) {
        console.error('Erro ao eliminar oportunidade:', error);
        toast.error('Erro ao eliminar oportunidade');
        return { error };
      }

      toast.success('Oportunidade eliminada com sucesso!');
      setTimeout(() => fetchOpportunities(), 100);
      return { error: null };
    } catch (error) {
      console.error('Erro ao eliminar oportunidade:', error);
      toast.error('Erro ao eliminar oportunidade');
      return { error };
    }
  }, [fetchOpportunities]);

  useEffect(() => {
    if (isInitializedRef.current) return;
    
    mountedRef.current = true;
    isInitializedRef.current = true;
    
    const timeoutId = setTimeout(() => {
      if (mountedRef.current) {
        fetchOpportunities();
      }
    }, 200);

    return () => {
      mountedRef.current = false;
      clearTimeout(timeoutId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    opportunities,
    isLoading,
    hasError,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    refetch: fetchOpportunities
  };
};
