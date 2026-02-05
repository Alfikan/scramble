import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getPublicRooms,
  getUserRooms,
  getRoomById,
  createRoom,
  joinRoom,
  leaveRoom,
  searchRooms,
} from '../services/roomService';

/**
 * Custom hook for managing study rooms
 */
export const useRooms = () => {
  const { user } = useAuth();
  const [publicRooms, setPublicRooms] = useState([]);
  const [userRooms, setUserRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch public rooms
  const fetchPublicRooms = async () => {
    setLoading(true);
    setError(null);
    
    const result = await getPublicRooms();
    
    if (result.success) {
      setPublicRooms(result.rooms);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  // Fetch user's rooms
  const fetchUserRooms = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    const result = await getUserRooms(user.uid);
    
    if (result.success) {
      setUserRooms(result.rooms);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  // Create a new room
  const handleCreateRoom = async (roomData) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    setLoading(true);
    setError(null);
    
    const result = await createRoom(roomData, user.uid);
    
    if (result.success) {
      await fetchUserRooms();
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  };

  // Join a room
  const handleJoinRoom = async (roomId) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    setLoading(true);
    setError(null);
    
    const result = await joinRoom(roomId, user.uid);
    
    if (result.success) {
      await fetchUserRooms();
      await fetchPublicRooms();
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  };

  // Leave a room
  const handleLeaveRoom = async (roomId) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    setLoading(true);
    setError(null);
    
    const result = await leaveRoom(roomId, user.uid);
    
    if (result.success) {
      await fetchUserRooms();
      await fetchPublicRooms();
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  };

  // Search rooms
  const handleSearchRooms = async (searchTerm) => {
    setLoading(true);
    setError(null);
    
    const result = await searchRooms(searchTerm);
    
    if (result.success) {
      setPublicRooms(result.rooms);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  };

  // Load rooms on mount
  useEffect(() => {
    fetchPublicRooms();
    if (user) {
      fetchUserRooms();
    }
  }, [user]);

  return {
    publicRooms,
    userRooms,
    loading,
    error,
    fetchPublicRooms,
    fetchUserRooms,
    createRoom: handleCreateRoom,
    joinRoom: handleJoinRoom,
    leaveRoom: handleLeaveRoom,
    searchRooms: handleSearchRooms,
  };
};