import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  BarChart3, 
  Plus, 
  Grid3X3,
  Edit3,
  Trash2,
  Eye,
  Users,
  DollarSign,
  Target,
  Activity,
  Settings,
  Save,
  Share2,
  Download,
  Upload,
  Star,
  Heart,
  Clock,
  History,
  Copy,
  Palette,
  RefreshCw,
  Search,
  Filter,
  Zap,
  Crown,
  TrendingUp,
  BookmarkPlus,
  Bookmark,
  UserCheck,
  Layout,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';
import { Responsive, WidthProvider, Layout as GridLayout } from 'react-grid-layout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const ResponsiveGridLayout = WidthProvider(Responsive);

// Widget Types and Categories
interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  config: {
    dataSource?: string;
    refreshInterval?: number;
    showLegend?: boolean;
    theme?: 'light' | 'dark' | 'colorful';
    realTime?: boolean;
    filters?: any[];
  };
  data?: any;
  isFavorite?: boolean;
  permissions?: {
    roles: string[];
    users: string[];
  };
  metadata?: {
    tags: string[];
    category: string;
    lastUpdated: Date;
    createdBy: string;
  };
}

interface DashboardLayout {
  id: string;
  name: string;
  description?: string;
  isDefault?: boolean;
  isPublic?: boolean;
  isFavorite?: boolean;
  widgets: DashboardWidget[];
  layout: GridLayout[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  permissions?: {
    canView: string[];
    canEdit: string[];
  };
}

const WIDGET_TYPES = {
  'kpi-card': {
    name: 'KPI Card',
    icon: TrendingUp,
    category: 'metrics',
    defaultSize: { w: 3, h: 2, minW: 2, minH: 2 },
    description: 'Exibe métricas principais com indicadores visuais'
  },
  'line-chart': {
    name: 'Gráfico de Linha',
    icon: BarChart3,
    category: 'charts',
    defaultSize: { w: 6, h: 4, minW: 4, minH: 3 },
    description: 'Gráfico de linha para tendências temporais'
  },
  'bar-chart': {
    name: 'Gráfico de Barras',
    icon: BarChart3,
    category: 'charts',
    defaultSize: { w: 6, h: 4, minW: 4, minH: 3 },
    description: 'Gráfico de barras para comparações'
  },
  'pie-chart': {
    name: 'Gráfico de Pizza',
    icon: Target,
    category: 'charts',
    defaultSize: { w: 4, h: 4, minW: 3, minH: 3 },
    description: 'Gráfico circular para distribuições'
  },
  'data-table': {
    name: 'Tabela de Dados',
    icon: Grid3X3,
    category: 'tables',
    defaultSize: { w: 8, h: 6, minW: 6, minH: 4 },
    description: 'Tabela com filtros e ordenação'
  },
  'activity-feed': {
    name: 'Feed de Atividades',
    icon: Activity,
    category: 'activity',
    defaultSize: { w: 4, h: 6, minW: 3, minH: 4 },
    description: 'Timeline de atividades recentes'
  },
  'progress-ring': {
    name: 'Anel de Progresso',
    icon: Target,
    category: 'metrics',
    defaultSize: { w: 2, h: 2, minW: 2, minH: 2 },
    description: 'Indicador circular de progresso'
  },
  'user-stats': {
    name: 'Estatísticas de Usuário',
    icon: Users,
    category: 'metrics',
    defaultSize: { w: 4, h: 3, minW: 3, minH: 2 },
    description: 'Métricas relacionadas a usuários'
  }
};

const SAMPLE_DATA = {
  kpi: {
    revenue: { value: '€1.2M', change: '+15.4%', trend: 'up' },
    leads: { value: '2,847', change: '+8.2%', trend: 'up' },
    conversion: { value: '12.8%', change: '-2.1%', trend: 'down' },
    deals: { value: '156', change: '+22%', trend: 'up' }
  },
  chartData: [
    { month: 'Jan', value: 120, leads: 450, deals: 23 },
    { month: 'Fev', value: 135, leads: 520, deals: 28 },
    { month: 'Mar', value: 148, leads: 410, deals: 31 },
    { month: 'Abr', value: 162, leads: 630, deals: 35 },
    { month: 'Mai', value: 178, leads: 710, deals: 42 },
    { month: 'Jun', value: 195, leads: 820, deals: 48 }
  ],
  pieData: [
    { name: 'Novos', value: 35, color: '#3b82f6' },
    { name: 'Qualificados', value: 25, color: '#10b981' },
    { name: 'Propostas', value: 20, color: '#f59e0b' },
    { name: 'Fechados', value: 20, color: '#ef4444' }
  ],
  activities: [
    { id: 1, user: 'Ana Silva', action: 'fechou oportunidade de €25k', time: '2h', type: 'success' },
    { id: 2, user: 'João Santos', action: 'criou novo lead', time: '4h', type: 'info' },
    { id: 3, user: 'Maria Costa', action: 'agendou reunião', time: '6h', type: 'neutral' }
  ]
};

const DEFAULT_TEMPLATES: DashboardLayout[] = [
  {
    id: 'executive',
    name: 'Dashboard Executivo',
    description: 'Visão geral para executivos com KPIs principais',
    isDefault: true,
    isPublic: true,
    isFavorite: false,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['executivo', 'kpis', 'visão-geral'],
    widgets: [
      { id: 'w1', type: 'kpi-card', title: 'Receita Total', config: { theme: 'light' } },
      { id: 'w2', type: 'kpi-card', title: 'Leads Gerados', config: { theme: 'light' } },
      { id: 'w3', type: 'kpi-card', title: 'Taxa Conversão', config: { theme: 'light' } },
      { id: 'w4', type: 'line-chart', title: 'Evolução de Vendas', config: { theme: 'light' } },
      { id: 'w5', type: 'pie-chart', title: 'Pipeline por Estágio', config: { theme: 'light' } }
    ],
    layout: [
      { i: 'w1', x: 0, y: 0, w: 3, h: 2 },
      { i: 'w2', x: 3, y: 0, w: 3, h: 2 },
      { i: 'w3', x: 6, y: 0, w: 3, h: 2 },
      { i: 'w4', x: 0, y: 2, w: 6, h: 4 },
      { i: 'w5', x: 6, y: 2, w: 3, h: 4 }
    ]
  },
  {
    id: 'sales-manager',
    name: 'Gestor de Vendas',
    description: 'Dashboard focado em métricas de vendas e pipeline',
    isDefault: true,
    isPublic: true,
    isFavorite: false,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['vendas', 'pipeline', 'gestão'],
    widgets: [
      { id: 'w1', type: 'kpi-card', title: 'Vendas do Mês', config: { theme: 'light' } },
      { id: 'w2', type: 'kpi-card', title: 'Meta Atingida', config: { theme: 'light' } },
      { id: 'w3', type: 'bar-chart', title: 'Performance por Vendedor', config: { theme: 'light' } },
      { id: 'w4', type: 'data-table', title: 'Oportunidades em Aberto', config: { theme: 'light' } },
      { id: 'w5', type: 'activity-feed', title: 'Atividades Recentes', config: { theme: 'light' } }
    ],
    layout: [
      { i: 'w1', x: 0, y: 0, w: 3, h: 2 },
      { i: 'w2', x: 3, y: 0, w: 3, h: 2 },
      { i: 'w3', x: 0, y: 2, w: 6, h: 4 },
      { i: 'w4', x: 6, y: 0, w: 6, h: 4 },
      { i: 'w5', x: 6, y: 4, w: 4, h: 4 }
    ]
  },
  {
    id: 'marketing-analyst',
    name: 'Analista de Marketing',
    description: 'Métricas de marketing e geração de leads',
    isDefault: true,
    isPublic: true,
    isFavorite: false,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['marketing', 'leads', 'campanhas'],
    widgets: [
      { id: 'w1', type: 'kpi-card', title: 'Leads Gerados', config: { theme: 'colorful' } },
      { id: 'w2', type: 'kpi-card', title: 'Custo por Lead', config: { theme: 'colorful' } },
      { id: 'w3', type: 'kpi-card', title: 'ROI Campanhas', config: { theme: 'colorful' } },
      { id: 'w4', type: 'line-chart', title: 'Tendência de Leads', config: { theme: 'colorful' } },
      { id: 'w5', type: 'pie-chart', title: 'Fontes de Leads', config: { theme: 'colorful' } }
    ],
    layout: [
      { i: 'w1', x: 0, y: 0, w: 2, h: 2 },
      { i: 'w2', x: 2, y: 0, w: 2, h: 2 },
      { i: 'w3', x: 4, y: 0, w: 2, h: 2 },
      { i: 'w4', x: 0, y: 2, w: 6, h: 4 },
      { i: 'w5', x: 6, y: 0, w: 3, h: 4 }
    ]
  }
];

const WidgetRenderer = ({ widget, isEditing, onEditWidget, onDeleteWidget }: { 
  widget: DashboardWidget; 
  isEditing: boolean; 
  onEditWidget?: (widget: DashboardWidget) => void;
  onDeleteWidget?: (widgetId: string) => void;
}) => {
  const renderContent = () => {
    switch (widget.type) {
      case 'kpi-card':
        const kpiData = SAMPLE_DATA.kpi.revenue;
        return (
          <div className="flex items-center justify-between h-full">
            <div>
              <p className="text-2xl font-bold">{kpiData.value}</p>
              <div className="flex items-center text-sm mt-1">
                <TrendingUp className={`h-4 w-4 mr-1 ${kpiData.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                <span className={kpiData.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {kpiData.change}
                </span>
              </div>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        );

      case 'line-chart':
        return (
          <div className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SAMPLE_DATA.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );

      case 'bar-chart':
        return (
          <div className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SAMPLE_DATA.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case 'pie-chart':
        return (
          <div className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={SAMPLE_DATA.pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {SAMPLE_DATA.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );

      case 'activity-feed':
        return (
          <div className="space-y-3 h-full overflow-y-auto">
            {SAMPLE_DATA.activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'success' ? 'bg-green-500' : 
                  activity.type === 'info' ? 'bg-blue-500' : 'bg-gray-400'
                }`}></div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time} atrás</p>
                </div>
              </div>
            ))}
          </div>
        );

      case 'progress-ring':
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  className="text-blue-500"
                  strokeDasharray="75, 100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold">75%</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Meta Atingida</p>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <Grid3X3 className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Widget</p>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
          {isEditing && (
            <div className="flex items-center space-x-1" style={{ pointerEvents: 'all' }}>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-6 w-6 p-0 hover:bg-gray-100"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEditWidget?.(widget);
                }}
              >
                <Edit3 className="h-3 w-3" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDeleteWidget?.(widget.id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export const PersonalizedDashboard = () => {
  const { user } = useAuth();
  const [currentLayout, setCurrentLayout] = useState<DashboardLayout | null>(null);
  const [savedLayouts, setSavedLayouts] = useState<DashboardLayout[]>(DEFAULT_TEMPLATES);
  const [isEditing, setIsEditing] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedWidgetType, setSelectedWidgetType] = useState<string | null>(null);
  const [layoutHistory, setLayoutHistory] = useState<DashboardLayout[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Grid layout configuration
  const [breakpoints, setBreakpoints] = useState({
    lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0
  });
  
  const [cols, setCols] = useState({
    lg: 12, md: 10, sm: 6, xs: 4, xxs: 2
  });

  useEffect(() => {
    // Load user's saved layouts from localStorage
    const savedUserLayouts = localStorage.getItem(`dashboard_layouts_${user?.id}`);
    if (savedUserLayouts) {
      const layouts = JSON.parse(savedUserLayouts);
      setSavedLayouts([...DEFAULT_TEMPLATES, ...layouts]);
    }

    // Load current layout
    const currentUserLayout = localStorage.getItem(`current_dashboard_${user?.id}`);
    if (currentUserLayout) {
      setCurrentLayout(JSON.parse(currentUserLayout));
    } else {
      // Set default layout for new users
      setCurrentLayout(DEFAULT_TEMPLATES[0]);
    }
  }, [user?.id]);

  const saveLayout = useCallback((layout: DashboardLayout) => {
    if (!user) return;
    
    const userLayouts = savedLayouts.filter(l => l.createdBy !== 'system');
    localStorage.setItem(`dashboard_layouts_${user.id}`, JSON.stringify(userLayouts));
    localStorage.setItem(`current_dashboard_${user.id}`, JSON.stringify(layout));
    
    toast.success('Layout salvo com sucesso!');
  }, [savedLayouts, user]);

  const loadTemplate = useCallback((template: DashboardLayout) => {
    const newLayout = {
      ...template,
      id: `${template.id}_${Date.now()}`,
      createdBy: user?.id || 'unknown',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setCurrentLayout(newLayout);
    setShowTemplates(false);
    toast.success(`Template "${template.name}" carregado!`);
  }, [user?.id]);

  const addWidget = useCallback((widgetType: string) => {
    if (!currentLayout || !WIDGET_TYPES[widgetType]) return;

    const widgetConfig = WIDGET_TYPES[widgetType];
    const newWidget: DashboardWidget = {
      id: `widget_${Date.now()}`,
      type: widgetType,
      title: widgetConfig.name,
      config: {
        theme: 'light',
        refreshInterval: 30,
        realTime: false
      },
      metadata: {
        tags: [widgetConfig.category],
        category: widgetConfig.category,
        lastUpdated: new Date(),
        createdBy: user?.id || 'unknown'
      }
    };

    const newLayoutItem = {
      i: newWidget.id,
      x: 0,
      y: 0,
      ...widgetConfig.defaultSize
    };

    const updatedLayout = {
      ...currentLayout,
      widgets: [...currentLayout.widgets, newWidget],
      layout: [...currentLayout.layout, newLayoutItem],
      updatedAt: new Date()
    };

    setCurrentLayout(updatedLayout);
    toast.success(`Widget "${widgetConfig.name}" adicionado!`);
  }, [currentLayout, user?.id]);

  const onLayoutChange = useCallback((newLayout: GridLayout[]) => {
    if (!currentLayout) return;

    const updatedLayout = {
      ...currentLayout,
      layout: newLayout,
      updatedAt: new Date()
    };

    setCurrentLayout(updatedLayout);
  }, [currentLayout]);

  const toggleFavorite = useCallback((layoutId: string) => {
    setSavedLayouts(layouts => 
      layouts.map(layout => 
        layout.id === layoutId 
          ? { ...layout, isFavorite: !layout.isFavorite }
          : layout
      )
    );
  }, []);

  const deleteWidget = useCallback((widgetId: string) => {
    if (!currentLayout) return;

    const updatedLayout = {
      ...currentLayout,
      widgets: currentLayout.widgets.filter(w => w.id !== widgetId),
      layout: currentLayout.layout.filter(l => l.i !== widgetId),
      updatedAt: new Date()
    };

    setCurrentLayout(updatedLayout);
    toast.success('Widget removido!');
  }, [currentLayout]);

  const duplicateLayout = useCallback((layout: DashboardLayout) => {
    const newLayout = {
      ...layout,
      id: `${layout.id}_copy_${Date.now()}`,
      name: `${layout.name} (Cópia)`,
      createdBy: user?.id || 'unknown',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDefault: false
    };

    setSavedLayouts(layouts => [...layouts, newLayout]);
    toast.success('Layout duplicado com sucesso!');
  }, [user?.id]);

  const filteredTemplates = savedLayouts.filter(layout => {
    const matchesSearch = layout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         layout.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || layout.tags.includes(filterCategory);
    return matchesSearch && matchesCategory;
  });

  if (!currentLayout) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Monitor className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Carregando Dashboard...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{currentLayout.name}</h1>
          <p className="text-gray-600">{currentLayout.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowTemplates(!showTemplates)}
          >
            <Layout className="h-4 w-4 mr-2" />
            Templates
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <Eye className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
            {isEditing ? 'Visualizar' : 'Editar'}
          </Button>
          <Button onClick={() => saveLayout(currentLayout)}>
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      {/* Templates Sidebar */}
      {showTemplates && (
        <Card>
          <CardHeader>
            <CardTitle>Templates de Dashboard</CardTitle>
            <div className="flex space-x-2">
              <Input
                placeholder="Buscar templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="executivo">Executivo</SelectItem>
                  <SelectItem value="vendas">Vendas</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="operacional">Operacional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">{template.name}</CardTitle>
                        <div className="flex items-center space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(template.id);
                            }}
                            className="h-6 w-6 p-0"
                          >
                            {template.isFavorite ? 
                              <Heart className="h-3 w-3 text-red-500 fill-current" /> : 
                              <Heart className="h-3 w-3" />
                            }
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              duplicateLayout(template);
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">{template.description}</p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {template.widgets.length} widgets
                          </Badge>
                          {template.isDefault && (
                            <Badge variant="secondary" className="text-xs">
                              Padrão
                            </Badge>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => loadTemplate(template)}
                        >
                          Usar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Widget Palette */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Widgets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
              {Object.entries(WIDGET_TYPES).map(([type, config]) => {
                const Icon = config.icon;
                return (
                  <Button
                    key={type}
                    variant="outline"
                    onClick={() => addWidget(type)}
                    className="h-16 flex-col space-y-1"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs">{config.name}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dashboard Grid */}
      <div className="min-h-96">
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: currentLayout.layout }}
          breakpoints={breakpoints}
          cols={cols}
          rowHeight={60}
          isDraggable={isEditing}
          isResizable={isEditing}
          onLayoutChange={onLayoutChange}
          margin={[16, 16]}
          containerPadding={[0, 0]}
        >
          {currentLayout.widgets.map((widget) => (
            <div key={widget.id}>
              <WidgetRenderer 
                widget={widget} 
                isEditing={isEditing}
                onEditWidget={(widget) => toast.info(`Editar widget: ${widget.title}`)}
                onDeleteWidget={deleteWidget}
              />
            </div>
          ))}
        </ResponsiveGridLayout>
      </div>

      {/* Empty State */}
      {currentLayout.widgets.length === 0 && (
        <div className="text-center py-12">
          <Grid3X3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Dashboard Vazio
          </h3>
          <p className="text-gray-500 mb-6">
            Comece adicionando widgets ao seu dashboard personalizado
          </p>
          <Button onClick={() => setIsEditing(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Widgets
          </Button>
        </div>
      )}
    </div>
  );
};