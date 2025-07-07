
import React from 'react';
import { Bell, Settings, User, LogOut, Building2, Sun, Moon, Menu, AppWindow, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useApplications } from '@/contexts/ApplicationContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { menuConfig } from './sidebar/MenuConfig';
import type { MenuItem, MenuGroup } from './sidebar/MenuConfig';
import { getLucideIcon } from '@/lib/utils';

interface HeaderProps {
  children?: React.ReactNode;
  onSectionChange: (section: string) => void;
  activeSection: string;
}

const ApplicationCard = ({ app, onSectionChange, isActive }) => (
  <div
    onClick={() => onSectionChange(app.section)}
    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
      isActive ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
    }`}
  >
    <div className="flex items-start space-x-3">
      <div className={`p-2 rounded-lg ${app.color || 'bg-blue-500'}`}>
        <app.icon className="h-6 w-6 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">{app.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{app.description}</p>
      </div>
    </div>
  </div>
);

const MenuItemButton = ({ item, onSectionChange, isActive }) => (
  <button
    onClick={() => onSectionChange(item.section)}
    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
      isActive 
        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
    }`}
  >
    <item.icon className="h-5 w-5 flex-shrink-0" />
    <span className="truncate">{item.name}</span>
  </button>
);

const MenuContent = ({ activeSection, onSectionChange, dynamicMenuConfig }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Separar aplicativos de funcionalidades
  const applications = dynamicMenuConfig.find(group => group.title === "Minhas Aplicações")?.items || [];
  const otherMenuGroups = dynamicMenuConfig.filter(group => group.title !== "Minhas Aplicações");
  
  // Filtrar baseado na pesquisa
  const filteredApplications = applications.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredMenuGroups = otherMenuGroups.map(group => ({
    ...group,
    items: group.items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  // Converter aplicações para o formato de card
  const applicationCards = filteredApplications.map(app => {
    const colors = [
      'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 
      'bg-red-500', 'bg-teal-500', 'bg-indigo-500', 'bg-pink-500'
    ];
    return {
      ...app,
      color: colors[Math.floor(Math.random() * colors.length)],
      description: getAppDescription(app.name)
    };
  });

  return (
    <>
      <DialogHeader className="border-b p-6">
        <div className="flex items-center justify-between">
          <div>
            <DialogTitle className="text-xl font-semibold">Iniciador de aplicativos</DialogTitle>
          </div>
          <Button variant="outline" size="sm">
            Visite AppExchange
          </Button>
        </div>
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Pesquisar aplicativos ou itens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </DialogHeader>
      
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="p-6">
          {/* Seção de Aplicativos */}
          {filteredApplications.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <button className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                  <span>Todos os aplicativos</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {applicationCards.map((app, index) => (
                  <ApplicationCard
                    key={index}
                    app={app}
                    onSectionChange={onSectionChange}
                    isActive={activeSection === app.section}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Seção de Funcionalidades */}
          {filteredMenuGroups.length > 0 && (
            <div>
              <div className="flex items-center mb-4">
                <button className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                  <span>Todos os itens</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMenuGroups.map((group: MenuGroup, index: number) => (
                  <div key={index} className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                      {group.title}
                    </h3>
                    <div className="space-y-1">
                      {group.items.map((item, itemIndex) => (
                        <MenuItemButton
                          key={itemIndex}
                          item={item}
                          onSectionChange={onSectionChange}
                          isActive={activeSection === item.section}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Mensagem quando não há resultados */}
          {searchTerm && filteredApplications.length === 0 && filteredMenuGroups.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">Nenhum resultado encontrado para "{searchTerm}"</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </>
  );
};

// Função auxiliar para descrições dos aplicativos
const getAppDescription = (appName: string): string => {
  const descriptions = {
    'Imobiliaria': 'Exibe informações de Imobiliárias',
    'Comunidade': 'Salesforce CRM Communities',
    'Conteúdo': 'Salesforce CRM Content',
    'Console de serviço': 'Oferece suporte para os agentes trabalharem com vários registros',
    'Serviço': 'Gerenciar atendimento ao cliente com contas, contatos, casos e muito mais',
    'Site.com': 'Crie sites com pixel perfeito e ricos em dados usando o aplicativo de arrastar e soltar',
    'Vendas': 'Gerencie seu processo de vendas com contas, leads, oportunidades e muito mais',
    'Marketing CRM Classic': 'Rastreie esforços de marketing e vendas com objetos do CRM',
    'Salesforce Chatter': 'A rede social do Salesforce Chatter, incluindo perfis e feeds',
    'Console de vendas': 'Permite que os representantes de vendas trabalhem com vários registros',
    'Aplicativo de uso do Lightning': 'Exibir métricas de uso e adoção para o Lightning Experience',
    'Experiências digitais': 'Gerencie conteúdo e mídia para todos os seus sites'
  };
  return descriptions[appName] || 'Aplicativo personalizado do sistema';
};

export const Header = ({ children, onSectionChange, activeSection }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const { user, company, logout } = useAuth();
  const { applications } = useApplications();

  const dynamicMenuConfig: MenuGroup[] = [
    ...menuConfig,
    {
      title: "Minhas Aplicações",
      items: applications.map(app => {
        const getIcon = () => {
          if (app.icon) {
            const LucideIcon = getLucideIcon(app.icon);
            if (LucideIcon) {
              return LucideIcon;
            }
          }
          return AppWindow;
        };

        return {
          name: app.name,
          icon: getIcon(),
          section: app.api_name,
        } as MenuItem;
      }),
    },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6 transition-colors duration-300">
      <div className="flex items-center space-x-4 flex-1">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-6xl h-[80vh] p-0">
            <MenuContent activeSection={activeSection} onSectionChange={onSectionChange} dynamicMenuConfig={dynamicMenuConfig} />
          </DialogContent>
        </Dialog>
        {children}
      </div>
      
      <div className="flex items-center space-x-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Bell className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Notificações</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 relative overflow-hidden"
              >
                <Sun className={`h-5 w-5 transition-all duration-500 ${
                  theme === 'dark' ? 'rotate-90 scale-0' : 'rotate-0 scale-100'
                }`} />
                <Moon className={`absolute h-5 w-5 transition-all duration-500 ${
                  theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'
                }`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center transition-colors">
                <User className="h-4 w-4 text-blue-600 dark:text-blue-300" />
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="space-y-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center">
              <Building2 className="h-4 w-4 mr-2" />
              <div>
                <p className="text-sm font-medium">{company?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{company?.plan}</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onSectionChange('settings')}>
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-600 dark:text-red-400">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
