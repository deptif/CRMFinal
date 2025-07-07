
import { useState } from 'react';
import { useSupabaseUsers } from '@/hooks/useSupabaseUsers';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: {
    title: string;
    description: string;
    assignee: string;
    assignee_name: string;
    priority: 'low' | 'medium' | 'high';
    due_date: Date;
    labels: string[];
    status: 'todo' | 'in-progress' | 'review' | 'done';
    owner_id: string;
  }) => void;
  initialStatus?: 'todo' | 'in-progress' | 'review' | 'done';
}

export const TaskModal = ({ isOpen, onClose, onSave, initialStatus = 'todo' }: TaskModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeName, setAssigneeName] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [labels, setLabels] = useState<string[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const { users } = useSupabaseUsers();

  const handleAddLabel = () => {
    if (newLabel.trim() && !labels.includes(newLabel.trim())) {
      setLabels([...labels, newLabel.trim()]);
      setNewLabel('');
    }
  };

  const handleRemoveLabel = (labelToRemove: string) => {
    setLabels(labels.filter(label => label !== labelToRemove));
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('Por favor, insira um título para a tarefa');
      return;
    }

    if (!assigneeName) {
      toast.error('Por favor, selecione um responsável');
      return;
    }

    if (!dueDate) {
      toast.error('Por favor, selecione uma data de vencimento');
      return;
    }

    const selectedUser = users.find(user => user.name === assigneeName);
    
    const newTask = {
      title: title.trim(),
      description: description.trim(),
      assignee: selectedUser?.id || '',
      assignee_name: assigneeName,
      priority,
      due_date: new Date(dueDate),
      labels,
      status: initialStatus,
      owner_id: selectedUser?.id || ''
    };

    onSave(newTask);
    handleClose();
    toast.success('Tarefa criada com sucesso!');
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setAssigneeName('');
    setPriority('medium');
    setDueDate('');
    setLabels([]);
    setNewLabel('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Tarefa</DialogTitle>
          <DialogDescription>
            Crie uma nova tarefa para a sua equipa. Preencha os detalhes abaixo.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Follow-up Cliente ABC"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva os detalhes da tarefa..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Responsável *</Label>
              <Select value={assigneeName} onValueChange={setAssigneeName}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.name}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Data de Vencimento *</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Etiquetas</Label>
            <div className="flex gap-2">
              <Input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Adicionar etiqueta..."
                onKeyPress={(e) => e.key === 'Enter' && handleAddLabel()}
              />
              <Button type="button" onClick={handleAddLabel} variant="outline">
                Adicionar
              </Button>
            </div>
            {labels.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {labels.map((label) => (
                  <Badge key={label} variant="outline" className="flex items-center gap-1">
                    {label}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleRemoveLabel(label)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Criar Tarefa
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
