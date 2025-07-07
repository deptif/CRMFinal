
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  TrendingUp, 
  Brain,
  Target,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  score: number;
  scoreChange: number;
  priority: 'hot' | 'warm' | 'cold';
  lastActivity: Date;
  source: string;
  predictedRevenue: number;
  conversionProbability: number;
  factors: ScoringFactor[];
  nextAction: string;
}

interface ScoringFactor {
  name: string;
  value: number;
  weight: number;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

export const AutomatedLeadScoring = () => {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    // Inicializar com array vazio - sem dados mockados
    setLeads([]);
  }, []);

  const handleAnalyzeLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsAnalyzing(true);
    
    setTimeout(() => {
      setIsAnalyzing(false);
      toast({
        title: "Análise Completa",
        description: `Score atualizado para ${lead.name}: ${lead.score} pontos`
      });
    }, 2000);
  };

  const handleExecuteAction = (lead: Lead) => {
    toast({
      title: "Ação Executada",
      description: `${lead.nextAction} para ${lead.name}`
    });
  };

  const getPriorityColor = (priority: Lead['priority']) => {
    switch (priority) {
      case 'hot': return 'bg-red-100 text-red-800';
      case 'warm': return 'bg-orange-100 text-orange-800';
      case 'cold': return 'bg-blue-100 text-blue-800';
    }
  };

  const getPriorityLabel = (priority: Lead['priority']) => {
    switch (priority) {
      case 'hot': return 'Quente';
      case 'warm': return 'Morno';
      case 'cold': return 'Frio';
    }
  };

  const getScoreLevel = (score: number) => {
    if (score >= 80) return { label: 'Excelente', color: 'text-green-600' };
    if (score >= 60) return { label: 'Bom', color: 'text-yellow-600' };
    if (score >= 40) return { label: 'Médio', color: 'text-orange-600' };
    return { label: 'Baixo', color: 'text-red-600' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Lead Scoring Automático</h2>
          <p className="text-gray-600">IA analisa e pontua leads automaticamente</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Brain className="h-4 w-4 mr-2" />
            Configurar IA
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Zap className="h-4 w-4 mr-2" />
            Reanalyzer Todos
          </Button>
        </div>
      </div>

      {/* Scoring Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-red-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <Star className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-600">Leads Quentes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-green-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-600">Score Médio</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-blue-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">0%</p>
            <p className="text-sm text-gray-600">Conversão Média</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-purple-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">€0k</p>
            <p className="text-sm text-gray-600">Revenue Prevista</p>
          </CardContent>
        </Card>
      </div>

      {/* Leads List */}
      <Card>
        <CardHeader>
          <CardTitle>Leads Pontuados</CardTitle>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <div className="text-center py-12">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum lead encontrado</h3>
              <p className="text-gray-600">Adicione leads para começar a usar o scoring automático da IA</p>
            </div>
          ) : (
            <div className="space-y-4">
              {leads.sort((a, b) => b.score - a.score).map((lead) => {
                const scoreLevel = getScoreLevel(lead.score);
                return (
                  <div key={lead.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col items-center">
                          <div className="text-2xl font-bold text-gray-900">{lead.score}</div>
                          <div className={`text-xs font-medium ${scoreLevel.color}`}>
                            {scoreLevel.label}
                          </div>
                          {lead.scoreChange !== 0 && (
                            <div className={`flex items-center text-xs ${
                              lead.scoreChange > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {lead.scoreChange > 0 ? '+' : ''}{lead.scoreChange}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                            <Badge className={getPriorityColor(lead.priority)}>
                              {getPriorityLabel(lead.priority)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{lead.company} • {lead.email}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>€{lead.predictedRevenue.toLocaleString()} previsto</span>
                            <span>{lead.conversionProbability}% conversão</span>
                            <span>Fonte: {lead.source}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAnalyzeLead(lead)}
                        >
                          <Brain className="h-4 w-4 mr-1" />
                          Analisar
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleExecuteAction(lead)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {lead.nextAction}
                        </Button>
                      </div>
                    </div>

                    {/* Scoring Factors Preview */}
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex flex-wrap gap-2">
                        {lead.factors.slice(0, 3).map((factor, index) => (
                          <div
                            key={index}
                            className={`px-2 py-1 rounded-full text-xs ${
                              factor.impact === 'positive' 
                                ? 'bg-green-100 text-green-800' 
                                : factor.impact === 'negative'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {factor.name}: {factor.value > 0 ? '+' : ''}{factor.value}
                          </div>
                        ))}
                        {lead.factors.length > 3 && (
                          <div className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                            +{lead.factors.length - 3} fatores
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <Card className="fixed inset-0 z-50 bg-white m-8 overflow-y-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Análise Detalhada: {selectedLead.name}</CardTitle>
              <Button 
                variant="ghost" 
                onClick={() => setSelectedLead(null)}
              >
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isAnalyzing ? (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 mx-auto mb-4 text-blue-600 animate-pulse" />
                <p className="text-lg font-medium">IA analisando lead...</p>
                <p className="text-gray-600">Processando fatores de conversão</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Score Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">{selectedLead.score}</div>
                    <div className="text-sm text-gray-600">Score Total</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{selectedLead.conversionProbability}%</div>
                    <div className="text-sm text-gray-600">Probabilidade</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">€{selectedLead.predictedRevenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Revenue Prevista</div>
                  </div>
                </div>

                {/* Factors Analysis */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Fatores de Pontuação</h3>
                  <div className="space-y-3">
                    {selectedLead.factors.map((factor, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{factor.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className={`font-bold ${
                              factor.impact === 'positive' ? 'text-green-600' : 
                              factor.impact === 'negative' ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {factor.value > 0 ? '+' : ''}{factor.value}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({(factor.weight * 100).toFixed(0)}% peso)
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{factor.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Actions */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Próxima Ação Recomendada</h3>
                  <p className="text-blue-800 mb-3">{selectedLead.nextAction}</p>
                  <Button 
                    onClick={() => handleExecuteAction(selectedLead)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Executar Ação
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
