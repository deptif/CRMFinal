
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity } from '@/types';

interface ActivityFormData {
  title: string;
  description: string;
  type: string;
  status: string;
  due_date: string;
  related_to: string;
  related_id: string;
}

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (activity: Omit<Activity, 'id' | 'created_at'>) => void;
  editingActivity?: Activity | null;
}

export const ActivityModal = ({ isOpen, onClose, onSubmit, editingActivity }: ActivityModalProps) => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ActivityFormData>();
  const selectedRelatedTo = watch('related_to');
  const selectedRelatedId = watch('related_id');
  const selectedType = watch('type');
  const selectedStatus = watch('status');

  useEffect(() => {
    if (editingActivity) {
      reset({
        title: editingActivity.title,
        description: editingActivity.description,
        type: editingActivity.type,
        status: editingActivity.status,
        due_date: editingActivity.due_date.toISOString().split('T')[0],
        related_to: editingActivity.related_to,
        related_id: editingActivity.related_id
      });
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      reset({
        title: '',
        description: '',
        type: 'task',
        status: 'pending',
        due_date: tomorrow.toISOString().split('T')[0],
        related_to: 'account',
        related_id: ''
      });
    }
  }, [editingActivity, isOpen, reset]);

  // TODO: Replace with actual database calls
  const getRelatedOptions = () => {
    // This will be populated from database queries
    // const accounts = await fetchAccounts();
    // const contacts = await fetchContacts();
    // const opportunities = await fetchOpportunities();
    
    switch (selectedRelatedTo) {
      case 'account':
        return []; // Will be populated from database
      case 'contact':
        return []; // Will be populated from database
      case 'opportunity':
        return []; // Will be populated from database
      default:
        return [];
    }
  };

  const onFormSubmit = (data: ActivityFormData) => {
    // TODO: Get related name from database based on related_id
    let relatedName = '';
    
    const activityData: Omit<Activity, 'id' | 'created_at'> = {
      title: data.title,
      description: data.description,
      type: data.type as Activity['type'],
      status: data.status as Activity['status'],
      due_date: new Date(data.due_date),
      related_to: data.related_to as Activity['related_to'],
      related_id: data.related_id,
      related_name: relatedName,
      owner_id: '1', // TODO: Get from authentication context
      owner_name: 'Current User' // TODO: Get from authentication context
    };

    onSubmit(activityData);
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingActivity ? 'Editar Atividade' : 'Nova Atividade'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              {...register('title', { required: 'Título é obrigatório' })}
              placeholder="Ex: Ligação para seguimento"
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Detalhes sobre a atividade..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select value={selectedType} onValueChange={(value) => setValue('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">Ligação</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="meeting">Reunião</SelectItem>
                  <SelectItem value="task">Tarefa</SelectItem>
                  <SelectItem value="note">Nota</SelectItem>
                </SelectContent>
              </Select>
              {!selectedType && <p className="text-red-500 text-sm">Tipo é obrigatório</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select value={selectedStatus} onValueChange={(value) => setValue('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="completed">Concluída</SelectItem>
                  <SelectItem value="cancelled">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="due_date">Data de Vencimento *</Label>
            <Input
              id="due_date"
              type="date"
              {...register('due_date', { required: 'Data é obrigatória' })}
            />
            {errors.due_date && <p className="text-red-500 text-sm">{errors.due_date.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="related_to">Relacionado com *</Label>
              <Select value={selectedRelatedTo} onValueChange={(value) => {
                setValue('related_to', value);
                setValue('related_id', '');
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="account">Conta</SelectItem>
                  <SelectItem value="contact">Contato</SelectItem>
                  <SelectItem value="opportunity">Oportunidade</SelectItem>
                </SelectContent>
              </Select>
              {!selectedRelatedTo && <p className="text-red-500 text-sm">Relacionado é obrigatório</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="related_item">Item Relacionado *</Label>
              <Select value={selectedRelatedId} onValueChange={(value) => setValue('related_id', value)} disabled={!selectedRelatedTo}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar..." />
                </SelectTrigger>
                <SelectContent>
                  {getRelatedOptions().map((option: any) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!selectedRelatedId && <p className="text-red-500 text-sm">Item é obrigatório</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {editingActivity ? 'Actualizar' : 'Criar Atividade'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
