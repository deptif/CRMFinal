import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  Target,
  AlertTriangle,
  Eye,
  Zap,
  Bell,
  Activity,
  Calendar,
  Award,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { useDashboardData } from '@/hooks/useDashboardData';

interface KPIData {
  id: string;
  name: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  target?: number;
  icon: any;
  color: string;
  alert?: boolean;
  clickable?: boolean;
}

interface SmartAlert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  description: string;
  action?: string;
  timestamp: Date;
  priority: 'high' | 'medium' | 'low';
}

export const IntelligentDashboard = () => {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const { dashboardData, isLoading, refetch } = useDashboardData();
  
  // TODO: Replace with actual database integration
  const [smartAlerts, setSmartAlerts] = useState<SmartAlert[]>([]);

  // Mapear dados do dashboard para KPIs
  const getKPIData = (): KPIData[] => [
    {
      id: 'revenue',
      name: 'Receita Mensal',
      value: `€${dashboardData.totalRevenue.toLocaleString()}`,
      change: 0, // TODO: Calcular mudança percentual
      trend: 'stable',
      target: 100000,
      icon: DollarSign,
      color: 'text-green-600',
      clickable: true
    },
    {
      id: 'leads',
      name: 'Leads Qualificados',
      value: dashboardData.qualifiedLeads,
      change: 0,
      trend: 'stable',
      icon: Users,
      color: 'text-blue-600',
      clickable: true
    },
    {
      id: 'conversion',
      name: 'Taxa Conversão',
      value: `${dashboardData.conversionRate}%`,
      change: 0,
      trend: 'stable',
      icon: Target,
      color: 'text-orange-600',
      clickable: true
    },
    {
      id: 'pipeline',
      name: 'Pipeline Value',
      value: `€${dashboardData.pipelineValue.toLocaleString()}`,
      change: 0,
      trend: 'stable',
      icon: Activity,
      color: 'text-purple-600',
      clickable: true
    }
  ];

  const handleKPIClick = (kpi: KPIData) => {
    if (kpi.clickable) {
      toast({
        title: `Analisando ${kpi.name}`,
        description: "Abrindo detalhes e insights..."
      });
    }
  };

  const handleAlertAction = (alert: SmartAlert) => {
    if (alert.action) {
      toast({
        title: alert.action,
        description: `Executando: ${alert.action}`
      });
      
      // Remove alert after action
      setSmartAlerts(prev => prev.filter(a => a.id !== alert.id));
    }
  };

  const dismissAlert = (alertId: string) => {
    setSmartAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  // Atualizar dados quando o período selecionado mudar
  useEffect(() => {
    refetch();
  }, [selectedPeriod, refetch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando dados do dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard Inteligente</h2>
          <p className="text-gray-600">Insights em tempo real e ações sugeridas</p>
        </div>
        <div className="flex items-center space-x-2">
          {['7d', '30d', '90d'].map((period) => (
            <Button
              key={period}
              size="sm"
              variant={selectedPeriod === period ? "default" : "outline"}
              onClick={() => setSelectedPeriod(period)}
            >
              {period}
            </Button>
          ))}
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            className="ml-2"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Smart Alerts */}
      {smartAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-orange-500" />
              Alertas Inteligentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {smartAlerts.map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                  alert.type === 'warning' ? 'bg-orange-50 border-orange-500' :
                  alert.type === 'error' ? 'bg-red-50 border-red-500' :
                  alert.type === 'success' ? 'bg-green-50 border-green-500' :
                  'bg-blue-50 border-blue-500'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">{alert.title}</h4>
                        <Badge variant={alert.priority === 'high' ? 'destructive' : 'secondary'}>
                          {alert.priority === 'high' ? 'Alta' : alert.priority === 'medium' ? 'Média' : 'Baixa'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                      <p className="text-xs text-gray-400">
                        {alert.timestamp.toLocaleTimeString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {alert.action && (
                        <Button 
                          size="sm" 
                          onClick={() => handleAlertAction(alert)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          {alert.action}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => dismissAlert(alert.id)}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Interactive KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getKPIData().map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card 
              key={kpi.id} 
              className={`hover:shadow-lg transition-all cursor-pointer ${
                kpi.alert ? 'ring-2 ring-orange-200' : ''
              }`}
              onClick={() => handleKPIClick(kpi)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <p className="text-sm font-medium text-gray-600">{kpi.name}</p>
                      {kpi.alert && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                      {kpi.clickable && <Eye className="h-3 w-3 text-gray-400" />}
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
                    <div className="flex items-center mt-2">
                      {kpi.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : kpi.trend === 'down' ? (
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      ) : null}
                      <span className={`text-sm ${
                        kpi.trend === 'up' ? 'text-green-600' :
                        kpi.trend === 'down' ? 'text-red-600' :
                        'text-gray-500'
                      }`}>
                        {kpi.change > 0 ? '+' : ''}{kpi.change}% vs anterior
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${kpi.color.replace('text-', 'bg-').replace('600', '100')}`}>
                    <Icon className={`h-6 w-6 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Semanal */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData.weeklyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#3b82f6" name="Receita" />
                  <Bar dataKey="target" fill="#e5e7eb" name="Meta" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px]">
                <div className="text-center">
                  <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Nenhum dado disponível</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Distribuição do Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição do Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData.pipelineDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardData.pipelineDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={(entry) => entry.name}
                  >
                    {dashboardData.pipelineDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `€${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px]">
                <div className="text-center">
                  <Target className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Pipeline vazio</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
