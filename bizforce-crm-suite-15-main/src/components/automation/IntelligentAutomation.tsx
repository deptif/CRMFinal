
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Mail, 
  MessageSquare, 
  Phone,
  Calendar,
  Users,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Brain,
  Target,
  Play,
  Pause,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface AutomationRule {
  id: string;
  name: string;
  trigger: 'lead_score' | 'engagement' | 'time_based' | 'behavior';
  condition: string;
  actions: AutomationAction[];
  status: 'active' | 'paused' | 'draft';
  performance: {
    triggered: number;
    successful: number;
    conversion_rate: number;
  };
  aiOptimized: boolean;
}

interface AutomationAction {
  type: 'email' | 'sms' | 'call' | 'task' | 'notification';
  template: string;
  delay: number;
  personalized: boolean;
}

export const IntelligentAutomation = () => {
  const [automations, setAutomations] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Lead Quente - Sequência Imediata',
      trigger: 'lead_score',
      condition: 'Score IA > 80',
      actions: [
        { type: 'notification', template: 'Alerta equipa vendas', delay: 0, personalized: true },
        { type: 'email', template: 'Proposta personalizada', delay: 5, personalized: true },
        { type: 'call', template: 'Chamada de follow-up', delay: 60, personalized: false }
      ],
      status: 'active',
      performance: {
        triggered: 45,
        successful: 38,
        conversion_rate: 84.4
      },
      aiOptimized: true
    },
    {
      id: '2',
      name: 'Nurturing Lead Morno',
      trigger: 'engagement',
      condition: 'Engagement baixo < 50%',
      actions: [
        { type: 'email', template: 'Conteúdo educativo', delay: 0, personalized: true },
        { type: 'email', template: 'Case study relevante', delay: 2880, personalized: true },
        { type: 'task', template: 'Revisão manual', delay: 10080, personalized: false }
      ],
      status: 'active',
      performance: {
        triggered: 67,
        successful: 42,
        conversion_rate: 62.7
      },
      aiOptimized: true
    },
    {
      id: '3',
      name: 'Re-engagement Lead Frio',
      trigger: 'time_based',
      condition: 'Sem atividade > 14 dias',
      actions: [
        { type: 'email', template: 'Email de reativação', delay: 0, personalized: true },
        { type: 'sms', template: 'SMS de follow-up', delay: 1440, personalized: false }
      ],
      status: 'active',
      performance: {
        triggered: 89,
        successful: 23,
        conversion_rate: 25.8
      },
      aiOptimized: false
    }
  ]);

  const [selectedAutomation, setSelectedAutomation] = useState<AutomationRule | null>(null);

  const toggleAutomationStatus = (id: string) => {
    setAutomations(prev => prev.map(automation => {
      if (automation.id === id) {
        const newStatus = automation.status === 'active' ? 'paused' : 'active';
        toast.success(`Automação ${newStatus === 'active' ? 'ativada' : 'pausada'}`);
        return { ...automation, status: newStatus };
      }
      return automation;
    }));
  };

  const optimizeWithAI = (id: string) => {
    setAutomations(prev => prev.map(automation => {
      if (automation.id === id) {
        toast.success('Automação otimizada pela IA!');
        return { 
          ...automation, 
          aiOptimized: true,
          performance: {
            ...automation.performance,
            conversion_rate: automation.performance.conversion_rate * 1.15
          }
        };
      }
      return automation;
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      case 'task': return <CheckCircle className="h-4 w-4" />;
      case 'notification': return <AlertTriangle className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const totalTriggered = automations.reduce((acc, auto) => acc + auto.performance.triggered, 0);
  const totalSuccessful = automations.reduce((acc, auto) => acc + auto.performance.successful, 0);
  const avgConversion = totalTriggered > 0 ? (totalSuccessful / totalTriggered) * 100 : 0;
  const activeAutomations = automations.filter(a => a.status === 'active').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Automação Inteligente</h2>
          <p className="text-gray-600">Automações multi-canal otimizadas por IA</p>
        </div>
        <Button>
          <Zap className="h-4 w-4 mr-2" />
          Nova Automação
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Automações Ativas</p>
                <p className="text-2xl font-bold text-green-600">{activeAutomations}</p>
              </div>
              <Zap className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Executadas</p>
                <p className="text-2xl font-bold text-blue-600">{totalTriggered}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taxa Sucesso</p>
                <p className="text-2xl font-bold text-purple-600">{Math.round(avgConversion)}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">IA Otimizadas</p>
                <p className="text-2xl font-bold text-orange-600">
                  {automations.filter(a => a.aiOptimized).length}
                </p>
              </div>
              <Brain className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Automations List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Automações Configuradas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {automations.map((automation) => (
                <div 
                  key={automation.id} 
                  className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedAutomation?.id === automation.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedAutomation(automation)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h3 className="font-semibold">{automation.name}</h3>
                        <p className="text-sm text-gray-600">{automation.condition}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(automation.status)}>
                        {automation.status === 'active' ? <Play className="h-3 w-3 mr-1" /> : 
                         automation.status === 'paused' ? <Pause className="h-3 w-3 mr-1" /> : 
                         <Settings className="h-3 w-3 mr-1" />}
                        {automation.status === 'active' ? 'Ativa' : 
                         automation.status === 'paused' ? 'Pausada' : 'Rascunho'}
                      </Badge>
                      {automation.aiOptimized && (
                        <Badge className="bg-purple-100 text-purple-800">
                          <Brain className="h-3 w-3 mr-1" />
                          IA
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Taxa de Conversão</span>
                      <span>{automation.performance.conversion_rate.toFixed(1)}%</span>
                    </div>
                    <Progress value={automation.performance.conversion_rate} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      {automation.actions.slice(0, 3).map((action, index) => (
                        <div key={index} className="p-1 bg-gray-100 rounded">
                          {getActionIcon(action.type)}
                        </div>
                      ))}
                      {automation.actions.length > 3 && (
                        <div className="text-xs text-gray-500 ml-1">
                          +{automation.actions.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {automation.performance.triggered} execuções
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Automation Details */}
        {selectedAutomation && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Detalhes da Automação
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => toggleAutomationStatus(selectedAutomation.id)}
                  >
                    {selectedAutomation.status === 'active' ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pausar
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Ativar
                      </>
                    )}
                  </Button>
                  {!selectedAutomation.aiOptimized && (
                    <Button 
                      size="sm"
                      onClick={() => optimizeWithAI(selectedAutomation.id)}
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      Otimizar IA
                    </Button>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedAutomation.name}</h3>
                <p className="text-gray-600">{selectedAutomation.condition}</p>
              </div>
              
              {/* Performance Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">
                    {selectedAutomation.performance.triggered}
                  </div>
                  <div className="text-sm text-gray-600">Executadas</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-xl font-bold text-green-600">
                    {selectedAutomation.performance.successful}
                  </div>
                  <div className="text-sm text-gray-600">Bem-sucedidas</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-xl font-bold text-purple-600">
                    {selectedAutomation.performance.conversion_rate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Conversão</div>
                </div>
              </div>
              
              {/* Actions Flow */}
              <div>
                <h4 className="font-medium mb-3">Fluxo de Ações</h4>
                <div className="space-y-3">
                  {selectedAutomation.actions.map((action, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full">
                        {getActionIcon(action.type)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{action.template}</div>
                        <div className="text-sm text-gray-600">
                          {action.delay === 0 ? 'Imediato' : 
                           action.delay < 60 ? `${action.delay} min` :
                           action.delay < 1440 ? `${Math.round(action.delay / 60)} h` :
                           `${Math.round(action.delay / 1440)} dias`}
                        </div>
                      </div>
                      {action.personalized && (
                        <Badge variant="secondary" className="text-xs">
                          Personalizado
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* AI Optimization Status */}
              {selectedAutomation.aiOptimized && (
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Brain className="h-4 w-4 text-purple-600 mr-2" />
                    <span className="font-medium text-purple-800">Otimizada pela IA</span>
                  </div>
                  <p className="text-sm text-purple-700">
                    Esta automação foi otimizada pela IA para melhor performance e personalização.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
