
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Download,
  Users,
  DollarSign,
  Target,
  Calendar
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SalesMetrics {
  totalSales: number;
  leadsGenerated: number;
  conversionRate: number;
  pipelineValue: number;
}

interface ChartData {
  month: string;
  sales: number;
  target: number;
}

interface OpportunityStage {
  stage: string;
  count: number;
  value: number;
}

interface IndustryData {
  industry: string;
  accounts: number;
  value: number;
}

interface PerformanceData {
  user_name: string;
  deals_closed: number;
  revenue: number;
  quota: number;
  achievement: number;
}

export const ReportsPage = () => {
  const [salesMetrics, setSalesMetrics] = useState<SalesMetrics>({
    totalSales: 0,
    leadsGenerated: 0,
    conversionRate: 0,
    pipelineValue: 0
  });
  const [salesData, setSalesData] = useState<ChartData[]>([]);
  const [opportunityByStage, setOpportunityByStage] = useState<OpportunityStage[]>([]);
  const [industryData, setIndustryData] = useState<IndustryData[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        loadSalesMetrics(),
        loadSalesData(),
        loadOpportunityData(),
        loadIndustryData(),
        loadPerformanceData()
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados dos relatórios:', error);
      toast.error('Erro ao carregar dados dos relatórios');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSalesMetrics = async () => {
    try {
      // Total sales from closed won opportunities
      const { data: salesData, error: salesError } = await supabase
        .from('opportunities')
        .select('amount')
        .eq('stage', 'closed_won');

      if (salesError) throw salesError;

      const totalSales = salesData?.reduce((sum, opp) => sum + (opp.amount || 0), 0) || 0;

      // Total leads (opportunities in lead stage)
      const { data: leadsData, error: leadsError } = await supabase
        .from('opportunities')
        .select('id')
        .eq('stage', 'lead');

      if (leadsError) throw leadsError;

      const leadsGenerated = leadsData?.length || 0;

      // All opportunities for conversion rate
      const { data: allOpportunities, error: allError } = await supabase
        .from('opportunities')
        .select('stage');

      if (allError) throw allError;

      const totalOpportunities = allOpportunities?.length || 0;
      const wonOpportunities = allOpportunities?.filter(opp => opp.stage === 'closed_won').length || 0;
      const conversionRate = totalOpportunities > 0 ? (wonOpportunities / totalOpportunities) * 100 : 0;

      // Pipeline value (all open opportunities)
      const { data: pipelineData, error: pipelineError } = await supabase
        .from('opportunities')
        .select('amount')
        .not('stage', 'in', '("closed_won","closed_lost")');

      if (pipelineError) throw pipelineError;

      const pipelineValue = pipelineData?.reduce((sum, opp) => sum + (opp.amount || 0), 0) || 0;

      setSalesMetrics({
        totalSales,
        leadsGenerated,
        conversionRate: Math.round(conversionRate),
        pipelineValue
      });
    } catch (error) {
      console.error('Erro ao carregar métricas de vendas:', error);
    }
  };

  const loadSalesData = async () => {
    try {
      // Get sales data for the last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const { data, error } = await supabase
        .from('opportunities')
        .select('amount, close_date')
        .eq('stage', 'closed_won')
        .gte('close_date', sixMonthsAgo.toISOString())
        .order('close_date');

      if (error) throw error;

      // Group by month
      const monthlyData: { [key: string]: number } = {};
      data?.forEach(opp => {
        const month = new Date(opp.close_date).toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' });
        monthlyData[month] = (monthlyData[month] || 0) + (opp.amount || 0);
      });

      const chartData = Object.entries(monthlyData).map(([month, sales]) => ({
        month,
        sales,
        target: sales * 1.2 // 20% higher target for demo
      }));

      setSalesData(chartData);
    } catch (error) {
      console.error('Erro ao carregar dados de vendas:', error);
    }
  };

  const loadOpportunityData = async () => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('stage, amount');

      if (error) throw error;

      // Group by stage
      const stageData: { [key: string]: { count: number; value: number } } = {};
      data?.forEach(opp => {
        if (!stageData[opp.stage]) {
          stageData[opp.stage] = { count: 0, value: 0 };
        }
        stageData[opp.stage].count++;
        stageData[opp.stage].value += opp.amount || 0;
      });

      const opportunityStages = Object.entries(stageData).map(([stage, data]) => ({
        stage,
        count: data.count,
        value: data.value
      }));

      setOpportunityByStage(opportunityStages);
    } catch (error) {
      console.error('Erro ao carregar dados de oportunidades:', error);
    }
  };

  const loadIndustryData = async () => {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select(`
          industry,
          opportunities(amount)
        `);

      if (error) throw error;

      // Group by industry
      const industryStats: { [key: string]: { accounts: number; value: number } } = {};
      data?.forEach(account => {
        const industry = account.industry || 'Não especificado';
        if (!industryStats[industry]) {
          industryStats[industry] = { accounts: 0, value: 0 };
        }
        industryStats[industry].accounts++;
        
        // Sum opportunity values for this account
        if (account.opportunities) {
          account.opportunities.forEach((opp: any) => {
            industryStats[industry].value += opp.amount || 0;
          });
        }
      });

      const industryChartData = Object.entries(industryStats).map(([industry, stats]) => ({
        industry,
        accounts: stats.accounts,
        value: stats.value
      }));

      setIndustryData(industryChartData);
    } catch (error) {
      console.error('Erro ao carregar dados de indústria:', error);
    }
  };

  const loadPerformanceData = async () => {
    try {
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          opportunities(stage, amount)
        `);

      if (usersError) throw usersError;

      const performanceStats = users?.map(user => {
        const dealsWon = user.opportunities?.filter((opp: any) => opp.stage === 'closed_won') || [];
        const revenue = dealsWon.reduce((sum: number, opp: any) => sum + (opp.amount || 0), 0);
        const quota = 50000; // Default quota for demo
        const achievement = quota > 0 ? (revenue / quota) * 100 : 0;

        return {
          user_name: user.name || 'Sem nome',
          deals_closed: dealsWon.length,
          revenue,
          quota,
          achievement: Math.round(achievement)
        };
      }) || [];

      setPerformanceData(performanceStats.filter(stat => stat.deals_closed > 0));
    } catch (error) {
      console.error('Erro ao carregar dados de performance:', error);
    }
  };

  const exportReport = async () => {
    try {
      const reportData = {
        metrics: salesMetrics,
        salesData,
        opportunityByStage,
        industryData,
        performanceData,
        generatedAt: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-crm-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Relatório exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      toast.error('Erro ao exportar relatório');
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-gray-600">Análises e métricas de desempenho</p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Carregando dados dos relatórios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600">Análises e métricas de desempenho</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={exportReport}
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vendas Totais</p>
                <p className="text-3xl font-bold text-gray-900">€{salesMetrics.totalSales.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Oportunidades fechadas</p>
              </div>
              <DollarSign className="h-12 w-12 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Leads Gerados</p>
                <p className="text-3xl font-bold text-gray-900">{salesMetrics.leadsGenerated}</p>
                <p className="text-sm text-gray-500">Novos leads</p>
              </div>
              <Users className="h-12 w-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taxa Conversão</p>
                <p className="text-3xl font-bold text-gray-900">{salesMetrics.conversionRate}%</p>
                <p className="text-sm text-gray-500">Lead para fechamento</p>
              </div>
              <Target className="h-12 w-12 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pipeline Value</p>
                <p className="text-3xl font-bold text-gray-900">€{salesMetrics.pipelineValue.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Oportunidades abertas</p>
              </div>
              <BarChart3 className="h-12 w-12 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Vendas vs Metas - Últimos 6 Meses</CardTitle>
          </CardHeader>
          <CardContent>
            {salesData.length === 0 ? (
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum dado de vendas</h3>
                <p className="text-gray-600">Os dados aparecerão quando houver vendas registradas</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`€${Number(value).toLocaleString()}`, '']} />
                  <Line type="monotone" dataKey="sales" stroke="#2563eb" name="Vendas" />
                  <Line type="monotone" dataKey="target" stroke="#dc2626" strokeDasharray="5 5" name="Meta" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Oportunidades por Estágio</CardTitle>
          </CardHeader>
          <CardContent>
            {opportunityByStage.length === 0 ? (
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma oportunidade</h3>
                <p className="text-gray-600">Os dados aparecerão quando houver oportunidades criadas</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={opportunityByStage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" name="Quantidade" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Indústria</CardTitle>
          </CardHeader>
          <CardContent>
            {industryData.length === 0 ? (
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum dado de indústria</h3>
                <p className="text-gray-600">Os dados aparecerão quando houver contas categorizadas</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={industryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ industry, accounts }) => `${industry}: ${accounts}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="accounts"
                  >
                    {industryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance por Vendedor</CardTitle>
          </CardHeader>
          <CardContent>
            {performanceData.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum dado de performance</h3>
                <p className="text-gray-600">Os dados aparecerão quando houver atividade de vendas</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="user_name" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => {
                    if (name === 'revenue' || name === 'quota') {
                      return [`€${Number(value).toLocaleString()}`, name];
                    }
                    return [value, name];
                  }} />
                  <Bar dataKey="revenue" fill="#10b981" name="Receita" />
                  <Bar dataKey="quota" fill="#f59e0b" name="Quota" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo de Performance Individual</CardTitle>
        </CardHeader>
        <CardContent>
          {performanceData.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum dado de performance individual</h3>
              <p className="text-gray-600">A tabela será preenchida quando houver dados de vendedores</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Vendedor</th>
                    <th className="text-right py-2">Deals Fechados</th>
                    <th className="text-right py-2">Receita</th>
                    <th className="text-right py-2">Quota</th>
                    <th className="text-right py-2">% Atingimento</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceData.map((performer, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 font-medium">{performer.user_name}</td>
                      <td className="text-right py-2">{performer.deals_closed}</td>
                      <td className="text-right py-2">€{performer.revenue.toLocaleString()}</td>
                      <td className="text-right py-2">€{performer.quota.toLocaleString()}</td>
                      <td className="text-right py-2">
                        <span className={`px-2 py-1 rounded text-sm ${
                          performer.achievement >= 100 
                            ? 'bg-green-100 text-green-800' 
                            : performer.achievement >= 80 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {performer.achievement}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
