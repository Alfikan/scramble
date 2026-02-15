import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Clock, 
  Brain, 
  Trophy,
  MessageCircle,
  ArrowRight
} from 'lucide-react';

import Button from '../components/common/Button';
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card';
import Badge from '../components/common/Badge';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, getUserStudySessions, getUserQuizAttempts } from '../services/userService';
import { getUserRooms } from '../services/roomService';
import LoadingSpinner from '../components/common/LoadingSpinner';

/**
 * Main dashboard page - overview of user's study activity
 * Shows quick stats, recent activity, and navigation to main features
 */
const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [userRooms, setUserRooms] = useState([]);
  const [recentSessions, setRecentSessions] = useState([]);
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      setLoading(true);
      
      try {
        // Fetch user profile
        const profileResult = await getUserProfile(user.uid);
        if (profileResult.success) {
          setUserProfile(profileResult.user);
        }

        // Fetch user's rooms
        const roomsResult = await getUserRooms(user.uid);
        console.log('Dashboard - Fetched rooms:', roomsResult);
        if (roomsResult.success) {
          setUserRooms(roomsResult.rooms);
        }

        // Fetch recent study sessions
        const sessionsResult = await getUserStudySessions(user.uid, 5);
        if (sessionsResult.success) {
          setRecentSessions(sessionsResult.sessions);
        }

        // Fetch recent quiz attempts
        const quizzesResult = await getUserQuizAttempts(user.uid, 5);
        if (quizzesResult.success) {
          setRecentQuizzes(quizzesResult.attempts);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cool-blue-gray flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const stats = userProfile?.stats || {};
  const todayStudyTime = '0h 0m'; // TODO: Calculate from today's sessions
  
  const quickStats = [
    {
      icon: <Clock className="w-6 h-6" />,
      label: 'Total Study Time',
      value: `${Math.floor(stats.totalStudyHours || 0)}h`,
      change: todayStudyTime + ' today',
      color: 'warm-yellow',
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: 'Active Rooms',
      value: userRooms.length.toString(),
      change: 'Joined rooms',
      color: 'soft-purple',
    },
    {
      icon: <Brain className="w-6 h-6" />,
      label: 'Quizzes Completed',
      value: (stats.totalQuizzesTaken || 0).toString(),
      change: `${Math.round(stats.averageQuizScore || 0)}% avg`,
      color: 'vibrant-orange',
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      label: 'Current Streak',
      value: `${stats.currentStreak || 0} days`,
      change: `Best: ${stats.longestStreak || 0} days`,
      color: 'success-green',
    },
  ];

  const recentActivity = [
    ...recentQuizzes.map(quiz => ({
      type: 'quiz',
      title: `Completed "${quiz.quizTitle || 'Quiz'}"`,
      score: `${Math.round(quiz.score || 0)}%`,
      time: formatTimeAgo(quiz.completedAt),
      icon: <Brain className="w-5 h-5" />,
      color: 'vibrant-orange',
    })),
    ...recentSessions.map(session => ({
      type: 'study',
      title: `Studied ${session.subject || 'General'} for ${session.duration || 0} minutes`,
      time: formatTimeAgo(session.endTime || session.startTime),
      icon: <Clock className="w-5 h-5" />,
      color: 'warm-yellow',
    })),
  ].sort((a, b) => {
    // Sort by time (most recent first)
    return 0; // Simplified for now
  }).slice(0, 4);

  // Helper function to format time ago
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Recently';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="min-h-screen bg-cool-blue-gray pb-safe">
      <div className="container-app py-4 sm:py-6 md:py-8">
        {/* Welcome Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-black">
            Welcome back, {user?.displayName?.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p className="text-sm sm:text-base text-muted-gray mt-1">
            Ready to continue your learning journey?
          </p>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Quick Stats */}
          <motion.section variants={itemVariants}>
            <h2 className="text-lg sm:text-xl font-semibold text-primary-black mb-4 md:mb-6">
              Today's Overview
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {quickStats.map((stat, index) => (
                <Card key={index} hoverable className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between">
                    <div className="mb-3 sm:mb-0">
                      <p className="text-xs sm:text-sm text-muted-gray mb-1">{stat.label}</p>
                      <p className="text-xl sm:text-2xl font-bold text-primary-black">
                        {stat.value}
                      </p>
                      <p className={`text-xs sm:text-sm text-${stat.color} font-medium mt-1`}>
                        {stat.change}
                      </p>
                    </div>
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-${stat.color} bg-opacity-10 rounded-xl flex items-center justify-center`}>
                      <div className={`text-${stat.color}`}>
                        {React.cloneElement(stat.icon, { className: 'w-5 h-5 sm:w-6 sm:h-6' })}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <motion.section variants={itemVariants} className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.length > 0 ? (
                      recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-light-cream transition-colors">
                          <div className={`w-10 h-10 bg-${activity.color} bg-opacity-10 rounded-full flex items-center justify-center`}>
                            <div className={`text-${activity.color}`}>
                              {activity.icon}
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-primary-black">
                              {activity.title}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <p className="text-sm text-muted-gray">{activity.time}</p>
                              {activity.score && (
                                <Badge variant="success" size="sm">
                                  {activity.score}
                                </Badge>
                              )}
                              {activity.duration && (
                                <Badge variant="info" size="sm">
                                  {activity.duration}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-gray">
                        <p>No recent activity yet.</p>
                        <p className="text-sm mt-2">Start studying to see your activity here!</p>
                      </div>
                    )}
                  </div>
                  {recentActivity.length > 0 && (
                    <div className="mt-6 text-center">
                      <Button 
                        variant="ghost" 
                        rightIcon={<ArrowRight size={16} />}
                        onClick={() => navigate('/private-space')}
                      >
                        View All Activity
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.section>

            {/* Upcoming Events / My Rooms */}
            <motion.section variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>My Study Rooms</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userRooms.length > 0 ? (
                      userRooms.slice(0, 3).map((room, index) => (
                        <div 
                          key={index} 
                          className="p-3 rounded-lg border border-muted-gray border-opacity-20 hover:border-opacity-40 transition-colors cursor-pointer"
                          onClick={() => navigate(`/room/${room.id}`)}
                        >
                          <h4 className="font-medium text-primary-black mb-1">
                            {room.name}
                          </h4>
                          <p className="text-sm text-muted-gray mb-2">
                            {room.subject || 'General'}
                          </p>
                          {room.memberCount && (
                            <div className="flex items-center space-x-2">
                              <Users size={14} className="text-muted-gray" />
                              <span className="text-sm text-muted-gray">
                                {room.memberCount} members
                              </span>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-gray">
                        <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No rooms yet.</p>
                        <p className="text-sm mt-2">Join or create a study room to get started!</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 text-center">
                    <Button 
                      variant="ghost" 
                      rightIcon={<ArrowRight size={16} />}
                      onClick={() => navigate('/rooms')}
                    >
                      {userRooms.length > 0 ? 'View All Rooms' : 'Browse Rooms'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          </div>

          {/* Quick Actions */}
          <motion.section variants={itemVariants}>
            <h2 className="text-lg sm:text-xl font-semibold text-primary-black mb-4 md:mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              <Card 
                hoverable 
                clickable 
                className="text-center p-4 sm:p-6 touch-target"
                onClick={() => navigate('/rooms')}
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-soft-purple bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-soft-purple" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-primary-black mb-1 sm:mb-2">
                  Join Study Room
                </h3>
                <p className="text-xs sm:text-sm text-muted-gray hidden sm:block">
                  Connect with classmates and study together
                </p>
              </Card>

              <Card 
                hoverable 
                clickable 
                className="text-center p-4 sm:p-6 touch-target"
                onClick={() => navigate('/private-space')}
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-warm-yellow bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-warm-yellow" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-primary-black mb-1 sm:mb-2">
                  Start Timer
                </h3>
                <p className="text-xs sm:text-sm text-muted-gray hidden sm:block">
                  Begin a focused study session
                </p>
              </Card>

              <Card 
                hoverable 
                clickable 
                className="text-center p-4 sm:p-6 touch-target"
                onClick={() => navigate('/ai-quiz')}
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-vibrant-orange bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-vibrant-orange" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-primary-black mb-1 sm:mb-2">
                  Take Quiz
                </h3>
                <p className="text-xs sm:text-sm text-muted-gray hidden sm:block">
                  Test your knowledge with AI-generated questions
                </p>
              </Card>

              <Card 
                hoverable 
                clickable 
                className="text-center p-4 sm:p-6 touch-target"
                onClick={() => navigate('/ai-chat')}
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-info-blue bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-info-blue" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-primary-black mb-1 sm:mb-2">
                  Ask AI
                </h3>
                <p className="text-xs sm:text-sm text-muted-gray hidden sm:block">
                  Get help from AI assistant
                </p>
              </Card>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;