
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Target,
  Lightbulb,
  Zap,
  Heart,
  DollarSign,
  Users,
  Clock,
  Star,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';

interface AIInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'recommendation' | 'prediction';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  category: 'sales' | 'marketing' | 'customer_success' | 'operations';
  action_required: boolean;
  related_records: string[];
  created_at: Date;
}

interface SentimentAnalysis {
  id: string;
  record_type: 'email' | 'call' | 'meeting' | 'note';
  record_id: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: number;
  keywords: string[];
  summary: string;
}

interface PredictiveModel {
  id: string;
  name: string;
  type: 'churn_prediction' | 'upsell_probability' | 'deal_closure' | 'lead_scoring';
  accuracy: number;
  last_trained: Date;
  predictions_count: number;
}

// Mock data until Supabase tables are created
const mockInsights: AIInsight[] = [
  {
    id: '1',
    type: 'opportunity',
    title: 'High-Value Upsell Opportunity Detected',
    description: 'Customer showing increased engagement and usage patterns suggest readiness for premium upgrade',
    confidence: 87,
    impact: 'high',
    category: 'sales',
    action_required: true,
    related_records: ['acc_1', 'opp_2'],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24)
  },
  {
    id: '2',
    type: 'risk',
    title: 'Churn Risk Identified',
    description: 'Declining activity pattern detected for key account - immediate attention recommended',
    confidence: 92,
    impact: 'high',
    category: 'customer_success',
    action_required: true,
    related_records: ['acc_5'],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48)
  },
  {
    id: '3',
    type: 'recommendation',
    title: 'Optimize Follow-up Timing',
    description: 'Data suggests best response rates occur 2-3 days after initial contact',
    confidence: 78,
    impact: 'medium',
    category: 'marketing',
    action_required: false,
    related_records: [],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72)
  }
];

const mockSentimentData: SentimentAnalysis[] = [
  {
    id: '1',
    record_type: 'email',
    record_id: 'email_1',
    sentiment: 'positive',
    confidence: 85,
    keywords: ['satisfied', 'excellent', 'recommend'],
    summary: 'Customer expresses high satisfaction with recent service'
  },
  {
    id: '2',
    record_type: 'call',
    record_id: 'call_2',
    sentiment: 'negative',
    confidence: 91,
    keywords: ['frustrated', 'delayed', 'issues'],
    summary: 'Customer frustrated with project delays and technical issues'
  },
  {
    id: '3',
    record_type: 'meeting',
    record_id: 'meeting_3',
    sentiment: 'neutral',
    confidence: 72,
    keywords: ['information', 'questions', 'clarification'],
    summary: 'Information gathering session with neutral tone'
  }
];

const mockModels: PredictiveModel[] = [
  {
    id: '1',
    name: 'Customer Churn Predictor',
    type: 'churn_prediction',
    accuracy: 89,
    last_trained: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    predictions_count: 1247
  },
  {
    id: '2',
    name: 'Upsell Probability Engine',
    type: 'upsell_probability',
    accuracy: 76,
    last_trained: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    predictions_count: 892
  },
  {
    id: '3',
    name: 'Deal Closure Forecast',
    type: 'deal_closure',
    accuracy: 84,
    last_trained: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    predictions_count: 356
  }
];

