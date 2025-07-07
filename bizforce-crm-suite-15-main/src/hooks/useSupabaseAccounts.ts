
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Account } from '@/types';

export const useSupabaseAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const mountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastFetchRef = useRef<number>(0);
  const isInitializedRef = useRef(false);

  const fetchAccounts = useCallback(async () => {
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
      console.log('Fetching accounts...');
      setIsLoading(true);
      setHasError(false);

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session || !mountedRef.current) {
        console.log('No session or component unmounted');
        setAccounts([]);
        setIsLoading(false);
        return;
      }

      const { data: accountsData, error } = await supabase
        .from('accounts')
        .select(`
          *,
          profiles!accounts_owner_id_fkey(name)
        `)
        .order('created_at', { ascending: false })
        .abortSignal(abortControllerRef.current.signal);

      if (!mountedRef.current) return;

      if (error) {
        if (error.code !== 'PGRST301') {
          console.error('Erro ao buscar contas:', error);
          setHasError(true);
          toast.error('Erro ao carregar contas');
        }
        setAccounts([]);
        return;
      }

      const mappedAccounts: Account[] = (accountsData || []).map(account => ({
        id: account.id,
        name: account.name || '',
        industry: account.industry || '',
        phone: account.phone || '',
        email: account.email || '',
        website: account.website || '',
        address: account.address || '',
        annual_revenue: account.annual_revenue || undefined,
        employees: account.employees || undefined,
        tags: account.tags || [],
        owner_id: account.owner_id || session.user.id,
        owner_name: account.profiles?.name || 'Não atribuído',
        created_at: new Date(account.created_at)
      }));

      setAccounts(mappedAccounts);
      console.log('Accounts loaded:', mappedAccounts.length);
    } catch (error) {
      if (!mountedRef.current) return;
      
      console.error('Erro ao buscar contas:', error);
      
      if ((error as any).name !== 'AbortError') {
        setHasError(true);
        toast.error('Erro ao carregar contas');
      }
      setAccounts([]);
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  const createAccount = useCallback(async (accountData: Omit<Account, 'id' | 'created_at'>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Você precisa estar autenticado para criar contas');
        return { data: null, error: new Error('Not authenticated') };
      }

      const { data, error } = await supabase
        .from('accounts')
        .insert([{
          name: accountData.name,
          industry: accountData.industry,
          phone: accountData.phone,
          email: accountData.email,
          website: accountData.website,
          address: accountData.address,
          annual_revenue: accountData.annual_revenue,
          employees: accountData.employees,
          tags: accountData.tags,
          owner_id: session.user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar conta:', error);
        toast.error('Erro ao criar conta');
        return { data: null, error };
      }

      toast.success('Conta criada com sucesso!');
      setTimeout(() => fetchAccounts(), 100);
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      toast.error('Erro ao criar conta');
      return { data: null, error };
    }
  }, [fetchAccounts]);

  const updateAccount = useCallback(async (accountId: string, updates: Partial<Account>) => {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .update({
          name: updates.name,
          industry: updates.industry,
          phone: updates.phone,
          email: updates.email,
          website: updates.website,
          address: updates.address,
          annual_revenue: updates.annual_revenue,
          employees: updates.employees,
          tags: updates.tags
        })
        .eq('id', accountId)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar conta:', error);
        toast.error('Erro ao atualizar conta');
        return { data: null, error };
      }

      toast.success('Conta atualizada com sucesso!');
      setTimeout(() => fetchAccounts(), 100);
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao atualizar conta:', error);
      toast.error('Erro ao atualizar conta');
      return { data: null, error };
    }
  }, [fetchAccounts]);

  const deleteAccount = useCallback(async (accountId: string) => {
    try {
      const { data: relatedContacts, error: contactsError } = await supabase
        .from('contacts')
        .select('id')
        .eq('account_id', accountId);

      if (contactsError) {
        console.error('Erro ao verificar contactos relacionados:', contactsError);
        toast.error('Erro ao verificar contactos relacionados');
        return { error: contactsError };
      }

      if (relatedContacts && relatedContacts.length > 0) {
        toast.error('Não é possível eliminar esta conta pois tem contactos associados. Elimine primeiro os contactos.');
        return { error: new Error('Account has related contacts') };
      }

      const { error } = await supabase
        .from('accounts')
        .delete()
        .eq('id', accountId);

      if (error) {
        console.error('Erro ao eliminar conta:', error);
        toast.error('Erro ao eliminar conta');
        return { error };
      }

      toast.success('Conta eliminada com sucesso!');
      setTimeout(() => fetchAccounts(), 100);
      return { error: null };
    } catch (error) {
      console.error('Erro ao eliminar conta:', error);
      toast.error('Erro ao eliminar conta');
      return { error };
    }
  }, [fetchAccounts]);

  useEffect(() => {
    if (isInitializedRef.current) return;
    
    mountedRef.current = true;
    isInitializedRef.current = true;
    
    const timeoutId = setTimeout(() => {
      if (mountedRef.current) {
        fetchAccounts();
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
    accounts,
    isLoading,
    hasError,
    createAccount,
    updateAccount,
    deleteAccount,
    refetch: fetchAccounts
  };
};
