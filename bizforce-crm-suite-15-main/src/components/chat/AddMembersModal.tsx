
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
import { UserPlus } from 'lucide-react';

interface AddMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMembers: (groupId: string, newMembers: string[]) => void;
  groupId: string;
  groupName: string;
  currentMembers: string[];
}

export const AddMembersModal = ({ 
  isOpen, 
  onClose, 
  onAddMembers, 
  groupId, 
  groupName,
  currentMembers 
}: AddMembersModalProps) => {
  const [participantsText, setParticipantsText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!participantsText.trim()) return;

    setIsLoading(true);
    try {
      const newMembers = participantsText
        .split(',')
        .map(email => email.trim())
        .filter(email => email && email.includes('@') && !currentMembers.includes(email));

      if (newMembers.length > 0) {
        onAddMembers(groupId, newMembers);
        setParticipantsText('');
        onClose();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setParticipantsText('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Adicionar Membros ao Grupo
          </DialogTitle>
          <DialogDescription>
            Adicione novos membros ao grupo "{groupName}".
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentMembers">Membros atuais:</Label>
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              {currentMembers.join(', ')}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newMembers">Novos Membros</Label>
            <Textarea
              id="newMembers"
              placeholder="Digite os emails separados por vírgula: user1@email.com, user2@email.com"
              value={participantsText}
              onChange={(e) => setParticipantsText(e.target.value)}
              rows={3}
              required
            />
            <p className="text-xs text-gray-500">
              Apenas emails que não são membros atuais serão adicionados
            </p>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!participantsText.trim() || isLoading}>
              {isLoading ? 'Adicionando...' : 'Adicionar Membros'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
