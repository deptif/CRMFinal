
import React, { createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useAuthState } from '@/hooks/useAuthState';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthUser extends User {
  name?: string;
  role?: 'admin' | 'manager' | 'user';
}

interface Company {
  id: string;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  industry?: string;
  size?: string;
  address?: string;
  created_at: Date;
  plan?: 'free' | 'professional' | 'enterprise';
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  company: Company | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  registerCompany: (companyData: Omit<Company, 'id' | 'created_at'>, adminData: { name: string; email: string; password: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: supabaseUser, session, isLoading } = useAuthState();

  console.log('AuthProvider - isLoading:', isLoading, 'supabaseUser:', supabaseUser);

  // Transform Supabase user to include additional properties
  const user: AuthUser | null = supabaseUser ? {
    ...supabaseUser,
    name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Usuário',
    role: supabaseUser.user_metadata?.role || 'user'
  } : null;

  // Mock company data for now - in a real app this would come from your database
  const company: Company | null = user ? {
    id: '1',
    name: 'BizForce Solutions',
    email: user.email || '',
    plan: 'professional',
    created_at: new Date()
  } : null;

  const login = async (email: string, password: string) => {
    try {
      console.log('Tentando fazer login com:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro no login:', error);
        toast.error(error.message);
        throw error;
      }

      if (data.user) {
        console.log('Login bem-sucedido:', data.user);
        toast.success('Login realizado com sucesso!');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Erro no logout:', error);
        toast.error('Erro ao sair');
      } else {
        toast.success('Logout realizado com sucesso!');
      }
    } catch (error) {
      console.error('Erro no logout:', error);
      toast.error('Erro ao sair');
    }
  };

  const registerCompany = async (
    companyData: Omit<Company, 'id' | 'created_at'>, 
    adminData: { name: string; email: string; password: string }
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: adminData.email,
        password: adminData.password,
        options: {
          data: {
            name: adminData.name,
            role: 'admin'
          }
        }
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      if (data.user) {
        toast.success('Empresa registrada com sucesso!');
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      company,
      isLoading,
      login,
      logout,
      registerCompany
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
