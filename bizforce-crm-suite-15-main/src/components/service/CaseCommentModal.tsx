
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, User, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { Case } from '@/types';

interface Comment {
  id: string;
  author: string;
  content: string;
  created_at: Date;
}

interface CaseCommentModalProps {
  case: Case | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CaseCommentModal = ({ case: caseItem, open, onOpenChange }: CaseCommentModalProps) => {
  const [comment, setComment] = useState('');
  const [comments] = useState<Comment[]>([
    {
      id: '1',
      author: 'Ana Silva',
      content: 'Entrei em contacto com o cliente para obter mais detalhes sobre o problema.',
      created_at: new Date('2024-01-15T10:30:00')
    },
    {
      id: '2',
      author: 'João Santos',
      content: 'Identifiquei a causa do problema. Trata-se de um conflito na sincronização de dados.',
      created_at: new Date('2024-01-15T14:20:00')
    }
  ]);

  const handleAddComment = () => {
    if (!comment.trim()) {
      toast.error('Por favor, escreva um comentário');
      return;
    }

    // Here you would normally save the comment
    console.log('Adding comment:', comment);
    setComment('');
    toast.success('Comentário adicionado com sucesso!');
  };

  if (!caseItem) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Comentários - {caseItem.case_number}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">{caseItem.subject}</h3>
            <p className="text-sm text-gray-600">{caseItem.description}</p>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Histórico de Comentários</h4>
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3 p-3 bg-white border rounded-lg">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm">{comment.author}</span>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {comment.created_at.toLocaleDateString('pt-PT')} às {comment.created_at.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label>Adicionar Comentário</Label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Escreva seu comentário aqui..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button onClick={handleAddComment}>
            Adicionar Comentário
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
