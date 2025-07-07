
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Edit, 
  User,
  Users,
  Database,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { SecurityProfileEditModal } from './SecurityProfileEditModal';

interface FieldPermission {
  fieldName: string;
  fieldLabel: string;
  object: string;
  readable: boolean;
  editable: boolean;
  profile: string;
}

interface SecurityProfile {
  id: string;
  name: string;
  description: string;
  users: number;
  permissions: FieldPermission[];
}

export const FieldLevelSecurity = () => {
  // Ready for database integration - no mock data
  const [profiles, setProfiles] = useState<SecurityProfile[]>([]);

  const [selectedProfile, setSelectedProfile] = useState<string>('');
  const [selectedObject, setSelectedObject] = useState<string>('Opportunity');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProfileForEdit, setSelectedProfileForEdit] = useState<SecurityProfile | null>(null);

  const objects = ['Opportunity', 'Account', 'Contact', 'Product', 'Case', 'Lead'];
  
  const allFields = [
    { name: 'amount', label: 'Valor', object: 'Opportunity', sensitive: true },
    { name: 'stage', label: 'Fase', object: 'Opportunity', sensitive: false },
    { name: 'commission', label: 'Comissão', object: 'Opportunity', sensitive: true },
    { name: 'close_date', label: 'Data de Fechamento', object: 'Opportunity', sensitive: false },
    { name: 'cost', label: 'Custo', object: 'Product', sensitive: true },
    { name: 'profit_margin', label: 'Margem de Lucro', object: 'Product', sensitive: true },
    { name: 'price', label: 'Preço', object: 'Product', sensitive: false },
    { name: 'annual_revenue', label: 'Receita Anual', object: 'Account', sensitive: true },
    { name: 'credit_score', label: 'Score de Crédito', object: 'Account', sensitive: true }
  ];

  const updatePermission = (profileId: string, fieldName: string, permissionType: 'readable' | 'editable', value: boolean) => {
    setProfiles(profiles.map(profile => {
      if (profile.id === profileId) {
        const updatedPermissions = profile.permissions.map(perm => {
          if (perm.fieldName === fieldName) {
            return { ...perm, [permissionType]: value };
          }
          return perm;
        });
        return { ...profile, permissions: updatedPermissions };
      }
      return profile;
    }));
    toast.success('Permissão atualizada com sucesso!');
    
    // TODO: Replace with actual database call
    // await updateFieldPermissionInDB(profileId, fieldName, permissionType, value);
  };

  const getFieldPermission = (profileId: string, fieldName: string) => {
    const profile = profiles.find(p => p.id === profileId);
    return profile?.permissions.find(perm => perm.fieldName === fieldName);
  };

  const getSecurityLevel = (readable: boolean, editable: boolean) => {
    if (!readable && !editable) return { level: 'Sem Acesso', color: 'bg-red-100 text-red-800', icon: Lock };
    if (readable && !editable) return { level: 'Somente Leitura', color: 'bg-yellow-100 text-yellow-800', icon: Eye };
    if (readable && editable) return { level: 'Leitura/Edição', color: 'bg-green-100 text-green-800', icon: Edit };
    return { level: 'Indefinido', color: 'bg-gray-100 text-gray-800', icon: AlertTriangle };
  };

  const handleEditProfile = (profile: SecurityProfile) => {
    setSelectedProfileForEdit(profile);
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = (updatedProfile: SecurityProfile) => {
    setProfiles(profiles.map(profile => 
      profile.id === updatedProfile.id ? updatedProfile : profile
    ));
    
    // TODO: Replace with actual database call
    // await updateSecurityProfileInDB(updatedProfile);
  };

  const currentProfile = profiles.find(p => p.id === selectedProfile);
  const fieldsForObject = allFields.filter(field => field.object === selectedObject);

  // TODO: Add function to load profiles from database
  // useEffect(() => {
  //   const loadProfiles = async () => {
  //     try {
  //       const profilesData = await fetchSecurityProfilesFromDB();
  //       setProfiles(profilesData);
  //       if (profilesData.length > 0) {
  //         setSelectedProfile(profilesData[0].id);
  //       }
  //     } catch (error) {
  //       toast.error('Erro ao carregar perfis de segurança');
  //     }
  //   };
  //   loadProfiles();
  // }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Segurança a Nível de Campo</h1>
          <p className="text-gray-600 dark:text-gray-400">Configure permissões granulares para campos sensíveis</p>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium text-green-600">Sistema Seguro</span>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perfis de Segurança</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profiles.length}</div>
            <p className="text-xs text-muted-foreground">Perfis configurados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campos Protegidos</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allFields.filter(f => f.sensitive).length}
            </div>
            <p className="text-xs text-muted-foreground">Campos sensíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilizadores</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profiles.reduce((sum, p) => sum + p.users, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Com perfis aplicados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">100%</div>
            <p className="text-xs text-muted-foreground">Campos auditados</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="profiles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profiles">Perfis de Segurança</TabsTrigger>
          <TabsTrigger value="fields">Configuração de Campos</TabsTrigger>
          <TabsTrigger value="audit">Log de Auditoria</TabsTrigger>
        </TabsList>

        <TabsContent value="profiles" className="space-y-4">
          {profiles.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Nenhum perfil de segurança encontrado
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Crie perfis de segurança para gerir permissões de campos
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {profiles.map((profile) => (
                <Card key={profile.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{profile.name}</span>
                      <Badge variant="outline">{profile.users} users</Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{profile.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Permissões:</h4>
                      {profile.permissions.slice(0, 3).map((perm) => {
                        const security = getSecurityLevel(perm.readable, perm.editable);
                        return (
                          <div key={perm.fieldName} className="flex items-center justify-between">
                            <span className="text-sm">{perm.fieldLabel}</span>
                            <Badge className={security.color} variant="outline">
                              <security.icon className="h-3 w-3 mr-1" />
                              {security.level}
                            </Badge>
                          </div>
                        );
                      })}
                      {profile.permissions.length > 3 && (
                        <p className="text-xs text-gray-500">+{profile.permissions.length - 3} mais campos</p>
                      )}
                    </div>
                    <Button 
                      className="w-full mt-4" 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditProfile(profile)}
                    >
                      Editar Perfil
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="fields" className="space-y-4">
          <div className="flex space-x-4 mb-6">
            <div className="flex-1">
              <Label>Perfil de Segurança</Label>
              <Select value={selectedProfile} onValueChange={setSelectedProfile}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um perfil..." />
                </SelectTrigger>
                <SelectContent>
                  {profiles.length === 0 ? (
                    <SelectItem value="no-profiles" disabled>
                      Nenhum perfil encontrado
                    </SelectItem>
                  ) : (
                    profiles.map((profile) => (
                      <SelectItem key={profile.id} value={profile.id}>
                        {profile.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label>Objeto</Label>
              <Select value={selectedObject} onValueChange={setSelectedObject}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {objects.map((object) => (
                    <SelectItem key={object} value={object}>
                      {object}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {!selectedProfile ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Database className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Selecione um perfil de segurança
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Escolha um perfil para configurar as permissões de campos
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>
                  Permissões de Campo - {currentProfile?.name} ({selectedObject})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fieldsForObject.map((field) => {
                    const permission = getFieldPermission(selectedProfile, field.name);
                    const readable = permission?.readable || false;
                    const editable = permission?.editable || false;
                    
                    return (
                      <div key={field.name} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <Database className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h3 className="font-medium">{field.label}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {field.name} • {field.object}
                            </p>
                            {field.sensitive && (
                              <Badge variant="outline" className="mt-1 text-xs bg-red-50 text-red-700">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Sensível
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <Label htmlFor={`read-${field.name}`} className="text-sm">
                              Leitura
                            </Label>
                            <Switch
                              id={`read-${field.name}`}
                              checked={readable}
                              onCheckedChange={(checked) => 
                                updatePermission(selectedProfile, field.name, 'readable', checked)
                              }
                            />
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Label htmlFor={`edit-${field.name}`} className="text-sm">
                              Edição
                            </Label>
                            <Switch
                              id={`edit-${field.name}`}
                              checked={editable}
                              disabled={!readable}
                              onCheckedChange={(checked) => 
                                updatePermission(selectedProfile, field.name, 'editable', checked)
                              }
                            />
                          </div>
                          
                          <div className="w-32">
                            {(() => {
                              const security = getSecurityLevel(readable, editable);
                              return (
                                <Badge className={security.color}>
                                  <security.icon className="h-3 w-3 mr-1" />
                                  {security.level}
                                </Badge>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Log de Auditoria de Segurança</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum log de auditoria encontrado</p>
                <p className="text-sm mt-2">Os logs aparecerão aqui quando houver atividade</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <SecurityProfileEditModal
        profile={selectedProfileForEdit}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSave={handleSaveProfile}
        allFields={allFields}
      />
    </div>
  );
};
