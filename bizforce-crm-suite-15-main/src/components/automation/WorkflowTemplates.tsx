
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Mail, 
  Users, 
  Target, 
  Clock, 
  Database,
  Zap,
  Search,
  Star,
  TrendingUp,
  MessageSquare,
  Phone,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  icon: any;
  nodes_count: number;
  estimated_time: string;
  use_cases: string[];
  preview_nodes: string[];
}

interface WorkflowTemplatesProps {
  onSelectTemplate: (template: WorkflowTemplate) => void;
}

export const WorkflowTemplates = ({ onSelectTemplate }: WorkflowTemplatesProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const templates: WorkflowTemplate[] = [
    {
      id: 'lead-welcome',
      name: 'Boas-vindas para Novos Leads',
      description: 'Sequência automática de emails de boas-vindas para novos leads capturados',
      category: 'Lead Management',
      complexity: 'beginner',
      icon: Mail,
      nodes_count: 4,
      estimated_time: '15 min',
      use_cases: ['Email Marketing', 'Lead Nurturing', 'Onboarding'],
      preview_nodes: ['Lead Criado', 'Aguardar 5min', 'Enviar Email', 'Marcar como Contactado']
    },
    {
      id: 'opportunity-followup',
      name: 'Follow-up de Oportunidades',
      description: 'Acompanhamento automático de oportunidades sem atividade recente',
      category: 'Sales',
      complexity: 'intermediate',
      icon: Target,
      nodes_count: 6,
      estimated_time: '25 min',
      use_cases: ['Gestão de Pipeline', 'Follow-up', 'Prevenção de Perda'],
      preview_nodes: ['Oportunidade Inativa', 'Verificar Último Contacto', 'Criar Tarefa', 'Notificar Manager']
    },
    {
      id: 'lead-scoring',
      name: 'Lead Scoring Automático',
      description: 'Sistema automático de pontuação de leads baseado em comportamento',
      category: 'Lead Management',
      complexity: 'advanced',
      icon: Star,
      nodes_count: 8,
      estimated_time: '45 min',
      use_cases: ['Qualificação', 'Priorização', 'Automação de Vendas'],
      preview_nodes: ['Atividade Detectada', 'Calcular Pontos', 'Verificar Threshold', 'Atribuir Vendedor']
    },
    {
      id: 'customer-onboarding',
      name: 'Onboarding de Clientes',
      description: 'Processo completo de onboarding para novos clientes',
      category: 'Customer Success',
      complexity: 'intermediate',
      icon: Users,
      nodes_count: 10,
      estimated_time: '35 min',
      use_cases: ['Onboarding', 'Retenção', 'Satisfação'],
      preview_nodes: ['Cliente Criado', 'Enviar Kit', 'Agendar Call', 'Criar Tarefas']
    },
    {
      id: 'meeting-reminder',
      name: 'Lembretes de Reunião',
      description: 'Lembretes automáticos antes de reuniões agendadas',
      category: 'Productivity',
      complexity: 'beginner',
      icon: Calendar,
      nodes_count: 3,
      estimated_time: '10 min',
      use_cases: ['Produtividade', 'Organização', 'Comunicação'],
      preview_nodes: ['Reunião Agendada', 'Aguardar Data', 'Enviar Lembrete']
    },
    {
      id: 'deal-approval',
      name: 'Aprovação de Negócios',
      description: 'Fluxo de aprovação para negócios acima de determinado valor',
      category: 'Approval',
      complexity: 'advanced',
      icon: TrendingUp,
      nodes_count: 7,
      estimated_time: '30 min',
      use_cases: ['Governança', 'Controle', 'Compliance'],
      preview_nodes: ['Valor > Limite', 'Notificar Manager', 'Aguardar Aprovação', 'Atualizar Status']
    },
    {
      id: 'support-escalation',
      name: 'Escalação de Suporte',
      description: 'Escalação automática de tickets de suporte não resolvidos',
      category: 'Support',
      complexity: 'intermediate',
      icon: MessageSquare,
      nodes_count: 5,
      estimated_time: '20 min',
      use_cases: ['Suporte', 'SLA', 'Escalação'],
      preview_nodes: ['Ticket Aberto', 'Verificar Tempo', 'Escalar', 'Notificar Cliente']
    },
    {
      id: 'data-sync',
      name: 'Sincronização de Dados',
      description: 'Sincronização automática entre sistemas externos',
      category: 'Integration',
      complexity: 'advanced',
      icon: Database,
      nodes_count: 6,
      estimated_time: '40 min',
      use_cases: ['Integração', 'Sincronização', 'Automação'],
      preview_nodes: ['Trigger Temporal', 'Buscar Dados', 'Transformar', 'Sincronizar']
    }
  ];

  const categories = ['all', 'Lead Management', 'Sales', 'Customer Success', 'Productivity', 'Approval', 'Support', 'Integration'];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.use_cases.some(useCase => useCase.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSelectTemplate = (template: WorkflowTemplate) => {
    toast({
      title: "Template Selecionado",
      description: `Carregando template: ${template.name}`
    });
    onSelectTemplate(template);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Pesquisar templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'Todas' : category}
            </Button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const Icon = template.icon;
          return (
            <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {template.category}
                      </Badge>
                    </div>
                  </div>
                  <Badge className={getComplexityColor(template.complexity)}>
                    {template.complexity}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm">{template.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{template.nodes_count} nós</span>
                  <span>⏱️ {template.estimated_time}</span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Casos de Uso:</h4>
                  <div className="flex flex-wrap gap-1">
                    {template.use_cases.map((useCase, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {useCase}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Preview:</h4>
                  <div className="text-xs text-gray-600">
                    {template.preview_nodes.join(' → ')}
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => handleSelectTemplate(template)}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Usar Template
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum template encontrado
          </h3>
          <p className="text-gray-600">
            Tente ajustar os filtros ou termo de pesquisa
          </p>
        </div>
      )}
    </div>
  );
};
