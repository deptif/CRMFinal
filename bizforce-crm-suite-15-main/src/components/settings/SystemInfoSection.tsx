
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, Clock, HardDrive, CheckCircle } from 'lucide-react';

export const SystemInfoSection = () => {
  const systemStats = [
    {
      icon: Database,
      label: 'Versão',
      value: '2.1.4',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      icon: Clock,
      label: 'Último Login',
      value: 'Agora',
      color: 'bg-green-100 text-green-800'
    },
    {
      icon: HardDrive,
      label: 'Storage',
      value: '0/10GB',
      color: 'bg-purple-100 text-purple-800'
    }
  ];

  return (
    <Card className="border border-gray-200 hover:border-indigo-200 transition-colors">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg">
          <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg mr-2">
            <Database className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          Sistema
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {systemStats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-1.5 bg-white dark:bg-gray-700 rounded-lg">
                <stat.icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {stat.label}
              </span>
            </div>
            <Badge className={`${stat.color} text-xs`}>
              {stat.value}
            </Badge>
          </div>
        ))}
        
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <div>
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                Sistema Operacional
              </span>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Todos os serviços funcionando
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
