import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  startStudySession,
  endStudySession,
  addBreakToSession,
  endBreak,
  getActiveSession,
  updateSessionNotes,
} from '../services/studySessionService';

/**
 * Custom hook for managing study sessions
 */
export const useStudySession = () => {
  const { user } = useAuth();
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isOnBreak, setIsOnBreak] = useState(false);

  // Fetch active session
  const fetchActiveSession = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    const result = await getActiveSession(user.uid);
    
    if (result.success && result.session) {
      setActiveSession(result.session);
      
      // Calculate elapsed time
      const startTime = result.session.startTime.toDate();
      const now = new Date();
      const elapsed = Math.floor((now - startTime) / 1000); // seconds
      setElapsedTime(elapsed);
      
      // Check if on break
      const breaks = result.session.breaks || [];
      const lastBreak = breaks[breaks.length - 1];
      if (lastBreak && !lastBreak.endTime) {
        setIsOnBreak(true);
      }
    } else {
      setActiveSession(null);
    }
    
    setLoading(false);
  }, [user]);

  // Start a new session
  const startSession = async (sessionData) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    setLoading(true);
    setError(null);
    
    const result = await startStudySession(user.uid, sessionData);
    
    if (result.success) {
      await fetchActiveSession();
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  };

  // End the current session
  const endSession = async () => {
    if (!activeSession) return { success: false, error: 'No active session' };
    
    setLoading(true);
    setError(null);
    
    const result = await endStudySession(activeSession.id, user.uid);
    
    if (result.success) {
      setActiveSession(null);
      setElapsedTime(0);
      setIsOnBreak(false);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  };

  // Start a break
  const startBreak = async () => {
    if (!activeSession) return { success: false, error: 'No active session' };
    
    setLoading(true);
    setError(null);
    
    const result = await addBreakToSession(activeSession.id, {});
    
    if (result.success) {
      setIsOnBreak(true);
      await fetchActiveSession();
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  };

  // End the current break
  const endCurrentBreak = async () => {
    if (!activeSession || !isOnBreak) {
      return { success: false, error: 'No active break' };
    }
    
    setLoading(true);
    setError(null);
    
    const breaks = activeSession.breaks || [];
    const breakIndex = breaks.length - 1;
    
    const result = await endBreak(activeSession.id, breakIndex);
    
    if (result.success) {
      setIsOnBreak(false);
      await fetchActiveSession();
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  };

  // Update session notes
  const updateNotes = async (notes) => {
    if (!activeSession) return { success: false, error: 'No active session' };
    
    const result = await updateSessionNotes(activeSession.id, notes);
    
    if (result.success) {
      setActiveSession(prev => ({ ...prev, notes }));
    }
    
    return result;
  };

  // Timer effect
  useEffect(() => {
    if (!activeSession || isOnBreak) return;
    
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [activeSession, isOnBreak]);

  // Load active session on mount
  useEffect(() => {
    fetchActiveSession();
  }, [fetchActiveSession]);

  // Format elapsed time
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return {
      hours,
      minutes,
      seconds: secs,
      formatted: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`,
    };
  };

  return {
    activeSession,
    loading,
    error,
    elapsedTime,
    formattedTime: formatTime(elapsedTime),
    isOnBreak,
    startSession,
    endSession,
    startBreak,
    endBreak: endCurrentBreak,
    updateNotes,
    refreshSession: fetchActiveSession,
  };
};