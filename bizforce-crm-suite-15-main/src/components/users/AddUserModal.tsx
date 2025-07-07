
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { User, Mail, Phone, MapPin, Building, Briefcase, Lock, Loader2 } from 'lucide-react';
import { useInvitationSystem } from '@/hooks/useInvitationSystem';

interface User {
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  company: string;
  address: string;
  password: string;
}

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: Omit<User, 'password'>) => void;
}

export const AddUserModal = ({ isOpen, onClose, onSave }: AddUserModalProps) => {
  const [formData, setFormData] = useState<User>({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    company: '',
    address: '',
    password: ''
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { sendInvitation, isSending } = useInvitationSystem();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.position || !formData.company) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error('Por favor, insira um email válido.');
      return;
    }

    if (!formData.password) {
      toast.error('Por favor, defina uma senha.');
      return;
    }

    if (formData.password !== confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Enviar convite por email
      const invitationSuccess = await sendInvitation({
        email: formData.email,
        name: formData.name,
        position: formData.position,
        department: formData.department,
        company: formData.company
      });

      if (invitationSuccess) {
        // Salvar usuário (sem incluir a senha nos dados salvos)
        const { password, ...userDataWithoutPassword } = formData;
        onSave(userDataWithoutPassword);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          position: '',
          department: '',
          company: '',
          address: '',
          password: ''
        });
        setConfirmPassword('');
        
        onClose();
        toast.success('Trabalhador adicionado e convite enviado com sucesso!');
      }
      
    } catch (error) {
      toast.error('Erro ao adicionar trabalhador. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof User, value: string) => {
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

  const companies = [
    'TechCorp Solutions',
    'InnovateTech Ltd',
    'Digital Dynamics',
    'SmartBusiness Inc',
    'FutureTech Systems',
    'ProSolutions Group',
    'NextGen Technologies',
    'BusinessFlow Solutions'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Adicionar Novo Trabalhador
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Ex: João Silva"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
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
              <Label htmlFor="phone">Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="phone"
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
              <Label htmlFor="position">Cargo *</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="position"
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
              <Label htmlFor="department">Departamento</Label>
              <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar departamento" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Empresa */}
            <div className="space-y-2">
              <Label htmlFor="company">Empresa *</Label>
              <Select value={formData.company} onValueChange={(value) => handleInputChange('company', value)} required>
                <SelectTrigger>
                  <Building className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Selecionar empresa" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map(company => (
                    <SelectItem key={company} value={company}>{company}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Morada */}
          <div className="space-y-2">
            <Label htmlFor="address">Morada</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
              <Textarea
                id="address"
                placeholder="Rua, Cidade, Código Postal, País"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="pl-10 min-h-[80px]"
              />
            </div>
          </div>

          {/* Senha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Senha *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirme a senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Info sobre o convite */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">Convite por Email</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Um email de boas-vindas será enviado automaticamente com um link direto para o app. 
                  O trabalhador poderá acessar o sistema imediatamente através do link recebido.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading || isSending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || isSending} className="bg-blue-600 hover:bg-blue-700">
              {isLoading || isSending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enviando convite...
                </>
              ) : (
                'Adicionar Trabalhador'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
