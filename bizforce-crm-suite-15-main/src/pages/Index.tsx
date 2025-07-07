import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '@/components/Header';
import { EditModeProvider } from '@/components/EditModeProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
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
import { IntelligentDashboard } from '@/components/dashboard/IntelligentDashboard';
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

export default function Index() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const section = searchParams.get('section');
    if (section) {
      setActiveSection(section);
    }
  }, [location]);

  const renderContent = () => {
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
      case 'application-management':
        return <ApplicationManagementPage />;
      default:
        return <PersonalizableDashboard />;
    }
  };

  return (
    <ThemeProvider>
      <EditModeProvider>
        <SidebarProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex flex-col w-full">
            <Header onSectionChange={setActiveSection} activeSection={activeSection}>
              <div className="flex items-center space-x-4 flex-1 max-w-2xl">
                <GlobalSearch />
              </div>
            </Header>
            
            <main className="p-6 flex-1">
              <Breadcrumbs activeSection={activeSection} />
              <div className="mt-6">
                {renderContent()}
              </div>
            </main>
          </div>
        </SidebarProvider>
      </EditModeProvider>
    </ThemeProvider>
  );
}
