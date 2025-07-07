
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle,
  AlertCircle,
  Code,
  Lightbulb,
  Copy,
  Undo,
  Redo,
  Search,
  BookOpen
} from 'lucide-react';
import { toast } from 'sonner';

interface FormulaEditorProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange: (isValid: boolean, errors: string[]) => void;
  availableFields: Array<{ name: string; type: string; label: string }>;
  returnType: string;
}

const FORMULA_FUNCTIONS = {
  mathematical: [
    { name: 'ABS', syntax: 'ABS(number)', description: 'Valor absoluto de um número', example: 'ABS(-5) = 5' },
    { name: 'ROUND', syntax: 'ROUND(number, decimals)', description: 'Arredonda um número', example: 'ROUND(3.14159, 2) = 3.14' },
    { name: 'CEILING', syntax: 'CEILING(number)', description: 'Arredonda para cima', example: 'CEILING(3.2) = 4' },
    { name: 'FLOOR', syntax: 'FLOOR(number)', description: 'Arredonda para baixo', example: 'FLOOR(3.8) = 3' },
    { name: 'MAX', syntax: 'MAX(value1, value2, ...)', description: 'Maior valor', example: 'MAX(10, 20, 5) = 20' },
    { name: 'MIN', syntax: 'MIN(value1, value2, ...)', description: 'Menor valor', example: 'MIN(10, 20, 5) = 5' },
    { name: 'SQRT', syntax: 'SQRT(number)', description: 'Raiz quadrada', example: 'SQRT(16) = 4' },
    { name: 'POWER', syntax: 'POWER(base, exponent)', description: 'Potência', example: 'POWER(2, 3) = 8' }
  ],
  logical: [
    { name: 'IF', syntax: 'IF(condition, true_value, false_value)', description: 'Condição lógica', example: 'IF(Amount > 1000, "Alto", "Baixo")' },
    { name: 'AND', syntax: 'AND(condition1, condition2, ...)', description: 'Todas condições verdadeiras', example: 'AND(Amount > 0, Stage = "Closed Won")' },
    { name: 'OR', syntax: 'OR(condition1, condition2, ...)', description: 'Pelo menos uma condição verdadeira', example: 'OR(Type = "New", Type = "Existing")' },
    { name: 'NOT', syntax: 'NOT(condition)', description: 'Negação lógica', example: 'NOT(ISNULL(CloseDate))' },
    { name: 'CASE', syntax: 'CASE(expr, value1, result1, value2, result2, else_result)', description: 'Múltiplas condições', example: 'CASE(Stage, "Prospecting", 10, "Qualification", 25, 0)' }
  ],
  text: [
    { name: 'UPPER', syntax: 'UPPER(text)', description: 'Converte para maiúsculas', example: 'UPPER("hello") = "HELLO"' },
    { name: 'LOWER', syntax: 'LOWER(text)', description: 'Converte para minúsculas', example: 'LOWER("HELLO") = "hello"' },
    { name: 'LEN', syntax: 'LEN(text)', description: 'Comprimento do texto', example: 'LEN("Hello") = 5' },
    { name: 'LEFT', syntax: 'LEFT(text, num_chars)', description: 'Primeiros caracteres', example: 'LEFT("Hello", 2) = "He"' },
    { name: 'RIGHT', syntax: 'RIGHT(text, num_chars)', description: 'Últimos caracteres', example: 'RIGHT("Hello", 2) = "lo"' },
    { name: 'MID', syntax: 'MID(text, start, length)', description: 'Substring', example: 'MID("Hello", 2, 3) = "ell"' },
    { name: 'SUBSTITUTE', syntax: 'SUBSTITUTE(text, old_text, new_text)', description: 'Substitui texto', example: 'SUBSTITUTE("Hello World", "World", "SF") = "Hello SF"' },
    { name: 'CONCATENATE', syntax: 'CONCATENATE(text1, text2, ...)', description: 'Junta textos', example: 'CONCATENATE("Hello", " ", "World") = "Hello World"' }
  ],
  date: [
    { name: 'TODAY', syntax: 'TODAY()', description: 'Data atual', example: 'TODAY() = 2024-01-15' },
    { name: 'NOW', syntax: 'NOW()', description: 'Data e hora atual', example: 'NOW() = 2024-01-15 14:30:00' },
    { name: 'YEAR', syntax: 'YEAR(date)', description: 'Ano da data', example: 'YEAR(TODAY()) = 2024' },
    { name: 'MONTH', syntax: 'MONTH(date)', description: 'Mês da data', example: 'MONTH(TODAY()) = 1' },
    { name: 'DAY', syntax: 'DAY(date)', description: 'Dia da data', example: 'DAY(TODAY()) = 15' },
    { name: 'WEEKDAY', syntax: 'WEEKDAY(date)', description: 'Dia da semana (1-7)', example: 'WEEKDAY(TODAY()) = 2' },
    { name: 'ADDMONTHS', syntax: 'ADDMONTHS(date, months)', description: 'Adiciona meses', example: 'ADDMONTHS(TODAY(), 3)' },
    { name: 'DAYS', syntax: 'DAYS(end_date, start_date)', description: 'Diferença em dias', example: 'DAYS(CloseDate, CreatedDate)' }
  ],
  validation: [
    { name: 'ISNULL', syntax: 'ISNULL(expression)', description: 'Verifica se é nulo', example: 'ISNULL(Description)' },
    { name: 'ISBLANK', syntax: 'ISBLANK(expression)', description: 'Verifica se está em branco', example: 'ISBLANK(Phone)' },
    { name: 'ISNUMBER', syntax: 'ISNUMBER(expression)', description: 'Verifica se é número', example: 'ISNUMBER(Amount)' },
    { name: 'ISTEXT', syntax: 'ISTEXT(expression)', description: 'Verifica se é texto', example: 'ISTEXT(Name)' }
  ]
};

