import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Plus,
  Search,
  Filter,
  X,
  Lock,
  Globe,
  BookOpen,
  ArrowRight
} from 'lucide-react';

import Button from '../components/common/Button';
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useRooms } from '../hooks/useRooms';
import { useAuth } from '../contexts/AuthContext';

/**
 * Rooms Page - Browse and manage study rooms
 */
const RoomsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { publicRooms, userRooms, loading, createRoom, joinRoom, searchRooms } = useRooms();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'my-rooms'

  // Create room form state
  const [newRoom, setNewRoom] = useState({
    name: '',
    subject: '',
    description: '',
    isPublic: true,
    maxMembers: 10,
  });

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim()) {
      await searchRooms(term);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();

    const result = await createRoom(newRoom);

    if (result.success) {
      setShowCreateModal(false);
      setNewRoom({
        name: '',
        subject: '',
        description: '',
        isPublic: true,
        maxMembers: 10,
      });

      // Navigate to the new room
      navigate(`/room/${result.roomId}`);
    }
  };

  const handleJoinRoom = async (roomId) => {
    const result = await joinRoom(roomId);

    if (result.success) {
      navigate(`/room/${roomId}`);
    }
  };

  const displayRooms = activeTab === 'my-rooms' ? userRooms : publicRooms;

  return (
    <div className="min-h-screen bg-cool-blue-gray">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-muted-gray border-opacity-20">
        <div className="container-app py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary-black">Study Rooms</h1>
              <p className="text-muted-gray mt-1">
                Join or create study groups with friends and classmates
              </p>
            </div>

            <Button
              variant="primary"
              leftIcon={<Plus size={18} />}
              onClick={() => setShowCreateModal(true)}
            >
              Create Room
            </Button>
          </div>
        </div>
      </div>

      <div className="container-app py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search rooms by name, subject, or description..."
                leftIcon={<Search size={20} />}
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <Button variant="ghost" leftIcon={<Filter size={18} />}>
              Filters
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 border-b border-muted-gray border-opacity-20">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${activeTab === 'all'
                ? 'border-vibrant-orange text-vibrant-orange'
                : 'border-transparent text-muted-gray hover:text-primary-black'
                }`}
            >
              All Rooms ({publicRooms.length})
            </button>
            <button
              onClick={() => setActiveTab('my-rooms')}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${activeTab === 'my-rooms'
                  ? 'border-vibrant-orange text-vibrant-orange'
                  : 'border-transparent text-muted-gray hover:text-primary-black'
                }`}
            >
              My Rooms
            </button>{user && (
              <button
                onClick={() => setActiveTab('my-rooms')}
                className={`px-4 py-2 font-medium transition-colors border-b-2 ${activeTab === 'my-rooms'
                    ? 'border-vibrant-orange text-vibrant-orange'
                    : 'border-transparent text-muted-gray hover:text-primary-black'
                  }`}
              >
                My Rooms ({userRooms.length})
              </button>
            )}
        </div>
      </div>

      {/* Rooms Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : displayRooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayRooms.map((room) => {
            const isMember = userRooms.some(r => r.id === room.id);

            return (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card hoverable className="h-full flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-primary-black mb-1">
                        {room.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="info" size="sm">
                          {room.subject || 'General'}
                        </Badge>
                        {room.isPublic ? (
                          <Globe size={14} className="text-muted-gray" />
                        ) : (
                          <Lock size={14} className="text-muted-gray" />
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-gray mb-4 flex-1">
                    {room.description || 'No description provided'}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-muted-gray border-opacity-20">
                    <div className="flex items-center space-x-2 text-muted-gray">
                      <Users size={16} />
                      <span className="text-sm">
                        {room.memberCount || 0} / {room.maxMembers || 10}
                      </span>
                    </div>

                    {isMember ? (
                      <Button
                        variant="primary"
                        size="sm"
                        rightIcon={<ArrowRight size={16} />}
                        onClick={() => navigate(`/room/${room.id}`)}
                      >
                        Enter
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleJoinRoom(room.id)}
                        disabled={room.memberCount >= room.maxMembers}
                      >
                        {room.memberCount >= room.maxMembers ? 'Full' : 'Join'}
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-12">
          <Users className="w-16 h-16 mx-auto mb-4 text-muted-gray opacity-50" />
          <h3 className="text-xl font-semibold text-primary-black mb-2">
            {activeTab === 'my-rooms' ? 'No rooms yet' : 'No rooms found'}
          </h3>
          <p className="text-muted-gray mb-6">
            {activeTab === 'my-rooms'
              ? 'Join or create a study room to get started!'
              : 'Try adjusting your search or create a new room.'}
          </p>
          <Button
            variant="primary"
            leftIcon={<Plus size={18} />}
            onClick={() => setShowCreateModal(true)}
          >
            Create Your First Room
          </Button>
        </Card>
      )}
    </div>

      {/* Create Room Modal */ }
  <AnimatePresence>
    {showCreateModal && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-primary-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={() => setShowCreateModal(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-card-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary-black">
                Create Study Room
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-light-cream rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4">
              <Input
                label="Room Name"
                placeholder="e.g., CS101 Study Group"
                value={newRoom.name}
                onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                required
              />

              <Input
                label="Subject"
                placeholder="e.g., Computer Science"
                leftIcon={<BookOpen size={20} />}
                value={newRoom.subject}
                onChange={(e) => setNewRoom({ ...newRoom, subject: e.target.value })}
                required
              />

              <div>
                <label className="block text-sm font-medium text-primary-black mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-lg border border-muted-gray border-opacity-30 focus:border-vibrant-orange focus:outline-none transition-colors resize-none"
                  rows="3"
                  placeholder="Describe what this room is for..."
                  value={newRoom.description}
                  onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-black mb-2">
                  Max Members
                </label>
                <input
                  type="number"
                  min="2"
                  max="50"
                  className="w-full px-4 py-3 rounded-lg border border-muted-gray border-opacity-30 focus:border-vibrant-orange focus:outline-none transition-colors"
                  value={newRoom.maxMembers}
                  onChange={(e) => setNewRoom({ ...newRoom, maxMembers: parseInt(e.target.value) })}
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={newRoom.isPublic}
                  onChange={(e) => setNewRoom({ ...newRoom, isPublic: e.target.checked })}
                  className="w-5 h-5 rounded border-muted-gray text-vibrant-orange focus:ring-vibrant-orange"
                />
                <label htmlFor="isPublic" className="text-sm text-primary-black">
                  Make this room public (anyone can join)
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={!newRoom.name || !newRoom.subject}
                >
                  Create Room
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
    </div >
  );
};

export default RoomsPage;