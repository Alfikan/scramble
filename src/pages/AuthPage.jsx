import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  User, 
  BookOpen,
  ArrowLeft,
  Chrome,
  Loader2
} from 'lucide-react';

import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import { useAuth } from '../contexts/AuthContext';

/**
 * Modern authentication page with sign in/up forms
 * Supports email/password and social authentication
 */
const AuthPage = () => {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle, signInWithMicrosoft, resetPassword } = useAuth();
  
  const [mode, setMode] = useState('signin'); // 'signin', 'signup', 'forgot'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
  });

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (!formData.email) {
      setError('Email is required');
      return false;
    }
    
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }

    if (mode !== 'forgot') {
      if (!formData.password) {
        setError('Password is required');
        return false;
      }
      
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
    }

    if (mode === 'signup') {
      if (!formData.displayName) {
        setError('Display name is required');
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let result;
      
      if (mode === 'signin') {
        result = await signIn(formData.email, formData.password);
      } else if (mode === 'signup') {
        result = await signUp(formData.email, formData.password, formData.displayName);
      } else if (mode === 'forgot') {
        result = await resetPassword(formData.email);
        if (result.success) {
          setSuccess('Password reset email sent! Check your inbox.');
          setTimeout(() => setMode('signin'), 3000);
        }
      }

      if (result && !result.success) {
        setError(result.error || 'An error occurred');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider) => {
    setLoading(true);
    setError('');
    
    try {
      const result = provider === 'google' 
        ? await signInWithGoogle()
        : await signInWithMicrosoft();
        
      if (!result.success) {
        setError(result.error || 'Social authentication failed');
      }
    } catch (err) {
      setError('Social authentication failed');
      console.error('Social auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    exit: { 
      opacity: 0, 
      x: 20,
      transition: { duration: 0.2 }
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'signin': return 'Welcome Back!';
      case 'signup': return 'Join Scramble';
      case 'forgot': return 'Reset Password';
      default: return 'Welcome';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'signin': return 'Sign in to continue your learning journey';
      case 'signup': return 'Create your account and start studying together';
      case 'forgot': return 'Enter your email to receive a password reset link';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-cool-blue-gray flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center text-muted-gray hover:text-primary-black transition-colors mb-6"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </button>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-vibrant-orange to-soft-purple rounded-xl flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-primary-black">Scramble</span>
          </div>
        </motion.div>

        {/* Auth Card */}
        <Card className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Title */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-primary-black mb-2">
                  {getTitle()}
                </h1>
                <p className="text-muted-gray">
                  {getSubtitle()}
                </p>
              </div>

              {/* Error/Success Messages */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-warning-red bg-opacity-10 border border-warning-red border-opacity-20 rounded-lg p-3 mb-6"
                  >
                    <p className="text-warning-red text-sm font-medium">{error}</p>
                  </motion.div>
                )}
                
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-success-green bg-opacity-10 border border-success-green border-opacity-20 rounded-lg p-3 mb-6"
                  >
                    <p className="text-success-green text-sm font-medium">{success}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Social Auth Buttons */}
              {mode !== 'forgot' && (
                <div className="space-y-3 mb-6">
                  <Button
                    variant="ghost"
                    className="w-full border border-muted-gray border-opacity-30 hover:border-opacity-50"
                    onClick={() => handleSocialAuth('google')}
                    disabled={loading}
                    leftIcon={<Chrome size={20} />}
                  >
                    Continue with Google
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className="w-full border border-muted-gray border-opacity-30 hover:border-opacity-50"
                    onClick={() => handleSocialAuth('microsoft')}
                    disabled={loading}
                    leftIcon={
                      <div className="w-5 h-5 bg-info-blue rounded-sm flex items-center justify-center">
                        <span className="text-white text-xs font-bold">M</span>
                      </div>
                    }
                  >
                    Continue with Microsoft
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-muted-gray border-opacity-30" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-light-cream text-muted-gray">or</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Display Name (Sign Up Only) */}
                {mode === 'signup' && (
                  <Input
                    label="Display Name"
                    type="text"
                    value={formData.displayName}
                    onChange={handleInputChange('displayName')}
                    leftIcon={<User size={20} />}
                    required
                    disabled={loading}
                  />
                )}

                {/* Email */}
                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  leftIcon={<Mail size={20} />}
                  required
                  disabled={loading}
                />

                {/* Password (Not for Forgot Password) */}
                {mode !== 'forgot' && (
                  <Input
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    leftIcon={<Lock size={20} />}
                    required
                    disabled={loading}
                  />
                )}

                {/* Confirm Password (Sign Up Only) */}
                {mode === 'signup' && (
                  <Input
                    label="Confirm Password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    leftIcon={<Lock size={20} />}
                    required
                    disabled={loading}
                  />
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={loading}
                  loading={loading}
                >
                  {mode === 'signin' && 'Sign In'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'forgot' && 'Send Reset Link'}
                </Button>
              </form>

              {/* Footer Links */}
              <div className="mt-6 text-center space-y-2">
                {mode === 'signin' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-vibrant-orange hover:underline text-sm font-medium"
                      disabled={loading}
                    >
                      Forgot your password?
                    </button>
                    <p className="text-muted-gray text-sm">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setMode('signup')}
                        className="text-vibrant-orange hover:underline font-medium"
                        disabled={loading}
                      >
                        Sign up
                      </button>
                    </p>
                  </>
                )}

                {mode === 'signup' && (
                  <p className="text-muted-gray text-sm">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signin')}
                      className="text-vibrant-orange hover:underline font-medium"
                      disabled={loading}
                    >
                      Sign in
                    </button>
                  </p>
                )}

                {mode === 'forgot' && (
                  <p className="text-muted-gray text-sm">
                    Remember your password?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signin')}
                      className="text-vibrant-orange hover:underline font-medium"
                      disabled={loading}
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </div>

              {/* Terms (Sign Up Only) */}
              {mode === 'signup' && (
                <p className="text-xs text-muted-gray text-center mt-6 leading-relaxed">
                  By creating an account, you agree to our{' '}
                  <button type="button" className="text-vibrant-orange hover:underline">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-vibrant-orange hover:underline">
                    Privacy Policy
                  </button>
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </Card>

        {/* Loading Overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-primary-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <div className="bg-white rounded-xl p-6 flex items-center space-x-3">
                <Loader2 className="w-6 h-6 animate-spin text-vibrant-orange" />
                <span className="text-primary-black font-medium">
                  {mode === 'signin' && 'Signing in...'}
                  {mode === 'signup' && 'Creating account...'}
                  {mode === 'forgot' && 'Sending reset link...'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthPage;