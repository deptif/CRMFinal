
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  DollarSign, 
  Target,
  Brain,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Users,
  BarChart3,
  LineChart,
  PieChart,
  Zap
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  Pie
} from 'recharts';
import { toast } from 'sonner';

interface RevenueInsight {
  id: string;
  type: 'prediction' | 'opportunity' | 'risk' | 'trend';
  title: string;
  description: string;
  impact: number;
  confidence: number;
  timeframe: string;
  actionable: boolean;
}

interface RevenueForecast {
  month: string;
  predicted: number;
  actual: number;
  confidence_min: number;
  confidence_max: number;
}

export const IntelligentRevenue = () => {
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  
  // Dados de exemplo para demonstração
  const revenueData: RevenueForecast[] = [
    { month: 'Jan', predicted: 125000, actual: 118000, confidence_min: 115000, confidence_max: 135000 },
    { month: 'Fev', predicted: 132000, actual: 128000, confidence_min: 120000, confidence_max: 145000 },
    { month: 'Mar', predicted: 145000, actual: 142000, confidence_min: 135000, confidence_max: 158000 },
    { month: 'Abr', predicted: 158000, actual: 155000, confidence_min: 148000, confidence_max: 172000 },
    { month: 'Mai', predicted: 172000, actual: 0, confidence_min: 160000, confidence_max: 185000 },
    { month: 'Jun', predicted: 185000, actual: 0, confidence_min: 170000, confidence_max: 200000 }
  ];

  const pipelineData = [
    { stage: 'Qualificação', value: 450000, count: 45 },
    { stage: 'Proposta', value: 320000, count: 28 },
    { stage: 'Negociação', value: 180000, count: 15 },
    { stage: 'Fechamento', value: 95000, count: 8 }
  ];

  const sourceData = [
    { name: 'Website', value: 35, color: '#3b82f6' },
    { name: 'LinkedIn', value: 28, color: '#8b5cf6' },
    { name: 'Referência', value: 22, color: '#10b981' },
    { name: 'Email', value: 15, color: '#f59e0b' }
  ];

  const [insights] = useState<RevenueInsight[]>([
    {
      id: '1',
      type: 'prediction',
      title: 'Receita Q2 acima do esperado',
      description: 'IA prevê crescimento de 15% na receita do Q2 baseado em padrões atuais',
      impact: 25000,
      confidence: 87,
      timeframe: '30 dias',
      actionable: true
    },
    {
      id: '2',
      type: 'opportunity',
      title: 'Oportunidade no setor tecnologia',
      description: 'Leads de tecnologia têm 40% maior probabilidade de conversão',
      impact: 18000,
      confidence: 92,
      timeframe: '60 dias',
      actionable: true
    },
    {
      id: '3',
      type: 'risk',
      title: 'Risco de churn em contas grandes',
      description: '3 contas grandes mostram sinais de baixo engagement',
      impact: -45000,
      confidence: 78,
      timeframe: '14 dias',
      actionable: true
    }
  ]);

  const generateInsights = async () => {
    setIsGeneratingInsights(true);
    
    toast.success('Gerando novos insights de receita...');
    
    setTimeout(() => {
      setIsGeneratingInsights(false);
      toast.success('Insights atualizados pela IA!');
    }, 2000);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'prediction': return <TrendingUp className="h-4 w-4" />;
      case 'opportunity': return <Target className="h-4 w-4" />;
      case 'risk': return <AlertTriangle className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'prediction': return 'bg-blue-100 text-blue-800';
      case 'opportunity': return 'bg-green-100 text-green-800';
      case 'risk': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalPipeline = pipelineData.reduce((acc, stage) => acc + stage.value, 0);
  const weightedProbability = 0.65; // Exemplo de probabilidade ponderada
  const forecastedRevenue = Math.round(totalPipeline * weightedProbability);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inteligência de Receita</h2>
          <p className="text-gray-600">Previsões e insights avançados de receita</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-green-100 text-green-800">
            <Brain className="h-3 w-3 mr-1" />
            IA Ativa
          </Badge>
          <Button onClick={generateInsights} disabled={isGeneratingInsights}>
            <Zap className="h-4 w-4 mr-2" />
            {isGeneratingInsights ? 'Gerando...' : 'Atualizar Insights'}
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pipeline Total</p>
                <p className="text-2xl font-bold text-blue-600">
                  €{(totalPipeline / 1000).toFixed(0)}K
                </p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Previsão Q2</p>
                <p className="text-2xl font-bold text-green-600">
                  €{(forecastedRevenue / 1000).toFixed(0)}K
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
                <p className="text-sm text-gray-600">Confiança IA</p>
                <p className="text-2xl font-bold text-purple-600">87%</p>
              </div>
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Crescimento</p>
                <p className="text-2xl font-bold text-orange-600">+15%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Forecast */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChart className="h-5 w-5 mr-2" />
              Previsão de Receita
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [`€${(value / 1000).toFixed(0)}K`, '']}
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Real"
                />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#3b82f6" 
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  name="Previsto"
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pipeline Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Análise do Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={pipelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [`€${(value / 1000).toFixed(0)}K`, '']}
                />
                <Bar dataKey="value" fill="#8b5cf6" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Insights & Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              Insights da IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.map((insight) => (
                <div key={insight.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg ${getInsightColor(insight.type)}`}>
                        {getInsightIcon(insight.type)}
                      </div>
                      <div>
                        <h3 className="font-medium">{insight.title}</h3>
                        <p className="text-sm text-gray-600">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm">
                        <span className="text-gray-600">Impacto: </span>
                        <span className={`font-bold ${insight.impact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          €{Math.abs(insight.impact).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Confiança: </span>
                        <span className="font-bold">{insight.confidence}%</span>
                      </div>
                    </div>
                    {insight.actionable && (
                      <Button size="sm" variant="outline">
                        Ação
                      </Button>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    <Progress value={insight.confidence} className="h-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lead Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Fontes de Receita
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-4">
              <ResponsiveContainer width="100%" height={200}>
                <RechartsPieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value}%`, '']} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2">
              {sourceData.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: source.color }}
                    />
                    <span className="text-sm">{source.name}</span>
                  </div>
                  <span className="text-sm font-medium">{source.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
