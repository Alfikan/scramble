import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

/**
 * Versatile badge component for status indicators, labels, and notifications
 * Supports various variants, sizes, and animations
 */
const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  animate = false,
  pulse = false,
  ...props
}) => {
  const baseClasses = cn(
    'inline-flex items-center justify-center font-medium rounded-pill',
    'transition-all duration-300 ease-smooth',
    className
  );

  const variants = {
    default: 'bg-muted-gray text-white',
    primary: 'bg-vibrant-orange text-white',
    secondary: 'bg-primary-black text-white',
    success: 'bg-success-green text-white',
    warning: 'bg-warning-red text-white',
    info: 'bg-info-blue text-white',
    purple: 'bg-soft-purple text-white',
    yellow: 'bg-warm-yellow text-primary-black',
    outline: 'bg-transparent border-2 border-primary-black text-primary-black',
    'outline-primary': 'bg-transparent border-2 border-vibrant-orange text-vibrant-orange',
    'outline-success': 'bg-transparent border-2 border-success-green text-success-green',
    'outline-warning': 'bg-transparent border-2 border-warning-red text-warning-red',
    'outline-info': 'bg-transparent border-2 border-info-blue text-info-blue',
    ghost: 'bg-light-cream text-primary-black hover:bg-muted-gray hover:text-white',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const badgeClasses = cn(
    baseClasses,
    variants[variant],
    sizes[size],
    {
      'animate-pulse': pulse,
    }
  );

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.2,
        ease: 'easeOut'
      }
    },
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  if (animate) {
    return (
      <motion.span
        className={badgeClasses}
        variants={badgeVariants}
        initial="hidden"
        animate={pulse ? 'pulse' : 'visible'}
        {...props}
      >
        {children}
      </motion.span>
    );
  }

  return (
    <span className={badgeClasses} {...props}>
      {children}
    </span>
  );
};

// Notification Badge with count
export const NotificationBadge = ({ 
  count = 0, 
  max = 99, 
  showZero = false,
  className,
  ...props 
}) => {
  if (count === 0 && !showZero) return null;

  const displayCount = count > max ? `${max}+` : count;

  return (
    <Badge
      variant="warning"
      size="sm"
      className={cn('min-w-[20px] h-5', className)}
      animate
      pulse={count > 0}
      {...props}
    >
      {displayCount}
    </Badge>
  );
};

// Status Badge with predefined states
export const StatusBadge = ({ status, className, ...props }) => {
  const statusConfig = {
    online: { variant: 'success', text: 'Online' },
    offline: { variant: 'default', text: 'Offline' },
    away: { variant: 'yellow', text: 'Away' },
    busy: { variant: 'warning', text: 'Busy' },
    active: { variant: 'success', text: 'Active' },
    inactive: { variant: 'default', text: 'Inactive' },
    pending: { variant: 'yellow', text: 'Pending' },
    approved: { variant: 'success', text: 'Approved' },
    rejected: { variant: 'warning', text: 'Rejected' },
    draft: { variant: 'outline', text: 'Draft' },
    published: { variant: 'success', text: 'Published' },
    archived: { variant: 'default', text: 'Archived' },
  };

  const config = statusConfig[status] || { variant: 'default', text: status };

  return (
    <Badge
      variant={config.variant}
      className={className}
      {...props}
    >
      {config.text}
    </Badge>
  );
};

// Priority Badge for tasks and doubts
export const PriorityBadge = ({ priority, className, ...props }) => {
  const priorityConfig = {
    low: { variant: 'info', text: 'Low Priority' },
    medium: { variant: 'yellow', text: 'Medium Priority' },
    high: { variant: 'warning', text: 'High Priority' },
    urgent: { variant: 'warning', text: 'Urgent', pulse: true },
  };

  const config = priorityConfig[priority] || { variant: 'default', text: priority };

  return (
    <Badge
      variant={config.variant}
      className={className}
      pulse={config.pulse}
      {...props}
    >
      {config.text}
    </Badge>
  );
};

export default Badge;