import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Settings, 
  Plus, 
  Layout, 
  Database,
  Workflow,
  Eye,
  FileType,
  Calculator,
  CheckCircle,
  Shield,
  Map,
  BarChart3,
  Zap,
  GitBranch,
  ChevronRight,
  Activity,
  Lock,
  Monitor
} from 'lucide-react';
import { CustomFieldsManager } from './CustomFieldsManager';
import { PageLayoutBuilder } from './PageLayoutBuilder';
import { CustomObjectsManager } from './CustomObjectsManager';
import { BusinessProcessBuilder } from './BusinessProcessBuilder';
import { RecordTypesManager } from './RecordTypesManager';
import { FieldValidationBuilder } from './FieldValidationBuilder';
import { EnhancedFormulaBuilder } from './formula/EnhancedFormulaBuilder';
import { IntegrationManager } from './IntegrationManager';
import { FieldLevelSecurity } from '../admin/FieldLevelSecurity';
import { TerritoryManagement } from '../admin/TerritoryManagement';
import { SecurityAuditTrail } from '../admin/SecurityAuditTrail';
import { DataEncryptionSettings } from '../admin/DataEncryptionSettings';
import { SessionManagement } from '../admin/SessionManagement';

export const CustomizationHub = () => {
  // Definir abas principais (visíveis) e secundárias (no dropdown)
  const primaryTabs = [
    {
      value: 'formulas',
      icon: Zap,
      label: 'Fórmulas Enterprise'
    },
    {
      value: 'fields',
      icon: Database,
      label: 'Custom Fields'
    },
    {
      value: 'validations',
      icon: CheckCircle,
      label: 'Validações'
    },
    {
      value: 'record-types',
      icon: FileType,
      label: 'Record Types'
    },
    {
      value: 'layouts',
      icon: Layout,
      label: 'Page Layouts'
    }
  ];

  const secondaryTabs = [
    {
      value: 'objects',
      icon: Settings,
      label: 'Custom Objects'
    },
    {
      value: 'processes',
      icon: Workflow,
      label: 'Business Processes'
    },
    {
      value: 'integration',
      icon: GitBranch,
      label: 'Integração & Deploy'
    },
    {
      value: 'security',
      icon: Shield,
      label: 'Security',
      children: [
        { value: 'field-security', icon: Shield, label: 'Field-Level Security' },
        { value: 'territory-management', icon: Map, label: 'Territory Management' },
        { value: 'audit-trail', icon: Activity, label: 'Security Audit Trail' },
        { value: 'encryption', icon: Lock, label: 'Data Encryption' },
        { value: 'sessions', icon: Monitor, label: 'Session Management' },
        { value: 'security-analytics', icon: BarChart3, label: 'Security Analytics' },
      ]
    }
  ];

  const [activeTab, setActiveTab] = useState('formulas');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState(secondaryTabs);
  const [menuHistory, setMenuHistory] = useState([]);

  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  const handleMenuItemClick = (item) => {
    if (item.children) {
      setMenuHistory([...menuHistory, currentMenu]);
      setCurrentMenu(item.children);
    } else {
      setActiveTab(item.value);
      // Close dropdown after selecting a leaf item
      setIsDropdownOpen(false); 
    }
  };

  const handleBackClick = () => {
    const previousMenu = menuHistory.pop();
    setMenuHistory([...menuHistory]);
    setCurrentMenu(previousMenu || secondaryTabs);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Centro de Personalização Enterprise</h1>
          <p className="text-gray-600 dark:text-gray-400">Configure campos, layouts, validações, fórmulas avançadas e processos empresariais</p>
        </div>
        <Button variant="outline" onClick={togglePreviewMode}>
          <Eye className="h-4 w-4 mr-2" />
          Preview Mode
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center space-x-1">
          <TabsList className="inline-flex h-12 p-1 bg-muted/50">
            {primaryTabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.value}
                  value={tab.value} 
                  className="flex items-center space-x-2 px-4 py-2 h-10 whitespace-nowrap rounded-md text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
          
          <DropdownMenu onOpenChange={(open) => {
            setIsDropdownOpen(open);
            if (!open) { // Reset menu when dropdown closes
              setCurrentMenu(secondaryTabs);
              setMenuHistory([]);
            }
          }}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-12 px-3 bg-muted/50 hover:bg-muted border-0"
              >
                <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${
                  isDropdownOpen ? 'animate-pulse' : ''
                }`} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-background border shadow-lg">
              {menuHistory.length > 0 && (
                <DropdownMenuItem onClick={handleBackClick} className="flex items-center space-x-2 px-3 py-2 cursor-pointer hover:bg-accent">
                  <ChevronRight className="h-4 w-4 rotate-180" />
                  <span>Voltar</span>
                </DropdownMenuItem>
              )}
              {currentMenu.map((item) => {
                const IconComponent = item.icon;
                return (
                  <DropdownMenuItem 
                    key={item.value}
                    onClick={() => handleMenuItemClick(item)}
                    className="flex items-center justify-between space-x-2 px-3 py-2 cursor-pointer hover:bg-accent"
                  >
                    <div className="flex items-center space-x-2">
                      <IconComponent className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.children && <ChevronRight className="h-4 w-4" />}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <TabsContent value="formulas" className="space-y-6">
          <EnhancedFormulaBuilder />
        </TabsContent>

        <TabsContent value="fields" className="space-y-6">
          <CustomFieldsManager />
        </TabsContent>

        <TabsContent value="validations" className="space-y-6">
          <FieldValidationBuilder />
        </TabsContent>

        <TabsContent value="record-types" className="space-y-6">
          <RecordTypesManager />
        </TabsContent>

        <TabsContent value="layouts" className="space-y-6">
          <PageLayoutBuilder />
        </TabsContent>

        <TabsContent value="objects" className="space-y-6">
          <CustomObjectsManager />
        </TabsContent>

        <TabsContent value="processes" className="space-y-6">
          <BusinessProcessBuilder />
        </TabsContent>

        <TabsContent value="integration" className="space-y-6">
          <IntegrationManager />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('field-security')}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-6 w-6 mr-3 text-blue-600" />
                  Field-Level Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Configure permissões granulares para campos sensíveis e dados confidenciais
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('territory-management')}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Map className="h-6 w-6 mr-3 text-green-600" />
                  Territory Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Gerir territórios de vendas e atribuições de contas por região ou critério
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('audit-trail')}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-6 w-6 mr-3 text-purple-600" />
                  Security Audit Trail
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Monitor e auditoria completa de todas as atividades de segurança do sistema
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('encryption')}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="h-6 w-6 mr-3 text-red-600" />
                  Data Encryption
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Configurar encriptação de dados, gestão de chaves e compliance
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('sessions')}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Monitor className="h-6 w-6 mr-3 text-orange-600" />
                  Session Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Gerir sessões ativas, timeouts e políticas de autenticação
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-6 w-6 mr-3 text-indigo-600" />
                  Security Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Análise avançada de padrões de segurança e relatórios de compliance
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="field-security" className="space-y-6">
          <FieldLevelSecurity />
        </TabsContent>

        <TabsContent value="territory-management" className="space-y-6">
          <TerritoryManagement />
        </TabsContent>

        <TabsContent value="audit-trail" className="space-y-6">
          <SecurityAuditTrail />
        </TabsContent>

        <TabsContent value="encryption" className="space-y-6">
          <DataEncryptionSettings />
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <SessionManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};
