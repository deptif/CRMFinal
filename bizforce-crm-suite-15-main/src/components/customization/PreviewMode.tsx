
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

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

interface PreviewModeProps {
  isActive: boolean;
  onToggle: () => void;
  customFields: CustomField[];
}

export const PreviewMode = ({ isActive, onToggle, customFields }: PreviewModeProps) => {
  const [selectedObject, setSelectedObject] = useState('Account');
  const objectTypes = ['Account', 'Contact', 'Opportunity', 'Lead', 'Case', 'Product', 'Quote'];

  const filteredFields = customFields.filter(field => 
    field.object === selectedObject && field.isActive
  );

  const renderFieldPreview = (field: CustomField) => {
    const baseProps = {
      id: field.name,
      placeholder: field.helpText || `Digite ${field.label.toLowerCase()}...`,
      defaultValue: field.defaultValue,
      className: "w-full"
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'url':
        return <Input {...baseProps} type={field.type === 'text' ? 'text' : field.type} />;
      
      case 'number':
      case 'currency':
        return <Input {...baseProps} type="number" />;
      
      case 'textarea':
        return <Textarea {...baseProps} rows={3} />;
      
      case 'select':
        return (
          <Select defaultValue={field.defaultValue}>
            <SelectTrigger>
              <SelectValue placeholder={`Selecione ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'multiselect':
        return (
          <div className="space-y-2">
            {field.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox id={`${field.name}_${index}`} />
                <Label htmlFor={`${field.name}_${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Switch defaultChecked={field.defaultValue === 'true'} />
            <Label>{field.label}</Label>
          </div>
        );
      
      case 'date':
        return <Input {...baseProps} type="date" />;
      
      case 'datetime':
        return <Input {...baseProps} type="datetime-local" />;
      
      default:
        return <Input {...baseProps} />;
    }
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-gray-50 dark:bg-gray-900 z-50 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button onClick={onToggle} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Editor
            </Button>
            <Badge variant="secondary" className="px-3 py-1">
              <Eye className="h-4 w-4 mr-2" />
              Modo Preview
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <Label>Objeto:</Label>
            <Select value={selectedObject} onValueChange={setSelectedObject}>
              <SelectTrigger className="w-40">
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
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Preview - Formulário {selectedObject}</CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              Visualização dos campos personalizados em um formulário real
            </p>
          </CardHeader>
          <CardContent>
            {filteredFields.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <EyeOff className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum campo personalizado ativo para {selectedObject}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredFields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={field.name} className="font-medium">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      {field.unique && (
                        <Badge variant="outline" className="text-xs">Único</Badge>
                      )}
                    </div>
                    
                    {renderFieldPreview(field)}
                    
                    {field.helpText && (
                      <p className="text-xs text-gray-500">{field.helpText}</p>
                    )}
                    
                    {field.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                        {field.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
