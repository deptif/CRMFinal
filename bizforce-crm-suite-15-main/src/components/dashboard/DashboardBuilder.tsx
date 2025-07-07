import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay, 
  DragStartEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
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
  Copy,
  Share2,
  Download,
  Upload,
  Layers,
  Filter,
  RefreshCw,
  Calendar,
  Clock,
  Zap,
  Database,
  LineChart as LineChartIcon,
  AreaChart as AreaChartIcon,
  Globe,
  Smartphone,
  Tablet,
  Monitor,
  Palette,
  Code,
  Save,
  Undo,
  Redo,
  GripVertical,
  Search,
  ChevronDown,
  ChevronUp,
  Star,
  Heart,
  Bookmark,
  MessageSquare,
  Bell,
  Mail,
  Phone,
  MapPin,
  ShoppingCart,
  CreditCard,
  Percent,
  Award,
  Crown,
  Shield,
  Lock,
  Unlock,
  Key,
  FileText,
  Image,
  Video,
  Music,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Wifi,
  Battery,
  Signal,
  Bluetooth,
  Camera,
  Mic,
  Speaker,
  Headphones,
  Radio,
  Tv,
  Laptop,
  HardDrive,
  Cpu,
  CircuitBoard,
  Thermometer,
  Gauge,
  Timer,
  AlarmClock,
  Hourglass,
  Sunrise,
  Sunset,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Rainbow,
  Umbrella,
  CheckCircle,
  Calculator
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartssPieChart, Pie, Cell, LineChart, Line, AreaChart as RechartsAreaChart, Area, RadialBarChart, RadialBar, ScatterChart, Scatter, ComposedChart, FunnelChart, Funnel, LabelList, Treemap } from 'recharts';
import { toast } from 'sonner';

interface Widget {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  description?: string;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  position: { x: number; y: number; w: number; h: number };
  config: {
    dataSource?: string;
    fields?: string[];
    colors?: string[];
    refreshInterval?: number;
    filters?: any[];
    aggregation?: string;
    timeframe?: string;
    showLegend?: boolean;
    showGrid?: boolean;
    animation?: boolean;
    theme?: 'default' | 'dark' | 'colorful' | 'minimal' | 'neon' | 'glassmorphism';
    customCSS?: string;
    conditionalFormatting?: any[];
    formula?: string;
    calculation?: string;
    displayMode?: string;
    sparkline?: boolean;
    comparison?: boolean;
    target?: number;
    threshold?: {min: number, max: number};
    alerts?: boolean;
    drillDown?: boolean;
    exportable?: boolean;
    realTime?: boolean;
    predictive?: boolean;
    aiInsights?: boolean;
  };
  permissions?: {
    canView: string[];
    canEdit: string[];
  };
  isVisible: boolean;
  isDragging?: boolean;
  lastUpdated: Date;
  data?: any;
  metadata?: {
    tags: string[];
    category: string;
    complexity: 'basic' | 'intermediate' | 'advanced' | 'expert';
    performance: 'low' | 'medium' | 'high';
    dependencies: string[];
  };
}

interface WidgetCategory {
  name: string;
  icon: any;
  color: string;
  widgets: {
    type: string;
    name: string;
    description: string;
    icon: any;
    complexity: string;
    sizes: string[];
  }[];
}

