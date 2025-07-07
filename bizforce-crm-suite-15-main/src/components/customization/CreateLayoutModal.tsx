
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus } from 'lucide-react';

interface CreateLayoutModalProps {
  selectedObject: string;
  onCreateLayout: (layoutData: {
    name: string;
    object: string;
    sections: any[];
    isDefault: boolean;
  }) => Promise<void>;
}

export const CreateLayoutModal = ({ selectedObject, onCreateLayout }: CreateLayoutModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    isDefault: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return;
    }

    try {
      // Criar layout com seções padrão
      const defaultSections = [
        {
          id: crypto.randomUUID(),
          name: 'Informações Básicas',
          type: 'section' as const,
          columns: 2,
          fields: ['name', 'email', 'phone']
        },
        {
          id: crypto.randomUUID(),
          name: 'Detalhes Adicionais',
          type: 'section' as const,
          columns: 1,
          fields: ['description']
        }
      ];

      await onCreateLayout({
        name: formData.name,
        object: selectedObject,
        sections: defaultSections,
        isDefault: formData.isDefault
      });

      setFormData({ name: '', isDefault: false });
      setIsOpen(false);
    } catch (error) {
      console.error('Erro ao criar layout:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Novo Layout
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Novo Layout</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Layout</Label>
            <Input
              id="name"
              placeholder="Ex: Layout Padrão"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Objeto</Label>
            <Input
              value={selectedObject}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is-default"
              checked={formData.isDefault}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isDefault: checked }))}
            />
            <Label htmlFor="is-default">Layout Padrão</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Criar Layout
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
