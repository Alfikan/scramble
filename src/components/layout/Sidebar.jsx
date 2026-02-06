import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  Users,
  Clock,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  User,
  Bell,
  Trophy,
  MessageSquare,
  HelpCircle
} from 'lucide-react';

import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Sidebar Navigation Component
 * Provides navigation between all pages with collapsible functionality
 */
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      badge: null,
    },
    {
      name: 'Study Rooms',
      icon: Users,
      path: '/rooms',
      badge: null,
    },
    {
      name: 'Private Space',
      icon: Clock,
      path: '/private-space',
      badge: null,
    },
    {
      name: 'Leaderboard',
      icon: Trophy,
      path: '/leaderboard',
      badge: 'Soon',
    },
    {
      name: 'Messages',
      icon: MessageSquare,
      path: '/messages',
      badge: 'Soon',
    },
  ];

  const bottomItems = [
    {
      name: 'Profile',
      icon: User,
      path: '/profile',
    },
    {
      name: 'Settings',
      icon: Settings,
      path: '/settings',
    },
    {
      name: 'Help',
      icon: HelpCircle,
      path: '/help',
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
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
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="h-screen bg-white border-r border-muted-gray border-opacity-20 flex flex-col fixed left-0 top-0 z-40 shadow-sm"
    >
      {/* Header */}
      <div className="p-4 border-b border-muted-gray border-opacity-20">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
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
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-light-cream rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight size={20} className="text-muted-gray" />
            ) : (
              <ChevronLeft size={20} className="text-muted-gray" />
            )}
          </button>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-b border-muted-gray border-opacity-20">
        <button
          onClick={() => handleNavigation('/profile')}
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-light-cream transition-colors"
        >
          <Avatar
            src={user?.photoURL}
            name={user?.displayName}
            size="md"
            online
          />
          
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 text-left min-w-0"
            >
              <p className="font-semibold text-primary-black truncate">
                {user?.displayName || 'User'}
              </p>
              <div className="flex items-center space-x-2">
                <Badge variant="info" size="sm">
                  Level {user?.stats?.level || 1}
                </Badge>
                <span className="text-xs text-muted-gray">
                  {user?.stats?.xp || 0} XP
                </span>
              </div>
            </motion.div>
          )}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              disabled={item.badge === 'Soon'}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                active
                  ? 'bg-vibrant-orange text-white'
                  : item.badge === 'Soon'
                  ? 'text-muted-gray cursor-not-allowed opacity-50'
                  : 'text-primary-black hover:bg-light-cream'
              }`}
            >
              <Icon size={20} />
              
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex items-center justify-between"
                >
                  <span className="font-medium">{item.name}</span>
                  {item.badge && (
                    <Badge 
                      variant={active ? 'secondary' : 'warning'} 
                      size="sm"
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

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-muted-gray border-opacity-20 space-y-2">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                active
                  ? 'bg-light-cream text-vibrant-orange'
                  : 'text-muted-gray hover:bg-light-cream hover:text-primary-black'
              }`}
            >
              <Icon size={20} />
              
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-medium"
                >
                  {item.name}
                </motion.span>
              )}
            </button>
          );
        })}

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-warning-red hover:bg-warning-red hover:bg-opacity-10 transition-colors"
        >
          <LogOut size={20} />
          
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-medium"
            >
              Sign Out
            </motion.span>
          )}
        </button>
      </div>

      {/* Notifications Badge (if collapsed) */}
      {isCollapsed && (
        <div className="absolute top-4 right-2">
          <div className="w-2 h-2 bg-vibrant-orange rounded-full"></div>
        </div>
      )}
    </motion.div>
  );
};

export default Sidebar;