
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Workflow, 
  Zap, 
  Mail, 
  Clock, 
  Database, 
  Users, 
  Target, 
  GitBranch,
  CheckSquare,
  AlertCircle,
  Phone,
  FileText,
  Search,
  Plus
} from 'lucide-react';

interface ProcessNodeTemplate {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'approval';
  title: string;
  description: string;
  icon: any;
  category: string;
}

interface ProcessNodesLibraryProps {
  onNodeDragStart: (node: ProcessNodeTemplate) => void;
}

export const ProcessNodesLibrary = ({ onNodeDragStart }: ProcessNodesLibraryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const nodeTemplates: ProcessNodeTemplate[] = [
    // Triggers
    {
      id: 'trigger_record_created',
      type: 'trigger',
      title: 'Registro Criado',
      description: 'Inicia quando um novo registro é criado',
      icon: Plus,
      category: 'triggers'
    },
    {
      id: 'trigger_field_updated',
      type: 'trigger',
      title: 'Campo Atualizado',
      description: 'Inicia quando um campo específico é alterado',
      icon: Database,
      category: 'triggers'
    },
    {
      id: 'trigger_time_based',
      type: 'trigger',
      title: 'Baseado em Tempo',
      description: 'Inicia em horários ou datas específicas',
      icon: Clock,
      category: 'triggers'
    },
    {
      id: 'trigger_email_received',
      type: 'trigger',
      title: 'Email Recebido',
      description: 'Inicia quando um email é recebido',
      icon: Mail,
      category: 'triggers'
    },

    // Actions
    {
      id: 'action_send_email',
      type: 'action',
      title: 'Enviar Email',
      description: 'Envia email automaticamente',
      icon: Mail,
      category: 'actions'
    },
    {
      id: 'action_create_task',
      type: 'action',
      title: 'Criar Tarefa',
      description: 'Cria uma nova tarefa',
      icon: CheckSquare,
      category: 'actions'
    },
    {
      id: 'action_update_field',
      type: 'action',
      title: 'Atualizar Campo',
      description: 'Atualiza valores de campos',
      icon: Database,
      category: 'actions'
    },
    {
      id: 'action_assign_user',
      type: 'action',
      title: 'Atribuir Usuário',
      description: 'Atribui registro a um usuário',
      icon: Users,
      category: 'actions'
    },
    {
      id: 'action_webhook',
      type: 'action',
      title: 'Chamar Webhook',
      description: 'Faz chamada para API externa',
      icon: Zap,
      category: 'actions'
    },
    {
      id: 'action_create_record',
      type: 'action',
      title: 'Criar Registro',
      description: 'Cria novo registro relacionado',
      icon: FileText,
      category: 'actions'
    },

    // Conditions
    {
      id: 'condition_field_value',
      type: 'condition',
      title: 'Valor do Campo',
      description: 'Verifica valor de campo específico',
      icon: GitBranch,
      category: 'conditions'
    },
    {
      id: 'condition_multiple_criteria',
      type: 'condition',
      title: 'Múltiplos Critérios',
      description: 'Avalia múltiplas condições',
      icon: Target,
      category: 'conditions'
    },
    {
      id: 'condition_time_window',
      type: 'condition',
      title: 'Janela de Tempo',
      description: 'Verifica período de tempo',
      icon: Clock,
      category: 'conditions'
    },

    // Approvals
    {
      id: 'approval_single',
      type: 'approval',
      title: 'Aprovação Simples',
      description: 'Requer aprovação de um usuário',
      icon: Users,
      category: 'approvals'
    },
    {
      id: 'approval_sequential',
      type: 'approval',
      title: 'Aprovação Sequencial',
      description: 'Múltiplas aprovações em sequência',
      icon: Workflow,
      category: 'approvals'
    },
    {
      id: 'approval_parallel',
      type: 'approval',
      title: 'Aprovação Paralela',
      description: 'Múltiplas aprovações simultâneas',
      icon: GitBranch,
      category: 'approvals'
    }
  ];

  const categories = [
    { id: 'all', label: 'Todos', count: nodeTemplates.length },
    { id: 'triggers', label: 'Triggers', count: nodeTemplates.filter(n => n.category === 'triggers').length },
    { id: 'actions', label: 'Ações', count: nodeTemplates.filter(n => n.category === 'actions').length },
    { id: 'conditions', label: 'Condições', count: nodeTemplates.filter(n => n.category === 'conditions').length },
    { id: 'approvals', label: 'Aprovações', count: nodeTemplates.filter(n => n.category === 'approvals').length }
  ];

  const filteredNodes = nodeTemplates.filter(node => {
    const matchesSearch = node.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         node.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || node.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDragStart = (node: ProcessNodeTemplate) => {
    onNodeDragStart(node);
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'trigger': return 'border-green-200 bg-green-50 hover:bg-green-100';
      case 'action': return 'border-blue-200 bg-blue-50 hover:bg-blue-100';
      case 'condition': return 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100';
      case 'approval': return 'border-purple-200 bg-purple-50 hover:bg-purple-100';
      default: return 'border-gray-200 bg-gray-50 hover:bg-gray-100';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Biblioteca de Nós</CardTitle>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            className="pl-8 h-8"
            placeholder="Buscar nós..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden flex flex-col p-0">
        {/* Categories */}
        <div className="px-4 pb-3">
          <div className="flex flex-wrap gap-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-2 py-1 text-xs rounded-md border transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-100 border-blue-300 text-blue-800'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Nodes List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="space-y-2">
            {filteredNodes.map((node) => {
              const IconComponent = node.icon;
              return (
                <div
                  key={node.id}
                  draggable
                  onDragStart={() => handleDragStart(node)}
                  className={`p-3 border rounded-lg cursor-grab active:cursor-grabbing transition-colors ${getNodeColor(node.type)}`}
                >
                  <div className="flex items-start space-x-2">
                    <div className="p-1.5 rounded bg-white border">
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-sm truncate">{node.title}</h4>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {node.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 leading-tight">{node.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
