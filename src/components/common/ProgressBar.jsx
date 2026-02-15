import React from 'react';
import { motion } from 'framer-motion';

/**
 * Progress Bar Component
 * Animated progress indicator
 */
const ProgressBar = ({
  value = 0,
  max = 100,
  size = 'md', // 'sm', 'md', 'lg'
  variant = 'primary', // 'primary', 'success', 'warning', 'info'
  showLabel = false,
  label,
  animated = true,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variantClasses = {
    primary: 'bg-vibrant-orange',
    success: 'bg-success-green',
    warning: 'bg-warning-red',
    info: 'bg-info-blue',
  };

  return (
    <div className={className}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-sm font-medium text-primary-black">{label}</span>
          )}
          {showLabel && (
            <span className="text-sm text-muted-gray">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-light-cream rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <motion.div
          className={`h-full rounded-full ${variantClasses[variant]}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={animated ? { duration: 0.5, ease: 'easeOut' } : { duration: 0 }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
