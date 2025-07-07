
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Plus, 
  X, 
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  Target,
  Activity
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useToast } from '@/hooks/use-toast';

interface Widget {
  id: string;
  type: 'kpi' | 'chart' | 'activity' | 'recent';
  title: string;
  size: 'small' | 'medium' | 'large';
  visible: boolean;
  data?: any;
}

export const PersonalizableDashboard = () => {
  const { toast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: 'kpi-revenue',
      type: 'kpi',
      title: 'Receita Total',
      size: 'small',
      visible: true,
      data: { value: '€0', change: '0%', icon: DollarSign }
    },
    {
      id: 'kpi-leads',
      type: 'kpi',
      title: 'Novos Leads',
      size: 'small',
      visible: true,
      data: { value: '0', change: '0%', icon: Users }
    },
    {
      id: 'kpi-conversion',
      type: 'kpi',
      title: 'Taxa de Conversão',
      size: 'small',
      visible: true,
      data: { value: '0%', change: '0%', icon: Target }
    },
    {
      id: 'chart-sales',
      type: 'chart',
      title: 'Vendas por Mês',
      size: 'large',
      visible: true,
      data: []
    },
    {
      id: 'activity-feed',
      type: 'activity',
      title: 'Atividades Recentes',
      size: 'medium',
      visible: true,
      data: []
    }
  ]);

  const toggleWidgetVisibility = (widgetId: string) => {
    setWidgets(widgets.map(widget => 
      widget.id === widgetId 
        ? { ...widget, visible: !widget.visible }
        : widget
    ));
    toast({
      title: "Widget atualizado",
      description: "Visibilidade do widget alterada com sucesso!"
    });
  };

  const renderWidget = (widget: Widget) => {
    if (!widget.visible) return null;

    const sizeClasses = {
      small: 'col-span-1',
      medium: 'col-span-2',
      large: 'col-span-3'
    };

    switch (widget.type) {
      case 'kpi':
        const Icon = widget.data.icon;
        return (
          <Card className={`${sizeClasses[widget.size]} h-32`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{widget.title}</p>
                  <p className="text-2xl font-bold">{widget.data.value}</p>
                  <p className="text-sm text-gray-600">{widget.data.change}</p>
                </div>
                <Icon className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        );

      case 'chart':
        return (
          <Card className={`${sizeClasses[widget.size]} h-80`}>
            <CardHeader>
              <CardTitle className="text-lg">{widget.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {widget.data.length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum dado de vendas</h3>
                  <p className="text-gray-600">Os dados aparecerão quando houver vendas registradas</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={widget.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="vendas" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        );

      case 'activity':
        return (
          <Card className={`${sizeClasses[widget.size]} h-80`}>
            <CardHeader>
              <CardTitle className="text-lg">{widget.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {widget.data.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma atividade registrada</h3>
                  <p className="text-gray-600">As atividades aparecerão quando houver dados no sistema</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {widget.data.map((activity: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span> {activity.action}
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  const visibleWidgets = widgets.filter(widget => widget.visible);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard Personalizável</h2>
          <p className="text-muted-foreground">
            Gerencie seus widgets de dashboard
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={isEditMode ? "default" : "outline"}
            onClick={() => setIsEditMode(!isEditMode)}
          >
            <Settings className="h-4 w-4 mr-2" />
            {isEditMode ? 'Finalizar' : 'Personalizar'}
          </Button>
        </div>
      </div>

      {isEditMode && (
        <Card className="p-4">
          <h3 className="font-medium mb-3">Widgets Disponíveis</h3>
          <div className="flex flex-wrap gap-2">
            {widgets.map((widget) => (
              <Badge
                key={widget.id}
                variant={widget.visible ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleWidgetVisibility(widget.id)}
              >
                {widget.title}
                {widget.visible && <X className="h-3 w-3 ml-1" />}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-6">
        {visibleWidgets.map((widget) => (
          <div key={widget.id}>
            {renderWidget(widget)}
          </div>
        ))}
      </div>
    </div>
  );
};
