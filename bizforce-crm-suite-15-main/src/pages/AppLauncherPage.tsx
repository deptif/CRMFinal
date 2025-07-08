import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSupabaseApplications } from '@/hooks/useSupabaseApplications';
import type { Application } from '@/types';
import { AppWindow, Plus, Settings } from 'lucide-react';

interface AppLauncherPageProps {
  onSelectApp: (app: Application) => void;
}

export const AppLauncherPage = ({ onSelectApp }: AppLauncherPageProps) => {
  const { applications, isLoading } = useSupabaseApplications();
  const navigate = useNavigate();

  const handleCreateApp = () => {
    navigate('?section=application-management');
  };

  const handleOpenApp = (app: Application) => {
    onSelectApp(app);
    navigate(`?section=dashboard&appId=${app.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-lg">Carregando aplicações...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">BizForce CRM Suite</h1>
          <p className="text-muted-foreground mt-2">
            Selecione uma aplicação para começar ou crie uma nova
          </p>
        </div>
        <Button onClick={handleCreateApp}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Aplicação
        </Button>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 rounded-lg border border-dashed">
          <AppWindow className="h-12 w-12 mx-auto text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">Nenhuma aplicação encontrada</h2>
          <p className="mt-2 text-muted-foreground max-w-md mx-auto">
            Você ainda não tem nenhuma aplicação criada. Crie sua primeira aplicação para começar a usar o BizForce CRM.
          </p>
          <Button className="mt-6" onClick={handleCreateApp}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeira Aplicação
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {applications.map((app) => (
            <Card 
              key={app.id} 
              className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleOpenApp(app)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  {app.icon ? (
                    <span className="text-primary">{app.icon}</span>
                  ) : (
                    <AppWindow className="h-6 w-6 text-primary" />
                  )}
                  <span className="truncate">{app.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {app.description || "Aplicação personalizada do CRM"}
                </p>
              </CardContent>
              <CardFooter className="pt-0 flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`?section=application-management&editApp=${app.id}`);
                  }}
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Configurar
                </Button>
                <Button 
                  size="sm"
                  className="text-xs"
                >
                  Abrir
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}; 