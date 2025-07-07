
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useSupabaseContacts } from '@/hooks/useSupabaseContacts';

interface JourneyStageData {
  stage_name: string;
  stage_order: number;
  description: string;
  contact_id: string;
  completed_at?: Date;
}

interface CustomerJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (stage: JourneyStageData) => void;
}

export const CustomerJourneyModal = ({ isOpen, onClose, onSave }: CustomerJourneyModalProps) => {
  const { contacts } = useSupabaseContacts();
  const [stageName, setStageName] = useState('');
  const [stageOrder, setStageOrder] = useState('1');
  const [description, setDescription] = useState('');
  const [contactId, setContactId] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const predefinedStages = [
    'Primeiro Contacto',
    'Qualificação',
    'Apresentação',
    'Proposta',
    'Negociação',
    'Fechamento'
  ];

  const handleSave = () => {
    if (!stageName.trim()) {
      toast.error('Por favor, insira um nome para a etapa');
      return;
    }

    if (!contactId) {
      toast.error('Por favor, selecione um contacto');
      return;
    }

    const newStage: JourneyStageData = {
      stage_name: stageName.trim(),
      stage_order: Number(stageOrder) || 1,
      description: description.trim(),
      contact_id: contactId,
      completed_at: isCompleted ? new Date() : undefined
    };

    onSave(newStage);
    handleClose();
  };

  const handleClose = () => {
    setStageName('');
    setStageOrder('1');
    setDescription('');
    setContactId('');
    setIsCompleted(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Etapa da Jornada</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stageName">Nome da Etapa *</Label>
            <Select value={stageName} onValueChange={setStageName}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione ou digite uma etapa" />
              </SelectTrigger>
              <SelectContent>
                {predefinedStages.map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {stage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={stageName}
              onChange={(e) => setStageName(e.target.value)}
              placeholder="Ou digite uma etapa personalizada"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="order">Ordem da Etapa</Label>
              <Input
                id="order"
                type="number"
                value={stageOrder}
                onChange={(e) => setStageOrder(e.target.value)}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contacto *</Label>
              <Select value={contactId} onValueChange={setContactId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um contacto" />
                </SelectTrigger>
                <SelectContent>
                  {contacts.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.first_name} {contact.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição da etapa"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="completed"
              checked={isCompleted}
              onChange={(e) => setIsCompleted(e.target.checked)}
            />
            <Label htmlFor="completed">Marcar como concluída</Label>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Criar Etapa
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
