
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus } from 'lucide-react';

interface LayoutSection {
  id: string;
  name: string;
  type: 'section' | 'field' | 'related_list';
  columns: number;
  fields: string[];
  collapsed?: boolean;
}

interface AddSectionModalProps {
  onAddSection: (section: LayoutSection) => void;
  availableFields: string[];
}

export const AddSectionModal = ({ onAddSection, availableFields }: AddSectionModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'section' as 'section' | 'field' | 'related_list',
    columns: 2,
    fields: [] as string[],
    collapsed: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    const newSection: LayoutSection = {
      id: crypto.randomUUID(),
      name: formData.name,
      type: formData.type,
      columns: formData.columns,
      fields: formData.fields,
      collapsed: formData.collapsed
    };

    onAddSection(newSection);
    setFormData({
      name: '',
      type: 'section',
      columns: 2,
      fields: [],
      collapsed: false
    });
    setIsOpen(false);
  };

  const handleFieldToggle = (field: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      fields: checked 
        ? [...prev.fields, field]
        : prev.fields.filter(f => f !== field)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Seção
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Seção</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="section-name">Nome da Seção</Label>
            <Input
              id="section-name"
              placeholder="Ex: Informações de Contato"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="section">Seção</SelectItem>
                <SelectItem value="field">Campo</SelectItem>
                <SelectItem value="related_list">Lista Relacionada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Colunas</Label>
            <Select 
              value={formData.columns.toString()} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, columns: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Coluna</SelectItem>
                <SelectItem value="2">2 Colunas</SelectItem>
                <SelectItem value="3">3 Colunas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Campos</Label>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {availableFields.map((field) => (
                <div key={field} className="flex items-center space-x-2">
                  <Checkbox
                    id={field}
                    checked={formData.fields.includes(field)}
                    onCheckedChange={(checked) => handleFieldToggle(field, checked as boolean)}
                  />
                  <Label htmlFor={field} className="text-sm">{field}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Adicionar Seção
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
