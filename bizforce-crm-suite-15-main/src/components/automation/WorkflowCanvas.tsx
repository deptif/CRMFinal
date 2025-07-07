
import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Save, 
  RotateCcw,
  Settings,
  Plus,
  Trash2,
  Copy,
  ArrowRight,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'delay';
  name: string;
  description: string;
  config: any;
  position: { x: number; y: number };
  connections: string[];
  status: 'active' | 'inactive' | 'error';
}

interface WorkflowCanvasProps {
  workflowId?: string;
  onSave: (workflow: any) => void;
  onCancel: () => void;
}

export const WorkflowCanvas = ({ workflowId, onSave, onCancel }: WorkflowCanvasProps) => {
  const { toast } = useToast();
  const [workflowName, setWorkflowName] = useState('Novo Workflow');
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);

  const handleNodeDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const nodeType = event.dataTransfer.getData('nodeType');
    const nodeName = event.dataTransfer.getData('nodeName');
    const nodeDescription = event.dataTransfer.getData('nodeDescription');
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type: nodeType as any,
      name: nodeName,
      description: nodeDescription,
      config: {},
      position: { x, y },
      connections: [],
      status: 'inactive'
    };

    setNodes(prev => [...prev, newNode]);
    toast({
      title: "Nó Adicionado",
      description: `${nodeName} foi adicionado ao workflow`
    });
  }, [toast]);

  const handleNodeSelect = (node: WorkflowNode) => {
    setSelectedNode(node);
  };

  const handleNodeDelete = (nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
    toast({
      title: "Nó Removido",
      description: "O nó foi removido do workflow"
    });
  };

  const handleSaveWorkflow = () => {
    if (!workflowName.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um nome para o workflow",
        variant: "destructive"
      });
      return;
    }

    if (nodes.length === 0) {
      toast({
        title: "Erro", 
        description: "Adicione pelo menos um nó ao workflow",
        variant: "destructive"
      });
      return;
    }

    const workflowData = {
      id: workflowId || `workflow-${Date.now()}`,
      name: workflowName,
      nodes,
      created_at: new Date(),
      status: 'draft'
    };

    onSave(workflowData);
    toast({
      title: "Workflow Salvo",
      description: "O workflow foi salvo com sucesso!"
    });
  };

  const handleTestWorkflow = () => {
    toast({
      title: "Teste Iniciado",
      description: "Testando o workflow... (simulação)"
    });
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'trigger': return 'bg-green-100 border-green-300 text-green-800';
      case 'action': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'condition': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'delay': return 'bg-purple-100 border-purple-300 text-purple-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center space-x-4">
          <Input
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="w-64"
            placeholder="Nome do workflow"
          />
          <Badge variant="outline">
            {nodes.length} nós
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleTestWorkflow}>
            <Play className="h-4 w-4 mr-2" />
            Testar
          </Button>
          <Button variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Limpar
          </Button>
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancelar
          </Button>
          <Button size="sm" onClick={handleSaveWorkflow}>
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex">
        <div 
          className="flex-1 relative bg-gray-50 overflow-hidden"
          onDrop={handleNodeDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {/* Grid Background */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />

          {/* Nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`absolute p-3 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                getNodeColor(node.type)
              } ${selectedNode?.id === node.id ? 'ring-2 ring-blue-500' : ''}`}
              style={{
                left: node.position.x,
                top: node.position.y,
                minWidth: '160px'
              }}
              onClick={() => handleNodeSelect(node)}
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-xs">
                  {node.type}
                </Badge>
                <div className="flex items-center space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle node duplication
                    }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNodeDelete(node.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <h4 className="font-medium text-sm">{node.name}</h4>
              <p className="text-xs text-gray-600 mt-1">{node.description}</p>
              
              {/* Connection Points */}
              <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded-full cursor-pointer hover:border-blue-500" />
              </div>
            </div>
          ))}

          {/* Empty State */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Zap className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Canvas Vazio
                </h3>
                <p className="text-gray-600 mb-4">
                  Arraste elementos da barra lateral para começar
                </p>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Trigger
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Properties Panel */}
        {selectedNode && (
          <div className="w-80 border-l bg-white">
            <Card className="h-full rounded-none border-0">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Propriedades
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nome</label>
                  <Input
                    value={selectedNode.name}
                    onChange={(e) => {
                      const updatedNodes = nodes.map(node =>
                        node.id === selectedNode.id
                          ? { ...node, name: e.target.value }
                          : node
                      );
                      setNodes(updatedNodes);
                      setSelectedNode({ ...selectedNode, name: e.target.value });
                    }}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Descrição</label>
                  <Input
                    value={selectedNode.description}
                    onChange={(e) => {
                      const updatedNodes = nodes.map(node =>
                        node.id === selectedNode.id
                          ? { ...node, description: e.target.value }
                          : node
                      );
                      setNodes(updatedNodes);
                      setSelectedNode({ ...selectedNode, description: e.target.value });
                    }}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Tipo</label>
                  <Badge className={getNodeColor(selectedNode.type)}>
                    {selectedNode.type}
                  </Badge>
                </div>
                
                {/* Configuration based on node type */}
                <div className="space-y-3">
                  <h4 className="font-medium">Configurações</h4>
                  {selectedNode.type === 'trigger' && (
                    <div className="text-sm text-gray-600">
                      Configure o evento que irá disparar este workflow
                    </div>
                  )}
                  {selectedNode.type === 'action' && (
                    <div className="text-sm text-gray-600">
                      Configure a ação que será executada
                    </div>
                  )}
                  {selectedNode.type === 'condition' && (
                    <div className="text-sm text-gray-600">
                      Configure a condição para bifurcação
                    </div>
                  )}
                  {selectedNode.type === 'delay' && (
                    <div className="text-sm text-gray-600">
                      Configure o tempo de espera
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
