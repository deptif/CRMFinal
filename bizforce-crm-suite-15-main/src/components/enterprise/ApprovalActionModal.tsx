
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle } from 'lucide-react';

interface ApprovalActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (comments: string) => void;
  action: 'approve' | 'reject';
  requestTitle: string;
}

export const ApprovalActionModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  action, 
  requestTitle 
}: ApprovalActionModalProps) => {
  const [comments, setComments] = useState('');

  const handleConfirm = () => {
    onConfirm(comments);
    setComments('');
    onClose();
  };

  const isApprove = action === 'approve';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {isApprove ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <span>
              {isApprove ? 'Aprovar' : 'Rejeitar'} Solicitação
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Solicitação:</p>
            <p className="font-medium">{requestTitle}</p>
          </div>

          <div>
            <Label htmlFor="comments">
              Comentários {isApprove ? '(opcional)' : '(obrigatório)'}
            </Label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder={`Adicione comentários sobre ${isApprove ? 'a aprovação' : 'a rejeição'}...`}
              required={!isApprove}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              className={isApprove ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              disabled={!isApprove && !comments.trim()}
            >
              {isApprove ? 'Aprovar' : 'Rejeitar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
