
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Database,
  Eye,
  Copy,
  Users,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

interface CustomObject {
  id: string;
  name: string;
  label: string;
  pluralLabel: string;
  description: string;
  fields: number;
  recordTypes: number;
  isDeployed: boolean;
  created_at: Date;
  updated_at?: Date;
}

export const CustomObjectsManager = () => {
  const [customObjects, setCustomObjects] = useState<CustomObject[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingObject, setEditingObject] = useState<CustomObject | null>(null);
  const [viewingObject, setViewingObject] = useState<CustomObject | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    label: '',
    pluralLabel: '',
    description: ''
  });

  // Load custom objects from localStorage on component mount
  useEffect(() => {
    loadCustomObjects();
  }, []);

  const loadCustomObjects = () => {
    const stored = localStorage.getItem('custom_objects');
    if (stored) {
      const objects = JSON.parse(stored).map((obj: any) => ({
        ...obj,
        created_at: new Date(obj.created_at),
        updated_at: obj.updated_at ? new Date(obj.updated_at) : undefined
      }));
      setCustomObjects(objects);
    }
  };

  const saveCustomObjects = (objects: CustomObject[]) => {
    localStorage.setItem('custom_objects', JSON.stringify(objects));
    setCustomObjects(objects);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      label: '',
      pluralLabel: '',
      description: ''
    });
    setEditingObject(null);
  };

  const handleCreateObject = () => {
    if (!formData.name || !formData.label || !formData.pluralLabel) {
      toast.error('Nome, rótulo e rótulo plural são obrigatórios');
      return;
    }

    const newObject: CustomObject = {
      id: crypto.randomUUID(),
      name: formData.name.toLowerCase().replace(/\s+/g, '_'),
      label: formData.label,
      pluralLabel: formData.pluralLabel,
      description: formData.description,
      fields: 0,
      recordTypes: 0,
      isDeployed: false,
      created_at: new Date()
    };

    const updatedObjects = [newObject, ...customObjects];
    saveCustomObjects(updatedObjects);
    resetForm();
    setIsCreateDialogOpen(false);
    toast.success('Objeto personalizado criado com sucesso!');
  };

  const handleUpdateObject = () => {
    if (!editingObject || !formData.name || !formData.label || !formData.pluralLabel) {
      toast.error('Nome, rótulo e rótulo plural são obrigatórios');
      return;
    }

    const updatedObject: CustomObject = {
      ...editingObject,
      name: formData.name.toLowerCase().replace(/\s+/g, '_'),
      label: formData.label,
      pluralLabel: formData.pluralLabel,
      description: formData.description,
      updated_at: new Date()
    };

    const updatedObjects = customObjects.map(obj => 
      obj.id === editingObject.id ? updatedObject : obj
    );
    saveCustomObjects(updatedObjects);
    resetForm();
    setIsEditDialogOpen(false);
    toast.success('Objeto personalizado atualizado com sucesso!');
  };

  const handleView = (object: CustomObject) => {
    setViewingObject(object);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (object: CustomObject) => {
    setEditingObject(object);
    setFormData({
      name: object.name,
      label: object.label,
      pluralLabel: object.pluralLabel,
      description: object.description
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (objectId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este objeto personalizado?')) {
      const updatedObjects = customObjects.filter(obj => obj.id !== objectId);
      saveCustomObjects(updatedObjects);
      toast.success('Objeto personalizado removido!');
    }
  };

  const handleDuplicate = (object: CustomObject) => {
    const duplicatedObject: CustomObject = {
      ...object,
      id: crypto.randomUUID(),
      name: `${object.name}_copy`,
      label: `${object.label} (Cópia)`,
      pluralLabel: `${object.pluralLabel} (Cópia)`,
      created_at: new Date(),
      updated_at: undefined
    };

    const updatedObjects = [duplicatedObject, ...customObjects];
    saveCustomObjects(updatedObjects);
    toast.success('Objeto personalizado duplicado!');
  };

  const handleToggleDeployment = (objectId: string) => {
    const updatedObjects = customObjects.map(obj => 
      obj.id === objectId ? { ...obj, isDeployed: !obj.isDeployed } : obj
    );
    saveCustomObjects(updatedObjects);
    const object = customObjects.find(obj => obj.id === objectId);
    toast.success(`Objeto ${object?.isDeployed ? 'desativado' : 'ativado'} com sucesso!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Objetos Personalizados</h2>
          <p className="text-gray-600 dark:text-gray-400">Crie entidades de dados específicas para seu negócio</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Objeto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Objeto Personalizado</DialogTitle>
              <DialogDescription>
                Configure as propriedades do novo objeto personalizado
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="label">Rótulo do Objeto *</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData({...formData, label: e.target.value})}
                  placeholder="ex: Projeto"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pluralLabel">Rótulo Plural *</Label>
                <Input
                  id="pluralLabel"
                  value={formData.pluralLabel}
                  onChange={(e) => setFormData({...formData, pluralLabel: e.target.value})}
                  placeholder="ex: Projetos"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Nome API *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="ex: projeto"
                />
              </div>
              
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descreva o propósito deste objeto..."
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateObject}>
                Criar Objeto
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Objeto Personalizado</DialogTitle>
            <DialogDescription>
              Modifique as propriedades do objeto personalizado
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-label">Rótulo do Objeto *</Label>
              <Input
                id="edit-label"
                value={formData.label}
                onChange={(e) => setFormData({...formData, label: e.target.value})}
                placeholder="ex: Projeto"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-pluralLabel">Rótulo Plural *</Label>
              <Input
                id="edit-pluralLabel"
                value={formData.pluralLabel}
                onChange={(e) => setFormData({...formData, pluralLabel: e.target.value})}
                placeholder="ex: Projetos"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome API *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="ex: projeto"
              />
            </div>
            
            <div className="col-span-2 space-y-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descreva o propósito deste objeto..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateObject}>
              Atualizar Objeto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Visualizar Objeto: {viewingObject?.label}</DialogTitle>
            <DialogDescription>
              Detalhes do objeto personalizado "{viewingObject?.label}"
            </DialogDescription>
          </DialogHeader>
          
          {viewingObject && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Nome API:</strong> {viewingObject.name}
                </div>
                <div>
                  <strong>Rótulo:</strong> {viewingObject.label}
                </div>
                <div>
                  <strong>Rótulo Plural:</strong> {viewingObject.pluralLabel}
                </div>
                <div>
                  <strong>Status:</strong> 
                  <Badge className="ml-2" variant={viewingObject.isDeployed ? "default" : "secondary"}>
                    {viewingObject.isDeployed ? 'Ativo' : 'Rascunho'}
                  </Badge>
                </div>
              </div>

              {viewingObject.description && (
                <div>
                  <strong>Descrição:</strong>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">{viewingObject.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded">
                  <p className="font-semibold text-2xl">{viewingObject.fields}</p>
                  <p className="text-gray-600 dark:text-gray-400">Campos</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded">
                  <p className="font-semibold text-2xl">{viewingObject.recordTypes}</p>
                  <p className="text-gray-600 dark:text-gray-400">Record Types</p>
                </div>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>Criado em: {viewingObject.created_at.toLocaleDateString('pt-BR')}</p>
                {viewingObject.updated_at && (
                  <p>Atualizado em: {viewingObject.updated_at.toLocaleDateString('pt-BR')}</p>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {customObjects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Database className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhum objeto personalizado encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              Crie entidades de dados específicas para organizar informações do seu negócio
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Objeto
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customObjects.map((object) => (
            <Card key={object.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <Database className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{object.label}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{object.name}</p>
                    </div>
                  </div>
                  <Badge variant={object.isDeployed ? "default" : "secondary"}>
                    {object.isDeployed ? 'Ativo' : 'Rascunho'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {object.description || 'Sem descrição'}
                </p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Settings className="h-4 w-4 text-gray-400" />
                    <span>{object.fields} campos</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>{object.recordTypes} tipos</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Criado em {object.created_at.toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleView(object)}
                      title="Visualizar"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleDuplicate(object)}
                      title="Duplicar"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleEdit(object)}
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleToggleDeployment(object.id)}
                      title={object.isDeployed ? 'Desativar' : 'Ativar'}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleDelete(object.id)}
                      title="Excluir"
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
