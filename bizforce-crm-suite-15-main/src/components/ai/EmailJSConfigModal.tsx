
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Key, Globe, AlertTriangle, CheckCircle, Save, TestTube, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';

interface EmailJSConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmailJSConfigModal = ({ isOpen, onClose }: EmailJSConfigModalProps) => {
  const [config, setConfig] = useState({
    serviceId: '',
    templateId: '',
    publicKey: '',
    fromName: '',
    fromEmail: ''
  });
  const [isValid, setIsValid] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    // Carregar configurações salvas do localStorage
    const savedConfig = localStorage.getItem('emailjs_config');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      setConfig(parsed);
      validateConfig(parsed);
    }
  }, []);

  const validateConfig = (configToValidate = config) => {
    const isConfigValid = configToValidate.serviceId && 
                         configToValidate.templateId && 
                         configToValidate.publicKey &&
                         configToValidate.fromName &&
                         configToValidate.fromEmail;
    setIsValid(!!isConfigValid);
    return !!isConfigValid;
  };

  const handleSave = () => {
    if (!validateConfig()) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    localStorage.setItem('emailjs_config', JSON.stringify(config));
    
    // Inicializar EmailJS com a nova configuração
    emailjs.init(config.publicKey);
    
    toast.success('Configurações do EmailJS salvas com sucesso!');
    onClose();
  };

  const handleTest = async () => {
    if (!validateConfig()) {
      toast.error('Configure primeiro todas as credenciais');
      return;
    }

    setIsTesting(true);
    
    try {
      // Inicializar EmailJS
      emailjs.init(config.publicKey);
      
      // Enviar email de teste
      const testEmailData = {
        to_email: config.fromEmail,
        to_name: config.fromName,
        from_name: config.fromName,
        from_email: config.fromEmail,
        subject: 'Teste de Configuração EmailJS',
        message: 'Este é um email de teste para verificar se a configuração do EmailJS está funcionando corretamente.'
      };

      await emailjs.send(
        config.serviceId,
        config.templateId,
        testEmailData,
        config.publicKey
      );
      
      toast.success('Email de teste enviado com sucesso! Verifique sua caixa de entrada.');
    } catch (error) {
      console.error('Erro ao testar EmailJS:', error);
      toast.error('Erro ao testar configuração. Verifique as credenciais e tente novamente.');
    } finally {
      setIsTesting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
    validateConfig(newConfig);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2 text-blue-600" />
            Configurações EmailJS
            {isValid && (
              <Badge className="ml-2 bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Configurado
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Aviso de Configuração */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Como configurar o EmailJS:</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Acesse <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer" className="underline">emailjs.com</a> e crie uma conta</li>
                    <li>Configure um serviço de email (Gmail, Outlook, etc.)</li>
                    <li>Crie um template de email</li>
                    <li>Obtenha sua Public Key nas configurações</li>
                    <li>Preencha os campos abaixo com suas credenciais</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campos de Configuração */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="serviceId" className="flex items-center">
                <Globe className="h-4 w-4 mr-1" />
                Service ID *
              </Label>
              <Input
                id="serviceId"
                value={config.serviceId}
                onChange={(e) => handleInputChange('serviceId', e.target.value)}
                placeholder="service_xxxxxxx"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="templateId" className="flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                Template ID *
              </Label>
              <Input
                id="templateId"
                value={config.templateId}
                onChange={(e) => handleInputChange('templateId', e.target.value)}
                placeholder="template_xxxxxxx"
                className="mt-1"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="publicKey" className="flex items-center">
                <Key className="h-4 w-4 mr-1" />
                Public Key *
              </Label>
              <Input
                id="publicKey"
                value={config.publicKey}
                onChange={(e) => handleInputChange('publicKey', e.target.value)}
                placeholder="Sua chave pública do EmailJS"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="fromName">
                Nome do Remetente *
              </Label>
              <Input
                id="fromName"
                value={config.fromName}
                onChange={(e) => handleInputChange('fromName', e.target.value)}
                placeholder="Sua Empresa"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="fromEmail">
                Email do Remetente *
              </Label>
              <Input
                id="fromEmail"
                type="email"
                value={config.fromEmail}
                onChange={(e) => handleInputChange('fromEmail', e.target.value)}
                placeholder="contato@suaempresa.com"
                className="mt-1"
              />
            </div>
          </div>

          {/* Template de Exemplo */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">Template de Email Recomendado:</h4>
              <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                <p><strong>Assunto:</strong> {'{{subject}}'}</p>
                <p><strong>De:</strong> {'{{from_name}} <{{from_email}}>'}</p>
                <p><strong>Para:</strong> {'{{to_email}}'}</p>
                <br />
                <p><strong>Mensagem:</strong></p>
                <p>{'{{message}}'}</p>
                <br />
                <p>---</p>
                <p>Enviado via BizForce CRM</p>
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleTest}
              disabled={!isValid || isTesting}
              className="flex items-center space-x-2"
            >
              {isTesting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Testando...</span>
                </>
              ) : (
                <>
                  <TestTube className="h-4 w-4" />
                  <span>Testar Configuração</span>
                </>
              )}
            </Button>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSave}
                disabled={!isValid}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Configurações
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
