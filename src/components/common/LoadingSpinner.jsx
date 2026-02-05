import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

/**
 * Modern loading spinner with multiple variants and sizes
 * Supports different animation styles and customizable colors
 */
const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'default',
  className,
  ...props 
}) => {
  const sizes = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const variants = {
    default: 'border-vibrant-orange border-t-transparent',
    primary: 'border-vibrant-orange border-t-transparent',
    secondary: 'border-primary-black border-t-transparent',
    white: 'border-white border-t-transparent',
    purple: 'border-soft-purple border-t-transparent',
    yellow: 'border-warm-yellow border-t-transparent',
  };

  const spinnerClasses = cn(
    'border-2 rounded-full animate-spin',
    sizes[size],
    variants[variant],
    className
  );

  return (
    <motion.div
      className={spinnerClasses}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      {...props}
    />
  );
};

// Dots Loading Animation
export const LoadingDots = ({ 
  size = 'md',
  color = 'vibrant-orange',
  className,
  ...props 
}) => {
  const sizes = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  const dotClasses = cn(
    'rounded-full',
    sizes[size],
    `bg-${color}`
  );

  const containerClasses = cn(
    'flex space-x-1 items-center justify-center',
    className
  );

  const dotVariants = {
    initial: { y: 0 },
    animate: { y: -8 },
  };

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.2,
        repeat: Infinity,
        repeatType: 'reverse',
      },
    },
  };

  return (
    <motion.div
      className={containerClasses}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      {...props}
    >
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={dotClasses}
          variants={dotVariants}
          transition={{
            duration: 0.4,
            ease: 'easeInOut',
          }}
        />
      ))}
    </motion.div>
  );
};

// Pulse Loading Animation
export const LoadingPulse = ({ 
  size = 'md',
  color = 'vibrant-orange',
  className,
  ...props 
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const pulseClasses = cn(
    'rounded-full',
    sizes[size],
    `bg-${color}`,
    className
  );

  return (
    <motion.div
      className={pulseClasses}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [1, 0.7, 1],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      {...props}
    />
  );
};

// Skeleton Loading for content
export const LoadingSkeleton = ({ 
  width = '100%',
  height = '20px',
  className,
  ...props 
}) => {
  const skeletonClasses = cn(
    'bg-muted-gray bg-opacity-20 animate-pulse rounded',
    className
  );

  return (
    <div
      className={skeletonClasses}
      style={{ width, height }}
      {...props}
    />
  );
};

// Card Skeleton for loading cards
export const CardSkeleton = ({ className, ...props }) => {
  return (
    <div className={cn('card animate-pulse', className)} {...props}>
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-muted-gray bg-opacity-20 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted-gray bg-opacity-20 rounded w-3/4" />
          <div className="h-3 bg-muted-gray bg-opacity-20 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-muted-gray bg-opacity-20 rounded" />
        <div className="h-3 bg-muted-gray bg-opacity-20 rounded w-5/6" />
        <div className="h-3 bg-muted-gray bg-opacity-20 rounded w-4/6" />
      </div>
      <div className="flex justify-between items-center mt-6">
        <div className="h-8 bg-muted-gray bg-opacity-20 rounded w-20" />
        <div className="h-8 bg-muted-gray bg-opacity-20 rounded w-24" />
      </div>
    </div>
  );
};

// Full Page Loading
export const FullPageLoading = ({ message = 'Loading...', ...props }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cool-blue-gray" {...props}>
      <LoadingSpinner size="xl" className="mb-4" />
      <motion.p
        className="text-muted-gray font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {message}
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;