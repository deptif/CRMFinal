
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageCircle, 
  Users, 
  Bell, 
  Pin,
  Edit,
  Eye,
  Share,
  Clock,
  AtSign,
  Hash
} from 'lucide-react';
import { toast } from 'sonner';

interface Comment {
  id: string;
  content: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  record_type: 'account' | 'contact' | 'opportunity' | 'quote';
  record_id: string;
  mentioned_users: string[];
  is_pinned: boolean;
  created_at: Date;
  updated_at: Date;
}

interface ActiveUser {
  id: string;
  name: string;
  avatar?: string;
  current_record?: string;
  last_seen: Date;
  status: 'active' | 'idle' | 'offline';
}

interface Notification {
  id: string;
  type: 'mention' | 'comment' | 'assignment' | 'update';
  title: string;
  description: string;
  from_user: string;
  from_user_name: string;
  record_type: string;
  record_id: string;
  is_read: boolean;
  created_at: Date;
}

export const RealTimeCollaboration = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newComment, setNewComment] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<string>('');

  // TODO: Replace with actual real-time subscriptions
  useEffect(() => {
    // Mock data - replace with real-time WebSocket/Supabase subscriptions
    const mockComments: Comment[] = [];
    const mockActiveUsers: ActiveUser[] = [];
    const mockNotifications: Notification[] = [];
    
    setComments(mockComments);
    setActiveUsers(mockActiveUsers);
    setNotifications(mockNotifications);

    // TODO: Set up real-time subscriptions
    // const subscription = supabase
    //   .channel('collaboration')
    //   .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, handleCommentsChange)
    //   .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, handleNotificationsChange)
    //   .subscribe();

    // return () => {
    //   subscription.unsubscribe();
    // };
  }, []);

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedRecord) return;

    try {
      const comment: Comment = {
        id: Date.now().toString(),
        content: newComment,
        author_id: 'current-user',
        author_name: 'Usuário Atual',
        record_type: 'account',
        record_id: selectedRecord,
        mentioned_users: extractMentions(newComment),
        is_pinned: false,
        created_at: new Date(),
        updated_at: new Date()
      };

      setComments([comment, ...comments]);
      setNewComment('');
      
      // TODO: Replace with actual API call
      toast.success('Comentário adicionado!');
    } catch (error) {
      toast.error('Erro ao adicionar comentário');
    }
  };

  const extractMentions = (text: string): string[] => {
    const mentions = text.match(/@\w+/g);
    return mentions ? mentions.map(m => m.substring(1)) : [];
  };

  const handlePinComment = async (commentId: string) => {
    try {
      setComments(comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, is_pinned: !comment.is_pinned }
          : comment
      ));
      
      // TODO: Replace with actual API call
      toast.success('Comentário fixado!');
    } catch (error) {
      toast.error('Erro ao fixar comentário');
    }
  };

  const getUserStatus = (status: string) => {
    const config = {
      active: 'bg-green-500',
      idle: 'bg-yellow-500',
      offline: 'bg-gray-500'
    };
    return config[status as keyof typeof config];
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'mention': return AtSign;
      case 'comment': return MessageCircle;
      case 'assignment': return Users;
      default: return Bell;
    }
  };

  const unreadNotifications = notifications.filter(n => !n.is_read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Colaboração em Tempo Real</h1>
          <p className="text-gray-600 dark:text-gray-400">Chat, comentários e notificações inteligentes</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="relative">
            <Bell className="h-4 w-4 mr-2" />
            Notificações
            {unreadNotifications > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {unreadNotifications}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Collaboration Area */}
        <div className="col-span-8 space-y-6">
          {/* Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle>Feed de Atividades</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Comment Input */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Selecione um registro para comentar..."
                    value={selectedRecord}
                    onChange={(e) => setSelectedRecord(e.target.value)}
                  />
                  <Button variant="outline" size="sm">
                    <Hash className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Adicione um comentário... Use @nome para mencionar"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  />
                  <Button onClick={handleAddComment} disabled={!newComment.trim() || !selectedRecord}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Comentar
                  </Button>
                </div>
              </div>

              {/* Comments List */}
              {comments.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum comentário ainda</h3>
                  <p className="text-gray-600">Comece uma conversa sobre seus registros</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className={`border rounded-lg p-4 ${comment.is_pinned ? 'bg-blue-50 border-blue-200' : ''}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.author_avatar} />
                            <AvatarFallback>{comment.author_name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{comment.author_name}</div>
                            <div className="text-sm text-gray-500">
                              {comment.created_at.toLocaleString('pt-PT')}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {comment.is_pinned && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              <Pin className="h-3 w-3 mr-1" />
                              Fixado
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePinComment(comment.id)}
                          >
                            <Pin className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-gray-900 mb-2">{comment.content}</div>
                      
                      {comment.mentioned_users.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <AtSign className="h-4 w-4 text-blue-600" />
                          <div className="flex space-x-1">
                            {comment.mentioned_users.map((user, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                @{user}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="col-span-4 space-y-6">
          {/* Active Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Usuários Ativos ({activeUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeUsers.length === 0 ? (
                <div className="text-center py-4">
                  <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Nenhum usuário ativo</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getUserStatus(user.status)}`}></div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">{user.name}</div>
                          {user.current_record && (
                            <div className="text-xs text-gray-500">
                              <Eye className="h-3 w-3 inline mr-1" />
                              Visualizando registro
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.last_seen.toLocaleTimeString('pt-PT', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notificações Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <div className="text-center py-4">
                  <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Nenhuma notificação</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.slice(0, 5).map((notification) => {
                    const Icon = getNotificationIcon(notification.type);
                    return (
                      <div key={notification.id} className={`p-3 rounded-lg border ${!notification.is_read ? 'bg-blue-50 border-blue-200' : ''}`}>
                        <div className="flex items-start space-x-3">
                          <div className="p-1 bg-blue-100 rounded">
                            <Icon className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium">{notification.title}</div>
                            <div className="text-xs text-gray-600">{notification.description}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {notification.created_at.toLocaleString('pt-PT')}
                            </div>
                          </div>
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Share className="h-4 w-4 mr-2" />
                Compartilhar Registro
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Edit className="h-4 w-4 mr-2" />
                Edição Colaborativa
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="h-4 w-4 mr-2" />
                Agendar Reunião
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
