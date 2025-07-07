
import { useState, useEffect } from 'react';
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
  RefreshCw,
  Battery,
  Signal,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OfflineActivity {
  id: string;
  type: 'call' | 'meeting' | 'note' | 'photo';
  title: string;
  timestamp: Date;
  synced: boolean;
  data: any;
}

export const EnhancedMobileExperience = () => {
  const { toast } = useToast();
  const [isOffline, setIsOffline] = useState(false);
  const [offlineActivities, setOfflineActivities] = useState<OfflineActivity[]>([]);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [signalStrength, setSignalStrength] = useState(4);

  useEffect(() => {
    // Simular mudanças de bateria e sinal
    const interval = setInterval(() => {
      setBatteryLevel(prev => Math.max(20, prev - Math.random() * 2));
      setSignalStrength(Math.floor(Math.random() * 5));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const mobileFeatures = [
    {
      id: 'offline',
      title: 'Modo Offline Avançado',
      description: 'Trabalhe sem conexão com sincronização inteligente',
      icon: WifiOff,
      status: 'available',
      benefits: ['Cache local', 'Sincronização automática', 'Resolução de conflitos']
    },
    {
      id: 'geolocation',
      title: 'Geolocalização Inteligente',
      description: 'Check-ins automáticos e rastreamento de visitas',
      icon: MapPin,
      status: 'available',
      benefits: ['Check-in automático', 'Histórico de localizações', 'Relatórios de território']
    },
    {
      id: 'camera',
      title: 'Câmera & OCR',
      description: 'Capture documentos com reconhecimento de texto',
      icon: Camera,
      status: 'available',
      benefits: ['Digitalização de cartões', 'OCR automático', 'Classificação automática']
    },
    {
      id: 'voice',
      title: 'Assistente de Voz',
      description: 'Controle por voz e transcrição automática',
      icon: Mic,
      status: 'available',
      benefits: ['Comandos de voz', 'Transcrição de calls', 'Notas por voz']
    },
    {
      id: 'push',
      title: 'Notificações Inteligentes',
      description: 'Alertas contextuais e lembretes baseados em localização',
      icon: Bell,
      status: 'available',
      benefits: ['Notificações por contexto', 'Lembretes por proximidade', 'Urgência adaptativa']
    }
  ];

  // Empty activities array - ready for database integration
  const mockActivities: any[] = [];

  const handleToggleOffline = () => {
    setIsOffline(!isOffline);
    if (!isOffline) {
      // Simular criação de atividades offline
      const newActivity: OfflineActivity = {
        id: Date.now().toString(),
        type: 'note',
        title: 'Nota criada offline',
        timestamp: new Date(),
        synced: false,
        data: { content: 'Reunião produtiva com cliente potencial' }
      };
      setOfflineActivities(prev => [...prev, newActivity]);
      
      toast({
        title: "Modo Offline Ativado",
        description: "Suas atividades serão sincronizadas quando voltar online."
      });
    } else {
      // Simular sincronização
      setTimeout(() => {
        setOfflineActivities(prev => 
          prev.map(activity => ({ ...activity, synced: true }))
        );
        toast({
          title: "Sincronização Completa",
          description: `${offlineActivities.length} atividades sincronizadas com sucesso.`
        });
      }, 2000);
    }
  };

  const handleSyncOfflineData = () => {
    toast({
      title: "Sincronizando...",
      description: "Enviando dados offline para o servidor."
    });
    
    setTimeout(() => {
      setOfflineActivities([]);
      toast({
        title: "Sincronização Completa",
        description: "Todos os dados offline foram sincronizados."
      });
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enhanced Mobile Experience</h1>
          <p className="text-gray-600">CRM móvel avançado com funcionalidades offline e AI</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download iOS
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Android
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Camera className="h-4 w-4 mr-2" />
            PWA Install
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mobile Features */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Funcionalidades Mobile Avançadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mobileFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{feature.title}</h3>
                            <Badge className="bg-green-100 text-green-800">
                              Disponível
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {feature.benefits.map((benefit, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Offline Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Gestão de Dados Offline</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSyncOfflineData}
                  disabled={offlineActivities.length === 0}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sincronizar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {offlineActivities.length > 0 ? (
                <div className="space-y-3">
                  {offlineActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${activity.synced ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                        <div>
                          <p className="font-medium text-sm">{activity.title}</p>
                          <p className="text-xs text-gray-500">
                            {activity.timestamp.toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <Badge variant={activity.synced ? "default" : "outline"}>
                        {activity.synced ? 'Sincronizado' : 'Pendente'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <WifiOff className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>Nenhuma atividade offline pendente</p>
                </div>
              )}
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
                    {/* Signal Strength */}
                    <div className="flex space-x-0.5">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 rounded-full ${
                            i < signalStrength ? 'bg-gray-600' : 'bg-gray-300'
                          }`}
                          style={{ height: `${(i + 1) * 2 + 2}px` }}
                        />
                      ))}
                    </div>
                    {isOffline ? (
                      <WifiOff className="h-3 w-3 text-red-500" />
                    ) : (
                      <Wifi className="h-3 w-3 text-gray-600" />
                    )}
                    {/* Battery */}
                    <div className="flex items-center">
                      <Battery className="h-3 w-3 text-gray-600" />
                      <span className="text-xs ml-1">{batteryLevel}%</span>
                    </div>
                  </div>
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <h1 className="font-bold">BizForce Pro</h1>
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <User className="h-5 w-5" />
                  </div>
                </div>

                {/* Offline Banner */}
                {isOffline && (
                  <div className="bg-orange-100 border-l-4 border-orange-500 px-4 py-2">
                    <p className="text-xs text-orange-800 flex items-center">
                      <WifiOff className="h-3 w-3 mr-1" />
                      Modo offline - Dados serão sincronizados
                    </p>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Camera className="h-4 w-4 mr-1" />
                      Scan Card
                    </Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <Mic className="h-4 w-4 mr-1" />
                      Voice Note
                    </Button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3 px-4 mb-4">
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
                <div className="px-4 flex-1">
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

            {/* Control Panel */}
            <div className="mt-4 space-y-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleToggleOffline}
                className="w-full"
              >
                {isOffline ? 'Conectar' : 'Simular Offline'}
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Bateria</p>
                  <p className="font-bold text-green-600">{batteryLevel}%</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Sinal</p>
                  <p className="font-bold text-blue-600">{signalStrength}/5</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Smartphone className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">0%</p>
            <p className="text-sm text-gray-600">Usuários Mobile</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <WifiOff className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">0h</p>
            <p className="text-sm text-gray-600">Tempo Offline Médio</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <RefreshCw className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">0%</p>
            <p className="text-sm text-gray-600">Taxa de Sincronização</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Camera className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-600">Documentos Digitalizados</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
