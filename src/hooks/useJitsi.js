import { useState, useEffect, useCallback, useRef } from 'react';
import {
  initJitsiMeet,
  disposeJitsiMeet,
  toggleAudio,
  toggleVideo,
  toggleScreenShare,
  hangUp,
  getParticipantCount,
  getMeetingURL,
  addJitsiEventListeners,
  removeJitsiEventListeners,
} from '../services/jitsiService';

/**
 * Custom hook for Jitsi Meet integration
 * @param {string} roomId - Room ID
 * @param {Object} userInfo - User information
 * @returns {Object} Jitsi state and controls
 */
export const useJitsi = (roomId, userInfo = {}) => {
  const [inCall, setInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const jitsiContainerRef = useRef(null);

  /**
   * Start Jitsi call
   */
  const startCall = useCallback(async () => {
    if (!roomId || loading || inCall) return;

    setLoading(true);
    setError(null);

    try {
      const containerID = 'jitsi-container';
      
      await initJitsiMeet(roomId, containerID, {
        displayName: userInfo.displayName || 'Student',
        email: userInfo.email || '',
      });

      // Add event listeners
      addJitsiEventListeners({
        onVideoConferenceJoined: () => {
          console.log('Joined conference');
          setInCall(true);
          setLoading(false);
        },
        onVideoConferenceLeft: () => {
          console.log('Left conference');
          setInCall(false);
        },
        onParticipantJoined: () => {
          setParticipantCount(getParticipantCount());
        },
        onParticipantLeft: () => {
          setParticipantCount(getParticipantCount());
        },
        onAudioMuteStatusChanged: ({ muted }) => {
          setIsMuted(muted);
        },
        onVideoMuteStatusChanged: ({ muted }) => {
          setIsVideoOff(muted);
        },
      });

      setInCall(true);
    } catch (err) {
      console.error('Error starting Jitsi call:', err);
      setError(err.message || 'Failed to start call');
      setLoading(false);
    }
  }, [roomId, userInfo, loading, inCall]);

  /**
   * End Jitsi call
   */
  const endCall = useCallback(() => {
    if (!inCall) return;

    try {
      hangUp();
      removeJitsiEventListeners();
      disposeJitsiMeet();
      setInCall(false);
      setIsMuted(false);
      setIsVideoOff(false);
      setParticipantCount(0);
    } catch (err) {
      console.error('Error ending call:', err);
      setError(err.message);
    }
  }, [inCall]);

  /**
   * Toggle microphone
   */
  const toggleMic = useCallback(async () => {
    try {
      const newMutedState = await toggleAudio();
      setIsMuted(newMutedState);
    } catch (err) {
      console.error('Error toggling mic:', err);
    }
  }, []);

  /**
   * Toggle camera
   */
  const toggleCam = useCallback(async () => {
    try {
      const newVideoOffState = await toggleVideo();
      setIsVideoOff(newVideoOffState);
    } catch (err) {
      console.error('Error toggling camera:', err);
    }
  }, []);

  /**
   * Toggle screen share
   */
  const shareScreen = useCallback(() => {
    try {
      toggleScreenShare();
    } catch (err) {
      console.error('Error sharing screen:', err);
    }
  }, []);

  /**
   * Get meeting URL
   */
  const getMeetingLink = useCallback(() => {
    return getMeetingURL(roomId);
  }, [roomId]);

  /**
   * Copy meeting link to clipboard
   */
  const copyMeetingLink = useCallback(async () => {
    try {
      const link = getMeetingLink();
      await navigator.clipboard.writeText(link);
      return true;
    } catch (err) {
      console.error('Error copying link:', err);
      return false;
    }
  }, [getMeetingLink]);

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
    participantCount,
    loading,
    error,
    startCall,
    endCall,
    toggleMic,
    toggleVideo: toggleCam,
    shareScreen,
    getMeetingLink,
    copyMeetingLink,
    jitsiContainerRef,
  };
};
