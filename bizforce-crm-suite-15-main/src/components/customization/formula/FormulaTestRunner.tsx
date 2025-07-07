import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Play,
  RotateCcw,
  Save,
  TestTube,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface TestCase {
  id: string;
  name: string;
  inputs: Record<string, any>;
  expectedOutput: any;
  actualOutput?: any;
  status?: 'pass' | 'fail' | 'pending';
  executionTime?: number;
}

interface FormulaTestRunnerProps {
  formula: string;
  returnType: string;
  availableFields: Array<{ name: string; type: string; label: string }>;
  onSaveTestSuite: (tests: TestCase[]) => void;
}

export const FormulaTestRunner = ({ 
  formula, 
  returnType, 
  availableFields, 
  onSaveTestSuite 
}: FormulaTestRunnerProps) => {
  const [testCases, setTestCases] = useState<TestCase[]>([
    {
      id: '1',
      name: 'Teste Básico',
      inputs: {},
      expectedOutput: ''
    }
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [newTestName, setNewTestName] = useState('');

  const generateSampleInputs = () => {
    const inputs: Record<string, any> = {};
    
    availableFields.forEach(field => {
      switch (field.type) {
        case 'number':
        case 'currency':
          inputs[field.name] = Math.floor(Math.random() * 100000);
          break;
        case 'text':
          inputs[field.name] = `Sample ${field.name}`;
          break;
        case 'boolean':
          inputs[field.name] = Math.random() > 0.5;
          break;
        case 'date':
          inputs[field.name] = new Date().toISOString().split('T')[0];
          break;
        default:
          inputs[field.name] = `Value_${Math.floor(Math.random() * 100)}`;
      }
    });
    
    return inputs;
  };

  const addTestCase = () => {
    const newTest: TestCase = {
      id: Date.now().toString(),
      name: newTestName || `Teste ${testCases.length + 1}`,
      inputs: generateSampleInputs(),
      expectedOutput: ''
    };
    
    setTestCases([...testCases, newTest]);
    setNewTestName('');
    toast.success('Caso de teste adicionado!');
  };

  const updateTestCase = (id: string, updates: Partial<TestCase>) => {
    setTestCases(tests => 
      tests.map(test => 
        test.id === id ? { ...test, ...updates } : test
      )
    );
  };

  const removeTestCase = (id: string) => {
    setTestCases(tests => tests.filter(test => test.id !== id));
    toast.success('Caso de teste removido!');
  };

  const simulateFormulaExecution = (formula: string, inputs: Record<string, any>) => {
    // Simulação básica de execução de fórmula
    // Em uma implementação real, isso seria processado por um engine de fórmulas
    
    try {
      // Para demonstração, vamos simular alguns cenários comuns
      if (formula.includes('Amount')) {
        const amount = inputs['Amount'] || 0;
        if (formula.includes('* 0.1')) {
          return amount * 0.1;
        }
        if (formula.includes('> 10000')) {
          return amount > 10000 ? 'Alto' : 'Baixo';
        }
      }
      
      if (formula.includes('IF')) {
        // Simulação de condição IF básica
        return Math.random() > 0.5 ? 'Verdadeiro' : 'Falso';
      }
      
      if (formula.includes('SUM')) {
        // Simulação de soma
        return Object.values(inputs).reduce((sum: number, val: any) => {
          return sum + (typeof val === 'number' ? val : 0);
        }, 0);
      }
      
      if (formula.includes('TODAY')) {
        return new Date().toLocaleDateString('pt-BR');
      }
      
      // Resultado padrão baseado no tipo de retorno
      switch (returnType) {
        case 'number':
        case 'currency':
          return Math.floor(Math.random() * 10000);
        case 'text':
          return 'Resultado da Fórmula';
        case 'boolean':
          return Math.random() > 0.5;
        case 'date':
          return new Date().toLocaleDateString('pt-BR');
        default:
          return 'Resultado simulado';
      }
    } catch (error) {
      throw new Error('Erro na execução da fórmula');
    }
  };

  const runTests = async () => {
    setIsRunning(true);
    
    for (let i = 0; i < testCases.length; i++) {
      const test = testCases[i];
      const startTime = Date.now();
      
      try {
        const result = simulateFormulaExecution(formula, test.inputs);
        const executionTime = Date.now() - startTime;
        
        const status = result.toString() === test.expectedOutput.toString() ? 'pass' : 'fail';
        
        updateTestCase(test.id, {
          actualOutput: result,
          status,
          executionTime
        });
        
        // Simular delay para mostrar progresso
        await new Promise(resolve => setTimeout(resolve, 300));
        
      } catch (error) {
        updateTestCase(test.id, {
          actualOutput: 'ERRO',
          status: 'fail',
          executionTime: Date.now() - startTime
        });
      }
    }
    
    setIsRunning(false);
    
    const passedTests = testCases.filter(t => t.status === 'pass').length;
    toast.success(`Testes concluídos! ${passedTests}/${testCases.length} passaram`);
  };

  const resetTests = () => {
    setTestCases(tests => 
      tests.map(test => ({
        ...test,
        actualOutput: undefined,
        status: undefined,
        executionTime: undefined
      }))
    );
    toast.info('Resultados dos testes limpos!');
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'pass':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'fail':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <TestTube className="h-5 w-5" />
            <span>Teste de Fórmula</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={resetTests}
              disabled={isRunning}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Limpar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSaveTestSuite(testCases)}
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Suite
            </Button>
            <Button
              size="sm"
              onClick={runTests}
              disabled={isRunning || !formula}
            >
              <Play className="h-4 w-4 mr-2" />
              {isRunning ? 'Executando...' : 'Executar Testes'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Test */}
        <div className="flex space-x-2">
          <Input
            placeholder="Nome do novo teste..."
            value={newTestName}
            onChange={(e) => setNewTestName(e.target.value)}
            className="flex-1"
          />
          <Button onClick={addTestCase}>
            Adicionar Teste
          </Button>
        </div>

        {/* Test Cases */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {testCases.map((test) => (
            <Card key={test.id} className={`border-2 ${getStatusColor(test.status)}`}>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {/* Test Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(test.status)}
                      <Label className="font-medium">{test.name}</Label>
                      {test.executionTime && (
                        <Badge variant="outline" className="text-xs">
                          {test.executionTime}ms
                        </Badge>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeTestCase(test.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remover
                    </Button>
                  </div>

                  {/* Test Inputs */}
                  <div>
                    <Label className="text-sm font-medium">Entradas:</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                      {availableFields.map((field) => (
                        <div key={field.name} className="space-y-1">
                          <Label className="text-xs">{field.label}</Label>
                          <Input
                            value={test.inputs[field.name] || ''}
                            onChange={(e) => updateTestCase(test.id, {
                              inputs: { ...test.inputs, [field.name]: e.target.value }
                            })}
                            placeholder={field.type}
                            className="text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expected vs Actual Output */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Resultado Esperado:</Label>
                      <Input
                        value={test.expectedOutput}
                        onChange={(e) => updateTestCase(test.id, { expectedOutput: e.target.value })}
                        placeholder="Digite o resultado esperado..."
                      />
                    </div>
                    {test.actualOutput !== undefined && (
                      <div>
                        <Label className="text-sm font-medium">Resultado Atual:</Label>
                        <Input
                          value={test.actualOutput}
                          readOnly
                          className="bg-gray-50"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {testCases.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <TestTube className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum caso de teste criado</p>
            <p className="text-sm">Adicione casos de teste para validar sua fórmula</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
