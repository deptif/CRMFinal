
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Calendar, 
  Clock, 
  User,
  Building2,
  Phone,
  Mail,
  FileText,
  DollarSign,
  TrendingUp,
  MessageSquare,
  Search,
  Filter,
  Play,
  Pause,
  MoreHorizontal
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ActivityItem {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'deal' | 'task' | 'document';
  user: {
    name: string;
    avatar?: string;
  };
  title: string;
  description: string;
  timestamp: Date;
  relatedTo: {
    type: 'contact' | 'account' | 'opportunity';
    name: string;
    id: string;
  };
  metadata?: {
    duration?: number;
    value?: number;
    status?: string;
    priority?: 'high' | 'medium' | 'low';
  };
  attachments?: Array<{
    name: string;
    type: string;
    size: number;
  }>;
}

export const EnhancedActivityFeed = () => {
  const { toast } = useToast();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'calls' | 'emails' | 'meetings' | 'deals'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRealTime, setIsRealTime] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual database call
    const loadActivities = async () => {
      try {
        // const activitiesData = await fetchActivitiesFromDB();
        // setActivities(activitiesData);
        console.log('Loading activities from database...');
      } catch (error) {
        console.error('Failed to load activities:', error);
      }
    };

    loadActivities();
  }, []);

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'call': return Phone;
      case 'email': return Mail;
      case 'meeting': return Calendar;
      case 'note': return FileText;
      case 'deal': return DollarSign;
      case 'task': return Clock;
      case 'document': return FileText;
      default: return MessageSquare;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'call': return 'bg-blue-100 text-blue-600';
      case 'email': return 'bg-green-100 text-green-600';
      case 'meeting': return 'bg-purple-100 text-purple-600';
      case 'note': return 'bg-gray-100 text-gray-600';
      case 'deal': return 'bg-yellow-100 text-yellow-600';
      case 'task': return 'bg-orange-100 text-orange-600';
      case 'document': return 'bg-pink-100 text-pink-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusBadge = (metadata: ActivityItem['metadata']) => {
    if (!metadata?.status) return null;

    const colors = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-orange-100 text-orange-800',
      sent: 'bg-blue-100 text-blue-800',
      won: 'bg-green-100 text-green-800',
      lost: 'bg-red-100 text-red-800'
    };

    const labels = {
      completed: 'Concluído',
      pending: 'Pendente',
      sent: 'Enviado',
      won: 'Ganho',
      lost: 'Perdido'
    };

    return (
      <Badge className={colors[metadata.status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {labels[metadata.status as keyof typeof labels] || metadata.status}
      </Badge>
    );
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

  const filteredActivities = activities.filter(activity => {
    const matchesFilter = filter === 'all' || 
      (filter === 'calls' && activity.type === 'call') ||
      (filter === 'emails' && activity.type === 'email') ||
      (filter === 'meetings' && activity.type === 'meeting') ||
      (filter === 'deals' && activity.type === 'deal');

    const matchesSearch = !searchQuery || 
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.relatedTo.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleActivityClick = (activity: ActivityItem) => {
    toast({
      title: "Abrindo detalhes",
      description: `Navegando para ${activity.relatedTo.name}...`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Feed de Atividades</h2>
          <p className="text-gray-600">Histórico completo e em tempo real</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={isRealTime ? "default" : "outline"}
            size="sm"
            onClick={() => setIsRealTime(!isRealTime)}
          >
            {isRealTime ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isRealTime ? 'Pausar' : 'Tempo Real'}
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar atividades..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'Todas' },
                { key: 'calls', label: 'Ligações' },
                { key: 'emails', label: 'Emails' },
                { key: 'meetings', label: 'Reuniões' },
                { key: 'deals', label: 'Negócios' }
              ].map((filterOption) => (
                <Button
                  key={filterOption.key}
                  size="sm"
                  variant={filter === filterOption.key ? 'default' : 'outline'}
                  onClick={() => setFilter(filterOption.key as typeof filter)}
                >
                  {filterOption.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activities Timeline */}
      <div className="space-y-4">
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma atividade encontrada
            </h3>
            <p className="text-gray-600">
              Comece criando sua primeira atividade!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Load More */}
      {filteredActivities.length > 0 && (
        <div className="text-center">
          <Button variant="outline">
            Carregar Mais Atividades
          </Button>
        </div>
      )}
    </div>
  );
};
