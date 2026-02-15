import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Video, 
  MessageCircle, 
  Send,
  LogOut,
  UserPlus,
  ArrowLeft,
  Phone,
  Mic,
  MicOff,
  VideoOff,
  Share2,
  Upload,
  Download,
  Trash2,
  X,
  Menu,
  FileText,
  Phone
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
import { useChat } from '../hooks/useChat';
import { useResources } from '../hooks/useResources';
import { useJitsi } from '../hooks/useJitsi';
import { formatFileSize, getFileIcon } from '../services/resourceService';

/**
 * Room Page - Individual study room with chat, video, and resources
 * Fully responsive and functional
 */
const RoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');
  const [message, setMessage] = useState('');
  const [members, setMembers] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Use custom hooks
  const { messages, sending, sendMessage: sendChatMessage } = useChat(roomId);
  const { 
    resources, 
    uploading, 
    uploadProgress, 
    uploadFile, 
    deleteResource: deleteResourceFile 
  } = useResources(roomId);
  
  // Jitsi Meet video calling
  const {
    inCall,
    isMuted,
    isVideoOff,
    participantCount,
    loading: joining,
    error: callError,
    startCall,
    endCall,
    toggleMic,
    toggleVideo,
    shareScreen,
    copyMeetingLink,
  } = useJitsi(roomId, {
    displayName: user?.displayName || 'Student',
    email: user?.email || '',
  });

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

  const handleSendMessage = async () => {
    if (!message.trim() || sending) return;

    const result = await sendChatMessage(message);
    
    if (result.success) {
      setMessage('');
    }
  };

  const handleLeaveRoom = async () => {
    if (window.confirm('Are you sure you want to leave this room?')) {
      const result = await leaveRoom(roomId, user.uid);
      
      if (result.success) {
        navigate('/rooms');
      }
    }
  };

  const handleStartCall = async () => {
    await startCall();
  };

  const handleEndCall = async () => {
    await endCall();
  };

  const handleCopyMeetLink = async () => {
    const copied = await copyMeetingLink();
    if (copied) {
      alert('Meeting link copied to clipboard!');
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('File size must be less than 50MB');
      return;
    }

    const result = await uploadFile(file);
    
    if (result.success) {
      setShowUploadModal(false);
      // Send message about file upload
      await sendChatMessage(`📎 Uploaded: ${file.name}`, 'file');
    } else {
      alert('Failed to upload file: ' + result.error);
    }
  };

  const handleDeleteResource = async (resource) => {
    if (window.confirm(`Delete ${resource.fileName}?`)) {
      await deleteResourceFile(resource.id, resource.storagePath);
    }
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
      <div className="min-h-screen bg-cool-blue-gray flex items-center justify-center p-4">
        <Card className="text-center max-w-md">
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
        <div className="container-app py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
              <button
                onClick={() => navigate('/rooms')}
                className="p-2 hover:bg-light-cream rounded-lg transition-colors flex-shrink-0"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg md:text-2xl font-bold text-primary-black truncate">
                  {room.name}
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="info" size="sm">
                    {room.subject}
                  </Badge>
                  <span className="text-xs md:text-sm text-muted-gray">
                    {members.length} members
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2">
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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 hover:bg-light-cream rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {showMobileMenu && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-4 space-y-2"
              >
                {!inCall ? (
                  <Button
                    variant="primary"
                    className="w-full"
                    leftIcon={<Video size={18} />}
                    onClick={() => {
                      handleStartCall();
                      setShowMobileMenu(false);
                    }}
                  >
                    Start Call
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    className="w-full text-warning-red"
                    leftIcon={<Phone size={18} />}
                    onClick={() => {
                      handleEndCall();
                      setShowMobileMenu(false);
                    }}
                  >
                    End Call
                  </Button>
                )}
                <Button
                  variant="ghost"
                  className="w-full"
                  leftIcon={<LogOut size={18} />}
                  onClick={handleLeaveRoom}
                >
                  Leave Room
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Jitsi Meet Video Call Area */}
      {inCall && (
        <div className="bg-primary-black">
          <div className="container-app py-4 md:py-8">
            {/* Jitsi Container */}
            <div 
              id="jitsi-container" 
              className="w-full rounded-lg overflow-hidden"
              style={{ height: '600px' }}
            />

            {/* Call Controls */}
            <div className="flex justify-center items-center space-x-2 md:space-x-4 mt-4 md:mt-6">
              <button
                onClick={toggleMic}
                className={`p-3 md:p-4 rounded-full transition-colors ${
                  isMuted
                    ? 'bg-warning-red text-white'
                    : 'bg-white text-primary-black hover:bg-light-cream'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <MicOff size={20} className="md:w-6 md:h-6" /> : <Mic size={20} className="md:w-6 md:h-6" />}
              </button>
              <button
                onClick={toggleVideo}
                className={`p-3 md:p-4 rounded-full transition-colors ${
                  isVideoOff
                    ? 'bg-warning-red text-white'
                    : 'bg-white text-primary-black hover:bg-light-cream'
                }`}
                title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
              >
                {isVideoOff ? <VideoOff size={20} className="md:w-6 md:h-6" /> : <Video size={20} className="md:w-6 md:h-6" />}
              </button>
              <button
                onClick={shareScreen}
                className="p-3 md:p-4 rounded-full bg-white text-primary-black hover:bg-light-cream transition-colors"
                title="Share screen"
              >
                <Share2 size={20} className="md:w-6 md:h-6" />
              </button>
              <button
                onClick={handleCopyMeetLink}
                className="p-3 md:p-4 rounded-full bg-info-blue text-white hover:bg-blue-600 transition-colors"
                title="Copy meeting link"
              >
                <Users size={20} className="md:w-6 md:h-6" />
              </button>
              <button
                onClick={handleEndCall}
                className="p-3 md:p-4 rounded-full bg-warning-red text-white hover:bg-red-600 transition-colors"
                title="End call"
              >
                <Phone size={20} className="md:w-6 md:h-6 rotate-135" />
              </button>
            </div>

            {/* Participant Count */}
            <div className="text-center mt-4">
              <p className="text-white text-sm">
                {participantCount} participant{participantCount !== 1 ? 's' : ''} in call
              </p>
            </div>

            {/* Call Status */}
            {joining && (
              <div className="text-center mt-4">
                <p className="text-white text-sm">Joining call...</p>
              </div>
            )}
            {callError && (
              <div className="text-center mt-4">
                <Card className="p-4 bg-warning-red bg-opacity-10">
                  <p className="text-warning-red text-sm">Error: {callError}</p>
                </Card>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 container-app py-4 md:py-6 flex flex-col lg:flex-row gap-4 md:gap-6 overflow-hidden">
        {/* Chat/Content Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <Card className="flex-1 flex flex-col min-h-0">
            {/* Tabs */}
            <div className="flex space-x-2 border-b border-muted-gray border-opacity-20 px-4 md:px-6 pt-4">
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-3 md:px-4 py-2 font-medium transition-colors border-b-2 text-sm md:text-base ${
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
                className={`px-3 md:px-4 py-2 font-medium transition-colors border-b-2 text-sm md:text-base ${
                  activeTab === 'resources'
                    ? 'border-vibrant-orange text-vibrant-orange'
                    : 'border-transparent text-muted-gray hover:text-primary-black'
                }`}
              >
                <FileText className="w-4 h-4 inline-block mr-2" />
                Resources ({resources.length})
              </button>
            </div>

            {/* Chat Messages */}
            {activeTab === 'chat' && (
              <>
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 md:space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8 md:py-12 text-muted-gray">
                      <MessageCircle className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 opacity-50" />
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isOwn = msg.userId === user.uid;
                      
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex space-x-2 md:space-x-3 max-w-[85%] md:max-w-md ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            <Avatar
                              src={msg.userAvatar}
                              name={msg.userName}
                              size="sm"
                              className="flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-xs md:text-sm font-medium text-primary-black truncate">
                                  {msg.userName}
                                </span>
                                <span className="text-xs text-muted-gray flex-shrink-0">
                                  {msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <div
                                className={`px-3 md:px-4 py-2 rounded-lg break-words text-sm md:text-base ${
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
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-3 md:p-4 border-t border-muted-gray border-opacity-20">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      disabled={sending}
                      className="flex-1"
                    />
                    <Button
                      variant="primary"
                      leftIcon={<Send size={18} />}
                      onClick={handleSendMessage}
                      disabled={!message.trim() || sending}
                      className="flex-shrink-0"
                    >
                      <span className="hidden sm:inline">Send</span>
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Resources Tab */}
            {activeTab === 'resources' && (
              <div className="flex-1 p-4 md:p-6 overflow-y-auto">
                {resources.length === 0 ? (
                  <div className="text-center py-8 md:py-12 text-muted-gray">
                    <Share2 className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 opacity-50" />
                    <p className="mb-2">No resources yet</p>
                    <p className="text-xs md:text-sm mb-4">
                      Share files, links, and study materials with your group
                    </p>
                    <Button 
                      variant="primary" 
                      leftIcon={<Upload size={18} />}
                      onClick={() => setShowUploadModal(true)}
                    >
                      Upload Resource
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-primary-black">
                        Shared Resources
                      </h3>
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<Upload size={16} />}
                        onClick={() => setShowUploadModal(true)}
                      >
                        <span className="hidden sm:inline">Upload</span>
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {resources.map((resource) => (
                        <motion.div
                          key={resource.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center space-x-3 p-3 md:p-4 rounded-lg border border-muted-gray border-opacity-20 hover:border-opacity-40 transition-colors"
                        >
                          <div className="text-2xl md:text-3xl flex-shrink-0">
                            {getFileIcon(resource.fileType)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-primary-black truncate text-sm md:text-base">
                              {resource.fileName}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-muted-gray">
                                {formatFileSize(resource.fileSize)}
                              </span>
                              <span className="text-xs text-muted-gray">•</span>
                              <span className="text-xs text-muted-gray truncate">
                                {resource.userName}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2 flex-shrink-0">
                            <a
                              href={resource.downloadURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 hover:bg-light-cream rounded-lg transition-colors"
                            >
                              <Download size={18} className="text-info-blue" />
                            </a>
                            {resource.userId === user.uid && (
                              <button
                                onClick={() => handleDeleteResource(resource)}
                                className="p-2 hover:bg-warning-red hover:bg-opacity-10 rounded-lg transition-colors"
                              >
                                <Trash2 size={18} className="text-warning-red" />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Members Sidebar - Hidden on mobile, shown on large screens */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <Card className="h-full flex flex-col">
            <div className="p-4 border-b border-muted-gray border-opacity-20">
              <h3 className="font-semibold text-primary-black flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Members ({members.length})
              </h3>
            </div>
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
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
                    <p className="font-medium text-primary-black truncate text-sm">
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

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => !uploading && setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-card-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-primary-black">
                    Upload Resource
                  </h2>
                  {!uploading && (
                    <button
                      onClick={() => setShowUploadModal(false)}
                      className="p-2 hover:bg-light-cream rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>

                {uploading ? (
                  <div className="text-center py-8">
                    <LoadingSpinner size="lg" />
                    <p className="text-muted-gray mt-4">Uploading... {uploadProgress}%</p>
                    <div className="w-full bg-light-cream rounded-full h-2 mt-4">
                      <div
                        className="bg-vibrant-orange h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-muted-gray border-opacity-30 rounded-lg p-8 text-center cursor-pointer hover:border-vibrant-orange hover:border-opacity-50 transition-colors"
                    >
                      <Upload className="w-12 h-12 mx-auto mb-4 text-muted-gray" />
                      <p className="text-primary-black font-medium mb-2">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-muted-gray">
                        Max file size: 50MB
                      </p>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileSelect}
                      className="hidden"
                      accept="*/*"
                    />

                    <div className="mt-6 flex space-x-3">
                      <Button
                        variant="ghost"
                        className="flex-1"
                        onClick={() => setShowUploadModal(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoomPage;