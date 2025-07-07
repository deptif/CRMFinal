
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ForecastData {
  month: string;
  predicted: number;
  actual: number;
  pipeline: number;
  confidence: number;
}

interface ForecastMetrics {
  totalPredicted: number;
  totalActual: number;
  accuracy: number;
  pipelineValue: number;
  conversionRate: number;
  avgDealSize: number;
}

export const useForecastData = () => {
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [metrics, setMetrics] = useState<ForecastMetrics>({
    totalPredicted: 0,
    totalActual: 0,
    accuracy: 0,
    pipelineValue: 0,
    conversionRate: 0,
    avgDealSize: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const mountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchForecastData = useCallback(async () => {
    if (hasError || !mountedRef.current) return;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      console.log('Fetching forecast data...');
      setIsLoading(true);
      setHasError(false);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session || !mountedRef.current) {
        console.log('No session or component unmounted');
        setIsLoading(false);
        return;
      }

      // Fetch opportunities data
      const { data: opportunities, error: oppError } = await supabase
        .from('opportunities')
        .select('*')
        .abortSignal(abortControllerRef.current.signal);

      if (!mountedRef.current) return;

      if (oppError) {
        if (oppError.code !== 'PGRST301') {
          console.error('Erro ao buscar oportunidades:', oppError);
          setHasError(true);
          toast.error('Erro ao carregar dados de previsão');
        }
        return;
      }

      // Process forecast data
      const monthlyData: { [key: string]: { predicted: number; actual: number; pipeline: number; count: number } } = {};
      
      const currentDate = new Date();
      for (let i = 0; i < 12; i++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const monthKey = date.toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' });
        monthlyData[monthKey] = { predicted: 0, actual: 0, pipeline: 0, count: 0 };
      }

      // Calculate metrics from opportunities
      let totalRevenue = 0;
      let totalDeals = 0;
      let wonDeals = 0;
      let totalPipeline = 0;

      (opportunities || []).forEach(opp => {
        const closeDate = new Date(opp.close_date || opp.created_at);
        const monthKey = closeDate.toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' });
        
        if (monthlyData[monthKey]) {
          if (opp.stage === 'closed_won') {
            monthlyData[monthKey].actual += opp.amount || 0;
            totalRevenue += opp.amount || 0;
            wonDeals++;
          } else {
            monthlyData[monthKey].pipeline += opp.amount || 0;
            totalPipeline += opp.amount || 0;
          }
          
          // Predicted value based on probability
          monthlyData[monthKey].predicted += (opp.amount || 0) * ((opp.probability || 0) / 100);
          monthlyData[monthKey].count++;
        }
        
        totalDeals++;
      });

      // Convert to array format
      const forecastArray: ForecastData[] = Object.entries(monthlyData)
        .map(([month, data]) => ({
          month,
          predicted: data.predicted,
          actual: data.actual,
          pipeline: data.pipeline,
          confidence: data.count > 0 ? Math.min(90, 50 + (data.count * 5)) : 50
        }))
        .reverse();

      setForecastData(forecastArray);

      // Calculate metrics
      const totalPredicted = forecastArray.reduce((sum, item) => sum + item.predicted, 0);
      const totalActual = forecastArray.reduce((sum, item) => sum + item.actual, 0);
      const accuracy = totalPredicted > 0 ? (totalActual / totalPredicted) * 100 : 0;
      const conversionRate = totalDeals > 0 ? (wonDeals / totalDeals) * 100 : 0;
      const avgDealSize = wonDeals > 0 ? totalRevenue / wonDeals : 0;

      setMetrics({
        totalPredicted,
        totalActual,
        accuracy: Math.min(100, accuracy),
        pipelineValue: totalPipeline,
        conversionRate,
        avgDealSize
      });

      console.log('Forecast data updated successfully');

    } catch (error) {
      if (!mountedRef.current) return;
      
      console.error('Erro ao buscar dados de previsão:', error);
      
      if (error.name !== 'AbortError') {
        setHasError(true);
        toast.error('Erro ao carregar dados de previsão');
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [hasError]);

  useEffect(() => {
    mountedRef.current = true;
    fetchForecastData();

    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    forecastData,
    metrics,
    isLoading,
    hasError,
    refetch: fetchForecastData
  };
};
