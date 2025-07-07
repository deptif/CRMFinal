
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  GitBranch, 
  Package, 
  Rocket, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Eye,
  Play,
  RefreshCw,
  Network,
  Shield,
  BarChart3
} from 'lucide-react';
import { useCustomizationIntegration } from '@/hooks/useCustomizationIntegration';
import { toast } from 'sonner';

export const IntegrationManager = () => {
  const {
    dependencies,
    deploymentPackages,
    isAnalyzing,
    analyzeDependencies,
    createDeploymentPackage,
    deployPackage,
    validateDependencies
  } = useCustomizationIntegration();

  const [activeTab, setActiveTab] = useState('dependencies');
  const [isCreatePackageOpen, setIsCreatePackageOpen] = useState(false);
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [packageName, setPackageName] = useState('');
  const [targetEnvironment, setTargetEnvironment] = useState<'development' | 'staging' | 'production'>('development');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'draft': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'deprecated': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getDeploymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in_progress': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  const handleCreatePackage = () => {
    if (!packageName || selectedComponents.length === 0) {
      toast.error('Nome do pacote e componentes são obrigatórios');
      return;
    }

    const validationIssues = validateDependencies(selectedComponents);
    if (validationIssues.length > 0) {
      toast.error(`Problemas de dependência: ${validationIssues.join(', ')}`);
      return;
    }

    createDeploymentPackage(selectedComponents, targetEnvironment);
    setIsCreatePackageOpen(false);
    setPackageName('');
    setSelectedComponents([]);
  };

  const getDependencyChain = (componentId: string): string[] => {
    const component = dependencies.find(dep => dep.id === componentId);
    if (!component) return [];
    
    const chain = [componentId];
    component.dependencies.forEach(depId => {
      chain.push(...getDependencyChain(depId));
    });
    
    return [...new Set(chain)];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Integração & Deployment</h2>
          <p className="text-gray-600 dark:text-gray-400">Gerencie dependências e implantações de componentes</p>
        </div>
        <Button onClick={analyzeDependencies} disabled={isAnalyzing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
          {isAnalyzing ? 'Analisando...' : 'Analisar Dependências'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dependencies" className="flex items-center space-x-2">
            <Network className="h-4 w-4" />
            <span>Dependências</span>
          </TabsTrigger>
          <TabsTrigger value="deployment" className="flex items-center space-x-2">
            <Rocket className="h-4 w-4" />
            <span>Deployment</span>
          </TabsTrigger>
          <TabsTrigger value="governance" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Governança</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dependencies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GitBranch className="h-5 w-5 mr-2" />
                Mapa de Dependências
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dependencies.length === 0 ? (
                <div className="text-center py-8">
                  <Network className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Execute a análise de dependências para visualizar as relações entre componentes
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {dependencies.map((dep) => (
                    <Card key={dep.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(dep.status)}
                            <div>
                              <h4 className="font-medium">{dep.name}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Tipo: {dep.type.replace('_', ' ')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">
                              {dep.dependencies.length} deps
                            </Badge>
                            <Badge variant="secondary">
                              {dep.dependents.length} dependents
                            </Badge>
                          </div>
                        </div>
                        
                        {(dep.dependencies.length > 0 || dep.dependents.length > 0) && (
                          <div className="mt-3 pt-3 border-t">
                            {dep.dependencies.length > 0 && (
                              <div className="mb-2">
                                <span className="text-xs font-medium text-gray-500">Depende de:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {dep.dependencies.map(depId => (
                                    <Badge key={depId} variant="outline" className="text-xs">
                                      {depId}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            {dep.dependents.length > 0 && (
                              <div>
                                <span className="text-xs font-medium text-gray-500">Usado por:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {dep.dependents.map(depId => (
                                    <Badge key={depId} variant="secondary" className="text-xs">
                                      {depId}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployment" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Pacotes de Deployment</h3>
            <Dialog open={isCreatePackageOpen} onOpenChange={setIsCreatePackageOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Package className="h-4 w-4 mr-2" />
                  Criar Pacote
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Criar Pacote de Deployment</DialogTitle>
                  <DialogDescription>
                    Selecione os componentes para incluir no pacote de deployment
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome do Pacote</Label>
                      <Input
                        value={packageName}
                        onChange={(e) => setPackageName(e.target.value)}
                        placeholder="ex: Release v1.2.0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Ambiente Alvo</Label>
                      <Select value={targetEnvironment} onValueChange={(value: any) => setTargetEnvironment(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="development">Development</SelectItem>
                          <SelectItem value="staging">Staging</SelectItem>
                          <SelectItem value="production">Production</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Componentes</Label>
                    <div className="max-h-64 overflow-y-auto border rounded-lg p-3 space-y-2">
                      {dependencies.map((dep) => (
                        <div key={dep.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={dep.id}
                            checked={selectedComponents.includes(dep.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedComponents([...selectedComponents, dep.id]);
                              } else {
                                setSelectedComponents(selectedComponents.filter(id => id !== dep.id));
                              }
                            }}
                          />
                          <Label htmlFor={dep.id} className="flex items-center space-x-2 cursor-pointer">
                            {getStatusIcon(dep.status)}
                            <span>{dep.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {dep.type.replace('_', ' ')}
                            </Badge>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreatePackageOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreatePackage}>
                    Criar Pacote
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {deploymentPackages.map((pkg) => (
              <Card key={pkg.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Package className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium">{pkg.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {pkg.components.length} componentes • {pkg.environment}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getDeploymentStatusColor(pkg.status)}>
                        {pkg.status}
                      </Badge>
                      {pkg.status === 'pending' && (
                        <Button size="sm" onClick={() => deployPackage(pkg.id)}>
                          <Play className="h-4 w-4 mr-1" />
                          Deploy
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex flex-wrap gap-1">
                      {pkg.components.map((comp) => (
                        <Badge key={comp.id} variant="outline" className="text-xs">
                          {comp.name}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                      <span>Criado: {pkg.created_at.toLocaleDateString('pt-BR')}</span>
                      {pkg.deployed_at && (
                        <span>Deploy: {pkg.deployed_at.toLocaleDateString('pt-BR')}</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="governance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Padrões de Nomenclatura</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-medium">Custom Objects</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Formato: <code>NomeObjeto__c</code>
                  </p>
                  <p className="text-xs text-gray-500">
                    Exemplo: Projeto__c, Contrato__c
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label className="font-medium">Custom Fields</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Formato: <code>Nome_Campo__c</code>
                  </p>
                  <p className="text-xs text-gray-500">
                    Exemplo: Data_Inicio__c, Valor_Total__c
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label className="font-medium">Fórmulas</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Formato: <code>CALC_Nome_Formula</code>
                  </p>
                  <p className="text-xs text-gray-500">
                    Exemplo: CALC_Total_Com_Desconto, CALC_Prazo_Vencimento
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Processo de Aprovação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">1. Desenvolvimento e Teste</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">2. Review Técnico</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">3. Aprovação de Negócio</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">4. Deploy Produção</span>
                  </div>
                </div>
                
                <Button className="w-full" variant="outline">
                  Configurar Aprovadores
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Componentes Ativos
                    </p>
                    <p className="text-2xl font-bold">
                      {dependencies.filter(d => d.status === 'active').length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Em Desenvolvimento
                    </p>
                    <p className="text-2xl font-bold">
                      {dependencies.filter(d => d.status === 'draft').length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Deploys Realizados
                    </p>
                    <p className="text-2xl font-bold">
                      {deploymentPackages.filter(p => p.status === 'completed').length}
                    </p>
                  </div>
                  <Rocket className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance das Fórmulas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Métricas de performance serão exibidas aqui após o primeiro deploy
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
