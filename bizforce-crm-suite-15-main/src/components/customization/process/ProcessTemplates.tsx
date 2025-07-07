
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Workflow, 
  Users, 
  Mail, 
  Target, 
  Clock, 
  Database,
  CheckCircle,
  AlertTriangle,
  Search,
  Eye,
  Copy,
  Play
} from 'lucide-react';

interface ProcessTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  steps: number;
  features: string[];
}

interface ProcessTemplatesProps {
  onSelectTemplate: (template: ProcessTemplate) => void;
}

export const ProcessTemplates = ({ onSelectTemplate }: ProcessTemplatesProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const templates: ProcessTemplate[] = [
    {
      id: 'lead_qualification',
      name: 'Qualificação de Lead',
      description: 'Processo automatizado para qualificar leads baseado em critérios de pontuação',
      category: 'sales',
      icon: Target,
      difficulty: 'beginner',
      estimatedTime: '15 min',
      steps: 5,
      features: ['Pontuação automática', 'Atribuição de responsável', 'Notificações']
    },
    {
      id: 'opportunity_approval',
      name: 'Aprovação de Oportunidade',
      description: 'Fluxo de aprovação para oportunidades acima de determinado valor',
      category: 'sales',
      icon: CheckCircle,
      difficulty: 'intermediate',
      estimatedTime: '20 min',
      steps: 7,
      features: ['Aprovação hierárquica', 'Prazos automáticos', 'Escalation']
    },
    {
      id: 'customer_onboarding',
      name: 'Onboarding de Cliente',
      description: 'Sequência de ações para integração de novos clientes',
      category: 'customer_success',
      icon: Users,
      difficulty: 'advanced',
      estimatedTime: '30 min',
      steps: 12,
      features: ['Emails sequenciais', 'Tarefas automáticas', 'Follow-up']
    },
    {
      id: 'contract_renewal',
      name: 'Renovação de Contrato',
      description: 'Processo automatizado para renovação de contratos próximos ao vencimento',
      category: 'customer_success',
      icon: Clock,
      difficulty: 'intermediate',
      estimatedTime: '25 min',
      steps: 8,
      features: ['Alertas antecipados', 'Propostas automáticas', 'Follow-up']
    },
    {
      id: 'support_escalation',
      name: 'Escalation de Suporte',
      description: 'Escalation automática de tickets baseada em SLA e prioridade',
      category: 'support',
      icon: AlertTriangle,
      difficulty: 'intermediate',
      estimatedTime: '20 min',
      steps: 6,
      features: ['SLA monitoring', 'Escalation hierárquica', 'Notificações']
    },
    {
      id: 'data_cleanup',
      name: 'Limpeza de Dados',
      description: 'Processo automatizado para identificar e corrigir dados duplicados',
      category: 'data_management',
      icon: Database,
      difficulty: 'advanced',
      estimatedTime: '40 min',
      steps: 10,
      features: ['Detecção de duplicatas', 'Merge automático', 'Relatórios']
    },
    {
      id: 'email_campaign',
      name: 'Campanha de Email',
      description: 'Sequência automatizada de emails baseada em comportamento do usuário',
      category: 'marketing',
      icon: Mail,
      difficulty: 'beginner',
      estimatedTime: '15 min',
      steps: 4,
      features: ['Segmentação', 'Personalização', 'Analytics']
    },
    {
      id: 'task_assignment',
      name: 'Atribuição de Tarefas',
      description: 'Distribuição inteligente de tarefas baseada em carga de trabalho',
      category: 'productivity',
      icon: Users,
      difficulty: 'intermediate',
      estimatedTime: '25 min',
      steps: 9,
      features: ['Load balancing', 'Skills matching', 'Priorização']
    }
  ];

  const categories = [
    { id: 'all', label: 'Todos', count: templates.length },
    { id: 'sales', label: 'Vendas', count: templates.filter(t => t.category === 'sales').length },
    { id: 'customer_success', label: 'Customer Success', count: templates.filter(t => t.category === 'customer_success').length },
    { id: 'support', label: 'Suporte', count: templates.filter(t => t.category === 'support').length },
    { id: 'marketing', label: 'Marketing', count: templates.filter(t => t.category === 'marketing').length },
    { id: 'data_management', label: 'Gestão de Dados', count: templates.filter(t => t.category === 'data_management').length },
    { id: 'productivity', label: 'Produtividade', count: templates.filter(t => t.category === 'productivity').length }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Iniciante';
      case 'intermediate': return 'Intermediário';
      case 'advanced': return 'Avançado';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Templates de Processo</h2>
          <p className="text-gray-600 dark:text-gray-400">Comece rapidamente com templates pré-configurados</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            className="pl-10 w-64"
            placeholder="Buscar templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-100 border-blue-300 text-blue-800'
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {category.label} ({category.count})
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const IconComponent = template.icon;
          return (
            <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getDifficultyColor(template.difficulty)} variant="outline">
                          {getDifficultyLabel(template.difficulty)}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {template.steps} passos • {template.estimatedTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {template.description}
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-900">Funcionalidades:</h4>
                  <div className="flex flex-wrap gap-1">
                    {template.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      console.log('Preview template:', template.id);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Visualizar
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => onSelectTemplate(template)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Usar Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Workflow className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum template encontrado</h3>
          <p className="text-gray-600">Tente ajustar os filtros ou termo de busca</p>
        </div>
      )}
    </div>
  );
};
