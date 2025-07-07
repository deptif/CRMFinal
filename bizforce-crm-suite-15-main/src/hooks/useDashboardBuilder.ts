
import { useState, useCallback, useEffect } from 'react';
import { DashboardConfig, ComponentLayout, DashboardState } from '@/types/dashboard';
import { toast } from 'sonner';

export const useDashboardBuilder = () => {
  const [state, setState] = useState<DashboardState>({
    config: null,
    selectedComponent: null,
    isPreviewMode: false,
    isDragging: false,
    history: [],
    historyIndex: -1,
  });

  const createNewDashboard = useCallback(() => {
    const newConfig: DashboardConfig = {
      id: crypto.randomUUID(),
      name: 'Novo Dashboard',
      layout: [],
      datasources: [],
      relationships: [],
      theme: 'light',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setState(prev => ({
      ...prev,
      config: newConfig,
      selectedComponent: null,
      history: [newConfig],
      historyIndex: 0,
    }));

    toast.success('Novo dashboard criado!');
  }, []);

  const updateLayout = useCallback((layout: ComponentLayout[]) => {
    setState(prev => {
      if (!prev.config) return prev;

      const updatedConfig = {
        ...prev.config,
        layout,
        updatedAt: new Date(),
      };

      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(updatedConfig);

      return {
        ...prev,
        config: updatedConfig,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  }, []);

  const addComponent = useCallback((componentType: string, position: { x: number; y: number }) => {
    if (!state.config) return;

    const newComponent: ComponentLayout = {
      id: crypto.randomUUID(),
      type: componentType as any,
      position: {
        x: position.x,
        y: position.y,
        w: getDefaultSize(componentType).w,
        h: getDefaultSize(componentType).h,
      },
      config: getDefaultConfig(componentType),
      dataSource: '',
      visible: true,
    };

    const updatedLayout = [...state.config.layout, newComponent];
    updateLayout(updatedLayout);

    setState(prev => ({
      ...prev,
      selectedComponent: newComponent.id,
    }));

    toast.success('Componente adicionado!');
  }, [state.config, updateLayout]);

  const removeComponent = useCallback((componentId: string) => {
    if (!state.config) return;

    const updatedLayout = state.config.layout.filter(comp => comp.id !== componentId);
    updateLayout(updatedLayout);

    setState(prev => ({
      ...prev,
      selectedComponent: prev.selectedComponent === componentId ? null : prev.selectedComponent,
    }));

    toast.success('Componente removido!');
  }, [state.config, updateLayout]);

  const updateComponent = useCallback((componentId: string, updates: Partial<ComponentLayout>) => {
    if (!state.config) return;

    const updatedLayout = state.config.layout.map(comp =>
      comp.id === componentId ? { ...comp, ...updates } : comp
    );
    updateLayout(updatedLayout);
  }, [state.config, updateLayout]);

  const selectComponent = useCallback((componentId: string | null) => {
    setState(prev => ({
      ...prev,
      selectedComponent: componentId,
    }));
  }, []);

  const togglePreviewMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPreviewMode: !prev.isPreviewMode,
      selectedComponent: null,
    }));
  }, []);

  const undo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex <= 0) return prev;

      const newIndex = prev.historyIndex - 1;
      return {
        ...prev,
        config: prev.history[newIndex],
        historyIndex: newIndex,
        selectedComponent: null,
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex >= prev.history.length - 1) return prev;

      const newIndex = prev.historyIndex + 1;
      return {
        ...prev,
        config: prev.history[newIndex],
        historyIndex: newIndex,
        selectedComponent: null,
      };
    });
  }, []);

  const saveDashboard = useCallback(() => {
    if (!state.config) return;

    const dashboards = localStorage.getItem('dashboards');
    const existing = dashboards ? JSON.parse(dashboards) : [];
    
    const index = existing.findIndex((d: DashboardConfig) => d.id === state.config!.id);
    if (index >= 0) {
      existing[index] = state.config;
    } else {
      existing.push(state.config);
    }

    localStorage.setItem('dashboards', JSON.stringify(existing));
    toast.success('Dashboard salvo!');
  }, [state.config]);

  const loadDashboard = useCallback((dashboardId: string) => {
    const dashboards = localStorage.getItem('dashboards');
    if (!dashboards) return;

    const existing = JSON.parse(dashboards);
    const dashboard = existing.find((d: DashboardConfig) => d.id === dashboardId);

    if (dashboard) {
      setState(prev => ({
        ...prev,
        config: dashboard,
        selectedComponent: null,
        history: [dashboard],
        historyIndex: 0,
      }));
      toast.success('Dashboard carregado!');
    }
  }, []);

  return {
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
    loadDashboard,
  };
};

function getDefaultSize(componentType: string) {
  const sizes: Record<string, { w: number; h: number }> = {
    'line-chart': { w: 6, h: 4 },
    'bar-chart': { w: 6, h: 4 },
    'pie-chart': { w: 4, h: 4 },
    'donut-chart': { w: 4, h: 4 },
    'area-chart': { w: 6, h: 4 },
    'scatter-plot': { w: 6, h: 4 },
    'kpi-card': { w: 3, h: 2 },
    'counter': { w: 2, h: 2 },
    'progress-bar': { w: 4, h: 1 },
    'gauge': { w: 4, h: 4 },
    'data-table': { w: 8, h: 6 },
    'date-picker': { w: 3, h: 1 },
    'dropdown': { w: 3, h: 1 },
    'multi-select': { w: 4, h: 1 },
    'search-box': { w: 4, h: 1 },
    'container': { w: 6, h: 4 },
    'spacer': { w: 1, h: 1 },
    'divider': { w: 6, h: 1 },
    'tabs': { w: 8, h: 6 },
    'heading': { w: 4, h: 1 },
    'paragraph': { w: 6, h: 2 },
    'label': { w: 2, h: 1 },
    'button': { w: 2, h: 1 },
    'link': { w: 2, h: 1 },
  };

  return sizes[componentType] || { w: 4, h: 3 };
}

function getDefaultConfig(componentType: string) {
  return {
    dataConfig: {},
    styling: {
      colors: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'],
      size: 'md' as const,
      showLegend: true,
      showGrid: true,
      showLabels: true,
    },
    behavior: {
      clickable: true,
      hoverable: true,
      filterable: true,
      animation: true,
    },
  };
}
