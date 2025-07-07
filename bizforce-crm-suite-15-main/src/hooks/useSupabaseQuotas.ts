import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface QuotaData {
  id?: string;
  user_id: string;
  user_name: string;
  period: string;
  year: number;
  quarter?: number;
  quota_amount: number;
  achieved_amount: number;
  percentage: number;
  created_at?: Date;
}

export const useSupabaseQuotas = () => {
  const [quotas, setQuotas] = useState<QuotaData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const mountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchQuotas = useCallback(async () => {
    if (!mountedRef.current) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      console.log('Fetching quotas...');
      setIsLoading(true);
      setHasError(false);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session || !mountedRef.current) {
        console.log('No session or component unmounted');
        setQuotas([]);
        setIsLoading(false);
        return;
      }

      const { data: quotasData, error } = await supabase
        .from('sales_quotas')
        .select('*')
        .order('created_at', { ascending: false })
        .abortSignal(abortControllerRef.current.signal);

      if (!mountedRef.current) return;

      if (error) {
        if (error.code !== 'PGRST301') {
          console.error('Erro ao buscar quotas:', error);
          setHasError(true);
          toast.error('Erro ao carregar quotas');
        }
        setQuotas([]);
        return;
      }

      const mappedQuotas: QuotaData[] = (quotasData || []).map(quota => ({
        id: quota.id,
        user_id: quota.user_id || '',
        user_name: quota.user_name || '',
        period: quota.period || '',
        year: quota.year || new Date().getFullYear(),
        quarter: quota.quarter,
        quota_amount: quota.quota_amount || 0,
        achieved_amount: quota.achieved_amount || 0,
        percentage: quota.percentage || 0,
        created_at: new Date(quota.created_at)
      }));

      setQuotas(mappedQuotas);
      console.log('Quotas loaded:', mappedQuotas.length);
    } catch (error) {
      if (!mountedRef.current) return;
      
      console.error('Erro ao buscar quotas:', error);
      
      if ((error as any).name !== 'AbortError') {
        setHasError(true);
        toast.error('Erro ao carregar quotas');
      }
      setQuotas([]);
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  const createQuota = useCallback(async (quotaData: Omit<QuotaData, 'id' | 'created_at'>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Você precisa estar autenticado para criar quotas');
        return { data: null, error: new Error('Not authenticated') };
      }

      // Parse period to extract year and quarter
      const currentYear = new Date().getFullYear();
      let year = currentYear;
      let quarter = null;
      
      if (quotaData.period.includes('Q')) {
        const match = quotaData.period.match(/Q(\d+)\s+(\d+)/);
        if (match) {
          quarter = parseInt(match[1]);
          year = parseInt(match[2]);
        }
      } else if (quotaData.period.includes('2025') || quotaData.period.includes('2024')) {
        year = parseInt(quotaData.period);
      }

      const { data, error } = await supabase
        .from('sales_quotas')
        .insert([{
          user_id: quotaData.user_id,
          user_name: quotaData.user_name,
          period: quotaData.period,
          year: year,
          quarter: quarter,
          quota_amount: quotaData.quota_amount,
          achieved_amount: quotaData.achieved_amount,
          percentage: quotaData.percentage
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar quota:', error);
        toast.error('Erro ao criar quota');
        return { data: null, error };
      }

      toast.success('Quota criada com sucesso!');
      await fetchQuotas();
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao criar quota:', error);
      toast.error('Erro ao criar quota');
      return { data: null, error };
    }
  }, [fetchQuotas]);

  useEffect(() => {
    mountedRef.current = true;
    
    const timeoutId = setTimeout(() => {
      if (mountedRef.current) {
        fetchQuotas();
      }
    }, 100);

    return () => {
      mountedRef.current = false;
      clearTimeout(timeoutId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    quotas,
    isLoading,
    hasError,
    createQuota,
    refetch: fetchQuotas
  };
};