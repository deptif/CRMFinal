
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, Users, Target, Calendar, TrendingUp, FileText, 
  Settings, Navigation, Search, Lightbulb, Plus, Zap
} from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  icon: any;
  prompt: string;
  category: 'help' | 'search' | 'create' | 'navigate' | 'analyze';
  color: string;
}

interface QuickActionsPanelProps {
  onActionClick: (action: QuickAction) => void;
}

export const QuickActionsPanel = ({ onActionClick }: QuickActionsPanelProps) => {
  const quickActions: QuickAction[] = [
    // Navegação
    {
      id: 'nav-dashboard',
      title: 'Dashboard',
      icon: Navigation,
      prompt: 'Ir para o dashboard principal',
      category: 'navigate',
      color: 'blue'
    },
    {
      id: 'nav-accounts',
      title: 'Clientes',
      icon: Building2,
      prompt: 'Ir para gestão de clientes',
      category: 'navigate',
      color: 'blue'
    },
    {
      id: 'nav-opportunities',
      title: 'Oportunidades',
      icon: Target,
      prompt: 'Ir para oportunidades de vendas',
      category: 'navigate',
      color: 'blue'
    },
    
    // Criação rápida
    {
      id: 'create-account',
      title: 'Novo Cliente',
      icon: Plus,
      prompt: 'Criar um novo cliente',
      category: 'create',
      color: 'green'
    },
    {
      id: 'create-contact',
      title: 'Novo Contato',
      icon: Plus,
      prompt: 'Adicionar um novo contato',
      category: 'create',
      color: 'green'
    },
    {
      id: 'schedule-meeting',
      title: 'Agendar Reunião',
      icon: Calendar,
      prompt: 'Agendar uma nova reunião',
      category: 'create',
      color: 'green'
    },
    
    // Pesquisa
    {
      id: 'search-accounts',
      title: 'Buscar Clientes',
      icon: Search,
      prompt: 'Buscar clientes no sistema',
      category: 'search',
      color: 'purple'
    },
    {
      id: 'top-opportunities',
      title: 'Top Oportunidades',
      icon: TrendingUp,
      prompt: 'Mostrar as maiores oportunidades',
      category: 'search',
      color: 'purple'
    },
    
    // Análise
    {
      id: 'sales-metrics',
      title: 'Métricas Vendas',
      icon: TrendingUp,
      prompt: 'Analisar performance de vendas',
      category: 'analyze',
      color: 'orange'
    },
    {
      id: 'ai-insights',
      title: 'Insights IA',
      icon: Lightbulb,
      prompt: 'Gerar insights inteligentes sobre os dados',
      category: 'analyze',
      color: 'orange'
    },
    
    // Ajuda
    {
      id: 'help-navigation',
      title: 'Como Navegar',
      icon: Navigation,
      prompt: 'Como navegar no sistema BizForce?',
      category: 'help',
      color: 'gray'
    },
    {
      id: 'system-features',
      title: 'Funcionalidades',
      icon: Zap,
      prompt: 'Quais são as principais funcionalidades do sistema?',
      category: 'help',
      color: 'gray'
    }
  ];

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'navigate': return 'Navegação';
      case 'create': return 'Criar';
      case 'search': return 'Pesquisar';
      case 'analyze': return 'Analisar';
      case 'help': return 'Ajuda';
      default: return category;
    }
  };

  const getCategoryColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100';
      case 'green': return 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100';
      case 'purple': return 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100';
      case 'orange': return 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100';
      case 'gray': return 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100';
      default: return 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100';
    }
  };

  const groupedActions = quickActions.reduce((acc, action) => {
    if (!acc[action.category]) {
      acc[action.category] = [];
    }
    acc[action.category].push(action);
    return acc;
  }, {} as Record<string, QuickAction[]>);

  return (
    <div className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Ações Rápidas</h3>
        <Badge variant="secondary" className="text-xs">
          <Zap className="h-3 w-3 mr-1" />
          Ativa
        </Badge>
      </div>
      
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {Object.entries(groupedActions).map(([category, actions]) => (
          <div key={category}>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
              {getCategoryTitle(category)}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {actions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.id}
                    variant="outline"
                    size="sm"
                    className={`justify-start text-xs h-auto py-2 px-3 ${getCategoryColor(action.color)} transition-all duration-200 border`}
                    onClick={() => onActionClick(action)}
                  >
                    <Icon className="h-3 w-3 mr-2 flex-shrink-0" />
                    <span className="truncate">{action.title}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
