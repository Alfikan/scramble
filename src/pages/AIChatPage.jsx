import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Bot,
  User,
  Sparkles,
  BookOpen,
  Brain,
  Lightbulb,
  MessageCircle,
  Trash2,
} from 'lucide-react';

import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { sendMessageToAI, explainConcept } from '../services/aiService';

const AIChatPage = () => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "Hello! I'm your AI study assistant powered by Google Gemini. I can help you understand concepts, generate quizzes, create flashcards, and answer your study-related questions. How can I help you today?",
      timestamp: new Date(),
      source: 'system',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickActions = [
    { icon: BookOpen, label: 'Explain a concept', action: 'explain' },
    { icon: Brain, label: 'Generate quiz', action: 'quiz' },
    { icon: Lightbulb, label: 'Study tips', action: 'tips' },
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Get AI response with conversation history
      const response = await sendMessageToAI(inputMessage, messages);

      setIsTyping(false);

      if (response.success) {
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          text: response.message,
          timestamp: response.timestamp,
          source: response.source,
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        // Show error message
        const errorMessage = {
          id: Date.now() + 1,
          type: 'ai',
          text: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
          isError: true,
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: 'Sorry, something went wrong. Please try again.',
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleQuickAction = async (action) => {
    let message = '';
    switch (action) {
      case 'explain':
        message = 'Can you explain a concept to me?';
        break;
      case 'quiz':
        message = 'I want to take a quiz';
        break;
      case 'tips':
        message = 'Give me some study tips';
        break;
      default:
        return;
    }
    setInputMessage(message);
  };

  const handleClearChat = () => {
    if (window.confirm('Clear all messages?')) {
      setMessages([
        {
          id: 1,
          type: 'ai',
          text: "Chat cleared! How can I help you today?",
          timestamp: new Date(),
        },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-cool-blue-gray">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-muted-gray border-opacity-20">
        <div className="container-app py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-vibrant-orange to-soft-purple rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-bold text-primary-black">
                  AI Study Assistant
                </h1>
                <p className="text-xs md:text-sm text-muted-gray">
                  Your personal AI tutor
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Trash2 size={16} />}
              onClick={handleClearChat}
              className="hidden md:flex"
            >
              Clear Chat
            </Button>
          </div>
        </div>
      </div>

      <div className="container-app py-4 md:py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="flex flex-col h-[calc(100vh-250px)] md:h-[calc(100vh-280px)]">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex space-x-2 md:space-x-3 max-w-[85%] md:max-w-2xl ${
                      message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === 'ai'
                          ? 'bg-gradient-to-br from-vibrant-orange to-soft-purple'
                          : 'bg-info-blue'
                      }`}
                    >
                      {message.type === 'ai' ? (
                        <Bot className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      ) : (
                        <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div
                        className={`px-3 md:px-4 py-2 md:py-3 rounded-lg text-sm md:text-base ${
                          message.type === 'user'
                            ? 'bg-vibrant-orange text-white'
                            : message.isError
                            ? 'bg-warning-red bg-opacity-10 text-warning-red border border-warning-red'
                            : 'bg-light-cream text-primary-black'
                        }`}
                      >
                        {message.text}
                      </div>
                      <div className="flex items-center space-x-2 mt-1 px-1">
                        <p className="text-xs text-muted-gray">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        {message.source === 'gemini' && (
                          <span className="text-xs text-success-green flex items-center">
                            <Sparkles size={10} className="mr-1" />
                            AI
                          </span>
                        )}
                        {message.source === 'fallback' && (
                          <span className="text-xs text-muted-gray">
                            Fallback
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-vibrant-orange to-soft-purple flex items-center justify-center">
                      <Bot className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div className="bg-light-cream px-4 py-3 rounded-lg flex items-center space-x-2">
                      <LoadingSpinner size="sm" />
                      <span className="text-sm text-muted-gray">Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-4 md:px-6 py-3 border-t border-muted-gray border-opacity-20">
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.action}
                      onClick={() => handleQuickAction(action.action)}
                      className="flex items-center space-x-2 px-3 py-2 bg-light-cream hover:bg-vibrant-orange hover:text-white rounded-lg transition-colors text-xs md:text-sm"
                    >
                      <Icon size={14} />
                      <span>{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-3 md:p-4 border-t border-muted-gray border-opacity-20">
              <div className="flex space-x-2">
                <Input
                  placeholder="Ask me anything about your studies..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  disabled={isTyping}
                  className="flex-1"
                />
                <Button
                  variant="primary"
                  leftIcon={<Send size={18} />}
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="flex-shrink-0"
                >
                  <span className="hidden sm:inline">Send</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;