const WIDGET_CATEGORIES: Record<string, WidgetCategory> = {
  'core-metrics': {
    name: 'Core Metrics',
    icon: TrendingUp,
    color: 'bg-blue-500',
    widgets: [
      {
        type: 'kpi-card',
        name: 'KPI Card',
        description: 'Cartão de métrica com indicadores visuais',
        icon: TrendingUp,
        complexity: 'basic',
        sizes: ['xs', 'sm', 'md']
      },
      {
        type: 'metric-comparison',
        name: 'Comparação de Métricas',
        description: 'Compare múltiplas métricas lado a lado',
        icon: BarChart3,
        complexity: 'intermediate',
        sizes: ['md', 'lg']
      },
      {
        type: 'progress-ring',
        name: 'Anel de Progresso',
        description: 'Progresso circular com meta',
        icon: Target,
        complexity: 'basic',
        sizes: ['xs', 'sm']
      },
      {
        type: 'gauge-meter',
        name: 'Velocímetro',
        description: 'Medidor em formato de velocímetro',
        icon: Gauge,
        complexity: 'intermediate',
        sizes: ['sm', 'md']
      },
      {
        type: 'scorecard',
        name: 'Scorecard',
        description: 'Cartão de pontuação com múltiplas métricas',
        icon: Award,
        complexity: 'intermediate',
        sizes: ['md', 'lg']
      }
    ]
  },
  'advanced-charts': {
    name: 'Gráficos Avançados',
    icon: BarChart3,
    color: 'bg-green-500',
    widgets: [
      {
        type: 'multi-series-line',
        name: 'Linha Multi-Série',
        description: 'Gráfico de linha com múltiplas séries',
        icon: LineChartIcon,
        complexity: 'intermediate',
        sizes: ['md', 'lg', 'xl']
      },
      {
        type: 'stacked-area',
        name: 'Área Empilhada',
        description: 'Gráfico de área com séries empilhadas',
        icon: AreaChartIcon,
        complexity: 'intermediate',
        sizes: ['md', 'lg', 'xl']
      },
      {
        type: 'combo-chart',
        name: 'Gráfico Combinado',
        description: 'Combina barras e linhas',
        icon: BarChart3,
        complexity: 'advanced',
        sizes: ['lg', 'xl']
      },
      {
        type: 'waterfall-chart',
        name: 'Gráfico Cascata',
        description: 'Mostra evolução sequencial',
        icon: TrendingUp,
        complexity: 'advanced',
        sizes: ['lg', 'xl']
      },
      {
        type: 'treemap',
        name: 'Treemap',
        description: 'Visualização hierárquica de dados',
        icon: Grid3X3,
        complexity: 'advanced',
        sizes: ['lg', 'xl']
      },
      {
        type: 'scatter-plot',
        name: 'Gráfico de Dispersão',
        description: 'Análise de correlação entre variáveis',
        icon: Target,
        complexity: 'intermediate',
        sizes: ['md', 'lg', 'xl']
      },
      {
        type: 'bubble-chart',
        name: 'Gráfico de Bolhas',
        description: 'Três dimensões de dados',
        icon: CircuitBoard,
        complexity: 'advanced',
        sizes: ['lg', 'xl']
      }
    ]
  },
  'data-tables': {
    name: 'Tabelas Inteligentes',
    icon: Grid3X3,
    color: 'bg-purple-500',
    widgets: [
      {
        type: 'smart-table',
        name: 'Tabela Inteligente',
        description: 'Tabela com busca, filtros e ordenação',
        icon: Grid3X3,
        complexity: 'intermediate',
        sizes: ['md', 'lg', 'xl', 'full']
      },
      {
        type: 'pivot-table',
        name: 'Tabela Dinâmica',
        description: 'Análise multidimensional de dados',
        icon: Layers,
        complexity: 'expert',
        sizes: ['lg', 'xl', 'full']
      },
      {
        type: 'comparison-table',
        name: 'Tabela de Comparação',
        description: 'Compare registros lado a lado',
        icon: BarChart3,
        complexity: 'intermediate',
        sizes: ['md', 'lg', 'xl']
      },
      {
        type: 'leaderboard',
        name: 'Ranking',
        description: 'Classificação com avatares e badges',
        icon: Crown,
        complexity: 'basic',
        sizes: ['md', 'lg']
      }
    ]
  },
  'ai-analytics': {
    name: 'IA & Analytics',
    icon: Zap,
    color: 'bg-yellow-500',
    widgets: [
      {
        type: 'ai-insights',
        name: 'Insights de IA',
        description: 'Análises automáticas com IA',
        icon: Zap,
        complexity: 'expert',
        sizes: ['md', 'lg', 'xl']
      },
      {
        type: 'predictive-chart',
        name: 'Previsão Inteligente',
        description: 'Gráficos com previsões de IA',
        icon: TrendingUp,
        complexity: 'expert',
        sizes: ['lg', 'xl']
      },
      {
        type: 'anomaly-detector',
        name: 'Detector de Anomalias',
        description: 'Identifica padrões anômalos',
        icon: Shield,
        complexity: 'expert',
        sizes: ['md', 'lg']
      },
      {
        type: 'sentiment-analysis',
        name: 'Análise de Sentimento',
        description: 'Analisa sentimentos em texto',
        icon: Heart,
        complexity: 'advanced',
        sizes: ['md', 'lg']
      },
      {
        type: 'recommendation-engine',
        name: 'Motor de Recomendação',
        description: 'Recomendações personalizadas',
        icon: Star,
        complexity: 'expert',
        sizes: ['md', 'lg', 'xl']
      }
    ]
  },
  'workflow-automation': {
    name: 'Automação & Workflow',
    icon: Settings,
    color: 'bg-orange-500',
    widgets: [
      {
        type: 'workflow-status',
        name: 'Status do Workflow',
        description: 'Acompanhe automações em tempo real',
        icon: Settings,
        complexity: 'intermediate',
        sizes: ['md', 'lg']
      },
      {
        type: 'approval-tracker',
        name: 'Rastreador de Aprovações',
        description: 'Monitore processos de aprovação',
        icon: CheckCircle,
        complexity: 'intermediate',
        sizes: ['md', 'lg', 'xl']
      },
      {
        type: 'sla-monitor',
        name: 'Monitor de SLA',
        description: 'Acompanhe acordos de nível de serviço',
        icon: Clock,
        complexity: 'advanced',
        sizes: ['md', 'lg']
      },
      {
        type: 'task-kanban',
        name: 'Kanban de Tarefas',
        description: 'Quadro kanban interativo',
        icon: Layers,
        complexity: 'intermediate',
        sizes: ['lg', 'xl', 'full']
      }
    ]
  },
  'communication': {
    name: 'Comunicação',
    icon: MessageSquare,
    color: 'bg-pink-500',
    widgets: [
      {
        type: 'activity-feed',
        name: 'Feed de Atividades',
        description: 'Timeline de atividades recentes',
        icon: Activity,
        complexity: 'basic',
        sizes: ['md', 'lg']
      },
      {
        type: 'chat-widget',
        name: 'Widget de Chat',
        description: 'Chat em tempo real',
        icon: MessageSquare,
        complexity: 'advanced',
        sizes: ['md', 'lg', 'xl']
      },
      {
        type: 'notification-center',
        name: 'Central de Notificações',
        description: 'Painel de notificações',
        icon: Bell,
        complexity: 'intermediate',
        sizes: ['md', 'lg']
      },
      {
        type: 'email-tracker',
        name: 'Rastreador de Email',
        description: 'Monitore campanhas de email',
        icon: Mail,
        complexity: 'intermediate',
        sizes: ['md', 'lg']
      }
    ]
  },
  'multimedia': {
    name: 'Multimídia',
    icon: Image,
    color: 'bg-indigo-500',
    widgets: [
      {
        type: 'image-gallery',
        name: 'Galeria de Imagens',
        description: 'Showcase de imagens com lightbox',
        icon: Image,
        complexity: 'basic',
        sizes: ['md', 'lg', 'xl']
      },
      {
        type: 'video-player',
        name: 'Player de Vídeo',
        description: 'Player de vídeo avançado',
        icon: Video,
        complexity: 'intermediate',
        sizes: ['md', 'lg', 'xl']
      },
      {
        type: 'document-viewer',
        name: 'Visualizador de Documentos',
        description: 'Visualize PDFs e documentos',
        icon: FileText,
        complexity: 'intermediate',
        sizes: ['lg', 'xl']
      },
      {
        type: 'iframe-embed',
        name: 'Embed de Website',
        description: 'Incorpore websites externos',
        icon: Globe,
        complexity: 'basic',
        sizes: ['md', 'lg', 'xl', 'full']
      }
    ]
  },
  'custom-code': {
    name: 'Código Personalizado',
    icon: Code,
    color: 'bg-gray-500',
    widgets: [
      {
        type: 'custom-html',
        name: 'HTML Personalizado',
        description: 'Widget com código HTML customizado',
        icon: Code,
        complexity: 'expert',
        sizes: ['sm', 'md', 'lg', 'xl']
      },
      {
        type: 'api-data',
        name: 'Dados de API',
        description: 'Conecte a APIs externas',
        icon: Database,
        complexity: 'expert',
        sizes: ['md', 'lg', 'xl']
      },
      {
        type: 'formula-field',
        name: 'Campo de Fórmula',
        description: 'Cálculos customizados',
        icon: Calculator,
        complexity: 'advanced',
        sizes: ['xs', 'sm', 'md']
      }
    ]
  }
};

