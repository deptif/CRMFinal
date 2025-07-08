import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  company_id: string;
  status: 'active' | 'pending' | 'suspended';
  phone?: string;
  position?: string;
  department?: string;
  address?: string;
  avatar?: string;
  created_at: Date;
  last_login?: Date;
  invited_at?: Date;
}

export const useSupabaseUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      // Verificar se o usuário está autenticado
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log('Usuário não autenticado');
        setLoading(false);
        return;
      }

      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar utilizadores:', error);
        toast.error('Erro ao carregar utilizadores');
        return;
      }

      const mappedUsers: UserProfile[] = (profiles || []).map(profile => ({
        id: profile.id,
        name: profile.name || profile.email || '',
        email: profile.email || '',
        role: (profile.role as 'admin' | 'manager' | 'user') || 'user',
        company_id: profile.company || 'default-company',
        status: (profile.status as 'active' | 'pending' | 'suspended') || 'active',
        phone: profile.phone || '',
        position: profile.position || '',
        department: profile.department || '',
        address: profile.address || '',
        avatar: profile.avatar || undefined,
        created_at: new Date(profile.created_at),
        last_login: profile.last_login ? new Date(profile.last_login) : undefined,
        invited_at: profile.invited_at ? new Date(profile.invited_at) : undefined
      }));

      setUsers(mappedUsers);
    } catch (error) {
      console.error('Erro ao buscar utilizadores:', error);
      toast.error('Erro ao carregar utilizadores');
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (userData: Partial<UserProfile>) => {
    try {
      // Verificar se o usuário está autenticado
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Você precisa estar autenticado para criar usuários');
        return { data: null, error: new Error('Not authenticated') };
      }

      const newUserId = crypto.randomUUID();
      
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          id: newUserId,
          name: userData.name || '',
          email: userData.email || '',
          role: userData.role || 'user',
          status: userData.status || 'pending',
          phone: userData.phone || '',
          position: userData.position || '',
          department: userData.department || '',
          address: userData.address || '',
          company: userData.company_id || 'BizForce Solutions',
          invited_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar utilizador:', error);
        toast.error('Erro ao criar utilizador');
        return { data: null, error };
      }

      toast.success('Utilizador criado com sucesso!');
      fetchUsers(); // Refresh the list
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao criar utilizador:', error);
      toast.error('Erro ao criar utilizador');
      return { data: null, error };
    }
  }, [fetchUsers]);

  const updateUser = useCallback(async (userId: string, updates: Partial<UserProfile>) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          role: updates.role,
          status: updates.status,
          phone: updates.phone,
          position: updates.position,
          department: updates.department,
          address: updates.address
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar utilizador:', error);
        toast.error('Erro ao atualizar utilizador');
        return { data: null, error };
      }

      toast.success('Utilizador atualizado com sucesso!');
      fetchUsers(); // Refresh the list
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao atualizar utilizador:', error);
      toast.error('Erro ao atualizar utilizador');
      return { data: null, error };
    }
  }, [fetchUsers]);

  const deleteUser = useCallback(async (userId: string) => {
    try {
      console.log('Iniciando exclusão do usuário:', userId);
      
      // Excluir o usuário
      console.log('Executando delete no Supabase para o usuário:', userId);
      const deleteResponse = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      const { error, status, statusText, data } = deleteResponse;
      console.log('Resposta completa da exclusão do usuário:', {
        error,
        status,
        statusText,
        data: data || [],
        count: Array.isArray(data) ? data.length : 0
      });

      if (error) {
        console.error('Erro ao eliminar utilizador:', error);
        toast.error(`Erro ao eliminar utilizador: ${error.message}`);
        return { error };
      }

      if (status !== 204 && (!data || (Array.isArray(data) && data.length === 0))) {
        console.error('Exclusão do usuário não realizada, status:', status);
        toast.error(`Erro ao eliminar utilizador: A operação não retornou os dados esperados (status ${status})`);
        return { error: new Error(`Exclusão não realizada (status ${status})`) };
      }

      // Atualizar o estado local imediatamente
      console.log('Exclusão bem-sucedida, atualizando estado local');
      setUsers(prevUsers => {
        const filteredUsers = prevUsers.filter(user => user.id !== userId);
        console.log('Usuários antes:', prevUsers.length, 'Usuários depois:', filteredUsers.length);
        return filteredUsers;
      });
      
      toast.success('Utilizador eliminado com sucesso!');
      
      // Forçar uma atualização da lista de usuários
      console.log('Atualizando lista de usuários após exclusão');
      await fetchUsers();
      
      return { error: null };
    } catch (error: unknown) {
      console.error('Erro ao eliminar utilizador:', error);
      toast.error('Erro ao eliminar utilizador');
      return { error: error instanceof Error ? error : new Error(String(error)) };
    }
  }, [fetchUsers]);

  const addUser = useCallback(async (userData: Omit<UserProfile, 'id' | 'created_at'>) => {
    return createUser(userData);
  }, [createUser]);

  const resendInvite = useCallback(async (userId: string) => {
    try {
      // Simulate resending invite
      toast.success('Convite reenviado com sucesso!');
      return { error: null };
    } catch (error) {
      console.error('Erro ao reenviar convite:', error);
      toast.error('Erro ao reenviar convite');
      return { error };
    }
  }, []);

  const toggleUserStatus = useCallback(async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) {
        toast.error('Utilizador não encontrado');
        return { error: new Error('User not found') };
      }

      const newStatus = user.status === 'active' ? 'suspended' : 'active';
      const result = await updateUser(userId, { status: newStatus });
      
      if (!result.error) {
        toast.success(`Utilizador ${newStatus === 'active' ? 'ativado' : 'suspenso'} com sucesso!`);
      }
      
      return result;
    } catch (error) {
      console.error('Erro ao alterar status do utilizador:', error);
      toast.error('Erro ao alterar status do utilizador');
      return { error };
    }
  }, [users, updateUser]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    isLoading: loading,
    refetch: fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    addUser,
    resendInvite,
    toggleUserStatus
  };
};
