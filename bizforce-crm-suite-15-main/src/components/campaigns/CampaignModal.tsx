
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Megaphone, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import type { Campaign } from '@/types';

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (campaign: Omit<Campaign, 'id' | 'created_at' | 'owner_id' | 'owner_name'>) => void;
  campaign?: Campaign | null;
}

export const CampaignModal = ({ isOpen, onClose, onSave, campaign }: CampaignModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'email' as Campaign['type'],
    status: 'planning' as Campaign['status'],
    budget: '',
    start_date: '',
    end_date: '',
    leads_generated: '',
    conversion_rate: '',
    roi: ''
  });

  useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name,
        type: campaign.type,
        status: campaign.status,
        budget: campaign.budget.toString(),
        start_date: campaign.start_date.toISOString().split('T')[0],
        end_date: campaign.end_date.toISOString().split('T')[0],
        leads_generated: campaign.leads_generated.toString(),
        conversion_rate: campaign.conversion_rate.toString(),
        roi: campaign.roi.toString()
      });
    } else {
      setFormData({
        name: '',
        type: 'email',
        status: 'planning',
        budget: '',
        start_date: '',
        end_date: '',
        leads_generated: '0',
        conversion_rate: '0',
        roi: '0'
      });
    }
  }, [campaign, isOpen]);

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error('Por favor, insira o nome da campanha');
      return;
    }

    if (!formData.budget || Number(formData.budget) < 0) {
      toast.error('Por favor, insira um orçamento válido');
      return;
    }

    if (!formData.start_date || !formData.end_date) {
      toast.error('Por favor, defina as datas de início e fim');
      return;
    }

    if (new Date(formData.start_date) >= new Date(formData.end_date)) {
      toast.error('A data de início deve ser anterior à data de fim');
      return;
    }

    const campaignData = {
      name: formData.name.trim(),
      type: formData.type,
      status: formData.status,
      budget: Number(formData.budget),
      start_date: new Date(formData.start_date),
      end_date: new Date(formData.end_date),
      leads_generated: Number(formData.leads_generated) || 0,
      conversion_rate: Number(formData.conversion_rate) || 0,
      roi: Number(formData.roi) || 0
    };

    onSave(campaignData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      type: 'email',
      status: 'planning',
      budget: '',
      start_date: '',
      end_date: '',
      leads_generated: '0',
      conversion_rate: '0',
      roi: '0'
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Megaphone className="h-5 w-5 text-blue-600" />
            <span>{campaign ? 'Editar Campanha' : 'Nova Campanha'}</span>
          </DialogTitle>
          <DialogDescription>
            {campaign ? 'Edite as informações da campanha.' : 'Crie uma nova campanha de marketing.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Campanha *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Campanha de Verão 2025"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo *</Label>
              <Select value={formData.type} onValueChange={(value: Campaign['type']) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="webinar">Webinar</SelectItem>
                  <SelectItem value="event">Evento</SelectItem>
                  <SelectItem value="direct_mail">Mala Direta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status *</Label>
              <Select value={formData.status} onValueChange={(value: Campaign['status']) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planejando</SelectItem>
                  <SelectItem value="active">Ativa</SelectItem>
                  <SelectItem value="paused">Pausada</SelectItem>
                  <SelectItem value="completed">Concluída</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Orçamento (€) *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="budget"
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="Ex: 10000"
                className="pl-10"
                min="0"
                step="100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Data de Início *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">Data de Fim *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="leads">Leads Gerados</Label>
              <Input
                id="leads"
                type="number"
                value={formData.leads_generated}
                onChange={(e) => setFormData({ ...formData, leads_generated: e.target.value })}
                placeholder="0"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="conversion">Conversão (%)</Label>
              <div className="relative">
                <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="conversion"
                  type="number"
                  value={formData.conversion_rate}
                  onChange={(e) => setFormData({ ...formData, conversion_rate: e.target.value })}
                  placeholder="0"
                  className="pl-10"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roi">ROI (%)</Label>
              <div className="relative">
                <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="roi"
                  type="number"
                  value={formData.roi}
                  onChange={(e) => setFormData({ ...formData, roi: e.target.value })}
                  placeholder="0"
                  className="pl-10"
                  step="0.1"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Megaphone className="h-4 w-4 mr-2" />
            {campaign ? 'Atualizar' : 'Criar'} Campanha
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
