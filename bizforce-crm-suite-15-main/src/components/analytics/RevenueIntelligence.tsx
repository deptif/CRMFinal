
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Brain,
  Calendar,
  BarChart3
} from 'lucide-react';

export const RevenueIntelligence = () => {
  // TODO: Replace with actual database integration
  const [forecastData] = useState({
    currentMonth: {
      target: 0,
      achieved: 0,
      predicted: 0,
      confidence: 0
    },
    nextMonth: {
      target: 0,
      predicted: 0,
      confidence: 0
    },
    quarter: {
      target: 0,
      achieved: 0,
      predicted: 0,
      confidence: 0
    }
  });

  // TODO: Replace with actual database integration
  const [pipelineHealth] = useState([]);

  // TODO: Replace with actual database integration
  const [riskFactors] = useState([]);

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-red-600 bg-red-100';
    }
  };

  const getRiskColor = (type: string) => {
    switch (type) {
      case 'high_risk': return 'text-red-600 bg-red-100';
      case 'medium_risk': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Revenue Intelligence</h2>
          <p className="text-gray-600">Previsões de receita e análise preditiva</p>
        </div>
        <Badge className="bg-green-100 text-green-800">
          <Brain className="h-3 w-3 mr-1" />
          IA Preditiva
        </Badge>
      </div>

      {/* Forecast Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Este Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">{formatCurrency(forecastData.currentMonth.achieved)}</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {forecastData.currentMonth.target > 0 ? 
                    ((forecastData.currentMonth.achieved / forecastData.currentMonth.target) * 100).toFixed(0) : 0}%
                </Badge>
              </div>
              <Progress 
                value={forecastData.currentMonth.target > 0 ? 
                  (forecastData.currentMonth.achieved / forecastData.currentMonth.target) * 100 : 0} 
                className="h-2"
              />
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Meta:</span>
                  <span>{formatCurrency(forecastData.currentMonth.target)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Previsão IA:</span>
                  <span className="font-medium">{formatCurrency(forecastData.currentMonth.predicted)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Confiança:</span>
                  <span className="font-medium text-green-600">{forecastData.currentMonth.confidence}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Próximo Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">{formatCurrency(forecastData.nextMonth.predicted)}</span>
                <Badge className="bg-purple-100 text-purple-800">
                  Previsão
                </Badge>
              </div>
              <Progress 
                value={forecastData.nextMonth.target > 0 ? 
                  (forecastData.nextMonth.predicted / forecastData.nextMonth.target) * 100 : 0} 
                className="h-2"
              />
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Meta:</span>
                  <span>{formatCurrency(forecastData.nextMonth.target)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Confiança:</span>
                  <span className="font-medium text-yellow-600">{forecastData.nextMonth.confidence}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Trimestre</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">{formatCurrency(forecastData.quarter.achieved)}</span>
                <Badge className="bg-green-100 text-green-800">
                  {forecastData.quarter.target > 0 ? 
                    ((forecastData.quarter.achieved / forecastData.quarter.target) * 100).toFixed(0) : 0}%
                </Badge>
              </div>
              <Progress 
                value={forecastData.quarter.target > 0 ? 
                  (forecastData.quarter.achieved / forecastData.quarter.target) * 100 : 0} 
                className="h-2"
              />
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Meta:</span>
                  <span>{formatCurrency(forecastData.quarter.target)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Previsão:</span>
                  <span className="font-medium">{formatCurrency(forecastData.quarter.predicted)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Confiança:</span>
                  <span className="font-medium text-green-600">{forecastData.quarter.confidence}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pipeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pipeline">Pipeline Health</TabsTrigger>
          <TabsTrigger value="risks">Fatores de Risco</TabsTrigger>
          <TabsTrigger value="insights">Insights IA</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline">
          <Card>
            <CardHeader>
              <CardTitle>Saúde do Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              {pipelineHealth.length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum dado de pipeline</h3>
                  <p className="text-gray-600">Os dados do pipeline serão exibidos quando houver oportunidades</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pipelineHealth.map((stage, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{stage.stage}</h3>
                          <p className="text-sm text-gray-600">{stage.deals} deals • {formatCurrency(stage.value)}</p>
                        </div>
                        <Badge className={getHealthColor(stage.health)}>
                          {stage.health === 'excellent' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {stage.health === 'good' && <TrendingUp className="h-3 w-3 mr-1" />}
                          {stage.health === 'warning' && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {stage.health.charAt(0).toUpperCase() + stage.health.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Deal Médio</span>
                          <p className="font-medium">{formatCurrency(stage.avgDealSize)}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Conversão</span>
                          <p className="font-medium">{stage.conversionRate}%</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Duração Média</span>
                          <p className="font-medium">{stage.avgDuration} dias</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Status</span>
                          <Progress value={stage.conversionRate} className="h-1 mt-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Riscos</CardTitle>
            </CardHeader>
            <CardContent>
              {riskFactors.length === 0 ? (
                <div className="text-center py-12">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum fator de risco identificado</h3>
                  <p className="text-gray-600">A análise de riscos será exibida quando houver dados</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {riskFactors.map((risk, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{risk.title}</h3>
                        <Badge className={getRiskColor(risk.type)}>
                          {risk.impact} Risco
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-600">Quantidade</span>
                          <p className="font-medium">{risk.count} deals</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Valor</span>
                          <p className="font-medium">{formatCurrency(risk.value)}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Ação Recomendada</span>
                          <p className="font-medium text-blue-600">{risk.action}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>Insights da IA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum insight disponível</h3>
                <p className="text-gray-600">A IA gerará insights quando houver dados suficientes para análise</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
