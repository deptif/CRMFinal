
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell, Mail, Smartphone, MessageSquare, Calendar, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  weeklyReports: boolean;
  taskReminders: boolean;
}

interface NotificationsSectionProps {
  notifications: NotificationSettings;
  onNotificationsChange: (notifications: NotificationSettings) => void;
}

export const NotificationsSection = ({ notifications, onNotificationsChange }: NotificationsSectionProps) => {
  const handleSaveNotifications = () => {
    toast.success('Configurações de notificação atualizadas!');
  };

  const notificationItems = [
    {
      key: 'emailNotifications' as keyof NotificationSettings,
      icon: Mail,
      title: 'Notificações por Email',
      description: 'Receber notificações importantes por email'
    },
    {
      key: 'pushNotifications' as keyof NotificationSettings,
      icon: Smartphone,
      title: 'Notificações Push',
      description: 'Alertas no navegador e dispositivo móvel'
    },
    {
      key: 'smsNotifications' as keyof NotificationSettings,
      icon: MessageSquare,
      title: 'Notificações SMS',
      description: 'Alertas críticos por mensagem de texto'
    },
    {
      key: 'weeklyReports' as keyof NotificationSettings,
      icon: BarChart3,
      title: 'Relatórios Semanais',
      description: 'Resumo semanal de atividades e performance'
    },
    {
      key: 'taskReminders' as keyof NotificationSettings,
      icon: Calendar,
      title: 'Lembretes de Tarefas',
      description: 'Alertas para tarefas pendentes e prazos'
    }
  ];

  return (
    <Card className="border border-gray-200 hover:border-purple-200 transition-colors">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg">
          <div className="p-1.5 bg-purple-100 dark:bg-purple-900/50 rounded-lg mr-2">
            <Bell className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          Notificações
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {notificationItems.map((item) => (
          <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-1.5 bg-white dark:bg-gray-700 rounded-lg">
                <item.icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {item.title}
                </Label>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            </div>
            <Switch
              checked={notifications[item.key]}
              onCheckedChange={(checked) => 
                onNotificationsChange({ ...notifications, [item.key]: checked })
              }
              className="data-[state=checked]:bg-purple-600"
            />
          </div>
        ))}

        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <Button 
            onClick={handleSaveNotifications} 
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Salvar Configurações
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
