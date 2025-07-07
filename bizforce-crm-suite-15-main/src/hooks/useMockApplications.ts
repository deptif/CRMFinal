
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import type { Application } from '@/types';

// Mock hook until the applications table is properly set up in Supabase
export const useMockApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    // Mock data - replace with real Supabase call when table is ready
    setTimeout(() => {
      setApplications([]);
      setIsLoading(false);
    }, 500);
  }, []);

  const createApplication = useCallback(async (appData: Omit<Application, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newApp: Application = {
        ...appData,
        id: crypto.randomUUID(),
        created_at: new Date(),
        updated_at: new Date()
      };
      
      setApplications(prev => [...prev, newApp]);
      toast.success('Aplicação criada com sucesso!');
      return { data: newApp, error: null };
    } catch (error) {
      toast.error('Erro ao criar aplicação');
      return { data: null, error };
    }
  }, []);

  const updateApplication = useCallback(async (appId: string, updates: Partial<Application>) => {
    try {
      setApplications(prev => prev.map(app => 
        app.id === appId ? { ...app, ...updates, updated_at: new Date() } : app
      ));
      toast.success('Aplicação atualizada com sucesso!');
      return { data: null, error: null };
    } catch (error) {
      toast.error('Erro ao atualizar aplicação');
      return { data: null, error };
    }
  }, []);

  const deleteApplication = useCallback(async (appId: string) => {
    try {
      setApplications(prev => prev.filter(app => app.id !== appId));
      toast.success('Aplicação eliminada com sucesso!');
      return { error: null };
    } catch (error) {
      toast.error('Erro ao eliminar aplicação');
      return { error };
    }
  }, []);

  useEffect(() => {
    fetchApplications();
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
