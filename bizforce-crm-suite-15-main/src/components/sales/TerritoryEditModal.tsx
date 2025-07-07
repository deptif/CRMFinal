import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Map, Users, DollarSign, User } from 'lucide-react';
import { toast } from 'sonner';
import { useSupabaseUsers } from '@/hooks/useSupabaseUsers';
import type { Territory } from '@/types';

interface TerritoryEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (territoryData: Partial<Territory>) => void;
  territory: Territory | null;
}

export const TerritoryEditModal = ({ isOpen, onClose, onSave, territory }: TerritoryEditModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState('');
  const [managerId, setManagerId] = useState('');
  const [targetRevenue, setTargetRevenue] = useState('');
  const [actualRevenue, setActualRevenue] = useState('');
  const { users, isLoading } = useSupabaseUsers();

  useEffect(() => {
    if (territory) {
      setName(territory.name);
      setDescription(territory.description);
      setRegion(territory.region);
      setManagerId(territory.manager_id);
      setTargetRevenue(territory.target_revenue.toString());
      setActualRevenue(territory.actual_revenue.toString());
    }
  }, [territory]);

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Por favor, insira o nome do território');
      return;
    }

    if (!region.trim()) {
      toast.error('Por favor, insira a região');
      return;
    }

    if (!managerId) {
      toast.error('Por favor, selecione um gestor');
      return;
    }

    if (!targetRevenue || Number(targetRevenue) <= 0) {
      toast.error('Por favor, insira uma meta de receita válida');
      return;
    }

    const selectedManager = users.find(user => user.id === managerId);
    
    const territoryData: Partial<Territory> = {
      id: territory?.id,
      name: name.trim(),
      description: description.trim(),
      region: region.trim(),
      manager_id: managerId,
      manager_name: selectedManager?.name || '',
      members: territory?.members || [],
      target_revenue: Number(targetRevenue),
      actual_revenue: Number(actualRevenue) || 0
    };

    onSave(territoryData);
    handleClose();
    toast.success(`Território "${name}" atualizado com sucesso!`);
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setRegion('');
    setManagerId('');
    setTargetRevenue('');
    setActualRevenue('');
    onClose();
  };

  const selectedManager = users.find(user => user.id === managerId);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Map className="h-5 w-5 text-blue-600" />
            <span>Editar Território</span>
          </DialogTitle>
          <DialogDescription>
            Atualize as informações do território de vendas.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Território *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Norte, Sul, Centro..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição do território..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Região *</Label>
            <Input
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="Ex: Porto, Lisboa, Braga..."
            />
          </div>

          <div className="space-y-2">
            <Label>Gestor do Território *</Label>
            <Select value={managerId} onValueChange={setManagerId} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione um gestor..."} />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{user.name}</span>
                      <Badge variant="secondary" className="ml-2">
                        {user.role}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target">Meta de Receita (€) *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="target"
                  type="number"
                  value={targetRevenue}
                  onChange={(e) => setTargetRevenue(e.target.value)}
                  placeholder="150000"
                  className="pl-10"
                  min="0"
                  step="1000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="actual">Receita Atual (€)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="actual"
                  type="number"
                  value={actualRevenue}
                  onChange={(e) => setActualRevenue(e.target.value)}
                  placeholder="75000"
                  className="pl-10"
                  min="0"
                  step="1000"
                />
              </div>
            </div>
          </div>

          {selectedManager && targetRevenue && (
            <div className="p-4 bg-blue-50 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">Resumo do Território</h4>
                  <p className="text-sm text-blue-700">
                    {selectedManager.name} - {region}
                  </p>
                  <p className="text-lg font-bold text-blue-900">
                    Meta: €{Number(targetRevenue).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Map className="h-4 w-4 mr-2" />
            Atualizar Território
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};