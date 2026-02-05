import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs,
  query,
  where,
  limit,
  updateDoc, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { updateUserStats, updateStudyStreak } from './userService';

/**
 * Study Session Service
 * Handles study timer and session tracking
 */

// Start a new study session
export const startStudySession = async (userId, sessionData) => {
  try {
    const sessionRef = await addDoc(collection(db, 'studySessions'), {
      userId,
      subject: sessionData.subject || 'General',
      roomId: sessionData.roomId || null,
      startTime: serverTimestamp(),
      endTime: null,
      duration: 0,
      isActive: true,
      breaks: [],
      notes: sessionData.notes || '',
      createdAt: serverTimestamp(),
    });

    return { success: true, sessionId: sessionRef.id };
  } catch (error) {
    console.error('Error starting study session:', error);
    return { success: false, error: error.message };
  }
};

// End a study session
export const endStudySession = async (sessionId, userId) => {
  try {
    const sessionRef = doc(db, 'studySessions', sessionId);
    const sessionSnap = await getDoc(sessionRef);

    if (!sessionSnap.exists()) {
      return { success: false, error: 'Session not found' };
    }

    const sessionData = sessionSnap.data();
    const startTime = sessionData.startTime.toDate();
    const endTime = new Date();
    const duration = Math.floor((endTime - startTime) / 1000 / 60); // Duration in minutes

    await updateDoc(sessionRef, {
      endTime: serverTimestamp(),
      duration,
      isActive: false,
      updatedAt: serverTimestamp(),
    });

    // Update user stats
    const hours = duration / 60;
    await updateUserStats(userId, {
      totalStudyHours: hours,
    });

    // Update study streak
    await updateStudyStreak(userId);

    // Award XP based on study time (10 XP per 15 minutes)
    const xpEarned = Math.floor(duration / 15) * 10;
    if (xpEarned > 0) {
      await updateUserStats(userId, {
        xp: xpEarned,
      });
    }

    return { 
      success: true, 
      duration, 
      xpEarned,
      session: {
        id: sessionId,
        ...sessionData,
        endTime,
        duration,
      }
    };
  } catch (error) {
    console.error('Error ending study session:', error);
    return { success: false, error: error.message };
  }
};

// Add a break to study session
export const addBreakToSession = async (sessionId, breakData) => {
  try {
    const sessionRef = doc(db, 'studySessions', sessionId);
    const sessionSnap = await getDoc(sessionRef);

    if (!sessionSnap.exists()) {
      return { success: false, error: 'Session not found' };
    }

    const sessionData = sessionSnap.data();
    const breaks = sessionData.breaks || [];
    
    breaks.push({
      startTime: Timestamp.now(),
      endTime: null,
      duration: 0,
    });

    await updateDoc(sessionRef, {
      breaks,
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error adding break:', error);
    return { success: false, error: error.message };
  }
};

// End a break
export const endBreak = async (sessionId, breakIndex) => {
  try {
    const sessionRef = doc(db, 'studySessions', sessionId);
    const sessionSnap = await getDoc(sessionRef);

    if (!sessionSnap.exists()) {
      return { success: false, error: 'Session not found' };
    }

    const sessionData = sessionSnap.data();
    const breaks = sessionData.breaks || [];
    
    if (breakIndex >= breaks.length) {
      return { success: false, error: 'Break not found' };
    }

    const breakData = breaks[breakIndex];
    const startTime = breakData.startTime.toDate();
    const endTime = new Date();
    const duration = Math.floor((endTime - startTime) / 1000 / 60); // Duration in minutes

    breaks[breakIndex] = {
      ...breakData,
      endTime: Timestamp.now(),
      duration,
    };

    await updateDoc(sessionRef, {
      breaks,
      updatedAt: serverTimestamp(),
    });

    return { success: true, duration };
  } catch (error) {
    console.error('Error ending break:', error);
    return { success: false, error: error.message };
  }
};

// Get active session for user
export const getActiveSession = async (userId) => {
  try {
    const sessionsRef = collection(db, 'studySessions');
    const q = query(
      sessionsRef,
      where('userId', '==', userId),
      where('isActive', '==', true),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { success: true, session: null };
    }

    const sessionDoc = querySnapshot.docs[0];
    return {
      success: true,
      session: {
        id: sessionDoc.id,
        ...sessionDoc.data(),
      },
    };
  } catch (error) {
    console.error('Error fetching active session:', error);
    return { success: false, error: error.message, session: null };
  }
};

// Update session notes
export const updateSessionNotes = async (sessionId, notes) => {
  try {
    const sessionRef = doc(db, 'studySessions', sessionId);
    
    await updateDoc(sessionRef, {
      notes,
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating session notes:', error);
    return { success: false, error: error.message };
  }
};