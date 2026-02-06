import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Video, 
  MessageCircle, 
  Send,
  Settings,
  LogOut,
  UserPlus,
  MoreVertical,
  ArrowLeft,
  Phone,
  Mic,
  MicOff,
  VideoOff,
  Share2
} from 'lucide-react';

import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { getRoomById, leaveRoom } from '../services/roomService';
import { getUserProfile } from '../services/userService';

/**
 * Room Page - Individual study room with chat and video
 */
const RoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat', 'members', 'resources'
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      userId: 'user1',
      userName: 'Alex Student',
      userAvatar: null,
      text: 'Hey everyone! Ready to study?',
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: 2,
      userId: 'user2',
      userName: 'Sarah Chen',
      userAvatar: null,
      text: 'Yes! Let\'s start with Chapter 5',
      timestamp: new Date(Date.now() - 3000000),
    },
    {
      id: 3,
      userId: user?.uid,
      userName: user?.displayName || 'You',
      userAvatar: user?.photoURL,
      text: 'Sounds good! I have some questions about the homework.',
      timestamp: new Date(Date.now() - 1800000),
    },
  ]);
  const [members, setMembers] = useState([]);
  const [inCall, setInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    const fetchRoomData = async () => {
      setLoading(true);
      
      try {
        const result = await getRoomById(roomId);
        
        if (result.success) {
          setRoom(result.room);
          
          // Fetch member profiles
          if (result.room.members) {
            const memberProfiles = await Promise.all(
              result.room.members.map(async (memberId) => {
                const profile = await getUserProfile(memberId);
                return profile.success ? profile.user : null;
              })
            );
            setMembers(memberProfiles.filter(Boolean));
          }
        } else {
          // Room not found or error
          alert('Room not found');
          navigate('/rooms');
        }
      } catch (error) {
        console.error('Error fetching room:', error);
      } finally {
        setLoading(false);
      }
    };

    if (roomId) {
      fetchRoomData();
    }
  }, [roomId, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      userId: user.uid,
      userName: user.displayName || 'You',
      userAvatar: user.photoURL,
      text: message,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setMessage('');
    
    // TODO: Send to Firestore
  };

  const handleLeaveRoom = async () => {
    if (window.confirm('Are you sure you want to leave this room?')) {
      const result = await leaveRoom(roomId, user.uid);
      
      if (result.success) {
        navigate('/rooms');
      }
    }
  };

  const handleStartCall = () => {
    setInCall(true);
    // TODO: Initialize Agora video call
  };

  const handleEndCall = () => {
    setInCall(false);
    setIsMuted(false);
    setIsVideoOff(false);
    // TODO: End Agora video call
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cool-blue-gray flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-cool-blue-gray flex items-center justify-center">
        <Card className="text-center">
          <h2 className="text-2xl font-bold text-primary-black mb-4">
            Room Not Found
          </h2>
          <p className="text-muted-gray mb-6">
            This room doesn't exist or you don't have access to it.
          </p>
          <Button variant="primary" onClick={() => navigate('/rooms')}>
            Back to Rooms
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cool-blue-gray flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-muted-gray border-opacity-20">
        <div className="container-app py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/rooms')}
                className="p-2 hover:bg-light-cream rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-primary-black">
                  {room.name}
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="info" size="sm">
                    {room.subject}
                  </Badge>
                  <span className="text-sm text-muted-gray">
                    {members.length} members
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {!inCall ? (
                <Button
                  variant="primary"
                  leftIcon={<Video size={18} />}
                  onClick={handleStartCall}
                >
                  Start Call
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  className="text-warning-red"
                  leftIcon={<Phone size={18} />}
                  onClick={handleEndCall}
                >
                  End Call
                </Button>
              )}
              <Button
                variant="ghost"
                leftIcon={<LogOut size={18} />}
                onClick={handleLeaveRoom}
              >
                Leave
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Call Area */}
      {inCall && (
        <div className="bg-primary-black">
          <div className="container-app py-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Video Placeholders */}
              {members.slice(0, 4).map((member, index) => (
                <div
                  key={member.uid}
                  className="aspect-video bg-muted-gray bg-opacity-20 rounded-lg flex items-center justify-center relative"
                >
                  <Avatar
                    src={member.photoURL}
                    name={member.displayName}
                    size="lg"
                  />
                  <div className="absolute bottom-2 left-2 bg-primary-black bg-opacity-75 px-2 py-1 rounded text-white text-sm">
                    {member.displayName}
                  </div>
                </div>
              ))}
            </div>

            {/* Call Controls */}
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-4 rounded-full transition-colors ${
                  isMuted
                    ? 'bg-warning-red text-white'
                    : 'bg-white text-primary-black hover:bg-light-cream'
                }`}
              >
                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
              </button>
              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`p-4 rounded-full transition-colors ${
                  isVideoOff
                    ? 'bg-warning-red text-white'
                    : 'bg-white text-primary-black hover:bg-light-cream'
                }`}
              >
                {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
              </button>
              <button
                className="p-4 rounded-full bg-white text-primary-black hover:bg-light-cream transition-colors"
              >
                <Share2 size={24} />
              </button>
              <button
                onClick={handleEndCall}
                className="p-4 rounded-full bg-warning-red text-white hover:bg-red-600 transition-colors"
              >
                <Phone size={24} className="rotate-135" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 container-app py-6 flex gap-6">
        {/* Chat/Content Area */}
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 flex flex-col">
            {/* Tabs */}
            <div className="flex space-x-2 border-b border-muted-gray border-opacity-20 px-6 pt-4">
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                  activeTab === 'chat'
                    ? 'border-vibrant-orange text-vibrant-orange'
                    : 'border-transparent text-muted-gray hover:text-primary-black'
                }`}
              >
                <MessageCircle className="w-4 h-4 inline-block mr-2" />
                Chat
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                  activeTab === 'resources'
                    ? 'border-vibrant-orange text-vibrant-orange'
                    : 'border-transparent text-muted-gray hover:text-primary-black'
                }`}
              >
                Resources
              </button>
            </div>

            {/* Chat Messages */}
            {activeTab === 'chat' && (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((msg) => {
                    const isOwn = msg.userId === user.uid;
                    
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex space-x-3 max-w-md ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          <Avatar
                            src={msg.userAvatar}
                            name={msg.userName}
                            size="sm"
                          />
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium text-primary-black">
                                {msg.userName}
                              </span>
                              <span className="text-xs text-muted-gray">
                                {formatTime(msg.timestamp)}
                              </span>
                            </div>
                            <div
                              className={`px-4 py-2 rounded-lg ${
                                isOwn
                                  ? 'bg-vibrant-orange text-white'
                                  : 'bg-light-cream text-primary-black'
                              }`}
                            >
                              {msg.text}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-muted-gray border-opacity-20">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button
                      variant="primary"
                      leftIcon={<Send size={18} />}
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Resources Tab */}
            {activeTab === 'resources' && (
              <div className="flex-1 p-6">
                <div className="text-center py-12 text-muted-gray">
                  <Share2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="mb-2">No resources yet</p>
                  <p className="text-sm">
                    Share files, links, and study materials with your group
                  </p>
                  <Button variant="primary" className="mt-4" leftIcon={<UserPlus size={18} />}>
                    Upload Resource
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Members Sidebar */}
        <div className="w-80">
          <Card>
            <div className="p-4 border-b border-muted-gray border-opacity-20">
              <h3 className="font-semibold text-primary-black flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Members ({members.length})
              </h3>
            </div>
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {members.map((member) => (
                <div
                  key={member.uid}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-light-cream transition-colors"
                >
                  <Avatar
                    src={member.photoURL}
                    name={member.displayName}
                    size="sm"
                    online
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-primary-black truncate">
                      {member.displayName}
                      {member.uid === user.uid && ' (You)'}
                    </p>
                    <p className="text-xs text-muted-gray">
                      Level {member.stats?.level || 1}
                    </p>
                  </div>
                  {member.uid === room.createdBy && (
                    <Badge variant="warning" size="sm">
                      Owner
                    </Badge>
                  )}
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-muted-gray border-opacity-20">
              <Button
                variant="ghost"
                className="w-full"
                leftIcon={<UserPlus size={18} />}
              >
                Invite Members
              </Button>
            </div>
          </Card>

          {/* Room Info */}
          <Card className="mt-4">
            <div className="p-4">
              <h3 className="font-semibold text-primary-black mb-3">
                Room Info
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-gray">Subject:</span>
                  <span className="ml-2 text-primary-black">{room.subject}</span>
                </div>
                <div>
                  <span className="text-muted-gray">Created:</span>
                  <span className="ml-2 text-primary-black">
                    {room.createdAt?.toDate().toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-muted-gray">Capacity:</span>
                  <span className="ml-2 text-primary-black">
                    {members.length} / {room.maxMembers}
                  </span>
                </div>
              </div>
              {room.description && (
                <div className="mt-4 pt-4 border-t border-muted-gray border-opacity-20">
                  <p className="text-sm text-muted-gray">{room.description}</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;