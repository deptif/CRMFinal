
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Key, Smartphone, Activity, Trash2 } from 'lucide-react';

export const SecuritySection = () => {
  const securityItems = [
    {
      icon: Key,
      title: 'Alterar Senha',
      description: 'Atualize sua senha de acesso',
      action: 'Alterar',
      variant: 'outline' as const
    },
    {
      icon: Smartphone,
      title: 'Autenticação 2FA',
      description: 'Segurança adicional com dois fatores',
      action: 'Configurar',
      variant: 'outline' as const
    },
    {
      icon: Activity,
      title: 'Sessões Ativas',
      description: 'Gerir dispositivos conectados',
      action: 'Ver',
      variant: 'outline' as const
    },
    {
      icon: Trash2,
      title: 'Eliminar Conta',
      description: 'Ação permanente e irreversível',
      action: 'Eliminar',
      variant: 'destructive' as const
    }
  ];

  return (
    <Card className="border border-gray-200 hover:border-red-200 transition-colors">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg">
          <div className="p-1.5 bg-red-100 dark:bg-red-900/50 rounded-lg mr-2">
            <Shield className="h-4 w-4 text-red-600 dark:text-red-400" />
          </div>
          Segurança
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {securityItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-1.5 bg-white dark:bg-gray-700 rounded-lg">
                  <item.icon className={`h-4 w-4 ${item.variant === 'destructive' ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}`} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              </div>
              <Button 
                variant={item.variant}
                size="sm"
                className="text-xs h-7"
              >
                {item.action}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
