
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface TerritoryData {
  name: string;
  description: string;
  region: string;
  manager_name: string;
  target_revenue: number;
}

interface TerritoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (territory: TerritoryData) => void;
}

export const TerritoryModal = ({ isOpen, onClose, onSave }: TerritoryModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState('');
  const [managerName, setManagerName] = useState('');
  const [targetRevenue, setTargetRevenue] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Por favor, insira um nome para o território');
      return;
    }

    if (!region.trim()) {
      toast.error('Por favor, insira uma região');
      return;
    }

    if (!managerName.trim()) {
      toast.error('Por favor, insira o nome do gestor');
      return;
    }

    const newTerritory: TerritoryData = {
      name: name.trim(),
      description: description.trim(),
      region: region.trim(),
      manager_name: managerName.trim(),
      target_revenue: Number(targetRevenue) || 0
    };

    onSave(newTerritory);
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setRegion('');
    setManagerName('');
    setTargetRevenue('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Território</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Território *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Norte de Portugal"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Região *</Label>
            <Input
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="Ex: Norte"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="manager">Gestor Responsável *</Label>
            <Input
              id="manager"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              placeholder="Nome do gestor"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target">Meta de Receita (€)</Label>
            <Input
              id="target"
              type="number"
              value={targetRevenue}
              onChange={(e) => setTargetRevenue(e.target.value)}
              placeholder="500000"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição do território"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Criar Território
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
