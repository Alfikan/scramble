import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  Users,
  Bot,
  Brain,
  User,
} from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Mobile Bottom Navigation Component
 * Fixed bottom navigation for mobile devices
 */
const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
    },
    {
      name: 'Rooms',
      icon: Users,
      path: '/rooms',
    },
    {
      name: 'AI Chat',
      icon: Bot,
      path: '/ai-chat',
    },
    {
      name: 'Quiz',
      icon: Brain,
      path: '/ai-quiz',
    },
    {
      name: 'Profile',
      icon: User,
      path: '/profile',
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-muted-gray border-opacity-20 shadow-lg z-30 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center flex-1 py-2 px-1 relative touch-target"
            >
              {active && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-vibrant-orange bg-opacity-10 rounded-xl"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon
                size={22}
                className={`mb-1 relative z-10 ${
                  active ? 'text-vibrant-orange' : 'text-muted-gray'
                }`}
              />
              <span
                className={`text-xs font-medium relative z-10 ${
                  active ? 'text-vibrant-orange' : 'text-muted-gray'
                }`}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
