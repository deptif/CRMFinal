
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  Loader2,
  Sparkles,
  Brain,
  Zap,
  Trash2,
  Settings,
  Maximize2
} from 'lucide-react';
import { useAIWithData } from '@/hooks/useAIWithData';
import { useAIAssistantActions } from '@/hooks/useAIAssistantActions';
import { QuickActionsPanel } from './QuickActionsPanel';
import { ChatMessage } from './ChatMessage';
import { toast } from 'sonner';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
  metadata?: {
    actionPerformed?: string;
    dataFetched?: boolean;
    navigationTriggered?: boolean;
  };
}

export const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: '👋 **Bem-vindo ao Assistente IA BizForce!**\n\nSou o seu assistente inteligente e estou aqui para ajudar com todas as funcionalidades do sistema. Posso:\n\n🔍 **Pesquisar e analisar dados**\n📊 **Gerar relatórios e insights**\n🧭 **Navegar pelo sistema**\n⚡ **Executar ações rápidas**\n💡 **Fornecer ajuda contextual**\n\nExperimente as **Ações Rápidas** acima ou digite uma pergunta. Como posso ajudar hoje?',
      timestamp: new Date(),
      metadata: {
        actionPerformed: 'Inicialização'
      }
    }
  ]);
  const [input, setInput] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { processQuery, isLoading } = useAIWithData();
  const { navigateToSection, performQuickAction } = useAIAssistantActions();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll para última mensagem
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const messageContent = messageText || input.trim();
    if (!messageContent || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageContent,
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Adicionar mensagem de "digitando"
    const typingMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: 'Processando sua solicitação...',
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, typingMessage]);

    try {
      // Detectar e executar ações especiais
      const lowerQuery = messageContent.toLowerCase();
      let metadata: any = {};
      
      // Navegação
      if (lowerQuery.includes('ir para') || lowerQuery.includes('abrir') || lowerQuery.includes('navegar')) {
        const sections = {
          'dashboard': ['dashboard', 'painel', 'principal'],
          'accounts': ['clientes', 'contas', 'empresas'],
          'contacts': ['contatos', 'contactos', 'pessoas'],
          'opportunities': ['oportunidades', 'vendas', 'negócios'],
          'activities': ['atividades', 'tarefas', 'reuniões'],
          'reports': ['relatórios', 'reports', 'análises'],
          'settings': ['configurações', 'definições', 'settings']
        };

        for (const [section, keywords] of Object.entries(sections)) {
          if (keywords.some(keyword => lowerQuery.includes(keyword))) {
            navigateToSection(section);
            metadata.navigationTriggered = true;
            metadata.actionPerformed = `Navegação para ${section}`;
            toast.success(`Navegando para ${section}...`);
            break;
          }
        }
      }

      // Ações de criação
      if (lowerQuery.includes('criar') || lowerQuery.includes('novo') || lowerQuery.includes('adicionar')) {
        if (lowerQuery.includes('cliente') || lowerQuery.includes('conta')) {
          performQuickAction('create-account');
          metadata.actionPerformed = 'Criar novo cliente';
        } else if (lowerQuery.includes('contato') || lowerQuery.includes('pessoa')) {
          performQuickAction('create-contact');
          metadata.actionPerformed = 'Criar novo contato';
        } else if (lowerQuery.includes('reunião') || lowerQuery.includes('meeting')) {
          performQuickAction('schedule-activity');
          metadata.actionPerformed = 'Agendar reunião';
        }
      }

      const response = await processQuery(messageContent);
      
      // Detectar se dados foram buscados
      if (response.includes('Encontrados') || response.includes('Métricas') || response.includes('Total de')) {
        metadata.dataFetched = true;
      }

      // Remover mensagem de "digitando" e adicionar resposta
      setMessages(prev => {
        const newMessages = prev.filter(msg => msg.id !== typingMessage.id);
        return [...newMessages, {
          id: (Date.now() + 2).toString(),
          type: 'assistant',
          content: response,
          timestamp: new Date(),
          status: 'sent',
          metadata
        }];
      });

    } catch (error) {
      console.error('Erro:', error);
      
      setMessages(prev => {
        const newMessages = prev.filter(msg => msg.id !== typingMessage.id);
        return [...newMessages, {
          id: (Date.now() + 2).toString(),
          type: 'assistant',
          content: '❌ **Erro ao processar solicitação**\n\nDesculpe, ocorreu um erro. Verifique:\n• Configuração da API OpenAI\n• Conexão com a internet\n• Tente novamente em alguns segundos',
          timestamp: new Date(),
          status: 'error'
        }];
      });
      
      toast.error('Erro ao processar mensagem');
    }
  };

  const handleQuickAction = (action: any) => {
    handleSend(action.prompt);
  };

  const clearChat = () => {
    setMessages([messages[0]]); // Manter apenas mensagem de boas-vindas
    toast.success('Chat limpo');
  };

  const containerClass = isFullscreen 
    ? "fixed inset-0 z-50 bg-background" 
    : "h-[700px]";

  return (
    <Card className={`${containerClass} flex flex-col shadow-xl border-2`}>
      <CardHeader className="border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
              <Brain className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Assistente IA BizForce</h2>
              <p className="text-xs text-blue-100">Inteligência Artificial Avançada</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-500/20 text-green-100 border-green-400">
              <Sparkles className="h-3 w-3 mr-1" />
              Online
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="text-white hover:bg-white/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-white hover:bg-white/10"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 bg-gray-50 dark:bg-gray-900">
        {/* Quick Actions */}
        <QuickActionsPanel onActionClick={handleQuickAction} />

        {/* Messages */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
          <div className="space-y-1">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Bot className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Processando...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t bg-white dark:bg-gray-800">
          <div className="flex space-x-3">
            <div className="flex-1">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua pergunta ou comando..."
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                disabled={isLoading}
                className="border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 rounded-xl"
              />
            </div>
            <Button 
              onClick={() => handleSend()} 
              disabled={!input.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              💡 Experimente: "Mostrar vendas", "Ir para clientes", "Criar reunião"
            </p>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Zap className="h-3 w-3" />
              <span>IA Ativa</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
