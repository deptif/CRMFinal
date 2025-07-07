
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  LineChart,
  Target,
  Users,
  DollarSign,
  Calendar,
  Download,
  Filter,
  Brain,
  Zap
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts';
import { useOpenAI } from '@/hooks/useOpenAI';

export const AdvancedAnalytics = () => {
  const { generateInsights, isLoading } = useOpenAI();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [aiInsights, setAiInsights] = useState<string>('');

  // Sample data
  const salesFunnelData = [
    { name: 'Leads', value: 1000, fill: '#8884d8' },
    { name: 'Qualificados', value: 600, fill: '#83a6ed' },
    { name: 'Propostas', value: 200, fill: '#8dd1e1' },
    { name: 'Negociação', value: 100, fill: '#82ca9d' },
    { name: 'Fechados', value: 40, fill: '#ffc658' }
  ];

  const performanceData = [
    { month: 'Jan', revenue: 120000, deals: 45, forecast: 115000 },
    { month: 'Fev', revenue: 150000, deals: 52, forecast: 140000 },
    { month: 'Mar', revenue: 180000, deals: 48, forecast: 170000 },
    { month: 'Abr', revenue: 220000, deals: 61, forecast: 200000 },
    { month: 'Mai', revenue: 195000, deals: 55, forecast: 210000 },
    { month: 'Jun', revenue: 250000, deals: 67, forecast: 240000 }
  ];

  const teamPerformanceData = [
    { name: 'João Santos', deals: 24, revenue: 180000, target: 200000 },
    { name: 'Ana Silva', deals: 19, revenue: 156000, target: 150000 },
    { name: 'Maria Costa', deals: 31, revenue: 245000, target: 220000 },
    { name: 'Pedro Lima', deals: 16, revenue: 98000, target: 120000 }
  ];

  const channelData = [
    { name: 'Website', value: 35, color: '#0088FE' },
    { name: 'Referências', value: 28, color: '#00C49F' },
    { name: 'Social Media', value: 20, color: '#FFBB28' },
    { name: 'Email Marketing', value: 17, color: '#FF8042' }
  ];

  const generateAIInsights = async () => {
    try {
      const salesData = {
        totalRevenue: 1115000,
        dealsWon: 320,
        conversionRate: 4.2,
        averageDealSize: 3484,
        salesCycle: 45,
        topChannel: 'Website',
        topPerformer: 'Maria Costa',
        monthlyGrowth: 15.8
      };

      const insights = await generateInsights(salesData);
      setAiInsights(insights);
    } catch (error) {
      console.error('Erro ao gerar insights:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Avançado</h1>
          <p className="text-gray-600">Insights profundos com IA para decisões estratégicas</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={generateAIInsights} disabled={isLoading}>
            <Brain className="h-4 w-4 mr-2" />
            {isLoading ? 'Analisando...' : 'Gerar Insights IA'}
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* AI Insights */}
      {aiInsights && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800">
              <Brain className="h-5 w-5 mr-2" />
              Insights Gerados por IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap text-blue-900">{aiInsights}</div>
          </CardContent>
        </Card>
      )}

      {/* Advanced KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ARR (Receita Anual Recorrente)</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€2.4M</div>
            <p className="text-xs text-green-600">+18.2% vs ano anterior</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">LTV/CAC Ratio</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.8x</div>
            <p className="text-xs text-muted-foreground">Ideal: maior que 3.0x</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.1%</div>
            <p className="text-xs text-green-600">-0.5% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Velocity</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45 dias</div>
            <p className="text-xs text-green-600">-3 dias vs média</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="funnel">Funil de Vendas</TabsTrigger>
          <TabsTrigger value="team">Equipe</TabsTrigger>
          <TabsTrigger value="predictive">Preditivo</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Receita vs Previsão</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`€${value.toLocaleString()}`, '']} />
                    <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} name="Receita Real" />
                    <Line type="monotone" dataKey="forecast" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" name="Previsão" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Origem dos Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={channelData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {channelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Participação']} />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {channelData.map((item) => (
                    <div key={item.name} className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm">{item.name}: {item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="funnel">
          <Card>
            <CardHeader>
              <CardTitle>Funil de Vendas Detalhado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={400}>
                  <FunnelChart>
                    <Tooltip />
                    <Funnel
                      dataKey="value"
                      data={salesFunnelData}
                      isAnimationActive
                    >
                      <LabelList position="center" fill="#fff" stroke="none" />
                    </Funnel>
                  </FunnelChart>
                </ResponsiveContainer>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Taxas de Conversão</h3>
                  {salesFunnelData.map((stage, index) => {
                    const nextStage = salesFunnelData[index + 1];
                    const conversionRate = nextStage ? (nextStage.value / stage.value * 100).toFixed(1) : null;
                    
                    return (
                      <div key={stage.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{stage.name}</h4>
                          <p className="text-sm text-gray-600">{stage.value} leads</p>
                        </div>
                        {conversionRate && (
                          <Badge className="bg-blue-100 text-blue-800">
                            {conversionRate}% conversão
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Performance da Equipe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamPerformanceData.map((member) => {
                  const performancePercentage = (member.revenue / member.target * 100);
                  const isAboveTarget = performancePercentage >= 100;
                  
                  return (
                    <div key={member.name} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{member.name}</h3>
                        <Badge className={isAboveTarget ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                          {performancePercentage.toFixed(1)}% da meta
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Negócios Fechados</p>
                          <p className="font-medium">{member.deals}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Receita Gerada</p>
                          <p className="font-medium">€{member.revenue.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Meta</p>
                          <p className="font-medium">€{member.target.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${isAboveTarget ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${Math.min(performancePercentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictive">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  Previsão de Receita (IA)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-900">Próximos 30 dias</h3>
                    <p className="text-2xl font-bold text-blue-900">€285k</p>
                    <p className="text-sm text-blue-700">Confiança: 87%</p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-medium text-green-900">Próximos 90 dias</h3>
                    <p className="text-2xl font-bold text-green-900">€750k</p>
                    <p className="text-sm text-green-700">Confiança: 73%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Recomendações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                    <p className="text-sm font-medium">Foque em leads qualificados</p>
                    <p className="text-xs text-gray-600">Taxa de conversão 32% maior</p>
                  </div>
                  
                  <div className="p-3 border-l-4 border-green-500 bg-green-50">
                    <p className="text-sm font-medium">Aumente follow-ups</p>
                    <p className="text-xs text-gray-600">Pode aumentar fechamentos em 15%</p>
                  </div>
                  
                  <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50">
                    <p className="text-sm font-medium">Revise pipeline parado</p>
                    <p className="text-xs text-gray-600">€127k em oportunidades dormentes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
