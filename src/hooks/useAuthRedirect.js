import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook to handle authentication redirects
 * Redirects authenticated users away from auth pages
 * Redirects unauthenticated users to auth page for protected routes
 */
export const useAuthRedirect = (options = {}) => {
  const { 
    redirectTo = '/dashboard',
    requireAuth = false,
    redirectFrom = ['/auth', '/login', '/signup']
  } = options;
  
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return; // Wait for auth state to be determined

    const currentPath = location.pathname;
    const from = location.state?.from?.pathname || redirectTo;

    // If user is authenticated and on an auth page, redirect them
    if (user && redirectFrom.includes(currentPath)) {
      navigate(from, { replace: true });
      return;
    }

    // If route requires auth and user is not authenticated, redirect to auth
    if (requireAuth && !user) {
      navigate('/auth', { 
        state: { from: location },
        replace: true 
      });
      return;
    }
  }, [user, loading, navigate, location, redirectTo, requireAuth, redirectFrom]);

  return { user, loading };
};

/**
 * Hook specifically for protected routes
 */
export const useRequireAuth = (redirectTo = '/auth') => {
  return useAuthRedirect({ 
    requireAuth: true,
    redirectTo 
  });
};

/**
 * Hook specifically for auth pages (login/signup)
 */
export const useAuthPageRedirect = (redirectTo = '/dashboard') => {
  return useAuthRedirect({ 
    redirectTo,
    redirectFrom: ['/auth', '/login', '/signup']
  });
};