
import { EnhancedChatCenter } from '@/components/chat/EnhancedChatCenter';

export const ChatPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Centro de Comunicação</h1>
        <p className="text-gray-600">Chat em tempo real com a equipa</p>
      </div>
      <EnhancedChatCenter />
    </div>
  );
};
