
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, Users, DollarSign, Award, Calendar, Loader2 } from 'lucide-react';
import { QuotaModal } from './QuotaModal';
import { useSupabaseOpportunities } from '@/hooks/useSupabaseOpportunities';
import { useSupabaseQuotas, QuotaData } from '@/hooks/useSupabaseQuotas';

export const SalesPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Q4 2024');
  const [isQuotaModalOpen, setIsQuotaModalOpen] = useState(false);
  const { opportunities, isLoading } = useSupabaseOpportunities();
  const { quotas, createQuota, isLoading: quotasLoading } = useSupabaseQuotas();

  // Calcular KPIs baseados nas oportunidades reais
  const totalRevenue = opportunities
    .filter(opp => opp.stage === 'closed_won')
    .reduce((sum, opp) => sum + opp.amount, 0);

  const pipelineValue = opportunities
    .filter(opp => !['closed_won', 'closed_lost'].includes(opp.stage))
    .reduce((sum, opp) => sum + opp.amount, 0);

  const avgDealSize = opportunities.length > 0 
    ? opportunities.reduce((sum, opp) => sum + opp.amount, 0) / opportunities.length 
    : 0;

  const totalOpportunities = opportunities.length;
  const wonOpportunities = opportunities.filter(opp => opp.stage === 'closed_won').length;
  const winRate = totalOpportunities > 0 ? (wonOpportunities / totalOpportunities) * 100 : 0;

  // Dados para gráficos baseados em oportunidades reais
  const pipelineData = [
    { 
      name: 'Lead', 
      value: opportunities.filter(opp => opp.stage === 'lead').length, 
      amount: opportunities.filter(opp => opp.stage === 'lead').reduce((sum, opp) => sum + opp.amount, 0),
      color: '#6B7280' 
    },
    { 
      name: 'Qualificado', 
      value: opportunities.filter(opp => opp.stage === 'qualified').length,
      amount: opportunities.filter(opp => opp.stage === 'qualified').reduce((sum, opp) => sum + opp.amount, 0),
      color: '#3B82F6' 
    },
    { 
      name: 'Proposta', 
      value: opportunities.filter(opp => opp.stage === 'proposal').length,
      amount: opportunities.filter(opp => opp.stage === 'proposal').reduce((sum, opp) => sum + opp.amount, 0),
      color: '#F59E0B' 
    },
    { 
      name: 'Negociação', 
      value: opportunities.filter(opp => opp.stage === 'negotiation').length,
      amount: opportunities.filter(opp => opp.stage === 'negotiation').reduce((sum, opp) => sum + opp.amount, 0),
      color: '#F97316' 
    },
    { 
      name: 'Fechado', 
      value: opportunities.filter(opp => opp.stage === 'closed_won').length,
      amount: opportunities.filter(opp => opp.stage === 'closed_won').reduce((sum, opp) => sum + opp.amount, 0),
      color: '#10B981' 
    }
  ];

  // Dados de região baseados nas oportunidades reais (distribuição simulada)
  const regionData = [
    { 
      name: 'Norte', 
      vendas: Math.round(totalRevenue * 0.4), 
      meta: 100000,
      oportunidades: Math.round(opportunities.length * 0.4)
    },
    { 
      name: 'Centro', 
      vendas: Math.round(totalRevenue * 0.35), 
      meta: 80000,
      oportunidades: Math.round(opportunities.length * 0.35)
    },
    { 
      name: 'Sul', 
      vendas: Math.round(totalRevenue * 0.25), 
      meta: 70000,
      oportunidades: Math.round(opportunities.length * 0.25)
    }
  ];

  const handleCreateQuota = async (newQuota: Omit<QuotaData, 'id' | 'created_at'>) => {
    await createQuota(newQuota);
  };

  const getQuotaColor = (percentage: number) => {
    if (percentage >= 100) return 'text-green-600';
    if (percentage >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQuotaBadge = (percentage: number) => {
    if (percentage >= 100) return <Badge className="bg-green-100 text-green-800">Atingida</Badge>;
    if (percentage >= 80) return <Badge className="bg-yellow-100 text-yellow-800">Próxima</Badge>;
    return <Badge className="bg-red-100 text-red-800">Baixa</Badge>;
  };

  if (isLoading || quotasLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando dados de vendas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Centro de Vendas</h1>
          <p className="text-gray-600">Gerencie performance, quotas e territórios de vendas</p>
        </div>
        <div className="flex space-x-2">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="Q4 2024">Q4 2024</option>
            <option value="Q3 2024">Q3 2024</option>
            <option value="Q2 2024">Q2 2024</option>
          </select>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setIsQuotaModalOpen(true)}
          >
            <Target className="mr-2 h-4 w-4" />
            Definir Quotas
          </Button>
        </div>
      </div>

      {/* Cards de KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{winRate.toFixed(1)}% taxa de conversão
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{pipelineValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {opportunities.filter(opp => !['closed_won', 'closed_lost'].includes(opp.stage)).length} oportunidades ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deal Size Médio</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{Math.round(avgDealSize).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Por oportunidade</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{winRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{wonOpportunities} de {totalOpportunities} deals fechados</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="quotas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="quotas">Quotas Individuais</TabsTrigger>
          <TabsTrigger value="regions">Performance por Região</TabsTrigger>
          <TabsTrigger value="pipeline">Análise do Pipeline</TabsTrigger>
        </TabsList>

        <TabsContent value="quotas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quotas da Equipe - {selectedPeriod}</CardTitle>
              <CardDescription>Acompanhe o progresso individual das quotas de vendas</CardDescription>
            </CardHeader>
            <CardContent>
              {quotas.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma quota definida</h3>
                  <p className="text-gray-600">Defina quotas para sua equipe de vendas</p>
                  <Button 
                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                    onClick={() => setIsQuotaModalOpen(true)}
                  >
                    <Target className="mr-2 h-4 w-4" />
                    Definir Primeira Quota
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {quotas.map((quota, index) => {
                    const progress = quota.quota_amount > 0 ? (quota.achieved_amount / quota.quota_amount) * 100 : 0;
                    const currentAmount = quota.achieved_amount;
                    
                    return (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-900">{quota.user_name}</p>
                            <div className="flex items-center space-x-2">
                              {getQuotaBadge(progress)}
                             <span className={`text-sm font-semibold ${getQuotaColor(progress)}`}>
                                {progress.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                            <span>€{currentAmount.toLocaleString()} / €{quota.quota_amount.toLocaleString()}</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regions">
          <Card>
            <CardHeader>
              <CardTitle>Performance por Região</CardTitle>
              <CardDescription>Vendas vs metas por território</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={regionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      `€${Number(value).toLocaleString()}`, 
                      name === 'vendas' ? 'Vendas' : 'Meta'
                    ]} 
                  />
                  <Bar dataKey="vendas" fill="#3b82f6" name="Vendas" />
                  <Bar dataKey="meta" fill="#e5e7eb" name="Meta" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição do Pipeline</CardTitle>
              <CardDescription>Oportunidades por estágio do funil</CardDescription>
            </CardHeader>
            <CardContent>
              {pipelineData.some(item => item.value > 0) ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-4">Por Quantidade</h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={pipelineData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pipelineData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-4">Por Valor (€)</h4>
                    <div className="space-y-3">
                      {pipelineData.map((stage, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-4 h-4 rounded" 
                              style={{ backgroundColor: stage.color }}
                            />
                            <span className="font-medium">{stage.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">€{stage.amount.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">{stage.value} oportunidades</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Pipeline vazio</h3>
                  <p className="text-gray-600">Adicione oportunidades para visualizar o pipeline</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <QuotaModal
        isOpen={isQuotaModalOpen}
        onClose={() => setIsQuotaModalOpen(false)}
        onSave={handleCreateQuota}
      />
    </div>
  );
};
