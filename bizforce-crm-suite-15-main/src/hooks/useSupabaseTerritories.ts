
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Territory } from '@/types';

export const useSupabaseTerritories = () => {
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const mountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchTerritories = useCallback(async () => {
    if (!mountedRef.current) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      console.log('Fetching territories...');
      setIsLoading(true);
      setHasError(false);
      
      const { data: territoriesData, error } = await supabase
        .from('territories')
        .select('*')
        .order('created_at', { ascending: false })
        .abortSignal(abortControllerRef.current.signal);

      if (!mountedRef.current) return;

      if (error) {
        if (error.code !== 'PGRST301') {
          console.error('Erro ao buscar territórios:', error);
          setHasError(true);
          toast.error('Erro ao carregar territórios');
        }
        setTerritories([]);
        return;
      }

      const mappedTerritories: Territory[] = (territoriesData || []).map(territory => ({
        id: territory.id,
        name: territory.name || '',
        description: territory.description || '',
        region: territory.region || '',
        manager_id: territory.manager_id || '',
        manager_name: territory.manager_name || 'Sem gestor',
        members: territory.members || [],
        target_revenue: territory.target_revenue || 0,
        actual_revenue: territory.actual_revenue || 0,
        created_at: new Date(territory.created_at)
      }));

      setTerritories(mappedTerritories);
      console.log('Territories loaded:', mappedTerritories.length);
    } catch (error) {
      if (!mountedRef.current) return;
      
      console.error('Erro ao buscar territórios:', error);
      
      if ((error as any).name !== 'AbortError') {
        setHasError(true);
        toast.error('Erro ao carregar territórios');
      }
      setTerritories([]);
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []); // Empty dependency array

  const createTerritory = useCallback(async (territoryData: Omit<Territory, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('territories')
        .insert([{
          name: territoryData.name,
          description: territoryData.description,
          region: territoryData.region,
          manager_id: territoryData.manager_id,
          manager_name: territoryData.manager_name,
          members: territoryData.members,
          target_revenue: territoryData.target_revenue,
          actual_revenue: territoryData.actual_revenue
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar território:', error);
        toast.error('Erro ao criar território');
        return { data: null, error };
      }

      toast.success('Território criado com sucesso!');
      await fetchTerritories();
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao criar território:', error);
      toast.error('Erro ao criar território');
      return { data: null, error };
    }
  }, [fetchTerritories]);

  useEffect(() => {
    mountedRef.current = true;
    
    // Only fetch once when component mounts
    const timeoutId = setTimeout(() => {
      if (mountedRef.current) {
        fetchTerritories();
      }
    }, 100);

    return () => {
      mountedRef.current = false;
      clearTimeout(timeoutId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []); // Empty dependency array - only run once

  return {
    territories,
    isLoading,
    hasError,
    createTerritory,
    refetch: fetchTerritories
  };
};
