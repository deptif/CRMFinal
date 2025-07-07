
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Key, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export const APIKeyManager = () => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setIsValid(true);
    }
  }, []);

  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      toast.error('Por favor, insira uma chave válida');
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      toast.error('A chave da API deve começar com "sk-"');
      return;
    }

    localStorage.setItem('openai_api_key', apiKey);
    setIsValid(true);
    toast.success('Chave da API salva com sucesso!');
  };

  const handleRemoveKey = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey('');
    setIsValid(null);
    toast.success('Chave da API removida');
  };

  const testAPIKey = async () => {
    if (!apiKey) {
      toast.error('Insira uma chave primeiro');
      return;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (response.ok) {
        setIsValid(true);
        toast.success('Chave válida! Conexão estabelecida com sucesso.');
      } else {
        setIsValid(false);
        toast.error('Chave inválida ou sem permissões adequadas');
      }
    } catch (error) {
      setIsValid(false);
      toast.error('Erro ao testar a chave. Verifique sua conexão.');
    }
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg">
          <div className="p-1.5 bg-orange-100 dark:bg-orange-900/50 rounded-lg mr-2">
            <Key className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </div>
          Chave OpenAI
          {isValid !== null && (
            <Badge className={`ml-2 text-xs ${isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isValid ? 'Válida' : 'Inválida'}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Segurança:</p>
              <p className="text-xs">Chave armazenada localmente no navegador. Para maior segurança, use Supabase.</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="api-key" className="text-sm">Chave da API OpenAI</Label>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Input
                id="api-key"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-proj-..."
                className="pr-10 h-9"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-9 w-9 p-0"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Obtenha em: <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">platform.openai.com</a>
          </p>
        </div>

        <div className="flex space-x-2">
          <Button onClick={handleSaveKey} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
            Salvar
          </Button>
          <Button onClick={testAPIKey} variant="outline" size="sm">
            Testar
          </Button>
          {apiKey && (
            <Button onClick={handleRemoveKey} variant="outline" size="sm" className="text-red-600">
              Remover
            </Button>
          )}
        </div>

        {apiKey && (
          <div className="border-t pt-3">
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={isValid ? 'text-green-600' : isValid === false ? 'text-red-600' : 'text-gray-500'}>
                  {isValid ? 'Válida' : isValid === false ? 'Inválida' : 'Configurada'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Chave:</span>
                <span className="font-mono text-xs">
                  {apiKey.substring(0, 8)}...{apiKey.substring(apiKey.length - 4)}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
