
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, MessageSquare, Users, Linkedin, Phone, Target } from 'lucide-react';
import { toast } from 'sonner';

interface MultiChannelCampaignData {
  name: string;
  description: string;
  target_audience: string;
  channels: string[];
  status: 'draft' | 'active' | 'paused';
}

interface MultiChannelCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (campaign: MultiChannelCampaignData) => void;
}

export const MultiChannelCampaignModal = ({ isOpen, onClose, onSave }: MultiChannelCampaignModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [status, setStatus] = useState<MultiChannelCampaignData['status']>('draft');

  const availableChannels = [
    { id: 'email', name: 'Email', icon: Mail, description: 'Campanhas de email marketing' },
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageSquare, description: 'Mensagens via WhatsApp' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, description: 'Outreach via LinkedIn' },
    { id: 'sms', name: 'SMS', icon: Phone, description: 'Mensagens de texto' }
  ];

  const handleChannelChange = (channelId: string, checked: boolean) => {
    if (checked) {
      setSelectedChannels([...selectedChannels, channelId]);
    } else {
      setSelectedChannels(selectedChannels.filter(id => id !== channelId));
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Por favor, insira um nome para a campanha');
      return;
    }

    if (selectedChannels.length === 0) {
      toast.error('Por favor, selecione pelo menos um canal');
      return;
    }

    if (!targetAudience.trim()) {
      toast.error('Por favor, defina o público-alvo');
      return;
    }

    const newCampaign: MultiChannelCampaignData = {
      name: name.trim(),
      description: description.trim(),
      target_audience: targetAudience.trim(),
      channels: selectedChannels,
      status
    };

    onSave(newCampaign);
    handleClose();
    toast.success('Campanha multi-canal criada com sucesso!');
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setTargetAudience('');
    setSelectedChannels([]);
    setStatus('draft');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Nova Campanha Multi-Canal</DialogTitle>
          <DialogDescription>
            Configure uma nova campanha que será executada em múltiplos canais simultaneamente.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Campanha *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Campanha Tech Leads Q1 2024"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva os objetivos e estratégia desta campanha..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target">Público-Alvo *</Label>
            <Input
              id="target"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Ex: CTOs e Diretores de TI em empresas de 50-500 funcionários"
            />
          </div>

          <div className="space-y-4">
            <Label>Canais de Comunicação * (selecione pelo menos um)</Label>
            <div className="grid grid-cols-2 gap-4">
              {availableChannels.map((channel) => {
                const Icon = channel.icon;
                const isSelected = selectedChannels.includes(channel.id);
                
                return (
                  <div
                    key={channel.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleChannelChange(channel.id, !isSelected)}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => handleChannelChange(channel.id, !!checked)}
                      />
                      <div className="flex items-center space-x-2">
                        <Icon className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">{channel.name}</p>
                          <p className="text-xs text-gray-500">{channel.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Status Inicial</Label>
            <Select value={status} onValueChange={(value: MultiChannelCampaignData['status']) => setStatus(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="paused">Pausado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Preview dos canais selecionados */}
          {selectedChannels.length > 0 && (
            <div className="p-4 bg-blue-50 rounded-lg border">
              <div className="flex items-center space-x-2 mb-3">
                <Target className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium text-blue-900">Canais Selecionados</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedChannels.map((channelId) => {
                  const channel = availableChannels.find(c => c.id === channelId);
                  const Icon = channel?.icon || Mail;
                  return (
                    <Badge key={channelId} className="bg-blue-100 text-blue-800">
                      <Icon className="h-3 w-3 mr-1" />
                      {channel?.name}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Criar Campanha
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
