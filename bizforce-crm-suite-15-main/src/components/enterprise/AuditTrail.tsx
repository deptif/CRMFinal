
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Clock, 
  User, 
  FileText, 
  Download,
  Filter,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  entity: string;
  entityId: string;
  changes: any;
  ipAddress: string;
  userAgent: string;
  risk_level: 'low' | 'medium' | 'high';
}

export const AuditTrail = () => {
  // Ready for database integration - no mock data
  const [auditLogs] = useState<AuditLog[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedAction, setSelectedAction] = useState('');

  const getRiskBadge = (level: string) => {
    const config = {
      low: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      medium: { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
      high: { color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    
    const { color, icon: Icon } = config[level as keyof typeof config];
    return (
      <Badge className={color}>
        <Icon className="h-3 w-3 mr-1" />
        {level.toUpperCase()}
      </Badge>
    );
  };

  const exportAuditLogs = () => {
    const csvContent = auditLogs.map(log => 
      `${log.timestamp.toISOString()},${log.user},${log.action},${log.entity},${log.entityId},${log.ipAddress},${log.risk_level}`
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-trail-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // TODO: Add function to load audit logs from database
  // useEffect(() => {
  //   const loadAuditLogs = async () => {
  //     try {
  //       const logsData = await fetchAuditLogsFromDB();
  //       setAuditLogs(logsData);
  //     } catch (error) {
  //       console.error('Error loading audit logs:', error);
  //     }
  //   };
  //   loadAuditLogs();
  // }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trilha de Auditoria</h1>
          <p className="text-gray-600">Monitoramento completo de atividades do sistema</p>
        </div>
        <Button onClick={exportAuditLogs} className="bg-blue-600 hover:bg-blue-700">
          <Download className="h-4 w-4 mr-2" />
          Exportar Logs
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Ações</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Últimas 24h</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ações de Alto Risco</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">0</div>
            <p className="text-xs text-muted-foreground">Requerem atenção</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Online agora</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">--</div>
            <p className="text-xs text-muted-foreground">Taxa de conformidade</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="logs">Logs de Auditoria</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Input
                  placeholder="Usuário"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                />
                <Input
                  placeholder="Ação"
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                />
                <Button variant="outline" className="w-full">
                  <Clock className="h-4 w-4 mr-2" />
                  Período
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Audit Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Logs de Atividade</CardTitle>
            </CardHeader>
            <CardContent>
              {auditLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum log de auditoria encontrado</p>
                  <p className="text-sm mt-2">Os logs aparecerão aqui quando houver atividade</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{log.user}</span>
                            <span className="text-sm text-gray-500">{log.action}</span>
                            <span className="text-sm text-gray-500">{log.entity}</span>
                            <span className="text-sm font-mono">{log.entityId}</span>
                          </div>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                            <span>{log.timestamp.toLocaleString('pt-PT')}</span>
                            <span>{log.ipAddress}</span>
                          </div>
                          {Object.keys(log.changes).length > 0 && (
                            <div className="mt-2 text-sm">
                              <strong>Alterações:</strong> {JSON.stringify(log.changes)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getRiskBadge(log.risk_level)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>Status de Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <div>
                      <h3 className="font-medium">LGPD - Lei Geral de Proteção de Dados</h3>
                      <p className="text-sm text-gray-600">Conformidade com regulamentações brasileiras</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Conforme</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <div>
                      <h3 className="font-medium">GDPR - General Data Protection Regulation</h3>
                      <p className="text-sm text-gray-600">Conformidade com regulamentações europeias</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Conforme</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-yellow-600" />
                    <div>
                      <h3 className="font-medium">SOX - Sarbanes-Oxley Act</h3>
                      <p className="text-sm text-gray-600">Controles financeiros e auditoria</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Em Progresso</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Monitoramento de Segurança</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Tentativas de Login Falhadas</h3>
                  <div className="text-2xl font-bold text-red-600">0</div>
                  <p className="text-sm text-gray-600">Últimas 24h</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Acessos Suspeitos</h3>
                  <div className="text-2xl font-bold text-orange-600">0</div>
                  <p className="text-sm text-gray-600">Requerem investigação</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Sessões Ativas</h3>
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <p className="text-sm text-gray-600">Usuários online</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Backup Status</h3>
                  <div className="text-2xl font-bold text-gray-600">--</div>
                  <p className="text-sm text-gray-600">Aguardando dados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
