import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WeeklyDataItem {
  week: string;
  revenue: number;
  target: number;
}

interface PipelineDistributionItem {
  name: string;
  value: number;
  color: string;
}

interface DashboardData {
  totalRevenue: number;
  qualifiedLeads: number;
  conversionRate: number;
  pipelineValue: number;
  weeklyData: WeeklyDataItem[];
  pipelineDistribution: PipelineDistributionItem[];
}

export const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalRevenue: 0,
    qualifiedLeads: 0,
    conversionRate: 0,
    pipelineValue: 0,
    weeklyData: [],
    pipelineDistribution: []
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      console.log('Fetching dashboard data...');
      setIsLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log('No session found');
        setIsLoading(false);
        return;
      }

      // Buscar oportunidades - sem usar funções agregadas na query
      const { data: opportunities, error: oppError } = await supabase
        .from('opportunities')
        .select('id, name, amount, stage, created_at, owner_id');

      if (oppError) {
        console.error('Erro ao buscar oportunidades:', oppError);
        toast.error(`Erro ao buscar oportunidades: ${oppError.message}`);
        // Continue mesmo com erro para não bloquear o dashboard
      }

      // Buscar contas
      const { data: accounts, error: accError } = await supabase
        .from('accounts')
        .select('id, name, industry');

      if (accError) {
        console.error('Erro ao buscar contas:', accError);
        toast.error(`Erro ao buscar contas: ${accError.message}`);
      }

      // Buscar contactos
      const { data: contacts, error: contError } = await supabase
        .from('contacts')
        .select('id, first_name, last_name, account_id');

      if (contError) {
        console.error('Erro ao buscar contactos:', contError);
        toast.error(`Erro ao buscar contactos: ${contError.message}`);
      }

      console.log('Data fetched:', { 
        opportunities: opportunities?.length || 0,
        accounts: accounts?.length || 0,
        contacts: contacts?.length || 0
      });

      // Calcular métricas baseadas nos dados reais
      const totalRevenue = (opportunities || [])
        .filter(opp => opp.stage === 'closed_won')
        .reduce((sum, opp) => sum + (opp.amount || 0), 0);

      const qualifiedLeads = (opportunities || [])
        .filter(opp => opp.stage === 'qualified').length;

      const totalOpportunities = (opportunities || []).length;
      const closedWonOpportunities = (opportunities || [])
        .filter(opp => opp.stage === 'closed_won').length;

      const conversionRate = totalOpportunities > 0 
        ? Math.round((closedWonOpportunities / totalOpportunities) * 100)
        : 0;

      const pipelineValue = (opportunities || [])
        .filter(opp => opp.stage !== 'closed_won' && opp.stage !== 'closed_lost')
        .reduce((sum, opp) => sum + (opp.amount || 0), 0);

      // Dados semanais baseados nas oportunidades criadas
      const now = new Date();
      const weeklyData: WeeklyDataItem[] = [];
      
      for (let i = 6; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - (i * 7));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        const weekOpportunities = (opportunities || []).filter(opp => {
          const oppDate = new Date(opp.created_at);
          return oppDate >= weekStart && oppDate <= weekEnd && opp.stage === 'closed_won';
        });
        
        const weekRevenue = weekOpportunities.reduce((sum, opp) => sum + (opp.amount || 0), 0);
        
        weeklyData.push({
          week: `Sem ${7-i}`,
          revenue: weekRevenue,
          target: Math.max(totalRevenue / 7, 1000)
        });
      }

      // Distribuição do pipeline baseada nos dados reais
      const stageGroups: Record<string, number> = {
        lead: 0,
        qualified: 0,
        proposal: 0,
        negotiation: 0
      };

      (opportunities || []).forEach(opp => {
        if (opp.stage !== 'closed_won' && opp.stage !== 'closed_lost' && 
            Object.prototype.hasOwnProperty.call(stageGroups, opp.stage)) {
          stageGroups[opp.stage] += opp.amount || 0;
        }
      });

      const pipelineDistribution: PipelineDistributionItem[] = [
        { name: 'Lead', value: stageGroups.lead, color: '#8884d8' },
        { name: 'Qualificado', value: stageGroups.qualified, color: '#82ca9d' },
        { name: 'Proposta', value: stageGroups.proposal, color: '#ffc658' },
        { name: 'Negociação', value: stageGroups.negotiation, color: '#ff7300' }
      ].filter(item => item.value > 0);

      setDashboardData({
        totalRevenue,
        qualifiedLeads,
        conversionRate,
        pipelineValue,
        weeklyData,
        pipelineDistribution
      });

      console.log('Dashboard data updated successfully:', {
        totalRevenue,
        qualifiedLeads,
        conversionRate,
        pipelineValue
      });

    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    dashboardData,
    isLoading,
    refetch: fetchDashboardData
  };
};
