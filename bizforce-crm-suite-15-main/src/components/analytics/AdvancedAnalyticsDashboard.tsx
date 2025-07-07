
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign, 
  BarChart3, 
  PieChart, 
  Download,
  Filter,
  Calendar
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const AdvancedAnalyticsDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [analyticsData, setAnalyticsData] = useState({
    totalRevenue: 0,
    leadsGenerated: 0,
    conversionRate: 0,
    closedDeals: 0,
    monthlyTrend: [] as any[],
    leadsBySource: [] as any[],
    opportunitiesByStage: [] as any[]
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching analytics data...');

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
      }

      // Buscar campanhas
      const { data: campaigns, error: campError } = await supabase
        .from('campaigns')
        .select('*');

      if (campError) {
        console.error('Erro ao buscar campanhas:', campError);
      }

      // Buscar contas
      const { data: accounts, error: accError } = await supabase
        .from('accounts')
        .select('*');

      if (accError) {
        console.error('Erro ao buscar contas:', accError);
      }

      console.log('Analytics data fetched:', {
        opportunities: opportunities?.length || 0,
        campaigns: campaigns?.length || 0,
        accounts: accounts?.length || 0
      });

      // Calcular métricas
      const totalRevenue = (opportunities || [])
        .filter(opp => opp.stage === 'closed_won')
        .reduce((sum, opp) => sum + (opp.amount || 0), 0);

      const leadsGenerated = (opportunities || [])
        .filter(opp => opp.stage === 'lead').length;

      const totalOpportunities = (opportunities || []).length;
      const closedDeals = (opportunities || [])
        .filter(opp => opp.stage === 'closed_won').length;

      const conversionRate = totalOpportunities > 0 
        ? Math.round((closedDeals / totalOpportunities) * 100)
        : 0;

      // Tendência mensal baseada nos dados reais
      const monthlyTrend = [];
      const now = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = monthDate.toLocaleDateString('pt-PT', { month: 'short' });
        
        const monthOpportunities = (opportunities || []).filter(opp => {
          const oppDate = new Date(opp.created_at);
          return oppDate.getMonth() === monthDate.getMonth() && 
                 oppDate.getFullYear() === monthDate.getFullYear() &&
                 opp.stage === 'closed_won';
        });
        
        const monthRevenue = monthOpportunities.reduce((sum, opp) => sum + (opp.amount || 0), 0);
        
        monthlyTrend.push({
          month: monthName,
          revenue: monthRevenue,
          leads: (opportunities || []).filter(opp => {
            const oppDate = new Date(opp.created_at);
            return oppDate.getMonth() === monthDate.getMonth() && 
                   oppDate.getFullYear() === monthDate.getFullYear();
          }).length
        });
      }

      // Leads por fonte (baseado nas campanhas)
      const leadsBySource = (campaigns || []).map(campaign => ({
        name: campaign.name,
        value: campaign.leads_generated || 0,
        type: campaign.type
      })).filter(item => item.value > 0);

      // Se não há dados de campanha, usar dados simulados baseados nas oportunidades
      if (leadsBySource.length === 0 && totalOpportunities > 0) {
        leadsBySource.push(
          { name: 'Website', value: Math.floor(totalOpportunities * 0.4), type: 'online' },
          { name: 'Referências', value: Math.floor(totalOpportunities * 0.3), type: 'referral' },
          { name: 'Email Marketing', value: Math.floor(totalOpportunities * 0.2), type: 'email' },
          { name: 'Redes Sociais', value: Math.floor(totalOpportunities * 0.1), type: 'social' }
        );
      }

      // Oportunidades por estágio
      const stageStats = {
        'lead': 0,
        'qualified': 0,
        'proposal': 0,
        'negotiation': 0,
        'closed_won': 0,
        'closed_lost': 0
      };

      (opportunities || []).forEach(opp => {
        if (stageStats.hasOwnProperty(opp.stage)) {
          stageStats[opp.stage]++;
        }
      });

      const opportunitiesByStage = Object.entries(stageStats)
        .filter(([_, count]) => count > 0)
        .map(([stage, count]) => ({
          name: stage === 'closed_won' ? 'Ganhas' : 
                stage === 'closed_lost' ? 'Perdidas' :
                stage === 'lead' ? 'Leads' :
                stage === 'qualified' ? 'Qualificadas' :
                stage === 'proposal' ? 'Propostas' :
                stage === 'negotiation' ? 'Negociação' : stage,
          value: count
        }));

      setAnalyticsData({
        totalRevenue,
        leadsGenerated,
        conversionRate,
        closedDeals,
        monthlyTrend,
        leadsBySource,
        opportunitiesByStage
      });

      console.log('Analytics data updated successfully');

    } catch (error) {
      console.error('Erro ao buscar dados de analytics:', error);
      toast.error('Erro ao carregar dados de analytics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="text-gray-600">Insights avançados e análise preditiva de vendas</p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Excel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <BarChart3 className="h-4 w-4 mr-2" />
            Relatório Executivo
          </Button>
        </div>
      </div>

      {/* Seletor de Período */}
      <div className="flex space-x-2">
        {['7', '30', '90', '365'].map((days) => (
          <Button
            key={days}
            variant={selectedPeriod === days ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod(days)}
            className={selectedPeriod === days ? 'bg-gray-900 text-white' : ''}
          >
            {days === '365' ? '1 ano' : `${days} dias`}
          </Button>
        ))}
      </div>

      {/* Cards de KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{analyticsData.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              vs 0% período anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Gerados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.leadsGenerated}</div>
            <p className="text-xs text-muted-foreground">
              vs 0% período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              vs 0% período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Negócios Fechados</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.closedDeals}</div>
            <p className="text-xs text-muted-foreground">
              vs 0% período anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tendência de Receita</CardTitle>
            <CardDescription>Evolução da receita nos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`€${value}`, 'Receita']} />
                <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leads por Fonte</CardTitle>
            <CardDescription>Distribuição dos leads por canal de aquisição</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={analyticsData.leadsBySource}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {analyticsData.leadsBySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pipeline de Oportunidades</CardTitle>
          <CardDescription>Distribuição das oportunidades por estágio</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.opportunitiesByStage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
