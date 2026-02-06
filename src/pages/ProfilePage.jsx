import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User,
  Mail,
  Calendar,
  Award,
  TrendingUp,
  Edit2,
  Camera,
  Save,
  X
} from 'lucide-react';

import Button from '../components/common/Button';
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, updateUserProfile } from '../services/userService';

/**
 * Profile Page - User profile and statistics
 */
const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [editForm, setEditForm] = useState({
    displayName: '',
    bio: '',
    subjects: [],
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      setLoading(true);
      const result = await getUserProfile(user.uid);
      
      if (result.success) {
        setUserProfile(result.user);
        setEditForm({
          displayName: result.user.displayName || '',
          bio: result.user.bio || '',
          subjects: result.user.subjects || [],
        });
      }
      
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    
    try {
      // Update Firebase Auth profile
      await updateProfile({
        displayName: editForm.displayName,
      });

      // Update Firestore profile
      await updateUserProfile(user.uid, {
        displayName: editForm.displayName,
        bio: editForm.bio,
        subjects: editForm.subjects,
      });

      setUserProfile({
        ...userProfile,
        ...editForm,
      });

      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      displayName: userProfile?.displayName || '',
      bio: userProfile?.bio || '',
      subjects: userProfile?.subjects || [],
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const stats = userProfile?.stats || {};
  const badges = userProfile?.badges || [];

  return (
    <div className="min-h-screen bg-cool-blue-gray">
      {/* Header */}
      <div className="bg-gradient-to-br from-vibrant-orange to-soft-purple">
        <div className="container-app py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar
                  src={user?.photoURL}
                  name={user?.displayName}
                  size="xl"
                  className="border-4 border-white shadow-lg"
                />
                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:bg-light-cream transition-colors">
                  <Camera size={16} className="text-primary-black" />
                </button>
              </div>

              <div className="text-white">
                {editing ? (
                  <Input
                    value={editForm.displayName}
                    onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                    className="text-3xl font-bold mb-2 bg-white bg-opacity-20 text-white"
                  />
                ) : (
                  <h1 className="text-4xl font-bold mb-2">
                    {userProfile?.displayName || 'User'}
                  </h1>
                )}
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" size="lg">
                    Level {stats.level || 1}
                  </Badge>
                  <span className="text-white text-opacity-90">
                    {stats.xp || 0} XP
                  </span>
                </div>
              </div>
            </div>

            <div>
              {!editing ? (
                <Button
                  variant="secondary"
                  leftIcon={<Edit2 size={18} />}
                  onClick={() => setEditing(true)}
                  className="bg-white text-primary-black hover:bg-light-cream"
                >
                  Edit Profile
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    leftIcon={<X size={18} />}
                    onClick={handleCancel}
                    className="bg-white bg-opacity-20 text-white hover:bg-opacity-30"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="secondary"
                    leftIcon={<Save size={18} />}
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-white text-primary-black hover:bg-light-cream"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-app py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                {editing ? (
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-muted-gray border-opacity-30 focus:border-vibrant-orange focus:outline-none transition-colors resize-none"
                    rows="4"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-muted-gray">
                    {userProfile?.bio || 'No bio added yet. Click "Edit Profile" to add one!'}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Study Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-light-cream rounded-lg">
                    <div className="text-3xl font-bold text-vibrant-orange mb-1">
                      {Math.floor(stats.totalStudyHours || 0)}h
                    </div>
                    <div className="text-sm text-muted-gray">Study Time</div>
                  </div>

                  <div className="text-center p-4 bg-light-cream rounded-lg">
                    <div className="text-3xl font-bold text-soft-purple mb-1">
                      {stats.totalQuizzesTaken || 0}
                    </div>
                    <div className="text-sm text-muted-gray">Quizzes</div>
                  </div>

                  <div className="text-center p-4 bg-light-cream rounded-lg">
                    <div className="text-3xl font-bold text-success-green mb-1">
                      {stats.currentStreak || 0}
                    </div>
                    <div className="text-sm text-muted-gray">Day Streak</div>
                  </div>

                  <div className="text-center p-4 bg-light-cream rounded-lg">
                    <div className="text-3xl font-bold text-info-blue mb-1">
                      {Math.round(stats.averageQuizScore || 0)}%
                    </div>
                    <div className="text-sm text-muted-gray">Avg Score</div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-light-cream rounded-lg">
                    <span className="text-sm text-muted-gray">Doubts Raised</span>
                    <span className="font-semibold text-primary-black">
                      {stats.doubtsRaised || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-light-cream rounded-lg">
                    <span className="text-sm text-muted-gray">Doubts Resolved</span>
                    <span className="font-semibold text-primary-black">
                      {stats.doubtsResolved || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-light-cream rounded-lg">
                    <span className="text-sm text-muted-gray">Meetings Attended</span>
                    <span className="font-semibold text-primary-black">
                      {stats.meetingsAttended || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-light-cream rounded-lg">
                    <span className="text-sm text-muted-gray">Longest Streak</span>
                    <span className="font-semibold text-primary-black">
                      {stats.longestStreak || 0} days
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                {badges.length > 0 ? (
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                    {badges.map((badge, index) => (
                      <div
                        key={index}
                        className="text-center p-4 bg-light-cream rounded-lg hover:bg-warm-yellow hover:bg-opacity-20 transition-colors"
                      >
                        <Award className="w-8 h-8 mx-auto mb-2 text-warm-yellow" />
                        <p className="text-xs text-muted-gray capitalize">
                          {badge.replace('-', ' ')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-gray">
                    <Award className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No badges earned yet.</p>
                    <p className="text-sm mt-2">Keep studying to unlock achievements!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Info */}
          <div className="space-y-6">
            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle>Account Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-muted-gray" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-gray">Email</p>
                    <p className="font-medium text-primary-black">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-muted-gray" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-gray">Joined</p>
                    <p className="font-medium text-primary-black">
                      {userProfile?.createdAt?.toDate().toLocaleDateString() || 'Recently'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-muted-gray" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-gray">Account Type</p>
                    <p className="font-medium text-primary-black">
                      {user?.provider === 'google' ? 'Google' : 'Email'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Level Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Level Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-vibrant-orange mb-2">
                    Level {stats.level || 1}
                  </div>
                  <p className="text-sm text-muted-gray">
                    {stats.xp || 0} / {((stats.level || 1) * 1000)} XP
                  </p>
                </div>

                <div className="w-full bg-light-cream rounded-full h-3 mb-4">
                  <div
                    className="bg-gradient-to-r from-vibrant-orange to-soft-purple h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        ((stats.xp || 0) / ((stats.level || 1) * 1000)) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-success-green" />
                  <span className="text-sm text-muted-gray">
                    {((stats.level || 1) * 1000) - (stats.xp || 0)} XP to next level
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Subjects */}
            <Card>
              <CardHeader>
                <CardTitle>Subjects</CardTitle>
              </CardHeader>
              <CardContent>
                {editing ? (
                  <Input
                    placeholder="Add subjects (comma separated)"
                    value={editForm.subjects.join(', ')}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        subjects: e.target.value.split(',').map((s) => s.trim()),
                      })
                    }
                  />
                ) : userProfile?.subjects && userProfile.subjects.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {userProfile.subjects.map((subject, index) => (
                      <Badge key={index} variant="info">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-gray">No subjects added yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;