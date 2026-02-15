import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

// Import pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import PrivateSpacePage from './pages/PrivateSpacePage';
import RoomsPage from './pages/RoomsPage';
import RoomPage from './pages/RoomPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AIChatPage from './pages/AIChatPage';
import AIQuizPage from './pages/AIQuizPage';
import LeaderboardPage from './pages/LeaderboardPage';
import MessagesPage from './pages/MessagesPage';
import NotificationsPage from './pages/NotificationsPage';
import HelpPage from './pages/HelpPage';

// Import components
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';
import Layout from './components/layout/Layout';

// Import contexts and hooks
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Import styles
import './index.css';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cool-blue-gray">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cool-blue-gray">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: 20,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3,
};

// Animated Route Wrapper
const AnimatedRoute = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
    className="w-full"
  >
    {children}
  </motion.div>
);

// Protected Route with Layout
const ProtectedRouteWithLayout = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cool-blue-gray">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <Layout>{children}</Layout>;
};

// Main App Component
function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <Router>
              <div className="App min-h-screen bg-cool-blue-gray font-kodchasan">
                <AnimatePresence mode="wait">
                  <Routes>
                    {/* Public Routes */}
                    <Route 
                      path="/" 
                      element={
                        <PublicRoute>
                          <AnimatedRoute>
                            <LandingPage />
                          </AnimatedRoute>
                        </PublicRoute>
                      } 
                    />
                    <Route 
                      path="/auth" 
                      element={
                        <PublicRoute>
                          <AnimatedRoute>
                            <AuthPage />
                          </AnimatedRoute>
                        </PublicRoute>
                      } 
                    />

                    {/* Protected Routes with Layout */}
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRouteWithLayout>
                          <AnimatedRoute>
                            <DashboardPage />
                          </AnimatedRoute>
                        </ProtectedRouteWithLayout>
                      } 
                    />
                    <Route 
                      path="/private-space" 
                      element={
                        <ProtectedRouteWithLayout>
                          <AnimatedRoute>
                            <PrivateSpacePage />
                          </AnimatedRoute>
                        </ProtectedRouteWithLayout>
                      } 
                    />
                    <Route 
                      path="/rooms" 
                      element={
                        <ProtectedRouteWithLayout>
                          <AnimatedRoute>
                            <RoomsPage />
                          </AnimatedRoute>
                        </ProtectedRouteWithLayout>
                      } 
                    />
                    <Route 
                      path="/room/:roomId" 
                      element={
                        <ProtectedRouteWithLayout>
                          <AnimatedRoute>
                            <RoomPage />
                          </AnimatedRoute>
                        </ProtectedRouteWithLayout>
                      } 
                    />
                    <Route 
                      path="/profile" 
                      element={
                        <ProtectedRouteWithLayout>
                          <AnimatedRoute>
                            <ProfilePage />
                          </AnimatedRoute>
                        </ProtectedRouteWithLayout>
                      } 
                    />
                    <Route 
                      path="/settings" 
                      element={
                        <ProtectedRouteWithLayout>
                          <AnimatedRoute>
                            <SettingsPage />
                          </AnimatedRoute>
                        </ProtectedRouteWithLayout>
                      } 
                    />
                    <Route 
                      path="/ai-chat" 
                      element={
                        <ProtectedRouteWithLayout>
                          <AnimatedRoute>
                            <AIChatPage />
                          </AnimatedRoute>
                        </ProtectedRouteWithLayout>
                      } 
                    />
                    <Route 
                      path="/ai-quiz" 
                      element={
                        <ProtectedRouteWithLayout>
                          <AnimatedRoute>
                            <AIQuizPage />
                          </AnimatedRoute>
                        </ProtectedRouteWithLayout>
                      } 
                    />
                    <Route 
                      path="/leaderboard" 
                      element={
                        <ProtectedRouteWithLayout>
                          <AnimatedRoute>
                            <LeaderboardPage />
                          </AnimatedRoute>
                        </ProtectedRouteWithLayout>
                      } 
                    />
                    <Route 
                      path="/messages" 
                      element={
                        <ProtectedRouteWithLayout>
                          <AnimatedRoute>
                            <MessagesPage />
                          </AnimatedRoute>
                        </ProtectedRouteWithLayout>
                      } 
                    />
                    <Route 
                      path="/notifications" 
                      element={
                        <ProtectedRouteWithLayout>
                          <AnimatedRoute>
                            <NotificationsPage />
                          </AnimatedRoute>
                        </ProtectedRouteWithLayout>
                      } 
                    />
                    <Route 
                      path="/help" 
                      element={
                        <ProtectedRouteWithLayout>
                          <AnimatedRoute>
                            <HelpPage />
                          </AnimatedRoute>
                        </ProtectedRouteWithLayout>
                      } 
                    />

                    {/* Catch all route */}
                    <Route 
                      path="*" 
                      element={
                        <AnimatedRoute>
                          <div className="min-h-screen flex items-center justify-center bg-cool-blue-gray">
                            <div className="text-center">
                              <h1 className="text-4xl font-bold text-primary-black mb-4">
                                404 - Page Not Found
                              </h1>
                              <p className="text-muted-gray mb-8">
                                The page you're looking for doesn't exist.
                              </p>
                              <button
                                onClick={() => window.history.back()}
                                className="btn-primary"
                              >
                                Go Back
                              </button>
                            </div>
                          </div>
                        </AnimatedRoute>
                      } 
                    />
                  </Routes>
                </AnimatePresence>
              </div>
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;