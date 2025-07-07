
import { ComponentLayout } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface MetricRendererProps {
  component: ComponentLayout;
}

export const MetricRenderer = ({ component }: MetricRendererProps) => {
  const { type, config } = component;

  // Mock data for demonstration
  const mockMetrics = {
    value: 12345,
    previousValue: 10890,
    percentage: 75,
    target: 16000,
    change: 13.4,
    isPositive: true,
  };

  const renderMetric = () => {
    switch (type) {
      case 'kpi-card':
        return (
          <Card className="w-full h-full">
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-600">
                    {component.title || 'Receita Total'}
                  </h3>
                  <Activity className="h-4 w-4 text-gray-400" />
                </div>
                
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900">
                    {mockMetrics.value.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {mockMetrics.isPositive ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className={`text-xs font-medium ${
                      mockMetrics.isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {mockMetrics.isPositive ? '+' : '-'}{Math.abs(mockMetrics.change)}%
                    </span>
                    <span className="text-xs text-gray-500">vs mês anterior</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'counter':
        return (
          <Card className="w-full h-full">
            <CardContent className="p-4 flex flex-col justify-center items-center h-full text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {mockMetrics.value.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                {component.title || 'Total de Vendas'}
              </div>
            </CardContent>
          </Card>
        );

      case 'progress-bar':
        return (
          <Card className="w-full h-full">
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">
                    {component.title || 'Progresso da Meta'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {mockMetrics.percentage}%
                  </span>
                </div>
                <Progress value={mockMetrics.percentage} className="w-full" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>
                    {mockMetrics.value.toLocaleString()}
                  </span>
                  <span>
                    Meta: {mockMetrics.target.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'gauge':
        return (
          <Card className="w-full h-full">
            <CardContent className="p-4 flex flex-col justify-center items-center h-full">
              <div className="relative w-32 h-32 mb-4">
                {/* Simple gauge representation */}
                <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                <div 
                  className="absolute inset-0 rounded-full border-8 border-blue-500 border-r-transparent border-b-transparent transform -rotate-90"
                  style={{
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + (mockMetrics.percentage / 2)}% 0%, 100% 100%, 0% 100%)`
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">
                      {mockMetrics.percentage}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {component.title || 'Performance'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            Métrica {type} não implementada
          </div>
        );
    }
  };

  return renderMetric();
};
