import { useState, useEffect, useCallback, useRef } from 'react';
import {
  initializeAgora,
  joinCall,
  leaveCall,
  toggleMicrophone,
  toggleCamera,
  playLocalVideo,
  playRemoteVideo,
  subscribeToUserEvents,
  unsubscribeFromUserEvents,
  getClient,
  getRemoteUsers
} from '../services/agoraService';

/**
 * Custom hook for Agora video calling
 * @param {string} roomId - Room ID to join
 * @param {string} userId - User ID
 * @returns {Object} Agora state and controls
 */
export const useAgora = (roomId, userId) => {
  const [inCall, setInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState(null);
  
  const clientRef = useRef(null);
  const localTracksRef = useRef({ audio: null, video: null });

  /**
   * Handle user joined event
   */
  const handleUserJoined = useCallback((user) => {
    console.log('User joined:', user.uid);
    setRemoteUsers(prev => {
      if (prev.find(u => u.uid === user.uid)) return prev;
      return [...prev, user];
    });
  }, []);

  /**
   * Handle user left event
   */
  const handleUserLeft = useCallback((user) => {
    console.log('User left:', user.uid);
    setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
  }, []);

  /**
   * Handle user published track
   */
  const handleUserPublished = useCallback(async (user, mediaType) => {
    console.log('User published:', user.uid, mediaType);
    
    const client = getClient();
    if (!client) return;

    // Subscribe to the remote user
    await client.subscribe(user, mediaType);
    
    // Update remote users list
    setRemoteUsers(prev => {
      const index = prev.findIndex(u => u.uid === user.uid);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = user;
        return updated;
      }
      return [...prev, user];
    });
  }, []);

  /**
   * Handle user unpublished track
   */
  const handleUserUnpublished = useCallback((user, mediaType) => {
    console.log('User unpublished:', user.uid, mediaType);
    
    setRemoteUsers(prev => {
      const index = prev.findIndex(u => u.uid === user.uid);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = user;
        return updated;
      }
      return prev;
    });
  }, []);

  /**
   * Join the video call
   */
  const startCall = useCallback(async () => {
    if (!roomId || !userId || joining || inCall) return;

    setJoining(true);
    setError(null);

    try {
      // Initialize Agora
      initializeAgora();

      // Join the call
      const result = await joinCall(roomId, userId);

      if (result.success) {
        clientRef.current = result.client;
        localTracksRef.current = {
          audio: result.localAudioTrack,
          video: result.localVideoTrack
        };

        // Subscribe to user events
        subscribeToUserEvents(
          handleUserJoined,
          handleUserLeft,
          handleUserPublished,
          handleUserUnpublished
        );

        // Get existing remote users
        const existingUsers = getRemoteUsers();
        setRemoteUsers(existingUsers);

        setInCall(true);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error starting call:', err);
      setError(err.message);
    } finally {
      setJoining(false);
    }
  }, [roomId, userId, joining, inCall, handleUserJoined, handleUserLeft, handleUserPublished, handleUserUnpublished]);

  /**
   * Leave the video call
   */
  const endCall = useCallback(async () => {
    if (!inCall) return;

    try {
      // Unsubscribe from events
      unsubscribeFromUserEvents();

      // Leave the call
      await leaveCall();

      // Reset state
      setInCall(false);
      setIsMuted(false);
      setIsVideoOff(false);
      setRemoteUsers([]);
      clientRef.current = null;
      localTracksRef.current = { audio: null, video: null };
    } catch (err) {
      console.error('Error ending call:', err);
      setError(err.message);
    }
  }, [inCall]);

  /**
   * Toggle microphone
   */
  const toggleMic = useCallback(async () => {
    const newMutedState = await toggleMicrophone(!isMuted);
    setIsMuted(newMutedState);
  }, [isMuted]);

  /**
   * Toggle camera
   */
  const toggleVideo = useCallback(async () => {
    const newVideoOffState = await toggleCamera(!isVideoOff);
    setIsVideoOff(newVideoOffState);
  }, [isVideoOff]);

  /**
   * Play local video in container
   */
  const playLocal = useCallback((containerId) => {
    playLocalVideo(containerId);
  }, []);

  /**
   * Play remote video in container
   */
  const playRemote = useCallback((user, containerId) => {
    playRemoteVideo(user, containerId);
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (inCall) {
        endCall();
      }
    };
  }, [inCall, endCall]);

  return {
    inCall,
    isMuted,
    isVideoOff,
    remoteUsers,
    joining,
    error,
    startCall,
    endCall,
    toggleMic,
    toggleVideo,
    playLocal,
    playRemote
  };
};
