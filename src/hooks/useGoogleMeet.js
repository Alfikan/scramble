import { useState, useCallback, useEffect } from 'react';
import {
  createMeeting,
  generateSimpleMeetLink,
  joinMeeting,
  deleteMeeting,
  getMeetingDetails,
  loadGoogleAPI,
  isAuthenticated,
} from '../services/googleMeetService';

/**
 * Custom hook for Google Meet integration
 * @param {string} roomId - Room ID
 * @param {string} roomName - Room name
 * @returns {Object} Google Meet state and controls
 */
export const useGoogleMeet = (roomId, roomName) => {
  const [meetLink, setMeetLink] = useState(null);
  const [meetingId, setMeetingId] = useState(null);
  const [inCall, setInCall] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isApiLoaded, setIsApiLoaded] = useState(false);

  // Load Google API on mount
  useEffect(() => {
    const initAPI = async () => {
      try {
        await loadGoogleAPI();
        setIsApiLoaded(true);
      } catch (err) {
        console.error('Failed to load Google API:', err);
        setError('Failed to load Google Meet API');
      }
    };

    initAPI();
  }, []);

  /**
   * Create and start a Google Meet call
   * @param {boolean} useSimpleLink - Use simple meet link without Calendar API
   */
  const startCall = useCallback(async (useSimpleLink = true) => {
    if (!roomId || loading || inCall) return;

    setLoading(true);
    setError(null);

    try {
      let result;

      if (useSimpleLink) {
        // Use simple Meet link (no authentication required)
        result = generateSimpleMeetLink(roomId);
      } else {
        // Use Calendar API (requires authentication)
        result = await createMeeting(roomName || 'Study Room', roomId);
      }

      if (result.success) {
        setMeetLink(result.meetLink);
        setMeetingId(result.meetingId || result.meetingCode);
        setInCall(true);

        // Open Meet in new window
        joinMeeting(result.meetLink, true);
      } else {
        setError(result.error || 'Failed to create meeting');
      }
    } catch (err) {
      console.error('Error starting call:', err);
      setError(err.message || 'Failed to start call');
    } finally {
      setLoading(false);
    }
  }, [roomId, roomName, loading, inCall]);

  /**
   * Join an existing Google Meet call
   */
  const joinCall = useCallback((link) => {
    if (!link) return;

    setMeetLink(link);
    setInCall(true);
    joinMeeting(link, true);
  }, []);

  /**
   * End the Google Meet call
   */
  const endCall = useCallback(async () => {
    if (!inCall) return;

    try {
      // If we have a meeting ID and it's not a simple link, delete the calendar event
      if (meetingId && !meetLink?.includes('meet.google.com/')) {
        await deleteMeeting(meetingId);
      }

      setInCall(false);
      setMeetLink(null);
      setMeetingId(null);
    } catch (err) {
      console.error('Error ending call:', err);
      // Still end the call locally even if deletion fails
      setInCall(false);
      setMeetLink(null);
      setMeetingId(null);
    }
  }, [inCall, meetingId, meetLink]);

  /**
   * Get current meeting details
   */
  const getMeetingInfo = useCallback(async () => {
    if (!meetingId) return null;

    try {
      const result = await getMeetingDetails(meetingId);
      return result.success ? result.meeting : null;
    } catch (err) {
      console.error('Error getting meeting info:', err);
      return null;
    }
  }, [meetingId]);

  /**
   * Open Meet link in new window
   */
  const openMeetWindow = useCallback(() => {
    if (meetLink) {
      joinMeeting(meetLink, true);
    }
  }, [meetLink]);

  /**
   * Copy Meet link to clipboard
   */
  const copyMeetLink = useCallback(async () => {
    if (!meetLink) return false;

    try {
      await navigator.clipboard.writeText(meetLink);
      return true;
    } catch (err) {
      console.error('Error copying link:', err);
      return false;
    }
  }, [meetLink]);

  return {
    meetLink,
    meetingId,
    inCall,
    loading,
    error,
    isApiLoaded,
    isAuthenticated: isAuthenticated(),
    startCall,
    joinCall,
    endCall,
    getMeetingInfo,
    openMeetWindow,
    copyMeetLink,
  };
};
