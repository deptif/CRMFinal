import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Zap, Mail, Clock, Users, TrendingUp, Play, Pause } from 'lucide-react';
import { WorkflowModal } from './WorkflowModal';
import { toast } from 'sonner';
import { useSupabaseData } from '@/hooks/useSupabaseData';

interface Workflow {
  id: string;
  name: string;
  type: 'email' | 'task' | 'notification' | 'lead_scoring' | 'approval';
  status: 'active' | 'paused' | 'draft';
  triggers: number;
  success_rate: number;
  description: string;
  created_at: Date;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  open_rate: number;
  click_rate: number;
  created_at: Date;
}

// Mock data until Supabase tables are created
const mockWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Welcome Email Sequence',
    type: 'email',
    status: 'active',
    triggers: 145,
    success_rate: 89,
    description: 'Automated welcome email series for new leads',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
  },
  {
    id: '2',
    name: 'Follow-up Tasks',
    type: 'task',
    status: 'active',
    triggers: 89,
    success_rate: 94,
    description: 'Create follow-up tasks after meeting completion',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)
  },
  {
    id: '3',
    name: 'Lead Scoring Update',
    type: 'lead_scoring',
    status: 'paused',
    triggers: 234,
    success_rate: 76,
    description: 'Update lead scores based on activity patterns',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14)
  }
];

const mockEmailTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'Welcome Email',
    subject: 'Welcome to our platform!',
    content: 'Thank you for joining us...',
    open_rate: 68,
    click_rate: 15,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5)
  },
  {
    id: '2',
    name: 'Follow-up Sequence',
    subject: 'How are you finding our service?',
    content: 'We wanted to check in...',
    open_rate: 45,
    click_rate: 8,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10)
  },
  {
    id: '3',
    name: 'Demo Invitation',
    subject: 'Ready to see our platform in action?',
    content: 'Book a personalized demo...',
    open_rate: 72,
    click_rate: 22,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
  }
];

