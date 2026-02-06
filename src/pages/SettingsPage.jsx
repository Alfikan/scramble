import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell,
  Lock,
  Palette,
  Globe,
  Shield,
  Trash2,
  Save,
  Moon,
  Sun,
  Volume2,
  VolumeX
} from 'lucide-react';

import Button from '../components/common/Button';
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Settings Page - App preferences and account settings
 */
const SettingsPage = () => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  // Notification settings
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    roomInvites: true,
    studyReminders: true,
    achievements: true,
  });

  // Study preferences
  const [studyPrefs, setStudyPrefs] = useState({
    pomodoroLength: 25,
    breakLength: 5,
    longBreakLength: 15,
    autoStartBreaks: false,
    soundEnabled: true,
    focusMusic: false,
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showOnlineStatus: true,
    allowRoomInvites: true,
    showStudyStats: true,
  });

  const handleSaveSettings = () => {
    // TODO: Save to Firestore
    alert('Settings saved successfully!');
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    ) {
      // TODO: Implement account deletion
      alert('Account deletion not implemented yet');
    }
  };

  return (
    <div className="min-h-screen bg-cool-blue-gray">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-muted-gray border-opacity-20">
        <div className="container-app py-6">
          <h1 className="text-3xl font-bold text-primary-black">Settings</h1>
          <p className="text-muted-gray mt-1">
            Manage your account and app preferences
          </p>
        </div>
      </div>

      <div className="container-app py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Appearance */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Palette className="w-5 h-5 text-vibrant-orange" />
                <CardTitle>Appearance</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-primary-black">Theme</p>
                  <p className="text-sm text-muted-gray">
                    Choose your preferred color scheme
                  </p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="p-3 rounded-lg bg-light-cream hover:bg-warm-yellow hover:bg-opacity-20 transition-colors"
                >
                  {isDark ? (
                    <Sun className="w-5 h-5 text-warm-yellow" />
                  ) : (
                    <Moon className="w-5 h-5 text-soft-purple" />
                  )}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-vibrant-orange" />
                <CardTitle>Notifications</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-primary-black">Email Notifications</p>
                  <p className="text-sm text-muted-gray">
                    Receive updates via email
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) =>
                    setNotifications({ ...notifications, email: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-muted-gray text-vibrant-orange focus:ring-vibrant-orange"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-primary-black">Push Notifications</p>
                  <p className="text-sm text-muted-gray">
                    Get notified about important updates
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={(e) =>
                    setNotifications({ ...notifications, push: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-muted-gray text-vibrant-orange focus:ring-vibrant-orange"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-primary-black">Room Invites</p>
                  <p className="text-sm text-muted-gray">
                    Notify when invited to study rooms
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.roomInvites}
                  onChange={(e) =>
                    setNotifications({ ...notifications, roomInvites: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-muted-gray text-vibrant-orange focus:ring-vibrant-orange"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-primary-black">Study Reminders</p>
                  <p className="text-sm text-muted-gray">
                    Get reminded to study regularly
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.studyReminders}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      studyReminders: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded border-muted-gray text-vibrant-orange focus:ring-vibrant-orange"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-primary-black">Achievements</p>
                  <p className="text-sm text-muted-gray">
                    Celebrate when you earn badges
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.achievements}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      achievements: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded border-muted-gray text-vibrant-orange focus:ring-vibrant-orange"
                />
              </div>
            </CardContent>
          </Card>

          {/* Study Preferences */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-vibrant-orange" />
                <CardTitle>Study Preferences</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary-black mb-2">
                    Pomodoro Length (min)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={studyPrefs.pomodoroLength}
                    onChange={(e) =>
                      setStudyPrefs({
                        ...studyPrefs,
                        pomodoroLength: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-muted-gray border-opacity-30 focus:border-vibrant-orange focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-black mb-2">
                    Short Break (min)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={studyPrefs.breakLength}
                    onChange={(e) =>
                      setStudyPrefs({
                        ...studyPrefs,
                        breakLength: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-muted-gray border-opacity-30 focus:border-vibrant-orange focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-black mb-2">
                    Long Break (min)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={studyPrefs.longBreakLength}
                    onChange={(e) =>
                      setStudyPrefs({
                        ...studyPrefs,
                        longBreakLength: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-muted-gray border-opacity-30 focus:border-vibrant-orange focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-primary-black">Auto-start Breaks</p>
                  <p className="text-sm text-muted-gray">
                    Automatically start breaks after sessions
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={studyPrefs.autoStartBreaks}
                  onChange={(e) =>
                    setStudyPrefs({ ...studyPrefs, autoStartBreaks: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-muted-gray text-vibrant-orange focus:ring-vibrant-orange"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-primary-black">Sound Effects</p>
                  <p className="text-sm text-muted-gray">
                    Play sounds for timer events
                  </p>
                </div>
                <button
                  onClick={() =>
                    setStudyPrefs({ ...studyPrefs, soundEnabled: !studyPrefs.soundEnabled })
                  }
                  className="p-2 rounded-lg bg-light-cream hover:bg-warm-yellow hover:bg-opacity-20 transition-colors"
                >
                  {studyPrefs.soundEnabled ? (
                    <Volume2 className="w-5 h-5 text-vibrant-orange" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-muted-gray" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-primary-black">Focus Music</p>
                  <p className="text-sm text-muted-gray">
                    Play background music during study
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={studyPrefs.focusMusic}
                  onChange={(e) =>
                    setStudyPrefs({ ...studyPrefs, focusMusic: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-muted-gray text-vibrant-orange focus:ring-vibrant-orange"
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-vibrant-orange" />
                <CardTitle>Privacy</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-primary-black">Public Profile</p>
                  <p className="text-sm text-muted-gray">
                    Make your profile visible to others
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={privacy.profileVisible}
                  onChange={(e) =>
                    setPrivacy({ ...privacy, profileVisible: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-muted-gray text-vibrant-orange focus:ring-vibrant-orange"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-primary-black">Online Status</p>
                  <p className="text-sm text-muted-gray">
                    Show when you're online
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={privacy.showOnlineStatus}
                  onChange={(e) =>
                    setPrivacy({ ...privacy, showOnlineStatus: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-muted-gray text-vibrant-orange focus:ring-vibrant-orange"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-primary-black">Room Invites</p>
                  <p className="text-sm text-muted-gray">
                    Allow others to invite you to rooms
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={privacy.allowRoomInvites}
                  onChange={(e) =>
                    setPrivacy({ ...privacy, allowRoomInvites: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-muted-gray text-vibrant-orange focus:ring-vibrant-orange"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-primary-black">Study Statistics</p>
                  <p className="text-sm text-muted-gray">
                    Show your study stats on profile
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={privacy.showStudyStats}
                  onChange={(e) =>
                    setPrivacy({ ...privacy, showStudyStats: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-muted-gray text-vibrant-orange focus:ring-vibrant-orange"
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-vibrant-orange" />
                <CardTitle>Account</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-light-cream rounded-lg">
                <div>
                  <p className="font-medium text-primary-black">Change Password</p>
                  <p className="text-sm text-muted-gray">
                    Update your account password
                  </p>
                </div>
                <Button variant="ghost">Change</Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-warning-red bg-opacity-10 rounded-lg border border-warning-red border-opacity-20">
                <div>
                  <p className="font-medium text-warning-red">Delete Account</p>
                  <p className="text-sm text-warning-red text-opacity-75">
                    Permanently delete your account and data
                  </p>
                </div>
                <Button
                  variant="ghost"
                  className="text-warning-red hover:bg-warning-red hover:bg-opacity-10"
                  leftIcon={<Trash2 size={18} />}
                  onClick={handleDeleteAccount}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end space-x-4">
            <Button variant="ghost">Reset to Defaults</Button>
            <Button
              variant="primary"
              leftIcon={<Save size={18} />}
              onClick={handleSaveSettings}
            >
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;