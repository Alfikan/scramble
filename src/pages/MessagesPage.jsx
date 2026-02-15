import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
} from 'lucide-react';

import Card from '../components/common/Card';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';

/**
 * Messages Page - Direct messaging between users
 */
const MessagesPage = () => {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  // Mock conversations
  const [conversations] = useState([
    {
      id: 1,
      userId: '2',
      name: 'Sarah Johnson',
      avatar: null,
      lastMessage: 'Hey! Are you free to study later?',
      timestamp: new Date(Date.now() - 300000),
      unread: 2,
      online: true,
    },
    {
      id: 2,
      userId: '3',
      name: 'Mike Chen',
      avatar: null,
      lastMessage: 'Thanks for the notes!',
      timestamp: new Date(Date.now() - 3600000),
      unread: 0,
      online: false,
    },
    {
      id: 3,
      userId: '4',
      name: 'Emma Davis',
      avatar: null,
      lastMessage: 'Did you finish the assignment?',
      timestamp: new Date(Date.now() - 7200000),
      unread: 1,
      online: true,
    },
    {
      id: 4,
      userId: '5',
      name: 'Study Group - CS101',
      avatar: null,
      lastMessage: 'Meeting at 3 PM tomorrow',
      timestamp: new Date(Date.now() - 86400000),
      unread: 0,
      online: false,
      isGroup: true,
    },
  ]);

  // Mock messages for selected chat
  const [messages] = useState({
    1: [
      {
        id: 1,
        senderId: '2',
        text: 'Hey! How are you?',
        timestamp: new Date(Date.now() - 3600000),
        read: true,
      },
      {
        id: 2,
        senderId: user?.uid,
        text: "I'm good! Just studying for the exam.",
        timestamp: new Date(Date.now() - 3500000),
        read: true,
      },
      {
        id: 3,
        senderId: '2',
        text: 'Same here! Want to study together?',
        timestamp: new Date(Date.now() - 3400000),
        read: true,
      },
      {
        id: 4,
        senderId: user?.uid,
        text: 'Sure! When are you free?',
        timestamp: new Date(Date.now() - 3300000),
        read: true,
      },
      {
        id: 5,
        senderId: '2',
        text: 'Hey! Are you free to study later?',
        timestamp: new Date(Date.now() - 300000),
        read: false,
      },
    ],
  });

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    // TODO: Implement send message
    setMessage('');
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString();
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-cool-blue-gray">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-muted-gray border-opacity-20">
        <div className="container-app py-4 md:py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-info-blue to-soft-purple rounded-xl flex items-center justify-center">
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-primary-black">Messages</h1>
              <p className="text-xs md:text-sm text-muted-gray">
                Chat with your study partners
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-app py-4 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <Card className="lg:col-span-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-muted-gray border-opacity-20">
              <Input
                placeholder="Search conversations..."
                leftIcon={<Search size={18} />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedChat(conv)}
                  className={`w-full p-4 flex items-center space-x-3 hover:bg-light-cream transition-colors border-b border-muted-gray border-opacity-10 ${
                    selectedChat?.id === conv.id ? 'bg-light-cream' : ''
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <Avatar
                      src={conv.avatar}
                      name={conv.name}
                      size="md"
                      online={conv.online}
                    />
                    {conv.unread > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-vibrant-orange rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">
                          {conv.unread}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-primary-black truncate text-sm">
                        {conv.name}
                      </h3>
                      <span className="text-xs text-muted-gray flex-shrink-0 ml-2">
                        {formatTime(conv.timestamp)}
                      </span>
                    </div>
                    <p
                      className={`text-sm truncate ${
                        conv.unread > 0
                          ? 'text-primary-black font-medium'
                          : 'text-muted-gray'
                      }`}
                    >
                      {conv.lastMessage}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 flex flex-col overflow-hidden">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-muted-gray border-opacity-20 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar
                      src={selectedChat.avatar}
                      name={selectedChat.name}
                      size="md"
                      online={selectedChat.online}
                    />
                    <div>
                      <h3 className="font-semibold text-primary-black">
                        {selectedChat.name}
                      </h3>
                      <p className="text-xs text-muted-gray">
                        {selectedChat.online ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-light-cream rounded-lg transition-colors">
                      <Phone size={20} className="text-muted-gray" />
                    </button>
                    <button className="p-2 hover:bg-light-cream rounded-lg transition-colors">
                      <Video size={20} className="text-muted-gray" />
                    </button>
                    <button className="p-2 hover:bg-light-cream rounded-lg transition-colors">
                      <MoreVertical size={20} className="text-muted-gray" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages[selectedChat.id]?.map((msg) => {
                    const isOwn = msg.senderId === user?.uid;

                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] ${
                            isOwn ? 'order-2' : 'order-1'
                          }`}
                        >
                          <div
                            className={`px-4 py-2 rounded-2xl ${
                              isOwn
                                ? 'bg-vibrant-orange text-white rounded-br-none'
                                : 'bg-light-cream text-primary-black rounded-bl-none'
                            }`}
                          >
                            <p className="text-sm">{msg.text}</p>
                          </div>
                          <div
                            className={`flex items-center space-x-1 mt-1 px-2 ${
                              isOwn ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <span className="text-xs text-muted-gray">
                              {formatTime(msg.timestamp)}
                            </span>
                            {isOwn && (
                              <>
                                {msg.read ? (
                                  <CheckCheck size={14} className="text-info-blue" />
                                ) : (
                                  <Check size={14} className="text-muted-gray" />
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-muted-gray border-opacity-20">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-light-cream rounded-lg transition-colors flex-shrink-0">
                      <Paperclip size={20} className="text-muted-gray" />
                    </button>
                    <Input
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === 'Enter' && !e.shiftKey && handleSendMessage()
                      }
                      className="flex-1"
                    />
                    <button className="p-2 hover:bg-light-cream rounded-lg transition-colors flex-shrink-0">
                      <Smile size={20} className="text-muted-gray" />
                    </button>
                    <Button
                      variant="primary"
                      leftIcon={<Send size={18} />}
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      className="flex-shrink-0"
                    >
                      <span className="hidden sm:inline">Send</span>
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div>
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-gray opacity-50" />
                  <h3 className="text-xl font-semibold text-primary-black mb-2">
                    No conversation selected
                  </h3>
                  <p className="text-muted-gray">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
