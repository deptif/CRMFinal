import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Save,
  TestTube,
  GitBranch,
  Eye,
  Settings,
  BookOpen,
  Zap
} from 'lucide-react';
import { FormulaEditor } from './FormulaEditor';
import { FormulaTestRunner } from './FormulaTestRunner';
import { FormulaVersionControl } from './FormulaVersionControl';
import { FormulaPreviewModal } from '../FormulaPreviewModal';
import { toast } from 'sonner';

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
  isActive: boolean;
  category: 'business' | 'calculation' | 'automation' | 'validation';
  complexity: 'simple' | 'medium' | 'advanced';
  performance: {
    estimatedExecutionTime: number;
    memoryUsage: 'low' | 'medium' | 'high';
    cacheEnabled: boolean;
  };
}

export const EnhancedFormulaBuilder = () => {
  const [formulaFields, setFormulaFields] = useState<FormulaField[]>(() => {
    const saved = localStorage.getItem('enhanced_formula_fields');
    return saved ? JSON.parse(saved) : [];
  });

  const [isBuilding, setIsBuilding] = useState(false);
  const [editingField, setEditingField] = useState<FormulaField | null>(null);
  const [previewField, setPreviewField] = useState<FormulaField | null>(null);
  const [activeTab, setActiveTab] = useState('editor');
  
  const [formData, setFormData] = useState({
    name: '',
    label: '',
    object: 'Opportunity',
    returnType: 'text' as FormulaField['returnType'],
    formula: '',
    description: '',
    category: 'business' as FormulaField['category'],
    complexity: 'simple' as FormulaField['complexity'],
    cacheEnabled: true
  });

  const [isFormulaValid, setIsFormulaValid] = useState(false);
  const [formulaErrors, setFormulaErrors] = useState<string[]>([]);

  const objectTypes = ['Account', 'Contact', 'Opportunity', 'Lead', 'Case', 'Product', 'Quote'];
  const returnTypes = [
    { value: 'text', label: 'Texto', icon: '📝' },
    { value: 'number', label: 'Número', icon: '🔢' },
    { value: 'currency', label: 'Moeda', icon: '💰' },
    { value: 'date', label: 'Data', icon: '📅' },
    { value: 'boolean', label: 'Verdadeiro/Falso', icon: '✅' }
  ];

  const categories = [
    { value: 'business', label: 'Regras de Negócio', color: 'bg-blue-100 text-blue-800' },
    { value: 'calculation', label: 'Cálculos', color: 'bg-green-100 text-green-800' },
    { value: 'automation', label: 'Automação', color: 'bg-purple-100 text-purple-800' },
    { value: 'validation', label: 'Validação', color: 'bg-orange-100 text-orange-800' }
  ];

  const availableFields = [
    { name: 'Amount', type: 'currency', label: 'Valor' },
    { name: 'Probability', type: 'number', label: 'Probabilidade' },
    { name: 'Stage', type: 'text', label: 'Estágio' },
    { name: 'CloseDate', type: 'date', label: 'Data de Fechamento' },
    { name: 'CreatedDate', type: 'date', label: 'Data de Criação' },
    { name: 'Type', type: 'text', label: 'Tipo' },
    { name: 'LeadSource', type: 'text', label: 'Fonte do Lead' },
    { name: 'IsClosed', type: 'boolean', label: 'Está Fechado' },
    { name: 'IsWon', type: 'boolean', label: 'Foi Ganho' }
  ];

  const saveToStorage = (fields: FormulaField[]) => {
    localStorage.setItem('enhanced_formula_fields', JSON.stringify(fields));
  };

  const estimatePerformance = (formula: string, complexity: string): { executionTime: number; memoryUsage: 'low' | 'medium' | 'high' } => {
    let executionTime = 10; // Base time in ms
    
    // Increase time based on complexity
    if (complexity === 'medium') executionTime *= 2;
    if (complexity === 'advanced') executionTime *= 5;
    
    // Increase time based on formula characteristics
    const functionCount = (formula.match(/[A-Z_]+\(/g) || []).length;
    executionTime += functionCount * 5;
    
    const memoryUsage: 'low' | 'medium' | 'high' = functionCount > 5 ? 'high' : functionCount > 2 ? 'medium' : 'low';
    
    return { executionTime, memoryUsage };
  };

  const handleCreateFormula = () => {
    if (!formData.name || !formData.label || !formData.formula) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (!isFormulaValid) {
      toast.error('Corrija os erros na fórmula antes de salvar');
      return;
    }

    const performance = estimatePerformance(formData.formula, formData.complexity);
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
              category: formData.category,
              complexity: formData.complexity,
              isValid: isFormulaValid,
              dependencies,
              performance: {
                estimatedExecutionTime: performance.executionTime,
                memoryUsage: performance.memoryUsage,
                cacheEnabled: formData.cacheEnabled
              }
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
        category: formData.category,
        complexity: formData.complexity,
        isValid: isFormulaValid,
        dependencies,
        created_at: new Date(),
        isActive: true,
        performance: {
          estimatedExecutionTime: performance.executionTime,
          memoryUsage: performance.memoryUsage,
          cacheEnabled: formData.cacheEnabled
        }
      };

      const updatedFields = [...formulaFields, newFormula];
      setFormulaFields(updatedFields);
      saveToStorage(updatedFields);
      toast.success('Campo de fórmula criado com sucesso!');
    }

    resetForm();
  };

  const extractDependencies = (formula: string) => {
    const fieldPattern = /[A-Za-z][A-Za-z0-9_]*(?:__c)?/g;
    const matches = formula.match(fieldPattern) || [];
    const functions = ['IF', 'AND', 'OR', 'NOT', 'MAX', 'MIN', 'SUM', 'TODAY', 'NOW', 'ROUND', 'ABS'];
    return [...new Set(matches.filter(match => 
      !functions.includes(match.toUpperCase()) && 
      availableFields.some(field => field.name === match)
    ))];
  };

  const resetForm = () => {
    setFormData({
      name: '',
      label: '',
      object: 'Opportunity',
      returnType: 'text',
      formula: '',
      description: '',
      category: 'business',
      complexity: 'simple',
      cacheEnabled: true
    });
    setIsBuilding(false);
    setEditingField(null);
    setActiveTab('editor');
  };

  const handleEditFormula = (field: FormulaField) => {
    setEditingField(field);
    setFormData({
      name: field.name,
      label: field.label,
      object: field.object,
      returnType: field.returnType,
      formula: field.formula,
      description: field.description,
      category: field.category,
      complexity: field.complexity,
      cacheEnabled: field.performance.cacheEnabled
    });
    setIsBuilding(true);
  };

  const handleDeleteFormula = (fieldId: string) => {
    const updatedFields = formulaFields.filter(field => field.id !== fieldId);
    setFormulaFields(updatedFields);
    saveToStorage(updatedFields);
    toast.success('Campo de fórmula removido com sucesso!');
  };

  const toggleFieldStatus = (fieldId: string) => {
    const updatedFields = formulaFields.map(field =>
      field.id === fieldId ? { ...field, isActive: !field.isActive } : field
    );
    setFormulaFields(updatedFields);
    saveToStorage(updatedFields);
    toast.success('Status do campo atualizado!');
  };

  const getCategoryInfo = (category: string) => {
    return categories.find(c => c.value === category) || categories[0];
  };

  const getPerformanceColor = (memoryUsage: string) => {
    switch (memoryUsage) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Formula Builder Enterprise
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Sistema avançado de criação e gestão de campos de fórmula
          </p>
        </div>
        <Button onClick={() => setIsBuilding(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Fórmula Avançada
        </Button>
      </div>

      {isBuilding ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              {editingField ? 'Editar Fórmula Enterprise' : 'Construtor de Fórmulas Enterprise'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="editor" className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Configuração</span>
                </TabsTrigger>
                <TabsTrigger value="formula" className="flex items-center space-x-2">
                  <Calculator className="h-4 w-4" />
                  <span>Editor</span>
                </TabsTrigger>
                <TabsTrigger value="test" className="flex items-center space-x-2">
                  <TestTube className="h-4 w-4" />
                  <span>Testes</span>
                </TabsTrigger>
                <TabsTrigger value="version" className="flex items-center space-x-2">
                  <GitBranch className="h-4 w-4" />
                  <span>Versões</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="editor" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome do Campo *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="ex: revenue_forecast_score"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Rótulo *</Label>
                    <Input
                      value={formData.label}
                      onChange={(e) => setFormData({...formData, label: e.target.value})}
                      placeholder="ex: Score de Previsão de Receita"
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
                          <SelectItem key={type.value} value={type.value}>
                            <span className="flex items-center space-x-2">
                              <span>{type.icon}</span>
                              <span>{type.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Select value={formData.category} onValueChange={(value: FormulaField['category']) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Complexidade</Label>
                    <Select value={formData.complexity} onValueChange={(value: FormulaField['complexity']) => setFormData({...formData, complexity: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simple">🟢 Simples</SelectItem>
                        <SelectItem value="medium">🟡 Médio</SelectItem>
                        <SelectItem value="advanced">🔴 Avançado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Descreva detalhadamente o que esta fórmula calcula e como deve ser usada..."
                    rows={3}
                  />
                </div>
              </TabsContent>

              <TabsContent value="formula">
                <FormulaEditor
                  value={formData.formula}
                  onChange={(value) => setFormData({...formData, formula: value})}
                  onValidationChange={setIsFormulaValid}
                  availableFields={availableFields}
                  returnType={formData.returnType}
                />
              </TabsContent>

              <TabsContent value="test">
                <FormulaTestRunner
                  formula={formData.formula}
                  returnType={formData.returnType}
                  availableFields={availableFields}
                  onSaveTestSuite={(tests) => {
                    toast.success('Suite de testes salva!');
                  }}
                />
              </TabsContent>

              <TabsContent value="version">
                <FormulaVersionControl
                  currentFormula={formData.formula}
                  onFormulaRestore={(formula) => setFormData({...formData, formula})}
                  fieldId={editingField?.id || 'new'}
                />
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2 pt-6 border-t">
              <Button variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
              <Button onClick={handleCreateFormula} disabled={!isFormulaValid}>
                <Save className="h-4 w-4 mr-2" />
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
                  Nenhuma fórmula enterprise encontrada
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                  Crie fórmulas avançadas com controle de versão, testes automatizados e análise de performance
                </p>
                <Button onClick={() => setIsBuilding(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Fórmula Enterprise
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {formulaFields.map((field) => {
                const categoryInfo = getCategoryInfo(field.category);
                return (
                  <Card key={field.id} className={`${!field.isActive ? 'opacity-60' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                              <Calculator className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{field.label}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {field.name} • {field.object}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3 flex-wrap gap-2">
                            <Badge variant="outline">{field.returnType}</Badge>
                            <Badge className={categoryInfo.color}>{categoryInfo.label}</Badge>
                            <Badge variant={field.isValid ? "default" : "destructive"}>
                              {field.isValid ? 'Válida' : 'Erro'}
                            </Badge>
                            <Badge variant="secondary">
                              {field.complexity === 'simple' && '🟢'}
                              {field.complexity === 'medium' && '🟡'}
                              {field.complexity === 'advanced' && '🔴'}
                              {field.complexity}
                            </Badge>
                            {field.dependencies.length > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {field.dependencies.length} dependências
                              </Badge>
                            )}
                          </div>

                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {field.description}
                          </div>

                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className={getPerformanceColor(field.performance.memoryUsage)}>
                              <Zap className="h-3 w-3 inline mr-1" />
                              {field.performance.estimatedExecutionTime}ms
                            </span>
                            <span>
                              💾 {field.performance.memoryUsage}
                            </span>
                            {field.performance.cacheEnabled && (
                              <span>⚡ Cache ativo</span>
                            )}
                          </div>

                          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded font-mono text-xs max-h-20 overflow-y-auto">
                            {field.formula.length > 100 ? field.formula.substring(0, 100) + '...' : field.formula}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
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
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => toggleFieldStatus(field.id)}
                            title={field.isActive ? "Desativar" : "Ativar"}
                          >
                            {field.isActive ? '⏸️' : '▶️'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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
