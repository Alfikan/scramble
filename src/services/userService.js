import { 
  doc, 
  getDoc, 
  updateDoc, 
  serverTimestamp,
  increment,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * User Service
 * Handles all user-related Firebase operations
 */

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return { success: false, error: 'User not found' };
    }

    return {
      success: true,
      user: {
        uid: userSnap.id,
        ...userSnap.data(),
      },
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { success: false, error: error.message };
  }
};

// Update user profile
export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: error.message };
  }
};

// Update user stats
export const updateUserStats = async (userId, statUpdates) => {
  try {
    const userRef = doc(db, 'users', userId);
    const updates = {};

    // Build the update object with increment operations
    Object.keys(statUpdates).forEach(key => {
      updates[`stats.${key}`] = increment(statUpdates[key]);
    });

    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating user stats:', error);
    return { success: false, error: error.message };
  }
};

// Add badge to user
export const addBadgeToUser = async (userId, badgeId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return { success: false, error: 'User not found' };
    }

    const userData = userSnap.data();
    const badges = userData.badges || [];

    if (!badges.includes(badgeId)) {
      badges.push(badgeId);
      
      await updateDoc(userRef, {
        badges,
        updatedAt: serverTimestamp(),
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error adding badge:', error);
    return { success: false, error: error.message };
  }
};

// Get user's study sessions
export const getUserStudySessions = async (userId, limitCount = 10) => {
  try {
    const q = query(
      collection(db, 'studySessions'),
      where('userId', '==', userId),
      orderBy('startTime', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const sessions = [];
    
    querySnapshot.forEach((doc) => {
      sessions.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return { success: true, sessions };
  } catch (error) {
    console.error('Error fetching study sessions:', error);
    return { success: false, error: error.message, sessions: [] };
  }
};

// Get user's quiz attempts
export const getUserQuizAttempts = async (userId, limitCount = 10) => {
  try {
    const q = query(
      collection(db, 'quizAttempts'),
      where('userId', '==', userId),
      orderBy('completedAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const attempts = [];
    
    querySnapshot.forEach((doc) => {
      attempts.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return { success: true, attempts };
  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    return { success: false, error: error.message, attempts: [] };
  }
};

// Get leaderboard
export const getLeaderboard = async (limitCount = 10) => {
  try {
    const q = query(
      collection(db, 'users'),
      orderBy('stats.xp', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const leaderboard = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      leaderboard.push({
        uid: doc.id,
        displayName: data.displayName,
        photoURL: data.photoURL,
        xp: data.stats?.xp || 0,
        level: data.stats?.level || 1,
        badges: data.badges || [],
      });
    });

    return { success: true, leaderboard };
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return { success: false, error: error.message, leaderboard: [] };
  }
};

// Update study streak
export const updateStudyStreak = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return { success: false, error: 'User not found' };
    }

    const userData = userSnap.data();
    const lastStudyDate = userData.lastStudyDate?.toDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentStreak = userData.stats?.currentStreak || 0;
    let longestStreak = userData.stats?.longestStreak || 0;

    if (lastStudyDate) {
      const lastDate = new Date(lastStudyDate);
      lastDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

      if (daysDiff === 0) {
        // Already studied today, no change
        return { success: true, streak: currentStreak };
      } else if (daysDiff === 1) {
        // Consecutive day
        currentStreak += 1;
      } else {
        // Streak broken
        currentStreak = 1;
      }
    } else {
      // First study session
      currentStreak = 1;
    }

    // Update longest streak if current is higher
    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }

    await updateDoc(userRef, {
      'stats.currentStreak': currentStreak,
      'stats.longestStreak': longestStreak,
      lastStudyDate: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { success: true, streak: currentStreak };
  } catch (error) {
    console.error('Error updating study streak:', error);
    return { success: false, error: error.message };
  }
};