
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Map, Target, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useSupabaseUsers } from '@/hooks/useSupabaseUsers';

interface TerritoryData {
  name: string;
  description: string;
  region: string;
  manager_id: string;
  manager_name: string;
  members: string[];
  target_revenue: number;
  actual_revenue: number;
}

interface TerritoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (territory: TerritoryData) => void;
}

export const TerritoryModal = ({ isOpen, onClose, onSave }: TerritoryModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    region: '',
    manager_id: '',
    target_revenue: ''
  });
  const { users, isLoading } = useSupabaseUsers();

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error('Por favor, insira o nome do território');
      return;
    }

    if (!formData.region.trim()) {
      toast.error('Por favor, insira a região');
      return;
    }

    if (!formData.manager_id) {
      toast.error('Por favor, selecione um gestor');
      return;
    }

    if (!formData.target_revenue || Number(formData.target_revenue) <= 0) {
      toast.error('Por favor, insira uma meta de receita válida');
      return;
    }

    const selectedManager = users.find(user => user.id === formData.manager_id);
    
    const territoryData: TerritoryData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      region: formData.region.trim(),
      manager_id: formData.manager_id,
      manager_name: selectedManager?.name || '',
      members: [],
      target_revenue: Number(formData.target_revenue),
      actual_revenue: 0
    };

    onSave(territoryData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      region: '',
      manager_id: '',
      target_revenue: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Map className="h-5 w-5 text-blue-600" />
            <span>Novo Território</span>
          </DialogTitle>
          <DialogDescription>
            Crie um novo território de vendas e defina suas configurações.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Território *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Norte de Portugal"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Região *</Label>
            <Input
              id="region"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              placeholder="Ex: Porto, Braga, Viana do Castelo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição do território..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Gestor do Território *</Label>
            <Select 
              value={formData.manager_id} 
              onValueChange={(value) => setFormData({ ...formData, manager_id: value })}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione um gestor..."} />
              </SelectTrigger>
              <SelectContent>
                {users.filter(user => user.role === 'manager' || user.role === 'admin').map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>{user.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target">Meta de Receita (€) *</Label>
            <div className="relative">
              <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="target"
                type="number"
                value={formData.target_revenue}
                onChange={(e) => setFormData({ ...formData, target_revenue: e.target.value })}
                placeholder="Ex: 500000"
                className="pl-10"
                min="0"
                step="1000"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Map className="h-4 w-4 mr-2" />
            Criar Território
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
