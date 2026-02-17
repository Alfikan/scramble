const JITSI_DOMAIN = 'meet.jit.si'; 

let jitsiAPI = null;

/**
 * Initialize Jitsi Meet
 * @param {string} roomName - Room name/ID
 * @param {string} containerID - DOM element ID to render Jitsi
 * @param {Object} userInfo - User information
 * @returns {Object} Jitsi API instance
 */
export const initJitsiMeet = (roomName, containerID, userInfo = {}) => {
  try {
    // Clean room name (remove special characters)
    const cleanRoomName = roomName.replace(/[^a-zA-Z0-9]/g, '');

    const options = {
      roomName: cleanRoomName,
      width: '100%',
      height: '100%',
      parentNode: document.getElementById(containerID),
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        enableWelcomePage: false,
        prejoinPageEnabled: false,
        disableDeepLinking: true,
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [
          'microphone',
          'camera',
          'closedcaptions',
          'desktop',
          'fullscreen',
          'fodeviceselection',
          'hangup',
          'profile',
          'chat',
          'recording',
          'livestreaming',
          'etherpad',
          'sharedvideo',
          'settings',
          'raisehand',
          'videoquality',
          'filmstrip',
          'invite',
          'feedback',
          'stats',
          'shortcuts',
          'tileview',
          'videobackgroundblur',
          'download',
          'help',
          'mute-everyone',
        ],
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,
        BRAND_WATERMARK_LINK: '',
        SHOW_POWERED_BY: false,
        DEFAULT_BACKGROUND: '#474747',
        DEFAULT_REMOTE_DISPLAY_NAME: 'Student',
        DEFAULT_LOCAL_DISPLAY_NAME: 'Me',
        MOBILE_APP_PROMO: false,
      },
      userInfo: {
        displayName: userInfo.displayName || 'Student',
        email: userInfo.email || '',
      },
    };

    // Load Jitsi API script if not already loaded
    if (!window.JitsiMeetExternalAPI) {
      const script = document.createElement('script');
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      document.head.appendChild(script);

      return new Promise((resolve) => {
        script.onload = () => {
          jitsiAPI = new window.JitsiMeetExternalAPI(JITSI_DOMAIN, options);
          resolve(jitsiAPI);
        };
      });
    }

    jitsiAPI = new window.JitsiMeetExternalAPI(JITSI_DOMAIN, options);
    return Promise.resolve(jitsiAPI);
  } catch (error) {
    console.error('Error initializing Jitsi:', error);
    return Promise.reject(error);
  }
};

/**
 * Get current Jitsi API instance
 */
export const getJitsiAPI = () => jitsiAPI;

/**
 * Dispose/cleanup Jitsi Meet
 */
export const disposeJitsiMeet = () => {
  if (jitsiAPI) {
    jitsiAPI.dispose();
    jitsiAPI = null;
  }
};

/**
 * Mute/unmute audio
 */
export const toggleAudio = async () => {
  if (jitsiAPI) {
    const isMuted = await jitsiAPI.isAudioMuted();
    if (isMuted) {
      jitsiAPI.executeCommand('toggleAudio');
    } else {
      jitsiAPI.executeCommand('toggleAudio');
    }
    return !isMuted;
  }
  return false;
};

/**
 * Mute/unmute video
 */
export const toggleVideo = async () => {
  if (jitsiAPI) {
    const isVideoMuted = await jitsiAPI.isVideoMuted();
    if (isVideoMuted) {
      jitsiAPI.executeCommand('toggleVideo');
    } else {
      jitsiAPI.executeCommand('toggleVideo');
    }
    return !isVideoMuted;
  }
  return false;
};

/**
 * Toggle screen sharing
 */
export const toggleScreenShare = () => {
  if (jitsiAPI) {
    jitsiAPI.executeCommand('toggleShareScreen');
  }
};

/**
 * Hang up / leave meeting
 */
export const hangUp = () => {
  if (jitsiAPI) {
    jitsiAPI.executeCommand('hangup');
  }
};

/**
 * Get number of participants
 */
export const getParticipantCount = () => {
  if (jitsiAPI) {
    return jitsiAPI.getNumberOfParticipants();
  }
  return 0;
};

/**
 * Set display name
 */
export const setDisplayName = (name) => {
  if (jitsiAPI) {
    jitsiAPI.executeCommand('displayName', name);
  }
};

/**
 * Get meeting URL
 */
export const getMeetingURL = (roomName) => {
  const cleanRoomName = roomName.replace(/[^a-zA-Z0-9]/g, '');
  return `https://${JITSI_DOMAIN}/${cleanRoomName}`;
};

/**
 * Add event listeners
 */
export const addJitsiEventListeners = (callbacks = {}) => {
  if (!jitsiAPI) return;

  if (callbacks.onVideoConferenceJoined) {
    jitsiAPI.addEventListener('videoConferenceJoined', callbacks.onVideoConferenceJoined);
  }

  if (callbacks.onVideoConferenceLeft) {
    jitsiAPI.addEventListener('videoConferenceLeft', callbacks.onVideoConferenceLeft);
  }

  if (callbacks.onParticipantJoined) {
    jitsiAPI.addEventListener('participantJoined', callbacks.onParticipantJoined);
  }

  if (callbacks.onParticipantLeft) {
    jitsiAPI.addEventListener('participantLeft', callbacks.onParticipantLeft);
  }

  if (callbacks.onAudioMuteStatusChanged) {
    jitsiAPI.addEventListener('audioMuteStatusChanged', callbacks.onAudioMuteStatusChanged);
  }

  if (callbacks.onVideoMuteStatusChanged) {
    jitsiAPI.addEventListener('videoMuteStatusChanged', callbacks.onVideoMuteStatusChanged);
  }
};

/**
 * Remove event listeners
 */
export const removeJitsiEventListeners = () => {
  if (jitsiAPI) {
    jitsiAPI.removeAllListeners();
  }
};

/**
 * Check if Jitsi is supported
 */
export const isJitsiSupported = () => {
  return true; // Jitsi works in all modern browsers
};
