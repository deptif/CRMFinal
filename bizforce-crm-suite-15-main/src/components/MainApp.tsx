
import { useAuth } from '@/contexts/AuthContext';
import { SimpleLoginPage } from '@/components/auth/SimpleLoginPage';
import Index from '@/pages/Index';

export const MainApp = () => {
  const { user, isLoading } = useAuth();

  console.log('MainApp - isLoading:', isLoading, 'user:', user);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <SimpleLoginPage />;
  }

  return <Index />;
};
