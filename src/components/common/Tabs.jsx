import React from 'react';
import { motion } from 'framer-motion';

/**
 * Tabs Component
 * Reusable tabs navigation
 */
const Tabs = ({ tabs, activeTab, onChange, variant = 'default' }) => {
  return (
    <div className="flex space-x-2 border-b border-muted-gray border-opacity-20">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        const Icon = tab.icon;

        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            disabled={tab.disabled}
            className={`relative px-4 py-3 font-medium transition-colors ${
              tab.disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:text-vibrant-orange'
            } ${
              isActive
                ? 'text-vibrant-orange'
                : 'text-muted-gray'
            }`}
          >
            <div className="flex items-center space-x-2">
              {Icon && <Icon size={18} />}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-vibrant-orange text-white rounded-full">
                  {tab.badge}
                </span>
              )}
            </div>

            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-vibrant-orange"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
