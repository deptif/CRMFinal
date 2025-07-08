import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { EditModeProvider } from '@/components/EditModeProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { KPICards } from '@/components/KPICards';
import { SalesChart } from '@/components/SalesChart';
import { RecentOpportunities } from '@/components/RecentOpportunities';
import { ActivityFeed } from '@/components/ActivityFeed';
import { AccountsPage } from '@/components/accounts/AccountsPage';
import { ContactsPage } from '@/components/contacts/ContactsPage';
import { OpportunitiesPage } from '@/components/opportunities/OpportunitiesPage';
import { ActivitiesPage } from '@/components/activities/ActivitiesPage';
import { SalesPage } from '@/components/sales/SalesPage';
import { CampaignsPage } from '@/components/campaigns/CampaignsPage';
import { ProductsPage } from '@/components/products/ProductsPage';
import { QuotesPage } from '@/components/quotes/QuotesPage';
import { TerritoriesPage } from '@/components/territories/TerritoriesPage';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { AIAnalytics } from '@/components/ai/AIAnalytics';
import { EmailIntelligence } from '@/components/ai/EmailIntelligence';
import { AutomationPage } from '@/components/automation/AutomationPage';
import { WorkflowBuilder } from '@/components/automation/WorkflowBuilder';
import { AdvancedWorkflowBuilder } from '@/components/automation/AdvancedWorkflowBuilder';
import { AdvancedAnalyticsDashboard } from '@/components/analytics/AdvancedAnalyticsDashboard';
import { AdvancedIntegrationsHub } from '@/components/integrations/AdvancedIntegrationsHub';
import { EnhancedMobileExperience } from '@/components/mobile/EnhancedMobileExperience';
import { ReportsPage } from '@/components/reports/ReportsPage';
import { DashboardBuilder } from '@/components/dashboard/DashboardBuilder';
import { ServicePage } from '@/components/service/ServicePage';
import { MobilePreview } from '@/components/mobile/MobilePreview';
import { SettingsPage } from '@/components/settings/SettingsPage';
import { ApprovalSystem } from '@/components/enterprise/ApprovalSystem';
import { AuditTrail } from '@/components/enterprise/AuditTrail';
import { IntegrationsHub } from '@/components/integrations/IntegrationsHub';
import { RolesManager } from '@/components/admin/RolesManager';
import { TasksPage } from '@/pages/TasksPage';
import { DocumentsPage } from '@/pages/DocumentsPage';
import { NotificationsPage } from '@/pages/NotificationsPage';
import { ChatPage } from '@/pages/ChatPage';
import { LeadScoringPage } from '@/pages/LeadScoringPage';
import { RevenueIntelligencePage } from '@/pages/RevenueIntelligencePage';
import { CustomerJourneyPage } from '@/pages/CustomerJourneyPage';
import { MultiChannelPage } from '@/pages/MultiChannelPage';
import { IntelligentDashboard } from '@/components/IntelligentDashboard';
import { PersonalizableDashboard } from '@/components/dashboard/PersonalizableDashboard';
import { PersonalizedDashboard } from '@/components/dashboard/PersonalizedDashboard';
import { AutomatedLeadScoring } from '@/components/ai/AutomatedLeadScoring';
import { SmartNotifications } from '@/components/notifications/SmartNotifications';
import { EnhancedActivityFeed } from '@/components/activities/EnhancedActivityFeed';
import { DragDropKanbanBoard } from '@/components/tasks/DragDropKanbanBoard';
import { DocumentManager } from '@/components/documents/DocumentManager';
import { EnhancedChatCenter } from '@/components/chat/EnhancedChatCenter';
import { MultiChannelAutomation } from '@/components/automation/MultiChannelAutomation';
import { GlobalSearch } from '@/components/search/GlobalSearch';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { CustomizationPage } from '@/pages/CustomizationPage';
import { TerritoryManagement } from '@/components/sales/TerritoryManagement';
import { AdvancedForecasting } from '@/components/sales/AdvancedForecasting';
import { FieldLevelSecurity } from '@/components/admin/FieldLevelSecurity';
import { UsersManagement } from '@/components/users/UsersManagement';
import { AccountActivation } from '@/components/auth/AccountActivation';
import { DashboardBuilder as DashboardBuilderComponent } from '@/components/dashboard-builder/DashboardBuilder';
import { ApplicationManagementPage } from '@/pages/ApplicationManagementPage';
import { AppLauncherPage } from '@/pages/AppLauncherPage';
import { useSupabaseApplications } from '@/hooks/useSupabaseApplications';
import { Application } from '@/types';
import { SidebarGroup } from '@/components/sidebar/SidebarGroup';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Target, 
  Calendar, 
  FileText, 
  Settings, 
  Wrench, 
  Menu,
  AppWindow,
  Megaphone,
  Package,
  TrendingUp,
  Map,
  Route,
  MessageSquare,
  CheckCircle,
  FolderOpen
} from 'lucide-react';

