
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Mail, 
  Clock, 
  Database, 
  Users, 
  Target, 
  GitBranch,
  Zap,
  Phone,
  MessageSquare,
  Calendar,
  FileText,
  Star,
  Calculator,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Plus,
  Send,
  Webhook
} from 'lucide-react';

interface NodeType {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: 'trigger' | 'action' | 'condition' | 'delay';
  complexity: 'basic' | 'advanced';
  config_fields: string[];
}

interface WorkflowNodesLibraryProps {
  onNodeDragStart: (nodeType: NodeType) => void;
}

export const WorkflowNodesLibrary = ({ onNodeDragStart }: WorkflowNodesLibraryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const nodeTypes: NodeType[] = [
    // Triggers
    {
      id: 'lead_created',
      name: 'Novo Lead Criado',
      description: 'Disparado quando um novo lead é criado',
      icon: Plus,
      category: 'trigger',
      complexity: 'basic',
      config_fields: ['source', 'criteria']
    },
    {
      id: 'opportunity_stage_changed',
      name: 'Estágio Alterado',
      description: 'Quando uma oportunidade muda de estágio',
      icon: GitBranch,
      category: 'trigger',
      complexity: 'basic',
      config_fields: ['from_stage', 'to_stage']
    },
    {
      id: 'email_opened',
      name: 'Email Aberto',
      description: 'Quando um email é aberto pelo destinatário',
      icon: Mail,
      category: 'trigger',
      complexity: 'basic',
      config_fields: ['campaign', 'template']
    },
    {
      id: 'scheduled_time',
      name: 'Tempo Agendado',
      description: 'Executa em horário específico ou intervalo',
      icon: Clock,
      category: 'trigger',
      complexity: 'basic',
      config_fields: ['schedule', 'timezone']
    },
    {
      id: 'form_submitted',
      name: 'Formulário Enviado',
      description: 'Quando um formulário web é preenchido',
      icon: FileText,
      category: 'trigger',
      complexity: 'basic',
      config_fields: ['form_id', 'fields']
    },
    {
      id: 'webhook_received',
      name: 'Webhook Recebido',
      description: 'Quando dados são recebidos via webhook',
      icon: Webhook,
      category: 'trigger',
      complexity: 'advanced',
      config_fields: ['endpoint', 'authentication']
    },

    // Actions
    {
      id: 'send_email',
      name: 'Enviar Email',
      description: 'Envia email personalizado',
      icon: Mail,
      category: 'action',
      complexity: 'basic',
      config_fields: ['template', 'recipient', 'subject']
    },
    {
      id: 'create_task',
      name: 'Criar Tarefa',
      description: 'Cria tarefa para utilizador',
      icon: CheckCircle,
      category: 'action',
      complexity: 'basic',
      config_fields: ['title', 'assignee', 'due_date']
    },
    {
      id: 'update_field',
      name: 'Atualizar Campo',
      description: 'Atualiza valor de campo no registo',
      icon: Database,
      category: 'action',
      complexity: 'basic',
      config_fields: ['field', 'value', 'object']
    },
    {
      id: 'assign_owner',
      name: 'Atribuir Proprietário',
      description: 'Atribui registo a utilizador',
      icon: Users,
      category: 'action',
      complexity: 'basic',
      config_fields: ['user', 'criteria']
    },
    {
      id: 'make_phone_call',
      name: 'Fazer Chamada',
      description: 'Inicia chamada telefónica',
      icon: Phone,
      category: 'action',
      complexity: 'advanced',
      config_fields: ['number', 'script']
    },
    {
      id: 'send_sms',
      name: 'Enviar SMS',
      description: 'Envia mensagem SMS',
      icon: MessageSquare,
      category: 'action',
      complexity: 'basic',
      config_fields: ['number', 'message']
    },
    {
      id: 'create_meeting',
      name: 'Criar Reunião',
      description: 'Agenda reunião no calendário',
      icon: Calendar,
      category: 'action',
      complexity: 'basic',
      config_fields: ['attendees', 'date', 'duration']
    },
    {
      id: 'call_webhook',
      name: 'Chamar Webhook',
      description: 'Faz chamada HTTP para URL externa',
      icon: Zap,
      category: 'action',
      complexity: 'advanced',
      config_fields: ['url', 'method', 'payload']
    },
    {
      id: 'calculate_score',
      name: 'Calcular Score',
      description: 'Calcula pontuação baseada em critérios',
      icon: Calculator,
      category: 'action',
      complexity: 'advanced',
      config_fields: ['formula', 'fields']
    },

    // Conditions
    {
      id: 'field_equals',
      name: 'Campo Igual a',
      description: 'Verifica se campo tem valor específico',
      icon: Filter,
      category: 'condition',
      complexity: 'basic',
      config_fields: ['field', 'value', 'operator']
    },
    {
      id: 'score_threshold',
      name: 'Score Acima de',
      description: 'Verifica se score está acima do limite',
      icon: Star,
      category: 'condition',
      complexity: 'basic',
      config_fields: ['score_field', 'threshold']
    },
    {
      id: 'date_comparison',
      name: 'Comparação de Data',
      description: 'Compara datas (antes/depois)',
      icon: Calendar,
      category: 'condition',
      complexity: 'basic',
      config_fields: ['date_field', 'comparison', 'reference_date']
    },
    {
      id: 'list_membership',
      name: 'Membro da Lista',
      description: 'Verifica se está em lista específica',
      icon: Users,
      category: 'condition',
      complexity: 'basic',
      config_fields: ['list_id']
    },
    {
      id: 'complex_logic',
      name: 'Lógica Complexa',
      description: 'Condição com múltiplos critérios',
      icon: GitBranch,
      category: 'condition',
      complexity: 'advanced',
      config_fields: ['conditions', 'logic_operator']
    },

    // Delays
    {
      id: 'wait_time',
      name: 'Aguardar Tempo',
      description: 'Pausa por período específico',
      icon: Clock,
      category: 'delay',
      complexity: 'basic',
      config_fields: ['duration', 'unit']
    },
    {
      id: 'wait_condition',
      name: 'Aguardar Condição',
      description: 'Pausa até condição ser atendida',
      icon: AlertTriangle,
      category: 'delay',
      complexity: 'advanced',
      config_fields: ['condition', 'timeout']
    }
  ];

  const categories = [
    { id: 'all', name: 'Todos', count: nodeTypes.length },
    { id: 'trigger', name: 'Triggers', count: nodeTypes.filter(n => n.category === 'trigger').length },
    { id: 'action', name: 'Actions', count: nodeTypes.filter(n => n.category === 'action').length },
    { id: 'condition', name: 'Conditions', count: nodeTypes.filter(n => n.category === 'condition').length },
    { id: 'delay', name: 'Delays', count: nodeTypes.filter(n => n.category === 'delay').length }
  ];

  const filteredNodes = nodeTypes.filter(node => {
    const matchesSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         node.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || node.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'trigger': return 'bg-green-100 text-green-800 border-green-200';
      case 'action': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'condition': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'delay': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleDragStart = (event: React.DragEvent, node: NodeType) => {
    event.dataTransfer.setData('nodeType', node.category);
    event.dataTransfer.setData('nodeName', node.name);
    event.dataTransfer.setData('nodeDescription', node.description);
    onNodeDragStart(node);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Biblioteca de Nós</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Pesquisar nós..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Categories */}
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Nodes List */}
        <ScrollArea className="h-96">
          <div className="px-4 space-y-2">
            {filteredNodes.map((node) => {
              const Icon = node.icon;
              return (
                <div
                  key={node.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, node)}
                  className="p-3 border rounded-lg cursor-grab hover:shadow-sm transition-shadow bg-white"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getCategoryColor(node.category)}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{node.name}</h4>
                        <div className="flex items-center space-x-1">
                          <Badge variant="outline" className="text-xs">
                            {node.category}
                          </Badge>
                          {node.complexity === 'advanced' && (
                            <Badge variant="secondary" className="text-xs">
                              Avançado
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{node.description}</p>
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">
                          Configurações: {node.config_fields.join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {filteredNodes.length === 0 && (
          <div className="text-center py-8 px-4">
            <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Nenhum nó encontrado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
