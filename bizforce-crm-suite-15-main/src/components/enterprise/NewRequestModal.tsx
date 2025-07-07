
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (requestData: any) => void;
}

export const NewRequestModal = ({ isOpen, onClose, onSave }: NewRequestModalProps) => {
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    amount: '',
    priority: 'medium'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.title || !formData.description) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const newRequest = {
      ...formData,
      amount: formData.amount ? parseFloat(formData.amount) : undefined,
      id: Date.now().toString(),
      requestedBy: 'Utilizador Atual',
      createdAt: new Date(),
      status: 'pending',
      currentApprover: 'Ana Silva',
      approvalChain: [
        {
          id: '1',
          approver: 'Ana Silva',
          role: 'Sales Manager',
          status: 'pending',
          order: 1
        },
        {
          id: '2',
          approver: 'Carlos Mendes',
          role: 'Sales Director',
          status: 'pending',
          order: 2
        }
      ]
    };

    onSave(newRequest);
    setFormData({
      type: '',
      title: '',
      description: '',
      amount: '',
      priority: 'medium'
    });
    onClose();
    toast.success('Solicitação criada com sucesso!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Solicitação de Aprovação</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">Tipo de Solicitação *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="discount">Desconto</SelectItem>
                <SelectItem value="contract">Contrato</SelectItem>
                <SelectItem value="expense">Despesa</SelectItem>
                <SelectItem value="deal">Negócio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Título da solicitação"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Descreva a solicitação"
              required
            />
          </div>

          <div>
            <Label htmlFor="amount">Valor (€)</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              placeholder="0.00"
              step="0.01"
            />
          </div>

          <div>
            <Label htmlFor="priority">Prioridade</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
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

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Criar Solicitação
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
