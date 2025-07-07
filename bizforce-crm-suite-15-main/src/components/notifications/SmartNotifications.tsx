
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  X, 
  Clock, 
  User,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Mail,
  Phone,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SmartNotification {
  id: string;
  type: 'opportunity' | 'task' | 'lead' | 'system' | 'achievement';
  priority: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionable: boolean;
  action?: {
    label: string;
    type: 'call' | 'email' | 'meeting' | 'update' | 'view';
  };
  data?: any;
}

export const SmartNotifications = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'actionable'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual database query when smart_notifications table is created
      // const { data, error } = await supabase
      //   .from('smart_notifications')
      //   .select('*')
      //   .order('created_at', { ascending: false });

      // if (error) {
      //   console.error('Error fetching smart notifications:', error);
      //   return;
      // }

      // For now, set empty array until database is properly configured
      setNotifications([]);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getNotificationIcon = (type: SmartNotification['type']) => {
    switch (type) {
      case 'opportunity': return DollarSign;
      case 'task': return Calendar;
      case 'lead': return User;
      case 'system': return Zap;
      case 'achievement': return TrendingUp;
      default: return Bell;
    }
  };

  const getPriorityColor = (priority: SmartNotification['priority']) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-orange-200 bg-orange-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority: SmartNotification['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days}d atrás`;
  };

  const handleNotificationAction = async (notification: SmartNotification) => {
    if (!notification.action) return;

    const actionMessages = {
      call: `Iniciando chamada para ${notification.data?.clientName || 'cliente'}...`,
      email: 'Abrindo editor de email...',
      meeting: 'Abrindo detalhes da reunião...',
      update: 'Abrindo configurações...',
      view: 'Navegando para detalhes...'
    };

    toast({
      title: notification.action.label,
      description: actionMessages[notification.action.type]
    });

    // Mark as read
    await markAsRead(notification.id);
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // TODO: Update database when smart_notifications table is created
      // await supabase
      //   .from('smart_notifications')
      //   .update({ read: true })
      //   .eq('id', notificationId);

      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const dismissNotification = async (notificationId: string) => {
    try {
      // TODO: Delete from database when smart_notifications table is created
      // await supabase
      //   .from('smart_notifications')
      //   .delete()
      //   .eq('id', notificationId);

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // TODO: Update database when smart_notifications table is created
      // await supabase
      //   .from('smart_notifications')
      //   .update({ read: true })
      //   .eq('read', false);

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      
      toast({
        title: "Todas as notificações foram marcadas como lidas",
        description: "Central de notificações atualizada."
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread': return !notification.read;
      case 'actionable': return notification.actionable;
      default: return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const actionableCount = notifications.filter(n => n.actionable && !n.read).length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-6 w-6 text-gray-600" />
            <h2 className="text-2xl font-bold">Notificações Inteligentes</h2>
          </div>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-600">Carregando notificações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Bell className="h-6 w-6 text-gray-600" />
            <h2 className="text-2xl font-bold">Notificações Inteligentes</h2>
          </div>
          {unreadCount > 0 && (
            <Badge className="bg-red-100 text-red-800">
              {unreadCount} não lidas
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Marcar Todas Lidas
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        <Button
          size="sm"
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          Todas ({notifications.length})
        </Button>
        <Button
          size="sm"
          variant={filter === 'unread' ? 'default' : 'outline'}
          onClick={() => setFilter('unread')}
        >
          Não Lidas ({unreadCount})
        </Button>
        <Button
          size="sm"
          variant={filter === 'actionable' ? 'default' : 'outline'}
          onClick={() => setFilter('actionable')}
        >
          Ação Requerida ({actionableCount})
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        <Card>
          <CardContent className="p-8 text-center">
            <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma notificação
            </h3>
            <p className="text-gray-600">
              {filter === 'unread' ? 'Todas as notificações foram lidas!' :
               filter === 'actionable' ? 'Nenhuma ação pendente no momento.' :
               'Você está em dia com tudo!'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Configurações de Notificação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Notificações Push</h4>
                <p className="text-sm text-gray-600">Receber notificações no desktop</p>
              </div>
              <Button variant="outline" size="sm">
                Configurar
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Emails de Resumo</h4>
                <p className="text-sm text-gray-600">Resumo diário por email</p>
              </div>
              <Button variant="outline" size="sm">
                Configurar
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Alertas Inteligentes</h4>
                <p className="text-sm text-gray-600">IA sugere quando agir</p>
              </div>
              <Button variant="outline" size="sm">
                Configurar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
