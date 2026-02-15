import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

/**
 * Empty State Component
 * Shows when there's no data to display
 */
const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  actionIcon,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center py-12 ${className}`}
    >
      {Icon && (
        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 text-muted-gray opacity-50">
          <Icon className="w-full h-full" />
        </div>
      )}
      {title && (
        <h3 className="text-xl md:text-2xl font-bold text-primary-black mb-2">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-muted-gray mb-6 max-w-md mx-auto">{description}</p>
      )}
      {action && actionLabel && (
        <Button
          variant="primary"
          onClick={action}
          leftIcon={actionIcon}
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;
