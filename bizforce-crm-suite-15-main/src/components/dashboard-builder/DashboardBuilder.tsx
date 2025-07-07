
import { useState } from 'react';
import { useDashboardBuilder } from '@/hooks/useDashboardBuilder';
import { useMockData } from '@/hooks/useMockData';
import { ComponentLibrary } from './ComponentLibrary';
import { DashboardCanvas } from './DashboardCanvas';
import { PropertyPanel } from './PropertyPanel';
import { DashboardToolbar } from './DashboardToolbar';
import { ComponentType } from '@/types/dashboard';
import { toast } from 'sonner';

export const DashboardBuilder = () => {
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  
  const {
    state,
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
  } = useDashboardBuilder();

  const { dataSources } = useMockData();

  const selectedComponent = state.config?.layout.find(c => c.id === state.selectedComponent) || null;

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
          // Here you would load the config into the builder
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
  if (!state.config) {
    createNewDashboard();
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
        onSave={saveDashboard}
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
    </div>
  );
};
