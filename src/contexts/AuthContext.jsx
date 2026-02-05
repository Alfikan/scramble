import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile,
  signInWithPopup,
  onAuthStateChanged,
  sendEmailVerification,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';
import { getAuthErrorMessage } from '../utils/authErrors';

/**
 * Authentication Context Provider
 * Manages user authentication state and provides Firebase auth methods
 */
const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create user profile in Firestore
  const createUserProfile = async (user, additionalData = {}) => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const { displayName, email, photoURL } = user;
      const createdAt = new Date();

      const defaultProfile = {
        displayName: displayName || email?.split('@')[0] || 'User',
        email,
        photoURL,
        createdAt,
        lastLoginAt: createdAt,
        emailVerified: user.emailVerified,
        // Additional user profile data
        bio: '',
        subjects: [],
        studyPreferences: {
          focusMusic: true,
          pomodoroLength: 25,
          breakLength: 5,
          studyGoalHoursPerWeek: 20,
        },
        availability: {
          monday: [9, 17],
          tuesday: [9, 17],
          wednesday: [9, 17],
          thursday: [9, 17],
          friday: [9, 17],
          saturday: [10, 16],
          sunday: [10, 16],
        },
        stats: {
          totalStudyHours: 0,
          totalQuizzesTaken: 0,
          averageQuizScore: 0,
          doubtsRaised: 0,
          doubtsResolved: 0,
          meetingsAttended: 0,
          currentStreak: 0,
          longestStreak: 0,
          xp: 0,
          level: 1,
        },
        badges: [],
        joinedRooms: [],
        ...additionalData,
      };

      try {
        await setDoc(userRef, defaultProfile);
        return { ...user, ...defaultProfile };
      } catch (error) {
        console.error('Error creating user profile:', error);
        throw error;
      }
    } else {
      // Update last login time
      await updateDoc(userRef, {
        lastLoginAt: new Date(),
      });
      return { ...user, ...userSnap.data() };
    }
  };

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      try {
        if (firebaseUser) {
          // User is signed in, get their profile data
          const userProfile = await createUserProfile(firebaseUser);
          setUser(userProfile);
        } else {
          // User is signed out
          setUser(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Email and password sign in
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Sign in failed:', error);
      const errorMessage = getAuthErrorMessage(error.code);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Email and password sign up
  const signUp = async (email, password, displayName) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      if (displayName) {
        await firebaseUpdateProfile(result.user, {
          displayName: displayName,
        });
      }

      // Send email verification
      await sendEmailVerification(result.user);
      
      // Create user profile in Firestore
      await createUserProfile(result.user, { displayName });
      
      return { 
        success: true, 
        user: result.user,
        message: 'Account created successfully! Please check your email to verify your account.'
      };
    } catch (error) {
      console.error('Sign up failed:', error);
      const errorMessage = getAuthErrorMessage(error.code);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Sign out failed:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { 
        success: true, 
        message: 'Password reset email sent! Check your inbox.' 
      };
    } catch (error) {
      console.error('Password reset failed:', error);
      const errorMessage = getAuthErrorMessage(error.code);
      return { success: false, error: errorMessage };
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    if (!user) return { success: false, error: 'No user logged in' };
    
    setLoading(true);
    try {
      // Update Firebase Auth profile if display name or photo URL changed
      const authUpdates = {};
      if (updates.displayName !== undefined) authUpdates.displayName = updates.displayName;
      if (updates.photoURL !== undefined) authUpdates.photoURL = updates.photoURL;
      
      if (Object.keys(authUpdates).length > 0) {
        await firebaseUpdateProfile(auth.currentUser, authUpdates);
      }

      // Update Firestore profile
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date(),
      });

      // Update local user state
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Profile update failed:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Google sign in
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await createUserProfile(result.user, { provider: 'google' });
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Google sign in failed:', error);
      const errorMessage = getAuthErrorMessage(error.code);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Send email verification
  const sendVerificationEmail = async () => {
    if (!auth.currentUser) return { success: false, error: 'No user logged in' };
    
    try {
      await sendEmailVerification(auth.currentUser);
      return { 
        success: true, 
        message: 'Verification email sent! Check your inbox.' 
      };
    } catch (error) {
      console.error('Email verification failed:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    signInWithGoogle,
    sendVerificationEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};