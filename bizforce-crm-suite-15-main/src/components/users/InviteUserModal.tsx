
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { User, Mail, Phone, MapPin, Building, Briefcase, Send, Loader2 } from 'lucide-react';
import { useInvitationSystem } from '@/hooks/useInvitationSystem';

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInviteSent?: () => void;
}

export const InviteUserModal = ({ isOpen, onClose, onInviteSent }: InviteUserModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
    company: ''
  });

  const { sendInvitation, isSending } = useInvitationSystem();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.position) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error('Por favor, insira um email válido.');
      return;
    }

    const success = await sendInvitation(formData);
    
    if (success) {
      // Reset form
      setFormData({
        name: '',
        email: '',
        position: '',
        department: '',
        company: ''
      });
      
      onClose();
      
      if (onInviteSent) {
        onInviteSent();
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Send className="h-5 w-5 mr-2 text-blue-600" />
            Enviar Convite
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
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
              <select
                id="department"
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

            {/* Empresa */}
            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="company"
                  type="text"
                  placeholder="Nome da empresa"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Info sobre o convite */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Send className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">Convite por Email</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Será enviado um email com um link direto para ativação da conta. 
                  O usuário não precisará fazer login - será redirecionado diretamente para o sistema.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSending} className="bg-blue-600 hover:bg-blue-700">
              {isSending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enviando convite...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Convite
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
