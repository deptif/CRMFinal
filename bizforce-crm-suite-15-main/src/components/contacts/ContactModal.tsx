
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Contact } from '@/types';
import { useSupabaseAccounts } from '@/hooks/useSupabaseAccounts';

interface ContactFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  title: string;
  account_id: string;
  tags: string;
}

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (contact: Omit<Contact, 'id' | 'created_at'>) => void;
  editingContact?: Contact | null;
}

export const ContactModal = ({ isOpen, onClose, onSubmit, editingContact }: ContactModalProps) => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ContactFormData>();
  const { accounts } = useSupabaseAccounts();
  const selectedAccountId = watch('account_id');

  useEffect(() => {
    if (editingContact) {
      reset({
        first_name: editingContact.first_name,
        last_name: editingContact.last_name,
        email: editingContact.email,
        phone: editingContact.phone,
        title: editingContact.title,
        account_id: editingContact.account_id,
        tags: editingContact.tags.join(', ')
      });
    } else {
      reset({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        title: '',
        account_id: '',
        tags: ''
      });
    }
  }, [editingContact, isOpen, reset]);

  const onFormSubmit = (data: ContactFormData) => {
    const selectedAccount = accounts.find(acc => acc.id === data.account_id);
    
    const contactData: Omit<Contact, 'id' | 'created_at'> = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      title: data.title,
      account_id: data.account_id,
      account_name: selectedAccount?.name || '',
      tags: data.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      owner_id: '',
      owner_name: ''
    };

    onSubmit(contactData);
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingContact ? 'Editar Contacto' : 'Novo Contacto'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">Nome *</Label>
              <Input
                id="first_name"
                {...register('first_name', { required: 'Nome é obrigatório' })}
                placeholder="Nome"
              />
              {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Apelido *</Label>
              <Input
                id="last_name"
                {...register('last_name', { required: 'Apelido é obrigatório' })}
                placeholder="Apelido"
              />
              {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name.message}</p>}
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
                placeholder="email@exemplo.com"
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Cargo</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Diretor, Manager, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account">Empresa *</Label>
              <Select value={selectedAccountId} onValueChange={(value) => setValue('account_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar empresa" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!selectedAccountId && <p className="text-red-500 text-sm">Empresa é obrigatória</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
            <Input
              id="tags"
              {...register('tags')}
              placeholder="Decisor, C-Level, Técnico"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {editingContact ? 'Actualizar' : 'Criar Contacto'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
