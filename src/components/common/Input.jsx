import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Modern input component with floating labels, validation states, and icons
 * Supports various input types including password with toggle visibility
 */
const Input = React.forwardRef(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  helperText,
  required = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className,
  containerClassName,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const hasValue = value && value.length > 0;
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const handleFocus = (e) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setFocused(false);
    onBlur?.(e);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputClasses = cn(
    'w-full bg-light-cream border-2 rounded-input px-4 py-4',
    'font-medium text-body-text transition-all duration-300 ease-smooth',
    'placeholder:text-muted-gray placeholder:transition-all placeholder:duration-300',
    'focus:outline-none focus:ring-2 focus:ring-vibrant-orange focus:ring-opacity-20',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    {
      'border-transparent focus:border-vibrant-orange': !error,
      'border-warning-red focus:border-warning-red focus:ring-warning-red': error,
      'pl-12': leftIcon,
      'pr-12': rightIcon || isPassword,
    },
    className
  );

  const labelClasses = cn(
    'absolute left-4 transition-all duration-300 ease-smooth pointer-events-none',
    'text-muted-gray font-medium',
    {
      'top-4 text-base': !focused && !hasValue,
      'top-2 text-sm text-vibrant-orange': focused || hasValue,
      'text-warning-red': error && (focused || hasValue),
    }
  );

  return (
    <div className={cn('relative', containerClassName)}>
      {/* Floating Label */}
      {label && (
        <motion.label
          className={labelClasses}
          animate={{
            y: focused || hasValue ? -8 : 0,
            scale: focused || hasValue ? 0.85 : 1,
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {label}
          {required && <span className="text-warning-red ml-1">*</span>}
        </motion.label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-gray">
            {leftIcon}
          </div>
        )}

        {/* Input Field */}
        <input
          ref={ref}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={focused ? placeholder : ''}
          disabled={disabled}
          className={inputClasses}
          {...props}
        />

        {/* Right Icon or Password Toggle */}
        {(rightIcon || isPassword) && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            {isPassword ? (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-muted-gray hover:text-primary-black transition-colors duration-200 p-1"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            ) : (
              <div className="text-muted-gray">
                {rightIcon}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Helper Text or Error Message */}
      {(helperText || error) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'mt-2 text-sm font-medium',
            {
              'text-muted-gray': !error,
              'text-warning-red': error,
            }
          )}
        >
          {error || helperText}
        </motion.div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;