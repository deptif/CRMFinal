
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  DollarSign,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ForecastData {
  period: string;
  bestCase: number;
  mostLikely: number;
  worstCase: number;
  actual?: number;
  confidence: number;
}

interface OpportunityForecast {
  id: string;
  name: string;
  amount: number;
  probability: number;
  stage: string;
  closeDate: Date;
  owner: string;
  territory: string;
  confidence: 'high' | 'medium' | 'low';
  risk: string[];
}

export const AdvancedForecasting = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('quarter');
  const [selectedTerritory, setSelectedTerritory] = useState('all');

  // TODO: Replace with actual database queries
  const forecastData: ForecastData[] = [];

  // TODO: Replace with actual database queries  
  const opportunityForecasts: OpportunityForecast[] = [];

  const getConfidenceBadge = (confidence: string) => {
    const config = {
      high: { color: 'bg-green-100 text-green-800', label: 'Alta' },
      medium: { color: 'bg-yellow-100 text-yellow-800', label: 'Média' },
      low: { color: 'bg-red-100 text-red-800', label: 'Baixa' }
    };
    const { color, label } = config[confidence as keyof typeof config];
    return <Badge className={color}>{label}</Badge>;
  };

  const getRiskLevel = (risks: string[]) => {
    if (risks.length === 0) return 'low';
    if (risks.length <= 1) return 'medium';
    return 'high';
  };

  const calculateWeightedPipeline = () => {
    return opportunityForecasts.reduce((sum, opp) => {
      return sum + (opp.amount * opp.probability / 100);
    }, 0);
  };

  // TODO: Replace with actual database queries
  const currentQuarterTarget = 0;
  const weightedPipeline = calculateWeightedPipeline();
  const commitForecast = 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Previsão Avançada de Vendas</h1>
          <p className="text-gray-600 dark:text-gray-400">Analytics preditivos e forecasting inteligente</p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Mensal</SelectItem>
              <SelectItem value="quarter">Trimestral</SelectItem>
              <SelectItem value="year">Anual</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedTerritory} onValueChange={setSelectedTerritory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Territórios</SelectItem>
              <SelectItem value="lisboa">Lisboa</SelectItem>
              <SelectItem value="porto">Porto</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Previsão Commit</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{commitForecast.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Próximo mês</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Ponderado</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{weightedPipeline.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Por probabilidade</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meta Trimestral</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{currentQuarterTarget.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">
              {currentQuarterTarget > 0 ? Math.round((weightedPipeline / currentQuarterTarget) * 100) : 0}% alcançado
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confiança IA</CardTitle>
            <Zap className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">Previsão modelo</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="forecast" className="space-y-4">
        <TabsList>
          <TabsTrigger value="forecast">Previsão</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="accuracy">Precisão</TabsTrigger>
        </TabsList>

        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Previsão de Vendas - Cenários</CardTitle>
            </CardHeader>
            <CardContent>
              {forecastData.length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum dado de previsão</h3>
                  <p className="text-gray-600">Os dados de forecasting aparecerão quando conectados à base de dados</p>
                </div>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={forecastData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis tickFormatter={(value) => `€${(value / 1000)}k`} />
                      <Tooltip formatter={(value) => [`€${Number(value).toLocaleString()}`, '']} />
                      <Line type="monotone" dataKey="bestCase" stroke="#10b981" strokeDasharray="5 5" name="Melhor Caso" />
                      <Line type="monotone" dataKey="mostLikely" stroke="#3b82f6" strokeWidth={3} name="Mais Provável" />
                      <Line type="monotone" dataKey="worstCase" stroke="#ef4444" strokeDasharray="5 5" name="Pior Caso" />
                      <Line type="monotone" dataKey="actual" stroke="#8b5cf6" strokeWidth={2} name="Real" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Melhor Caso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">€0</div>
                <p className="text-sm text-gray-600">Se todas oportunidades fecharem</p>
                <Progress value={0} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Target className="h-5 w-5 mr-2 text-blue-600" />
                  Mais Provável
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">€0</div>
                <p className="text-sm text-gray-600">Previsão baseada em IA</p>
                <Progress value={0} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                  Pior Caso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">€0</div>
                <p className="text-sm text-gray-600">Cenário conservador</p>
                <Progress value={0} className="mt-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Oportunidades Críticas</CardTitle>
            </CardHeader>
            <CardContent>
              {opportunityForecasts.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma oportunidade encontrada</h3>
                  <p className="text-gray-600">As oportunidades aparecerão quando conectadas à base de dados</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {opportunityForecasts.map((opp) => (
                    <div key={opp.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{opp.name}</h3>
                          <p className="text-sm text-gray-600">{opp.owner} • {opp.territory}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{opp.stage}</Badge>
                            {getConfidenceBadge(opp.confidence)}
                            <span className="text-sm text-gray-500">
                              Fecha: {opp.closeDate.toLocaleDateString('pt-PT')}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold">€{opp.amount.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">{opp.probability}% probabilidade</div>
                          <div className="text-sm font-medium text-green-600">
                            €{Math.round(opp.amount * opp.probability / 100).toLocaleString()} ponderado
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Probabilidade de Fechamento</span>
                          <span className="text-sm font-medium">{opp.probability}%</span>
                        </div>
                        <Progress value={opp.probability} className="h-2" />
                      </div>

                      {opp.risk.length > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm font-medium">Riscos Identificados:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {opp.risk.map((risk, index) => (
                              <Badge key={index} variant="outline" className="text-xs bg-yellow-50 text-yellow-700">
                                {risk}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accuracy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Precisão das Previsões</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum dado de precisão</h3>
                <p className="text-gray-600">Os dados de precisão aparecerão quando conectados à base de dados</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
