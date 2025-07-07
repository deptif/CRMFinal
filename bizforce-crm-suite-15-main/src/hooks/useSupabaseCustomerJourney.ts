
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CustomerJourneyStage {
  id: string;
  stage_name: string;
  stage_order: number;
  description: string;
  contact_id: string;
  completed_at?: Date;
  owner_id: string;
  created_at: Date;
}

export const useSupabaseCustomerJourney = () => {
  const [journeyStages, setJourneyStages] = useState<CustomerJourneyStage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const mountedRef = useRef(true);

  const fetchJourneyStages = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      console.log('Fetching customer journey stages...');
      setIsLoading(true);
      setHasError(false);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session || !mountedRef.current) {
        console.log('No session or component unmounted');
        setJourneyStages([]);
        setIsLoading(false);
        return;
      }

      const { data: stagesData, error } = await supabase
        .from('customer_journey_stages')
        .select('*')
        .order('stage_order', { ascending: true });

      if (!mountedRef.current) return;

      if (error) {
        console.error('Erro ao buscar etapas da jornada:', error);
        setHasError(true);
        toast.error('Erro ao carregar jornada do cliente');
        setJourneyStages([]);
        return;
      }

      const mappedStages: CustomerJourneyStage[] = (stagesData || []).map((stage: any) => ({
        id: stage.id,
        stage_name: stage.stage_name || '',
        stage_order: stage.stage_order || 0,
        description: stage.description || '',
        contact_id: stage.contact_id || '',
        completed_at: stage.completed_at ? new Date(stage.completed_at) : undefined,
        owner_id: stage.owner_id || session.user.id,
        created_at: new Date(stage.created_at)
      }));

      setJourneyStages(mappedStages);
      console.log('Journey stages loaded:', mappedStages.length);
    } catch (error) {
      if (!mountedRef.current) return;
      
      console.error('Erro ao buscar etapas da jornada:', error);
      setHasError(true);
      toast.error('Erro ao carregar jornada do cliente');
      setJourneyStages([]);
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  const createJourneyStage = async (stageData: Omit<CustomerJourneyStage, 'id' | 'created_at'>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Você precisa estar autenticado para criar etapas');
        return { data: null, error: new Error('Not authenticated') };
      }

      const { data, error } = await supabase
        .from('customer_journey_stages')
        .insert([{
          stage_name: stageData.stage_name,
          stage_order: stageData.stage_order,
          description: stageData.description,
          contact_id: stageData.contact_id,
          completed_at: stageData.completed_at?.toISOString(),
          owner_id: session.user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar etapa da jornada:', error);
        toast.error('Erro ao criar etapa da jornada');
        return { data: null, error };
      }

      toast.success('Etapa da jornada criada com sucesso!');
      fetchJourneyStages();
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao criar etapa da jornada:', error);
      toast.error('Erro ao criar etapa da jornada');
      return { data: null, error };
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    fetchJourneyStages();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    journeyStages,
    isLoading,
    hasError,
    createJourneyStage,
    refetch: fetchJourneyStages
  };
};
