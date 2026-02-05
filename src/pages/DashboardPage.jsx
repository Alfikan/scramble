import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Clock, 
  Brain, 
  Trophy,
  Calendar,
  MessageCircle,
  Video,
  Plus,
  ArrowRight
} from 'lucide-react';

import Button from '../components/common/Button';
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import { useAuth } from '../contexts/AuthContext';

/**
 * Main dashboard page - overview of user's study activity
 * Shows quick stats, recent activity, and navigation to main features
 */
const DashboardPage = () => {
  const { user } = useAuth();

  // Mock data for dashboard
  const quickStats = [
    {
      icon: <Clock className="w-6 h-6" />,
      label: 'Study Time Today',
      value: '2h 45m',
      change: '+15%',
      color: 'warm-yellow',
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: 'Active Rooms',
      value: '3',
      change: '+1',
      color: 'soft-purple',
    },
    {
      icon: <Brain className="w-6 h-6" />,
      label: 'Quizzes Completed',
      value: '12',
      change: '+4',
      color: 'vibrant-orange',
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      label: 'Current Streak',
      value: '7 days',
      change: 'New record!',
      color: 'success-green',
    },
  ];

  const recentActivity = [
    {
      type: 'quiz',
      title: 'Completed "JavaScript Fundamentals" quiz',
      score: '92%',
      time: '2 hours ago',
      icon: <Brain className="w-5 h-5" />,
      color: 'vibrant-orange',
    },
    {
      type: 'study',
      title: 'Studied Computer Science for 45 minutes',
      time: '3 hours ago',
      icon: <Clock className="w-5 h-5" />,
      color: 'warm-yellow',
    },
    {
      type: 'room',
      title: 'Joined "CS101 Study Group"',
      time: '1 day ago',
      icon: <Users className="w-5 h-5" />,
      color: 'soft-purple',
    },
    {
      type: 'meeting',
      title: 'Attended group study session',
      duration: '1h 30m',
      time: '2 days ago',
      icon: <Video className="w-5 h-5" />,
      color: 'info-blue',
    },
  ];

  const upcomingEvents = [
    {
      title: 'Mathematics Quiz Sprint',
      time: 'Today, 3:00 PM',
      participants: 8,
      type: 'quiz',
    },
    {
      title: 'Physics Study Session',
      time: 'Tomorrow, 10:00 AM',
      participants: 5,
      type: 'meeting',
    },
    {
      title: 'Computer Science Exam',
      time: 'Friday, 9:00 AM',
      type: 'exam',
    },
  ];

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
    <div className="min-h-screen bg-cool-blue-gray">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-muted-gray border-opacity-20">
        <div className="container-app py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary-black">
                Welcome back, {user?.displayName?.split(' ')[0] || 'Student'}! 👋
              </h1>
              <p className="text-muted-gray mt-1">
                Ready to continue your learning journey?
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" leftIcon={<Calendar size={18} />}>
                Schedule
              </Button>
              <Button variant="primary" leftIcon={<Plus size={18} />}>
                New Room
              </Button>
              <Avatar
                src={user?.avatar}
                name={user?.displayName}
                size="md"
                online
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container-app py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Quick Stats */}
          <motion.section variants={itemVariants}>
            <h2 className="text-xl font-semibold text-primary-black mb-6">
              Today's Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickStats.map((stat, index) => (
                <Card key={index} hoverable>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-gray mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-primary-black">
                        {stat.value}
                      </p>
                      <p className={`text-sm text-${stat.color} font-medium`}>
                        {stat.change}
                      </p>
                    </div>
                    <div className={`w-12 h-12 bg-${stat.color} bg-opacity-10 rounded-xl flex items-center justify-center`}>
                      <div className={`text-${stat.color}`}>
                        {stat.icon}
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
                    {recentActivity.map((activity, index) => (
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
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <Button variant="ghost" rightIcon={<ArrowRight size={16} />}>
                      View All Activity
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            {/* Upcoming Events */}
            <motion.section variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingEvents.map((event, index) => (
                      <div key={index} className="p-3 rounded-lg border border-muted-gray border-opacity-20 hover:border-opacity-40 transition-colors">
                        <h4 className="font-medium text-primary-black mb-1">
                          {event.title}
                        </h4>
                        <p className="text-sm text-muted-gray mb-2">
                          {event.time}
                        </p>
                        {event.participants && (
                          <div className="flex items-center space-x-2">
                            <Users size={14} className="text-muted-gray" />
                            <span className="text-sm text-muted-gray">
                              {event.participants} participants
                            </span>
                          </div>
                        )}
                        {event.type === 'exam' && (
                          <Badge variant="warning" size="sm">
                            Exam
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <Button variant="ghost" rightIcon={<ArrowRight size={16} />}>
                      View Calendar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          </div>

          {/* Quick Actions */}
          <motion.section variants={itemVariants}>
            <h2 className="text-xl font-semibold text-primary-black mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card hoverable clickable className="text-center">
                <div className="w-16 h-16 bg-soft-purple bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-soft-purple" />
                </div>
                <h3 className="font-semibold text-primary-black mb-2">
                  Join Study Room
                </h3>
                <p className="text-sm text-muted-gray">
                  Connect with classmates and study together
                </p>
              </Card>

              <Card hoverable clickable className="text-center">
                <div className="w-16 h-16 bg-warm-yellow bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-warm-yellow" />
                </div>
                <h3 className="font-semibold text-primary-black mb-2">
                  Start Timer
                </h3>
                <p className="text-sm text-muted-gray">
                  Begin a focused study session
                </p>
              </Card>

              <Card hoverable clickable className="text-center">
                <div className="w-16 h-16 bg-vibrant-orange bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-vibrant-orange" />
                </div>
                <h3 className="font-semibold text-primary-black mb-2">
                  Take Quiz
                </h3>
                <p className="text-sm text-muted-gray">
                  Test your knowledge with AI-generated questions
                </p>
              </Card>

              <Card hoverable clickable className="text-center">
                <div className="w-16 h-16 bg-info-blue bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-info-blue" />
                </div>
                <h3 className="font-semibold text-primary-black mb-2">
                  Ask Question
                </h3>
                <p className="text-sm text-muted-gray">
                  Get help from your study community
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