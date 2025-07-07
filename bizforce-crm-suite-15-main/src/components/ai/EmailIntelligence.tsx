
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Mail, 
  Brain, 
  Send,
  Loader2,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';
import { useOpenAI } from '@/hooks/useOpenAI';
import { EmailAnalysisCard } from './EmailAnalysisCard';
import { EmailResponseCard } from './EmailResponseCard';
import { EmailTemplatesPanel } from './EmailTemplatesPanel';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';

export const EmailIntelligence = () => {
  const [emailContent, setEmailContent] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderName, setSenderName] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [generatedResponse, setGeneratedResponse] = useState('');
  const { analyzeEmail, generateEmailResponse, isLoading } = useOpenAI();

  // Verificar se EmailJS está configurado
  const isEmailJSConfigured = () => {
    const emailJSConfig = localStorage.getItem('emailjs_config');
    return !!emailJSConfig;
  };

  const handleAnalyze = async () => {
    if (!emailContent.trim()) {
      toast.error('Digite o conteúdo do email para analisar');
      return;
    }

    try {
      const result = await analyzeEmail(emailContent);
      
      // Parse da resposta da IA para extrair informações estruturadas
      const lines = result.split('\n');
      let sentiment = 'Neutro';
      let intent = 'Informação';
      let priority = 'Média';
      
      lines.forEach(line => {
        if (line.toLowerCase().includes('sentiment') || line.toLowerCase().includes('sentimento')) {
          if (line.toLowerCase().includes('positive') || line.toLowerCase().includes('positivo')) sentiment = 'Positivo';
          else if (line.toLowerCase().includes('negative') || line.toLowerCase().includes('negativo')) sentiment = 'Negativo';
          else sentiment = 'Neutro';
        }
        if (line.toLowerCase().includes('intent') || line.toLowerCase().includes('intenção')) {
          if (line.toLowerCase().includes('purchase') || line.toLowerCase().includes('compra')) intent = 'Interesse em compra';
          else if (line.toLowerCase().includes('question') || line.toLowerCase().includes('pergunta')) intent = 'Pergunta';
          else if (line.toLowerCase().includes('complaint') || line.toLowerCase().includes('reclamação')) intent = 'Reclamação';
          else intent = 'Informação';
        }
        if (line.toLowerCase().includes('priority') || line.toLowerCase().includes('prioridade')) {
          if (line.toLowerCase().includes('high') || line.toLowerCase().includes('alta')) priority = 'Alta';
          else if (line.toLowerCase().includes('low') || line.toLowerCase().includes('baixa')) priority = 'Baixa';
          else priority = 'Média';
        }
      });

      // Calcular score baseado na análise
      let leadScore = 50; // Base
      if (sentiment === 'Positivo') leadScore += 20;
      else if (sentiment === 'Negativo') leadScore -= 10;
      if (intent === 'Interesse em compra') leadScore += 30;
      else if (intent === 'Pergunta') leadScore += 10;
      if (priority === 'Alta') leadScore += 15;

      leadScore = Math.max(0, Math.min(100, leadScore));

      setAnalysis({
        sentiment,
        intent,
        priority,
        suggestion: result,
        urgency: priority === 'Alta' ? 'high' : priority === 'Baixa' ? 'low' : 'medium',
        lead_score: leadScore
      });
      toast.success('Email analisado com sucesso!');
    } catch (error) {
      toast.error('Erro ao analisar email');
    }
  };

  const handleGenerateResponse = async () => {
    if (!emailContent.trim()) {
      toast.error('Digite o email original primeiro');
      return;
    }

    try {
      // Usar os dados da análise para criar um contexto mais preciso
      let context = 'Você é um assistente profissional de atendimento ao cliente. ';
      
      if (analysis) {
        context += `O email analisado tem sentimento ${analysis.sentiment.toLowerCase()}, `;
        context += `com intenção de ${analysis.intent.toLowerCase()}, `;
        context += `e prioridade ${analysis.priority.toLowerCase()}. `;
        
        // Ajustar o contexto baseado na intenção real
        switch (analysis.intent) {
          case 'Interesse em compra':
            context += 'Responda de forma comercial, destacando os benefícios dos serviços e propondo próximos passos para uma reunião ou demonstração.';
            break;
          case 'Pergunta':
            context += 'Responda de forma educativa e prestativa, fornecendo informações claras e oferecendo suporte adicional se necessário.';
            break;
          case 'Reclamação':
            context += 'Responda com empatia, reconhecendo a preocupação e oferecendo soluções concretas para resolver o problema.';
            break;
          default:
            context += 'Responda de forma profissional e cordial, sendo útil e prestativo.';
        }
      } else {
        // Contexto padrão se não houver análise
        context += 'Responda de forma profissional e cordial, sendo útil e prestativo. Analise o contexto do email para dar uma resposta apropriada.';
      }

      const response = await generateEmailResponse(emailContent, context);
      setGeneratedResponse(response);
      toast.success('Resposta gerada com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar resposta');
    }
  };

  const handleSelectTemplate = (template: any) => {
    setEmailContent(template.content);
    toast.success(`Template "${template.name}" carregado!`);
  };

  const handleEditResponse = (editedResponse: string) => {
    setGeneratedResponse(editedResponse);
  };

  const handleSendResponse = async () => {
    if (!generatedResponse.trim()) {
      toast.error('Nenhuma resposta para enviar');
      return;
    }

    if (!senderEmail.trim()) {
      toast.error('Digite o email do destinatário');
      return;
    }

    // Verificar se EmailJS está configurado
    if (!isEmailJSConfigured()) {
      toast.error('Configure primeiro o EmailJS nas Configurações do sistema');
      return;
    }

    try {
      const emailJSConfig = localStorage.getItem('emailjs_config');
      const config = JSON.parse(emailJSConfig!);
      
      // Inicializar EmailJS com as configurações
      emailjs.init(config.publicKey);
      
      // Dados do email para o template EmailJS
      const emailData = {
        to_email: senderEmail,
        to_name: senderName || 'Cliente',
        from_name: config.fromName,
        from_email: config.fromEmail,
        subject: 'Re: Sua mensagem',
        message: generatedResponse
      };

      console.log('Enviando email com EmailJS:', emailData);
      
      // Enviar email real usando EmailJS
      const result = await emailjs.send(
        config.serviceId,
        config.templateId,
        emailData,
        config.publicKey
      );

      console.log('Email enviado com sucesso:', result);
      toast.success('Email enviado com sucesso!');
      
      // Limpar campos após envio
      setGeneratedResponse('');
      setEmailContent('');
      setSenderEmail('');
      setSenderName('');
      setAnalysis(null);
      
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      
      // Mensagens de erro mais específicas
      if (error instanceof Error) {
        if (error.message.includes('Invalid template ID')) {
          toast.error('Template ID inválido. Verifique as configurações do EmailJS.');
        } else if (error.message.includes('Invalid service ID')) {
          toast.error('Service ID inválido. Verifique as configurações do EmailJS.');
        } else if (error.message.includes('Invalid user ID')) {
          toast.error('Public Key inválida. Verifique as configurações do EmailJS.');
        } else {
          toast.error(`Erro ao enviar email: ${error.message}`);
        }
      } else {
        toast.error('Erro desconhecido ao enviar email. Verifique as configurações.');
      }
      
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Email Intelligence</h2>
          <p className="text-gray-600">Análise inteligente de emails e geração automática de respostas</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-4 py-2">
            <Brain className="h-4 w-4 mr-2" />
            IA Avançada
          </Badge>
        </div>
      </div>

      {!isEmailJSConfigured() && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            Para enviar emails automáticos, configure primeiro o EmailJS nas{' '}
            <a href="/?section=settings" className="font-medium underline hover:no-underline">
              Configurações do sistema
            </a>.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="analyze" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analyze" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>Analisar</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <span>Templates</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analyze" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Email para Análise
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="senderEmail" className="text-sm font-medium text-gray-700 mb-2 block">
                        Email do Remetente *
                      </Label>
                      <Input
                        id="senderEmail"
                        type="email"
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        placeholder="email@exemplo.com"
                        className="border-2 border-gray-200 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="senderName" className="text-sm font-medium text-gray-700 mb-2 block">
                        Nome do Remetente
                      </Label>
                      <Input
                        id="senderName"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder="Nome do cliente"
                        className="border-2 border-gray-200 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Conteúdo do Email *
                    </Label>
                    <Textarea
                      value={emailContent}
                      onChange={(e) => setEmailContent(e.target.value)}
                      placeholder="Cole aqui o email que deseja analisar..."
                      className="min-h-[150px] border-2 border-gray-200 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleAnalyze} 
                      disabled={isLoading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analisando...
                        </>
                      ) : (
                        <>
                          <Brain className="h-4 w-4 mr-2" />
                          Analisar Email
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={handleGenerateResponse} 
                      disabled={isLoading}
                      variant="outline"
                      className="flex-1 border-green-200 text-green-600 hover:bg-green-50"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Gerando...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Gerar Resposta
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              {analysis && (
                <EmailAnalysisCard analysis={analysis} />
              )}

              {generatedResponse && (
                <EmailResponseCard
                  generatedResponse={generatedResponse}
                  onEdit={handleEditResponse}
                  onSend={handleSendResponse}
                />
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <EmailTemplatesPanel onSelectTemplate={handleSelectTemplate} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
