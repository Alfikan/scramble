import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Authentication Context Provider
 * Manages user authentication state and provides auth methods
 * This is a mock implementation - replace with Firebase Auth later
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

  // Mock user data for development
  const mockUser = {
    uid: 'mock-user-123',
    email: 'student@scramble.app',
    displayName: 'Alex Student',
    avatar: null,
    emailVerified: true,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    // Additional user profile data
    bio: 'Computer Science student passionate about collaborative learning',
    subjects: ['Computer Science', 'Mathematics', 'Physics'],
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
      totalStudyHours: 45.5,
      totalQuizzesTaken: 23,
      averageQuizScore: 87.3,
      doubtsRaised: 8,
      doubtsResolved: 15,
      meetingsAttended: 12,
      currentStreak: 7,
      longestStreak: 14,
      xp: 2450,
      level: 3,
    },
    badges: ['early-bird', 'quiz-master', 'helpful-peer'],
    joinedRooms: ['room-1', 'room-2', 'room-3'],
  };

  // Simulate loading and authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if user is logged in (mock implementation)
        const isLoggedIn = localStorage.getItem('scramble_auth') === 'true';
        
        if (isLoggedIn) {
          setUser(mockUser);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // mockUser is defined inline, so no dependency needed

  // Mock authentication methods
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock validation
      if (email && password) {
        localStorage.setItem('scramble_auth', 'true');
        setUser(mockUser);
        return { success: true };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Sign in failed:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, displayName) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock validation
      if (email && password && displayName) {
        const newUser = {
          ...mockUser,
          email,
          displayName,
          uid: `user-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        
        localStorage.setItem('scramble_auth', 'true');
        setUser(newUser);
        return { success: true };
      } else {
        throw new Error('All fields are required');
      }
    } catch (error) {
      console.error('Sign up failed:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      localStorage.removeItem('scramble_auth');
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Sign out failed:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock password reset
      console.log('Password reset email sent to:', email);
      return { success: true };
    } catch (error) {
      console.error('Password reset failed:', error);
      return { success: false, error: error.message };
    }
  };

  const updateProfile = async (updates) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const googleUser = {
        ...mockUser,
        email: 'student@gmail.com',
        displayName: 'Google User',
        avatar: 'https://via.placeholder.com/150/ff5734/ffffff?text=GU',
        provider: 'google',
      };
      
      localStorage.setItem('scramble_auth', 'true');
      setUser(googleUser);
      return { success: true };
    } catch (error) {
      console.error('Google sign in failed:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signInWithMicrosoft = async () => {
    setLoading(true);
    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const microsoftUser = {
        ...mockUser,
        email: 'student@outlook.com',
        displayName: 'Microsoft User',
        avatar: 'https://via.placeholder.com/150/be94f5/ffffff?text=MU',
        provider: 'microsoft',
      };
      
      localStorage.setItem('scramble_auth', 'true');
      setUser(microsoftUser);
      return { success: true };
    } catch (error) {
      console.error('Microsoft sign in failed:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
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
    signInWithMicrosoft,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};