import AgoraRTC from 'agora-rtc-sdk-ng';

/**
 * Agora Video Calling Service
 * Handles real-time video/audio communication
 */

const APP_ID = process.env.REACT_APP_AGORA_APP_ID;

// Create Agora client
let client = null;
let localAudioTrack = null;
let localVideoTrack = null;

/**
 * Initialize Agora client
 */
export const initializeAgora = () => {
  if (!client) {
    client = AgoraRTC.createClient({ 
      mode: 'rtc', 
      codec: 'vp8' 
    });
  }
  return client;
};

/**
 * Join a video call
 * @param {string} channelName - Room ID to join
 * @param {string} userId - User ID
 * @param {string} token - Agora token (optional for testing)
 * @returns {Promise<Object>} Result with success status
 */
export const joinCall = async (channelName, userId, token = null) => {
  try {
    if (!APP_ID) {
      throw new Error('Agora App ID not configured');
    }

    // Initialize client if not already done
    if (!client) {
      initializeAgora();
    }

    // Join the channel
    await client.join(APP_ID, channelName, token, userId);

    // Create local audio and video tracks
    [localAudioTrack, localVideoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();

    // Publish local tracks
    await client.publish([localAudioTrack, localVideoTrack]);

    return {
      success: true,
      localAudioTrack,
      localVideoTrack,
      client
    };
  } catch (error) {
    console.error('Error joining call:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Leave the video call
 * @returns {Promise<Object>} Result with success status
 */
export const leaveCall = async () => {
  try {
    // Stop and close local tracks
    if (localAudioTrack) {
      localAudioTrack.stop();
      localAudioTrack.close();
      localAudioTrack = null;
    }

    if (localVideoTrack) {
      localVideoTrack.stop();
      localVideoTrack.close();
      localVideoTrack = null;
    }

    // Leave the channel
    if (client) {
      await client.leave();
    }

    return { success: true };
  } catch (error) {
    console.error('Error leaving call:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Toggle microphone on/off
 * @param {boolean} enabled - True to enable, false to disable
 * @returns {Promise<boolean>} New mute state
 */
export const toggleMicrophone = async (enabled) => {
  try {
    if (localAudioTrack) {
      await localAudioTrack.setEnabled(enabled);
      return !enabled; // Return muted state
    }
    return false;
  } catch (error) {
    console.error('Error toggling microphone:', error);
    return false;
  }
};

/**
 * Toggle camera on/off
 * @param {boolean} enabled - True to enable, false to disable
 * @returns {Promise<boolean>} New video off state
 */
export const toggleCamera = async (enabled) => {
  try {
    if (localVideoTrack) {
      await localVideoTrack.setEnabled(enabled);
      return !enabled; // Return video off state
    }
    return false;
  } catch (error) {
    console.error('Error toggling camera:', error);
    return false;
  }
};

/**
 * Play local video track in a container
 * @param {string} containerId - DOM element ID to play video
 */
export const playLocalVideo = (containerId) => {
  if (localVideoTrack) {
    localVideoTrack.play(containerId);
  }
};

/**
 * Play remote user's video track
 * @param {Object} user - Remote user object
 * @param {string} containerId - DOM element ID to play video
 */
export const playRemoteVideo = (user, containerId) => {
  if (user.videoTrack) {
    user.videoTrack.play(containerId);
  }
};

/**
 * Get current client instance
 * @returns {Object} Agora client
 */
export const getClient = () => client;

/**
 * Get local tracks
 * @returns {Object} Local audio and video tracks
 */
export const getLocalTracks = () => ({
  audio: localAudioTrack,
  video: localVideoTrack
});

/**
 * Subscribe to remote user events
 * @param {Function} onUserJoined - Callback when user joins
 * @param {Function} onUserLeft - Callback when user leaves
 * @param {Function} onUserPublished - Callback when user publishes track
 * @param {Function} onUserUnpublished - Callback when user unpublishes track
 */
export const subscribeToUserEvents = (
  onUserJoined,
  onUserLeft,
  onUserPublished,
  onUserUnpublished
) => {
  if (!client) return;

  client.on('user-joined', onUserJoined);
  client.on('user-left', onUserLeft);
  client.on('user-published', onUserPublished);
  client.on('user-unpublished', onUserUnpublished);
};

/**
 * Unsubscribe from remote user events
 */
export const unsubscribeFromUserEvents = () => {
  if (!client) return;

  client.removeAllListeners('user-joined');
  client.removeAllListeners('user-left');
  client.removeAllListeners('user-published');
  client.removeAllListeners('user-unpublished');
};

/**
 * Get all remote users in the channel
 * @returns {Array} Array of remote users
 */
export const getRemoteUsers = () => {
  if (!client) return [];
  return client.remoteUsers;
};

/**
 * Check if Agora is supported in current browser
 * @returns {boolean} True if supported
 */
export const isAgoraSupported = () => {
  return AgoraRTC.checkSystemRequirements();
};

/**
 * Get available devices
 * @returns {Promise<Object>} Object with cameras and microphones
 */
export const getDevices = async () => {
  try {
    const devices = await AgoraRTC.getDevices();
    return {
      cameras: devices.filter(d => d.kind === 'videoinput'),
      microphones: devices.filter(d => d.kind === 'audioinput')
    };
  } catch (error) {
    console.error('Error getting devices:', error);
    return {
      cameras: [],
      microphones: []
    };
  }
};
