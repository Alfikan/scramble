import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

/**
 * Versatile card component with hover effects and customizable styling
 * Foundation of the card-based UI design system
 */
const Card = React.forwardRef(({
  children,
  className,
  variant = 'default',
  hoverable = true,
  clickable = false,
  onClick,
  padding = 'default',
  ...props
}, ref) => {
  const baseClasses = cn(
    'bg-light-cream rounded-card shadow-card transition-all duration-300 ease-smooth',
    className
  );

  const variants = {
    default: 'bg-light-cream',
    dark: 'bg-primary-black text-white',
    gradient: 'bg-gradient-to-br from-vibrant-orange to-soft-purple text-white',
    glass: 'glass backdrop-blur-sm bg-white/10 border border-white/20',
    success: 'bg-success-green/10 border border-success-green/20',
    warning: 'bg-warning-red/10 border border-warning-red/20',
    info: 'bg-info-blue/10 border border-info-blue/20',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    default: 'p-xl',
    lg: 'p-8',
    xl: 'p-12',
  };

  const cardClasses = cn(
    baseClasses,
    variants[variant],
    paddings[padding],
    {
      'hover:-translate-y-1 hover:shadow-card-hover': hoverable,
      'cursor-pointer': clickable || onClick,
      'active:scale-[0.98]': clickable || onClick,
    }
  );

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    },
    hover: hoverable ? {
      y: -4,
      transition: {
        duration: 0.2,
        ease: 'easeOut'
      }
    } : {},
  };

  const CardComponent = onClick || clickable ? motion.div : motion.div;

  return (
    <CardComponent
      ref={ref}
      className={cardClasses}
      onClick={onClick}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      {...props}
    >
      {children}
    </CardComponent>
  );
});

Card.displayName = 'Card';

// Card sub-components for better composition
export const CardHeader = ({ children, className, ...props }) => (
  <div className={cn('mb-6', className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className, ...props }) => (
  <h3 className={cn('text-section-heading text-primary-black font-semibold', className)} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className, ...props }) => (
  <p className={cn('text-secondary-text text-muted-gray mt-2', className)} {...props}>
    {children}
  </p>
);

export const CardContent = ({ children, className, ...props }) => (
  <div className={cn('', className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className, ...props }) => (
  <div className={cn('mt-6 flex items-center justify-between', className)} {...props}>
    {children}
  </div>
);

export default Card;