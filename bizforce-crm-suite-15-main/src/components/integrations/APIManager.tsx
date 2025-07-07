
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Webhook, 
  Key, 
  Plus, 
  Settings,
  Activity,
  Globe,
  Zap,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  Database,
  Download,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  created_at: Date;
  last_used: Date | null;
  usage_count: number;
}

interface Integration {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'disconnected' | 'error';
  icon: any;
  description: string;
  config: any;
}

interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive';
  created_at: Date;
  last_triggered: Date | null;
}

export const APIManager = () => {
  // Initial states with empty arrays - ready for database integration
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);

  const availableEvents = [
    'lead.created', 'lead.updated', 'lead.deleted',
    'contact.created', 'contact.updated', 'contact.deleted',
    'account.created', 'account.updated', 'account.deleted',
    'opportunity.created', 'opportunity.updated', 'opportunity.stage_changed',
    'opportunity.won', 'opportunity.lost',
    'activity.created', 'activity.completed'
  ];

  // Example integration templates that can be added when connected
  const availableIntegrations = [
    {
      name: 'Gmail',
      type: 'email',
      icon: Mail,
      description: 'Sincronização de emails'
    },
    {
      name: 'WhatsApp Business',
      type: 'messaging',
      icon: MessageSquare,
      description: 'Mensagens WhatsApp'
    },
    {
      name: 'Google Calendar',
      type: 'calendar',
      icon: Calendar,
      description: 'Sincronização de calendário'
    },
    {
      name: 'Zapier',
      type: 'automation',
      icon: Zap,
      description: 'Automação com 3000+ apps'
    }
  ];

  const handleCreateAPIKey = () => {
    // TODO: Replace with actual API key creation
    const newKey = {
      id: Date.now().toString(),
      name: 'Nova Chave',
      key: `bfr_live_pk_${Math.random().toString(36).substring(2, 15)}`,
      permissions: ['read'],
      created_at: new Date(),
      last_used: null,
      usage_count: 0
    };
    
    setApiKeys([...apiKeys, newKey]);
    toast.success('Nova chave API criada com sucesso!');
    
    // TODO: Replace with actual database call
    // await createAPIKey(newKey);
  };

  const handleRevokeAPIKey = (keyId: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== keyId));
    toast.success('Chave API revogada com sucesso!');
    
    // TODO: Replace with actual database call
    // await revokeAPIKey(keyId);
  };

  const handleConnectIntegration = (integrationTemplate: any) => {
    // This would typically open an OAuth flow or configuration modal
    // For now, we'll just add a placeholder integration
    const newIntegration = {
      id: Date.now().toString(),
      name: integrationTemplate.name,
      type: integrationTemplate.type,
      status: 'connected' as const,
      icon: integrationTemplate.icon,
      description: integrationTemplate.description,
      config: {}
    };
    
    setIntegrations([...integrations, newIntegration]);
    toast.success('Integração conectada com sucesso!');
    
    // TODO: Replace with actual OAuth flow and database call
    // await connectIntegration(newIntegration);
  };

  const handleCreateWebhook = () => {
    // TODO: Replace with actual webhook creation form
    const newWebhook = {
      id: Date.now().toString(),
      name: 'Novo Webhook',
      url: 'https://example.com/webhook',
      events: ['lead.created'],
      status: 'active' as const,
      created_at: new Date(),
      last_triggered: null
    };
    
    setWebhooks([...webhooks, newWebhook]);
    toast.success('Webhook criado com sucesso!');
    
    // TODO: Replace with actual database call
    // await createWebhook(newWebhook);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'disconnected':
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // TODO: Add function to load API settings from database
  // useEffect(() => {
  //   const loadAPISettings = async () => {
  //     try {
  //       const keys = await fetchAPIKeys();
  //       setApiKeys(keys);
  //       
  //       const ints = await fetchIntegrations();
  //       setIntegrations(ints);
  //       
  //       const hooks = await fetchWebhooks();
  //       setWebhooks(hooks);
  //     } catch (error) {
  //       toast.error('Erro ao carregar configurações de API');
  //     }
  //   };
  //   loadAPISettings();
  // }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API & Integrações</h1>
          <p className="text-gray-600">Gerencie APIs, webhooks e integrações externas</p>
        </div>
      </div>

      <Tabs defaultValue="integrations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
          <TabsTrigger value="api-keys">Chaves API</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="import-export">Import/Export</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integrações Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableIntegrations.map((integration, index) => {
                  const Icon = integration.icon;
                  const existingIntegration = integrations.find(i => i.name === integration.name);
                  const status = existingIntegration?.status || 'disconnected';
                  
                  return (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Icon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-medium">{integration.name}</h3>
                              <p className="text-sm text-gray-600">{integration.description}</p>
                            </div>
                          </div>
                          {existingIntegration && (
                            <Badge className={getStatusColor(status)}>
                              {status === 'connected' ? 'Conectado' : 
                               status === 'error' ? 'Erro' : 'Desconectado'}
                            </Badge>
                          )}
                        </div>
                        <Button 
                          size="sm" 
                          className="w-full"
                          variant={existingIntegration?.status === 'connected' ? 'outline' : 'default'}
                          onClick={() => handleConnectIntegration(integration)}
                        >
                          {existingIntegration?.status === 'connected' ? 'Configurar' : 'Conectar'}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-keys" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Chaves API</CardTitle>
                <Button onClick={handleCreateAPIKey}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Chave
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {apiKeys.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Key className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>Nenhuma chave API configurada</p>
                  <Button 
                    onClick={handleCreateAPIKey} 
                    variant="outline" 
                    className="mt-4"
                  >
                    Criar Primeira Chave API
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {apiKeys.map((key) => (
                    <div key={key.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Key className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{key.name}</h3>
                          <p className="text-sm text-gray-600 font-mono">{key.key}</p>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                            <span>{key.usage_count} usos</span>
                            <span>Criada em {key.created_at.toLocaleDateString('pt-PT')}</span>
                            {key.last_used && (
                              <span>Último uso: {key.last_used.toLocaleDateString('pt-PT')}</span>
                            )}
                          </div>
                          <div className="flex space-x-1 mt-1">
                            {key.permissions.map((permission) => (
                              <Badge key={permission} variant="secondary" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600"
                          onClick={() => handleRevokeAPIKey(key.id)}
                        >
                          Revogar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Endpoints Webhook</CardTitle>
                <Button onClick={handleCreateWebhook}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Webhook
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {webhooks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Webhook className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>Nenhum webhook configurado</p>
                  <Button 
                    onClick={handleCreateWebhook} 
                    variant="outline" 
                    className="mt-4"
                  >
                    Criar Primeiro Webhook
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {webhooks.map((webhook) => (
                    <div key={webhook.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Webhook className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{webhook.name}</h3>
                            <p className="text-sm text-gray-600 font-mono">{webhook.url}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(webhook.status)}>
                          {webhook.status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {webhook.events.map((event) => (
                          <Badge key={event} variant="outline" className="text-xs">
                            {event}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>
                          Último disparo: {webhook.last_triggered?.toLocaleDateString('pt-PT') || 'Nunca'}
                        </span>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Activity className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import-export" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Importar Dados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    Importar Contatos (CSV/Excel)
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    Importar Contas (CSV/Excel)
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    Importar Oportunidades (CSV/Excel)
                  </Button>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-2">Formatos suportados:</p>
                  <div className="flex space-x-2">
                    <Badge variant="secondary">CSV</Badge>
                    <Badge variant="secondary">Excel</Badge>
                    <Badge variant="secondary">JSON</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="h-5 w-5 mr-2" />
                  Exportar Dados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Contatos
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Contas
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Relatórios
                  </Button>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-2">Backup completo:</p>
                  <Button className="w-full" variant="default">
                    <Download className="h-4 w-4 mr-2" />
                    Fazer Backup Completo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
