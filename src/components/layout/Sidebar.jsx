import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { bottomItems } from '../../constants/bottomItems';
import { navigationItems } from '../../constants/navigationItems';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen,ChevronRight,ChevronLeft,LogOut } from 'lucide-react';

const Sidebar = ({ onNavigate, isMobile = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const handleNavigation = (path) => {
    navigate(path);
    if (onNavigate) {
      onNavigate();
    }
  };

  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      await signOut();
      navigate('/');
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: isMobile ? 280 : (isCollapsed ? 80 : 280) }}
      className="h-screen bg-white border-r border-muted-gray border-opacity-20 flex flex-col fixed left-0 top-0 z-40 shadow-lg overflow-y-auto"
    >
      {/* Header */}
      <div className="p-4 border-b border-muted-gray border-opacity-20 flex-shrink-0">
        <div className="flex items-center justify-between">
          {(!isCollapsed || isMobile) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-vibrant-orange to-soft-purple rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-primary-black">Scramble</span>
            </motion.div>
          )}
          
          {!isMobile && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-light-cream rounded-lg transition-colors touch-target"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight size={20} className="text-muted-gray" />
              ) : (
                <ChevronLeft size={20} className="text-muted-gray" />
              )}
            </button>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              disabled={item.badge === 'Soon'}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors touch-target ${
                active
                  ? 'bg-vibrant-orange text-white shadow-md'
                  : item.badge === 'Soon'
                  ? 'text-muted-gray cursor-not-allowed opacity-50'
                  : 'text-primary-black hover:bg-light-cream active:bg-light-cream'
              }`}
            >
              <Icon size={20} className="flex-shrink-0" />
              
              {(!isCollapsed || isMobile) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex items-center justify-between min-w-0"
                >
                  <span className="font-medium text-sm truncate">{item.name}</span>
                  {item.badge && (
                    <Badge 
                      variant={active ? 'secondary' : 'warning'} 
                      size="sm"
                      className="flex-shrink-0 ml-2"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </motion.div>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-muted-gray border-opacity-20 space-y-2 flex-shrink-0">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors touch-target ${
                active
                  ? 'bg-light-cream text-vibrant-orange'
                  : 'text-muted-gray hover:bg-light-cream hover:text-primary-black active:bg-light-cream'
              }`}
            >
              <Icon size={20} className="flex-shrink-0" />
              
              {(!isCollapsed || isMobile) && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-medium text-sm"
                >
                  {item.name}
                </motion.span>
              )}
            </button>
          );
        })}

        <button
          onClick={handleSignOut}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-warning-red hover:bg-warning-red hover:bg-opacity-10 transition-colors touch-target active:bg-warning-red active:bg-opacity-20"
        >
          <LogOut size={20} className="flex-shrink-0" />
          
          {(!isCollapsed || isMobile) && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-medium text-sm"
            >
              Sign Out
            </motion.span>
          )}
        </button>
      </div>

      {isCollapsed && (
        <div className="absolute top-4 right-2">
          <div className="w-2 h-2 bg-vibrant-orange rounded-full"></div>
        </div>
      )}
    </motion.div>
  );
};

export default Sidebar;