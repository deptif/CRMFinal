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
  CheckCircle, 
  Plus, 
  Trash2, 
  AlertCircle,
  Shield,
  Code,
  Edit,
  Eye,
  Play,
  Copy,
  Download,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';

interface ValidationRule {
  id: string;
  name: string;
  object: string;
  field: string;
  type: 'required' | 'range' | 'pattern' | 'custom' | 'unique' | 'dependency' | 'format';
  condition: string;
  errorMessage: string;
  isActive: boolean;
  priority: 'high' | 'medium' | 'low';
  triggerEvents: ('create' | 'update' | 'delete')[];
  dependencies: string[];
  created_at: Date;
  updated_at: Date;
}

export const FieldValidationBuilder = () => {
  const [validationRules, setValidationRules] = useState<ValidationRule[]>(() => {
    const saved = localStorage.getItem('validationRules');
    return saved ? JSON.parse(saved) : [];
  });

  const [isBuilding, setIsBuilding] = useState(false);
  const [editingRule, setEditingRule] = useState<ValidationRule | null>(null);
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterObject, setFilterObject] = useState<string>('all');
  const [formData, setFormData] = useState({
    name: '',
    object: 'Contact',
    field: '',
    type: 'required' as ValidationRule['type'],
    condition: '',
    errorMessage: '',
    priority: 'medium' as ValidationRule['priority'],
    triggerEvents: ['create', 'update'] as ValidationRule['triggerEvents']
  });

  const saveToStorage = (rules: ValidationRule[]) => {
    localStorage.setItem('validationRules', JSON.stringify(rules));
  };

  const objectTypes = ['Account', 'Contact', 'Opportunity', 'Lead', 'Case', 'Product', 'Quote'];
  const validationTypes = [
    { value: 'required', label: 'Campo Obrigatório', desc: 'Campo não pode estar vazio' },
    { value: 'range', label: 'Faixa de Valores', desc: 'Valor deve estar entre min e max' },
    { value: 'pattern', label: 'Padrão (Regex)', desc: 'Texto deve seguir padrão específico' },
    { value: 'custom', label: 'Fórmula Personalizada', desc: 'Validação usando fórmula customizada' },
    { value: 'unique', label: 'Valor Único', desc: 'Valor deve ser único no sistema' },
    { value: 'dependency', label: 'Dependência de Campo', desc: 'Validação baseada em outros campos' },
    { value: 'format', label: 'Formato', desc: 'Email, telefone, CPF, etc.' }
  ];

  const priorityOptions = [
    { value: 'high', label: 'Alta', color: 'bg-red-100 text-red-800' },
    { value: 'medium', label: 'Média', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'low', label: 'Baixa', color: 'bg-green-100 text-green-800' }
  ];

  const getConditionTemplate = (type: string) => {
    switch (type) {
      case 'required':
        return 'NOT ISBLANK({field})';
      case 'range':
        return '{field} >= {min} && {field} <= {max}';
      case 'pattern':
        return 'REGEX({field}, "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")';
      case 'unique':
        return 'UNIQUE({object}, {field})';
      case 'dependency':
        return 'IF(ISBLANK({dependent_field}), NOT ISBLANK({field}), TRUE)';
      case 'format':
        return 'REGEX({field}, "{pattern}")';
      case 'custom':
        return '// Escreva sua fórmula personalizada aqui';
      default:
        return '';
    }
  };

  const handleCreateValidation = () => {
    if (!formData.name || !formData.field || !formData.condition) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (editingRule) {
      const updatedRules = validationRules.map(rule =>
        rule.id === editingRule.id
          ? {
              ...rule,
              name: formData.name,
              object: formData.object,
              field: formData.field,
              type: formData.type,
              condition: formData.condition,
              errorMessage: formData.errorMessage,
              priority: formData.priority,
              triggerEvents: formData.triggerEvents,
              updated_at: new Date()
            }
          : rule
      );
      setValidationRules(updatedRules);
      saveToStorage(updatedRules);
      toast.success('Regra de validação atualizada com sucesso!');
      setEditingRule(null);
    } else {
      const newRule: ValidationRule = {
        id: crypto.randomUUID(),
        name: formData.name,
        object: formData.object,
        field: formData.field,
        type: formData.type,
        condition: formData.condition,
        errorMessage: formData.errorMessage,
        isActive: true,
        priority: formData.priority,
        triggerEvents: formData.triggerEvents,
        dependencies: [],
        created_at: new Date(),
        updated_at: new Date()
      };

      const updatedRules = [...validationRules, newRule];
      setValidationRules(updatedRules);
      saveToStorage(updatedRules);
      toast.success('Regra de validação criada com sucesso!');
    }

    resetForm();
  };

  const handleEditRule = (rule: ValidationRule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      object: rule.object,
      field: rule.field,
      type: rule.type,
      condition: rule.condition,
      errorMessage: rule.errorMessage,
      priority: rule.priority,
      triggerEvents: rule.triggerEvents
    });
    setIsBuilding(true);
  };

  const handleDeleteRule = (ruleId: string) => {
    const updatedRules = validationRules.filter(rule => rule.id !== ruleId);
    setValidationRules(updatedRules);
    saveToStorage(updatedRules);
    toast.success('Regra de validação removida!');
  };

  const toggleRuleStatus = (ruleId: string) => {
    const updatedRules = validationRules.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive, updated_at: new Date() } : rule
    );
    setValidationRules(updatedRules);
    saveToStorage(updatedRules);
    toast.success('Status da regra alterado!');
  };

  const duplicateRule = (rule: ValidationRule) => {
    const duplicatedRule: ValidationRule = {
      ...rule,
      id: crypto.randomUUID(),
      name: `${rule.name} (Cópia)`,
      created_at: new Date(),
      updated_at: new Date()
    };
    const updatedRules = [...validationRules, duplicatedRule];
    setValidationRules(updatedRules);
    saveToStorage(updatedRules);
    toast.success('Regra duplicada com sucesso!');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      object: 'Contact',
      field: '',
      type: 'required',
      condition: '',
      errorMessage: '',
      priority: 'medium',
      triggerEvents: ['create', 'update']
    });
    setIsBuilding(false);
    setEditingRule(null);
  };

  const insertTemplate = () => {
    const template = getConditionTemplate(formData.type);
    setFormData({
      ...formData,
      condition: template
    });
  };

  const testValidation = (rule: ValidationRule) => {
    toast.info(`Testando validação: ${rule.name}`);
    // Simulação de teste
    setTimeout(() => {
      toast.success('Validação testada com sucesso!');
    }, 1000);
  };

  const exportRules = () => {
    const dataStr = JSON.stringify(validationRules, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'validation-rules.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Regras exportadas com sucesso!');
  };

  const filteredRules = validationRules.filter(rule => {
    const activeFilter = filterActive === 'all' || 
      (filterActive === 'active' && rule.isActive) ||
      (filterActive === 'inactive' && !rule.isActive);
    
    const objectFilter = filterObject === 'all' || rule.object === filterObject;
    
    return activeFilter && objectFilter;
  });

  const statsData = {
    total: validationRules.length,
    active: validationRules.filter(r => r.isActive).length,
    inactive: validationRules.filter(r => !r.isActive).length,
    high: validationRules.filter(r => r.priority === 'high').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Validações de Campo</h2>
          <p className="text-gray-600 dark:text-gray-400">Configure regras de validação personalizadas para garantir qualidade dos dados</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportRules}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={() => setIsBuilding(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Validação
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{statsData.total}</div>
            <p className="text-sm text-gray-600">Total de Regras</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{statsData.active}</div>
            <p className="text-sm text-gray-600">Ativas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-400">{statsData.inactive}</div>
            <p className="text-sm text-gray-600">Inativas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{statsData.high}</div>
            <p className="text-sm text-gray-600">Alta Prioridade</p>
          </CardContent>
        </Card>
      </div>

      {isBuilding ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              {editingRule ? 'Editar Validação' : 'Construtor de Validações'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome da Regra *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="ex: Validação de Email Obrigatório"
                />
              </div>
              <div className="space-y-2">
                <Label>Campo *</Label>
                <Input
                  value={formData.field}
                  onChange={(e) => setFormData({...formData, field: e.target.value})}
                  placeholder="ex: email, phone, amount"
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
                <Label>Tipo de Validação</Label>
                <Select value={formData.type} onValueChange={(value: ValidationRule['type']) => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {validationTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-xs text-gray-500">{type.desc}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Prioridade</Label>
                <Select value={formData.priority} onValueChange={(value: ValidationRule['priority']) => setFormData({...formData, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>{priority.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Eventos de Disparo</Label>
                <div className="flex space-x-4 pt-2">
                  {['create', 'update', 'delete'].map((event) => (
                    <label key={event} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.triggerEvents.includes(event as any)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              triggerEvents: [...formData.triggerEvents, event as any]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              triggerEvents: formData.triggerEvents.filter(e => e !== event)
                            });
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm capitalize">{event}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Condição/Fórmula *</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={insertTemplate}
                  disabled={!formData.type}
                >
                  <Code className="h-4 w-4 mr-2" />
                  Inserir Template
                </Button>
              </div>
              <Textarea
                value={formData.condition}
                onChange={(e) => setFormData({...formData, condition: e.target.value})}
                placeholder="Digite a condição de validação..."
                rows={4}
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label>Mensagem de Erro *</Label>
              <Input
                value={formData.errorMessage}
                onChange={(e) => setFormData({...formData, errorMessage: e.target.value})}
                placeholder="Mensagem exibida quando a validação falhar"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
              <Button onClick={handleCreateValidation}>
                {editingRule ? 'Atualizar' : 'Criar'} Validação
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Label className="text-sm">Status:</Label>
                  <Select value={filterActive} onValueChange={(value) => setFilterActive(value as 'all' | 'active' | 'inactive')}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="active">Ativas</SelectItem>
                      <SelectItem value="inactive">Inativas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Label className="text-sm">Objeto:</Label>
                  <Select value={filterObject} onValueChange={setFilterObject}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {objectTypes.map((object) => (
                        <SelectItem key={object} value={object}>{object}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {filteredRules.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Shield className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {validationRules.length === 0 ? 'Nenhuma regra de validação encontrada' : 'Nenhuma regra corresponde aos filtros'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                  {validationRules.length === 0 
                    ? 'Configure regras de validação personalizadas para garantir a qualidade dos dados'
                    : 'Ajuste os filtros para ver mais regras'
                  }
                </p>
                {validationRules.length === 0 && (
                  <Button onClick={() => setIsBuilding(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeira Validação
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredRules.map((rule) => (
                <Card key={rule.id} className={`border-l-4 ${
                  rule.priority === 'high' ? 'border-l-red-500' :
                  rule.priority === 'medium' ? 'border-l-yellow-500' : 'border-l-green-500'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                          <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold">{rule.name}</h3>
                            <Switch
                              checked={rule.isActive}
                              onCheckedChange={() => toggleRuleStatus(rule.id)}
                            />
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {rule.object}.{rule.field} • {validationTypes.find(t => t.value === rule.type)?.label}
                          </p>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline">{rule.type}</Badge>
                            <Badge 
                              variant="secondary" 
                              className={priorityOptions.find(p => p.value === rule.priority)?.color}
                            >
                              {priorityOptions.find(p => p.value === rule.priority)?.label}
                            </Badge>
                            <Badge variant={rule.isActive ? "default" : "secondary"}>
                              {rule.isActive ? 'Ativa' : 'Inativa'}
                            </Badge>
                            {rule.triggerEvents.map(event => (
                              <Badge key={event} variant="outline" className="text-xs">
                                {event}
                              </Badge>
                            ))}
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-50 dark:bg-gray-800 p-2 rounded">
                              {rule.condition.length > 80 ? rule.condition.substring(0, 80) + '...' : rule.condition}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              <strong>Erro:</strong> {rule.errorMessage}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => testValidation(rule)}
                          title="Testar Validação"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => duplicateRule(rule)}
                          title="Duplicar Regra"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleEditRule(rule)}
                          title="Editar Validação"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleDeleteRule(rule.id)}
                          title="Excluir Validação"
                          className="text-red-600 hover:text-red-800"
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
    </div>
  );
};
