import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Plus, Edit, Trash2, AppWindow
} from 'lucide-react';
import { toast } from 'sonner';
import { useSupabaseApplications } from '@/hooks/useSupabaseApplications';
import { supabase } from '@/integrations/supabase/client';
import type { Application } from '@/types';

export const ApplicationManager = () => {
  const { applications, isLoading, hasError, createApplication, updateApplication, deleteApplication } = useSupabaseApplications();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    api_name: '',
    description: '',
    icon: '',
    image: '',
    url: '',
    theme_color: '#3b82f6',
    default_view: 'dashboard',
    settings: {},
    objects: {},
    is_active: true
  });

  // Get current user ID
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      api_name: prev.name.toLowerCase().replace(/\s+/g, '_')
    }));
  }, [formData.name]);

  const resetForm = () => {
    setFormData({
      name: '',
      api_name: '',
      description: '',
      icon: '',
      image: '',
      url: '',
      theme_color: '#3b82f6',
      default_view: 'dashboard',
      settings: {},
      objects: {},
      is_active: true
    });
    setEditingApplication(null);
  };

  const handleCreateApplication = async () => {
    if (!formData.name) {
      toast.error('Nome da aplicação é obrigatório');
      return;
    }

    if (!currentUserId) {
      toast.error('Usuário não autenticado');
      return;
    }

    const result = await createApplication({
      name: formData.name,
      api_name: formData.api_name,
      description: formData.description,
      icon: formData.icon,
      image: formData.image,
      url: formData.url,
      owner_id: currentUserId
    });

    if (result.data) {
      resetForm();
      setIsCreateDialogOpen(false);
    }
  };

  const handleUpdateApplication = async () => {
    if (!editingApplication || !formData.name) {
      toast.error('Nome da aplicação é obrigatório');
      return;
    }

    const result = await updateApplication(editingApplication.id, {
      name: formData.name,
      api_name: formData.api_name,
      description: formData.description,
      icon: formData.icon,
      image: formData.image,
      url: formData.url
    });

    if (result.data) {
      resetForm();
      setIsEditDialogOpen(false);
    }
  };

  const handleEdit = (app: Application) => {
    setEditingApplication(app);
    setFormData({
      name: app.name,
      api_name: app.api_name,
      description: app.description || '',
      icon: app.icon || '',
      image: app.image || '',
      url: app.url || '',
      theme_color: app.theme_color || '#3b82f6',
      default_view: app.default_view || 'dashboard',
      settings: app.settings || {},
      objects: app.objects || {},
      is_active: app.is_active || true
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (appId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta aplicação?')) {
      await deleteApplication(appId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-lg">Carregando aplicações...</div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-lg text-red-600">Erro ao carregar aplicações</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Gerenciamento de Aplicações</h2>
          <p className="text-gray-600 dark:text-gray-400">Crie e gerencie suas aplicações personalizadas</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Aplicação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Nova Aplicação</DialogTitle>
              <DialogDescription>
                Configure as propriedades da nova aplicação
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Aplicação *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="ex: Minha Aplicação de Vendas"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api_name">Nome API</Label>
                <Input
                  id="api_name"
                  value={formData.api_name}
                  readOnly
                  className="bg-gray-100 dark:bg-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Ícone (Nome do Lucide Icon)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  placeholder="ex: Home, Settings, Users"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">URL da Imagem</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="ex: https://example.com/app-icon.png"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">URL da Aplicação</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  placeholder="ex: /minha-aplicacao"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descreva o propósito desta aplicação..."
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateApplication}>
                Criar Aplicação
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Aplicação</DialogTitle>
            <DialogDescription>
              Modifique as propriedades da aplicação
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome da Aplicação *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="ex: Minha Aplicação de Vendas"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-api_name">Nome API</Label>
              <Input
                id="edit-api_name"
                value={formData.api_name}
                readOnly
                className="bg-gray-100 dark:bg-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-icon">Ícone (Nome do Lucide Icon)</Label>
              <Input
                id="edit-icon"
                value={formData.icon}
                onChange={(e) => setFormData({...formData, icon: e.target.value})}
                placeholder="ex: Home, Settings, Users"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-image">URL da Imagem</Label>
              <Input
                id="edit-image"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                placeholder="ex: https://example.com/app-icon.png"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-url">URL da Aplicação</Label>
              <Input
                id="edit-url"
                value={formData.url}
                onChange={(e) => setFormData({...formData, url: e.target.value})}
                placeholder="ex: /minha-aplicacao"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descreva o propósito desta aplicação..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateApplication}>
              Atualizar Aplicação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AppWindow className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhuma aplicação encontrada
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              Crie aplicações personalizadas para organizar seus objetos e funcionalidades
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Aplicação
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <Card key={app.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      {app.image ? (
                        <img src={app.image} alt={app.name} className="h-6 w-6 object-contain" />
                      ) : (
                        <AppWindow className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{app.name}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{app.api_name}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {app.description || 'Sem descrição'}
                </p>
                
                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Criado em {app.created_at.toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleEdit(app)}
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleDelete(app.id)}
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
