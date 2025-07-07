
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface LayoutSection {
  id: string;
  name: string;
  type: 'section' | 'field' | 'related_list';
  columns: number;
  fields: string[];
  collapsed?: boolean;
}

interface EditSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: LayoutSection | null;
  onSave: (section: LayoutSection) => void;
  availableFields: string[];
}

export const EditSectionModal = ({ 
  isOpen, 
  onClose, 
  section, 
  onSave, 
  availableFields 
}: EditSectionModalProps) => {
  const [formData, setFormData] = useState({
    name: section?.name || '',
    type: section?.type || 'section',
    columns: section?.columns || 2,
    fields: section?.fields || [],
    collapsed: section?.collapsed || false
  });

  const handleSave = () => {
    if (!section) return;
    
    const updatedSection: LayoutSection = {
      ...section,
      name: formData.name,
      type: formData.type as 'section' | 'field' | 'related_list',
      columns: formData.columns,
      fields: formData.fields,
      collapsed: formData.collapsed
    };
    
    onSave(updatedSection);
    onClose();
  };

  const handleFieldToggle = (field: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      fields: checked 
        ? [...prev.fields, field]
        : prev.fields.filter(f => f !== field)
    }));
  };

  if (!section) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Seção</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="section-name">Nome da Seção</Label>
            <Input
              id="section-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
