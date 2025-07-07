
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Case } from '@/types';

interface EditCaseModalProps {
  case: Case | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedCase: Case) => void;
}

export const EditCaseModal = ({ case: caseItem, open, onOpenChange, onSave }: EditCaseModalProps) => {
  const [formData, setFormData] = useState<{
    subject: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'new' | 'in_progress' | 'waiting' | 'closed';
    type: 'bug' | 'feature' | 'question' | 'complaint';
    contact_name: string;
    account_name: string;
  }>({
    subject: '',
    description: '',
    priority: 'medium',
    status: 'new',
    type: 'bug',
    contact_name: '',
    account_name: '',
  });

  useEffect(() => {
    if (caseItem) {
      setFormData({
        subject: caseItem.subject,
        description: caseItem.description,
        priority: caseItem.priority,
        status: caseItem.status,
        type: caseItem.type,
        contact_name: caseItem.contact_name,
        account_name: caseItem.account_name,
      });
    }
  }, [caseItem]);

  const handleSave = () => {
    if (!formData.subject.trim() || !formData.description.trim()) {
      toast.error('Assunto e descrição são obrigatórios');
      return;
    }

    if (!caseItem) return;

    const updatedCase: Case = {
      ...caseItem,
      subject: formData.subject,
      description: formData.description,
      priority: formData.priority,
      status: formData.status,
      type: formData.type,
      contact_name: formData.contact_name,
      account_name: formData.account_name,
    };

    onSave(updatedCase);
    onOpenChange(false);
    toast.success('Caso atualizado com sucesso!');
    
    // TODO: Replace with actual database call
    // await updateCaseInDB(updatedCase);
  };

  if (!caseItem) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Caso - {caseItem.case_number}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Assunto *</Label>
            <Input
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              placeholder="Descreva brevemente o problema"
            />
          </div>

          <div className="space-y-2">
            <Label>Descrição *</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Descreva detalhadamente o problema"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select value={formData.priority} onValueChange={(value: 'low' | 'medium' | 'high' | 'critical') => setFormData({...formData, priority: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="critical">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value: 'new' | 'in_progress' | 'waiting' | 'closed') => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Novo</SelectItem>
                  <SelectItem value="in_progress">Em Andamento</SelectItem>
                  <SelectItem value="waiting">Aguardando</SelectItem>
                  <SelectItem value="closed">Fechado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select value={formData.type} onValueChange={(value: 'bug' | 'feature' | 'question' | 'complaint') => setFormData({...formData, type: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bug">Bug</SelectItem>
                <SelectItem value="feature">Funcionalidade</SelectItem>
                <SelectItem value="question">Pergunta</SelectItem>
                <SelectItem value="complaint">Reclamação</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Nome do Contacto</Label>
            <Input
              value={formData.contact_name}
              onChange={(e) => setFormData({...formData, contact_name: e.target.value})}
              placeholder="Nome do cliente"
            />
          </div>

          <div className="space-y-2">
            <Label>Conta</Label>
            <Input
              value={formData.account_name}
              onChange={(e) => setFormData({...formData, account_name: e.target.value})}
              placeholder="Nome da empresa"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
