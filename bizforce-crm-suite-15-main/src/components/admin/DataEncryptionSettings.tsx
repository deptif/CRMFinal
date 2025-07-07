
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Lock, 
  Key,
  Database,
  FileText,
  Settings,
  CheckCircle,
  AlertTriangle,
  Cpu,
  HardDrive
} from 'lucide-react';
import { toast } from 'sonner';

interface EncryptionSetting {
  id: string;
  name: string;
  description: string;
  type: 'field' | 'database' | 'file' | 'communication';
  isEnabled: boolean;
  algorithm: string;
  keyRotation: boolean;
  lastRotated?: Date;
}

export const DataEncryptionSettings = () => {
  const [encryptionSettings, setEncryptionSettings] = useState<EncryptionSetting[]>([
    {
      id: '1',
      name: 'Encriptação de Campos Sensíveis',
      description: 'Encripta campos marcados como sensíveis no banco de dados',
      type: 'field',
      isEnabled: true,
      algorithm: 'AES-256',
      keyRotation: true,
      lastRotated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)
    },
    {
      id: '2',
      name: 'Encriptação da Base de Dados',
      description: 'Encriptação completa da base de dados em repouso',
      type: 'database',
      isEnabled: true,
      algorithm: 'AES-256',
      keyRotation: false
    },
    {
      id: '3',
      name: 'Encriptação de Ficheiros',
      description: 'Encripta ficheiros carregados e documentos',
      type: 'file',
      isEnabled: false,
      algorithm: 'AES-256',
      keyRotation: false
    },
    {
      id: '4',
      name: 'Encriptação de Comunicações',
      description: 'TLS/SSL para todas as comunicações',
      type: 'communication',
      isEnabled: true,
      algorithm: 'TLS 1.3',
      keyRotation: true,
      lastRotated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
    }
  ]);

  const [systemHealth, setSystemHealth] = useState({
    encryptionStrength: 95,
    keyManagement: 88,
    compliance: 92,
    performance: 85
  });

  const toggleEncryption = (id: string) => {
    setEncryptionSettings(settings => 
      settings.map(setting => 
        setting.id === id 
          ? { ...setting, isEnabled: !setting.isEnabled }
          : setting
      )
    );
    toast.success('Configuração de encriptação atualizada');
  };

  const rotateKeys = (id: string) => {
    setEncryptionSettings(settings => 
      settings.map(setting => 
        setting.id === id 
          ? { ...setting, lastRotated: new Date() }
          : setting
      )
    );
    toast.success('Chaves rotacionadas com sucesso');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'field': return Database;
      case 'database': return HardDrive;
      case 'file': return FileText;
      case 'communication': return Shield;
      default: return Lock;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'field': return 'Campo';
      case 'database': return 'Base de Dados';
      case 'file': return 'Ficheiro';
      case 'communication': return 'Comunicação';
      default: return 'Outro';
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Configurações de Encriptação</h2>
          <p className="text-gray-600 dark:text-gray-400">Gerir a segurança e encriptação de dados do sistema</p>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium text-green-600">Sistema Seguro</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Força da Encriptação</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthColor(systemHealth.encryptionStrength)}`}>
              {systemHealth.encryptionStrength}%
            </div>
            <Progress value={systemHealth.encryptionStrength} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gestão de Chaves</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthColor(systemHealth.keyManagement)}`}>
              {systemHealth.keyManagement}%
            </div>
            <Progress value={systemHealth.keyManagement} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthColor(systemHealth.compliance)}`}>
              {systemHealth.compliance}%
            </div>
            <Progress value={systemHealth.compliance} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthColor(systemHealth.performance)}`}>
              {systemHealth.performance}%
            </div>
            <Progress value={systemHealth.performance} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="keys">Gestão de Chaves</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {encryptionSettings.map((setting) => {
              const TypeIcon = getTypeIcon(setting.type);
              return (
                <Card key={setting.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <TypeIcon className="h-5 w-5 text-blue-600" />
                        <span>{setting.name}</span>
                      </div>
                      <Switch
                        checked={setting.isEnabled}
                        onCheckedChange={() => toggleEncryption(setting.id)}
                      />
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{setting.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Status:</span>
                        <Badge variant={setting.isEnabled ? "default" : "secondary"}>
                          {setting.isEnabled ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Algoritmo:</span>
                        <span className="text-sm text-gray-600">{setting.algorithm}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Tipo:</span>
                        <Badge variant="outline">{getTypeLabel(setting.type)}</Badge>
                      </div>

                      {setting.keyRotation && (
                        <div className="pt-2 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Última Rotação:</span>
                            <span className="text-sm text-gray-600">
                              {setting.lastRotated?.toLocaleDateString('pt-PT')}
                            </span>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full"
                            onClick={() => rotateKeys(setting.id)}
                          >
                            <Key className="h-4 w-4 mr-2" />
                            Rotar Chaves
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="keys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Chaves de Encriptação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Chave Master</h3>
                  <p className="text-sm text-gray-600 mb-3">Chave principal para encriptação</p>
                  <Badge variant="outline" className="mb-2">AES-256</Badge>
                  <Button size="sm" className="w-full">
                    <Key className="h-4 w-4 mr-2" />
                    Regenerar
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Chaves de Campo</h3>
                  <p className="text-sm text-gray-600 mb-3">Chaves específicas para campos</p>
                  <Badge variant="outline" className="mb-2">12 Ativas</Badge>
                  <Button size="sm" className="w-full" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Gerir
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Backup de Chaves</h3>
                  <p className="text-sm text-gray-600 mb-3">Backup seguro das chaves</p>
                  <Badge variant="outline" className="mb-2">Atualizado</Badge>
                  <Button size="sm" className="w-full" variant="outline">
                    <HardDrive className="h-4 w-4 mr-2" />
                    Backup
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conformidade e Regulamentações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <h3 className="font-medium">GDPR</h3>
                      <p className="text-sm text-gray-600">Regulamento Geral de Proteção de Dados</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Conforme</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <h3 className="font-medium">ISO 27001</h3>
                      <p className="text-sm text-gray-600">Gestão de Segurança da Informação</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Conforme</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <h3 className="font-medium">SOC 2</h3>
                      <p className="text-sm text-gray-600">Service Organization Control 2</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Em Progresso</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
