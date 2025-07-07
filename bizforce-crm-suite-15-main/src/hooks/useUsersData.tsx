
import { useSupabaseUsers } from './useSupabaseUsers';

// Hook atualizado para usar Supabase em vez de dados mock
export const useUsersData = () => {
  return useSupabaseUsers();
};
