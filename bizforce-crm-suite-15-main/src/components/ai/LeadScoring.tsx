
import { useState } from 'react';
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
  Zap
} from 'lucide-react';
import { useOpenAI } from '@/hooks/useOpenAI';
import { toast } from 'sonner';

interface Lead {
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
  factors: string[];
  prediction: 'hot' | 'warm' | 'cold';
  nextAction: string;
}

export const LeadScoring = () => {
  const [leads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { scoreLead, isLoading } = useOpenAI();

  const analyzeLeadScore = async (lead: Lead) => {
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
      
      toast.success('Lead analisado pela IA!');
      console.log('Análise IA:', analysis);
    } catch (error) {
      toast.error('Erro ao analisar lead');
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lead Scoring Inteligente</h2>
          <p className="text-gray-600">IA analisa e pontua leads automaticamente</p>
        </div>
        <Badge className="bg-purple-100 text-purple-800">
          <Brain className="h-3 w-3 mr-1" />
          IA Ativada
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Leads Quentes</p>
                <p className="text-2xl font-bold text-red-600">0</p>
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
                <p className="text-2xl font-bold text-yellow-600">0</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Score Médio</p>
                <p className="text-2xl font-bold text-blue-600">0</p>
              </div>
              <Star className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversão IA</p>
                <p className="text-2xl font-bold text-green-600">0%</p>
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
            <CardTitle>Lista de Leads</CardTitle>
          </CardHeader>
          <CardContent>
            {leads.length === 0 ? (
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum lead encontrado</h3>
                <p className="text-gray-600">Adicione leads para começar a usar o scoring inteligente</p>
              </div>
            ) : (
              <div className="space-y-4">
                {leads.map((lead) => (
                  <div 
                    key={lead.id} 
                    className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <div className="flex items-center justify-between mb-2">
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
                        <span className={`text-xl font-bold ${getScoreColor(lead.score)}`}>
                          {lead.score}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Score</span>
                        <span>{lead.score}/100</span>
                      </div>
                      <Progress value={lead.score} className="h-2" />
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {lead.factors.map((factor, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lead Details */}
        {selectedLead && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Análise Detalhada
                <Button 
                  onClick={() => analyzeLeadScore(selectedLead)}
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
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Email:</span>
                  <p className="font-medium">{selectedLead.email}</p>
                </div>
                <div>
                  <span className="text-gray-600">Telefone:</span>
                  <p className="font-medium">{selectedLead.phone}</p>
                </div>
                <div>
                  <span className="text-gray-600">Fonte:</span>
                  <p className="font-medium">{selectedLead.source}</p>
                </div>
                <div>
                  <span className="text-gray-600">Setor:</span>
                  <p className="font-medium">{selectedLead.industry}</p>
                </div>
                <div>
                  <span className="text-gray-600">Empresa:</span>
                  <p className="font-medium">{selectedLead.companySize} funcionários</p>
                </div>
                <div>
                  <span className="text-gray-600">Orçamento:</span>
                  <p className="font-medium">{selectedLead.budget}</p>
                </div>
              </div>
              
              <div>
                <span className="text-gray-600 text-sm">Timeline:</span>
                <p className="font-medium">{selectedLead.timeline}</p>
              </div>
              
              <div>
                <span className="text-gray-600 text-sm">Fatores de Score:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedLead.factors.map((factor, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {factor}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center mb-2">
                  <Zap className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-800">Próxima Ação Recomendada</span>
                </div>
                <p className="text-sm text-blue-700">{selectedLead.nextAction}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
