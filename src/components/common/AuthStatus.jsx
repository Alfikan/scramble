import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from './Button';
import Badge from './Badge';

/**
 * Authentication Status Component
 * Shows current user info and verification status
 */
const AuthStatus = ({ showActions = true, compact = false }) => {
  const { user, sendVerificationEmail, signOut } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center space-x-2 text-muted-gray">
        <AlertCircle size={16} />
        <span className="text-sm">Not signed in</span>
      </div>
    );
  }

  const handleSendVerification = async () => {
    const result = await sendVerificationEmail();
    if (result.success) {
      // You might want to show a toast notification here
      console.log('Verification email sent');
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-vibrant-orange to-soft-purple flex items-center justify-center">
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName || 'User'} 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User size={16} className="text-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-primary-black truncate">
            {user.displayName || user.email?.split('@')[0] || 'User'}
          </p>
          {!user.emailVerified && (
            <Badge variant="warning" size="sm">
              Unverified
            </Badge>
          )}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-muted-gray border-opacity-20 p-4"
    >
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-vibrant-orange to-soft-purple flex items-center justify-center flex-shrink-0">
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName || 'User'} 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User size={20} className="text-white" />
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-semibold text-primary-black truncate">
              {user.displayName || user.email?.split('@')[0] || 'User'}
            </h3>
            {user.emailVerified ? (
              <Badge variant="success" size="sm">
                <Shield size={12} className="mr-1" />
                Verified
              </Badge>
            ) : (
              <Badge variant="warning" size="sm">
                <AlertCircle size={12} className="mr-1" />
                Unverified
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-1 text-muted-gray mb-2">
            <Mail size={14} />
            <span className="text-sm truncate">{user.email}</span>
          </div>

          {user.provider && (
            <div className="text-xs text-muted-gray mb-3">
              Signed in with {user.provider}
            </div>
          )}

          {/* Email Verification Warning */}
          {!user.emailVerified && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-warning-red bg-opacity-10 border border-warning-red border-opacity-20 rounded-lg p-3 mb-3"
            >
              <p className="text-warning-red text-sm font-medium mb-2">
                Please verify your email address
              </p>
              <p className="text-warning-red text-xs mb-2">
                Check your inbox for a verification email. You may need to check your spam folder.
              </p>
              {showActions && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSendVerification}
                  className="text-warning-red hover:bg-warning-red hover:bg-opacity-10"
                >
                  Resend verification email
                </Button>
              )}
            </motion.div>
          )}

          {/* Actions */}
          {showActions && (
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-muted-gray hover:text-primary-black"
              >
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AuthStatus;