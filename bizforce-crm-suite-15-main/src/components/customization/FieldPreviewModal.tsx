
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Database, 
  Calendar, 
  Type, 
  Hash, 
  Mail, 
  Phone, 
  Link, 
  AlignLeft, 
  List, 
  CheckSquare, 
  DollarSign,
  Clock
} from 'lucide-react';

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

interface FieldPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  field: CustomField | null;
}

export const FieldPreviewModal = ({ isOpen, onClose, field }: FieldPreviewModalProps) => {
  if (!field) return null;

  const getFieldIcon = (type: string) => {
    switch (type) {
      case 'text': return Type;
      case 'number': return Hash;
      case 'email': return Mail;
      case 'phone': return Phone;
      case 'url': return Link;
      case 'textarea': return AlignLeft;
      case 'select': return List;
      case 'multiselect': return List;
      case 'checkbox': return CheckSquare;
      case 'date': return Calendar;
      case 'datetime': return Clock;
      case 'currency': return DollarSign;
      default: return Database;
    }
  };

  const renderFieldPreview = () => {
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

  const FieldIcon = getFieldIcon(field.type);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FieldIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <DialogTitle>Preview: {field.label}</DialogTitle>
              <DialogDescription>
                Visualização do campo personalizado em ação
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informações do Campo */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="font-medium">Nome da API:</Label>
              <p className="font-mono text-gray-600 dark:text-gray-400">{field.name}</p>
            </div>
            <div>
              <Label className="font-medium">Objeto:</Label>
              <p className="text-gray-600 dark:text-gray-400">{field.object}</p>
            </div>
            <div>
              <Label className="font-medium">Tipo:</Label>
              <Badge variant="outline">{field.type}</Badge>
            </div>
            <div>
              <Label className="font-medium">Status:</Label>
              <Badge variant={field.isActive ? "default" : "secondary"}>
                {field.isActive ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
          </div>

          {field.description && (
            <div>
              <Label className="font-medium">Descrição:</Label>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{field.description}</p>
            </div>
          )}

          {/* Preview do Campo */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Label htmlFor={field.name} className="font-medium">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {field.unique && (
                    <Badge variant="outline" className="text-xs">Único</Badge>
                  )}
                </div>
                
                {renderFieldPreview()}
                
                {field.helpText && (
                  <p className="text-xs text-gray-500">{field.helpText}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Propriedades Adicionais */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Badge variant={field.required ? "destructive" : "outline"} className="text-xs">
                {field.required ? 'Obrigatório' : 'Opcional'}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={field.unique ? "secondary" : "outline"} className="text-xs">
                {field.unique ? 'Valor Único' : 'Valor Comum'}
              </Badge>
            </div>
            {(field.type === 'text' || field.type === 'textarea') && (
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  Max: {field.length} chars
                </Badge>
              </div>
            )}
          </div>

          {field.options.length > 0 && (
            <div>
              <Label className="font-medium">Opções Disponíveis:</Label>
              <div className="flex flex-wrap gap-1 mt-2">
                {field.options.map((option, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {option}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
