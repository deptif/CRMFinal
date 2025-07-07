
import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Workflow, 
  Plus, 
  Save,
  Play,
  ArrowRight,
  Settings,
  Trash2,
  Copy
} from 'lucide-react';

interface ProcessNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'approval';
  title: string;
  description: string;
  config: any;
  position: { x: number; y: number };
  connections: string[];
}

interface ProcessCanvasProps {
  nodes: ProcessNode[];
  onNodesChange: (nodes: ProcessNode[]) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ProcessCanvas = ({ nodes, onNodesChange, onSave, onCancel }: ProcessCanvasProps) => {
  const [selectedNode, setSelectedNode] = useState<ProcessNode | null>(null);
  const [draggedNode, setDraggedNode] = useState<ProcessNode | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (draggedNode) {
      const newNode: ProcessNode = {
        ...draggedNode,
        id: `node_${Date.now()}`,
        position: { x, y }
      };
      onNodesChange([...nodes, newNode]);
      setDraggedNode(null);
    }
  }, [draggedNode, nodes, onNodesChange]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'trigger': return 'bg-green-100 border-green-300 text-green-800';
      case 'action': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'condition': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'approval': return 'bg-purple-100 border-purple-300 text-purple-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const deleteNode = (nodeId: string) => {
    onNodesChange(nodes.filter(node => node.id !== nodeId));
    setSelectedNode(null);
  };

  const duplicateNode = (node: ProcessNode) => {
    const newNode: ProcessNode = {
      ...node,
      id: `node_${Date.now()}`,
      title: `${node.title} (Cópia)`,
      position: { x: node.position.x + 50, y: node.position.y + 50 }
    };
    onNodesChange([...nodes, newNode]);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h3 className="text-lg font-semibold">Process Canvas</h3>
          <p className="text-sm text-gray-600">Arraste elementos da biblioteca para construir seu processo</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={onSave} className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Salvar Processo
          </Button>
        </div>
      </div>

      <div 
        className="flex-1 relative bg-gray-50 overflow-auto"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, #666 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        {/* Process Nodes */}
        {nodes.map((node) => (
          <div
            key={node.id}
            className={`absolute p-3 rounded-lg border-2 cursor-pointer shadow-sm hover:shadow-md transition-shadow min-w-48 ${getNodeColor(node.type)} ${
              selectedNode?.id === node.id ? 'ring-2 ring-blue-500' : ''
            }`}
            style={{
              left: node.position.x,
              top: node.position.y
            }}
            onClick={() => setSelectedNode(node)}
          >
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="text-xs">
                {node.type.toUpperCase()}
              </Badge>
              <div className="flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateNode(node);
                  }}
                  className="p-1 hover:bg-white/50 rounded"
                >
                  <Copy className="h-3 w-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNode(node.id);
                  }}
                  className="p-1 hover:bg-white/50 rounded"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
            <h4 className="font-medium text-sm">{node.title}</h4>
            <p className="text-xs opacity-75 mt-1">{node.description}</p>
            
            {/* Connection Points */}
            <div className="absolute -right-2 top-1/2 w-4 h-4 bg-white border-2 border-gray-400 rounded-full transform -translate-y-1/2" />
            <div className="absolute -left-2 top-1/2 w-4 h-4 bg-white border-2 border-gray-400 rounded-full transform -translate-y-1/2" />
          </div>
        ))}

        {/* Empty State */}
        {nodes.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <Workflow className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Canvas Vazio</h3>
              <p className="text-sm">Arraste elementos da biblioteca para começar</p>
            </div>
          </div>
        )}
      </div>

      {/* Node Properties Panel */}
      {selectedNode && (
        <Card className="border-t border-l-0 border-r-0 border-b-0 rounded-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              Propriedades do Nó
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedNode(null)}
              >
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-700">Título</label>
                <p className="text-sm">{selectedNode.title}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Tipo</label>
                <p className="text-sm capitalize">{selectedNode.type}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Descrição</label>
                <p className="text-sm text-gray-600">{selectedNode.description}</p>
              </div>
              <Button size="sm" variant="outline" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Configurar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
