
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, AlertTriangle, Eye, Edit, Lock } from 'lucide-react';
import { toast } from 'sonner';

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

interface SecurityProfileEditModalProps {
  profile: SecurityProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (profile: SecurityProfile) => void;
  allFields: Array<{
    name: string;
    label: string;
    object: string;
    sensitive: boolean;
  }>;
}

export const SecurityProfileEditModal = ({ 
  profile, 
  open, 
  onOpenChange, 
  onSave,
  allFields 
}: SecurityProfileEditModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [permissions, setPermissions] = useState<FieldPermission[]>([]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        description: profile.description,
      });
      setPermissions([...profile.permissions]);
    }
  }, [profile]);

  const handleSave = () => {
    if (!profile || !formData.name.trim()) {
      toast.error('Nome do perfil é obrigatório');
      return;
    }

    const updatedProfile: SecurityProfile = {
      ...profile,
      name: formData.name,
      description: formData.description,
      permissions: permissions
    };

    onSave(updatedProfile);
    onOpenChange(false);
    toast.success('Perfil de segurança atualizado com sucesso!');
  };

  const updatePermission = (fieldName: string, permissionType: 'readable' | 'editable', value: boolean) => {
    setPermissions(permissions.map(perm => {
      if (perm.fieldName === fieldName) {
        let updatedPerm = { ...perm, [permissionType]: value };
        // If removing read permission, also remove edit permission
        if (permissionType === 'readable' && !value) {
          updatedPerm.editable = false;
        }
        return updatedPerm;
      }
      return perm;
    }));
  };

  const getFieldPermission = (fieldName: string) => {
    return permissions.find(perm => perm.fieldName === fieldName);
  };

  const getSecurityLevel = (readable: boolean, editable: boolean) => {
    if (!readable && !editable) return { level: 'Sem Acesso', color: 'bg-red-100 text-red-800', icon: Lock };
    if (readable && !editable) return { level: 'Somente Leitura', color: 'bg-yellow-100 text-yellow-800', icon: Eye };
    if (readable && editable) return { level: 'Leitura/Edição', color: 'bg-green-100 text-green-800', icon: Edit };
    return { level: 'Indefinido', color: 'bg-gray-100 text-gray-800', icon: AlertTriangle };
  };

  if (!profile) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Perfil de Segurança</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome do Perfil</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="ex: Sales Representative"
              />
            </div>
            <div className="space-y-2">
              <Label>Utilizadores</Label>
              <Input
                value={profile.users}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Descrição do perfil de segurança"
              rows={3}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Permissões de Campo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allFields.map((field) => {
                  const permission = getFieldPermission(field.name);
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
                              updatePermission(field.name, 'readable', checked)
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
                              updatePermission(field.name, 'editable', checked)
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
