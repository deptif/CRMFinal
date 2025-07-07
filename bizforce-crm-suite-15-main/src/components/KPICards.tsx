
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Euro, Users, Target, TrendingUp } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';

export const KPICards = () => {
  const { dashboardData, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const kpiData = [
    {
      title: "Receita Mensal",
      value: `€${dashboardData.totalRevenue.toLocaleString()}`,
      change: "0% vs anterior",
      icon: Euro,
      color: "text-green-600"
    },
    {
      title: "Leads Qualificados", 
      value: dashboardData.qualifiedLeads.toString(),
      change: "0% vs anterior",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Taxa Conversão",
      value: `${dashboardData.conversionRate}%`,
      change: "0% vs anterior", 
      icon: Target,
      color: "text-orange-600"
    },
    {
      title: "Pipeline Value",
      value: `€${dashboardData.pipelineValue.toLocaleString()}`,
      change: "0% vs anterior",
      icon: TrendingUp,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpiData.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {kpi.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <span>{kpi.change}</span>
              </div>
              <div className="mt-2 bg-gray-200 rounded-full h-1">
                <div className="bg-blue-500 h-1 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">Meta: 100%</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