const SAMPLE_DATA = {
  revenue: { value: '€1.2M', change: '+15.4%', trend: 'up' },
  leads: { value: '2,847', change: '+8.2%', trend: 'up' },
  conversion: { value: '12.8%', change: '-2.1%', trend: 'down' },
  deals: { value: '156', change: '+22%', trend: 'up' },
  
  chartData: [
    { month: 'Jan', revenue: 120000, leads: 450, deals: 23 },
    { month: 'Fev', revenue: 135000, leads: 520, deals: 28 },
    { month: 'Mar', revenue: 148000, leads: 410, deals: 31 },
    { month: 'Abr', revenue: 162000, leads: 630, deals: 35 },
    { month: 'Mai', revenue: 178000, leads: 710, deals: 42 },
    { month: 'Jun', revenue: 195000, leads: 820, deals: 48 }
  ],
  
  pieData: [
    { name: 'Novos', value: 35, color: '#3b82f6' },
    { name: 'Qualificados', value: 25, color: '#10b981' },
    { name: 'Propostas', value: 20, color: '#f59e0b' },
    { name: 'Fechados', value: 20, color: '#ef4444' }
  ],
  
  tableData: [
    { id: 1, account: 'TechCorp Ltd', value: '€75,000', stage: 'Negotiation', probability: 85, owner: 'Ana Silva' },
    { id: 2, account: 'StartupXYZ', value: '€45,000', stage: 'Proposal', probability: 60, owner: 'João Santos' },
    { id: 3, account: 'Enterprise Inc', value: '€120,000', stage: 'Qualified', probability: 40, owner: 'Maria Costa' },
    { id: 4, account: 'Innovation Co', value: '€32,000', stage: 'Discovery', probability: 25, owner: 'Pedro Silva' }
  ]
};

