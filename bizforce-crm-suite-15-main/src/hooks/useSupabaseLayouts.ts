
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface LayoutField {
  id: string;
  name: string;
  label: string;
  type: 'field' | 'section' | 'spacer' | 'related_list';
  required?: boolean;
  readonly?: boolean;
  width?: 'full' | 'half' | 'third' | 'quarter';
}

interface LayoutSection {
  id: string;
  name: string;
  label: string;
  columns: 1 | 2 | 3;
  collapsible: boolean;
  expanded: boolean;
  fields: LayoutField[];
}

interface PageLayout {
  id: string;
  name: string;
  label: string;
  object: string;
  isDefault: boolean;
  assignedProfiles: string[];
  sections: LayoutSection[];
  created_at: Date;
  updated_at?: Date;
}

export const useSupabaseLayouts = () => {
  const [layouts, setLayouts] = useState<PageLayout[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadLayouts = useCallback(async (objectType?: string) => {
    setIsLoading(true);
    try {
      // Using localStorage as fallback since page_layouts table doesn't exist
      const storedLayouts = localStorage.getItem('page_layouts');
      let allLayouts: PageLayout[] = [];
      
      if (storedLayouts) {
        allLayouts = JSON.parse(storedLayouts).map((layout: any) => ({
          ...layout,
          created_at: new Date(layout.created_at),
          updated_at: layout.updated_at ? new Date(layout.updated_at) : undefined
        }));
      }

      const filteredLayouts = objectType 
        ? allLayouts.filter(layout => layout.object === objectType)
        : allLayouts;

      setLayouts(filteredLayouts);
    } catch (error) {
      console.error('Erro ao carregar layouts:', error);
      toast.error('Erro ao carregar layouts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createLayout = useCallback(async (layoutData: Omit<PageLayout, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newLayout: PageLayout = {
        id: crypto.randomUUID(),
        ...layoutData,
        created_at: new Date(),
        updated_at: new Date()
      };

      // Save to localStorage
      const storedLayouts = localStorage.getItem('page_layouts');
      const allLayouts = storedLayouts ? JSON.parse(storedLayouts) : [];
      allLayouts.unshift(newLayout);
      localStorage.setItem('page_layouts', JSON.stringify(allLayouts));

      setLayouts(prev => [newLayout, ...prev]);
      toast.success('Layout criado com sucesso!');
      return newLayout;
    } catch (error) {
      console.error('Erro ao criar layout:', error);
      toast.error('Erro ao criar layout');
      throw error;
    }
  }, []);

  const updateLayout = useCallback(async (layoutId: string, layoutData: Partial<PageLayout>) => {
    try {
      const storedLayouts = localStorage.getItem('page_layouts');
      const allLayouts = storedLayouts ? JSON.parse(storedLayouts) : [];
      
      const layoutIndex = allLayouts.findIndex((layout: PageLayout) => layout.id === layoutId);
      if (layoutIndex === -1) {
        throw new Error('Layout não encontrado');
      }

      const updatedLayout: PageLayout = {
        ...allLayouts[layoutIndex],
        ...layoutData,
        updated_at: new Date()
      };

      allLayouts[layoutIndex] = updatedLayout;
      localStorage.setItem('page_layouts', JSON.stringify(allLayouts));

      setLayouts(prev => prev.map(layout => 
        layout.id === layoutId ? updatedLayout : layout
      ));
      toast.success('Layout atualizado com sucesso!');
      return updatedLayout;
    } catch (error) {
      console.error('Erro ao atualizar layout:', error);
      toast.error('Erro ao atualizar layout');
      throw error;
    }
  }, []);

  const deleteLayout = useCallback(async (layoutId: string) => {
    try {
      const storedLayouts = localStorage.getItem('page_layouts');
      const allLayouts = storedLayouts ? JSON.parse(storedLayouts) : [];
      
      const filteredLayouts = allLayouts.filter((layout: PageLayout) => layout.id !== layoutId);
      localStorage.setItem('page_layouts', JSON.stringify(filteredLayouts));

      setLayouts(prev => prev.filter(layout => layout.id !== layoutId));
      toast.success('Layout removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover layout:', error);
      toast.error('Erro ao remover layout');
    }
  }, []);

  return {
    layouts,
    isLoading,
    loadLayouts,
    createLayout,
    updateLayout,
    deleteLayout
  };
};
