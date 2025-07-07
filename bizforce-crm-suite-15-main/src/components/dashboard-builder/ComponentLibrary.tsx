import React from 'react';
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  AreaChart, 
  ScatterChart,
  Activity,
  Gauge,
  TrendingUp,
  Table,
  Calendar,
  Filter,
  Search,
  Box,
  Minus,
  LayoutTemplate,
  TabletSmartphone,
  Type,
  AlignLeft,
  Tag,
  MousePointer,
  Link
} from 'lucide-react';
import { ComponentDefinition, ComponentType } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ComponentLibraryProps {
  onComponentSelect: (type: ComponentType) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const componentDefinitions: ComponentDefinition[] = [
  // Charts
  { type: 'line-chart', name: 'Gráfico de Linha', icon: LineChart, category: 'charts', description: 'Mostra tendências ao longo do tempo', defaultSize: { w: 6, h: 4 }, minSize: { w: 3, h: 2 }, configurable: ['dataConfig', 'styling'] },
  { type: 'bar-chart', name: 'Gráfico de Barras', icon: BarChart, category: 'charts', description: 'Compara valores entre categorias', defaultSize: { w: 6, h: 4 }, minSize: { w: 3, h: 2 }, configurable: ['dataConfig', 'styling'] },
  { type: 'pie-chart', name: 'Gráfico de Pizza', icon: PieChart, category: 'charts', description: 'Mostra proporções do total', defaultSize: { w: 4, h: 4 }, minSize: { w: 3, h: 3 }, configurable: ['dataConfig', 'styling'] },
  { type: 'donut-chart', name: 'Gráfico Donut', icon: PieChart, category: 'charts', description: 'Pizza com centro vazio', defaultSize: { w: 4, h: 4 }, minSize: { w: 3, h: 3 }, configurable: ['dataConfig', 'styling'] },
  { type: 'area-chart', name: 'Gráfico de Área', icon: AreaChart, category: 'charts', description: 'Linha com área preenchida', defaultSize: { w: 6, h: 4 }, minSize: { w: 3, h: 2 }, configurable: ['dataConfig', 'styling'] },
  { type: 'scatter-plot', name: 'Dispersão', icon: ScatterChart, category: 'charts', description: 'Mostra correlação entre variáveis', defaultSize: { w: 6, h: 4 }, minSize: { w: 3, h: 2 }, configurable: ['dataConfig', 'styling'] },
  
  // Metrics
  { type: 'kpi-card', name: 'Card KPI', icon: Activity, category: 'metrics', description: 'Métrica principal destacada', defaultSize: { w: 3, h: 2 }, minSize: { w: 2, h: 1 }, configurable: ['dataConfig', 'styling'] },
  { type: 'counter', name: 'Contador', icon: TrendingUp, category: 'metrics', description: 'Número simples com rótulo', defaultSize: { w: 2, h: 2 }, minSize: { w: 1, h: 1 }, configurable: ['dataConfig', 'styling'] },
  { type: 'progress-bar', name: 'Barra de Progresso', icon: Minus, category: 'metrics', description: 'Progresso visual percentual', defaultSize: { w: 4, h: 1 }, minSize: { w: 2, h: 1 }, configurable: ['dataConfig', 'styling'] },
  { type: 'gauge', name: 'Medidor', icon: Gauge, category: 'metrics', description: 'Velocímetro para métricas', defaultSize: { w: 4, h: 4 }, minSize: { w: 3, h: 3 }, configurable: ['dataConfig', 'styling'] },
  
  // Tables
  { type: 'data-table', name: 'Tabela de Dados', icon: Table, category: 'tables', description: 'Tabela com filtros e ordenação', defaultSize: { w: 8, h: 6 }, minSize: { w: 4, h: 3 }, configurable: ['dataConfig', 'styling', 'behavior'] },
  
  // Filters
  { type: 'date-picker', name: 'Seletor de Data', icon: Calendar, category: 'filters', description: 'Filtro por data/período', defaultSize: { w: 3, h: 1 }, minSize: { w: 2, h: 1 }, configurable: ['behavior'] },
  { type: 'dropdown', name: 'Lista Suspensa', icon: Filter, category: 'filters', description: 'Seleção única em lista', defaultSize: { w: 3, h: 1 }, minSize: { w: 2, h: 1 }, configurable: ['dataConfig', 'behavior'] },
  { type: 'multi-select', name: 'Seleção Múltipla', icon: Filter, category: 'filters', description: 'Múltiplas opções', defaultSize: { w: 4, h: 1 }, minSize: { w: 3, h: 1 }, configurable: ['dataConfig', 'behavior'] },
  { type: 'search-box', name: 'Caixa de Busca', icon: Search, category: 'filters', description: 'Busca textual', defaultSize: { w: 4, h: 1 }, minSize: { w: 3, h: 1 }, configurable: ['behavior'] },
  
  // Layout
  { type: 'container', name: 'Container', icon: Box, category: 'layout', description: 'Agrupa outros componentes', defaultSize: { w: 6, h: 4 }, minSize: { w: 2, h: 2 }, configurable: ['styling'] },
  { type: 'spacer', name: 'Espaçador', icon: Box, category: 'layout', description: 'Espaço em branco', defaultSize: { w: 1, h: 1 }, minSize: { w: 1, h: 1 }, configurable: [] },
  { type: 'divider', name: 'Divisor', icon: LayoutTemplate, category: 'layout', description: 'Linha separadora', defaultSize: { w: 6, h: 1 }, minSize: { w: 2, h: 1 }, configurable: ['styling'] },
  { type: 'tabs', name: 'Abas', icon: TabletSmartphone, category: 'layout', description: 'Navegação por abas', defaultSize: { w: 8, h: 6 }, minSize: { w: 4, h: 3 }, configurable: ['styling', 'behavior'] },
  
  // Text
  { type: 'heading', name: 'Título', icon: Type, category: 'text', description: 'Título principal', defaultSize: { w: 4, h: 1 }, minSize: { w: 2, h: 1 }, configurable: ['styling'] },
  { type: 'paragraph', name: 'Parágrafo', icon: AlignLeft, category: 'text', description: 'Texto descritivo', defaultSize: { w: 6, h: 2 }, minSize: { w: 3, h: 1 }, configurable: ['styling'] },
  { type: 'label', name: 'Rótulo', icon: Tag, category: 'text', description: 'Texto curto', defaultSize: { w: 2, h: 1 }, minSize: { w: 1, h: 1 }, configurable: ['styling'] },
  
  // Actions
  { type: 'button', name: 'Botão', icon: MousePointer, category: 'actions', description: 'Ação clicável', defaultSize: { w: 2, h: 1 }, minSize: { w: 1, h: 1 }, configurable: ['styling', 'behavior'] },
  { type: 'link', name: 'Link', icon: Link, category: 'actions', description: 'Link para navegação', defaultSize: { w: 2, h: 1 }, minSize: { w: 1, h: 1 }, configurable: ['styling', 'behavior'] },
];

const categories = [
  { id: 'charts', name: 'Gráficos', color: 'bg-blue-100 text-blue-800' },
  { id: 'metrics', name: 'Métricas', color: 'bg-green-100 text-green-800' },
  { id: 'tables', name: 'Tabelas', color: 'bg-purple-100 text-purple-800' },
  { id: 'filters', name: 'Filtros', color: 'bg-orange-100 text-orange-800' },
  { id: 'layout', name: 'Layout', color: 'bg-gray-100 text-gray-800' },
  { id: 'text', name: 'Texto', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'actions', name: 'Ações', color: 'bg-red-100 text-red-800' },
];

export const ComponentLibrary = ({ onComponentSelect, isCollapsed, onToggleCollapse }: ComponentLibraryProps) => {
  const handleDragStart = (e: React.DragEvent, componentType: ComponentType) => {
    e.dataTransfer.setData('application/component-type', componentType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  if (isCollapsed) {
    return (
      <Card className="w-12 h-full">
        <CardContent className="p-2 flex flex-col items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="w-8 h-8"
          >
            <Box className="h-4 w-4" />
          </Button>
          {categories.map(category => {
            const categoryComponents = componentDefinitions.filter(comp => comp.category === category.id);
            if (categoryComponents.length === 0) return null;
            
            const IconComponent = categoryComponents[0].icon;
            
            return (
              <div key={category.id} className="w-full">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mb-1">
                  <IconComponent className="h-4 w-4 text-gray-600" />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-80 h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Componentes</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="w-8 h-8"
          >
            <Box className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="px-4 pb-4 space-y-4">
            {categories.map(category => {
              const categoryComponents = componentDefinitions.filter(comp => comp.category === category.id);
              
              if (categoryComponents.length === 0) return null;
              
              return (
                <div key={category.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className={category.color}>
                      {category.name}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {categoryComponents.map(component => {
                      const IconComponent = component.icon;
                      
                      return (
                        <div
                          key={component.type}
                          draggable
                          onDragStart={(e) => handleDragStart(e, component.type)}
                          onClick={() => onComponentSelect(component.type)}
                          className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                              <IconComponent className="h-4 w-4 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm text-gray-900 truncate">
                                {component.name}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                {component.description}
                              </p>
                              <div className="flex items-center gap-1 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {component.defaultSize.w}x{component.defaultSize.h}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
