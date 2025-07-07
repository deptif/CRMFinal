
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Workflow, 
  Plus, 
  Play, 
  Pause, 
  Settings,
  Eye,
  Copy,
  BarChart3,
  Clock,
  Users,
  Target,
  FileText,
  Layers
} from 'lucide-react';
import { toast } from 'sonner';
import { ProcessCanvas } from './process/ProcessCanvas';
import { ProcessNodesLibrary } from './process/ProcessNodesLibrary';
import { ProcessTemplates } from './process/ProcessTemplates';

interface BusinessProcess {
  id: string;
  name: string;
  description: string;
  object: string;
  type: 'approval' | 'workflow' | 'flow';
  status: 'active' | 'inactive' | 'draft';
  steps: number;
  executions: number;
  success_rate: number;
  created_at: Date;
}

export const BusinessProcessBuilder = () => {
  // Ready for database integration - no mock data
  const [processes, setProcesses] = useState<BusinessProcess[]>([]);
  const [isBuilding, setIsBuilding] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<BusinessProcess | null>(null);
  const [canvasNodes, setCanvasNodes] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('processes');

  const handleCreateProcess = () => {
    setIsBuilding(true);
    setSelectedProcess(null);
    setCanvasNodes([]);
    setActiveTab('canvas');
    toast.success('Novo processo criado! Arraste elementos para o canvas.');
  };

  const handleSelectTemplate = (template: any) => {
    setIsBuilding(true);
    setSelectedProcess(null);
    setCanvasNodes([]);
    setActiveTab('canvas');
    toast.success(`Template "${template.name}" carregado!`);
  };

  const handleToggleProcess = (processId: string) => {
    setProcesses(processes.map(process => 
      process.id === processId 
        ? { ...process, status: process.status === 'active' ? 'inactive' : 'active' as const }
        : process
    ));
    
    const process = processes.find(p => p.id === processId);
    toast.success(`Processo ${process?.status === 'active' ? 'pausado' : 'ativado'}!`);
  };

  const handleSaveProcess = () => {
    const newProcess: BusinessProcess = {
      id: `process_${Date.now()}`,
      name: 'Novo Processo',
      description: 'Processo criado no canvas',
      object: 'Lead',
      type: 'workflow',
      status: 'draft',
      steps: canvasNodes.length,
      executions: 0,
      success_rate: 0,
      created_at: new Date()
    };

    setProcesses(prev => [...prev, newProcess]);
    setIsBuilding(false);
    setActiveTab('processes');
    toast.success('Processo salvo com sucesso!');
  };

  const handleCancelBuild = () => {
    setIsBuilding(false);
    setCanvasNodes([]);
    setActiveTab('processes');
  };

  const getStatusBadge = (status: string) => {
    const config = {
      active: { color: 'bg-green-100 text-green-800', label: 'Ativo' },
      inactive: { color: 'bg-gray-100 text-gray-800', label: 'Inativo' },
      draft: { color: 'bg-yellow-100 text-yellow-800', label: 'Rascunho' }
    };
    const { color, label } = config[status as keyof typeof config];
    return <Badge className={color}>{label}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'approval': return Users;
      case 'workflow': return Workflow;
      case 'flow': return Target;
      default: return Workflow;
    }
  };

  if (isBuilding) {
    return (
      <div className="h-full flex">
        <div className="w-80 border-r bg-white">
          <ProcessNodesLibrary 
            onNodeDragStart={(node) => {
              // Store the dragged node for canvas to handle
              console.log('Node drag started:', node);
            }} 
          />
        </div>
        <div className="flex-1">
          <ProcessCanvas
            nodes={canvasNodes}
            onNodesChange={setCanvasNodes}
            onSave={handleSaveProcess}
            onCancel={handleCancelBuild}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Business Process Builder</h2>
          <p className="text-gray-600 dark:text-gray-400">Configure processos de negócio automatizados</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button onClick={handleCreateProcess} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Novo Processo
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="processes" className="flex items-center space-x-2">
            <Workflow className="h-4 w-4" />
            <span>Meus Processos</span>
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

        <TabsContent value="processes" className="space-y-4">
          {processes.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Workflow className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Nenhum processo encontrado
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                  Configure processos de negócio automatizados para otimizar operações
                </p>
                <div className="space-y-2">
                  <Button onClick={handleCreateProcess} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar do Zero
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab('templates')}>
                    <FileText className="h-4 w-4 mr-2" />
                    Usar Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {processes.map((process) => {
                const TypeIcon = getTypeIcon(process.type);
                return (
                  <Card key={process.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                            <TypeIcon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{process.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{process.description}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <Badge variant="outline">{process.object}</Badge>
                              {getStatusBadge(process.status)}
                              <span className="text-sm text-gray-500">
                                {process.steps} passos
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">{process.executions}</p>
                            <p className="text-xs text-gray-500">Execuções</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{process.success_rate}%</p>
                            <p className="text-xs text-gray-500">Sucesso</p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <BarChart3 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant={process.status === 'active' ? "default" : "outline"}
                              onClick={() => handleToggleProcess(process.id)}
                            >
                              {process.status === 'active' ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => {
                                setSelectedProcess(process);
                                setIsBuilding(true);
                                setActiveTab('canvas');
                              }}
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates">
          <ProcessTemplates onSelectTemplate={handleSelectTemplate} />
        </TabsContent>

        <TabsContent value="library">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ProcessNodesLibrary onNodeDragStart={(node) => console.log('Node drag started:', node)} />
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
                      Explore os diferentes tipos de nós disponíveis para construir seus processos
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
