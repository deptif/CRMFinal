
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface NewCaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (newCase: any) => void;
}

export const NewCaseModal = ({ open, onOpenChange, onSave }: NewCaseModalProps) => {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'medium',
    type: 'bug',
    contact_name: '',
    account_name: '',
  });

  const handleSave = () => {
    if (!formData.subject.trim() || !formData.description.trim()) {
      toast.error('Assunto e descrição são obrigatórios');
      return;
    }

    const newCase = {
      id: Date.now().toString(),
      case_number: `CASE-2024-${String(Date.now()).slice(-3)}`,
      subject: formData.subject,
      description: formData.description,
      priority: formData.priority,
      status: 'new',
      type: formData.type,
      contact_id: Date.now().toString(),
      contact_name: formData.contact_name,
      account_id: Date.now().toString(),
      account_name: formData.account_name,
      owner_id: '1',
      owner_name: 'Ana Silva',
      created_at: new Date()
    };

    onSave(newCase);
    onOpenChange(false);
    setFormData({
      subject: '',
      description: '',
      priority: 'medium',
      type: 'bug',
      contact_name: '',
      account_name: '',
    });
    toast.success('Novo caso criado com sucesso!');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Novo Caso</DialogTitle>
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
              <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
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
              <Label>Tipo</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">Bug</SelectItem>
                  <SelectItem value="feature">Funcionalidade</SelectItem>
                  <SelectItem value="question">Pergunta</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
            Criar Caso
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
