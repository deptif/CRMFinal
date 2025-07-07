
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Briefcase, 
  Calendar,
  Clock,
  Eye
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  company: string;
  address: string;
  status: 'pending' | 'active' | 'suspended';
  created_at: Date;
  last_login?: Date;
  invited_at?: Date;
}

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export const ViewUserModal = ({ isOpen, onClose, user }: ViewUserModalProps) => {
  if (!user) return null;

  const getStatusBadge = (status: User['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Suspenso</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Detalhes do Trabalhador
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header com avatar e status */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xl">
                {user.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-gray-600">{user.position}</p>
              <div className="mt-2">
                {getStatusBadge(user.status)}
              </div>
            </div>
          </div>

          {/* Informações de contato */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Informações de Contato</h4>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              {user.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Telefone</p>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                </div>
              )}

              {user.address && (
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Morada</p>
                    <p className="font-medium">{user.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Informações profissionais */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Informações Profissionais</h4>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Briefcase className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Cargo</p>
                  <p className="font-medium">{user.position}</p>
                </div>
              </div>

              {user.department && (
                <div className="flex items-center space-x-3">
                  <Building className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Departamento</p>
                    <p className="font-medium">{user.department}</p>
                  </div>
                </div>
              )}

              {user.company && (
                <div className="flex items-center space-x-3">
                  <Building className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Empresa</p>
                    <p className="font-medium">{user.company}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Informações da conta */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Atividade da Conta</h4>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Data de criação</p>
                  <p className="font-medium">{user.created_at.toLocaleDateString('pt-PT')}</p>
                </div>
              </div>

              {user.last_login ? (
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Último login</p>
                    <p className="font-medium">{user.last_login.toLocaleDateString('pt-PT')}</p>
                  </div>
                </div>
              ) : user.status === 'pending' && user.invited_at ? (
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Convite enviado</p>
                    <p className="font-medium">{user.invited_at.toLocaleDateString('pt-PT')}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Último login</p>
                    <p className="font-medium text-gray-500">Nunca</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status específico */}
          {user.status === 'pending' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Mail className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-900">Aguardando Ativação</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Este trabalhador ainda não ativou a sua conta. Um email de convite foi enviado 
                    com instruções para definir a senha.
                  </p>
                </div>
              </div>
            </div>
          )}

          {user.status === 'suspended' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <User className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-red-900">Conta Suspensa</h4>
                  <p className="text-sm text-red-700 mt-1">
                    Este trabalhador tem a conta suspensa e não pode aceder ao sistema.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} variant="outline">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
