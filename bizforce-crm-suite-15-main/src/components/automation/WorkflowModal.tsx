import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Mail, Clock, Zap, Database, Users, Target } from 'lucide-react';
import { toast } from 'sonner';

interface WorkflowData {
  name: string;
  description: string;
  type: 'email' | 'task' | 'notification' | 'lead_scoring' | 'approval';
  trigger: string;
  status: 'active' | 'draft';
}

interface WorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workflow: WorkflowData) => void;
}

export const WorkflowModal = ({ isOpen, onClose, onSave }: WorkflowModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<WorkflowData['type']>('email');
  const [trigger, setTrigger] = useState('');
  const [status, setStatus] = useState<WorkflowData['status']>('draft');

  const workflowTypes = [
    { value: 'email', label: 'Email Marketing', icon: Mail, description: 'Envio automático de emails' },
    { value: 'task', label: 'Gestão de Tarefas', icon: Clock, description: 'Criação automática de tarefas' },
    { value: 'notification', label: 'Notificações', icon: Zap, description: 'Alertas e notificações' },
    { value: 'lead_scoring', label: 'Lead Scoring', icon: Target, description: 'Pontuação automática de leads' },
    { value: 'approval', label: 'Aprovações', icon: Users, description: 'Processos de aprovação' }
  ];

  const triggerOptions = [
    'Novo Lead Capturado',
    'Proposta Enviada',
    'Oportunidade Ganha',
    'Oportunidade Perdida',
    'Email Aberto',
    'Link Clicado',
    'Formulário Preenchido',
    'Data de Vencimento',
    'Mudança de Status',
    'Campo Atualizado'
  ];

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Por favor, insira um nome para o workflow');
      return;
    }

    if (!trigger) {
      toast.error('Por favor, selecione um trigger');
      return;
    }

    const newWorkflow: WorkflowData = {
      name: name.trim(),
      description: description.trim(),
      type,
      trigger,
      status
    };

    onSave(newWorkflow);
    handleClose();
    toast.success('Workflow criado com sucesso!');
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setType('email');
    setTrigger('');
    setStatus('draft');
    onClose();
  };

  const selectedTypeInfo = workflowTypes.find(t => t.value === type);
  const TypeIcon = selectedTypeInfo?.icon || Mail;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Novo Workflow de Automação</DialogTitle>
          <DialogDescription>
            Configure um novo workflow automático para aumentar a eficiência da sua equipa.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Workflow *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Boas-vindas para Novos Leads"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o que este workflow fará automaticamente..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Workflow *</Label>
              <Select value={type} onValueChange={(value: WorkflowData['type']) => setType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {workflowTypes.map((workflowType) => {
                    const Icon = workflowType.icon;
                    return (
                      <SelectItem key={workflowType.value} value={workflowType.value}>
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4" />
                          <div>
                            <p className="font-medium">{workflowType.label}</p>
                            <p className="text-xs text-gray-500">{workflowType.description}</p>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status Inicial</Label>
              <Select value={status} onValueChange={(value: WorkflowData['status']) => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Trigger (Gatilho) *</Label>
            <Select value={trigger} onValueChange={setTrigger}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o que irá disparar este workflow..." />
              </SelectTrigger>
              <SelectContent>
                {triggerOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preview do tipo selecionado */}
          <div className="p-4 bg-blue-50 rounded-lg border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TypeIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900">{selectedTypeInfo?.label}</h4>
                <p className="text-sm text-blue-700">{selectedTypeInfo?.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Criar Workflow
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
