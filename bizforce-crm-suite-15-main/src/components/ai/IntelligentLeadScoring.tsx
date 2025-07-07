
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Star,
  Brain,
  Zap,
  Lightbulb,
  Users,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import { useOpenAI } from '@/hooks/useOpenAI';
import { toast } from 'sonner';

interface EnhancedLead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  industry: string;
  companySize: string;
  budget: string;
  timeline: string;
  score: number;
  aiScore: number;
  factors: string[];
  prediction: 'hot' | 'warm' | 'cold';
  conversionProbability: number;
  nextAction: string;
  aiInsights: string[];
  engagement: number;
  lastActivity: Date;
  responseTime: number;
}

export const IntelligentLeadScoring = () => {
  const [leads, setLeads] = useState<EnhancedLead[]>([]);
  const [selectedLead, setSelectedLead] = useState<EnhancedLead | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const { scoreLead, generateInsights, isLoading } = useOpenAI();

  // Gerar leads de exemplo com dados mais realistas
  useEffect(() => {
    const sampleLeads: EnhancedLead[] = [
      {
        id: '1',
        name: 'João Silva',
        company: 'Tech Solutions Ltd',
        email: 'joao@techsolutions.com',
        phone: '+351 912 345 678',
        source: 'Website',
        industry: 'Tecnologia',
        companySize: '50-200',
        budget: '€10,000-€25,000',
        timeline: '1-3 meses',
        score: 85,
        aiScore: 92,
        factors: ['Budget Alto', 'Timeline Curto', 'Engagement Alto'],
        prediction: 'hot',
        conversionProbability: 87,
        nextAction: 'Agendar demo técnica',
        aiInsights: ['Empresa em crescimento rápido', 'Decisor técnico envolvido'],
        engagement: 90,
        lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        responseTime: 2
      },
      {
        id: '2',
        name: 'Maria Santos',
        company: 'Retail Corp',
        email: 'maria@retailcorp.pt',
        phone: '+351 923 456 789',
        source: 'LinkedIn',
        industry: 'Retalho',
        companySize: '200-500',
        budget: '€5,000-€15,000',
        timeline: '3-6 meses',
        score: 72,
        aiScore: 78,
        factors: ['Empresa Estabelecida', 'Múltiplos Contactos'],
        prediction: 'warm',
        conversionProbability: 65,
        nextAction: 'Enviar proposta personalizada',
        aiInsights: ['Processo de decisão longo', 'Foco em ROI'],
        engagement: 65,
        lastActivity: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        responseTime: 24
      },
      {
        id: '3',
        name: 'Carlos Oliveira',
        company: 'StartupXYZ',
        email: 'carlos@startupxyz.com',
        phone: '+351 934 567 890',
        source: 'Referência',
        industry: 'Startup',
        companySize: '10-50',
        budget: '€2,000-€8,000',
        timeline: '6+ meses',
        score: 45,
        aiScore: 52,
        factors: ['Budget Limitado', 'Startup'],
        prediction: 'cold',
        conversionProbability: 35,
        nextAction: 'Educar sobre valor',
        aiInsights: ['Orçamento limitado', 'Necessita nurturing'],
        engagement: 40,
        lastActivity: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        responseTime: 72
      }
    ];
    setLeads(sampleLeads);
  }, []);

  const analyzeLeadWithAI = async (lead: EnhancedLead) => {
    setIsAnalyzing(true);
    try {
      const analysis = await scoreLead({
        company: lead.company,
        position: 'N/A',
        industry: lead.industry,
        companySize: lead.companySize,
        budget: lead.budget,
        timeline: lead.timeline
      });
      
      // Gerar insights adicionais
      const insightData = {
        lead: lead,
        engagement: lead.engagement,
        responseTime: lead.responseTime
      };
      
      const insights = await generateInsights(insightData);
      setAiInsights([insights]);
      
      toast.success('Lead analisado pela IA com sucesso!');
      console.log('Análise IA:', analysis);
      console.log('Insights:', insights);
    } catch (error) {
      toast.error('Erro ao analisar lead com IA');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (prediction: string) => {
    switch (prediction) {
      case 'hot': return 'bg-red-100 text-red-800';
      case 'warm': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getPredictionIcon = (prediction: string) => {
    switch (prediction) {
      case 'hot': return <Target className="h-4 w-4" />;
      case 'warm': return <TrendingUp className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('demo') || action.includes('reunião')) return <Calendar className="h-4 w-4" />;
    if (action.includes('email') || action.includes('proposta')) return <Mail className="h-4 w-4" />;
    if (action.includes('chamada') || action.includes('ligar')) return <Phone className="h-4 w-4" />;
    return <Lightbulb className="h-4 w-4" />;
  };

  const hotLeads = leads.filter(l => l.prediction === 'hot').length;
  const warmLeads = leads.filter(l => l.prediction === 'warm').length;
  const avgScore = leads.reduce((acc, lead) => acc + lead.aiScore, 0) / leads.length;
  const avgConversion = leads.reduce((acc, lead) => acc + lead.conversionProbability, 0) / leads.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lead Scoring Inteligente</h2>
          <p className="text-gray-600">IA avançada para scoring e predição de conversão</p>
        </div>
        <Badge className="bg-purple-100 text-purple-800">
          <Brain className="h-3 w-3 mr-1" />
          IA Avançada
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Leads Quentes</p>
                <p className="text-2xl font-bold text-red-600">{hotLeads}</p>
              </div>
              <Target className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Leads Mornos</p>
                <p className="text-2xl font-bold text-yellow-600">{warmLeads}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Score Médio IA</p>
                <p className="text-2xl font-bold text-blue-600">{Math.round(avgScore)}</p>
              </div>
              <Star className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversão Média</p>
                <p className="text-2xl font-bold text-green-600">{Math.round(avgConversion)}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leads List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Lista de Leads Inteligente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leads.map((lead) => (
                <div 
                  key={lead.id} 
                  className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedLead?.id === lead.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedLead(lead)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h3 className="font-semibold">{lead.name}</h3>
                        <p className="text-sm text-gray-600">{lead.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getScoreBadgeColor(lead.prediction)}>
                        {getPredictionIcon(lead.prediction)}
                        <span className="ml-1 capitalize">{lead.prediction}</span>
                      </Badge>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getScoreColor(lead.aiScore)}`}>
                          {lead.aiScore}
                        </div>
                        <div className="text-xs text-gray-500">IA Score</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Probabilidade de Conversão</span>
                      <span>{lead.conversionProbability}%</span>
                    </div>
                    <Progress value={lead.conversionProbability} className="h-2" />
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Engagement</span>
                      <span>{lead.engagement}%</span>
                    </div>
                    <Progress value={lead.engagement} className="h-1" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {lead.factors.slice(0, 2).map((factor, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500">
                      Resp: {lead.responseTime}h
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lead Details */}
        {selectedLead && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Análise IA Detalhada
                <Button 
                  onClick={() => analyzeLeadWithAI(selectedLead)}
                  disabled={isAnalyzing || isLoading}
                  size="sm"
                >
                  {isAnalyzing || isLoading ? (
                    <>
                      <Zap className="h-4 w-4 mr-2 animate-spin" />
                      Analisando...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Analisar IA
                    </>
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedLead.name}</h3>
                <p className="text-gray-600">{selectedLead.company}</p>
              </div>
              
              {/* Scores Comparison */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{selectedLead.score}</div>
                  <div className="text-sm text-gray-600">Score Tradicional</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{selectedLead.aiScore}</div>
                  <div className="text-sm text-gray-600">Score IA</div>
                </div>
              </div>
              
              {/* Probability */}
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-green-800">Probabilidade de Conversão</span>
                  <span className="text-2xl font-bold text-green-600">{selectedLead.conversionProbability}%</span>
                </div>
                <Progress value={selectedLead.conversionProbability} className="h-3" />
              </div>
              
              {/* Lead Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Engagement:</span>
                  <p className="font-medium">{selectedLead.engagement}%</p>
                </div>
                <div>
                  <span className="text-gray-600">Tempo Resposta:</span>
                  <p className="font-medium">{selectedLead.responseTime}h</p>
                </div>
                <div>
                  <span className="text-gray-600">Última Atividade:</span>
                  <p className="font-medium">{selectedLead.lastActivity.toLocaleDateString('pt-PT')}</p>
                </div>
                <div>
                  <span className="text-gray-600">Fonte:</span>
                  <p className="font-medium">{selectedLead.source}</p>
                </div>
              </div>
              
              {/* AI Insights */}
              <div>
                <span className="text-gray-600 text-sm">Insights da IA:</span>
                <div className="space-y-2 mt-1">
                  {selectedLead.aiInsights.map((insight, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <Lightbulb className="h-3 w-3 text-yellow-500" />
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Next Action */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center mb-2">
                  {getActionIcon(selectedLead.nextAction)}
                  <span className="font-medium text-blue-800 ml-2">Próxima Ação Recomendada</span>
                </div>
                <p className="text-sm text-blue-700">{selectedLead.nextAction}</p>
              </div>

              {/* Additional AI Insights */}
              {aiInsights.length > 0 && (
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Brain className="h-4 w-4 text-purple-600 mr-2" />
                    <span className="font-medium text-purple-800">Análise IA Recente</span>
                  </div>
                  {aiInsights.map((insight, index) => (
                    <p key={index} className="text-sm text-purple-700 mb-1">{insight}</p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
