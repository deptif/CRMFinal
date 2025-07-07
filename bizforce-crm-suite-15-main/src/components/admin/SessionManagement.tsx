
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Monitor, 
  Smartphone, 
  Tablet,
  Clock,
  MapPin,
  LogOut,
  AlertTriangle,
  Shield,
  Activity,
  User
} from 'lucide-react';
import { toast } from 'sonner';

interface ActiveSession {
  id: string;
  user: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  ipAddress: string;
  location: string;
  loginTime: Date;
  lastActivity: Date;
  isCurrentSession: boolean;
  isSuspicious: boolean;
}

export const SessionManagement = () => {
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([
    {
      id: '1',
      user: 'admin@bizforce.com',
      deviceType: 'desktop',
      browser: 'Chrome 120.0',
      ipAddress: '192.168.1.100',
      location: 'Porto, Portugal',
      loginTime: new Date(Date.now() - 1000 * 60 * 30),
      lastActivity: new Date(Date.now() - 1000 * 60 * 5),
      isCurrentSession: true,
      isSuspicious: false
    },
    {
      id: '2',
      user: 'user@bizforce.com',
      deviceType: 'mobile',
      browser: 'Safari Mobile',
      ipAddress: '192.168.1.105',
      location: 'Lisboa, Portugal',
      loginTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
      lastActivity: new Date(Date.now() - 1000 * 60 * 15),
      isCurrentSession: false,
      isSuspicious: false
    },
    {
      id: '3',
      user: 'guest@bizforce.com',
      deviceType: 'desktop',
      browser: 'Firefox 119.0',
      ipAddress: '203.0.113.1',
      location: 'Unknown Location',
      loginTime: new Date(Date.now() - 1000 * 60 * 60),
      lastActivity: new Date(Date.now() - 1000 * 60 * 45),
      isCurrentSession: false,
      isSuspicious: true
    }
  ]);

  const [sessionSettings, setSessionSettings] = useState({
    maxSessionDuration: 8, // hours
    idleTimeout: 30, // minutes
    allowMultipleSessions: true,
    requireReauthentication: false,
    notifySuspiciousActivity: true,
    blockSuspiciousIPs: false
  });

  const terminateSession = (sessionId: string) => {
    setActiveSessions(sessions => sessions.filter(s => s.id !== sessionId));
    toast.success('Sessão terminada com sucesso');
  };

  const terminateAllSessions = (userId: string) => {
    setActiveSessions(sessions => 
      sessions.filter(s => s.user !== userId || s.isCurrentSession)
    );
    toast.success('Todas as sessões do utilizador foram terminadas');
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'desktop': return Monitor;
      case 'mobile': return Smartphone;
      case 'tablet': return Tablet;
      default: return Monitor;
    }
  };

  const getTimeDifference = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 60) {
      return `${diffMins}m atrás`;
    } else {
      return `${diffHours}h atrás`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gestão de Sessões</h2>
          <p className="text-gray-600 dark:text-gray-400">Monitor e controle as sessões ativas dos utilizadores</p>
        </div>
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium text-green-600">{activeSessions.length} Sessões Ativas</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessões Ativas</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSessions.length}</div>
            <p className="text-xs text-muted-foreground">Total em curso</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilizadores Únicos</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(activeSessions.map(s => s.user)).size}
            </div>
            <p className="text-xs text-muted-foreground">Online agora</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessões Suspeitas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {activeSessions.filter(s => s.isSuspicious).length}
            </div>
            <p className="text-xs text-muted-foreground">Requer atenção</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5h</div>
            <p className="text-xs text-muted-foreground">Duração da sessão</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Sessões Ativas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeSessions.map((session) => {
                  const DeviceIcon = getDeviceIcon(session.deviceType);
                  return (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <DeviceIcon className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{session.user}</h3>
                            {session.isCurrentSession && (
                              <Badge variant="outline" className="text-xs">Atual</Badge>
                            )}
                            {session.isSuspicious && (
                              <Badge variant="destructive" className="text-xs">Suspeita</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {session.browser} • {session.ipAddress}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {session.location}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Login: {getTimeDifference(session.loginTime)}
                            </span>
                            <span className="flex items-center">
                              <Activity className="h-3 w-3 mr-1" />
                              Ativo: {getTimeDifference(session.lastActivity)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {!session.isCurrentSession && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => terminateSession(session.id)}
                          >
                            <LogOut className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => terminateAllSessions(session.user)}
                        >
                          Terminar Todas
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Sessão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Duração Máxima da Sessão (horas)</Label>
                <Select 
                  value={sessionSettings.maxSessionDuration.toString()} 
                  onValueChange={(value) => setSessionSettings({...sessionSettings, maxSessionDuration: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hora</SelectItem>
                    <SelectItem value="4">4 horas</SelectItem>
                    <SelectItem value="8">8 horas</SelectItem>
                    <SelectItem value="24">24 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Timeout de Inatividade (minutos)</Label>
                <Select 
                  value={sessionSettings.idleTimeout.toString()} 
                  onValueChange={(value) => setSessionSettings({...sessionSettings, idleTimeout: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                    <SelectItem value="120">2 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label>Permitir Múltiplas Sessões</Label>
                <Switch
                  checked={sessionSettings.allowMultipleSessions}
                  onCheckedChange={(checked) => setSessionSettings({...sessionSettings, allowMultipleSessions: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Reautenticação Obrigatória</Label>
                <Switch
                  checked={sessionSettings.requireReauthentication}
                  onCheckedChange={(checked) => setSessionSettings({...sessionSettings, requireReauthentication: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Notificar Atividade Suspeita</Label>
                <Switch
                  checked={sessionSettings.notifySuspiciousActivity}
                  onCheckedChange={(checked) => setSessionSettings({...sessionSettings, notifySuspiciousActivity: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Bloquear IPs Suspeitos</Label>
                <Switch
                  checked={sessionSettings.blockSuspiciousIPs}
                  onCheckedChange={(checked) => setSessionSettings({...sessionSettings, blockSuspiciousIPs: checked})}
                />
              </div>

              <Button className="w-full mt-4">
                <Shield className="h-4 w-4 mr-2" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
