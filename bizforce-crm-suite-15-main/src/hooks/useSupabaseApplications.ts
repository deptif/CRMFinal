
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { Application } from '@/types';

export const useSupabaseApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const mountedRef = useRef(true);
  const isInitializedRef = useRef(false);

  const fetchApplications = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      console.log('Loading applications from Supabase...');
      setIsLoading(true);
      setHasError(false);

      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (!mountedRef.current) return;

      const formattedApplications: Application[] = data?.map(app => ({
        id: app.id,
        name: app.name,
        api_name: app.api_name,
        description: app.description || '',
        icon: app.icon || '',
        image: app.image || '',
        url: app.url || '',
        owner_id: app.owner_id,
        created_at: new Date(app.created_at),
        updated_at: new Date(app.updated_at)
      })) || [];

      setApplications(formattedApplications);
      console.log('Applications loaded:', formattedApplications.length);
    } catch (error) {
      if (!mountedRef.current) return;
      
      console.error('Erro ao carregar aplicações:', error);
      setHasError(true);
      toast.error('Erro ao carregar aplicações');
      setApplications([]);
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  const createApplication = useCallback(async (appData: Omit<Application, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .insert([
          {
            name: appData.name,
            api_name: appData.api_name,
            description: appData.description || null,
            icon: appData.icon || null,
            image: appData.image || null,
            url: appData.url || null,
            owner_id: appData.owner_id
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      const newApp: Application = {
        id: data.id,
        name: data.name,
        api_name: data.api_name,
        description: data.description || '',
        icon: data.icon || '',
        image: data.image || '',
        url: data.url || '',
        owner_id: data.owner_id,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      };

      setApplications(prev => [newApp, ...prev]);
      toast.success('Aplicação criada com sucesso!');
      return { data: newApp, error: null };
    } catch (error) {
      console.error('Erro ao criar aplicação:', error);
      toast.error('Erro ao criar aplicação');
      return { data: null, error };
    }
  }, []);

  const updateApplication = useCallback(async (appId: string, updates: Partial<Application>) => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .update({
          name: updates.name,
          api_name: updates.api_name,
          description: updates.description || null,
          icon: updates.icon || null,
          image: updates.image || null,
          url: updates.url || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', appId)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      const updatedApp: Application = {
        id: data.id,
        name: data.name,
        api_name: data.api_name,
        description: data.description || '',
        icon: data.icon || '',
        image: data.image || '',
        url: data.url || '',
        owner_id: data.owner_id,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      };

      setApplications(prev => prev.map(app => 
        app.id === appId ? updatedApp : app
      ));

      toast.success('Aplicação atualizada com sucesso!');
      return { data: updatedApp, error: null };
    } catch (error) {
      console.error('Erro ao atualizar aplicação:', error);
      toast.error('Erro ao atualizar aplicação');
      return { data: null, error };
    }
  }, []);

  const deleteApplication = useCallback(async (appId: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', appId);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      setApplications(prev => prev.filter(app => app.id !== appId));
      toast.success('Aplicação eliminada com sucesso!');
      return { error: null };
    } catch (error) {
      console.error('Erro ao eliminar aplicação:', error);
      toast.error('Erro ao eliminar aplicação');
      return { error };
    }
  }, []);

  useEffect(() => {
    if (isInitializedRef.current) return;
    
    mountedRef.current = true;
    isInitializedRef.current = true;
    
    const timeoutId = setTimeout(() => {
      if (mountedRef.current) {
        fetchApplications();
      }
    }, 100);

    return () => {
      mountedRef.current = false;
      clearTimeout(timeoutId);
    };
  }, [fetchApplications]);

  return {
    applications,
    isLoading,
    hasError,
    createApplication,
    updateApplication,
    deleteApplication,
    refetch: fetchApplications
  };
};
