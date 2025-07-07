import { ChevronRight, Home } from 'lucide-react';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

interface BreadcrumbsProps {
  activeSection: string;
}

export const Breadcrumbs = ({ activeSection }: BreadcrumbsProps) => {
  const getSectionName = (section: string) => {
    const sectionNames: Record<string, string> = {
      'dashboard': 'Dashboard',
      'calendar': 'Calendário',
      'accounts': 'Contas',
      'contacts': 'Contatos',
      'opportunities': 'Oportunidades',
      'activities': 'Atividades',
      'sales': 'Centro de Vendas',
      'campaigns': 'Campanhas',
      'products': 'Produtos',
      'quotes': 'Orçamentos',
      'territories': 'Territórios',
      'ai-assistant': 'Assistente IA',
      'lead-scoring': 'Lead Scoring IA',
      'revenue-intelligence': 'Revenue Intelligence',
      'customer-journey': 'Customer Journey',
      'multi-channel': 'Multi-Canal',
      'ai-analytics': 'AI Analytics',
      'email-intelligence': 'Email Intelligence',
      'automation': 'Automação',
      'workflows': 'Process Builder',
      'reports': 'Relatórios',
      'dashboards': 'Dashboard Builder',
      'service': 'Atendimento',
      'mobile': 'App Mobile',
      'settings': 'Configurações',
      'approvals': 'Sistema de Aprovações',
      'audit': 'Trilha de Auditoria',
      'integrations': 'Hub de Integrações',
      'roles': 'Gestão de Roles',
      'tasks': 'Gestão de Tarefas',
      'documents': 'Documentos',
      'notifications': 'Notificações',
      'chat': 'Chat da Equipa',
      'advanced-workflows': 'Advanced Workflows',
      'advanced-analytics': 'Advanced Analytics',
      'advanced-integrations': 'Advanced Integrations',
      'enhanced-mobile': 'Enhanced Mobile'
    };
    return sectionNames[section] || section;
  };

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/?section=dashboard" className="flex items-center">
            <Home className="h-4 w-4 mr-1" />
            Início
          </BreadcrumbLink>
        </BreadcrumbItem>
        {activeSection !== 'dashboard' && (
          <>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>{getSectionName(activeSection)}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
