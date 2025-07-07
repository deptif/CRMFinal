
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Target, 
  DollarSign, 
  BarChart3,
  Calendar,
  PieChart,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useForecastData } from '@/hooks/useForecastData';

export const ForecastPage = () => {
  const { forecastData, metrics, isLoading, hasError, refetch } = useForecastData();
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'quarterly'>('monthly');

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando previsões...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <TrendingUp className="h-12 w-12 mx-auto mb-4" />
            <p>Erro ao carregar previsões</p>
          </div>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-600';
    if (accuracy >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAccuracyBadge = (accuracy: number) => {
    if (accuracy >= 80) return <Badge className="bg-green-100 text-green-800">Excelente</Badge>;
    if (accuracy >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Boa</Badge>;
    return <Badge className="bg-red-100 text-red-800">Precisa Melhorar</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Previsões de Vendas</h1>
          <p className="text-gray-600">Análise preditiva e métricas de performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setSelectedPeriod('monthly')}
            variant={selectedPeriod === 'monthly' ? 'default' : 'outline'}
            size="sm"
          >
            Mensal
          </Button>
          <Button
            onClick={() => setSelectedPeriod('quarterly')}
            variant={selectedPeriod === 'quarterly' ? 'default' : 'outline'}
            size="sm"
          >
            Trimestral
          </Button>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Precisão da Previsão</p>
                <p className={`text-2xl font-bold ${getAccuracyColor(metrics.accuracy)}`}>
                  {metrics.accuracy.toFixed(1)}%
                </p>
              </div>
              <div className="flex flex-col items-end">
                <Target className="h-8 w-8 text-blue-600 mb-2" />
                {getAccuracyBadge(metrics.accuracy)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pipeline Atual</p>
                <p className="text-2xl font-bold text-purple-600">
                  €{metrics.pipelineValue.toLocaleString()}
                </p>
              </div>
              <PieChart className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-green-600">
                  {metrics.conversionRate.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Médio por Negócio</p>
                <p className="text-2xl font-bold text-orange-600">
                  €{metrics.avgDealSize.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Previsão vs Realizado */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Previsão vs Realizado
            </CardTitle>
          </CardHeader>
          <CardContent>
            {forecastData.length === 0 ? (
              <div className="h-[300px] flex flex-col items-center justify-center text-center">
                <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Sem dados de previsão</h3>
                <p className="text-gray-600">Dados aparecerão quando houver oportunidades</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`€${value.toLocaleString()}`, '']}
                    labelFormatter={(label) => `Mês: ${label}`}
                  />
                  <Bar dataKey="predicted" fill="#3b82f6" name="Previsto" />
                  <Bar dataKey="actual" fill="#10b981" name="Realizado" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Gráfico de Tendência */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Tendência de Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            {forecastData.length === 0 ? (
              <div className="h-[300px] flex flex-col items-center justify-center text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Pipeline em desenvolvimento</h3>
                <p className="text-gray-600">Gráfico aparecerá com mais dados</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`€${value.toLocaleString()}`, '']}
                    labelFormatter={(label) => `Mês: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pipeline" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    name="Pipeline"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Previsão"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Detalhes */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes por Período</CardTitle>
        </CardHeader>
        <CardContent>
          {forecastData.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum dado disponível</h3>
              <p className="text-gray-600">Crie oportunidades para ver as previsões</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Período</th>
                    <th className="text-right p-2">Previsto</th>
                    <th className="text-right p-2">Realizado</th>
                    <th className="text-right p-2">Pipeline</th>
                    <th className="text-right p-2">Confiança</th>
                  </tr>
                </thead>
                <tbody>
                  {forecastData.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">{item.month}</td>
                      <td className="p-2 text-right">€{item.predicted.toLocaleString()}</td>
                      <td className="p-2 text-right">€{item.actual.toLocaleString()}</td>
                      <td className="p-2 text-right">€{item.pipeline.toLocaleString()}</td>
                      <td className="p-2 text-right">
                        <Badge 
                          variant={item.confidence >= 80 ? "default" : item.confidence >= 60 ? "secondary" : "destructive"}
                        >
                          {item.confidence.toFixed(0)}%
                        </Badge>
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
