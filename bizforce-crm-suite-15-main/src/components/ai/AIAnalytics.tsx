
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb,
  Target,
  Users,
  Mail,
  Calendar,
  Zap,
  MessageSquare,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from '@/hooks/use-toast';

interface AIInsight {
  id: string;
  type: 'prediction' | 'recommendation' | 'alert' | 'opportunity';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  category: string;
  action_required: boolean;
}

interface PredictionModel {
  id: string;
  name: string;
  description: string;
  accuracy: number;
  last_trained: Date;
  predictions_count: number;
}

export const AIAnalytics = () => {
  const { toast } = useToast();
  
  // TODO: Replace with actual database integration
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  // TODO: Replace with actual database integration
  const [models] = useState<PredictionModel[]>([]);

  // TODO: Replace with actual database integration
  const performanceData: any[] = [];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'prediction': return TrendingUp;
      case 'alert': return AlertTriangle;
      case 'recommendation': return Lightbulb;
      case 'opportunity': return Target;
      default: return Brain;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'prediction': return 'bg-blue-100 text-blue-800';
      case 'alert': return 'bg-red-100 text-red-800';
      case 'recommendation': return 'bg-yellow-100 text-yellow-800';
      case 'opportunity': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleGenerateInsights = async () => {
    setIsGeneratingInsights(true);
    
    toast({
      title: "Gerando Insights",
      description: "A IA está analisando os dados para gerar novos insights...",
    });

    // TODO: Replace with actual AI analysis from database
    setTimeout(() => {
      setIsGeneratingInsights(false);
      
      toast({
        title: "Nenhum dado disponível",
        description: "Conecte a base de dados para gerar insights.",
      });
    }, 2000);
  };

  const handleTakeAction = (insight: AIInsight) => {
    // TODO: Replace with actual action execution
    toast({
      title: "Executando Ação",
      description: `Processando ação para: ${insight.title}`,
    });

    setTimeout(() => {
      setInsights(prev => prev.filter(i => i.id !== insight.id));
      
      toast({
        title: "Ação Concluída",
        description: "Ação executada com sucesso.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Analytics</h1>
          <p className="text-gray-600">Insights inteligentes e análise preditiva</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-green-100 text-green-800">
            <Brain className="h-3 w-3 mr-1" />
            IA Ativa
          </Badge>
          <Button 
            onClick={handleGenerateInsights}
            disabled={isGeneratingInsights}
          >
            <Zap className="h-4 w-4 mr-2" />
            {isGeneratingInsights ? 'Gerando...' : 'Gerar Insights'}
          </Button>
        </div>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            Insights da IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          {insights.length === 0 ? (
            <div className="text-center py-12">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum insight disponível</h3>
              <p className="text-gray-600">A IA gerará insights quando houver dados suficientes para análise</p>
            </div>
          ) : (
            <div className="space-y-4">
              {insights.map((insight) => {
                const Icon = getInsightIcon(insight.type);
                return (
                  <div key={insight.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{insight.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className={getInsightColor(insight.type)}>
                          {insight.type === 'prediction' && 'Predição'}
                          {insight.type === 'alert' && 'Alerta'}
                          {insight.type === 'recommendation' && 'Recomendação'}
                          {insight.type === 'opportunity' && 'Oportunidade'}
                        </Badge>
                        <Badge className={getImpactColor(insight.impact)}>
                          Impacto {insight.impact === 'high' ? 'Alto' : insight.impact === 'medium' ? 'Médio' : 'Baixo'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Confiança:</span>
                          <Progress value={insight.confidence} className="w-20 h-2" />
                          <span className="text-sm font-medium">{insight.confidence}%</span>
                        </div>
                        <Badge variant="secondary">{insight.category}</Badge>
                      </div>
                      {insight.action_required && (
                        <Button 
                          size="sm"
                          onClick={() => handleTakeAction(insight)}
                        >
                          Tomar Ação
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prediction Models */}
        <Card>
          <CardHeader>
            <CardTitle>Modelos Preditivos</CardTitle>
          </CardHeader>
          <CardContent>
            {models.length === 0 ? (
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum modelo configurado</h3>
                <p className="text-gray-600">Os modelos preditivos serão exibidos quando configurados</p>
              </div>
            ) : (
              <div className="space-y-4">
                {models.map((model) => (
                  <div key={model.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{model.name}</h3>
                      <Badge className="bg-blue-100 text-blue-800">
                        {model.accuracy}% precisão
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{model.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{model.predictions_count} predições</span>
                      <span>Último treino: {model.last_trained.toLocaleDateString('pt-PT')}</span>
                    </div>
                    <Progress value={model.accuracy} className="mt-2 h-2" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Precisão das Predições</CardTitle>
          </CardHeader>
          <CardContent>
            {performanceData.length === 0 ? (
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum dado de performance</h3>
                <p className="text-gray-600">Os dados de precisão serão exibidos quando houver predições</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#3b82f6" 
                    strokeDasharray="5 5"
                    name="Predito"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#10b981" 
                    name="Real"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Capabilities */}
      <Card>
        <CardHeader>
          <CardTitle>Capacidades da IA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-medium mb-1">Lead Scoring</h3>
              <p className="text-sm text-gray-600">Classificação automática de leads</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-medium mb-1">Sales Forecasting</h3>
              <p className="text-sm text-gray-600">Previsão de vendas inteligente</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Mail className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-medium mb-1">Email Insights</h3>
              <p className="text-sm text-gray-600">Otimização de campanhas de email</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <h3 className="font-medium mb-1">Chatbot IA</h3>
              <p className="text-sm text-gray-600">Assistente virtual inteligente</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
