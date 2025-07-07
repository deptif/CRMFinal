
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
import { Label } from '@/components/ui/label';
import { 
  Calculator,
  Code,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface FormulaField {
  id: string;
  name: string;
  label: string;
  object: string;
  returnType: 'text' | 'number' | 'date' | 'boolean' | 'currency';
  formula: string;
  description: string;
  isValid: boolean;
  dependencies: string[];
  created_at: Date;
}

interface FormulaPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  field: FormulaField | null;
}

export const FormulaPreviewModal = ({ isOpen, onClose, field }: FormulaPreviewModalProps) => {
  if (!field) return null;

  const getReturnTypeIcon = (type: string) => {
    switch (type) {
      case 'number':
      case 'currency':
        return '123';
      case 'text':
        return 'ABC';
      case 'date':
        return '📅';
      case 'boolean':
        return '✓/✗';
      default:
        return '?';
    }
  };

  const simulateFormulaResult = () => {
    // Simulação de resultado baseado no tipo de retorno
    switch (field.returnType) {
      case 'number':
        return '42.5';
      case 'currency':
        return 'R$ 1,250.00';
      case 'text':
        return 'Resultado da Fórmula';
      case 'date':
        return new Date().toLocaleDateString('pt-BR');
      case 'boolean':
        return 'Verdadeiro';
      default:
        return 'N/A';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
              <Calculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <DialogTitle>Preview: {field.label}</DialogTitle>
              <DialogDescription>
                Visualização do campo de fórmula e seu resultado
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informações do Campo */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <Label className="font-medium">Nome da API:</Label>
              <p className="font-mono text-gray-600 dark:text-gray-400">{field.name}</p>
            </div>
            <div>
              <Label className="font-medium">Objeto:</Label>
              <p className="text-gray-600 dark:text-gray-400">{field.object}</p>
            </div>
            <div>
              <Label className="font-medium">Tipo de Retorno:</Label>
              <Badge variant="outline" className="ml-2">
                {getReturnTypeIcon(field.returnType)} {field.returnType}
              </Badge>
            </div>
          </div>

          {field.description && (
            <div>
              <Label className="font-medium">Descrição:</Label>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{field.description}</p>
            </div>
          )}

          {/* Fórmula */}
          <div>
            <Label className="font-medium flex items-center space-x-2">
              <Code className="h-4 w-4" />
              <span>Fórmula:</span>
            </Label>
            <Card className="mt-2">
              <CardContent className="p-3">
                <code className="text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                  {field.formula}
                </code>
              </CardContent>
            </Card>
          </div>

          {/* Status da Validação */}
          <div className="flex items-center space-x-2">
            {field.isValid ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <span className={`font-medium ${field.isValid ? 'text-green-600' : 'text-red-600'}`}>
              {field.isValid ? 'Fórmula Válida' : 'Erro na Fórmula'}
            </span>
          </div>

          {/* Preview do Resultado */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <Label className="font-medium">Preview do Campo no Formulário:</Label>
                
                <div className="space-y-2">
                  <Label htmlFor="formula-preview">{field.label}</Label>
                  <Input
                    id="formula-preview"
                    value={simulateFormulaResult()}
                    readOnly
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                  <p className="text-xs text-gray-500">
                    ⚡ Este campo é calculado automaticamente pela fórmula
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dependências */}
          {field.dependencies.length > 0 && (
            <div>
              <Label className="font-medium">Campos Dependentes:</Label>
              <div className="flex flex-wrap gap-1 mt-2">
                {field.dependencies.map((dep, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {dep}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Informações Adicionais */}
          <div className="text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <p><strong>Criado em:</strong> {field.created_at.toLocaleDateString('pt-BR')}</p>
            <p><strong>Última atualização:</strong> Simulação - {new Date().toLocaleString('pt-BR')}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
