
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Zap, Users, Target, Clock, Mail, MessageSquare, Linkedin, Phone, Settings } from 'lucide-react';
import { useSupabaseMultiChannel } from '@/hooks/useSupabaseMultiChannel';
import { MultiChannelCampaignModal } from './MultiChannelCampaignModal';

export const MultiChannelAutomation = () => {
  const { campaigns, isLoading, createCampaign } = useSupabaseMultiChannel();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveCampaign = async (campaignData: any) => {
    await createCampaign(campaignData);
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getChannelIcon = (channel: string) => {
    const icons = {
      email: Mail,
      whatsapp: MessageSquare,
      linkedin: Linkedin,
      sms: Phone
    };
    return icons[channel as keyof typeof icons] || Mail;
  };

  const getChannelName = (channel: string) => {
    const names = {
      email: 'Email',
      whatsapp: 'WhatsApp',
      linkedin: 'LinkedIn',
      sms: 'SMS'
    };
    return names[channel as keyof typeof names] || channel;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Rascunho' },
      active: { color: 'bg-green-100 text-green-800', label: 'Ativo' },
      paused: { color: 'bg-yellow-100 text-yellow-800', label: 'Pausado' },
      completed: { color: 'bg-blue-100 text-blue-800', label: 'Concluído' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalLeadsContacted = campaigns.reduce((sum, c) => sum + c.leads_generated, 0);
  const avgResponseRate = campaigns.length > 0 
    ? campaigns.reduce((sum, c) => sum + c.conversion_rate, 0) / campaigns.length 
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Automação Multi-Canal</h1>
          <p className="text-gray-600">WhatsApp, Email, SMS e LinkedIn integrados</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Campanha
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campanhas Ativas</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{activeCampaigns}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Contactados</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalLeadsContacted}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa Resposta</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{avgResponseRate.toFixed(0)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Poupado</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{campaigns.length * 2}h</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
          <TabsTrigger value="sequences">Sequências</TabsTrigger>
          <TabsTrigger value="create">Criar Nova</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campanhas Multi-Canal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {campaigns.length === 0 ? (
                <div className="text-center py-12">
                  <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma campanha criada</h3>
                  <p className="text-gray-600">Comece criando uma nova campanha multi-canal</p>
                  <Button 
                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Primeira Campanha
                  </Button>
                </div>
              ) : (
                campaigns.map((campaign) => (
                  <div key={campaign.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{campaign.name}</h3>
                        <p className="text-gray-600 text-sm">{campaign.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(campaign.status)}
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mb-3">
                      {campaign.channels.map((channel) => {
                        const Icon = getChannelIcon(channel);
                        return (
                          <Badge key={channel} variant="outline" className="flex items-center space-x-1">
                            <Icon className="h-3 w-3" />
                            <span>{getChannelName(channel)}</span>
                          </Badge>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Leads Alvo</p>
                        <p className="font-semibold">{campaign.leads_generated}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Respostas</p>
                        <p className="font-semibold">{campaign.responses}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Conversão</p>
                        <p className="font-semibold text-green-600">{campaign.conversion_rate}%</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sequences">
          <Card>
            <CardHeader>
              <CardTitle>Sequências de Follow-up</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma sequência configurada</h3>
                <p className="text-gray-600">Configure sequências automáticas de follow-up para cada canal</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Criar Nova Campanha</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Comece aqui</h3>
                <p className="text-gray-600 mb-4">Use o botão "Nova Campanha" para criar uma nova campanha multi-canal</p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Campanha
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Templates de Mensagens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum template criado</h3>
                <p className="text-gray-600">Crie templates de mensagens para cada canal de comunicação</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <MultiChannelCampaignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCampaign}
      />
    </div>
  );
};
