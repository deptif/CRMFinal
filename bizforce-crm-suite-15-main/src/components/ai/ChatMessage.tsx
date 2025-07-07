
import { Bot, User, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.type === 'user';
  
  const getStatusIcon = () => {
    switch (message.status) {
      case 'sending': return <Clock className="h-3 w-3 animate-pulse" />;
      case 'sent': return <CheckCircle className="h-3 w-3" />;
      case 'error': return <AlertCircle className="h-3 w-3 text-red-500" />;
      default: return null;
    }
  };

  const formatContent = (content: string) => {
    // Formatar links, negrito, etc.
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/• (.*?)(?=\n|$)/g, '<li>$1</li>')
      .replace(/(\n|^)• /g, '$1<li>')
      .replace(/\n\n/g, '<br><br>');
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[85%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`rounded-2xl px-4 py-3 shadow-sm ${
            isUser
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
          }`}
        >
          <div className="flex items-start space-x-3">
            <div className={`flex-shrink-0 ${isUser ? 'order-2' : 'order-1'}`}>
              {isUser ? (
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="h-3 w-3" />
                </div>
              ) : (
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Bot className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                </div>
              )}
            </div>
            
            <div className={`flex-1 ${isUser ? 'order-1' : 'order-2'}`}>
              <div 
                className="text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
              />
              
              {message.metadata && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {message.metadata.actionPerformed && (
                    <Badge variant="secondary" className="text-xs">
                      Ação: {message.metadata.actionPerformed}
                    </Badge>
                  )}
                  {message.metadata.dataFetched && (
                    <Badge variant="secondary" className="text-xs">
                      Dados Carregados
                    </Badge>
                  )}
                  {message.metadata.navigationTriggered && (
                    <Badge variant="secondary" className="text-xs">
                      Navegação Executada
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className={`flex items-center mt-1 px-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <span className={`text-xs ${
            isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
          }`}>
            {message.timestamp.toLocaleTimeString('pt-PT', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          {message.status && (
            <div className="ml-2">
              {getStatusIcon()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
