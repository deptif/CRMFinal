
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    qualifiedLeads: 0,
    conversionRate: 0,
    pipelineValue: 0,
    weeklyData: [] as any[],
    pipelineDistribution: [] as any[]
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

      // Buscar oportunidades
      const { data: opportunities, error: oppError } = await supabase
        .from('opportunities')
        .select('*');

      if (oppError) {
        console.error('Erro ao buscar oportunidades:', oppError);
        // Continue mesmo com erro para não bloquear o dashboard
      }

      // Buscar contas
      const { data: accounts, error: accError } = await supabase
        .from('accounts')
        .select('*');

      if (accError) {
        console.error('Erro ao buscar contas:', accError);
      }

      // Buscar contactos
      const { data: contacts, error: contError } = await supabase
        .from('contacts')
        .select('*');

      if (contError) {
        console.error('Erro ao buscar contactos:', contError);
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
      const weeklyData = [];
      
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
      const stageGroups = {
        lead: 0,
        qualified: 0,
        proposal: 0,
        negotiation: 0
      };

      (opportunities || []).forEach(opp => {
        if (opp.stage !== 'closed_won' && opp.stage !== 'closed_lost' && stageGroups.hasOwnProperty(opp.stage)) {
          stageGroups[opp.stage] += opp.amount || 0;
        }
      });

      const pipelineDistribution = [
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
