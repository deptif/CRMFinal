
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MultiChannelCampaign {
  id: string;
  name: string;
  description: string;
  target_audience: string;
  channels: string[];
  status: 'draft' | 'active' | 'paused' | 'completed';
  leads_generated: number;
  responses: number;
  conversion_rate: number;
  budget: number;
  start_date?: Date;
  end_date?: Date;
  owner_id: string;
  created_at: Date;
}

export const useSupabaseMultiChannel = () => {
  const [campaigns, setCampaigns] = useState<MultiChannelCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const mountedRef = useRef(true);

  const fetchCampaigns = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      console.log('Fetching multi-channel campaigns...');
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
        .from('multi_channel_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (!mountedRef.current) return;

      if (error) {
        console.error('Erro ao buscar campanhas multi-canal:', error);
        setHasError(true);
        toast.error('Erro ao carregar campanhas multi-canal');
        setCampaigns([]);
        return;
      }

      const mappedCampaigns: MultiChannelCampaign[] = (campaignsData || []).map((campaign: any) => ({
        id: campaign.id,
        name: campaign.name || '',
        description: campaign.description || '',
        target_audience: campaign.target_audience || '',
        channels: campaign.channels || [],
        status: (campaign.status || 'draft') as MultiChannelCampaign['status'],
        leads_generated: campaign.leads_generated || 0,
        responses: campaign.responses || 0,
        conversion_rate: campaign.conversion_rate || 0,
        budget: campaign.budget || 0,
        start_date: campaign.start_date ? new Date(campaign.start_date) : undefined,
        end_date: campaign.end_date ? new Date(campaign.end_date) : undefined,
        owner_id: campaign.owner_id || session.user.id,
        created_at: new Date(campaign.created_at)
      }));

      setCampaigns(mappedCampaigns);
      console.log('Multi-channel campaigns loaded:', mappedCampaigns.length);
    } catch (error) {
      if (!mountedRef.current) return;
      
      console.error('Erro ao buscar campanhas multi-canal:', error);
      setHasError(true);
      toast.error('Erro ao carregar campanhas multi-canal');
      setCampaigns([]);
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  const createCampaign = async (campaignData: Omit<MultiChannelCampaign, 'id' | 'created_at'>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Você precisa estar autenticado para criar campanhas');
        return { data: null, error: new Error('Not authenticated') };
      }

      const { data, error } = await supabase
        .from('multi_channel_campaigns')
        .insert([{
          name: campaignData.name,
          description: campaignData.description,
          target_audience: campaignData.target_audience,
          channels: campaignData.channels,
          status: campaignData.status,
          leads_generated: campaignData.leads_generated,
          responses: campaignData.responses,
          conversion_rate: campaignData.conversion_rate,
          budget: campaignData.budget,
          start_date: campaignData.start_date?.toISOString().split('T')[0],
          end_date: campaignData.end_date?.toISOString().split('T')[0],
          owner_id: session.user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar campanha multi-canal:', error);
        toast.error('Erro ao criar campanha multi-canal');
        return { data: null, error };
      }

      toast.success('Campanha multi-canal criada com sucesso!');
      fetchCampaigns();
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao criar campanha multi-canal:', error);
      toast.error('Erro ao criar campanha multi-canal');
      return { data: null, error };
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    fetchCampaigns();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    campaigns,
    isLoading,
    hasError,
    createCampaign,
    refetch: fetchCampaigns
  };
};
