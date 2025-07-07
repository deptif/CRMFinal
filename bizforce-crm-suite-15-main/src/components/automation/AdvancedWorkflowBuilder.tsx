
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Workflow, 
  Plus, 
  BarChart3,
  FileText,
  Layers,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { WorkflowCanvas } from './WorkflowCanvas';
import { WorkflowTemplates } from './WorkflowTemplates';
import { WorkflowNodesLibrary } from './WorkflowNodesLibrary';
import { WorkflowAnalyticsModal } from './WorkflowAnalyticsModal';

interface AdvancedWorkflow {
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: any[];
  isActive: boolean;
  executions: number;
  success_rate: number;
  created_at: Date;
}

export const AdvancedWorkflowBuilder = () => {
  const { toast } = useToast();
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [activeTab, setActiveTab] = useState('workflows');
  
  // Ready for database integration - no mock data
  const [workflows, setWorkflows] = useState<AdvancedWorkflow[]>([]);

  const [isBuilding, setIsBuilding] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<AdvancedWorkflow | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const handleCreateWorkflow = () => {
    setIsBuilding(true);
    setSelectedWorkflow(null);
    setSelectedTemplate(null);
    setActiveTab('canvas');
    toast({
      title: "Novo Workflow",
      description: "Construtor de workflow carregado. Arraste elementos para o canvas."
    });
  };

  const handleSelectTemplate = (template: any) => {
    setSelectedTemplate(template);
    setIsBuilding(true);
    setActiveTab('canvas');
    toast({
      title: "Template Carregado",
      description: `Template "${template.name}" carregado no construtor.`
    });
  };

  const handleSaveWorkflow = (workflowData: any) => {
    const newWorkflow: AdvancedWorkflow = {
      ...workflowData,
      isActive: false,
      executions: 0,
      success_rate: 0
    };

    setWorkflows(prev => [...prev, newWorkflow]);
    setIsBuilding(false);
    setActiveTab('workflows');
    
    // TODO: Replace with actual database call
    // await saveAdvancedWorkflowToDB(newWorkflow);
  };

  const handleCancelBuild = () => {
    setIsBuilding(false);
    setSelectedWorkflow(null);
    setSelectedTemplate(null);
    setActiveTab('workflows');
  };

  const handleToggleWorkflow = (workflowId: string, isActive: boolean) => {
    setWorkflows(workflows.map(workflow => 
      workflow.id === workflowId 
        ? { ...workflow, isActive: !isActive }
        : workflow
    ));
    
    toast({
      title: isActive ? "Workflow Pausado" : "Workflow Ativado",
      description: `O workflow foi ${isActive ? 'pausado' : 'ativado'} com sucesso!`
    });
    
    // TODO: Replace with actual database call
    // await updateAdvancedWorkflowStatusInDB(workflowId, !isActive);
  };

  const handleShowAnalytics = () => {
    setShowAnalytics(true);
    toast({
      title: "Analytics Carregados",
      description: "Visualizando analytics detalhados dos workflows."
    });
  };

  // TODO: Replace with actual calculations from database
  const totalExecutions = workflows.reduce((sum, w) => sum + w.executions, 0);
  const avgSuccessRate = workflows.length > 0 
    ? workflows.reduce((sum, w) => sum + w.success_rate, 0) / workflows.length 
    : 0;

  // TODO: Add function to load advanced workflows from database
  // useEffect(() => {
  //   const loadAdvancedWorkflows = async () => {
  //     try {
  //       const workflowsData = await fetchAdvancedWorkflowsFromDB();
  //       setWorkflows(workflowsData);
  //     } catch (error) {
  //       console.error('Error loading advanced workflows:', error);
  //     }
  //   };
  //   loadAdvancedWorkflows();
  // }, []);

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Workflow Builder</h1>
          <p className="text-gray-600">Automação visual avançada para processos de negócio</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleShowAnalytics}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button onClick={handleCreateWorkflow} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Novo Workflow
          </Button>
        </div>
      </div>

      {!isBuilding ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="workflows" className="flex items-center space-x-2">
              <Workflow className="h-4 w-4" />
              <span>Meus Workflows</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Templates</span>
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center space-x-2">
              <Layers className="h-4 w-4" />
              <span>Biblioteca</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workflows" className="flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              {/* Workflows List */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Workflows Ativos</CardTitle>
                </CardHeader>
                <CardContent>
                  {workflows.length === 0 ? (
                    <div className="text-center py-12">
                      <Workflow className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum workflow criado</h3>
                      <p className="text-gray-600 mb-4">Comece criando workflows para automatizar processos</p>
                      <div className="space-y-2">
                        <Button 
                          className="bg-blue-600 hover:bg-blue-700 w-full"
                          onClick={handleCreateWorkflow}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Criar do Zero
                        </Button>
                        <Button 
                          variant="outline"
                          className="w-full"
                          onClick={() => setActiveTab('templates')}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Usar Template
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {workflows.map((workflow) => (
                        <div key={workflow.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow">
                          <div className="flex items-center space-x-4">
                            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                              <Workflow className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{workflow.name}</h3>
                              <p className="text-sm text-gray-600">{workflow.description}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-sm text-green-600 font-medium">
                                  {workflow.executions} execuções
                                </span>
                                <span className="text-sm text-blue-600 font-medium">
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
                              {workflow.isActive ? "Pausar" : "Ativar"}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedWorkflow(workflow);
                                setIsBuilding(true);
                                setActiveTab('canvas');
                              }}
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Performance Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Geral</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">{totalExecutions}</p>
                    <p className="text-sm text-gray-600">Total de Execuções</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">{Math.round(avgSuccessRate)}%</p>
                    <p className="text-sm text-gray-600">Taxa de Sucesso Média</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-600">0h</p>
                    <p className="text-sm text-gray-600">Tempo Economizado</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-orange-600">€0k</p>
                    <p className="text-sm text-gray-600">Valor Gerado</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="flex-1">
            <WorkflowTemplates onSelectTemplate={handleSelectTemplate} />
          </TabsContent>

          <TabsContent value="library" className="flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <WorkflowNodesLibrary onNodeDragStart={(node) => console.log('Node drag started:', node)} />
              </div>
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Documentação dos Nós</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Layers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Selecione um nó para ver a documentação
                      </h3>
                      <p className="text-gray-600">
                        Explore os diferentes tipos de nós disponíveis para construir seus workflows
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        /* Visual Workflow Builder */
        <div className="flex-1 flex">
          <div className="w-80 border-r">
            <WorkflowNodesLibrary onNodeDragStart={(node) => console.log('Node drag started:', node)} />
          </div>
          <div className="flex-1">
            <WorkflowCanvas
              workflowId={selectedWorkflow?.id}
              onSave={handleSaveWorkflow}
              onCancel={handleCancelBuild}
            />
          </div>
        </div>
      )}

      <WorkflowAnalyticsModal 
        open={showAnalytics}
        onOpenChange={setShowAnalytics}
      />
    </div>
  );
};
