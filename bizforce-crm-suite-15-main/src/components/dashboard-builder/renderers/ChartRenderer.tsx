
import { ComponentLayout } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartRendererProps {
  component: ComponentLayout;
}

// Mock data for demonstration
const mockData = [
  { name: 'Jan', value: 400, revenue: 2400, profit: 400 },
  { name: 'Feb', value: 300, revenue: 1398, profit: 300 },
  { name: 'Mar', value: 200, revenue: 9800, profit: 200 },
  { name: 'Apr', value: 278, revenue: 3908, profit: 278 },
  { name: 'May', value: 189, revenue: 4800, profit: 189 },
  { name: 'Jun', value: 239, revenue: 3800, profit: 239 },
];

const pieData = [
  { name: 'Vendas', value: 400, fill: '#3b82f6' },
  { name: 'Marketing', value: 300, fill: '#ef4444' },
  { name: 'Suporte', value: 300, fill: '#10b981' },
  { name: 'Outros', value: 200, fill: '#f59e0b' },
];

export const ChartRenderer = ({ component }: ChartRendererProps) => {
  const { type, config } = component;
  const colors = config.styling.colors || ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  const renderChart = () => {
    switch (type) {
      case 'line-chart':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData}>
              {config.styling.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" />
              <YAxis />
              {config.styling.showLabels && <Tooltip />}
              {config.styling.showLegend && <Legend />}
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={colors[0]} 
                strokeWidth={2}
                dot={{ fill: colors[0] }}
                activeDot={{ r: 6 }}
                animationDuration={config.behavior.animation ? 1000 : 0}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar-chart':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockData}>
              {config.styling.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" />
              <YAxis />
              {config.styling.showLabels && <Tooltip />}
              {config.styling.showLegend && <Legend />}
              <Bar 
                dataKey="value" 
                fill={colors[0]}
                animationDuration={config.behavior.animation ? 1000 : 0}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie-chart':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                animationDuration={config.behavior.animation ? 1000 : 0}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              {config.styling.showLabels && <Tooltip />}
              {config.styling.showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );

      case 'donut-chart':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="value"
                animationDuration={config.behavior.animation ? 1000 : 0}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              {config.styling.showLabels && <Tooltip />}
              {config.styling.showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );

      case 'area-chart':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockData}>
              {config.styling.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" />
              <YAxis />
              {config.styling.showLabels && <Tooltip />}
              {config.styling.showLegend && <Legend />}
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={colors[0]} 
                fill={colors[0]}
                fillOpacity={0.6}
                animationDuration={config.behavior.animation ? 1000 : 0}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'scatter-plot':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart data={mockData}>
              {config.styling.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="value" />
              <YAxis dataKey="revenue" />
              {config.styling.showLabels && <Tooltip />}
              {config.styling.showLegend && <Legend />}
              <Scatter 
                dataKey="profit" 
                fill={colors[0]}
                animationDuration={config.behavior.animation ? 1000 : 0}
              />
            </ScatterChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            Gráfico {type} não implementado
          </div>
        );
    }
  };

  return (
    <Card className="w-full h-full">
      {component.title && (
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{component.title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={`${component.title ? 'pt-0' : 'pt-6'} h-full`}>
        <div className="w-full" style={{ height: component.title ? 'calc(100% - 1rem)' : '100%' }}>
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  );
};
