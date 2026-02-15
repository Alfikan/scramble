/**
 * Google Meet Service
 * Handles Google Meet integration for video calls
 * 
 * Note: Google Meet doesn't have a direct SDK like Agora.
 * We use Google Calendar API to create meetings with Meet links,
 * then embed them or redirect users to the Meet URL.
 */

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const CALENDAR_API_ENDPOINT = 'https://www.googleapis.com/calendar/v3';

let gapiLoaded = false;
let gisLoaded = false;
let tokenClient = null;
let accessToken = null;

/**
 * Load Google API scripts
 */
export const loadGoogleAPI = () => {
  return new Promise((resolve, reject) => {
    if (gapiLoaded && gisLoaded) {
      resolve();
      return;
    }

    // Load GAPI
    const gapiScript = document.createElement('script');
    gapiScript.src = 'https://apis.google.com/js/api.js';
    gapiScript.onload = () => {
      window.gapi.load('client', async () => {
        await window.gapi.client.init({
          apiKey: GOOGLE_API_KEY,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        });
        gapiLoaded = true;
        if (gisLoaded) resolve();
      });
    };
    gapiScript.onerror = reject;
    document.body.appendChild(gapiScript);

    // Load GIS (Google Identity Services)
    const gisScript = document.createElement('script');
    gisScript.src = 'https://accounts.google.com/gsi/client';
    gisScript.onload = () => {
      tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/calendar.events',
        callback: '', // Will be set per request
      });
      gisLoaded = true;
      if (gapiLoaded) resolve();
    };
    gisScript.onerror = reject;
    document.body.appendChild(gisScript);
  });
};

/**
 * Request access token from user
 */
const requestAccessToken = () => {
  return new Promise((resolve, reject) => {
    try {
      tokenClient.callback = (response) => {
        if (response.error) {
          reject(response);
          return;
        }
        accessToken = response.access_token;
        resolve(accessToken);
      };

      if (accessToken) {
        // Token already exists, check if valid
        resolve(accessToken);
      } else {
        // Request new token
        tokenClient.requestAccessToken({ prompt: 'consent' });
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Create a Google Meet meeting
 * @param {string} roomName - Name of the meeting
 * @param {string} roomId - Room ID for the meeting
 * @param {number} duration - Duration in minutes (default 60)
 * @returns {Promise<Object>} Meeting details with Meet link
 */
export const createMeeting = async (roomName, roomId, duration = 60) => {
  try {
    await loadGoogleAPI();
    await requestAccessToken();

    const now = new Date();
    const endTime = new Date(now.getTime() + duration * 60000);

    const event = {
      summary: roomName,
      description: `Study room: ${roomName} (ID: ${roomId})`,
      start: {
        dateTime: now.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      conferenceData: {
        createRequest: {
          requestId: `${roomId}-${Date.now()}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
      attendees: [],
    };

    const response = await window.gapi.client.calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      resource: event,
    });

    const meetLink = response.result.hangoutLink || response.result.conferenceData?.entryPoints?.[0]?.uri;

    return {
      success: true,
      meetingId: response.result.id,
      meetLink,
      eventId: response.result.id,
      startTime: response.result.start.dateTime,
      endTime: response.result.end.dateTime,
    };
  } catch (error) {
    console.error('Error creating Google Meet:', error);
    return {
      success: false,
      error: error.message || 'Failed to create meeting',
    };
  }
};

/**
 * Generate a simple Meet link without Calendar API
 * This creates a temporary meet link that anyone can join
 * @param {string} roomId - Room ID to use as meeting code
 * @returns {Object} Meet link details
 */
export const generateSimpleMeetLink = (roomId) => {
  // Generate a unique meeting code based on room ID
  const meetingCode = roomId.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  const meetLink = `https://meet.google.com/${meetingCode}`;

  return {
    success: true,
    meetLink,
    meetingCode,
    isSimple: true,
  };
};

/**
 * Join a Google Meet call
 * Opens the Meet link in a new window or embeds it
 * @param {string} meetLink - Google Meet URL
 * @param {boolean} openInNewWindow - Whether to open in new window (default true)
 * @returns {Object} Result
 */
export const joinMeeting = (meetLink, openInNewWindow = true) => {
  try {
    if (openInNewWindow) {
      const width = 1200;
      const height = 800;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;

      window.open(
        meetLink,
        'GoogleMeet',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
      );
    } else {
      window.location.href = meetLink;
    }

    return {
      success: true,
      message: 'Joining Google Meet...',
    };
  } catch (error) {
    console.error('Error joining meeting:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Delete a Google Meet meeting
 * @param {string} eventId - Calendar event ID
 * @returns {Promise<Object>} Result
 */
export const deleteMeeting = async (eventId) => {
  try {
    await loadGoogleAPI();
    await requestAccessToken();

    await window.gapi.client.calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
    });

    return {
      success: true,
      message: 'Meeting deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting meeting:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get meeting details
 * @param {string} eventId - Calendar event ID
 * @returns {Promise<Object>} Meeting details
 */
export const getMeetingDetails = async (eventId) => {
  try {
    await loadGoogleAPI();
    await requestAccessToken();

    const response = await window.gapi.client.calendar.events.get({
      calendarId: 'primary',
      eventId: eventId,
    });

    const meetLink = response.result.hangoutLink || response.result.conferenceData?.entryPoints?.[0]?.uri;

    return {
      success: true,
      meeting: {
        id: response.result.id,
        summary: response.result.summary,
        description: response.result.description,
        meetLink,
        startTime: response.result.start.dateTime,
        endTime: response.result.end.dateTime,
      },
    };
  } catch (error) {
    console.error('Error getting meeting details:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Check if user is authenticated with Google
 * @returns {boolean} Authentication status
 */
export const isAuthenticated = () => {
  return !!accessToken;
};

/**
 * Sign out from Google
 */
export const signOut = () => {
  accessToken = null;
  if (window.google?.accounts?.oauth2) {
    window.google.accounts.oauth2.revoke(accessToken, () => {
      console.log('Access token revoked');
    });
  }
};

/**
 * Get embed URL for Google Meet
 * Note: Google Meet doesn't officially support embedding
 * This returns the regular Meet URL
 * @param {string} meetLink - Google Meet URL
 * @returns {string} URL to use
 */
export const getEmbedUrl = (meetLink) => {
  return meetLink;
};

/**
 * Check if Google Meet is supported
 * @returns {boolean} Support status
 */
export const isMeetSupported = () => {
  return true; // Google Meet works in all modern browsers
};
