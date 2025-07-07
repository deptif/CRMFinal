
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
  Award
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useToast } from '@/hooks/use-toast';

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
  
  // TODO: Replace with actual database integration
  const [smartAlerts, setSmartAlerts] = useState<SmartAlert[]>([]);

  // TODO: Replace with actual database queries
  const kpiData: KPIData[] = [
    {
      id: 'revenue',
      name: 'Receita Mensal',
      value: '€0',
      change: 0,
      trend: 'stable',
      target: 100,
      icon: DollarSign,
      color: 'text-green-600',
      clickable: true
    },
    {
      id: 'leads',
      name: 'Leads Qualificados',
      value: 0,
      change: 0,
      trend: 'stable',
      icon: Users,
      color: 'text-blue-600',
      clickable: true
    },
    {
      id: 'conversion',
      name: 'Taxa Conversão',
      value: '0%',
      change: 0,
      trend: 'stable',
      icon: Target,
      color: 'text-orange-600',
      clickable: true
    },
    {
      id: 'pipeline',
      name: 'Pipeline Value',
      value: '€0',
      change: 0,
      trend: 'stable',
      icon: Activity,
      color: 'text-purple-600',
      clickable: true
    }
  ];

  // TODO: Replace with actual database queries
  const weeklyData: any[] = [];
  const pipelineByStage: any[] = [];
  const upcomingActivities: any[] = [];

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
      
      // TODO: Replace with actual action execution
      // await executeAlertAction(alert.id, alert.action);
    }
  };

  const dismissAlert = (alertId: string) => {
    setSmartAlerts(prev => prev.filter(a => a.id !== alertId));
    
    // TODO: Replace with actual database call
    // await dismissAlertInDB(alertId);
  };

  // TODO: Add function to load dashboard data from database
  // useEffect(() => {
  //   const loadDashboardData = async () => {
  //     try {
  //       const [kpis, alerts, activities] = await Promise.all([
  //         fetchKPIsFromDB(selectedPeriod),
  //         fetchAlertsFromDB(),
  //         fetchUpcomingActivitiesFromDB()
  //       ]);
  //       // Update state with fetched data
  //     } catch (error) {
  //       console.error('Failed to load dashboard data:', error);
  //     }
  //   };
  //   loadDashboardData();
  // }, [selectedPeriod]);

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
        {kpiData.map((kpi) => {
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
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      ) : kpi.trend === 'down' ? (
                        <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                      ) : (
                        <Activity className="h-4 w-4 text-gray-600 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        kpi.trend === 'up' ? 'text-green-600' : 
                        kpi.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {Math.abs(kpi.change)}%
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs anterior</span>
                    </div>
                    {kpi.target && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Meta</span>
                          <span>{kpi.target}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${Math.min(100, (parseFloat(kpi.value.toString().replace(/[^0-9.]/g, '')) / kpi.target) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100`}>
                    <Icon className={`h-6 w-6 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            {weeklyData.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum dado disponível</h3>
                <p className="text-gray-600">Os dados serão exibidos quando houver atividade</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="leads" stroke="#3b82f6" name="Leads" strokeWidth={2} />
                  <Line type="monotone" dataKey="conversions" stroke="#10b981" name="Conversões" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Pipeline Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição do Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            {pipelineByStage.length === 0 ? (
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Pipeline vazio</h3>
                <p className="text-gray-600">Adicione oportunidades para visualizar o pipeline</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pipelineByStage}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pipelineByStage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Próximas Atividades
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingActivities.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma atividade agendada</h3>
              <p className="text-gray-600">Agende atividades para vê-las aqui</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      activity.urgent ? 'bg-red-500' : 'bg-blue-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {activity.urgent && (
                      <Badge variant="destructive" className="text-xs">
                        Urgente
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {activity.type === 'meeting' ? 'Reunião' : 
                       activity.type === 'call' ? 'Ligação' : 'Prazo'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
