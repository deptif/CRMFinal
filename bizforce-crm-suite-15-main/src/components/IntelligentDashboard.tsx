import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  Users, 
  Target, 
  Activity,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const IntelligentDashboard = () => {
  const { dashboardData, isLoading, refetch } = useDashboardData();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando dados do dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard Inteligente</h2>
          <p className="text-gray-600">Insights em tempo real e ações sugeridas</p>
        </div>
        <div className="flex items-center space-x-2">
          {['7d', '30d', '90d'].map((period) => (
            <Button
              key={period}
              size="sm"
              variant={selectedPeriod === period ? "default" : "outline"}
              onClick={() => setSelectedPeriod(period)}
            >
              {period}
            </Button>
          ))}
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            className="ml-2"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Mensal</p>
                <p className="text-3xl font-bold text-gray-900">€{dashboardData.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Leads Qualificados</p>
                <p className="text-3xl font-bold text-gray-900">{dashboardData.qualifiedLeads}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa Conversão</p>
                <p className="text-3xl font-bold text-gray-900">{dashboardData.conversionRate}%</p>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pipeline Value</p>
                <p className="text-3xl font-bold text-gray-900">€{dashboardData.pipelineValue.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Semanal */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData.weeklyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `€${value.toLocaleString()}`} />
                  <Bar dataKey="revenue" fill="#3b82f6" name="Receita" />
                  <Bar dataKey="target" fill="#e5e7eb" name="Meta" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px]">
                <div className="text-center">
                  <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Nenhum dado disponível</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Distribuição do Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição do Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData.pipelineDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardData.pipelineDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={(entry) => entry.name}
                  >
                    {dashboardData.pipelineDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `€${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px]">
                <div className="text-center">
                  <Target className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Pipeline vazio</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 