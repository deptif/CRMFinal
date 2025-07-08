import { useState, useEffect } from 'react';
import { useDashboardBuilder } from '@/hooks/useDashboardBuilder';
import { useMockData } from '@/hooks/useMockData';
import { ComponentLibrary } from './ComponentLibrary';
import { DashboardCanvas } from './DashboardCanvas';
import { PropertyPanel } from './PropertyPanel';
import { DashboardToolbar } from './DashboardToolbar';
import { ComponentType, DashboardConfig } from '@/types/dashboard';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export const DashboardBuilder = () => {
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  
  const {
    state,
    isLoading,
    dashboards,
    createNewDashboard,
    updateLayout,
    addComponent,
    removeComponent,
    updateComponent,
    selectComponent,
    togglePreviewMode,
    undo,
    redo,
    saveDashboard,
    loadDashboard,
    deleteDashboard,
    fetchDashboards
  } = useDashboardBuilder();

  const { dataSources } = useMockData();

  const selectedComponent = state.config?.layout.find(c => c.id === state.selectedComponent) || null;

  // Carregar lista de dashboards ao iniciar
  useEffect(() => {
    fetchDashboards();
  }, [fetchDashboards]);

  const handleComponentSelect = (type: ComponentType) => {
    if (!state.config) {
      createNewDashboard();
      // Add component after dashboard is created
      setTimeout(() => {
        addComponent(type, { x: 1, y: 1 });
      }, 100);
    } else {
      addComponent(type, { x: 1, y: 1 });
    }
  };

  const handleNameChange = (name: string) => {
    if (state.config) {
      updateComponent(state.config.id, { name } as any);
    }
  };

  const handleSave = () => {
    saveDashboard();
  };

  const handleLoad = (dashboardId: string) => {
    loadDashboard(dashboardId);
    setShowLoadDialog(false);
  };

  const handleDelete = (dashboardId: string) => {
    if (confirm('Tem certeza que deseja excluir este dashboard?')) {
      deleteDashboard(dashboardId);
    }
  };

  const handleExport = () => {
    if (!state.config) return;
    
    const dataStr = JSON.stringify(state.config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${state.config.name || 'dashboard'}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    toast.success('Dashboard exportado!');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target?.result as string);
          // Aqui você carregaria a configuração no construtor
          toast.success('Dashboard importado!');
        } catch (error) {
          toast.error('Erro ao importar dashboard');
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  };

  // Initialize with new dashboard if none exists
  useEffect(() => {
    if (!state.config) {
      createNewDashboard();
    }
  }, [state.config, createNewDashboard]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Toolbar */}
      <DashboardToolbar
        dashboardName={state.config?.name || 'Novo Dashboard'}
        isPreviewMode={state.isPreviewMode}
        canUndo={state.historyIndex > 0}
        canRedo={state.historyIndex < state.history.length - 1}
        onNameChange={handleNameChange}
        onSave={handleSave}
        onLoad={() => setShowLoadDialog(true)}
        onUndo={undo}
        onRedo={redo}
        onTogglePreview={togglePreviewMode}
        onExport={handleExport}
        onImport={handleImport}
      />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Component Library */}
        {!state.isPreviewMode && (
          <ComponentLibrary
            onComponentSelect={handleComponentSelect}
            isCollapsed={leftPanelCollapsed}
            onToggleCollapse={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
          />
        )}

        {/* Center Panel - Canvas */}
        <DashboardCanvas
          layout={state.config?.layout || []}
          selectedComponent={state.selectedComponent}
          isPreviewMode={state.isPreviewMode}
          onLayoutChange={updateLayout}
          onComponentSelect={selectComponent}
          onComponentAdd={addComponent}
          onComponentRemove={removeComponent}
          onComponentUpdate={updateComponent}
        />

        {/* Right Panel - Properties */}
        {!state.isPreviewMode && (
          <PropertyPanel
            selectedComponent={selectedComponent}
            dataSources={dataSources}
            isCollapsed={rightPanelCollapsed}
            onToggleCollapse={() => setRightPanelCollapsed(!rightPanelCollapsed)}
            onComponentUpdate={(updates) => {
              if (selectedComponent) {
                updateComponent(selectedComponent.id, updates);
              }
            }}
          />
        )}
      </div>

      {/* Load Dashboard Dialog */}
      <Dialog open={showLoadDialog} onOpenChange={setShowLoadDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Carregar Dashboard</DialogTitle>
            <DialogDescription>
              Selecione um dashboard para carregar
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[60vh] overflow-y-auto">
            {dashboards.length === 0 ? (
              <p className="text-center py-4 text-gray-500">Nenhum dashboard salvo</p>
            ) : (
              <div className="space-y-2">
                {dashboards.map((dashboard: DashboardConfig) => (
                  <div 
                    key={dashboard.id} 
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50"
                  >
                    <div>
                      <h4 className="font-medium">{dashboard.name}</h4>
                      <p className="text-sm text-gray-500">
                        Atualizado em {dashboard.updatedAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleLoad(dashboard.id)}
                      >
                        Carregar
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(dashboard.id)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLoadDialog(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
