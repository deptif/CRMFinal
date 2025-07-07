
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, AlertTriangle, Clock, Target } from 'lucide-react';

interface EmailAnalysis {
  sentiment: string;
  intent: string;
  priority: string;
  suggestion: string;
  urgency: 'low' | 'medium' | 'high';
  lead_score: number;
}

interface EmailAnalysisCardProps {
  analysis: EmailAnalysis;
}

export const EmailAnalysisCard = ({ analysis }: EmailAnalysisCardProps) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positivo': return 'bg-green-100 text-green-800 border-green-200';
      case 'negativo': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200';
      case 'média': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <Target className="h-4 w-4 text-green-600" />;
    }
  };

  return (
    <Card className="border-2 border-blue-100">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="h-5 w-5 mr-2 text-blue-600" />
          Análise Inteligente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Sentimento</p>
            <Badge className={getSentimentColor(analysis.sentiment)}>
              {analysis.sentiment}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Prioridade</p>
            <Badge className={getPriorityColor(analysis.priority)}>
              {analysis.priority}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Intenção</p>
            <p className="font-medium">{analysis.intent}</p>
          </div>
          <div className="flex items-center space-x-2">
            {getUrgencyIcon(analysis.urgency)}
            <span className="text-sm font-medium">Score: {analysis.lead_score}%</span>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-gray-600 mb-2">Sugestões da IA</p>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">{analysis.suggestion}</p>
          </div>
        </div>

        <div className="flex items-center justify-center p-3 bg-green-50 rounded-lg">
          <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
          <span className="text-sm font-medium text-green-800">
            Probabilidade de Conversão: {analysis.lead_score}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
