
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Campaign } from '@/types';

export const useSupabaseCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const mountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchCampaigns = useCallback(async () => {
    if (!mountedRef.current) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      console.log('Fetching campaigns...');
      setIsLoading(true);
      setHasError(false);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session || !mountedRef.current) {
        console.log('No session or component unmounted');
        setCampaigns([]);
        setIsLoading(false);
        return;
      }

      const { data: campaignsData, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false })
        .abortSignal(abortControllerRef.current.signal);

      if (!mountedRef.current) return;

      if (error) {
        if (error.code !== 'PGRST301') {
          console.error('Erro ao buscar campanhas:', error);
          setHasError(true);
          toast.error('Erro ao carregar campanhas');
        }
        setCampaigns([]);
        return;
      }

      const mappedCampaigns: Campaign[] = (campaignsData || []).map(campaign => ({
        id: campaign.id,
        name: campaign.name || '',
        type: (campaign.type || 'email') as Campaign['type'],
        status: (campaign.status || 'planning') as Campaign['status'],
        budget: campaign.budget || 0,
        start_date: new Date(campaign.start_date || new Date()),
        end_date: new Date(campaign.end_date || new Date()),
        leads_generated: campaign.leads_generated || 0,
        conversion_rate: campaign.conversion_rate || 0,
        roi: campaign.roi || 0,
        owner_id: campaign.owner_id || session.user.id,
        owner_name: 'Utilizador',
        created_at: new Date(campaign.created_at)
      }));

      setCampaigns(mappedCampaigns);
      console.log('Campaigns loaded:', mappedCampaigns.length);
    } catch (error) {
      if (!mountedRef.current) return;
      
      console.error('Erro ao buscar campanhas:', error);
      
      if ((error as any).name !== 'AbortError') {
        setHasError(true);
        toast.error('Erro ao carregar campanhas');
      }
      setCampaigns([]);
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []); // Empty dependency array

  const createCampaign = useCallback(async (campaignData: Omit<Campaign, 'id' | 'created_at'>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Você precisa estar autenticado para criar campanhas');
        return { data: null, error: new Error('Not authenticated') };
      }

      const { data, error } = await supabase
        .from('campaigns')
        .insert([{
          name: campaignData.name,
          type: campaignData.type,
          status: campaignData.status,
          budget: campaignData.budget,
          start_date: campaignData.start_date.toISOString().split('T')[0],
          end_date: campaignData.end_date.toISOString().split('T')[0],
          leads_generated: campaignData.leads_generated,
          conversion_rate: campaignData.conversion_rate,
          roi: campaignData.roi,
          owner_id: session.user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar campanha:', error);
        toast.error('Erro ao criar campanha');
        return { data: null, error };
      }

      toast.success('Campanha criada com sucesso!');
      await fetchCampaigns();
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao criar campanha:', error);
      toast.error('Erro ao criar campanha');
      return { data: null, error };
    }
  }, [fetchCampaigns]);

  useEffect(() => {
    mountedRef.current = true;
    
    // Only fetch once when component mounts
    const timeoutId = setTimeout(() => {
      if (mountedRef.current) {
        fetchCampaigns();
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
    campaigns,
    isLoading,
    hasError,
    createCampaign,
    refetch: fetchCampaigns
  };
};
