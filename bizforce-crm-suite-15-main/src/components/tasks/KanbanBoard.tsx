
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Plus, 
  Calendar, 
  User, 
  Flag,
  MoreVertical,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  assigneeName: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
  labels: string[];
  status: 'todo' | 'in-progress' | 'review' | 'done';
}

interface Column {
  id: string;
  title: string;
  status: Task['status'];
  color: string;
}

export const KanbanBoard = () => {
  const columns: Column[] = [
    { id: '1', title: 'Para Fazer', status: 'todo', color: 'bg-gray-100' },
    { id: '2', title: 'Em Progresso', status: 'in-progress', color: 'bg-blue-100' },
    { id: '3', title: 'Revisão', status: 'review', color: 'bg-yellow-100' },
    { id: '4', title: 'Concluído', status: 'done', color: 'bg-green-100' },
  ];

  // Initial tasks data removed - ready for database integration
  const [tasks] = useState<Task[]>([]);

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getPriorityIcon = (priority: Task['priority']) => {
    const flagClass = priority === 'high' ? 'text-red-500' : 
                     priority === 'medium' ? 'text-yellow-500' : 'text-green-500';
    return <Flag className={`h-3 w-3 ${flagClass}`} />;
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Amanhã';
    if (diffDays === -1) return 'Ontem';
    if (diffDays < 0) return `${Math.abs(diffDays)} dias atrás`;
    return `Em ${diffDays} dias`;
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  const handleAddTask = (status: Task['status']) => {
    toast.success(`Nova tarefa adicionada à coluna ${columns.find(c => c.status === status)?.title}`);
    
    // TODO: Replace with actual database call
    // await createTaskInDB(newTask);
  };

  // TODO: Add function to load tasks from database
  // useEffect(() => {
  //   const loadTasks = async () => {
  //     try {
  //       const tasksData = await fetchTasksFromDB();
  //       setTasks(tasksData);
  //     } catch (error) {
  //       console.error('Failed to load tasks:', error);
  //     }
  //   };
  //   loadTasks();
  // }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Tarefas</h1>
          <p className="text-gray-600">Organiza as tarefas da equipa com Kanban</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nova Tarefa
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.status);
          
          return (
            <div key={column.id} className="space-y-4">
              <div className={`p-4 rounded-lg ${column.color}`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{column.title}</h3>
                  <Badge variant="secondary">{columnTasks.length}</Badge>
                </div>
              </div>

              <div className="space-y-3 min-h-[400px]">
                {columnTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Nenhuma tarefa</p>
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
                            <Button size="icon" variant="ghost" className="h-6 w-6">
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </div>

                          <p className="text-xs text-gray-600 line-clamp-2">
                            {task.description}
                          </p>

                          <div className="flex flex-wrap gap-1">
                            {task.labels.map((label, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {label}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {getPriorityIcon(task.priority)}
                              <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                                {task.priority === 'high' ? 'Alta' : 
                                 task.priority === 'medium' ? 'Média' : 'Baixa'}
                              </Badge>
                            </div>
                            
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                                {task.assigneeName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          </div>

                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDate(task.dueDate)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}

                <Button
                  variant="outline"
                  className="w-full h-12 border-dashed border-2 border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-600"
                  onClick={() => handleAddTask(column.status)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Tarefa
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