// Função para calcular a cor de contraste (branco ou preto) com base na cor de fundo
const getContrastColor = (hexColor: string): string => {
  // Remover o # se existir
  const color = hexColor.startsWith('#') ? hexColor.substring(1) : hexColor;
  
  // Converter para RGB
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  
  // Calcular luminância
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Retornar branco para cores escuras e preto para cores claras
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

export default function Index() {
  const [activeSection, setActiveSection] = useState('app-launcher');
  const [activeApp, setActiveApp] = useState<Application | null>(null);
  const { applications, isLoading } = useSupabaseApplications();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const section = searchParams.get('section');
    const appId = searchParams.get('appId');
    
    if (section) {
      setActiveSection(section);
    }
    
    if (appId && applications.length > 0) {
      const app = applications.find(a => a.id === appId);
      if (app) {
        setActiveApp(app);
      }
    }
  }, [location, applications]);

  // Função para mudar a seção ativa e atualizar a URL
  const handleSectionChange = (section: string) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('section', section);
    
    // Se tivermos uma aplicação ativa, mantemos o appId na URL
    if (activeApp) {
      searchParams.set('appId', activeApp.id);
    } else {
      searchParams.delete('appId');
    }
    
    navigate(`?${searchParams.toString()}`);
    setActiveSection(section);
  };

  // Função para sair da aplicação atual
  const handleExitApp = () => {
    setActiveApp(null);
    navigate('?section=app-launcher');
    setActiveSection('app-launcher');
  };

  // Função para selecionar uma aplicação
  const handleSelectApp = (app: Application) => {
    setActiveApp(app);
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('appId', app.id);
    
    // Usar a visualização padrão da aplicação, se disponível
    const defaultView = app.default_view || 'dashboard';
    searchParams.set('section', defaultView);
    
    navigate(`?${searchParams.toString()}`);
    setActiveSection(defaultView);
  };

  // Definir os grupos de menu para a barra lateral
  const appMenuGroups = [
    {
      title: "Aplicação",
      items: [
        { name: "Dashboard", icon: LayoutDashboard, section: "dashboard" }
      ]
    },
    {
      title: "CRM Principal",
      items: [
        { name: "Contas", icon: Building2, section: "accounts" },
        { name: "Contactos", icon: Users, section: "contacts" },
        { name: "Oportunidades", icon: Target, section: "opportunities" },
        { name: "Atividades", icon: Calendar, section: "activities" },
        { name: "Campanhas", icon: Megaphone, section: "campaigns" },
        { name: "Produtos", icon: Package, section: "products" },
        { name: "Orçamentos", icon: FileText, section: "quotes" }
      ]
    },
    {
      title: "Vendas",
      items: [
        { name: "Pipeline", icon: TrendingUp, section: "sales" },
        { name: "Previsões", icon: TrendingUp, section: "forecasting" },
        { name: "Territórios", icon: Map, section: "territories" }
      ]
    },
    {
      title: "Marketing",
      items: [
        { name: "Jornada Cliente", icon: Route, section: "customer-journey" },
        { name: "Multi-Canal", icon: MessageSquare, section: "multi-channel" }
      ]
    },
    {
      title: "Colaboração",
      items: [
        { name: "Chat Equipa", icon: MessageSquare, section: "chat" },
        { name: "Tarefas", icon: CheckCircle, section: "tasks" },
        { name: "Documentos", icon: FolderOpen, section: "documents" }
      ]
    },
    {
      title: "Configuração",
      items: [
        { name: "Personalização", icon: Wrench, section: "customization" },
        { name: "Configurações", icon: Settings, section: "settings" }
      ]
    }
  ];

  const getAppMenuGroups = () => {
    if (!activeApp || !activeApp.objects) {
      return appMenuGroups;
    }
    
    // Se a aplicação tem objetos personalizados definidos, use-os
    if (Object.keys(activeApp.objects).length > 0) {
      try {
        // Converte os objetos personalizados para o formato esperado pelo menu
        const customObjects = activeApp.objects as Record<string, unknown>;
        // Implementação simplificada - em uma versão real, processaríamos os objetos personalizados
        // e converteríamos para o formato correto do menu
        return appMenuGroups;
      } catch (error) {
        console.error('Erro ao processar objetos personalizados:', error);
      }
    }
    
    return appMenuGroups;
  };

  const renderContent = () => {
    // Se não houver aplicação ativa e não estamos na página de gerenciamento de aplicações,
    // mostrar a página inicial de lançador de aplicações
    if (!activeApp && activeSection !== 'application-management') {
      return <AppLauncherPage onSelectApp={handleSelectApp} />;
    }

    // Se estivermos na página de gerenciamento de aplicações, mostrar essa página
    if (activeSection === 'application-management') {
      return <ApplicationManagementPage />;
    }

    // Se houver uma aplicação ativa, mostrar o conteúdo da seção
    switch (activeSection) {
      case 'dashboard':
        return <IntelligentDashboard />;
      case 'dashboards':
        return <PersonalizedDashboard />;
      case 'dashboard-builder':
        return <DashboardBuilderComponent />;
      case 'accounts':
        return <AccountsPage />;
      case 'contacts':
        return <ContactsPage />;
      case 'opportunities':
        return <OpportunitiesPage />;
      case 'activities':
        return <EnhancedActivityFeed />;
      case 'sales':
        return <SalesPage />;
      case 'campaigns':
        return <CampaignsPage />;
      case 'products':
        return <ProductsPage />;
      case 'quotes':
        return <QuotesPage />;
      case 'territories':
        return <TerritoriesPage />;
      case 'forecasting':
        return <AdvancedForecasting />;
      case 'field-security':
        return <FieldLevelSecurity />;
      case 'ai-assistant':
        return <AIAssistant />;
      case 'lead-scoring':
        return <AutomatedLeadScoring />;
      case 'revenue-intelligence':
        return <RevenueIntelligencePage />;
      case 'customer-journey':
        return <CustomerJourneyPage />;
      case 'multi-channel':
        return <MultiChannelAutomation />;
      case 'ai-analytics':
        return <AIAnalytics />;
      case 'email-intelligence':
        return <EmailIntelligence />;
      case 'automation':
        return <AutomationPage />;
      case 'workflows':
        return <AdvancedWorkflowBuilder />;
      case 'customization':
        return <CustomizationPage />;
      case 'reports':
        return <ReportsPage />;
      case 'analytics':
        return <AdvancedAnalyticsDashboard />;
      case 'service':
        return <ServicePage />;
      case 'chat':
        return <EnhancedChatCenter />;
      case 'tasks':
        return <DragDropKanbanBoard />;
      case 'documents':
        return <DocumentManager />;
      case 'approvals':
        return <ApprovalSystem />;
      case 'audit':
        return <AuditTrail />;
      case 'integrations':
        return <AdvancedIntegrationsHub />;
      case 'roles':
        return <RolesManager />;
      case 'mobile':
        return <EnhancedMobileExperience />;
      case 'notifications':
        return <SmartNotifications />;
      case 'settings':
        return <SettingsPage />;
      case 'users':
        return <UsersManagement />;
      case 'account-activation':
        return <AccountActivation />;
      default:
        return <AppLauncherPage onSelectApp={handleSelectApp} />;
    }
  };

  return (
    <ThemeProvider>
      <EditModeProvider>
        <SidebarProvider>
          <div 
            className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex flex-col w-full"
            style={activeApp?.theme_color ? {
              '--primary-color': activeApp.theme_color,
              '--primary-foreground': getContrastColor(activeApp.theme_color)
            } as React.CSSProperties : {}}
          >
            <Header 
              onSectionChange={handleSectionChange} 
              activeSection={activeSection}
              activeApp={activeApp}
              onExitApp={handleExitApp}
            >
              <div className="flex items-center space-x-4 flex-1 max-w-2xl">
                {activeApp && <GlobalSearch />}
              </div>
            </Header>
            
            <div className="flex flex-1">
              {/* Barra lateral - só aparece quando uma aplicação está ativa */}
              {activeApp && (
                <Sidebar className="border-r border-gray-200 dark:border-gray-700">
                  <SidebarContent>
                    <div className="py-2 px-3">
                      <div className="flex items-center space-x-2 mb-4">
                        <AppWindow className="h-5 w-5 text-primary" />
                        <span className="font-medium truncate">{activeApp.name}</span>
                      </div>
                    </div>
                    {getAppMenuGroups().map((group, index) => (
                      <SidebarGroup 
                        key={index} 
                        group={group} 
                        activeSection={activeSection} 
                        onSectionChange={handleSectionChange} 
                      />
                    ))}
                  </SidebarContent>
                </Sidebar>
              )}
              
              <main className={`p-6 flex-1 ${!activeApp ? 'w-full' : ''}`}>
                {activeApp && <Breadcrumbs activeSection={activeSection} appName={activeApp.name} />}
                <div className={`${activeApp ? 'mt-6' : ''}`}>
                  {renderContent()}
                </div>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </EditModeProvider>
    </ThemeProvider>
  );
}
