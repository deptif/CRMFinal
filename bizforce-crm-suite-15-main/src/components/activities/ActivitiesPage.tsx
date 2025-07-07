
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Plus, 
  Search,
  Phone,
  Mail,
  Users,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { Activity } from '@/types';
import { ActivityModal } from './ActivityModal';
import { useSupabaseActivities } from '@/hooks/useSupabaseActivities';

export const ActivitiesPage = () => {
  const { activities, isLoading, createActivity, updateActivity, deleteActivity, toggleActivityStatus } = useSupabaseActivities();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.related_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || activity.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateActivity = async (activityData: Omit<Activity, 'id' | 'created_at'>) => {
    try {
      const result = await createActivity(activityData);
      if (result.error) {
        console.error('Erro ao criar atividade:', result.error);
        return;
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao criar atividade:', error);
    }
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setIsModalOpen(true);
  };

  const handleUpdateActivity = async (activityData: Omit<Activity, 'id' | 'created_at'>) => {
    if (!editingActivity) return;
    
    try {
      const result = await updateActivity(editingActivity.id, activityData);
      if (result.error) {
        console.error('Erro ao atualizar atividade:', result.error);
        return;
      }
      setEditingActivity(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao atualizar atividade:', error);
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    if (!confirm('Tem certeza que deseja eliminar esta atividade?')) return;
    
    try {
      const result = await deleteActivity(activityId);
      if (result.error) {
        console.error('Erro ao eliminar atividade:', result.error);
      }
    } catch (error) {
      console.error('Erro ao eliminar atividade:', error);
    }
  };

  const handleToggleActivityStatus = async (activityId: string) => {
    try {
      const result = await toggleActivityStatus(activityId);
      if (result.error) {
        console.error('Erro ao atualizar status da atividade:', result.error);
      }
    } catch (error) {
      console.error('Erro ao atualizar status da atividade:', error);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return Phone;
      case 'email': return Mail;
      case 'meeting': return Users;
      case 'task': return CheckCircle;
      case 'note': return FileText;
      default: return Clock;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'call': return 'text-green-600';
      case 'email': return 'text-blue-600';
      case 'meeting': return 'text-purple-600';
      case 'task': return 'text-orange-600';
      case 'note': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Concluída</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelada</Badge>;
      default:
        return <Badge variant="secondary">Pendente</Badge>;
    }
  };

  const pendingActivities = activities.filter(a => a.status === 'pending').length;
  const completedActivities = activities.filter(a => a.status === 'completed').length;
  const overdueActivities = activities.filter(a => 
    a.status === 'pending' && new Date(a.due_date) < new Date()
  ).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando atividades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Atividades</h1>
          <p className="text-gray-600">Gerir tarefas e compromissos</p>
        </div>
        <Button onClick={() => {
          setEditingActivity(null);
          setIsModalOpen(true);
        }} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nova Atividade
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{pendingActivities}</div>
            <div className="text-sm text-gray-600">Pendentes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{completedActivities}</div>
            <div className="text-sm text-gray-600">Concluídas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{overdueActivities}</div>
            <div className="text-sm text-gray-600">Em Atraso</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{activities.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar atividades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">Todas</option>
              <option value="pending">Pendentes</option>
              <option value="completed">Concluídas</option>
              <option value="cancelled">Canceladas</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Activities List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Atividades ({filteredActivities.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma atividade encontrada</h3>
              <p className="text-gray-600">Crie uma nova atividade para começar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredActivities.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                const isOverdue = activity.status === 'pending' && new Date(activity.due_date) < new Date();
                
                return (
                  <div key={activity.id} className={`flex items-start space-x-4 p-4 rounded-lg border transition-colors ${
                    activity.status === 'completed' ? 'bg-green-50 border-green-200' :
                    isOverdue ? 'bg-red-50 border-red-200' :
                    'bg-gray-50 hover:bg-gray-100'
                  }`}>
                    <div className={`p-2 rounded-lg bg-white ${getActivityColor(activity.type)}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-semibold ${activity.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {activity.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(activity.status)}
                          {isOverdue && (
                            <Badge className="bg-red-100 text-red-800">
                              <XCircle className="h-3 w-3 mr-1" />
                              Atrasada
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-2">{activity.description}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                        <span>Relacionado: {activity.related_name}</span>
                        <span>•</span>
                        <span>Responsável: {activity.owner_name}</span>
                        <span>•</span>
                        <span>Prazo: {activity.due_date.toLocaleDateString('pt-PT')}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleActivityStatus(activity.id)}
                          className={activity.status === 'completed' ? 'text-yellow-600' : 'text-green-600'}
                        >
                          {activity.status === 'completed' ? 'Reabrir' : 'Completar'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditActivity(activity)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteActivity(activity.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <ActivityModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingActivity(null);
        }}
        onSubmit={editingActivity ? handleUpdateActivity : handleCreateActivity}
        editingActivity={editingActivity}
      />
    </div>
  );
};
