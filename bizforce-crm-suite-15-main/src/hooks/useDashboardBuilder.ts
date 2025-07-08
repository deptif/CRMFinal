import { useState, useCallback, useEffect } from 'react';
import { DashboardConfig, ComponentLayout, DashboardState } from '@/types/dashboard';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardBuilder = () => {
  const [state, setState] = useState<DashboardState>({
    config: null,
    selectedComponent: null,
    isPreviewMode: false,
    isDragging: false,
    history: [],
    historyIndex: -1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [dashboards, setDashboards] = useState<DashboardConfig[]>([]);

  // Carregar lista de dashboards do Supabase
  const fetchDashboards = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log('No session found');
        return;
      }

      const { data, error } = await supabase
        .from('dashboards')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Converter formato do banco para o formato da aplicação
      const formattedDashboards = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        layout: item.layout || [],
        datasources: item.datasources || [],
        relationships: item.relationships || [],
        theme: item.theme || 'light',
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
        userId: item.user_id
      }));

      setDashboards(formattedDashboards);
    } catch (error) {
      console.error('Erro ao buscar dashboards:', error);
      toast.error('Erro ao carregar dashboards');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carregar dashboards ao inicializar
  useEffect(() => {
    fetchDashboards();
  }, [fetchDashboards]);

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

  const saveDashboard = useCallback(async () => {
    if (!state.config) return;

    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Você precisa estar logado para salvar o dashboard');
        return;
      }

      const dashboardData = {
        id: state.config.id,
        name: state.config.name,
        layout: state.config.layout,
        datasources: state.config.datasources,
        relationships: state.config.relationships,
        theme: state.config.theme,
        user_id: session.user.id,
        updated_at: new Date().toISOString()
      };

      // Verificar se o dashboard já existe
      const { data: existingDashboard } = await supabase
        .from('dashboards')
        .select('id')
        .eq('id', state.config.id)
        .single();

      let result;
      
      if (existingDashboard) {
        // Atualizar dashboard existente
        result = await supabase
          .from('dashboards')
          .update(dashboardData)
          .eq('id', state.config.id);
      } else {
        // Criar novo dashboard
        result = await supabase
          .from('dashboards')
          .insert({
            ...dashboardData,
            created_at: new Date().toISOString()
          });
      }

      if (result.error) {
        throw result.error;
      }

      toast.success('Dashboard salvo com sucesso!');
      fetchDashboards(); // Atualizar lista de dashboards
    } catch (error) {
      console.error('Erro ao salvar dashboard:', error);
      toast.error('Erro ao salvar dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [state.config, fetchDashboards]);

  const loadDashboard = useCallback(async (dashboardId: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('dashboards')
        .select('*')
        .eq('id', dashboardId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        // Converter formato do banco para o formato da aplicação
        const dashboard: DashboardConfig = {
          id: data.id,
          name: data.name,
          layout: data.layout || [],
          datasources: data.datasources || [],
          relationships: data.relationships || [],
          theme: data.theme || 'light',
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
          userId: data.user_id
        };

        setState(prev => ({
          ...prev,
          config: dashboard,
          selectedComponent: null,
          history: [dashboard],
          historyIndex: 0,
        }));
        
        toast.success('Dashboard carregado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      toast.error('Erro ao carregar dashboard');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteDashboard = useCallback(async (dashboardId: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('dashboards')
        .delete()
        .eq('id', dashboardId);

      if (error) {
        throw error;
      }

      toast.success('Dashboard excluído com sucesso!');
      fetchDashboards(); // Atualizar lista de dashboards
      
      // Se o dashboard excluído for o atual, criar um novo
      if (state.config?.id === dashboardId) {
        createNewDashboard();
      }
    } catch (error) {
      console.error('Erro ao excluir dashboard:', error);
      toast.error('Erro ao excluir dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [state.config, fetchDashboards, createNewDashboard]);

  return {
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
      interactive: true,
    },
  };
}
