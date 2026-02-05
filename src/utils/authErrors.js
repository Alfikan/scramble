/**
 * Firebase Auth Error Handler
 * Provides user-friendly error messages for Firebase authentication errors
 */

export const getAuthErrorMessage = (errorCode) => {
  switch (errorCode) {
    // Email/Password Sign In Errors
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please check your credentials.';

    // Email/Password Sign Up Errors
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try signing in instead.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled. Please contact support.';

    // Social Sign In Errors
    case 'auth/popup-closed-by-user':
      return 'Sign in was cancelled. Please try again.';
    case 'auth/popup-blocked':
      return 'Popup was blocked by your browser. Please allow popups and try again.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email using a different sign-in method.';
    case 'auth/auth-domain-config-required':
      return 'Authentication configuration error. Please contact support.';
    case 'auth/cancelled-popup-request':
      return 'Sign in was cancelled. Please try again.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for authentication.';

    // Password Reset Errors
    case 'auth/missing-email':
      return 'Please enter your email address.';
    case 'auth/invalid-continue-uri':
      return 'Invalid reset link. Please try again.';

    // Network Errors
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    case 'auth/timeout':
      return 'Request timed out. Please try again.';

    // General Errors
    case 'auth/internal-error':
      return 'An internal error occurred. Please try again.';
    case 'auth/invalid-api-key':
      return 'Authentication configuration error. Please contact support.';
    case 'auth/app-deleted':
      return 'Authentication service is unavailable. Please contact support.';

    // Default
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

export const isNetworkError = (errorCode) => {
  return [
    'auth/network-request-failed',
    'auth/timeout',
  ].includes(errorCode);
};

export const isConfigurationError = (errorCode) => {
  return [
    'auth/auth-domain-config-required',
    'auth/invalid-api-key',
    'auth/app-deleted',
    'auth/operation-not-allowed',
    'auth/unauthorized-domain',
  ].includes(errorCode);
};