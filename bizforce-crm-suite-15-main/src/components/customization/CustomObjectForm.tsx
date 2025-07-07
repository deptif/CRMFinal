
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CustomObject {
  id: string;
  name: string;
  label: string;
  pluralLabel: string;
  description: string;
  icon: string;
  isActive: boolean;
  recordCount: number;
  fields: number;
  created_at: Date;
}

interface FormData {
  name: string;
  label: string;
  pluralLabel: string;
  description: string;
  icon: string;
}

interface CustomObjectFormProps {
  editingObject: CustomObject | null;
  formData: FormData;
  setFormData: (data: FormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const CustomObjectForm = ({ 
  editingObject, 
  formData, 
  setFormData, 
  onSubmit, 
  onCancel 
}: CustomObjectFormProps) => {
  const iconOptions = [
    'database', 'folder', 'package', 'briefcase', 'calendar', 
    'users', 'settings', 'target', 'bookmark', 'star'
  ];

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>
          {editingObject ? 'Editar Objeto' : 'Criar Novo Objeto'}
        </DialogTitle>
        <DialogDescription>
          Configure as propriedades do objeto personalizado
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="label">Rótulo do Objeto</Label>
          <Input
            id="label"
            value={formData.label}
            onChange={(e) => setFormData({...formData, label: e.target.value})}
            placeholder="ex: Projeto"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="pluralLabel">Rótulo Plural</Label>
          <Input
            id="pluralLabel"
            value={formData.pluralLabel}
            onChange={(e) => setFormData({...formData, pluralLabel: e.target.value})}
            placeholder="ex: Projetos"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="name">Nome API</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="ex: project"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Ícone</Label>
          <div className="grid grid-cols-5 gap-2">
            {iconOptions.map((icon) => (
              <Button
                key={icon}
                variant={formData.icon === icon ? "default" : "outline"}
                size="sm"
                onClick={() => setFormData({...formData, icon})}
                className="h-10 w-10"
              >
                {icon}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="col-span-2 space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Descreva o propósito deste objeto..."
            rows={3}
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={onSubmit}>
          {editingObject ? 'Atualizar' : 'Criar'} Objeto
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
