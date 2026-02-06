import { 
  collection, 
  doc, 
  addDoc, 
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Chat Service
 * Handles real-time messaging
 */

// Send a message
export const sendMessage = async (roomId, userId, userName, userAvatar, text, messageType = 'text') => {
  try {
    const messageData = {
      roomId,
      userId,
      userName,
      userAvatar,
      text,
      messageType, // 'text', 'image', 'file'
      timestamp: serverTimestamp(),
      edited: false,
      deleted: false,
    };

    const docRef = await addDoc(collection(db, 'messages'), messageData);

    return {
      success: true,
      messageId: docRef.id,
      message: { id: docRef.id, ...messageData },
    };
  } catch (error) {
    console.error('Error sending message:', error);
    return { success: false, error: error.message };
  }
};

// Subscribe to messages (real-time)
export const subscribeToMessages = (roomId, callback, limitCount = 50) => {
  const q = query(
    collection(db, 'messages'),
    where('roomId', '==', roomId),
    where('deleted', '==', false),
    orderBy('timestamp', 'asc'),
    limit(limitCount)
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    callback(messages);
  }, (error) => {
    console.error('Error subscribing to messages:', error);
    callback([]);
  });

  return unsubscribe;
};

// Format timestamp for display
export const formatMessageTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  // Less than 1 minute
  if (diff < 60000) return 'Just now';
  
  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  }
  
  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ago`;
  }
  
  // Less than 7 days
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days}d ago`;
  }
  
  // Format as date
  return date.toLocaleDateString();
};

// Group messages by date
export const groupMessagesByDate = (messages) => {
  const groups = {};
  
  messages.forEach(message => {
    const date = message.timestamp?.toDate ? message.timestamp.toDate() : new Date(message.timestamp);
    const dateKey = date.toLocaleDateString();
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    
    groups[dateKey].push(message);
  });
  
  return groups;
};