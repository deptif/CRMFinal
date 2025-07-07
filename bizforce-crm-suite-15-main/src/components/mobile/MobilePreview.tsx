
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Download, 
  Wifi, 
  WifiOff,
  MapPin,
  Camera,
  Mic,
  Bell,
  User,
  Target,
  Calendar,
  Phone,
  LayoutDashboard,
  Clock
} from 'lucide-react';

export const MobilePreview = () => {
  const [isOffline, setIsOffline] = useState(false);

  const mobileFeatures = [
    {
      id: 'offline',
      title: 'Modo Offline',
      description: 'Trabalhe sem conexão e sincronize automaticamente',
      icon: WifiOff,
      status: 'available'
    },
    {
      id: 'geolocation',
      title: 'Geolocalização',
      description: 'Check-ins automáticos em visitas de clientes',
      icon: MapPin,
      status: 'available'
    },
    {
      id: 'camera',
      title: 'Câmera Integrada',
      description: 'Capture fotos e documentos diretamente no CRM',
      icon: Camera,
      status: 'available'
    },
    {
      id: 'voice',
      title: 'Notas de Voz',
      description: 'Grave notas de reuniões e calls rapidamente',
      icon: Mic,
      status: 'available'
    },
    {
      id: 'push',
      title: 'Notificações Push',
      description: 'Alertas em tempo real de atividades importantes',
      icon: Bell,
      status: 'available'
    }
  ];

  // Empty activities array - ready for database integration
  const mockActivities: any[] = [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">App Mobile</h1>
          <p className="text-gray-600">CRM móvel com funcionalidades offline e geolocalização</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download APK
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            App Store
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mobile Features */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Funcionalidades Mobile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mobileFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.id} className="p-4 border rounded-lg">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{feature.title}</h3>
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            Disponível
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estatísticas de Uso Mobile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">0%</p>
                  <p className="text-sm text-gray-600">Usuários Mobile</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">0h</p>
                  <p className="text-sm text-gray-600">Tempo Offline Médio</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">0%</p>
                  <p className="text-sm text-gray-600">Taxa de Sincronização</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Mockup */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-72 h-[600px] bg-black rounded-[3rem] p-2 shadow-2xl">
              <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                {/* Status Bar */}
                <div className="flex items-center justify-between px-6 py-2 bg-gray-50 text-xs">
                  <span className="font-medium">9:41</span>
                  <div className="flex items-center space-x-1">
                    {isOffline ? (
                      <WifiOff className="h-3 w-3 text-red-500" />
                    ) : (
                      <Wifi className="h-3 w-3 text-gray-600" />
                    )}
                    <div className="w-6 h-3 border border-gray-400 rounded-sm">
                      <div className="w-4 h-1.5 bg-green-500 rounded-sm mt-0.5 ml-0.5"></div>
                    </div>
                  </div>
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white">
                  <h1 className="font-bold">BizForce</h1>
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <User className="h-5 w-5" />
                  </div>
                </div>

                {/* Offline Banner */}
                {isOffline && (
                  <div className="bg-yellow-100 border-l-4 border-yellow-500 px-4 py-2">
                    <p className="text-xs text-yellow-800">
                      Modo offline ativo - Dados serão sincronizados
                    </p>
                  </div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3 p-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-600">Oportunidades</p>
                        <p className="font-bold text-blue-600">0</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-600">Atividades</p>
                        <p className="font-bold text-green-600">0</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Today's Activities */}
                <div className="px-4">
                  <h2 className="font-medium text-gray-900 mb-3">Atividades de Hoje</h2>
                  <div className="space-y-2">
                    {mockActivities.length === 0 ? (
                      <div className="text-center py-8">
                        <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Nenhuma atividade</p>
                      </div>
                    ) : (
                      mockActivities.map((activity) => (
                        <div key={activity.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                          <div className="p-1.5 bg-blue-100 rounded-full">
                            {activity.type === 'call' && <Phone className="h-3 w-3 text-blue-600" />}
                            {activity.type === 'meeting' && <Calendar className="h-3 w-3 text-blue-600" />}
                            {activity.type === 'visit' && <MapPin className="h-3 w-3 text-blue-600" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium">{activity.title}</p>
                            <p className="text-xs text-gray-500">{activity.time} • {activity.location}</p>
                          </div>
                          <Badge 
                            className={`text-xs ${
                              activity.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-orange-100 text-orange-800'
                            }`}
                          >
                            {activity.status === 'completed' ? 'Feito' : 'Pendente'}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Bottom Navigation */}
                <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
                  <div className="flex justify-around">
                    <Button size="sm" variant="ghost" className="flex-col p-2">
                      <LayoutDashboard className="h-4 w-4" />
                      <span className="text-xs">Home</span>
                    </Button>
                    <Button size="sm" variant="ghost" className="flex-col p-2">
                      <Target className="h-4 w-4" />
                      <span className="text-xs">Vendas</span>
                    </Button>
                    <Button size="sm" variant="ghost" className="flex-col p-2">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs">Agenda</span>
                    </Button>
                    <Button size="sm" variant="ghost" className="flex-col p-2">
                      <User className="h-4 w-4" />
                      <span className="text-xs">Perfil</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Toggle Offline Mode */}
            <div className="mt-4 text-center">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setIsOffline(!isOffline)}
              >
                {isOffline ? 'Conectar' : 'Simular Offline'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
