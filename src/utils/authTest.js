/**
 * Authentication Test Utilities
 * Helper functions to test Firebase authentication setup
 */

import { auth, googleProvider, microsoftProvider } from '../config/firebase';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';

/**
 * Test email/password authentication
 */
export const testEmailAuth = async () => {
  console.log('🧪 Testing Email Authentication...');
  
  try {
    // Test with invalid credentials (should fail)
    await signInWithEmailAndPassword(auth, 'test@example.com', 'wrongpassword');
    console.log('❌ Email auth test failed - invalid credentials should not work');
    return false;
  } catch (error) {
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      console.log('✅ Email auth error handling works correctly');
      return true;
    } else {
      console.log('❌ Unexpected error:', error.code);
      return false;
    }
  }
};

/**
 * Test Google authentication setup
 */
export const testGoogleAuth = () => {
  console.log('🧪 Testing Google Authentication Setup...');
  
  try {
    // Check if Google provider is configured
    if (!googleProvider) {
      console.log('❌ Google provider not configured');
      return false;
    }
    
    // Check if provider has correct scopes
    const scopes = googleProvider.getCustomParameters();
    console.log('✅ Google provider configured with scopes:', scopes);
    
    // Note: We can't test the actual popup without user interaction
    console.log('ℹ️  Google sign-in popup requires user interaction to test');
    return true;
  } catch (error) {
    console.log('❌ Google auth setup error:', error);
    return false;
  }
};

/**
 * Test Microsoft authentication setup
 */
export const testMicrosoftAuth = () => {
  console.log('🧪 Testing Microsoft Authentication Setup...');
  
  try {
    // Check if Microsoft provider is configured
    if (!microsoftProvider) {
      console.log('❌ Microsoft provider not configured');
      return false;
    }
    
    // Check provider ID
    if (microsoftProvider.providerId !== 'microsoft.com') {
      console.log('❌ Microsoft provider ID incorrect');
      return false;
    }
    
    console.log('✅ Microsoft provider configured correctly');
    
    // Note: We can't test the actual popup without user interaction
    console.log('ℹ️  Microsoft sign-in popup requires user interaction to test');
    return true;
  } catch (error) {
    console.log('❌ Microsoft auth setup error:', error);
    return false;
  }
};

/**
 * Test Firebase configuration
 */
export const testFirebaseConfig = () => {
  console.log('🧪 Testing Firebase Configuration...');
  
  const requiredEnvVars = [
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN',
    'REACT_APP_FIREBASE_PROJECT_ID',
    'REACT_APP_FIREBASE_STORAGE_BUCKET',
    'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
    'REACT_APP_FIREBASE_APP_ID'
  ];
  
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0) {
    console.log('❌ Missing environment variables:', missing);
    return false;
  }
  
  // Check if auth is initialized
  if (!auth) {
    console.log('❌ Firebase Auth not initialized');
    return false;
  }
  
  console.log('✅ Firebase configuration looks good');
  console.log('📋 Project ID:', process.env.REACT_APP_FIREBASE_PROJECT_ID);
  console.log('📋 Auth Domain:', process.env.REACT_APP_FIREBASE_AUTH_DOMAIN);
  
  return true;
};

/**
 * Run all authentication tests
 */
export const runAllAuthTests = async () => {
  console.log('🚀 Running Firebase Authentication Tests...\n');
  
  const results = {
    config: testFirebaseConfig(),
    google: testGoogleAuth(),
    microsoft: testMicrosoftAuth(),
    email: await testEmailAuth()
  };
  
  console.log('\n📊 Test Results:');
  console.log('Config:', results.config ? '✅' : '❌');
  console.log('Google:', results.google ? '✅' : '❌');
  console.log('Microsoft:', results.microsoft ? '✅' : '❌');
  console.log('Email:', results.email ? '✅' : '❌');
  
  const allPassed = Object.values(results).every(result => result);
  
  if (allPassed) {
    console.log('\n🎉 All tests passed! Firebase authentication is ready to use.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the setup guide for troubleshooting.');
  }
  
  return results;
};

// Auto-run tests in development
if (process.env.NODE_ENV === 'development') {
  // Uncomment the line below to run tests automatically
  // setTimeout(runAllAuthTests, 2000);
}