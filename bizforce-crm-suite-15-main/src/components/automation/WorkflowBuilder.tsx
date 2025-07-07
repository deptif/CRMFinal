
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Workflow, 
  Plus, 
  Play, 
  Pause, 
  Settings,
  Mail,
  Clock,
  Database,
  GitBranch,
  Zap,
  Target
} from 'lucide-react';
import { toast } from 'sonner';

interface WorkflowStep {
  id: string;
  type: 'trigger' | 'action' | 'condition';
  name: string;
  config: any;
  position: { x: number; y: number };
  connections: string[];
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: WorkflowStep[];
  isActive: boolean;
  executions: number;
  success_rate: number;
}

export const WorkflowBuilder = () => {
  // Ready for database integration - no mock data
  const [workflows, setWorkflows] = useState<WorkflowTemplate[]>([]);

  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowTemplate | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);

  const workflowTemplates = [
    {
      name: 'Lead Qualification',
      description: 'Qualifica leads automaticamente baseado em critérios',
      icon: Target,
      category: 'Lead Management'
    },
    {
      name: 'Email Follow-up',
      description: 'Sequência de emails de follow-up',
      icon: Mail,
      category: 'Communication'
    },
    {
      name: 'Task Assignment',
      description: 'Atribui tarefas automaticamente',
      icon: Clock,
      category: 'Task Management'
    },
    {
      name: 'Data Sync',
      description: 'Sincroniza dados entre sistemas',
      icon: Database,
      category: 'Integration'
    }
  ];

  const triggerTypes = [
    { id: 'new_lead', name: 'Novo Lead Criado', icon: Plus },
    { id: 'opportunity_stage', name: 'Mudança de Estágio', icon: GitBranch },
    { id: 'email_opened', name: 'Email Aberto', icon: Mail },
    { id: 'time_based', name: 'Baseado em Tempo', icon: Clock },
    { id: 'field_update', name: 'Campo Atualizado', icon: Database }
  ];

  const actionTypes = [
    { id: 'send_email', name: 'Enviar Email', icon: Mail },
    { id: 'create_task', name: 'Criar Tarefa', icon: Clock },
    { id: 'update_field', name: 'Atualizar Campo', icon: Database },
    { id: 'assign_user', name: 'Atribuir Usuário', icon: Target },
    { id: 'webhook', name: 'Chamar Webhook', icon: Zap }
  ];

  const handleCreateWorkflow = () => {
    setIsBuilding(true);
    toast.success('Novo workflow criado!');
    
    // TODO: Replace with actual database call
    // await createWorkflowInDB();
  };

  const handleToggleWorkflow = (workflowId: string, isActive: boolean) => {
    setWorkflows(workflows.map(workflow => 
      workflow.id === workflowId 
        ? { ...workflow, isActive: !isActive }
        : workflow
    ));
    
    toast.success(`Workflow ${isActive ? 'pausado' : 'ativado'} com sucesso!`);
    
    // TODO: Replace with actual database call
    // await updateWorkflowStatusInDB(workflowId, !isActive);
  };

  // TODO: Add function to load workflows from database
  // useEffect(() => {
  //   const loadWorkflows = async () => {
  //     try {
  //       const workflowsData = await fetchWorkflowsFromDB();
  //       setWorkflows(workflowsData);
  //     } catch (error) {
  //       console.error('Error loading workflows:', error);
  //     }
  //   };
  //   loadWorkflows();
  // }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Process Builder</h1>
          <p className="text-gray-600">Construa workflows visuais para automatizar processos</p>
        </div>
        <Button onClick={handleCreateWorkflow} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Workflow
        </Button>
      </div>

      {!isBuilding ? (
        <>
          {/* Workflow Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Templates de Workflow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {workflowTemplates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <div key={template.name} className="p-4 border rounded-lg hover:shadow-sm cursor-pointer transition-shadow">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{template.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {template.category}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Active Workflows */}
          <Card>
            <CardHeader>
              <CardTitle>Workflows Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              {workflows.length === 0 ? (
                <div className="text-center py-12">
                  <Workflow className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum workflow criado</h3>
                  <p className="text-gray-600">Comece criando workflows para automatizar processos</p>
                  <Button 
                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                    onClick={handleCreateWorkflow}
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
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Workflow className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{workflow.name}</h3>
                          <p className="text-sm text-gray-600">{workflow.description}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <Badge variant="secondary">{workflow.category}</Badge>
                            <span className="text-sm text-gray-500">
                              {workflow.executions} execuções
                            </span>
                            <span className="text-sm text-gray-500">
                              {workflow.success_rate}% sucesso
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant={workflow.isActive ? "default" : "outline"}
                          onClick={() => handleToggleWorkflow(workflow.id, workflow.isActive)}
                        >
                          {workflow.isActive ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        /* Visual Workflow Builder */
        <Card>
          <CardHeader>
            <CardTitle>Construtor Visual de Workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-6 h-96">
              {/* Toolbox */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Triggers</h3>
                  <div className="space-y-2">
                    {triggerTypes.map((trigger) => {
                      const Icon = trigger.icon;
                      return (
                        <div key={trigger.id} className="p-2 border rounded cursor-pointer hover:bg-gray-50">
                          <div className="flex items-center space-x-2">
                            <Icon className="h-4 w-4" />
                            <span className="text-sm">{trigger.name}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Actions</h3>
                  <div className="space-y-2">
                    {actionTypes.map((action) => {
                      const Icon = action.icon;
                      return (
                        <div key={action.id} className="p-2 border rounded cursor-pointer hover:bg-gray-50">
                          <div className="flex items-center space-x-2">
                            <Icon className="h-4 w-4" />
                            <span className="text-sm">{action.name}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Canvas */}
              <div className="col-span-3 border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Workflow className="h-12 w-12 mx-auto mb-4" />
                    <p>Arraste elementos da toolbox para construir seu workflow</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsBuilding(false)}>
                Cancelar
              </Button>
              <Button onClick={() => {
                setIsBuilding(false);
                toast.success('Workflow salvo com sucesso!');
                
                // TODO: Replace with actual database call
                // await saveWorkflowToDB(workflowData);
              }}>
                Salvar Workflow
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
