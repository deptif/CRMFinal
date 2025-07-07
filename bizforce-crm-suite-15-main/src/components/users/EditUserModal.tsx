
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { User, Mail, Phone, MapPin, Building, Briefcase, Edit3 } from 'lucide-react';

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

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (userData: Omit<User, 'id' | 'created_at'>) => void;
}

export const EditUserModal = ({ isOpen, onClose, user, onSave }: EditUserModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    company: '',
    address: '',
    status: 'active' as 'pending' | 'active' | 'suspended'
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        position: user.position,
        department: user.department,
        company: user.company,
        address: user.address,
        status: user.status
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.position) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error('Por favor, insira um email válido.');
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave({
        ...formData,
        last_login: user?.last_login,
        invited_at: user?.invited_at
      });
      
      onClose();
      
    } catch (error) {
      toast.error('Erro ao atualizar trabalhador. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string | 'pending' | 'active' | 'suspended') => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const departments = [
    'Vendas',
    'Marketing', 
    'Recursos Humanos',
    'Financeiro',
    'TI',
    'Operações',
    'Atendimento ao Cliente',
    'Produto',
    'Jurídico'
  ];

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Edit3 className="h-5 w-5 mr-2" />
            Editar Trabalhador
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome Completo *</Label>
              <Input
                id="edit-name"
                type="text"
                placeholder="Ex: João Silva"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="joao@empresa.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Telefone */}
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="edit-phone"
                  type="tel"
                  placeholder="+351 912 345 678"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Cargo */}
            <div className="space-y-2">
              <Label htmlFor="edit-position">Cargo *</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="edit-position"
                  type="text"
                  placeholder="Ex: Sales Manager"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Departamento */}
            <div className="space-y-2">
              <Label htmlFor="edit-department">Departamento</Label>
              <select
                id="edit-department"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecionar departamento</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <select
                id="edit-status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as 'pending' | 'active' | 'suspended')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Ativo</option>
                <option value="pending">Pendente</option>
                <option value="suspended">Suspenso</option>
              </select>
            </div>

            {/* Empresa */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-company">Empresa</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="edit-company"
                  type="text"
                  placeholder="Nome da empresa"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Morada */}
          <div className="space-y-2">
            <Label htmlFor="edit-address">Morada</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
              <Textarea
                id="edit-address"
                placeholder="Rua, Cidade, Código Postal, País"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="pl-10 min-h-[80px]"
              />
            </div>
          </div>

          {/* Informações da conta */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Informações da Conta</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Data de criação:</span>
                <p className="font-medium">{user.created_at.toLocaleDateString('pt-PT')}</p>
              </div>
              {user.last_login && (
                <div>
                  <span className="text-gray-600">Último login:</span>
                  <p className="font-medium">{user.last_login.toLocaleDateString('pt-PT')}</p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              {isLoading ? 'Atualizando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
