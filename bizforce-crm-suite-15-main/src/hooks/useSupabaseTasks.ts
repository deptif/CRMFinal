import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  assignee_name: string;
  priority: 'low' | 'medium' | 'high';
  due_date: Date;
  labels: string[];
  status: 'todo' | 'in-progress' | 'review' | 'done';
  owner_id: string;
  created_at: Date;
  updated_at: Date;
}

export const useSupabaseTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const mountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!mountedRef.current) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      console.log('Fetching tasks...');
      setIsLoading(true);
      setHasError(false);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session || !mountedRef.current) {
        console.log('No session or component unmounted');
        setTasks([]);
        setIsLoading(false);
        return;
      }

      const { data: tasksData, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })
        .abortSignal(abortControllerRef.current.signal);

      if (!mountedRef.current) return;

      if (error) {
        if (error.code !== 'PGRST301') {
          console.error('Erro ao buscar tarefas:', error);
          setHasError(true);
          toast.error('Erro ao carregar tarefas');
        }
        setTasks([]);
        return;
      }

      const mappedTasks: Task[] = (tasksData || []).map(task => ({
        id: task.id,
        title: task.title || '',
        description: task.description || '',
        assignee: task.assignee || '',
        assignee_name: task.assignee_name || 'Sem responsável',
        priority: (task.priority || 'medium') as Task['priority'],
        due_date: new Date(task.due_date || new Date()),
        labels: task.labels || [],
        status: (task.status || 'todo') as Task['status'],
        owner_id: task.owner_id || '',
        created_at: new Date(task.created_at),
        updated_at: new Date(task.updated_at)
      }));

      setTasks(mappedTasks);
      console.log('Tasks loaded:', mappedTasks.length);
    } catch (error) {
      if (!mountedRef.current) return;
      
      console.error('Erro ao buscar tarefas:', error);
      
      if ((error as any).name !== 'AbortError') {
        setHasError(true);
        toast.error('Erro ao carregar tarefas');
      }
      setTasks([]);
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  const createTask = useCallback(async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Você precisa estar autenticado para criar tarefas');
        return { data: null, error: new Error('Not authenticated') };
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title: taskData.title,
          description: taskData.description,
          assignee: taskData.assignee,
          assignee_name: taskData.assignee_name,
          priority: taskData.priority,
          due_date: taskData.due_date.toISOString().split('T')[0],
          labels: taskData.labels,
          status: taskData.status,
          owner_id: session.user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar tarefa:', error);
        toast.error('Erro ao criar tarefa');
        return { data: null, error };
      }

      toast.success('Tarefa criada com sucesso!');
      await fetchTasks();
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      toast.error('Erro ao criar tarefa');
      return { data: null, error };
    }
  }, [fetchTasks]);

  const updateTaskStatus = useCallback(async (taskId: string, status: Task['status']) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', taskId);

      if (error) {
        console.error('Erro ao atualizar status da tarefa:', error);
        toast.error('Erro ao atualizar tarefa');
        return;
      }

      // Update local state immediately
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, status } : task
        )
      );

      console.log('Task status updated successfully');
    } catch (error) {
      console.error('Erro ao atualizar status da tarefa:', error);
      toast.error('Erro ao atualizar tarefa');
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    
    const timeoutId = setTimeout(() => {
      if (mountedRef.current) {
        fetchTasks();
      }
    }, 100);

    return () => {
      mountedRef.current = false;
      clearTimeout(timeoutId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    tasks,
    isLoading,
    hasError,
    createTask,
    updateTaskStatus,
    refetch: fetchTasks
  };
};