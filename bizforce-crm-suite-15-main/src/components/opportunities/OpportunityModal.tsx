
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Opportunity } from '@/types';
import { useSupabaseAccounts } from '@/hooks/useSupabaseAccounts';
import { useSupabaseContacts } from '@/hooks/useSupabaseContacts';

interface OpportunityFormData {
  name: string;
  account_id: string;
  contact_id: string;
  amount: number;
  stage: string;
  probability: number;
  close_date: string;
  description: string;
}

interface OpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (opportunity: Omit<Opportunity, 'id' | 'created_at'>) => void;
  editingOpportunity?: Opportunity | null;
}

export const OpportunityModal = ({ isOpen, onClose, onSubmit, editingOpportunity }: OpportunityModalProps) => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<OpportunityFormData>();
  const { accounts } = useSupabaseAccounts();
  const { contacts } = useSupabaseContacts();
  
  const selectedAccountId = watch('account_id');
  const selectedContactId = watch('contact_id');
  const selectedStage = watch('stage');

  // Filtrar contactos pela conta selecionada
  const availableContacts = contacts.filter(contact => contact.account_id === selectedAccountId);

  useEffect(() => {
    if (editingOpportunity) {
      reset({
        name: editingOpportunity.name,
        account_id: editingOpportunity.account_id,
        contact_id: editingOpportunity.contact_id,
        amount: editingOpportunity.amount,
        stage: editingOpportunity.stage,
        probability: editingOpportunity.probability,
        close_date: editingOpportunity.close_date.toISOString().split('T')[0],
        description: editingOpportunity.description
      });
    } else {
      reset({
        name: '',
        account_id: '',
        contact_id: '',
        amount: 0,
        stage: 'lead',
        probability: 25,
        close_date: '',
        description: ''
      });
    }
  }, [editingOpportunity, isOpen, reset]);

  const onFormSubmit = (data: OpportunityFormData) => {
    const selectedAccount = accounts.find(acc => acc.id === data.account_id);
    const selectedContact = contacts.find(cont => cont.id === data.contact_id);
    
    const opportunityData: Omit<Opportunity, 'id' | 'created_at'> = {
      name: data.name,
      account_id: data.account_id,
      account_name: selectedAccount?.name || '',
      contact_id: data.contact_id,
      contact_name: selectedContact ? `${selectedContact.first_name} ${selectedContact.last_name}` : '',
      amount: data.amount,
      stage: data.stage as Opportunity['stage'],
      probability: data.probability,
      close_date: new Date(data.close_date),
      description: data.description,
      owner_id: '',
      owner_name: ''
    };

    onSubmit(opportunityData);
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingOpportunity ? 'Editar Oportunidade' : 'Nova Oportunidade'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Oportunidade *</Label>
            <Input
              id="name"
              {...register('name', { required: 'Nome é obrigatório' })}
              placeholder="Ex: Sistema CRM - Empresa ABC"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="account">Empresa *</Label>
              <Select value={selectedAccountId} onValueChange={(value) => {
                setValue('account_id', value);
                setValue('contact_id', ''); // Reset contact when account changes
              }}>
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
            <div className="space-y-2">
              <Label htmlFor="contact">Contacto</Label>
              <Select value={selectedContactId} onValueChange={(value) => setValue('contact_id', value)} disabled={!selectedAccountId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar contacto" />
                </SelectTrigger>
                <SelectContent>
                  {availableContacts.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.first_name} {contact.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor (€) *</Label>
              <Input
                id="amount"
                type="number"
                {...register('amount', { required: 'Valor é obrigatório', min: 1 })}
                placeholder="25000"
              />
              {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="close_date">Data de Fecho *</Label>
              <Input
                id="close_date"
                type="date"
                {...register('close_date', { required: 'Data é obrigatória' })}
              />
              {errors.close_date && <p className="text-red-500 text-sm">{errors.close_date.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stage">Estágio *</Label>
              <Select value={selectedStage} onValueChange={(value) => setValue('stage', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar estágio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="qualified">Qualificado</SelectItem>
                  <SelectItem value="proposal">Proposta</SelectItem>
                  <SelectItem value="negotiation">Negociação</SelectItem>
                  <SelectItem value="closed_won">Fechado (Ganho)</SelectItem>
                  <SelectItem value="closed_lost">Fechado (Perdido)</SelectItem>
                </SelectContent>
              </Select>
              {!selectedStage && <p className="text-red-500 text-sm">Estágio é obrigatório</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="probability">Probabilidade (%) *</Label>
              <Input
                id="probability"
                type="number"
                min="0"
                max="100"
                {...register('probability', { required: 'Probabilidade é obrigatória', min: 0, max: 100 })}
              />
              {errors.probability && <p className="text-red-500 text-sm">{errors.probability.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Detalhes sobre a oportunidade..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {editingOpportunity ? 'Actualizar' : 'Criar Oportunidade'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