const SortableWidget = ({ widget, onEdit, onDelete, isPreview = false }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getSizeClass = (size: string) => {
    switch (size) {
      case 'xs': return 'col-span-1 row-span-1 min-h-32';
      case 'sm': return 'col-span-2 row-span-1 min-h-40';
      case 'md': return 'col-span-3 row-span-2 min-h-64';
      case 'lg': return 'col-span-4 row-span-3 min-h-80';
      case 'xl': return 'col-span-6 row-span-4 min-h-96';
      case 'full': return 'col-span-full row-span-2 min-h-64';
      default: return 'col-span-2 row-span-2 min-h-48';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`relative group ${getSizeClass(widget.size)}`}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300">
        {!isPreview && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <div className="flex space-x-1">
              <Button size="sm" variant="outline" onClick={() => onEdit(widget)}>
                <Edit3 className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => onDelete(widget.id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" {...listeners}>
                <GripVertical className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
        
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">{widget.title}</CardTitle>
              {widget.subtitle && (
                <p className="text-sm text-muted-foreground">{widget.subtitle}</p>
              )}
            </div>
            {widget.config.realTime && (
              <Badge variant="outline" className="text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                Live
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {renderWidgetContent(widget)}
        </CardContent>
      </Card>
    </div>
  );
};

const renderWidgetContent = (widget: Widget) => {
  switch (widget.type) {
    case 'kpi-card':
      return (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold">{SAMPLE_DATA.revenue.value}</p>
            <div className="flex items-center text-sm">
              <TrendingUp className={`h-4 w-4 mr-1 ${SAMPLE_DATA.revenue.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
              <span className={SAMPLE_DATA.revenue.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                {SAMPLE_DATA.revenue.change}
              </span>
            </div>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      );

    case 'multi-series-line':
      return (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={SAMPLE_DATA.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="leads" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      );

    case 'smart-table':
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Input placeholder="Buscar..." className="max-w-sm" />
            <Button size="sm" variant="outline">
              <Filter className="h-4 w-4 mr-1" />
              Filtros
            </Button>
          </div>
          <div className="space-y-2">
            {SAMPLE_DATA.tableData.slice(0, 3).map((row) => (
              <div key={row.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex-1">
                  <p className="font-medium">{row.account}</p>
                  <p className="text-sm text-muted-foreground">{row.owner}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{row.value}</p>
                  <Badge className="text-xs">{row.stage}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'ai-insights':
      return (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <h4 className="font-medium">Insights de IA</h4>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm">📈 Tendência crescente de 23% nas vendas de produtos premium</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm">🎯 Oportunidade identificada no segmento tecnologia</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="text-sm">⚠️ Atenção necessária: leads de marketing com baixa conversão</p>
            </div>
          </div>
        </div>
      );

    case 'progress-ring':
      return (
        <div className="flex flex-col items-center justify-center h-32">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-200"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                className="text-blue-500"
                strokeDasharray="75, 100"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold">75%</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Meta Atingida</p>
        </div>
      );

    case 'activity-feed':
      return (
        <div className="space-y-3">
          {[
            { user: 'Ana Silva', action: 'fechou uma oportunidade de €25k', time: '2h atrás', type: 'success' },
            { user: 'João Santos', action: 'criou novo lead da TechCorp', time: '4h atrás', type: 'info' },
            { user: 'Maria Costa', action: 'agendou reunião com cliente', time: '6h atrás', type: 'neutral' }
          ].map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                activity.type === 'success' ? 'bg-green-500' : 
                activity.type === 'info' ? 'bg-blue-500' : 'bg-gray-400'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span> {activity.action}
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      );

    case 'combo-chart':
      return (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={SAMPLE_DATA.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="deals" fill="#8884d8" />
              <Line type="monotone" dataKey="revenue" stroke="#ff7300" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      );

    default:
      return (
        <div className="flex items-center justify-center h-32 text-muted-foreground">
          <div className="text-center">
            <Grid3X3 className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">Widget Preview</p>
          </div>
        </div>
      );
  }
};

export const DashboardBuilder = () => {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState('core-metrics');
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedWidget, setDraggedWidget] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setDraggedWidget(widgets.find(w => w.id === active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setWidgets((widgets) => {
        const oldIndex = widgets.findIndex(w => w.id === active.id);
        const newIndex = widgets.findIndex(w => w.id === over.id);
        return arrayMove(widgets, oldIndex, newIndex);
      });
    }
    setDraggedWidget(null);
  };

  const addWidget = (widgetType: any) => {
    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      type: widgetType.type,
      title: widgetType.name,
      subtitle: 'Widget personalizado',
      size: 'md',
      position: { x: 0, y: 0, w: 3, h: 2 },
      config: {
        theme: 'default',
        refreshInterval: 30,
        showLegend: true,
        animation: true,
        realTime: Math.random() > 0.5,
        aiInsights: widgetType.complexity === 'expert'
      },
      isVisible: true,
      lastUpdated: new Date(),
      metadata: {
        tags: [activeCategory],
        category: activeCategory,
        complexity: widgetType.complexity,
        performance: 'medium',
        dependencies: []
      }
    };
    
    setWidgets([...widgets, newWidget]);
    toast.success(`Widget "${widgetType.name}" adicionado com sucesso!`);
  };

  const editWidget = (widget: Widget) => {
    setSelectedWidget(widget);
  };

  const deleteWidget = (widgetId: string) => {
    setWidgets(widgets.filter(w => w.id !== widgetId));
    toast.success('Widget removido com sucesso!');
  };

  const updateWidget = (updatedWidget: Widget) => {
    setWidgets(widgets.map(w => w.id === updatedWidget.id ? updatedWidget : w));
    setSelectedWidget(null);
    toast.success('Widget atualizado com sucesso!');
  };

  const filteredWidgets = Object.entries(WIDGET_CATEGORIES).reduce((acc, [key, category]) => {
    if (activeCategory === 'all' || activeCategory === key) {
      const filtered = category.widgets.filter(widget =>
        widget.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        widget.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[key] = { ...category, widgets: filtered };
      }
    }
    return acc;
  }, {} as Record<string, WidgetCategory>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Builder Pro</h1>
          <p className="text-muted-foreground">
            Crie dashboards profissionais com widgets inteligentes e IA integrada
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Modo Edição' : 'Preview'}
          </Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Salvar Dashboard
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Widget Library */}
        {!previewMode && (
          <div className="col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Biblioteca de Widgets</CardTitle>
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar widgets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={activeCategory} onValueChange={setActiveCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as Categorias</SelectItem>
                      {Object.entries(WIDGET_CATEGORIES).map(([key, category]) => (
                        <SelectItem key={key} value={key}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(filteredWidgets).map(([categoryKey, category]) => (
                    <div key={categoryKey}>
                      <div className="flex items-center space-x-2 mb-3">
                        <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                        <h4 className="font-medium text-sm">{category.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {category.widgets.length}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {category.widgets.map((widget: any) => {
                          const Icon = widget.icon;
                          return (
                            <div
                              key={widget.type}
                              className="p-3 border rounded-lg cursor-pointer hover:shadow-sm hover:border-blue-300 transition-all group"
                              onClick={() => addWidget(widget)}
                            >
                              <div className="flex items-start space-x-3">
                                <div className="p-2 bg-gray-100 rounded group-hover:bg-blue-100 transition-colors">
                                  <Icon className="h-4 w-4 group-hover:text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-medium text-sm">{widget.name}</h5>
                                  <p className="text-xs text-muted-foreground mb-2">{widget.description}</p>
                                  <div className="flex items-center space-x-2">
                                    <Badge 
                                      variant="outline" 
                                      className={`text-xs ${
                                        widget.complexity === 'basic' ? 'bg-green-50 text-green-700' :
                                        widget.complexity === 'intermediate' ? 'bg-yellow-50 text-yellow-700' :
                                        widget.complexity === 'advanced' ? 'bg-orange-50 text-orange-700' :
                                        'bg-red-50 text-red-700'
                                      }`}
                                    >
                                      {widget.complexity}
                                    </Badge>
                                    <Plus className="h-3 w-3 text-muted-foreground group-hover:text-blue-600" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Dashboard Canvas */}
        <div className={previewMode ? 'col-span-12' : 'col-span-6'}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Canvas do Dashboard</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {widgets.length} widgets
                  </Badge>
                  {!previewMode && (
                    <Button size="sm" variant="outline">
                      <Grid3X3 className="h-4 w-4 mr-1" />
                      Grade
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {widgets.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <Grid3X3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Dashboard Vazio
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Comece adicionando widgets da biblioteca ao lado
                  </p>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Primeiro Widget
                  </Button>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <div className="grid grid-cols-6 gap-4 auto-rows-min">
                    <SortableContext items={widgets.map(w => w.id)} strategy={verticalListSortingStrategy}>
                      {widgets.map((widget) => (
                        <SortableWidget
                          key={widget.id}
                          widget={widget}
                          onEdit={editWidget}
                          onDelete={deleteWidget}
                          isPreview={previewMode}
                        />
                      ))}
                    </SortableContext>
                  </div>
                  <DragOverlay>
                    {draggedWidget ? (
                      <SortableWidget
                        widget={draggedWidget}
                        onEdit={() => {}}
                        onDelete={() => {}}
                        isPreview={true}
                      />
                    ) : null}
                  </DragOverlay>
                </DndContext>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Properties Panel */}
        {!previewMode && (
          <div className="col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Propriedades</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedWidget ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="widget-title">Título</Label>
                      <Input
                        id="widget-title"
                        value={selectedWidget.title}
                        onChange={(e) => setSelectedWidget({
                          ...selectedWidget,
                          title: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="widget-size">Tamanho</Label>
                      <Select 
                        value={selectedWidget.size} 
                        onValueChange={(value) => setSelectedWidget({
                          ...selectedWidget,
                          size: value as any
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="xs">Extra Pequeno</SelectItem>
                          <SelectItem value="sm">Pequeno</SelectItem>
                          <SelectItem value="md">Médio</SelectItem>
                          <SelectItem value="lg">Grande</SelectItem>
                          <SelectItem value="xl">Extra Grande</SelectItem>
                          <SelectItem value="full">Largura Total</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="widget-theme">Tema</Label>
                      <Select 
                        value={selectedWidget.config.theme} 
                        onValueChange={(value) => setSelectedWidget({
                          ...selectedWidget,
                          config: { ...selectedWidget.config, theme: value as any }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Padrão</SelectItem>
                          <SelectItem value="dark">Escuro</SelectItem>
                          <SelectItem value="colorful">Colorido</SelectItem>
                          <SelectItem value="minimal">Minimalista</SelectItem>
                          <SelectItem value="neon">Neon</SelectItem>
                          <SelectItem value="glassmorphism">Glassmorphism</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Separator />
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="real-time">Tempo Real</Label>
                        <Switch 
                          id="real-time"
                          checked={selectedWidget.config.realTime}
                          onCheckedChange={(checked) => setSelectedWidget({
                            ...selectedWidget,
                            config: { ...selectedWidget.config, realTime: checked }
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="ai-insights">Insights de IA</Label>
                        <Switch 
                          id="ai-insights"
                          checked={selectedWidget.config.aiInsights}
                          onCheckedChange={(checked) => setSelectedWidget({
                            ...selectedWidget,
                            config: { ...selectedWidget.config, aiInsights: checked }
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="animation">Animações</Label>
                        <Switch 
                          id="animation"
                          checked={selectedWidget.config.animation}
                          onCheckedChange={(checked) => setSelectedWidget({
                            ...selectedWidget,
                            config: { ...selectedWidget.config, animation: checked }
                          })}
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={() => updateWidget(selectedWidget)}
                      className="w-full"
                    >
                      Atualizar Widget
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-muted-foreground">
                      Selecione um widget para editar suas propriedades
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Widget Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Templates Rápidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { name: 'Dashboard Executivo', widgets: 5, icon: Crown },
                    { name: 'Análise de Vendas', widgets: 8, icon: TrendingUp },
                    { name: 'KPIs Operacionais', widgets: 6, icon: Target },
                    { name: 'Relatório de Marketing', widgets: 7, icon: BarChart3 }
                  ].map((template, index) => {
                    const Icon = template.icon;
                    return (
                      <div key={index} className="flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium">{template.name}</p>
                            <p className="text-xs text-muted-foreground">{template.widgets} widgets</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Usar</Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
