
import { LucideIcon } from 'lucide-react';

export interface DashboardConfig {
  id: string;
  name: string;
  description?: string;
  layout: ComponentLayout[];
  datasources: DataSource[];
  relationships: ComponentRelationship[];
  theme: 'light' | 'dark';
  refreshInterval?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ComponentLayout {
  id: string;
  type: ComponentType;
  position: GridPosition;
  config: ComponentConfig;
  dataSource: string;
  title?: string;
  visible: boolean;
}

export interface GridPosition {
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}

export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  data: any[];
  fields: DataField[];
  refreshInterval?: number;
  lastUpdated: Date;
}

export interface DataField {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'percentage';
  label: string;
  aggregatable: boolean;
  filterable: boolean;
}

export interface ComponentConfig {
  title?: string;
  dataConfig: DataConfig;
  styling: ComponentStyling;
  behavior: ComponentBehavior;
  filters?: FilterConfig[];
}

export interface DataConfig {
  xAxis?: string;
  yAxis?: string;
  value?: string;
  groupBy?: string;
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}

export interface ComponentStyling {
  colors?: string[];
  size?: 'sm' | 'md' | 'lg';
  showLegend?: boolean;
  showGrid?: boolean;
  showLabels?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
}

export interface ComponentBehavior {
  clickable?: boolean;
  hoverable?: boolean;
  filterable?: boolean;
  drillDown?: boolean;
  crossFilter?: boolean;
  animation?: boolean;
}

export interface FilterConfig {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in';
  value: any;
  active: boolean;
}

export interface ComponentRelationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: 'filter' | 'drilldown' | 'crossfilter';
  config: any;
}

export type ComponentType = 
  | 'line-chart'
  | 'bar-chart'
  | 'pie-chart'
  | 'donut-chart'
  | 'area-chart'
  | 'scatter-plot'
  | 'kpi-card'
  | 'counter'
  | 'progress-bar'
  | 'gauge'
  | 'data-table'
  | 'date-picker'
  | 'dropdown'
  | 'multi-select'
  | 'search-box'
  | 'container'
  | 'spacer'
  | 'divider'
  | 'tabs'
  | 'heading'
  | 'paragraph'
  | 'label'
  | 'button'
  | 'link';

export type DataSourceType = 'sales' | 'users' | 'products' | 'financial' | 'analytics';

export interface ComponentDefinition {
  type: ComponentType;
  name: string;
  icon: LucideIcon;
  category: 'charts' | 'metrics' | 'tables' | 'filters' | 'layout' | 'text' | 'actions';
  description: string;
  defaultSize: { w: number; h: number };
  minSize: { w: number; h: number };
  configurable: string[];
}

export interface DashboardState {
  config: DashboardConfig | null;
  selectedComponent: string | null;
  isPreviewMode: boolean;
  isDragging: boolean;
  history: DashboardConfig[];
  historyIndex: number;
}
