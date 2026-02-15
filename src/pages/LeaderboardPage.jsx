import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Medal,
  TrendingUp,
  Award,
  Star,
  Flame,
  Target,
  Clock,
  BookOpen,
  Users,
} from 'lucide-react';

import Card from '../components/common/Card';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';

/**
 * Leaderboard Page - Rankings and achievements
 */
const LeaderboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('weekly'); // 'weekly', 'monthly', 'allTime'
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);

  // Mock data - replace with real API call
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockData = [
        {
          id: 1,
          uid: user?.uid,
          name: user?.displayName || 'You',
          avatar: user?.photoURL,
          level: 12,
          xp: 8450,
          studyHours: 45.5,
          quizzesTaken: 28,
          streak: 15,
          rank: 3,
        },
        {
          id: 2,
          uid: '2',
          name: 'Sarah Johnson',
          avatar: null,
          level: 15,
          xp: 12340,
          studyHours: 67.2,
          quizzesTaken: 42,
          streak: 23,
          rank: 1,
        },
        {
          id: 3,
          uid: '3',
          name: 'Mike Chen',
          avatar: null,
          level: 14,
          xp: 10890,
          studyHours: 58.3,
          quizzesTaken: 35,
          streak: 18,
          rank: 2,
        },
        {
          id: 4,
          uid: '4',
          name: 'Emma Davis',
          avatar: null,
          level: 11,
          xp: 7650,
          studyHours: 42.1,
          quizzesTaken: 25,
          streak: 12,
          rank: 4,
        },
        {
          id: 5,
          uid: '5',
          name: 'Alex Kumar',
          avatar: null,
          level: 10,
          xp: 6890,
          studyHours: 38.7,
          quizzesTaken: 22,
          streak: 9,
          rank: 5,
        },
      ];

      setLeaderboard(mockData);
      setLoading(false);
    };

    fetchLeaderboard();
  }, [activeTab, user]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-600" />;
      default:
        return <span className="text-lg font-bold text-muted-gray">#{rank}</span>;
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return 'warning';
    if (rank === 2) return 'secondary';
    if (rank === 3) return 'info';
    return 'default';
  };

  return (
    <div className="min-h-screen bg-cool-blue-gray">
      {/* Header */}
      <div className="bg-gradient-to-r from-vibrant-orange to-soft-purple text-white">
        <div className="container-app py-8 md:py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Leaderboard</h1>
              <p className="text-white text-opacity-90">
                Compete with fellow students and climb the ranks
              </p>
            </div>
            <Trophy className="w-16 h-16 md:w-20 md:h-20 opacity-50" />
          </div>
        </div>
      </div>

      <div className="container-app py-6 md:py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center p-4">
            <Target className="w-8 h-8 mx-auto mb-2 text-vibrant-orange" />
            <p className="text-2xl font-bold text-primary-black">
              {leaderboard.find(u => u.uid === user?.uid)?.rank || '-'}
            </p>
            <p className="text-xs text-muted-gray">Your Rank</p>
          </Card>
          <Card className="text-center p-4">
            <Star className="w-8 h-8 mx-auto mb-2 text-info-blue" />
            <p className="text-2xl font-bold text-primary-black">
              {leaderboard.find(u => u.uid === user?.uid)?.xp || 0}
            </p>
            <p className="text-xs text-muted-gray">Total XP</p>
          </Card>
          <Card className="text-center p-4">
            <Flame className="w-8 h-8 mx-auto mb-2 text-warning-red" />
            <p className="text-2xl font-bold text-primary-black">
              {leaderboard.find(u => u.uid === user?.uid)?.streak || 0}
            </p>
            <p className="text-xs text-muted-gray">Day Streak</p>
          </Card>
          <Card className="text-center p-4">
            <Clock className="w-8 h-8 mx-auto mb-2 text-success-green" />
            <p className="text-2xl font-bold text-primary-black">
              {leaderboard.find(u => u.uid === user?.uid)?.studyHours?.toFixed(1) || 0}h
            </p>
            <p className="text-xs text-muted-gray">Study Time</p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {['weekly', 'monthly', 'allTime'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-vibrant-orange text-white'
                  : 'bg-white text-muted-gray hover:bg-light-cream'
              }`}
            >
              {tab === 'weekly' && 'This Week'}
              {tab === 'monthly' && 'This Month'}
              {tab === 'allTime' && 'All Time'}
            </button>
          ))}
        </div>

        {/* Leaderboard */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry, index) => {
              const isCurrentUser = entry.uid === user?.uid;

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={`p-4 md:p-6 ${
                      isCurrentUser ? 'ring-2 ring-vibrant-orange' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      {/* Rank */}
                      <div className="flex-shrink-0 w-12 flex items-center justify-center">
                        {getRankIcon(entry.rank)}
                      </div>

                      {/* Avatar */}
                      <Avatar
                        src={entry.avatar}
                        name={entry.name}
                        size="lg"
                        className="flex-shrink-0"
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-primary-black truncate">
                            {entry.name}
                            {isCurrentUser && (
                              <span className="text-vibrant-orange ml-2">(You)</span>
                            )}
                          </h3>
                          <Badge variant={getRankBadge(entry.rank)} size="sm">
                            Level {entry.level}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-gray">
                          <div className="flex items-center space-x-1">
                            <Star size={14} />
                            <span>{entry.xp} XP</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock size={14} />
                            <span>{entry.studyHours}h</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <BookOpen size={14} />
                            <span>{entry.quizzesTaken} quizzes</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Flame size={14} />
                            <span>{entry.streak} day streak</span>
                          </div>
                        </div>
                      </div>

                      {/* Trend */}
                      <div className="hidden md:flex flex-shrink-0 items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-success-green" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Achievements Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-primary-black mb-6">
            Your Achievements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Award, title: 'First Quiz', unlocked: true },
              { icon: Users, title: 'Team Player', unlocked: true },
              { icon: Flame, title: '7 Day Streak', unlocked: true },
              { icon: Trophy, title: 'Top 10', unlocked: false },
              { icon: BookOpen, title: '50 Quizzes', unlocked: false },
              { icon: Star, title: '10K XP', unlocked: false },
            ].map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <Card
                  key={index}
                  className={`text-center p-4 ${
                    achievement.unlocked ? '' : 'opacity-50 grayscale'
                  }`}
                >
                  <div
                    className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-vibrant-orange to-soft-purple'
                        : 'bg-muted-gray bg-opacity-20'
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        achievement.unlocked ? 'text-white' : 'text-muted-gray'
                      }`}
                    />
                  </div>
                  <p className="text-sm font-medium text-primary-black">
                    {achievement.title}
                  </p>
                  {!achievement.unlocked && (
                    <p className="text-xs text-muted-gray mt-1">Locked</p>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
