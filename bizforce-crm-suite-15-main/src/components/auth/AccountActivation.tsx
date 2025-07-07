
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  CheckCircle, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff,
  User,
  AlertCircle
} from 'lucide-react';

interface AccountActivationProps {
  token?: string;
  email?: string;
  onActivationComplete?: () => void;
}

export const AccountActivation = ({ 
  token = 'demo-token', 
  email = 'usuario@empresa.com',
  onActivationComplete 
}: AccountActivationProps) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);
  const [userInfo, setUserInfo] = useState({
    name: 'João Silva',
    position: 'Sales Manager',
    company: 'Empresa A'
  });

  useEffect(() => {
    // Simulate token validation
    const validateToken = async () => {
      setIsLoading(true);
      try {
        // Simulate API call to validate token
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsValidToken(true);
      } catch (error) {
        setIsValidToken(false);
        toast.error('Link de ativação inválido ou expirado.');
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      validateToken();
    }
  }, [token]);

  const validatePassword = (pwd: string) => {
    const minLength = pwd.length >= 8;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordValidation = validatePassword(password);
    
    if (!passwordValidation.isValid) {
      toast.error('A senha não atende aos critérios de segurança.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to activate account
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Conta ativada com sucesso! Redirecionando...');
      
      setTimeout(() => {
        if (onActivationComplete) {
          onActivationComplete();
        }
      }, 1500);
      
    } catch (error) {
      toast.error('Erro ao ativar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordValidation = validatePassword(password);

  if (isLoading && !password) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Validando convite...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Link Inválido</h2>
              <p className="text-gray-600 mb-4">
                Este link de ativação é inválido ou já expirou.
              </p>
              <p className="text-sm text-gray-500">
                Entre em contato com o administrador para receber um novo convite.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Bem-vindo ao BizForce
          </CardTitle>
          <p className="text-gray-600">Ative a sua conta definindo uma senha segura</p>
        </CardHeader>

        <CardContent className="p-6">
          {/* User Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium text-sm">
                  {userInfo.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-blue-900">{userInfo.name}</h3>
                <p className="text-sm text-blue-700">{userInfo.position}</p>
                <p className="text-sm text-blue-600">{userInfo.company}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email (readonly) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  className="pl-10 bg-gray-50"
                  readOnly
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Nova Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            {password && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Critérios da senha:</h4>
                <div className="space-y-1">
                  {[
                    { label: 'Pelo menos 8 caracteres', valid: passwordValidation.minLength },
                    { label: 'Uma letra maiúscula', valid: passwordValidation.hasUpper },
                    { label: 'Uma letra minúscula', valid: passwordValidation.hasLower },
                    { label: 'Um número', valid: passwordValidation.hasNumber },
                    { label: 'Um caractere especial', valid: passwordValidation.hasSpecial }
                  ].map((req, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle 
                        className={`h-4 w-4 ${req.valid ? 'text-green-500' : 'text-gray-300'}`}
                      />
                      <span className={`text-sm ${req.valid ? 'text-green-700' : 'text-gray-500'}`}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirme sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-sm text-red-600">As senhas não coincidem</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading || !passwordValidation.isValid || password !== confirmPassword}
            >
              {isLoading ? 'Ativando conta...' : 'Ativar Conta'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Precisa de ajuda? Entre em contato com o{' '}
              <a href="mailto:admin@empresa.com" className="text-blue-600 hover:underline">
                administrador
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
