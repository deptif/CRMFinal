
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Users } from 'lucide-react';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (name: string, description?: string, participants?: string[]) => void;
}

export const CreateGroupModal = ({ isOpen, onClose, onCreateGroup }: CreateGroupModalProps) => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [participantsText, setParticipantsText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    setIsLoading(true);
    try {
      const participants = participantsText
        .split(',')
        .map(email => email.trim())
        .filter(email => email && email.includes('@'));

      onCreateGroup(
        groupName.trim(),
        description.trim() || undefined,
        participants.length > 0 ? participants : undefined
      );
      
      setGroupName('');
      setDescription('');
      setParticipantsText('');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setGroupName('');
    setDescription('');
    setParticipantsText('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Criar Grupo
          </DialogTitle>
          <DialogDescription>
            Crie um novo grupo de chat para conversar com várias pessoas.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="groupName">Nome do Grupo *</Label>
            <Input
              id="groupName"
              type="text"
              placeholder="Nome do grupo"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Descreva o propósito do grupo"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="participants">Participantes (opcional)</Label>
            <Textarea
              id="participants"
              placeholder="Digite os emails separados por vírgula: user1@email.com, user2@email.com"
              value={participantsText}
              onChange={(e) => setParticipantsText(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-gray-500">
              Você pode adicionar participantes depois também
            </p>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!groupName.trim() || isLoading}>
              {isLoading ? 'Criando...' : 'Criar Grupo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
