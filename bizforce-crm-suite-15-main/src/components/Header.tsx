import React from 'react';
import { Bell, Settings, User, LogOut, Building2, Sun, Moon, Menu, AppWindow, Search, ArrowLeft } from 'lucide-react';
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
import type { Application } from '@/types';

interface HeaderProps {
  children?: React.ReactNode;
  onSectionChange: (section: string) => void;
  activeSection: string;
  activeApp?: Application | null;
  onExitApp?: () => void;
}

const ApplicationCard = ({ app, onSectionChange, isActive }) => (
  <div
    onClick={() => {
      onSectionChange(app.section);
      // Fechar o diálogo ao clicar em um aplicativo
      const dialogCloseButton = document.querySelector('[data-state="open"] [data-dialog-close]');
      if (dialogCloseButton instanceof HTMLElement) {
        dialogCloseButton.click();
      }
    }}
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
    onClick={() => {
      onSectionChange(item.section);
      // Fechar o diálogo ao clicar em um item
      const dialogCloseButton = document.querySelector('[data-state="open"] [data-dialog-close]');
      if (dialogCloseButton instanceof HTMLElement) {
        dialogCloseButton.click();
      }
    }}
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
      
      <ScrollArea className="h-[calc(100vh-200px)] max-h-[60vh]">
        <div className="p-6">
          {/* Seção de Aplicativos */}
          {filteredApplications.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <button className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                  <span>Todos os aplicativos</span>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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

export const Header = ({ children, onSectionChange, activeSection, activeApp, onExitApp }: HeaderProps) => {
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
        {activeApp ? (
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onExitApp}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center">
              <AppWindow className="h-5 w-5 mr-2 text-primary" />
              <span className="font-medium">{activeApp.name}</span>
            </div>
          </div>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="mr-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-[90vw] h-[80vh] max-h-[90vh] overflow-hidden">
              <MenuContent
                activeSection={activeSection}
                onSectionChange={onSectionChange}
                dynamicMenuConfig={dynamicMenuConfig}
              />
            </DialogContent>
          </Dialog>
        )}

        {children}
      </div>

      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{theme === 'dark' ? 'Modo claro' : 'Modo escuro'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onSectionChange('notifications')}
              >
                <Bell className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Notificações</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onSectionChange('settings')}
              >
                <Settings className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Configurações</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user?.name || 'Usuário'}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onSectionChange('settings')}>
              <Settings className="h-4 w-4 mr-2" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSectionChange('application-management')}>
              <AppWindow className="h-4 w-4 mr-2" />
              <span>Gerenciar Aplicações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
