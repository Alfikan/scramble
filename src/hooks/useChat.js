import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { sendMessage, subscribeToMessages } from '../services/chatService';

/**
 * Custom hook for managing chat
 */
export const useChat = (roomId) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  // Subscribe to messages
  useEffect(() => {
    if (!roomId) return;

    setLoading(true);
    
    const unsubscribe = subscribeToMessages(roomId, (newMessages) => {
      setMessages(newMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [roomId]);

  // Send a message
  const handleSendMessage = useCallback(async (text, messageType = 'text') => {
    if (!user || !text.trim()) return { success: false, error: 'Invalid message' };

    setSending(true);
    setError(null);

    const result = await sendMessage(
      roomId,
      user.uid,
      user.displayName || 'Anonymous',
      user.photoURL,
      text,
      messageType
    );

    if (!result.success) {
      setError(result.error);
    }

    setSending(false);
    return result;
  }, [roomId, user]);

  return {
    messages,
    loading,
    sending,
    error,
    sendMessage: handleSendMessage,
  };
};