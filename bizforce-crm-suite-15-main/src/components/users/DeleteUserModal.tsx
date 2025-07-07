
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'active' | 'suspended';
}

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onDelete: (userId: string) => void;
}

export const DeleteUserModal = ({ isOpen, onClose, user, onDelete }: DeleteUserModalProps) => {
  const handleDelete = () => {
    if (user) {
      onDelete(user.id);
      toast.success(`${user.name} foi removido com sucesso!`);
    }
    onClose();
  };

  if (!user) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>Tem a certeza que deseja remover <strong>"{user.name}"</strong>?</p>
            {user.status === 'active' && (
              <p className="text-red-600 font-medium">
                ⚠️ Este trabalhador está ativo e perderá o acesso ao sistema imediatamente.
              </p>
            )}
            <p className="text-sm text-gray-600">
              Esta ação não pode ser desfeita. Todos os dados associados serão removidos permanentemente.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Remover Trabalhador
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
