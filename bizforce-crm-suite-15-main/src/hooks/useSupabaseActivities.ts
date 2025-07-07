
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Activity } from '@/types';

export const useSupabaseActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const mountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchActivities = useCallback(async () => {
    if (hasError || !mountedRef.current) return;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      console.log('Fetching activities...');
      setIsLoading(true);
      setHasError(false);
      
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session:', session?.user?.id);
      
      if (!session || !mountedRef.current) {
        console.log('No session or component unmounted');
        setActivities([]);
        setIsLoading(false);
        return;
      }

      const { data: activitiesData, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false })
        .abortSignal(abortControllerRef.current.signal);

      if (!mountedRef.current) return;

      console.log('Activities data:', activitiesData);
      console.log('Error:', error);

      if (error) {
        if (error.code !== 'PGRST301') { // Ignore abort errors
          console.error('Erro ao buscar atividades:', error);
          setHasError(true);
          toast.error('Erro ao carregar atividades');
        }
        setActivities([]);
        return;
      }

      const mappedActivities: Activity[] = (activitiesData || []).map(activity => ({
        id: activity.id,
        title: activity.title || '',
        description: activity.description || '',
        type: (activity.type || 'call') as Activity['type'],
        status: (activity.status || 'pending') as Activity['status'],
        due_date: new Date(activity.due_date || new Date()),
        related_to: (activity.related_to || 'account') as Activity['related_to'],
        related_id: activity.related_id || '',
        related_name: 'Relacionado',
        owner_id: activity.owner_id || session.user.id,
        owner_name: 'Você',
        created_at: new Date(activity.created_at)
      }));

      console.log('Mapped activities:', mappedActivities.length);
      setActivities(mappedActivities);
    } catch (error) {
      if (!mountedRef.current) return;
      
      console.error('Erro ao buscar atividades:', error);
      
      if (error.name !== 'AbortError') {
        setHasError(true);
        toast.error('Erro ao carregar atividades');
      }
      setActivities([]);
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [hasError]);

  const createActivity = useCallback(async (activityData: Omit<Activity, 'id' | 'created_at'>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Você precisa estar autenticado para criar atividades');
        return { data: null, error: new Error('Not authenticated') };
      }

      const { data, error } = await supabase
        .from('activities')
        .insert([{
          title: activityData.title,
          description: activityData.description,
          type: activityData.type,
          status: activityData.status,
          due_date: activityData.due_date.toISOString(),
          related_to: activityData.related_to,
          related_id: activityData.related_id,
          owner_id: session.user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar atividade:', error);
        toast.error('Erro ao criar atividade');
        return { data: null, error };
      }

      toast.success('Atividade criada com sucesso!');
      await fetchActivities();
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao criar atividade:', error);
      toast.error('Erro ao criar atividade');
      return { data: null, error };
    }
  }, [fetchActivities]);

  const updateActivity = useCallback(async (activityId: string, updates: Partial<Activity>) => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .update({
          title: updates.title,
          description: updates.description,
          type: updates.type,
          status: updates.status,
          due_date: updates.due_date?.toISOString(),
          related_to: updates.related_to,
          related_id: updates.related_id
        })
        .eq('id', activityId)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar atividade:', error);
        toast.error('Erro ao atualizar atividade');
        return { data: null, error };
      }

      toast.success('Atividade atualizada com sucesso!');
      await fetchActivities();
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao atualizar atividade:', error);
      toast.error('Erro ao atualizar atividade');
      return { data: null, error };
    }
  }, [fetchActivities]);

  const deleteActivity = useCallback(async (activityId: string) => {
    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', activityId);

      if (error) {
        console.error('Erro ao eliminar atividade:', error);
        toast.error('Erro ao eliminar atividade');
        return { error };
      }

      toast.success('Atividade eliminada com sucesso!');
      await fetchActivities();
      return { error: null };
    } catch (error) {
      console.error('Erro ao eliminar atividade:', error);
      toast.error('Erro ao eliminar atividade');
      return { error };
    }
  }, [fetchActivities]);

  const toggleActivityStatus = useCallback(async (activityId: string) => {
    try {
      const activity = activities.find(a => a.id === activityId);
      if (!activity) return { error: new Error('Activity not found') };

      const newStatus = activity.status === 'completed' ? 'pending' : 'completed';
      
      const { error } = await supabase
        .from('activities')
        .update({ status: newStatus })
        .eq('id', activityId);

      if (error) {
        console.error('Erro ao atualizar status da atividade:', error);
        toast.error('Erro ao atualizar status da atividade');
        return { error };
      }

      toast.success('Status da atividade atualizado!');
      await fetchActivities();
      return { error: null };
    } catch (error) {
      console.error('Erro ao atualizar status da atividade:', error);
      toast.error('Erro ao atualizar status da atividade');
      return { error };
    }
  }, [activities, fetchActivities]);

  useEffect(() => {
    mountedRef.current = true;
    fetchActivities();

    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchActivities]);

  return {
    activities,
    isLoading,
    hasError,
    createActivity,
    updateActivity,
    deleteActivity,
    toggleActivityStatus,
    refetch: fetchActivities
  };
};
