
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Wifi, 
  WifiOff,
  Download,
  Bell,
  Search,
  Plus,
  Menu,
  Home,
  Users,
  Target,
  BarChart3,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  screenSize: string;
  userAgent: string;
  isOnline: boolean;
  installPrompt: any;
}

export const MobileOptimizedApp = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [pendingSyncs, setPendingSyncs] = useState(0);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    // Detect device type and capabilities
    const detectDevice = () => {
      const userAgent = navigator.userAgent;
      const screenWidth = window.innerWidth;
      
      let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
      if (screenWidth <= 768) deviceType = 'mobile';
      else if (screenWidth <= 1024) deviceType = 'tablet';

      setDeviceInfo({
        type: deviceType,
        screenSize: `${screenWidth}x${window.innerHeight}`,
        userAgent,
        isOnline: navigator.onLine,
        installPrompt: null
      });
    };

    detectDevice();
    window.addEventListener('resize', detectDevice);
    
    // Listen for offline/online events
    const handleOnline = () => {
      setIsOfflineMode(false);
      toast.success('Conexão restaurada! Sincronizando dados...');
      handleSync();
    };
    
    const handleOffline = () => {
      setIsOfflineMode(true);
      toast.warning('Modo offline ativo. Dados serão sincronizados quando a conexão for restaurada.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // PWA install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeviceInfo(prev => prev ? { ...prev, installPrompt: e } : null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('resize', detectDevice);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (deviceInfo?.installPrompt) {
      deviceInfo.installPrompt.prompt();
      const { outcome } = await deviceInfo.installPrompt.userChoice;
      
      if (outcome === 'accepted') {
        toast.success('App instalado com sucesso!');
      }
      
      setDeviceInfo(prev => prev ? { ...prev, installPrompt: null } : null);
    }
  };

  const handleSync = async () => {
    try {
      // TODO: Implement actual offline sync logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPendingSyncs(0);
      toast.success('Dados sincronizados com sucesso!');
    } catch (error) {
      toast.error('Erro na sincronização');
    }
  };

  const getDeviceIcon = () => {
    switch (deviceInfo?.type) {
      case 'mobile': return Smartphone;
      case 'tablet': return Tablet;
      default: return Monitor;
    }
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'accounts', label: 'Contas', icon: Users },
    { id: 'opportunities', label: 'Oportunidades', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  if (!deviceInfo) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      {deviceInfo.type === 'mobile' && (
        <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm">
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold">CRM Mobile</h1>
          <div className="flex items-center space-x-2">
            {isOfflineMode ? (
              <WifiOff className="h-5 w-5 text-red-500" />
            ) : (
              <Wifi className="h-5 w-5 text-green-500" />
            )}
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Device & Connection Info */}
      <Card className="m-4">
        <CardHeader>
          <CardTitle className="flex items-center">
            <div className="flex items-center space-x-2">
              {React.createElement(getDeviceIcon(), { className: "h-5 w-5" })}
              <span>Experiência Mobile</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm font-medium">Dispositivo</div>
              <div className="text-sm text-gray-600">{deviceInfo.type}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Resolução</div>
              <div className="text-sm text-gray-600">{deviceInfo.screenSize}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Status</div>
              <Badge variant={isOfflineMode ? 'destructive' : 'default'}>
                {isOfflineMode ? 'Offline' : 'Online'}
              </Badge>
            </div>
            <div>
              <div className="text-sm font-medium">Sincronização</div>
              <div className="text-sm text-gray-600">
                {pendingSyncs > 0 ? `${pendingSyncs} pendentes` : 'Atualizado'}
              </div>
            </div>
          </div>

          {/* PWA Install */}
          {deviceInfo.installPrompt && (
            <Button onClick={handleInstallPWA} className="w-full mb-4">
              <Download className="h-4 w-4 mr-2" />
              Instalar App
            </Button>
          )}

          {/* Offline Actions */}
          {isOfflineMode && pendingSyncs > 0 && (
            <Button onClick={handleSync} variant="outline" className="w-full">
              Sincronizar {pendingSyncs} itens
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Mobile Search */}
      {deviceInfo.type === 'mobile' && (
        <div className="px-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Buscar..." className="pl-10" />
          </div>
        </div>
      )}

      {/* Quick Actions for Mobile */}
      {deviceInfo.type === 'mobile' && (
        <div className="px-4 mb-4">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="h-16 flex flex-col items-center">
              <Plus className="h-6 w-6 mb-1" />
              <span className="text-xs">Nova Conta</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center">
              <Target className="h-6 w-6 mb-1" />
              <span className="text-xs">Oportunidade</span>
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Stats Cards */}
      <div className="px-4 grid grid-cols-2 gap-4 mb-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-gray-600">Contas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">€0</div>
            <div className="text-sm text-gray-600">Pipeline</div>
          </CardContent>
        </Card>
      </div>

      {/* Responsive Features */}
      <Card className="m-4">
        <CardHeader>
          <CardTitle>Funcionalidades Móveis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Modo Offline</div>
                <div className="text-sm text-gray-600">Trabalhe sem conexão</div>
              </div>
              <Badge variant={isOfflineMode ? 'default' : 'secondary'}>
                {isOfflineMode ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Sincronização Automática</div>
                <div className="text-sm text-gray-600">Dados sempre atualizados</div>
              </div>
              <Badge variant="default">Ativo</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Touch Gestures</div>
                <div className="text-sm text-gray-600">Navegação otimizada</div>
              </div>
              <Badge variant="default">Ativo</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Push Notifications</div>
                <div className="text-sm text-gray-600">Notificações em tempo real</div>
              </div>
              <Badge variant="secondary">Configurar</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Bottom Navigation */}
      {deviceInfo.type === 'mobile' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
          <div className="grid grid-cols-5 py-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex flex-col items-center py-2 px-1 ${
                    currentView === item.id ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="text-xs">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Add bottom padding for mobile navigation */}
      {deviceInfo.type === 'mobile' && <div className="h-16"></div>}
    </div>
  );
};
