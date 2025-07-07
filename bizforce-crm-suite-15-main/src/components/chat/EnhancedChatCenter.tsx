import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  Video,
  MoreVertical,
  Users,
  Search,
  Plus,
  Settings,
  Bell,
  BellOff,
  Mic,
  Image,
  FileText,
  X,
  Check,
  CheckCheck,
  UserPlus,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AddContactModal } from './AddContactModal';
import { CreateGroupModal } from './CreateGroupModal';
import { DeleteConversationModal } from './DeleteConversationModal';
import { AddMembersModal } from './AddMembersModal';

interface ChatMessage {
  id: string;
  sender: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'image';
  isOwn: boolean;
  isRead: boolean;
  attachment?: {
    name: string;
    size: string;
    type: string;
  };
}

interface ChatRoom {
  id: string;
  name: string;
  participants: string[];
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  isGroup: boolean;
  isOnline?: boolean;
  typing?: string[];
  notifications: boolean;
  email?: string;
  description?: string;
}

export const EnhancedChatCenter = () => {
  const { toast } = useToast();
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachmentPreview, setAttachmentPreview] = useState<File | null>(null);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<ChatRoom | null>(null);
  const [groupToAddMembers, setGroupToAddMembers] = useState<ChatRoom | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});

  const currentRoom = chatRooms.find(room => room.id === selectedRoom);
  const currentMessages = messages[selectedRoom] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  useEffect(() => {
    if (message.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (selectedRoom) {
      setMessages(prev => ({
        ...prev,
        [selectedRoom]: prev[selectedRoom]?.map(msg => ({ ...msg, isRead: true })) || []
      }));
      
      setChatRooms(prev => 
        prev.map(room => 
          room.id === selectedRoom 
            ? { ...room, unreadCount: 0 }
            : room
        )
      );
    }
  }, [selectedRoom]);

  const handleAddContact = (email: string, name?: string) => {
    const newRoomId = Date.now().toString();
    const contactName = name || email.split('@')[0];
    
    const newRoom: ChatRoom = {
      id: newRoomId,
      name: contactName,
      participants: [email, 'Eu'],
      unreadCount: 0,
      isGroup: false,
      isOnline: Math.random() > 0.5,
      notifications: true,
      email: email
    };

    setChatRooms(prev => [newRoom, ...prev]);
    setMessages(prev => ({ ...prev, [newRoomId]: [] }));
    setSelectedRoom(newRoomId);

    toast({
      title: "Contato adicionado",
      description: `${contactName} foi adicionado à sua lista de contatos`,
    });
  };

  const handleCreateGroup = (name: string, description?: string, participants?: string[]) => {
    const newRoomId = Date.now().toString();
    
    const newRoom: ChatRoom = {
      id: newRoomId,
      name: name,
      participants: [...(participants || []), 'Eu'],
      unreadCount: 0,
      isGroup: true,
      notifications: true,
      description: description
    };

    setChatRooms(prev => [newRoom, ...prev]);
    setMessages(prev => ({ ...prev, [newRoomId]: [] }));
    setSelectedRoom(newRoomId);

    toast({
      title: "Grupo criado",
      description: `O grupo "${name}" foi criado com sucesso`,
    });
  };

  const handleDeleteConversation = (conversationId: string) => {
    setChatRooms(prev => prev.filter(room => room.id !== conversationId));
    setMessages(prev => {
      const newMessages = { ...prev };
      delete newMessages[conversationId];
      return newMessages;
    });
    
    if (selectedRoom === conversationId) {
      setSelectedRoom('');
    }

    const conversation = chatRooms.find(room => room.id === conversationId);
    toast({
      title: conversation?.isGroup ? "Grupo eliminado" : "Conversa eliminada",
      description: `${conversation?.name} foi eliminado com sucesso`,
    });
  };

  const handleAddMembers = (groupId: string, newMembers: string[]) => {
    setChatRooms(prev => 
      prev.map(room => 
        room.id === groupId 
          ? { ...room, participants: [...room.participants, ...newMembers] }
          : room
      )
    );

    const group = chatRooms.find(room => room.id === groupId);
    toast({
      title: "Membros adicionados",
      description: `${newMembers.length} membro(s) foram adicionados ao grupo "${group?.name}"`,
    });
  };

  const openDeleteModal = (room: ChatRoom) => {
    setConversationToDelete(room);
    setShowDeleteModal(true);
  };

  const openAddMembersModal = (room: ChatRoom) => {
    setGroupToAddMembers(room);
    setShowAddMembersModal(true);
  };

  const handleSendMessage = () => {
    if (!message.trim() && !attachmentPreview) return;
    if (!selectedRoom) {
      toast({
        title: "Erro",
        description: "Selecione uma conversa primeiro",
        variant: "destructive"
      });
      return;
    }

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'current',
      senderName: 'Eu',
      content: message || '',
      timestamp: new Date(),
      type: attachmentPreview ? 'file' : 'text',
      isOwn: true,
      isRead: true,
      attachment: attachmentPreview ? {
        name: attachmentPreview.name,
        size: `${(attachmentPreview.size / 1024).toFixed(1)} KB`,
        type: attachmentPreview.type
      } : undefined
    };

    setMessages(prev => ({
      ...prev,
      [selectedRoom]: [...(prev[selectedRoom] || []), newMessage]
    }));

    setChatRooms(prev => 
      prev.map(room => 
        room.id === selectedRoom 
          ? { 
              ...room, 
              lastMessage: attachmentPreview ? `📎 ${attachmentPreview.name}` : message,
              lastMessageTime: new Date() 
            }
          : room
      )
    );

    setMessage('');
    setAttachmentPreview(null);

    toast({
      title: "Mensagem enviada",
      description: "A sua mensagem foi enviada com sucesso",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentPreview(file);
      toast({
        title: "Ficheiro anexado",
        description: `${file.name} pronto para enviar`,
      });
    }
  };

  const toggleNotifications = (roomId: string) => {
    setChatRooms(prev => 
      prev.map(room => 
        room.id === roomId 
          ? { ...room, notifications: !room.notifications }
          : room
      )
    );
    
    const room = chatRooms.find(r => r.id === roomId);
    toast({
      title: room?.notifications ? "Notificações desativadas" : "Notificações ativadas",
      description: `Para ${room?.name}`,
    });
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
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d atrás`;
    if (hours > 0) return `${hours}h atrás`;
    if (minutes > 0) return `${minutes}m atrás`;
    return 'Agora';
  };

  return (
    <div className="h-[700px] flex bg-white rounded-lg border overflow-hidden shadow-lg">
      {/* Sidebar */}
      <div className="w-80 border-r bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b bg-white">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Chat da Equipa</h2>
            <div className="flex items-center space-x-1">
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
              <div className="relative">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8"
                  onClick={() => setShowAddOptions(!showAddOptions)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                
                {showAddOptions && (
                  <div className="absolute top-full right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 py-1 min-w-[160px]">
                    <button
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center space-x-2"
                      onClick={() => {
                        setShowAddContactModal(true);
                        setShowAddOptions(false);
                      }}
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Adicionar Contato</span>
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center space-x-2"
                      onClick={() => {
                        setShowCreateGroupModal(true);
                        setShowAddOptions(false);
                      }}
                    >
                      <Users className="h-4 w-4" />
                      <span>Criar Grupo</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Buscar conversas..." 
              className="pl-10 h-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Chat Rooms List */}
        <div className="flex-1 overflow-y-auto">
          {chatRooms.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma conversa</h3>
              <p className="text-gray-600 text-sm mb-4">Adicione um contato ou crie um grupo para começar</p>
              <div className="space-y-2">
                <Button 
                  className="w-full" 
                  size="sm" 
                  onClick={() => setShowAddContactModal(true)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Adicionar Contato
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="sm" 
                  onClick={() => setShowCreateGroupModal(true)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Criar Grupo
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-2">
              {chatRooms
                .filter(room => 
                  room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  room.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((room) => (
                <ContextMenu key={room.id}>
                  <ContextMenuTrigger>
                    <div
                      className={`p-3 rounded-lg cursor-pointer transition-all mb-1 ${
                        selectedRoom === room.id 
                          ? 'bg-blue-100 border-l-4 border-blue-500' 
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedRoom(room.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                              {room.isGroup ? (
                                <Users className="h-5 w-5" />
                              ) : (
                                room.name.slice(0, 2).toUpperCase()
                              )}
                            </AvatarFallback>
                          </Avatar>
                          {!room.isGroup && room.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-sm truncate">{room.name}</h3>
                            <div className="flex items-center space-x-1">
                              {!room.notifications && (
                                <BellOff className="h-3 w-3 text-gray-400" />
                              )}
                              {room.unreadCount > 0 && (
                                <Badge className="bg-blue-600 text-white text-xs h-5 min-w-[20px] flex items-center justify-center">
                                  {room.unreadCount > 99 ? '99+' : room.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {room.typing && room.typing.length > 0 ? (
                            <p className="text-xs text-green-600 italic">
                              {room.typing[0]} está a escrever...
                            </p>
                          ) : room.lastMessage ? (
                            <p className="text-xs text-gray-600 truncate">
                              {room.lastMessage}
                            </p>
                          ) : (
                            <p className="text-xs text-gray-400 italic">
                              Nenhuma mensagem
                            </p>
                          )}
                          
                          {room.lastMessageTime && (
                            <p className="text-xs text-gray-400 mt-1">
                              {formatLastSeen(room.lastMessageTime)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-48">
                    {room.isGroup && (
                      <ContextMenuItem 
                        onClick={() => openAddMembersModal(room)}
                        className="flex items-center space-x-2"
                      >
                        <UserPlus className="h-4 w-4" />
                        <span>Adicionar Membros</span>
                      </ContextMenuItem>
                    )}
                    <ContextMenuItem 
                      onClick={() => toggleNotifications(room.id)}
                      className="flex items-center space-x-2"
                    >
                      {room.notifications ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                      <span>{room.notifications ? 'Silenciar' : 'Ativar'} Notificações</span>
                    </ContextMenuItem>
                    <ContextMenuItem 
                      onClick={() => openDeleteModal(room)}
                      className="flex items-center space-x-2 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Eliminar {room.isGroup ? 'Grupo' : 'Conversa'}</span>
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentRoom ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {currentRoom.isGroup ? (
                        <Users className="h-5 w-5" />
                      ) : (
                        currentRoom.name.slice(0, 2).toUpperCase()
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{currentRoom.name}</h3>
                    {currentRoom.isGroup ? (
                      <p className="text-sm text-gray-500">
                        {currentRoom.participants.length} membros
                      </p>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          currentRoom.isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                        <p className="text-sm text-gray-500">
                          {currentRoom.isOnline ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button size="icon" variant="ghost" className="h-9 w-9">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-9 w-9">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-9 w-9"
                    onClick={() => toggleNotifications(currentRoom.id)}
                  >
                    {currentRoom.notifications ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                  </Button>
                  <Button size="icon" variant="ghost" className="h-9 w-9">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {currentMessages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Sem mensagens ainda
                  </h3>
                  <p className="text-gray-600">
                    Envie a primeira mensagem para começar a conversa
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-w-4xl mx-auto">
                  {currentMessages.map((msg, index) => {
                    const isConsecutive = index > 0 && 
                      currentMessages[index - 1].sender === msg.sender &&
                      (msg.timestamp.getTime() - currentMessages[index - 1].timestamp.getTime()) < 5 * 60 * 1000;

                    return (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'} ${
                          isConsecutive ? 'mt-1' : 'mt-4'
                        }`}
                      >
                        <div className={`flex items-end space-x-2 max-w-[70%] ${
                          msg.isOwn ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                        }`}>
                          {!msg.isOwn && !isConsecutive && (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-gray-300 text-gray-700 text-xs">
                                {msg.senderName.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          {!msg.isOwn && isConsecutive && (
                            <div className="w-8"></div>
                          )}
                          
                          <div className={`rounded-2xl px-4 py-2 ${
                            msg.isOwn
                              ? 'bg-blue-600 text-white rounded-br-md'
                              : 'bg-white text-gray-900 shadow-sm border rounded-bl-md'
                          }`}>
                            {!msg.isOwn && !isConsecutive && (
                              <p className="text-xs font-medium mb-1 text-blue-600">
                                {msg.senderName}
                              </p>
                            )}
                            
                            {msg.type === 'file' && msg.attachment ? (
                              <div className="flex items-center space-x-2 mb-2">
                                <FileText className="h-4 w-4" />
                                <div>
                                  <p className="text-sm font-medium">{msg.attachment.name}</p>
                                  <p className="text-xs opacity-75">{msg.attachment.size}</p>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm">{msg.content}</p>
                            )}
                            
                            <div className="flex items-center justify-between mt-1">
                              <p className={`text-xs ${
                                msg.isOwn ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                {formatTime(msg.timestamp)}
                              </p>
                              {msg.isOwn && (
                                <div className="ml-2">
                                  {msg.isRead ? (
                                    <CheckCheck className="h-3 w-3 text-blue-100" />
                                  ) : (
                                    <Check className="h-3 w-3 text-blue-200" />
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Attachment Preview */}
            {attachmentPreview && (
              <div className="px-4 py-2 bg-yellow-50 border-t border-yellow-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Paperclip className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-yellow-800">
                      {attachmentPreview.name} ({(attachmentPreview.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setAttachmentPreview(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="p-4 bg-white border-t">
              <div className="flex items-end space-x-2">
                <div className="flex space-x-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileAttachment}
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex-1">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Escrever mensagem..."
                    className="min-h-[44px] max-h-32 resize-none"
                    rows={1}
                  />
                </div>
                
                <div className="flex space-x-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9"
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim() && !attachmentPreview}
                    className="h-9 px-4"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Bem-vindo ao Chat da Equipa
              </h3>
              <p className="text-gray-600 mb-6">
                Adicione um contato ou crie um grupo para começar a comunicar
              </p>
              <div className="space-x-2">
                <Button onClick={() => setShowAddContactModal(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Adicionar Contato
                </Button>
                <Button variant="outline" onClick={() => setShowCreateGroupModal(true)}>
                  <Users className="h-4 w-4 mr-2" />
                  Criar Grupo
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddContactModal
        isOpen={showAddContactModal}
        onClose={() => setShowAddContactModal(false)}
        onAddContact={handleAddContact}
      />
      
      <CreateGroupModal
        isOpen={showCreateGroupModal}
        onClose={() => setShowCreateGroupModal(false)}
        onCreateGroup={handleCreateGroup}
      />

      <DeleteConversationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setConversationToDelete(null);
        }}
        onDeleteConversation={handleDeleteConversation}
        conversationName={conversationToDelete?.name || ''}
        conversationId={conversationToDelete?.id || ''}
        isGroup={conversationToDelete?.isGroup || false}
      />

      <AddMembersModal
        isOpen={showAddMembersModal}
        onClose={() => {
          setShowAddMembersModal(false);
          setGroupToAddMembers(null);
        }}
        onAddMembers={handleAddMembers}
        groupId={groupToAddMembers?.id || ''}
        groupName={groupToAddMembers?.name || ''}
        currentMembers={groupToAddMembers?.participants || []}
      />
    </div>
  );
};