export const IntelligentInsights = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentAnalysis[]>([]);
  const [models, setModels] = useState<PredictiveModel[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    activeInsights: 0,
    averageAccuracy: 0,
    pendingActions: 0,
    roiValue: 0,
    positiveSentiment: 0,
    neutralSentiment: 0,
    negativeSentiment: 0
  });

  useEffect(() => {
    loadInsights();
    loadSentimentData();
    loadModels();
    loadMetrics();
  }, []);

  const loadInsights = async () => {
    try {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setInsights(mockInsights);
    } catch (error) {
      console.error('Erro ao carregar insights:', error);
      toast.error('Erro ao carregar insights');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSentimentData = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setSentimentData(mockSentimentData);
    } catch (error) {
      console.error('Erro ao carregar sentiment data:', error);
      toast.error('Erro ao carregar análise de sentimento');
    }
  };

  const loadModels = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setModels(mockModels);
    } catch (error) {
      console.error('Erro ao carregar modelos:', error);
      toast.error('Erro ao carregar modelos preditivos');
    }
  };

  const loadMetrics = async () => {
    try {
      setIsLoading(true);

      // Calculate metrics from mock data
      const activeInsights = mockInsights.length;
      const pendingActions = mockInsights.filter(i => i.action_required).length;
      const averageAccuracy = mockModels.reduce((sum, model) => sum + model.accuracy, 0) / mockModels.length;
      const roiValue = activeInsights * 1000; // €1000 per insight

      const sentimentStats = mockSentimentData.reduce((acc, item) => {
        acc[item.sentiment]++;
        return acc;
      }, { positive: 0, neutral: 0, negative: 0 });

      setMetrics({
        activeInsights,
        averageAccuracy: Math.round(averageAccuracy),
        pendingActions,
        roiValue,
        positiveSentiment: sentimentStats.positive,
        neutralSentiment: sentimentStats.neutral,
        negativeSentiment: sentimentStats.negative
      });
    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImplementAction = async (insightId: string) => {
    try {
      setInsights(prev => prev.map(insight => 
        insight.id === insightId ? { ...insight, action_required: false } : insight
      ));

      toast.success('Ação implementada com sucesso!');
      loadMetrics();
    } catch (error) {
      console.error('Erro ao implementar ação:', error);
      toast.error('Erro ao implementar ação');
    }
  };

  const generateNewInsights = async () => {
    try {
      toast.info('Gerando novos insights com IA...');
      
      // Simulate AI insight generation
      const newInsight: AIInsight = {
        id: String(Date.now()),
        type: 'opportunity',
        title: 'Nova Oportunidade de Cross-sell Identificada',
        description: 'Cliente com padrão de compra similar a outros que expandiram seus contratos',
        confidence: 85,
        impact: 'high',
        category: 'sales',
        action_required: true,
        related_records: [],
        created_at: new Date()
      };

      setInsights(prev => [newInsight, ...prev]);
      toast.success('Novos insights gerados!');
      loadMetrics();
    } catch (error) {
      console.error('Erro ao gerar insights:', error);
      toast.error('Erro ao gerar insights');
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return Target;
      case 'risk': return AlertTriangle;
      case 'recommendation': return Lightbulb;
      case 'prediction': return Brain;
      default: return Zap;
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

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <Heart className="h-4 w-4 text-green-600" />;
      case 'negative': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredInsights = selectedCategory === 'all' 
    ? insights 
    : insights.filter(insight => insight.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Intelligent Insights</h1>
          <p className="text-gray-600 dark:text-gray-400">IA contextual e analytics preditivos</p>
        </div>
        <Button 
          className="bg-purple-600 hover:bg-purple-700"
          onClick={generateNewInsights}
        >
          <Brain className="h-4 w-4 mr-2" />
          Gerar Insights
        </Button>
      </div>

      {/* AI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Insights Ativos</CardTitle>
            <Brain className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeInsights}</div>
            <p className="text-xs text-muted-foreground">Gerados por IA</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precisão Média</CardTitle>
            <Target className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageAccuracy}%</div>
            <p className="text-xs text-muted-foreground">Modelos ML</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ações Sugeridas</CardTitle>
            <Lightbulb className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pendingActions}</div>
            <p className="text-xs text-muted-foreground">Pendentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI Insights</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{metrics.roiValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Valor gerado</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Filters */}
      <div className="flex space-x-2">
        {['all', 'sales', 'marketing', 'customer_success', 'operations'].map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category === 'all' ? 'Todos' : category.replace('_', ' ').toUpperCase()}
          </Button>
        ))}
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights Inteligentes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Carregando insights...</p>
            </div>
          ) : filteredInsights.length === 0 ? (
            <div className="text-center py-12">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {selectedCategory === 'all' ? 'Nenhum insight disponível' : 'Nenhum insight nesta categoria'}
              </h3>
              <p className="text-gray-600">
                {selectedCategory === 'all' 
                  ? 'Clique em "Gerar Insights" para começar a análise inteligente'
                  : 'Tente selecionar uma categoria diferente ou gere novos insights'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInsights.map((insight) => {
                const Icon = getInsightIcon(insight.type);
                return (
                  <div key={insight.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Icon className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{insight.title}</h3>
                          <p className="text-gray-600 text-sm">{insight.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getImpactColor(insight.impact)}>
                          {insight.impact.toUpperCase()}
                        </Badge>
                        {insight.action_required && (
                          <Badge variant="outline" className="bg-orange-50 text-orange-700">
                            AÇÃO NECESSÁRIA
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">{insight.confidence}% confiança</span>
                        </div>
                        <Badge variant="outline">{insight.category}</Badge>
                        <span className="text-sm text-gray-500">
                          {insight.created_at.toLocaleDateString('pt-PT')}
                        </span>
                      </div>
                      {insight.action_required && (
                        <Button 
                          size="sm" 
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={() => handleImplementAction(insight.id)}
                        >
                          Implementar
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

      {/* Sentiment Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Análise de Sentimento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg bg-green-50">
              <Heart className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{metrics.positiveSentiment}</div>
              <div className="text-sm text-gray-600">Positivos</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-gray-50">
              <Clock className="h-8 w-8 text-gray-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-600">{metrics.neutralSentiment}</div>
              <div className="text-sm text-gray-600">Neutros</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-red-50">
              <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">{metrics.negativeSentiment}</div>
              <div className="text-sm text-gray-600">Negativos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Predictive Models */}
      <Card>
        <CardHeader>
          <CardTitle>Modelos Preditivos</CardTitle>
        </CardHeader>
        <CardContent>
          {models.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum modelo treinado</h3>
              <p className="text-gray-600">Os modelos preditivos aparecerão quando forem criados no sistema</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {models.map((model) => (
                <div key={model.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{model.name}</h3>
                    <Badge variant="outline">{model.type.replace('_', ' ')}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Precisão</span>
                      <span className="text-sm font-medium">{model.accuracy}%</span>
                    </div>
                    <Progress value={model.accuracy} className="h-2" />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Última atualização: {model.last_trained.toLocaleDateString('pt-PT')}</span>
                      <span>{model.predictions_count} previsões</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
