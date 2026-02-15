import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Check,
  Trash2,
  Users,
  MessageCircle,
  Trophy,
  Calendar,
  BookOpen,
  Settings,
} from 'lucide-react';

import Card from '../components/common/Card';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';

/**
 * Notifications Page
 * Shows user notifications and activity
 */
const NotificationsPage = () => {
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'mentions'
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'room_invite',
      icon: Users,
      title: 'Room Invitation',
      message: 'Sarah Johnson invited you to join "CS101 Study Group"',
      timestamp: new Date(Date.now() - 300000),
      read: false,
      actionable: true,
    },
    {
      id: 2,
      type: 'message',
      icon: MessageCircle,
      title: 'New Message',
      message: 'Mike Chen sent you a message',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
      actionable: false,
    },
    {
      id: 3,
      type: 'achievement',
      icon: Trophy,
      title: 'Achievement Unlocked!',
      message: 'You earned the "7 Day Streak" badge',
      timestamp: new Date(Date.now() - 7200000),
      read: true,
      actionable: false,
    },
    {
      id: 4,
      type: 'quiz',
      icon: BookOpen,
      title: 'Quiz Reminder',
      message: 'You have a pending quiz in "Mathematics"',
      timestamp: new Date(Date.now() - 86400000),
      read: true,
      actionable: true,
    },
    {
      id: 5,
      type: 'meeting',
      icon: Calendar,
      title: 'Upcoming Meeting',
      message: 'Study session starts in 30 minutes',
      timestamp: new Date(Date.now() - 172800000),
      read: true,
      actionable: false,
    },
  ]);

  const handleMarkAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all notifications?')) {
      setNotifications([]);
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'mentions') return notif.type === 'message';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIconColor = (type) => {
    switch (type) {
      case 'room_invite':
        return 'text-info-blue';
      case 'message':
        return 'text-vibrant-orange';
      case 'achievement':
        return 'text-warning-red';
      case 'quiz':
        return 'text-soft-purple';
      case 'meeting':
        return 'text-success-green';
      default:
        return 'text-muted-gray';
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-cool-blue-gray">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-muted-gray border-opacity-20">
        <div className="container-app py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-vibrant-orange to-soft-purple rounded-xl flex items-center justify-center relative">
                <Bell className="w-5 h-5 md:w-6 md:h-6 text-white" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-warning-red rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">
                      {unreadCount}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-bold text-primary-black">
                  Notifications
                </h1>
                <p className="text-xs md:text-sm text-muted-gray">
                  {unreadCount > 0
                    ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                    : 'All caught up!'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Check size={16} />}
                  onClick={handleMarkAllAsRead}
                  className="hidden md:flex"
                >
                  Mark all read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Trash2 size={16} />}
                  onClick={handleClearAll}
                  className="hidden md:flex"
                >
                  Clear all
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-app py-6 md:py-8">
        {/* Filters */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {[
            { value: 'all', label: 'All' },
            { value: 'unread', label: 'Unread', count: unreadCount },
            { value: 'mentions', label: 'Mentions' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                filter === tab.value
                  ? 'bg-vibrant-orange text-white'
                  : 'bg-white text-muted-gray hover:bg-light-cream'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-white bg-opacity-20 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <Card>
            <EmptyState
              icon={Bell}
              title="No notifications"
              description={
                filter === 'unread'
                  ? "You're all caught up! No unread notifications."
                  : 'You have no notifications at the moment.'
              }
            />
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification, index) => {
              const Icon = notification.icon;

              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={`p-4 ${
                      !notification.read ? 'bg-light-cream bg-opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center ${getIconColor(
                          notification.type
                        )}`}
                      >
                        <Icon size={20} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-primary-black">
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-vibrant-orange rounded-full flex-shrink-0 ml-2 mt-1" />
                          )}
                        </div>
                        <p className="text-sm text-muted-gray mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-4">
                          <span className="text-xs text-muted-gray">
                            {formatTime(notification.timestamp)}
                          </span>
                          {notification.actionable && (
                            <button className="text-xs text-vibrant-orange hover:underline">
                              View
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-2 hover:bg-light-cream rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <Check size={16} className="text-success-green" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-2 hover:bg-warning-red hover:bg-opacity-10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} className="text-warning-red" />
                        </button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Notification Settings */}
        <Card className="mt-8 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5 text-muted-gray" />
              <div>
                <h3 className="font-semibold text-primary-black">
                  Notification Settings
                </h3>
                <p className="text-sm text-muted-gray">
                  Manage your notification preferences
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              Configure
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NotificationsPage;
