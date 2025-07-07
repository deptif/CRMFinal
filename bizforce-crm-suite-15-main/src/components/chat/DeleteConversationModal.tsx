
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';

interface DeleteConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteConversation: (conversationId: string) => void;
  conversationName: string;
  conversationId: string;
  isGroup: boolean;
}

export const DeleteConversationModal = ({ 
  isOpen, 
  onClose, 
  onDeleteConversation, 
  conversationName, 
  conversationId,
  isGroup 
}: DeleteConversationModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      onDeleteConversation(conversationId);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Eliminar {isGroup ? 'Grupo' : 'Conversa'}
          </DialogTitle>
          <DialogDescription>
            Tem a certeza que deseja eliminar {isGroup ? 'o grupo' : 'a conversa'} "{conversationName}"? 
            Esta ação não pode ser desfeita e todas as mensagens serão perdidas.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
