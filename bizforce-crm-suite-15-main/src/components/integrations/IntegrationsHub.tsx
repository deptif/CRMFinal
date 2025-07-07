import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { CreateCustomIntegrationModal } from './CreateCustomIntegrationModal';
import { 
  Zap, 
  Database, 
  Mail, 
  Phone, 
  MessageSquare,
  FileText,
  DollarSign,
  Calendar,
  Globe,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Code,
  Home
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  status: 'connected' | 'disconnected' | 'error';
  popularity: number;
  isNative: boolean;
  setupComplexity: 'easy' | 'medium' | 'advanced';
}

interface APIEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  description: string;
  usage: number;
  lastUsed: Date;
}

export const IntegrationsHub = () => {
  const { toast } = useToast();
  
  // Ready for database integration - no mock data
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [apiEndpoints] = useState<APIEndpoint[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleConnect = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, status: 'connected' as const }
        : integration
    ));
    
    const integration = integrations.find(i => i.id === integrationId);
    toast({
      title: "Integração Conectada",
      description: `${integration?.name} foi conectado com sucesso! Configurações disponíveis.`,
    });
    console.log(`Connected integration: ${integration?.name}`);
    
    // TODO: Replace with actual database call
    // await connectIntegrationInDB(integrationId);
  };

  const handleDisconnect = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, status: 'disconnected' as const }
        : integration
    ));
    
    const integration = integrations.find(i => i.id === integrationId);
    toast({
      title: "Integração Desconectada",
      description: `${integration?.name} foi desconectado com sucesso.`,
      variant: "destructive",
    });
    console.log(`Disconnected integration: ${integration?.name}`);
    
    // TODO: Replace with actual database call
    // await disconnectIntegrationInDB(integrationId);
  };

  const handleConfigure = (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    toast({
      title: "Configuração",
      description: `Abrindo painel de configurações para ${integration?.name}. Configure suas credenciais e preferências.`,
    });
    console.log(`Opening configuration for: ${integration?.name}`);
    
    // TODO: Replace with actual configuration flow
    setTimeout(() => {
      toast({
        title: "Configuração Avançada",
        description: `Defina campos de mapeamento, frequência de sincronização e filtros para ${integration?.name}.`,
      });
    }, 2000);
  };

  const handleCustomIntegration = () => {
    setShowCreateModal(true);
  };

  const handleAPIBuilder = () => {
    toast({
      title: "API Builder",
      description: "Abrindo construtor de API. Crie endpoints personalizados, defina schemas e configure webhooks.",
    });
    console.log("Opening API Builder");
    
    // TODO: Replace with actual API builder
    setTimeout(() => {
      toast({
        title: "Ferramentas Disponíveis",
        description: "Construtor de endpoints, gerador de documentação, testador de API e monitor de performance.",
      });
    }, 2000);
  };

  const handleRegenerateAPIKey = () => {
    toast({
      title: "API Key Regenerada",
      description: "Nova API key gerada com sucesso. Atualize suas aplicações com a nova chave de acesso.",
    });
    console.log("API Key regenerated");
    
    // TODO: Replace with actual API key regeneration
    // await regenerateAPIKeyInDB();
  };

  const getStatusBadge = (status: string) => {
    const config = {
      connected: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Conectado' },
      disconnected: { color: 'bg-gray-100 text-gray-800', icon: XCircle, label: 'Desconectado' },
      error: { color: 'bg-red-100 text-red-800', icon: AlertTriangle, label: 'Erro' }
    };
    
    const { color, icon: Icon, label } = config[status as keyof typeof config];
    return (
      <Badge className={color}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const getComplexityBadge = (complexity: string) => {
    const config = {
      easy: { color: 'bg-green-100 text-green-800', label: 'Fácil' },
      medium: { color: 'bg-yellow-100 text-yellow-800', label: 'Médio' },
      advanced: { color: 'bg-red-100 text-red-800', label: 'Avançado' }
    };
    
    const { color, label } = config[complexity as keyof typeof config];
    return <Badge className={color}>{label}</Badge>;
  };

  const getMethodBadge = (method: string) => {
    const config = {
      GET: { color: 'bg-blue-100 text-blue-800' },
      POST: { color: 'bg-green-100 text-green-800' },
      PUT: { color: 'bg-yellow-100 text-yellow-800' },
      DELETE: { color: 'bg-red-100 text-red-800' }
    };
    
    const { color } = config[method as keyof typeof config];
    return <Badge className={color}>{method}</Badge>;
  };

  const categories = ['Todas', 'CRM', 'Marketing', 'Comunicação', 'Financeiro', 'Analytics', 'Automação'];
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const filteredIntegrations = selectedCategory === 'Todas' 
    ? integrations 
    : integrations.filter(int => int.category === selectedCategory);

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
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Home className="h-4 w-4" />
          <span>Início</span>
          <span>›</span>
          <span className="text-gray-900 font-medium">Hub de Integrações</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Integration Hub</h1>
            <p className="text-gray-600">Conecte com suas ferramentas favoritas e APIs personalizadas</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              onClick={handleAPIBuilder}
              className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all"
            >
              <Code className="h-4 w-4 mr-2" />
              API Builder
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg" 
              onClick={handleCustomIntegration}
            >
              <Plus className="h-4 w-4 mr-2" />
              Integração Customizada
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Integrações Ativas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Aguardando dados</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Calls/Mês</CardTitle>
              <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Aguardando dados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo de Resposta</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Aguardando dados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uptime</CardTitle>
              <Globe className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Aguardando dados</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="marketplace" className="space-y-4">
          <TabsList>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="connected">Conectadas</TabsTrigger>
            <TabsTrigger value="api">API & Webhooks</TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="space-y-4">
            {/* Category Filter */}
            <Card>
              <CardHeader>
                <CardTitle>Categorias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setSelectedCategory(category);
                        toast({
                          title: "Filtro Aplicado",
                          description: `Mostrando integrações da categoria: ${category}`,
                        });
                      }}
                      className="transition-all hover:scale-105"
                    >
                      {category} (0)
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Integrations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {integrations.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Zap className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma integração encontrada</h3>
                  <p className="text-gray-600 mb-4">As integrações aparecerão aqui quando carregadas da base de dados</p>
                  <Button onClick={handleCustomIntegration}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Integração Customizada
                  </Button>
                </div>
              ) : (
                filteredIntegrations.map((integration) => {
                  const Icon = integration.icon;
                  return (
                    <Card key={integration.id} className="hover:shadow-lg transition-all duration-300 hover:scale-102">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Icon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{integration.name}</CardTitle>
                              <p className="text-sm text-gray-600">{integration.category}</p>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-1">
                            {integration.isNative && (
                              <Badge className="bg-purple-100 text-purple-800">Popular</Badge>
                            )}
                            {getStatusBadge(integration.status)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">Última sincronização:</span>
                            <span className="text-sm">--</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getComplexityBadge(integration.setupComplexity)}
                            <Badge className="bg-gray-100 text-gray-800">{integration.category}</Badge>
                          </div>
                          
                          <div className="flex space-x-2">
                            {integration.status === 'connected' ? (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleConfigure(integration.id)}
                                  className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all"
                                >
                                  <Settings className="h-4 w-4 mr-1" />
                                  Configurar
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleDisconnect(integration.id)}
                                  className="hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all"
                                >
                                  Desconectar
                                </Button>
                              </>
                            ) : (
                              <Button 
                                size="sm" 
                                onClick={() => handleConnect(integration.id)}
                                className="bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Conectar
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="connected">
            <Card>
              <CardHeader>
                <CardTitle>Integrações Conectadas</CardTitle>
              </CardHeader>
              <CardContent>
                {integrations.filter(int => int.status === 'connected').length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma integração conectada</p>
                    <p className="text-sm mt-2">Conecte integrações no marketplace para vê-las aqui</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {integrations
                      .filter(int => int.status === 'connected')
                      .map((integration) => {
                        const Icon = integration.icon;
                        return (
                          <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <Icon className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <h3 className="font-medium">{integration.name}</h3>
                                <p className="text-sm text-gray-600">{integration.description}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                                  {integration.isNative && (
                                    <Badge className="bg-purple-100 text-purple-800">Popular</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleConfigure(integration.id)}
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-red-600"
                                onClick={() => handleDisconnect(integration.id)}
                              >
                                Desconectar
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api">
            <div className="space-y-6">
              {/* API Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle>Configuração da API</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">API Base URL</label>
                    <Input value="https://api.bizforce.com/v1" readOnly />
                  </div>
                  <div>
                    <label className="text-sm font-medium">API Key</label>
                    <div className="flex space-x-2">
                      <Input value="bf_live_***************************" readOnly className="flex-1" />
                      <Button variant="outline" onClick={handleRegenerateAPIKey}>Regenerar</Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Webhook URL</label>
                    <Input placeholder="https://sua-aplicacao.com/webhook" />
                  </div>
                </CardContent>
              </Card>

              {/* API Endpoints */}
              <Card>
                <CardHeader>
                  <CardTitle>Endpoints Disponíveis</CardTitle>
                </CardHeader>
                <CardContent>
                  {apiEndpoints.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum endpoint encontrado</p>
                      <p className="text-sm mt-2">Os endpoints da API aparecerão aqui quando configurados</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {apiEndpoints.map((endpoint) => (
                        <div key={endpoint.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              {getMethodBadge(endpoint.method)}
                              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                {endpoint.endpoint}
                              </code>
                            </div>
                            <div>
                              <h3 className="font-medium">{endpoint.name}</h3>
                              <p className="text-sm text-gray-600">{endpoint.description}</p>
                              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                                <span>{endpoint.usage} chamadas</span>
                                <span>Último uso: {endpoint.lastUsed.toLocaleString('pt-PT')}</span>
                              </div>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <FileText className="h-4 w-4 mr-1" />
                            Docs
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <CreateCustomIntegrationModal 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </>
  );
};