export const AutomationPage = () => {
  const { 
    searchActivities, 
    getRecentActivities,
    getSalesMetrics,
    isLoading: isLoadingData 
  } = useSupabaseData();
  
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    activeWorkflows: 0,
    monthlyExecutions: 0,
    successRate: 0,
    timeSaved: 0
  });

  useEffect(() => {
    loadWorkflows();
    loadEmailTemplates();
    loadMetrics();
  }, []);

  const loadWorkflows = async () => {
    try {
      setIsLoading(true);
      
      // TODO: Replace with actual Supabase workflow table when created
      // For now, we'll derive workflow data from activities
      const activities = await getRecentActivities(100);
      
      // Create workflow-like data from activities for demonstration
      const workflowData: Workflow[] = [
        {
          id: '1',
          name: 'Email Follow-up Automation',
          type: 'email',
          status: 'active',
          triggers: activities.filter(a => a.type === 'email').length,
          success_rate: 85,
          description: 'Automated email follow-up based on activity data',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
        },
        {
          id: '2',
          name: 'Task Creation Workflow',
          type: 'task',
          status: 'active',
          triggers: activities.filter(a => a.type === 'task').length,
          success_rate: 92,
          description: 'Automatic task creation from activity patterns',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)
        }
      ];
      
      setWorkflows(workflowData);
    } catch (error) {
      console.error('Erro ao carregar workflows:', error);
      toast.error('Erro ao carregar workflows');
      setWorkflows([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadEmailTemplates = async () => {
    try {
      // TODO: Replace with actual Supabase email_templates table when created
      // For now, create sample templates based on real system needs
      const templates: EmailTemplate[] = [
        {
          id: '1',
          name: 'Welcome Email',
          subject: 'Bem-vindo ao BizForce CRM!',
          content: 'Obrigado por se juntar à nossa plataforma...',
          open_rate: 68,
          click_rate: 15,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5)
        },
        {
          id: '2',
          name: 'Follow-up Sequence',
          subject: 'Como está a usar o nosso serviço?',
          content: 'Gostaríamos de saber como tem sido a sua experiência...',
          open_rate: 45,
          click_rate: 8,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10)
        }
      ];
      
      setEmailTemplates(templates);
    } catch (error) {
      console.error('Erro ao carregar templates:', error);
      toast.error('Erro ao carregar templates de email');
      setEmailTemplates([]);
    }
  };

  const loadMetrics = async () => {
    try {
      setIsLoading(true);

      // Get real metrics from Supabase
      const salesMetrics = await getSalesMetrics();
      const activities = await getRecentActivities(50);
      
      // Calculate real metrics based on actual data
      const activeWorkflows = workflows.filter(w => w.status === 'active').length;
      const monthlyExecutions = activities.length;
      const successRate = salesMetrics.winRate || 0;
      const timeSaved = Math.round(monthlyExecutions * 0.5); // Estimate 30 minutes saved per execution

      setMetrics({
        activeWorkflows,
        monthlyExecutions,
        successRate: Math.round(successRate),
        timeSaved
      });
    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
      // Fallback to zero metrics if data loading fails
      setMetrics({
        activeWorkflows: 0,
        monthlyExecutions: 0,
        successRate: 0,
        timeSaved: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWorkflow = async (workflowData: { name: string; description: string; type: 'email' | 'task' | 'notification' | 'lead_scoring' | 'approval'; trigger: string; status: 'active' | 'draft' }) => {
    try {
      // TODO: Replace with actual Supabase insertion when workflows table is created
      const newWorkflow: Workflow = {
        id: String(Date.now()),
        name: workflowData.name,
        description: workflowData.description,
        type: workflowData.type,
        status: workflowData.status,
        triggers: 0,
        success_rate: 0,
        created_at: new Date()
      };
      
      setWorkflows([newWorkflow, ...workflows]);
      toast.success('Workflow criado com sucesso!');
      await loadMetrics();
    } catch (error) {
      console.error('Erro ao criar workflow:', error);
      toast.error('Erro ao criar workflow');
    }
  };

  const toggleWorkflowStatus = async (workflowId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active';
      
      // TODO: Replace with actual Supabase update when workflows table is created
      setWorkflows(prev => prev.map(w => 
        w.id === workflowId ? { ...w, status: newStatus as 'active' | 'paused' | 'draft' } : w
      ));
      
      toast.success(`Workflow ${newStatus === 'active' ? 'ativado' : 'pausado'} com sucesso!`);
      await loadMetrics();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast.error('Erro ao alterar status do workflow');
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      active: { color: 'bg-green-100 text-green-800', label: 'Ativo' },
      paused: { color: 'bg-yellow-100 text-yellow-800', label: 'Pausado' },
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Rascunho' },
    };
    
    return <Badge className={config[status as keyof typeof config]?.color}>
      {config[status as keyof typeof config]?.label}
    </Badge>;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'task': return <Clock className="h-4 w-4" />;
      case 'notification': return <Zap className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Automação de Marketing</h1>
          <p className="text-gray-600">Configure workflows automáticos para aumentar a eficiência</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsWorkflowModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Workflow
        </Button>
      </div>

      {/* Cards de KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workflows Ativos</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeWorkflows}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.activeWorkflows === 0 ? 'Nenhum workflow ativo' : 'Em execução'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Execuções/Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.monthlyExecutions}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.monthlyExecutions === 0 ? 'Aguardando dados' : 'Últimos 30 dias'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              {metrics.monthlyExecutions === 0 ? 'Nenhum dado disponível' : 'Taxa média'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Poupado</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.timeSaved}h</div>
            <p className="text-xs text-muted-foreground">
              {metrics.timeSaved === 0 ? 'Nenhum workflow executado' : 'Este mês'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workflows" className="space-y-4">
        <TabsList>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="templates">Templates de Email</TabsTrigger>
          <TabsTrigger value="triggers">Triggers</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workflows de Automação</CardTitle>
              <CardDescription>Gerencie seus workflows automáticos</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Carregando workflows...</p>
                </div>
              ) : workflows.length === 0 ? (
                <div className="text-center py-12">
                  <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum workflow criado</h3>
                  <p className="text-gray-600">Comece criando um novo workflow para automatizar processos</p>
                  <Button 
                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                    onClick={() => setIsWorkflowModalOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Primeiro Workflow
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {workflows.map((workflow) => (
                    <div key={workflow.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {getTypeIcon(workflow.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{workflow.name}</h3>
                          <p className="text-sm text-gray-600">{workflow.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>{workflow.triggers} execuções</span>
                            <span>{workflow.success_rate}% sucesso</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(workflow.status)}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleWorkflowStatus(workflow.id, workflow.status)}
                        >
                          {workflow.status === 'active' ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <Button variant="ghost" size="sm">Editar</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Templates de Email</CardTitle>
              <CardDescription>Performance dos templates de email marketing</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Carregando templates...</p>
                </div>
              ) : emailTemplates.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum template criado</h3>
                  <p className="text-gray-600">Crie templates de email para automatizar comunicações</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {emailTemplates.map((template) => (
                    <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Mail className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{template.name}</h3>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                            <span>Taxa de abertura: {template.open_rate}%</span>
                            <span>Taxa de clique: {template.click_rate}%</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Editar</Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="triggers">
          <Card>
            <CardHeader>
              <CardTitle>Triggers Disponíveis</CardTitle>
              <CardDescription>Eventos que podem iniciar workflows automáticos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Novo Lead Capturado</h3>
                  <p className="text-sm text-gray-600">Disparado quando um novo lead é adicionado ao sistema</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Proposta Enviada</h3>
                  <p className="text-sm text-gray-600">Disparado após o envio de uma proposta comercial</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Oportunidade sem Atividade</h3>
                  <p className="text-sm text-gray-600">Disparado quando uma oportunidade fica X dias sem movimento</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Meta de Quota Atingida</h3>
                  <p className="text-sm text-gray-600">Disparado quando vendedor atinge sua quota mensal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <WorkflowModal
        isOpen={isWorkflowModalOpen}
        onClose={() => setIsWorkflowModalOpen(false)}
        onSave={handleCreateWorkflow}
      />
    </div>
  );
};
