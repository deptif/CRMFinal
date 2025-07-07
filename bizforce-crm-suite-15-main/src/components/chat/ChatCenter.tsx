
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Send, 
  Users, 
  Plus,
  Search,
  Phone,
  Video,
  MoreVertical
} from 'lucide-react';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

interface ChatRoom {
  id: string;
  name: string;
  type: 'direct' | 'group';
  participants: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  isOnline?: boolean;
}

export const ChatCenter = () => {
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [message, setMessage] = useState('');

  // Initial data removed - ready for database integration
  const [chatRooms] = useState<ChatRoom[]>([]);
  const [messages] = useState<ChatMessage[]>([]);

  const currentRoom = chatRooms.find(room => room.id === selectedRoom);
  const totalUnread = chatRooms.reduce((sum, room) => sum + room.unreadCount, 0);

  const sendMessage = () => {
    if (!message.trim()) return;

    toast.success('Mensagem enviada!');
    setMessage('');
    
    // TODO: Replace with actual database call
    // await sendMessageToDB(selectedRoom, message);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-PT', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h atrás`;
    if (minutes > 0) return `${minutes}m atrás`;
    return 'Agora';
  };

  // TODO: Add function to load chat data from database
  // useEffect(() => {
  //   const loadChatData = async () => {
  //     try {
  //       const [roomsData, messagesData] = await Promise.all([
  //         fetchChatRoomsFromDB(),
  //         fetchMessagesFromDB()
  //       ]);
  //       setChatRooms(roomsData);
  //       setMessages(messagesData);
  //     } catch (error) {
  //       console.error('Failed to load chat data:', error);
  //     }
  //   };
  //   loadChatData();
  // }, []);

  return (
    <div className="h-[600px] flex bg-white rounded-lg border overflow-hidden">
      {/* Sidebar with chat rooms */}
      <div className="w-80 border-r bg-gray-50">
        <div className="p-4 border-b bg-white">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Chat da Equipa</h2>
            <Button size="icon" variant="ghost">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Buscar conversas..." className="pl-10" />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {chatRooms.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma conversa</h3>
                <p className="text-gray-600">Inicie uma nova conversa para começar</p>
              </div>
            ) : (
              chatRooms.map((room) => (
                <div
                  key={room.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
                    selectedRoom === room.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedRoom(room.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {room.type === 'group' ? (
                            <Users className="h-4 w-4" />
                          ) : (
                            room.name[0]
                          )}
                        </AvatarFallback>
                      </Avatar>
                      {room.type === 'direct' && room.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm truncate">{room.name}</h3>
                        {room.unreadCount > 0 && (
                          <Badge className="bg-blue-500 text-white">
                            {room.unreadCount}
                          </Badge>
                        )}
                      </div>
                      {room.lastMessage && (
                        <p className="text-xs text-gray-600 truncate">
                          {room.lastMessage.message}
                        </p>
                      )}
                      {room.lastMessage && (
                        <p className="text-xs text-gray-400">
                          {formatLastSeen(room.lastMessage.timestamp)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat content */}
      <div className="flex-1 flex flex-col">
        {currentRoom ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {currentRoom.type === 'group' ? (
                        <Users className="h-4 w-4" />
                      ) : (
                        currentRoom.name[0]
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{currentRoom.name}</h3>
                    {currentRoom.type === 'direct' ? (
                      <p className="text-sm text-gray-500">
                        {currentRoom.isOnline ? 'Online' : 'Offline'}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">
                        {currentRoom.participants.length} membros
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button size="icon" variant="ghost">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma mensagem ainda</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.userId === 'current' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          msg.userId === 'current'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {msg.userId !== 'current' && (
                          <p className="text-xs text-gray-500 mb-1">{msg.userName}</p>
                        )}
                        <p className="text-sm">{msg.message}</p>
                        <p className={`text-xs mt-1 ${
                          msg.userId === 'current' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Message input */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escrever mensagem..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={!message.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Seleciona uma conversa para começar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
