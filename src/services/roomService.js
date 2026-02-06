import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Room Service
 * Handles all room-related Firebase operations
 */

// Create a new study room
export const createRoom = async (roomData, userId) => {
  try {
    const roomRef = await addDoc(collection(db, 'rooms'), {
      ...roomData,
      createdBy: userId,
      members: [userId],
      memberCount: 1,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { success: true, roomId: roomRef.id };
  } catch (error) {
    console.error('Error creating room:', error);
    return { success: false, error: error.message };
  }
};

// Get all public rooms
export const getPublicRooms = async () => {
  try {
    const q = query(
      collection(db, 'rooms'),
      where('isPublic', '==', true),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const querySnapshot = await getDocs(q);
    const rooms = [];
    
    querySnapshot.forEach((doc) => {
      rooms.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return { success: true, rooms };
  } catch (error) {
    console.error('Error fetching public rooms:', error);
    return { success: false, error: error.message, rooms: [] };
  }
};

// Get user's rooms
export const getUserRooms = async (userId) => {
  try {
    const q = query(
      collection(db, 'rooms'),
      where('members', 'array-contains', userId),
      where('isActive', '==', true)
    );

    const querySnapshot = await getDocs(q);
    const rooms = [];
    
    querySnapshot.forEach((doc) => {
      rooms.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Sort by updatedAt on client side
    rooms.sort((a, b) => {
      const aTime = a.updatedAt?.toMillis() || 0;
      const bTime = b.updatedAt?.toMillis() || 0;
      return bTime - aTime;
    });

    return { success: true, rooms };
  } catch (error) {
    console.error('Error fetching user rooms:', error);
    return { success: false, error: error.message, rooms: [] };
  }
};

// Get room by ID
export const getRoomById = async (roomId) => {
  try {
    const roomRef = doc(db, 'rooms', roomId);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) {
      return { success: false, error: 'Room not found' };
    }

    return {
      success: true,
      room: {
        id: roomSnap.id,
        ...roomSnap.data(),
      },
    };
  } catch (error) {
    console.error('Error fetching room:', error);
    return { success: false, error: error.message };
  }
};

// Join a room
export const joinRoom = async (roomId, userId) => {
  try {
    const roomRef = doc(db, 'rooms', roomId);
    
    await updateDoc(roomRef, {
      members: arrayUnion(userId),
      memberCount: increment(1),
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error joining room:', error);
    return { success: false, error: error.message };
  }
};

// Leave a room
export const leaveRoom = async (roomId, userId) => {
  try {
    const roomRef = doc(db, 'rooms', roomId);
    
    await updateDoc(roomRef, {
      members: arrayRemove(userId),
      memberCount: increment(-1),
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error leaving room:', error);
    return { success: false, error: error.message };
  }
};

// Update room
export const updateRoom = async (roomId, updates) => {
  try {
    const roomRef = doc(db, 'rooms', roomId);
    
    await updateDoc(roomRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating room:', error);
    return { success: false, error: error.message };
  }
};

// Delete room
export const deleteRoom = async (roomId) => {
  try {
    const roomRef = doc(db, 'rooms', roomId);
    await deleteDoc(roomRef);

    return { success: true };
  } catch (error) {
    console.error('Error deleting room:', error);
    return { success: false, error: error.message };
  }
};

// Search rooms
export const searchRooms = async (searchTerm) => {
  try {
    // Note: Firestore doesn't support full-text search natively
    // For production, consider using Algolia or similar service
    const q = query(
      collection(db, 'rooms'),
      where('isPublic', '==', true),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const querySnapshot = await getDocs(q);
    const rooms = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Client-side filtering
      if (
        data.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.description?.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        rooms.push({
          id: doc.id,
          ...data,
        });
      }
    });

    return { success: true, rooms };
  } catch (error) {
    console.error('Error searching rooms:', error);
    return { success: false, error: error.message, rooms: [] };
  }
};