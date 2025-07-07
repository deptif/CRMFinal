
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Account } from '@/types';

interface AccountFormData {
  name: string;
  industry: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  annual_revenue: number | '';
  employees: number | '';
  tags: string;
}

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (account: Omit<Account, 'id' | 'created_at'>) => void;
  editingAccount?: Account | null;
}

export const AccountModal = ({ isOpen, onClose, onSubmit, editingAccount }: AccountModalProps) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AccountFormData>();

  useEffect(() => {
    if (editingAccount) {
      reset({
        name: editingAccount.name,
        industry: editingAccount.industry,
        phone: editingAccount.phone,
        email: editingAccount.email,
        website: editingAccount.website,
        address: editingAccount.address,
        annual_revenue: editingAccount.annual_revenue || '',
        employees: editingAccount.employees || '',
        tags: editingAccount.tags.join(', ')
      });
    } else {
      reset({
        name: '',
        industry: '',
        phone: '',
        email: '',
        website: '',
        address: '',
        annual_revenue: '',
        employees: '',
        tags: ''
      });
    }
  }, [editingAccount, isOpen, reset]);

  const onFormSubmit = (data: AccountFormData) => {
    const accountData: Omit<Account, 'id' | 'created_at'> = {
      name: data.name,
      industry: data.industry,
      phone: data.phone,
      email: data.email,
      website: data.website,
      address: data.address,
      annual_revenue: data.annual_revenue ? Number(data.annual_revenue) : undefined,
      employees: data.employees ? Number(data.employees) : undefined,
      tags: data.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      owner_id: '1',
      owner_name: 'Ana Silva'
    };

    onSubmit(accountData);
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingAccount ? 'Editar Conta' : 'Nova Conta'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Empresa *</Label>
              <Input
                id="name"
                {...register('name', { required: 'Nome é obrigatório' })}
                placeholder="Nome da empresa"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Indústria *</Label>
              <Input
                id="industry"
                {...register('industry', { required: 'Indústria é obrigatória' })}
                placeholder="Setor de atividade"
              />
              {errors.industry && <p className="text-red-500 text-sm">{errors.industry.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { 
                  required: 'Email é obrigatório',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Email inválido'
                  }
                })}
                placeholder="email@empresa.com"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                {...register('phone', { required: 'Telefone é obrigatório' })}
                placeholder="+351 XXX XXX XXX"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              {...register('website')}
              placeholder="https://www.empresa.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Textarea
              id="address"
              {...register('address')}
              placeholder="Endereço completo da empresa"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="annual_revenue">Receita Anual (€)</Label>
              <Input
                id="annual_revenue"
                type="number"
                {...register('annual_revenue')}
                placeholder="1000000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employees">Nº de Funcionários</Label>
              <Input
                id="employees"
                type="number"
                {...register('employees')}
                placeholder="50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
            <Input
              id="tags"
              {...register('tags')}
              placeholder="Cliente Premium, Tecnologia, Estratégico"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {editingAccount ? 'Actualizar' : 'Criar Conta'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
