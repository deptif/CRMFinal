import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ApplicationManager } from '@/components/application/ApplicationManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useSupabaseApplications } from '@/hooks/useSupabaseApplications';
import { Application } from '@/types';
import { Palette, Database, Settings as SettingsIcon } from 'lucide-react';

export const ApplicationManagementPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('general');
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const { applications } = useSupabaseApplications();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const editAppId = searchParams.get('editApp');
    
    if (editAppId) {
      const app = applications.find(a => a.id === editAppId);
      if (app) {
        setEditingApp(app);
      }
    }
  }, [location, applications]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Aplicações</h1>
        <p className="text-muted-foreground">
          Crie e gerencie suas aplicações personalizadas no BizForce CRM.
        </p>
      </div>

      {editingApp ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Editar Aplicação: {editingApp.name}</span>
            </CardTitle>
            <CardDescription>
              Configure os detalhes da sua aplicação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="general">Geral</TabsTrigger>
                <TabsTrigger value="objects">Objetos</TabsTrigger>
                <TabsTrigger value="appearance">Aparência</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general">
                <div className="space-y-4">
                  <ApplicationManager />
                </div>
              </TabsContent>
              
              <TabsContent value="objects">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        <span>Objetos Personalizados</span>
                      </CardTitle>
                      <CardDescription>
                        Configure quais objetos estarão disponíveis nesta aplicação
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="enableAccounts">Contas</Label>
                            <div className="flex items-center mt-2">
                              <input 
                                type="checkbox" 
                                id="enableAccounts" 
                                className="mr-2" 
                                defaultChecked 
                              />
                              <span className="text-sm">Ativar objeto Contas</span>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="enableContacts">Contatos</Label>
                            <div className="flex items-center mt-2">
                              <input 
                                type="checkbox" 
                                id="enableContacts" 
                                className="mr-2" 
                                defaultChecked 
                              />
                              <span className="text-sm">Ativar objeto Contatos</span>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="enableOpportunities">Oportunidades</Label>
                            <div className="flex items-center mt-2">
                              <input 
                                type="checkbox" 
                                id="enableOpportunities" 
                                className="mr-2" 
                                defaultChecked 
                              />
                              <span className="text-sm">Ativar objeto Oportunidades</span>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="enableActivities">Atividades</Label>
                            <div className="flex items-center mt-2">
                              <input 
                                type="checkbox" 
                                id="enableActivities" 
                                className="mr-2" 
                                defaultChecked 
                              />
                              <span className="text-sm">Ativar objeto Atividades</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button>Salvar Configurações de Objetos</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="appearance">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        <span>Aparência</span>
                      </CardTitle>
                      <CardDescription>
                        Personalize a aparência da sua aplicação
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="themeColor">Cor do Tema</Label>
                          <div className="flex items-center gap-4 mt-2">
                            <input 
                              type="color" 
                              id="themeColor" 
                              defaultValue={editingApp.theme_color || '#3b82f6'} 
                              className="w-10 h-10 rounded cursor-pointer"
                            />
                            <Input 
                              value={editingApp.theme_color || '#3b82f6'} 
                              className="w-32" 
                              readOnly
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="defaultView">Visualização Padrão</Label>
                          <select 
                            id="defaultView" 
                            className="w-full p-2 mt-2 border rounded"
                            defaultValue={editingApp.default_view || 'dashboard'}
                          >
                            <option value="dashboard">Dashboard</option>
                            <option value="accounts">Contas</option>
                            <option value="contacts">Contatos</option>
                            <option value="opportunities">Oportunidades</option>
                            <option value="activities">Atividades</option>
                          </select>
                        </div>
                        
                        <Button>Salvar Configurações de Aparência</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <ApplicationManager />
      )}
    </div>
  );
};