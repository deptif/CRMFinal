
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface WorkflowAnalyticsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WorkflowAnalyticsModal = ({ open, onOpenChange }: WorkflowAnalyticsModalProps) => {
  const performanceData = [
    { month: 'Out', executions: 1245, success: 94 },
    { month: 'Nov', executions: 1567, success: 91 },
    { month: 'Dez', executions: 1823, success: 96 },
    { month: 'Jan', executions: 2134, success: 89 },
    { month: 'Fev', executions: 1876, success: 93 }
  ];

  const workflowStats = [
    { name: 'Lead Qualification', executions: 1245, success_rate: 94, avg_time: '2.3min' },
    { name: 'Opportunity Follow-up', executions: 876, success_rate: 87, avg_time: '4.1min' },
    { name: 'Customer Onboarding', executions: 234, success_rate: 91, avg_time: '12.5min' }
  ];

  const errorData = [
    { type: 'Timeout', count: 23, percentage: 45 },
    { type: 'API Error', count: 15, percentage: 29 },
    { type: 'Validation', count: 13, percentage: 26 }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Analytics de Workflows
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-blue-600">2,355</p>
                <p className="text-sm text-gray-600">Total Execuções</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600">91%</p>
                <p className="text-sm text-gray-600">Taxa de Sucesso</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-purple-600">15.2h</p>
                <p className="text-sm text-gray-600">Tempo Economizado</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
                <p className="text-2xl font-bold text-orange-600">€24k</p>
                <p className="text-sm text-gray-600">Valor Gerado</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Performance ao Longo do Tempo</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="executions" 
                      stroke="#3b82f6" 
                      name="Execuções"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="success" 
                      stroke="#10b981" 
                      name="% Sucesso"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Error Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Análise de Erros</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={errorData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Workflow Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Performance por Workflow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflowStats.map((workflow, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{workflow.name}</h3>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-gray-600">
                          {workflow.executions} execuções
                        </span>
                        <span className="text-sm text-gray-600">
                          Tempo médio: {workflow.avg_time}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Taxa de Sucesso</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={workflow.success_rate} className="w-20 h-2" />
                          <span className="text-sm font-medium">{workflow.success_rate}%</span>
                        </div>
                      </div>
                      <Badge 
                        className={
                          workflow.success_rate >= 90 
                            ? 'bg-green-100 text-green-800' 
                            : workflow.success_rate >= 80 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }
                      >
                        {workflow.success_rate >= 90 ? 'Excelente' : workflow.success_rate >= 80 ? 'Bom' : 'Precisa Melhoria'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Issues */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
                Problemas Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium">Timeout em Lead Qualification</p>
                    <p className="text-sm text-gray-600">Última ocorrência: há 2 horas</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Ativo</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium">Falha na API externa</p>
                    <p className="text-sm text-gray-600">Última ocorrência: há 1 dia</p>
                  </div>
                  <Badge className="bg-red-100 text-red-800">Resolvido</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium">Validation error em Customer Onboarding</p>
                    <p className="text-sm text-gray-600">Última ocorrência: há 3 dias</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Monitorando</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

