import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Calculator, 
  Plus, 
  Trash2, 
  Eye, 
  CheckCircle,
  AlertCircle,
  Code,
  Edit
} from 'lucide-react';
import { toast } from 'sonner';
import { FormulaPreviewModal } from './FormulaPreviewModal';

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

export const FormulaFieldBuilder = () => {
  const [formulaFields, setFormulaFields] = useState<FormulaField[]>(() => {
    const saved = localStorage.getItem('formulaFields');
    return saved ? JSON.parse(saved) : [];
  });

  const [isBuilding, setIsBuilding] = useState(false);
  const [editingField, setEditingField] = useState<FormulaField | null>(null);
  const [previewField, setPreviewField] = useState<FormulaField | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    label: '',
    object: 'Opportunity',
    returnType: 'text' as FormulaField['returnType'],
    formula: '',
    description: ''
  });

  const objectTypes = ['Account', 'Contact', 'Opportunity', 'Lead', 'Case'];
  const returnTypes = [
    { value: 'text', label: 'Texto' },
    { value: 'number', label: 'Número' },
    { value: 'currency', label: 'Moeda' },
    { value: 'date', label: 'Data' },
    { value: 'boolean', label: 'Verdadeiro/Falso' }
  ];

  const formulaFunctions = [
    { name: 'TODAY()', description: 'Data atual' },
    { name: 'NOW()', description: 'Data e hora atual' },
    { name: 'IF(condition, true_value, false_value)', description: 'Condição lógica' },
    { name: 'SUM(field1, field2)', description: 'Soma de valores' },
    { name: 'MAX(field1, field2)', description: 'Valor máximo' },
    { name: 'MIN(field1, field2)', description: 'Valor mínimo' },
    { name: 'ROUND(number, decimals)', description: 'Arredondar número' },
    { name: 'TEXT(value)', description: 'Converter para texto' },
    { name: 'VALUE(text)', description: 'Converter para número' }
  ];

  const saveToStorage = (fields: FormulaField[]) => {
    localStorage.setItem('formulaFields', JSON.stringify(fields));
  };

  const validateFormula = (formula: string): boolean => {
    if (!formula.trim()) return false;
    const hasValidSyntax = formula.includes('(') === formula.includes(')');
    const hasValidFunctions = formulaFunctions.some(func => 
      formula.includes(func.name.split('(')[0])
    ) || !!formula.match(/[+\-*/]/);
    return hasValidSyntax && (hasValidFunctions || formula.includes('IF') || formula.includes('SUM'));
  };

  const extractDependencies = (formula: string): string[] => {
    const fieldPattern = /[A-Za-z][A-Za-z0-9_]*(?:__c)?/g;
    const matches = formula.match(fieldPattern) || [];
    return [...new Set(matches.filter(match => 
      !formulaFunctions.some(func => func.name.startsWith(match))
    ))];
  };

  const handleCreateFormula = () => {
    if (!formData.name || !formData.label || !formData.formula) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const isValid = validateFormula(formData.formula);
    const dependencies = extractDependencies(formData.formula);
    
    if (editingField) {
      const updatedFields = formulaFields.map(field =>
        field.id === editingField.id
          ? {
              ...field,
              name: formData.name.toLowerCase().replace(/\s+/g, '_'),
              label: formData.label,
              object: formData.object,
              returnType: formData.returnType,
              formula: formData.formula,
              description: formData.description,
              isValid,
              dependencies
            }
          : field
      );
      setFormulaFields(updatedFields);
      saveToStorage(updatedFields);
      toast.success('Campo de fórmula atualizado com sucesso!');
      setEditingField(null);
    } else {
      const newFormula: FormulaField = {
        id: crypto.randomUUID(),
        name: formData.name.toLowerCase().replace(/\s+/g, '_'),
        label: formData.label,
        object: formData.object,
        returnType: formData.returnType,
        formula: formData.formula,
        description: formData.description,
        isValid,
        dependencies,
        created_at: new Date()
      };

      const updatedFields = [...formulaFields, newFormula];
      setFormulaFields(updatedFields);
      saveToStorage(updatedFields);
      toast.success('Campo de fórmula criado com sucesso!');
    }

    resetForm();
  };

  const handleEditFormula = (field: FormulaField) => {
    setEditingField(field);
    setFormData({
      name: field.name,
      label: field.label,
      object: field.object,
      returnType: field.returnType,
      formula: field.formula,
      description: field.description
    });
    setIsBuilding(true);
  };

  const handleDeleteFormula = (fieldId: string) => {
    const updatedFields = formulaFields.filter(field => field.id !== fieldId);
    setFormulaFields(updatedFields);
    saveToStorage(updatedFields);
    toast.success('Campo de fórmula removido com sucesso!');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      label: '',
      object: 'Opportunity',
      returnType: 'text',
      formula: '',
      description: ''
    });
    setIsBuilding(false);
    setEditingField(null);
  };

  const insertFunction = (func: string) => {
    setFormData({
      ...formData,
      formula: formData.formula + func
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Formula Fields Builder</h2>
          <p className="text-gray-600 dark:text-gray-400">Crie campos calculados automaticamente usando fórmulas</p>
        </div>
        <Button onClick={() => setIsBuilding(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Fórmula
        </Button>
      </div>

      {isBuilding ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              {editingField ? 'Editar Fórmula' : 'Construtor de Fórmulas'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome do Campo</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="ex: total_with_discount"
                />
              </div>
              <div className="space-y-2">
                <Label>Rótulo</Label>
                <Input
                  value={formData.label}
                  onChange={(e) => setFormData({...formData, label: e.target.value})}
                  placeholder="ex: Total com Desconto"
                />
              </div>
              <div className="space-y-2">
                <Label>Objeto</Label>
                <Select value={formData.object} onValueChange={(value) => setFormData({...formData, object: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {objectTypes.map((object) => (
                      <SelectItem key={object} value={object}>{object}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tipo de Retorno</Label>
                <Select value={formData.returnType} onValueChange={(value: FormulaField['returnType']) => setFormData({...formData, returnType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {returnTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Fórmula</Label>
              <Textarea
                value={formData.formula}
                onChange={(e) => setFormData({...formData, formula: e.target.value})}
                placeholder="ex: Amount * (1 - Discount__c/100)"
                rows={4}
                className="font-mono"
              />
              <div className="flex items-center space-x-2 text-sm">
                {validateFormula(formData.formula) ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <span className={validateFormula(formData.formula) ? 'text-green-600' : 'text-red-600'}>
                  {validateFormula(formData.formula) ? 'Sintaxe válida' : 'Erro de sintaxe'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Funções Disponíveis</Label>
              <div className="grid grid-cols-3 gap-2">
                {formulaFunctions.map((func) => (
                  <Button
                    key={func.name}
                    variant="outline"
                    size="sm"
                    onClick={() => insertFunction(func.name)}
                    className="text-xs justify-start"
                    title={func.description}
                  >
                    {func.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descrição</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descreva o que esta fórmula calcula..."
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
              <Button onClick={handleCreateFormula}>
                {editingField ? 'Atualizar' : 'Criar'} Fórmula
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {formulaFields.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Calculator className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Nenhum campo de fórmula encontrado
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                  Crie campos calculados automaticamente usando fórmulas matemáticas e lógicas
                </p>
                <Button onClick={() => setIsBuilding(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Fórmula
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {formulaFields.map((field) => (
                <Card key={field.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                          <Calculator className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{field.label}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{field.name} • {field.object}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{field.returnType}</Badge>
                            <Badge variant={field.isValid ? "default" : "destructive"}>
                              {field.isValid ? 'Válida' : 'Erro'}
                            </Badge>
                            {field.dependencies.length > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {field.dependencies.length} dependências
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono">
                            {field.formula.length > 50 ? field.formula.substring(0, 50) + '...' : field.formula}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => setPreviewField(field)}
                          title="Visualizar Preview"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleEditFormula(field)}
                          title="Editar Fórmula"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleDeleteFormula(field.id)}
                          title="Excluir Fórmula"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      <FormulaPreviewModal
        isOpen={!!previewField}
        onClose={() => setPreviewField(null)}
        field={previewField}
      />
    </div>
  );
};
