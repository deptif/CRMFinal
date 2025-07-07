import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Plus, 
  Settings,
  Check,
  AlertCircle,
  Globe,
  Database,
  Mail,
  MessageSquare,
  Calendar,
  CreditCard,
  BarChart3,
  Webhook,
  Key,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CreateCustomIntegrationModal } from './CreateCustomIntegrationModal';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  status: 'connected' | 'disconnected' | 'error';
  isPopular: boolean;
  setupComplexity: 'easy' | 'medium' | 'advanced';
  lastSync?: Date;
  config?: any;
}

interface APIEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  description: string;
  lastUsed?: Date;
  callCount: number;
}

export const AdvancedIntegrationsHub = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAPIBuilder, setShowAPIBuilder] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Ready for database integration - no mock data
  const [integrations] = useState<Integration[]>([]);
  const [apiEndpoints] = useState<APIEndpoint[]>([]);

  const categories = [
    { id: 'all', name: 'Todas', count: 0 },
    { id: 'CRM', name: 'CRM', count: 0 },
    { id: 'Marketing', name: 'Marketing', count: 0 },
    { id: 'Communication', name: 'Comunicação', count: 0 },
    { id: 'Finance', name: 'Financeiro', count: 0 },
    { id: 'Analytics', name: 'Analytics', count: 0 }
  ];

  const filteredIntegrations = selectedCategory === 'all' 
    ? integrations 
    : integrations.filter(i => i.category === selectedCategory);

  const handleConnect = (integrationId: string) => {
    toast({
      title: "Integração Conectada",
      description: "A integração foi configurada com sucesso!"
    });
    
    // TODO: Replace with actual database call
    // await connectIntegrationInDB(integrationId);
  };

  const handleDisconnect = (integrationId: string) => {
    toast({
      title: "Integração Desconectada",
      description: "A integração foi removida com sucesso."
    });
    
    // TODO: Replace with actual database call
    // await disconnectIntegrationInDB(integrationId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  const handleCustomIntegration = () => {
    setShowCreateModal(true);
  };

  // TODO: Add useEffect to load integrations from database
  // useEffect(() => {
  //   const loadIntegrations = async () => {
  //     try {
  //       const integrationsData = await fetchIntegrationsFromDB();
  //       setIntegrations(integrationsData);
  //     } catch (error) {
  //       console.error('Error loading integrations:', error);
  //     }
  //   };
  //   loadIntegrations();
  // }, []);

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Integration Hub</h1>
            <p className="text-gray-600">Conecte com suas ferramentas favoritas e APIs personalizadas</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setShowAPIBuilder(!showAPIBuilder)}>
              <Webhook className="h-4 w-4 mr-2" />
              API Builder
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleCustomIntegration}
            >
              <Plus className="h-4 w-4 mr-2" />
              Integração Customizada
            </Button>
          </div>
        </div>

        {!showAPIBuilder ? (
          <>
            {/* Category Filter */}
            <div className="flex space-x-2 overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  size="sm"
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="whitespace-nowrap"
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>

            {/* Integration Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIntegrations.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Zap className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma integração encontrada</h3>
                  <p className="text-gray-600 mb-4">As integrações aparecerão aqui quando carregadas da base de dados</p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Integração Customizada
                  </Button>
                </div>
              ) : (
                filteredIntegrations.map((integration) => {
                  const Icon = integration.icon;
                  return (
                    <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Icon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{integration.name}</CardTitle>
                              {integration.isPopular && (
                                <Badge className="bg-orange-100 text-orange-800 text-xs">Popular</Badge>
                              )}
                            </div>
                          </div>
                          <Badge className={getStatusColor(integration.status)}>
                            {integration.status === 'connected' ? 'Conectado' : 
                             integration.status === 'error' ? 'Erro' : 'Desconectado'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <Badge variant="outline" className={getComplexityColor(integration.setupComplexity)}>
                            {integration.setupComplexity === 'easy' ? 'Fácil' :
                             integration.setupComplexity === 'medium' ? 'Médio' : 'Avançado'}
                          </Badge>
                          <span className="text-xs text-gray-500">{integration.category}</span>
                        </div>

                        {integration.lastSync && (
                          <p className="text-xs text-gray-500 mb-4">
                            Última sincronização: {integration.lastSync.toLocaleString('pt-BR')}
                          </p>
                        )}

                        <div className="flex space-x-2">
                          {integration.status === 'connected' ? (
                            <>
                              <Button size="sm" variant="outline" className="flex-1">
                                <Settings className="h-4 w-4 mr-1" />
                                Configurar
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleDisconnect(integration.id)}
                              >
                                Desconectar
                              </Button>
                            </>
                          ) : (
                            <Button 
                              size="sm" 
                              className="flex-1 bg-blue-600 hover:bg-blue-700"
                              onClick={() => handleConnect(integration.id)}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Conectar
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>

            {/* Integration Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">0</p>
                  <p className="text-sm text-gray-600">Integrações Ativas</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Globe className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">--</p>
                  <p className="text-sm text-gray-600">Sincronizações Hoje</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Database className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">--</p>
                  <p className="text-sm text-gray-600">Registros Sincronizados</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Check className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">--</p>
                  <p className="text-sm text-gray-600">Uptime</p>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          /* API Builder */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>API Endpoints</CardTitle>
              </CardHeader>
              <CardContent>
                {apiEndpoints.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Webhook className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum endpoint encontrado</p>
                    <p className="text-sm mt-2">Os endpoints da API aparecerão aqui quando configurados</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {apiEndpoints.map((endpoint) => (
                      <div key={endpoint.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge className={
                              endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                              endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                              endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {endpoint.method}
                            </Badge>
                            <span className="font-medium">{endpoint.name}</span>
                          </div>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline">
                              <Settings className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded block mb-2">
                          {endpoint.endpoint}
                        </code>
                        <p className="text-sm text-gray-600 mb-2">{endpoint.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{endpoint.callCount} chamadas</span>
                          {endpoint.lastUsed && (
                            <span>Último uso: {endpoint.lastUsed.toLocaleString('pt-BR')}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Criar Novo Endpoint</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome do Endpoint</label>
                  <Input placeholder="Ex: Get Customer Data" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Método HTTP</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>GET</option>
                    <option>POST</option>
                    <option>PUT</option>
                    <option>DELETE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Endpoint URL</label>
                  <Input placeholder="/api/v1/customers" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Descrição</label>
                  <Input placeholder="Descreva a funcionalidade do endpoint" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Autenticação</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>API Key</option>
                    <option>Bearer Token</option>
                    <option>Basic Auth</option>
                    <option>OAuth 2.0</option>
                  </select>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Endpoint
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <CreateCustomIntegrationModal 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </>
  );
};
