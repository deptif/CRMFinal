
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  X, 
  Code, 
  Globe, 
  Database, 
  Mail, 
  MessageSquare, 
  Calendar,
  CreditCard,
  BarChart3
} from 'lucide-react';

interface CreateCustomIntegrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateCustomIntegrationModal = ({ open, onOpenChange }: CreateCustomIntegrationModalProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [integrationData, setIntegrationData] = useState({
    name: '',
    description: '',
    category: '',
    apiType: '',
    baseUrl: '',
    authType: '',
    apiKey: '',
    endpoints: [] as Array<{ name: string; method: string; path: string; description: string }>
  });

  const categories = [
    { value: 'CRM', label: 'CRM', icon: Database },
    { value: 'Marketing', label: 'Marketing', icon: BarChart3 },
    { value: 'Comunicação', label: 'Comunicação', icon: MessageSquare },
    { value: 'Financeiro', label: 'Financeiro', icon: CreditCard },
    { value: 'Analytics', label: 'Analytics', icon: BarChart3 },
    { value: 'Automação', label: 'Automação', icon: Code }
  ];

  const handleAddEndpoint = () => {
    setIntegrationData(prev => ({
      ...prev,
      endpoints: [...prev.endpoints, { name: '', method: 'GET', path: '', description: '' }]
    }));
  };

  const handleRemoveEndpoint = (index: number) => {
    setIntegrationData(prev => ({
      ...prev,
      endpoints: prev.endpoints.filter((_, i) => i !== index)
    }));
  };

  const handleEndpointChange = (index: number, field: string, value: string) => {
    setIntegrationData(prev => ({
      ...prev,
      endpoints: prev.endpoints.map((endpoint, i) => 
        i === index ? { ...endpoint, [field]: value } : endpoint
      )
    }));
  };

  const handleSave = () => {
    if (!integrationData.name || !integrationData.category) {
      toast({
        title: "Campos Obrigatórios",
        description: "Por favor, preencha pelo menos o nome e categoria da integração.",
        variant: "destructive"
      });
      return;
    }

    // TODO: Replace with actual database call
    // await createCustomIntegration(integrationData);
    
    toast({
      title: "Integração Criada",
      description: `A integração customizada "${integrationData.name}" foi criada com sucesso!`
    });
    
    console.log('Created custom integration:', integrationData);
    onOpenChange(false);
    
    // Reset form
    setIntegrationData({
      name: '',
      description: '',
      category: '',
      apiType: '',
      baseUrl: '',
      authType: '',
      apiKey: '',
      endpoints: []
    });
    setCurrentStep(1);
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Integração Customizada</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}
                `}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`
                    w-12 h-0.5 mx-2
                    ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>

          <Tabs value={currentStep.toString()} className="w-full">
            <TabsContent value="1" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome da Integração *</Label>
                    <Input
                      id="name"
                      placeholder="Ex: Minha API Customizada"
                      value={integrationData.name}
                      onChange={(e) => setIntegrationData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      placeholder="Descreva o que esta integração faz..."
                      value={integrationData.description}
                      onChange={(e) => setIntegrationData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Categoria *</Label>
                    <Select 
                      value={integrationData.category} 
                      onValueChange={(value) => setIntegrationData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => {
                          const Icon = category.icon;
                          return (
                            <SelectItem key={category.value} value={category.value}>
                              <div className="flex items-center space-x-2">
                                <Icon className="h-4 w-4" />
                                <span>{category.label}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="2" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Configuração da API</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="apiType">Tipo de API</Label>
                    <Select 
                      value={integrationData.apiType} 
                      onValueChange={(value) => setIntegrationData(prev => ({ ...prev, apiType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="REST">REST API</SelectItem>
                        <SelectItem value="GraphQL">GraphQL</SelectItem>
                        <SelectItem value="SOAP">SOAP</SelectItem>
                        <SelectItem value="Webhook">Webhook</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="baseUrl">URL Base da API</Label>
                    <Input
                      id="baseUrl"
                      placeholder="https://api.exemplo.com/v1"
                      value={integrationData.baseUrl}
                      onChange={(e) => setIntegrationData(prev => ({ ...prev, baseUrl: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="authType">Tipo de Autenticação</Label>
                    <Select 
                      value={integrationData.authType} 
                      onValueChange={(value) => setIntegrationData(prev => ({ ...prev, authType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="api-key">API Key</SelectItem>
                        <SelectItem value="bearer">Bearer Token</SelectItem>
                        <SelectItem value="basic">Basic Auth</SelectItem>
                        <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {integrationData.authType === 'api-key' && (
                    <div>
                      <Label htmlFor="apiKey">API Key</Label>
                      <Input
                        id="apiKey"
                        type="password"
                        placeholder="Sua API Key"
                        value={integrationData.apiKey}
                        onChange={(e) => setIntegrationData(prev => ({ ...prev, apiKey: e.target.value }))}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="3" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Endpoints da API</CardTitle>
                    <Button onClick={handleAddEndpoint} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Endpoint
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {integrationData.endpoints.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum endpoint configurado</p>
                      <p className="text-sm mt-2">Adicione endpoints para definir as funcionalidades da API</p>
                    </div>
                  ) : (
                    integrationData.endpoints.map((endpoint, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">Endpoint {index + 1}</h4>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRemoveEndpoint(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Nome</Label>
                            <Input
                              placeholder="Ex: Obter Contactos"
                              value={endpoint.name}
                              onChange={(e) => handleEndpointChange(index, 'name', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Método HTTP</Label>
                            <Select 
                              value={endpoint.method}
                              onValueChange={(value) => handleEndpointChange(index, 'method', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="GET">GET</SelectItem>
                                <SelectItem value="POST">POST</SelectItem>
                                <SelectItem value="PUT">PUT</SelectItem>
                                <SelectItem value="DELETE">DELETE</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Caminho</Label>
                            <Input
                              placeholder="/contacts"
                              value={endpoint.path}
                              onChange={(e) => handleEndpointChange(index, 'path', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Descrição</Label>
                            <Input
                              placeholder="Descrição do endpoint"
                              value={endpoint.description}
                              onChange={(e) => handleEndpointChange(index, 'description', e.target.value)}
                            />
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Anterior
            </Button>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              
              {currentStep === 3 ? (
                <Button onClick={handleSave}>
                  Criar Integração
                </Button>
              ) : (
                <Button onClick={nextStep}>
                  Próximo
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
