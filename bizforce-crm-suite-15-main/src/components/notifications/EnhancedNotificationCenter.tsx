
import { useState, useEffect } from 'react';
import { Bell, X, Check, AlertCircle, Info, CheckCircle, Brain, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface EnhancedNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'ai_insight' | 'lead_score' | 'automation';
  timestamp: Date;
  isRead: boolean;
  module?: string;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
  aiGenerated: boolean;
  data?: any;
}

export const EnhancedNotificationCenter = () => {
  const [notifications, setNotifications] = useState<EnhancedNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Gerar notificações de exemplo para demonstração
  useEffect(() => {
    const sampleNotifications: EnhancedNotification[] = [
      {
        id: '1',
        title: 'Lead Quente Identificado',
        message: 'João Silva (Tech Solutions) teve score IA aumentado para 92. Ação recomendada: agendar demo.',
        type: 'lead_score',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        isRead: false,
        module: 'Lead Scoring',
        priority: 'high',
        aiGenerated: true,
        data: { leadId: '1', score: 92 }
      },
      {
        id: '2',
        title: 'Automação Executada',
        message: 'Email de nurturing enviado para 15 leads mornos. Taxa de abertura: 68%.',
        type: 'automation',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        isRead: false,
        module: 'Automação',
        priority: 'medium',
        aiGenerated: false,
        data: { campaignId: '2', openRate: 68 }
      },
      {
        id: '3',
        title: 'Insight de Receita',
        message: 'IA detectou oportunidade de €25K no setor tecnologia. Confiança: 87%.',
        type: 'ai_insight',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isRead: false,
        module: 'Revenue Intelligence',
        priority: 'high',
        aiGenerated: true,
        data: { opportunity: 25000, confidence: 87 }
      },
      {
        id: '4',
        title: 'Meta de Vendas Atingida',
        message: 'Parabéns! Meta mensal de €150K foi atingida com 3 dias de antecedência.',
        type: 'success',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: true,
        module: 'Vendas',
        priority: 'medium',
        aiGenerated: false
      }
    ];
    
    setNotifications(sampleNotifications);
    setIsLoading(false);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const highPriorityCount = notifications.filter(n => !n.isRead && n.priority === 'high').length;

  const markAsRead = async (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = async () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    toast.success('Todas as notificações marcadas como lidas');
  };

  const removeNotification = async (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notificação removida');
  };

  const getIcon = (type: EnhancedNotification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'ai_insight':
        return <Brain className="h-4 w-4 text-purple-500" />;
      case 'lead_score':
        return <Target className="h-4 w-4 text-blue-500" />;
      case 'automation':
        return <TrendingUp className="h-4 w-4 text-orange-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      default: return 'border-l-blue-500';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d atrás`;
    if (hours > 0) return `${hours}h atrás`;
    if (minutes > 0) return `${minutes}m atrás`;
    return 'Agora';
  };

  const handleNotificationClick = (notification: EnhancedNotification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 dark:text-gray-300" />
          {unreadCount > 0 && (
            <Badge 
              className={`absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-white text-xs ${
                highPriorityCount > 0 ? 'bg-red-500' : 'bg-blue-500'
              }`}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-96 p-0 dark:bg-gray-800" align="end">
        <div className="border-b p-4 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold dark:text-white">Notificações Inteligentes</h3>
              {highPriorityCount > 0 && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {highPriorityCount} de alta prioridade
                </p>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Marcar todas como lidas
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="h-96">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <p>Carregando notificações...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Sem notificações</p>
            </div>
          ) : (
            <div className="p-2">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`mb-2 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    !notification.isRead ? `border-l-4 ${getPriorityColor(notification.priority)} dark:border-l-blue-400` : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className={`text-sm font-medium dark:text-white ${
                                !notification.isRead ? 'text-gray-900' : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                {notification.title}
                              </p>
                              {notification.aiGenerated && (
                                <Badge variant="secondary" className="text-xs">
                                  <Brain className="h-2 w-2 mr-1" />
                                  IA
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatTime(notification.timestamp)}
                              </span>
                              {notification.module && (
                                <Badge variant="outline" className="text-xs">
                                  {notification.module}
                                </Badge>
                              )}
                              {notification.priority === 'high' && (
                                <Badge className="text-xs bg-red-100 text-red-800">
                                  Alta Prioridade
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.isRead && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification.id);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <div className="border-t p-2 dark:border-gray-700">
            <Button 
              variant="ghost" 
              className="w-full text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              onClick={() => setIsOpen(false)}
            >
              Ver todas as notificações
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
