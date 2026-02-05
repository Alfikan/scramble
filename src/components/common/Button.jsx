import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

/**
 * Modern, accessible button component with multiple variants
 * Supports animations, loading states, and full customization
 */
const Button = React.forwardRef(({
  children,
  className,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  onClick,
  type = 'button',
  ...props
}, ref) => {
  const baseClasses = cn(
    'inline-flex items-center justify-center font-semibold rounded-button',
    'transition-all duration-300 ease-smooth cursor-pointer',
    'focus:outline-none focus:ring-2 focus:ring-vibrant-orange focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'active:scale-95',
    className
  );

  const variants = {
    primary: 'bg-vibrant-orange text-white hover:bg-orange-600 hover:-translate-y-0.5 shadow-md hover:shadow-lg',
    secondary: 'bg-transparent text-primary-black border-2 border-primary-black hover:bg-primary-black hover:text-white',
    ghost: 'bg-transparent text-primary-black hover:bg-light-cream',
    success: 'bg-success-green text-white hover:bg-green-600 hover:-translate-y-0.5',
    warning: 'bg-warning-red text-white hover:bg-red-600 hover:-translate-y-0.5',
    info: 'bg-info-blue text-white hover:bg-blue-600 hover:-translate-y-0.5',
    purple: 'bg-soft-purple text-white hover:bg-purple-500 hover:-translate-y-0.5',
    yellow: 'bg-warm-yellow text-primary-black hover:bg-yellow-500 hover:-translate-y-0.5',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  const buttonClasses = cn(
    baseClasses,
    variants[variant],
    sizes[size],
    {
      'pointer-events-none': disabled || loading,
    }
  );

  const LoadingSpinner = () => (
    <motion.div
      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );

  return (
    <motion.button
      ref={ref}
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {leftIcon && !loading && (
        <span className="mr-2 flex items-center">
          {leftIcon}
        </span>
      )}
      
      <span className={cn('flex items-center', {
        'opacity-0': loading
      })}>
        {children}
      </span>
      
      {rightIcon && !loading && (
        <span className="ml-2 flex items-center">
          {rightIcon}
        </span>
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;