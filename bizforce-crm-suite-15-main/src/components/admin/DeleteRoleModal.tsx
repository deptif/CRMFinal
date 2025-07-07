
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  users_count: number;
  created_at: Date;
}

interface DeleteRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
  onDelete: (roleId: string) => void;
}

export const DeleteRoleModal = ({ isOpen, onClose, role, onDelete }: DeleteRoleModalProps) => {
  const handleDelete = () => {
    if (role) {
      onDelete(role.id);
      toast.success('Role deleted successfully!');
    }
    onClose();
  };

  if (!role) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>Are you sure you want to delete the role <strong>"{role.name}"</strong>?</p>
            {role.users_count > 0 && (
              <p className="text-red-600 font-medium">
                ⚠️ This role is being used by {role.users_count} user(s). 
                They will lose access to associated functionalities.
              </p>
            )}
            <p className="text-sm text-gray-600">This action cannot be undone.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete Role
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
