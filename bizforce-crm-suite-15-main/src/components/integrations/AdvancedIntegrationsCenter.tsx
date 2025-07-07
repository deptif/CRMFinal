
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Zap, 
  Mail, 
  Calendar, 
  MessageSquare,
  Globe,
  Database,
  Settings,
  CheckCircle,
  AlertTriangle,
  Clock,
  Plus,
  Webhook,
  Key
} from 'lucide-react';
import { toast } from 'sonner';

interface Integration {
  id: string;
  name: string;
  description: string;
  type: 'native' | 'zapier' | 'webhook' | 'api';
  category: 'communication' | 'productivity' | 'marketing' | 'analytics' | 'finance';
  status: 'active' | 'inactive' | 'error' | 'configuring';
  icon: any;
  config: any;
  last_sync?: Date;
  sync_count: number;
  error_count: number;
}

interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: Record<string, string>;
  triggers: string[];
  is_active: boolean;
  last_called?: Date;
  success_rate: number;
}

export const AdvancedIntegrationsCenter = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [zapierWebhook, setZapierWebhook] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // TODO: Replace with actual database queries
  useEffect(() => {
    // Mock integrations - replace with actual API calls
    const mockIntegrations: Integration[] = [
      {
        id: '1',
        name: 'Gmail Integration',
        description: 'Sincronize emails automaticamente',
        type: 'native',
        category: 'communication',
        status: 'inactive',
        icon: Mail,
        config: {},
        sync_count: 0,
        error_count: 0
      },
      {
        id: '2',
        name: 'Google Calendar',
        description: 'Sincronize reuniões e eventos',
        type: 'native',
        category: 'productivity',
        status: 'inactive',
        icon: Calendar,
        config: {},
        sync_count: 0,
        error_count: 0
      },
      {
        id: '3',
        name: 'WhatsApp Business',
        description: 'Integre conversas do WhatsApp',
        type: 'api',
        category: 'communication',
        status: 'inactive',
        icon: MessageSquare,
        config: {},
        sync_count: 0,
        error_count: 0
      },
      {
        id: '4',
        name: 'LinkedIn Sales Navigator',
        description: 'Importe leads do LinkedIn',
        type: 'api',
        category: 'marketing',
        status: 'inactive',
        icon: Globe,
        config: {},
        sync_count: 0,
        error_count: 0
      }
    ];

    const mockWebhooks: WebhookEndpoint[] = [];
    
    setIntegrations(mockIntegrations);
    setWebhooks(mockWebhooks);
  }, []);

  const handleToggleIntegration = async (integrationId: string, enabled: boolean) => {
    try {
      setIntegrations(integrations.map(integration =>
        integration.id === integrationId
          ? { ...integration, status: enabled ? 'active' : 'inactive' }
          : integration
      ));

      // TODO: Replace with actual API call
      toast.success(`Integração ${enabled ? 'ativada' : 'desativada'} com sucesso!`);
    } catch (error) {
      toast.error('Erro ao alterar status da integração');
    }
  };

  const handleZapierWebhook = async () => {
    if (!zapierWebhook.trim()) {
      toast.error('Por favor, insira a URL do webhook Zapier');
      return;
    }

    try {
      const response = await fetch(zapierWebhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          test: true,
          timestamp: new Date().toISOString(),
          source: 'CRM Integration Test'
        }),
      });

      toast.success('Webhook Zapier testado com sucesso!');
    } catch (error) {
      toast.error('Erro ao testar webhook Zapier');
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      inactive: { color: 'bg-gray-100 text-gray-800', icon: Clock },
      error: { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
      configuring: { color: 'bg-yellow-100 text-yellow-800', icon: Settings }
    };
    const { color, icon: Icon } = config[status as keyof typeof config];
    return (
      <Badge className={color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredIntegrations = selectedCategory === 'all'
    ? integrations
    : integrations.filter(integration => integration.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Centro de Integrações</h1>
          <p className="text-gray-600 dark:text-gray-400">Conecte seu CRM com ferramentas externas</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nova Integração
        </Button>
      </div>

      {/* Integration Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Integrações Ativas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {integrations.filter(i => i.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              de {integrations.length} disponíveis
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sincronizações</CardTitle>
            <Zap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {integrations.reduce((sum, i) => sum + i.sync_count, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Últimas 24h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">Integrações ativas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Webhooks Ativos</CardTitle>
            <Webhook className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{webhooks.length}</div>
            <p className="text-xs text-muted-foreground">Endpoints configurados</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Filters */}
      <div className="flex space-x-2">
        {['all', 'communication', 'productivity', 'marketing', 'analytics', 'finance'].map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category === 'all' ? 'Todas' : category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>

      {/* Zapier Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-orange-500" />
            Integração Zapier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              Conecte seu CRM com mais de 5.000 aplicações usando Zapier
            </p>
            <div className="flex space-x-2">
              <Input
                placeholder="Cole aqui a URL do seu webhook Zapier..."
                value={zapierWebhook}
                onChange={(e) => setZapierWebhook(e.target.value)}
              />
              <Button onClick={handleZapierWebhook} disabled={!zapierWebhook.trim()}>
                Testar Webhook
              </Button>
            </div>
            <div className="text-sm text-gray-500">
              💡 Crie um Zap no Zapier com trigger "Webhooks by Zapier" e copie a URL aqui
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Integrations */}
      <Card>
        <CardHeader>
          <CardTitle>Integrações Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIntegrations.map((integration) => {
              const Icon = integration.icon;
              return (
                <div key={integration.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{integration.name}</h3>
                        <p className="text-sm text-gray-600">{integration.description}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {integration.type.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    {getStatusBadge(integration.status)}
                    <Switch
                      checked={integration.status === 'active'}
                      onCheckedChange={(checked) => handleToggleIntegration(integration.id, checked)}
                    />
                  </div>

                  {integration.status === 'active' && (
                    <div className="text-sm text-gray-500 space-y-1">
                      <div>Sincronizações: {integration.sync_count}</div>
                      <div>Erros: {integration.error_count}</div>
                      {integration.last_sync && (
                        <div>Última sync: {integration.last_sync.toLocaleString('pt-PT')}</div>
                      )}
                    </div>
                  )}

                  {integration.status === 'inactive' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleToggleIntegration(integration.id, true)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Configurar
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Custom Webhooks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Webhook className="h-5 w-5 mr-2" />
            Webhooks Personalizados
          </CardTitle>
        </CardHeader>
        <CardContent>
          {webhooks.length === 0 ? (
            <div className="text-center py-8">
              <Webhook className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum webhook configurado</h3>
              <p className="text-gray-600">Configure webhooks para integrar com sistemas externos</p>
              <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                <Plus className="mr-2 h-4 w-4" />
                Criar Webhook
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {webhooks.map((webhook) => (
                <div key={webhook.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{webhook.name}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant={webhook.is_active ? 'default' : 'secondary'}>
                        {webhook.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                      <Switch checked={webhook.is_active} />
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>URL: {webhook.url}</div>
                    <div>Método: {webhook.method}</div>
                    <div>Taxa de sucesso: {webhook.success_rate}%</div>
                    {webhook.last_called && (
                      <div>Última chamada: {webhook.last_called.toLocaleString('pt-PT')}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