export const FormulaEditor = ({ 
  value, 
  onChange, 
  onValidationChange, 
  availableFields, 
  returnType 
}: FormulaEditorProps) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Array<{ type: string; name: string; description: string }>>([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<keyof typeof FORMULA_FUNCTIONS>('mathematical');
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const validateFormula = (formula: string) => {
    const newErrors: string[] = [];
    
    // Verificar parênteses balanceados
    const openParens = (formula.match(/\(/g) || []).length;
    const closeParens = (formula.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      newErrors.push('Parênteses não estão balanceados');
    }

    // Verificar aspas balanceadas
    const quotes = (formula.match(/"/g) || []).length;
    if (quotes % 2 !== 0) {
      newErrors.push('Aspas não estão balanceadas');
    }

    // Verificar funções válidas
    const functionPattern = /([A-Z_]+)\s*\(/g;
    const matches = formula.match(functionPattern);
    if (matches) {
      matches.forEach(match => {
        const funcName = match.replace(/\s*\($/, '');
        const isValidFunction = Object.values(FORMULA_FUNCTIONS).some(category =>
          category.some(func => func.name === funcName)
        );
        if (!isValidFunction) {
          newErrors.push(`Função '${funcName}' não é reconhecida`);
        }
      });
    }

    // Verificar campos referenciados
    const fieldPattern = /[A-Za-z][A-Za-z0-9_]*(?:__c)?/g;
    const fieldMatches = formula.match(fieldPattern) || [];
    fieldMatches.forEach(field => {
      const isFunction = Object.values(FORMULA_FUNCTIONS).some(category =>
        category.some(func => func.name === field.toUpperCase())
      );
      const isAvailableField = availableFields.some(f => f.name === field);
      
      if (!isFunction && !isAvailableField && !['true', 'false', 'null'].includes(field.toLowerCase())) {
        newErrors.push(`Campo '${field}' não encontrado`);
      }
    });

    setErrors(newErrors);
    onValidationChange(newErrors.length === 0, newErrors);
    return newErrors.length === 0;
  };

  const insertFunction = (funcName: string, syntax: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.substring(0, start) + syntax + value.substring(end);
    
    onChange(newValue);
    addToHistory(newValue);
    
    // Posicionar cursor dentro dos parênteses
    setTimeout(() => {
      const newPosition = start + syntax.indexOf('(') + 1;
      textarea.setSelectionRange(newPosition, newPosition);
      textarea.focus();
    }, 0);

    toast.success(`Função ${funcName} inserida!`);
  };

  const insertField = (fieldName: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.substring(0, start) + fieldName + value.substring(end);
    
    onChange(newValue);
    addToHistory(newValue);
    
    setTimeout(() => {
      const newPosition = start + fieldName.length;
      textarea.setSelectionRange(newPosition, newPosition);
      textarea.focus();
    }, 0);

    toast.success(`Campo ${fieldName} inserido!`);
  };

  const addToHistory = (newValue: string) => {
    const newHistory = [...history.slice(0, historyIndex + 1), newValue];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      onChange(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      onChange(history[newIndex]);
    }
  };

  const copyFormula = () => {
    navigator.clipboard.writeText(value);
    toast.success('Fórmula copiada para a área de transferência!');
  };

  useEffect(() => {
    validateFormula(value);
  }, [value, availableFields]);

  const filteredFunctions = FORMULA_FUNCTIONS[activeCategory].filter(func =>
    func.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    func.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Editor Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Code className="h-5 w-5" />
          <Label className="font-medium">Editor de Fórmulas Avançado</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={undo} disabled={historyIndex === 0}>
            <Undo className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={redo} disabled={historyIndex === history.length - 1}>
            <Redo className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={copyFormula}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Formula Textarea */}
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            addToHistory(e.target.value);
          }}
          placeholder="Digite sua fórmula aqui... Ex: IF(Amount > 10000, Amount * 0.1, 0)"
          rows={6}
          className="font-mono text-sm"
          onSelect={(e) => {
            const target = e.target as HTMLTextAreaElement;
            setCursorPosition(target.selectionStart);
          }}
        />
        
        {/* Validation Status */}
        <div className="absolute top-2 right-2">
          {errors.length === 0 ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600" />
          )}
        </div>
      </div>

      {/* Validation Errors */}
      {errors.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800">Erros na Fórmula:</h4>
                <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Function Library */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Biblioteca de Funções</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar funções..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-1 border rounded-md text-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {/* Category Tabs */}
          <div className="flex space-x-1 mb-4 overflow-x-auto">
            {Object.keys(FORMULA_FUNCTIONS).map((category) => (
              <Button
                key={category}
                size="sm"
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => setActiveCategory(category as keyof typeof FORMULA_FUNCTIONS)}
                className="whitespace-nowrap"
              >
                {category === 'mathematical' && 'Matemática'}
                {category === 'logical' && 'Lógica'}
                {category === 'text' && 'Texto'}
                {category === 'date' && 'Data'}
                {category === 'validation' && 'Validação'}
              </Button>
            ))}
          </div>

          {/* Functions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
            {filteredFunctions.map((func) => (
              <Card key={func.name} className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => insertFunction(func.name, func.syntax)}>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="font-mono text-xs">
                      {func.name}
                    </Badge>
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                  </div>
                  <p className="text-sm font-medium">{func.description}</p>
                  <p className="text-xs text-gray-500 font-mono">{func.syntax}</p>
                  <p className="text-xs text-blue-600">{func.example}</p>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Fields */}
      {availableFields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Campos Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-32 overflow-y-auto">
              {availableFields.map((field) => (
                <Button
                  key={field.name}
                  size="sm"
                  variant="outline"
                  onClick={() => insertField(field.name)}
                  className="justify-start text-left"
                  title={`${field.label} (${field.type})`}
                >
                  <span className="font-mono text-xs">{field.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
