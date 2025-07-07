
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Target, Users, DollarSign, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useSupabaseUsers } from '@/hooks/useSupabaseUsers';

interface QuotaData {
  user_id: string;
  user_name: string;
  period: string;
  quota_amount: number;
  current_amount?: number;
}

interface QuotaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (quota: QuotaData) => void;
}

export const QuotaModal = ({ isOpen, onClose, onSave }: QuotaModalProps) => {
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [quotaAmount, setQuotaAmount] = useState('');
  const { users, isLoading } = useSupabaseUsers();

  const periods = [
    { value: 'Q1 2025', label: 'Q1 2025 (Jan-Mar)' },
    { value: 'Q2 2025', label: 'Q2 2025 (Abr-Jun)' },
    { value: 'Q3 2025', label: 'Q3 2025 (Jul-Set)' },
    { value: 'Q4 2025', label: 'Q4 2025 (Out-Dez)' },
    { value: '2025', label: 'Ano Completo 2025' },
  ];

  const handleSave = () => {
    if (!selectedUser) {
      toast.error('Por favor, selecione um vendedor');
      return;
    }

    if (!selectedPeriod) {
      toast.error('Por favor, selecione um período');
      return;
    }

    if (!quotaAmount || Number(quotaAmount) <= 0) {
      toast.error('Por favor, insira um valor de quota válido');
      return;
    }

    const selectedUserData = users.find(user => user.id === selectedUser);
    
    const newQuota: QuotaData = {
      user_id: selectedUser,
      user_name: selectedUserData?.name || '',
      period: selectedPeriod,
      quota_amount: Number(quotaAmount),
      current_amount: 0
    };

    onSave(newQuota);
    handleClose();
    toast.success(`Quota de €${Number(quotaAmount).toLocaleString()} definida para ${selectedUserData?.name} no período ${selectedPeriod}`);
  };

  const handleClose = () => {
    setSelectedUser('');
    setSelectedPeriod('');
    setQuotaAmount('');
    onClose();
  };

  const selectedUserData = users.find(user => user.id === selectedUser);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span>Definir Nova Quota</span>
          </DialogTitle>
          <DialogDescription>
            Configure metas de vendas individuais para sua equipe por período.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Vendedor *</Label>
            <Select value={selectedUser} onValueChange={setSelectedUser} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione um vendedor..."} />
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

          <div className="space-y-2">
            <Label>Período *</Label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o período..." />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{period.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quota">Valor da Quota (€) *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="quota"
                type="number"
                value={quotaAmount}
                onChange={(e) => setQuotaAmount(e.target.value)}
                placeholder="Ex: 150000"
                className="pl-10"
                min="0"
                step="1000"
              />
            </div>
            <p className="text-xs text-gray-500">
              Insira o valor total da quota para o período selecionado
            </p>
          </div>

          {selectedUser && selectedPeriod && quotaAmount && (
            <div className="p-4 bg-blue-50 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">Resumo da Quota</h4>
                  <p className="text-sm text-blue-700">
                    {selectedUserData?.name} - {selectedPeriod}
                  </p>
                  <p className="text-lg font-bold text-blue-900">
                    €{Number(quotaAmount).toLocaleString()}
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
            <Target className="h-4 w-4 mr-2" />
            Definir Quota
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
