
import { useSupabaseData } from './useSupabaseData';

// Hook atualizado para usar Supabase em vez de dados mock
export const useAppData = () => {
  return useSupabaseData();
};
