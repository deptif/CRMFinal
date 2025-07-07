import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Database,
  Settings,
  Eye,
  Hash
} from 'lucide-react';
import { toast } from 'sonner';
import { PreviewMode } from './PreviewMode';
import { FieldPreviewModal } from './FieldPreviewModal';

interface CustomField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'phone' | 'url' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'date' | 'datetime' | 'currency';
  object: string;
  description: string;
  required: boolean;
  unique: boolean;
  defaultValue: string;
  options: string[];
  length: number;
  helpText: string;
  isActive: boolean;
  created_at: Date;
}

export const CustomFieldsManager = () => {
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<CustomField | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewField, setPreviewField] = useState<CustomField | null>(null);
  const [isFieldPreviewOpen, setIsFieldPreviewOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    label: '',
    type: 'text' as CustomField['type'],
    object: 'Account',
    description: '',
    required: false,
    unique: false,
    defaultValue: '',
    options: [''],
    length: 255,
    helpText: '',
    isActive: true
  });

  const objectTypes = ['Account', 'Contact', 'Opportunity', 'Lead', 'Case', 'Product', 'Quote'];
  const fieldTypes = [
    { value: 'text', label: 'Texto', icon: Hash },
    { value: 'number', label: 'Número', icon: Hash },
    { value: 'email', label: 'Email', icon: Hash },
    { value: 'phone', label: 'Telefone', icon: Hash },
    { value: 'url', label: 'URL', icon: Hash },
    { value: 'textarea', label: 'Área de Texto', icon: Hash },
    { value: 'select', label: 'Lista de Seleção', icon: Hash },
    { value: 'multiselect', label: 'Seleção Múltipla', icon: Hash },
    { value: 'checkbox', label: 'Checkbox', icon: Hash },
    { value: 'date', label: 'Data', icon: Hash },
    { value: 'datetime', label: 'Data e Hora', icon: Hash },
    { value: 'currency', label: 'Moeda', icon: Hash }
  ];

  const handleSubmit = () => {
    if (!formData.name || !formData.label) {
      toast.error('Nome e rótulo são obrigatórios');
      return;
    }

    const newField: CustomField = {
      id: editingField?.id || Date.now().toString(),
      name: formData.name.toLowerCase().replace(/\s+/g, '_') + '__c',
      label: formData.label,
      type: formData.type,
      object: formData.object,
      description: formData.description,
      required: formData.required,
      unique: formData.unique,
      defaultValue: formData.defaultValue,
      options: formData.options.filter(opt => opt.trim() !== ''),
      length: formData.length,
      helpText: formData.helpText,
      isActive: formData.isActive,
      created_at: editingField?.created_at || new Date()
    };

    if (editingField) {
      setCustomFields(fields => fields.map(f => f.id === editingField.id ? newField : f));
      toast.success('Campo personalizado atualizado com sucesso!');
    } else {
      setCustomFields(fields => [...fields, newField]);
      toast.success('Campo personalizado criado com sucesso!');
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      label: '',
      type: 'text',
      object: 'Account',
      description: '',
      required: false,
      unique: false,
      defaultValue: '',
      options: [''],
      length: 255,
      helpText: '',
      isActive: true
    });
    setEditingField(null);
  };

  const handleEdit = (field: CustomField) => {
    setEditingField(field);
    setFormData({
      name: field.name.replace('__c', ''),
      label: field.label,
      type: field.type,
      object: field.object,
      description: field.description,
      required: field.required,
      unique: field.unique,
      defaultValue: field.defaultValue,
      options: field.options.length > 0 ? field.options : [''],
      length: field.length,
      helpText: field.helpText,
      isActive: field.isActive
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (fieldId: string) => {
    setCustomFields(fields => fields.filter(f => f.id !== fieldId));
    toast.success('Campo personalizado removido com sucesso!');
  };

  const handlePreviewField = (field: CustomField) => {
    setPreviewField(field);
    setIsFieldPreviewOpen(true);
  };

  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, '']
    });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({
      ...formData,
      options: newOptions
    });
  };

  const removeOption = (index: number) => {
    setFormData({
      ...formData,
      options: formData.options.filter((_, i) => i !== index)
    });
  };

  const needsOptions = formData.type === 'select' || formData.type === 'multiselect';

  return (
    <div className="space-y-6">
      <PreviewMode 
        isActive={isPreviewMode} 
        onToggle={togglePreviewMode} 
        customFields={customFields}
      />
      
      <FieldPreviewModal
        isOpen={isFieldPreviewOpen}
        onClose={() => setIsFieldPreviewOpen(false)}
        field={previewField}
      />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Campos Personalizados</h2>
          <p className="text-gray-600 dark:text-gray-400">Crie campos específicos para suas necessidades de negócio</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={togglePreviewMode}>
            <Eye className="h-4 w-4 mr-2" />
            Preview Mode
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Campo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingField ? 'Editar Campo Personalizado' : 'Criar Campo Personalizado'}
                </DialogTitle>
                <DialogDescription>
                  Configure as propriedades do campo personalizado
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="label">Rótulo do Campo *</Label>
                  <Input
                    id="label"
                    value={formData.label}
                    onChange={(e) => setFormData({...formData, label: e.target.value})}
                    placeholder="ex: Data de Contrato"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da API *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="ex: contract_date"
                  />
                  <p className="text-xs text-gray-500">Será convertido para: {formData.name.toLowerCase().replace(/\s+/g, '_')}__c</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Tipo de Campo</Label>
                  <Select value={formData.type} onValueChange={(value: CustomField['type']) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center">
                            <type.icon className="h-4 w-4 mr-2" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Objeto</Label>
                  <Select value={formData.object} onValueChange={(value) => setFormData({...formData, object: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {objectTypes.map((object) => (
                        <SelectItem key={object} value={object}>
                          {object}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-2 space-y-2">
                  <Label>Descrição</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Descreva o propósito deste campo..."
                    rows={2}
                  />
                </div>
                
                {needsOptions && (
                  <div className="col-span-2 space-y-2">
                    <Label>Opções da Lista</Label>
                    <div className="space-y-2">
                      {formData.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={option}
                            onChange={(e) => updateOption(index, e.target.value)}
                            placeholder={`Opção ${index + 1}`}
                          />
                          {formData.options.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeOption(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addOption}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Opção
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label>Valor Padrão</Label>
                  <Input
                    value={formData.defaultValue}
                    onChange={(e) => setFormData({...formData, defaultValue: e.target.value})}
                    placeholder="Valor padrão (opcional)"
                  />
                </div>
                
                {(formData.type === 'text' || formData.type === 'textarea') && (
                  <div className="space-y-2">
                    <Label>Tamanho Máximo</Label>
                    <Input
                      type="number"
                      min="1"
                      max="32000"
                      value={formData.length}
                      onChange={(e) => setFormData({...formData, length: parseInt(e.target.value) || 255})}
                    />
                  </div>
                )}
                
                <div className="col-span-2 space-y-2">
                  <Label>Texto de Ajuda</Label>
                  <Input
                    value={formData.helpText}
                    onChange={(e) => setFormData({...formData, helpText: e.target.value})}
                    placeholder="Texto que aparecerá como dica para o usuário"
                  />
                </div>
                
                <div className="col-span-2 flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.required}
                        onCheckedChange={(checked) => setFormData({...formData, required: checked})}
                      />
                      <Label>Campo Obrigatório</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.unique}
                        onCheckedChange={(checked) => setFormData({...formData, unique: checked})}
                      />
                      <Label>Valor Único</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                      />
                      <Label>Campo Ativo</Label>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit}>
                  {editingField ? 'Atualizar' : 'Criar'} Campo
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {customFields.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Database className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhum campo personalizado encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              Crie campos personalizados para capturar informações específicas do seu negócio
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Campo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customFields.map((field) => (
            <Card key={field.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{field.label}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{field.object}</p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <Badge variant="outline" className="text-xs">
                      {fieldTypes.find(t => t.value === field.type)?.label}
                    </Badge>
                    {field.required && (
                      <Badge variant="destructive" className="text-xs">Obrigatório</Badge>
                    )}
                    {field.unique && (
                      <Badge variant="secondary" className="text-xs">Único</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="text-sm">
                  <p className="font-medium text-gray-900 dark:text-gray-100">Nome da API:</p>
                  <p className="font-mono text-gray-600 dark:text-gray-400">{field.name}</p>
                </div>
                
                {field.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {field.description}
                  </p>
                )}
                
                {field.options.length > 0 && (
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">Opções:</p>
                    <div className="flex flex-wrap gap-1">
                      {field.options.slice(0, 3).map((option, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {option}
                        </Badge>
                      ))}
                      {field.options.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{field.options.length - 3} mais
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="flex items-center space-x-2">
                    <Badge variant={field.isActive ? "default" : "secondary"} className="text-xs">
                      {field.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost" onClick={() => handlePreviewField(field)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(field)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(field.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Criado em {field.created_at.toLocaleDateString('pt-BR')}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
