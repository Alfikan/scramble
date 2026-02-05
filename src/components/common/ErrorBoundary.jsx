import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Button from './Button';
import Card from './Card';

/**
 * Error Boundary component to catch and handle React errors gracefully
 * Provides a user-friendly error UI with recovery options
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
    }));
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, retryCount } = this.state;
      const isDevelopment = process.env.NODE_ENV === 'development';

      return (
        <div className="min-h-screen bg-cool-blue-gray flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl"
          >
            <Card className="text-center">
              {/* Error Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="flex justify-center mb-6"
              >
                <div className="w-20 h-20 bg-warning-red bg-opacity-10 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-warning-red" />
                </div>
              </motion.div>

              {/* Error Title */}
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-primary-black mb-4"
              >
                Oops! Something went wrong
              </motion.h1>

              {/* Error Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-muted-gray mb-8 leading-relaxed"
              >
                We're sorry for the inconvenience. An unexpected error occurred while loading this page.
                {retryCount > 0 && (
                  <span className="block mt-2 text-sm">
                    Retry attempts: {retryCount}
                  </span>
                )}
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
              >
                <Button
                  variant="primary"
                  onClick={this.handleRetry}
                  leftIcon={<RefreshCw size={18} />}
                >
                  Try Again
                </Button>
                
                <Button
                  variant="secondary"
                  onClick={this.handleGoHome}
                  leftIcon={<Home size={18} />}
                >
                  Go Home
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={this.handleReload}
                  size="sm"
                >
                  Reload Page
                </Button>
              </motion.div>

              {/* Development Error Details */}
              {isDevelopment && error && (
                <motion.details
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-left bg-light-cream p-4 rounded-lg border border-warning-red border-opacity-20"
                >
                  <summary className="cursor-pointer font-semibold text-warning-red mb-2">
                    Error Details (Development Only)
                  </summary>
                  
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-semibold text-primary-black mb-1">Error Message:</h4>
                      <code className="block bg-white p-2 rounded text-warning-red font-mono text-xs overflow-x-auto">
                        {error.toString()}
                      </code>
                    </div>
                    
                    {errorInfo && (
                      <div>
                        <h4 className="font-semibold text-primary-black mb-1">Component Stack:</h4>
                        <code className="block bg-white p-2 rounded text-muted-gray font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                          {errorInfo.componentStack}
                        </code>
                      </div>
                    )}
                  </div>
                </motion.details>
              )}

              {/* Help Text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-8 pt-6 border-t border-muted-gray border-opacity-20"
              >
                <p className="text-sm text-muted-gray">
                  If this problem persists, please contact our support team at{' '}
                  <a 
                    href="mailto:support@scramble.app" 
                    className="text-vibrant-orange hover:underline"
                  >
                    support@scramble.app
                  </a>
                </p>
              </motion.div>
            </Card>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;