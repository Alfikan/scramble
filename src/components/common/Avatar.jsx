import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Avatar component with fallback initials and online status indicator
 * Supports various sizes and customizable styling
 */
const Avatar = ({
  src,
  alt,
  name,
  size = 'md',
  online = false,
  className,
  fallbackClassName,
  onClick,
  ...props
}) => {
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
    '2xl': 'w-32 h-32 text-4xl',
  };

  const onlineIndicatorSizes = {
    xs: 'w-2 h-2',
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
    xl: 'w-5 h-5',
    '2xl': 'w-6 h-6',
  };

  const avatarClasses = cn(
    'relative inline-flex items-center justify-center rounded-full bg-light-cream overflow-hidden',
    'transition-all duration-300 ease-smooth',
    sizes[size],
    {
      'cursor-pointer hover:scale-105 hover:shadow-lg': onClick,
    },
    className
  );

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const showFallback = !src || imageError || !imageLoaded;

  return (
    <motion.div
      className={avatarClasses}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
      {...props}
    >
      {/* Image */}
      {src && !imageError && (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            {
              'opacity-0': !imageLoaded,
              'opacity-100': imageLoaded,
            }
          )}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      )}

      {/* Fallback */}
      {showFallback && (
        <div className={cn(
          'absolute inset-0 flex items-center justify-center bg-gradient-to-br from-vibrant-orange to-soft-purple text-white font-semibold',
          fallbackClassName
        )}>
          {name ? getInitials(name) : <User className="w-1/2 h-1/2" />}
        </div>
      )}

      {/* Online Status Indicator */}
      {online && (
        <motion.div
          className={cn(
            'absolute -bottom-0.5 -right-0.5 bg-success-green border-2 border-white rounded-full',
            onlineIndicatorSizes[size]
          )}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </motion.div>
  );
};

// Avatar Group Component for displaying multiple avatars
export const AvatarGroup = ({ 
  avatars = [], 
  max = 3, 
  size = 'md',
  className,
  ...props 
}) => {
  const displayAvatars = avatars.slice(0, max);
  const remainingCount = Math.max(0, avatars.length - max);

  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
    '2xl': 'w-32 h-32 text-4xl',
  };

  const groupClasses = cn('flex -space-x-2', className);

  return (
    <div className={groupClasses} {...props}>
      {displayAvatars.map((avatar, index) => (
        <Avatar
          key={avatar.id || index}
          src={avatar.src}
          name={avatar.name}
          alt={avatar.alt}
          size={size}
          online={avatar.online}
          className="ring-2 ring-white hover:z-10"
        />
      ))}
      
      {remainingCount > 0 && (
        <div className={cn(
          'flex items-center justify-center rounded-full bg-muted-gray text-white font-semibold ring-2 ring-white',
          sizes[size]
        )}>
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export default Avatar;