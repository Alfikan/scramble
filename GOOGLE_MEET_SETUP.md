# Google Meet Integration Setup Guide

This guide will help you set up Google Meet integration for video calling in the Scramble app.

## Overview

The app uses Google Meet for video calling instead of building a custom WebRTC solution. This provides:
- Professional video calling experience
- No need to manage video infrastructure
- Automatic recording and transcription (if enabled)
- Integration with Google Calendar
- Screen sharing and other advanced features

## Setup Steps

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your Project ID

### 2. Enable Required APIs

Enable the following APIs in your Google Cloud Project:

1. **Google Calendar API**
   - Go to APIs & Services > Library
   - Search for "Google Calendar API"
   - Click "Enable"

2. **Google Meet API** (Optional - for advanced features)
   - Search for "Google Meet API"
   - Click "Enable"

### 3. Create OAuth 2.0 Credentials

1. Go to APIs & Services > Credentials
2. Click "Create Credentials" > "OAuth client ID"
3. Configure the OAuth consent screen if prompted:
   - User Type: External (for testing) or Internal (for organization)
   - App name: Scramble
   - User support email: Your email
   - Developer contact: Your email
   - Add scopes: `https://www.googleapis.com/auth/calendar.events`
4. Create OAuth Client ID:
   - Application type: Web application
   - Name: Scramble Web Client
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - Your production domain (e.g., `https://scramble.app`)
   - Authorized redirect URIs:
     - `http://localhost:3000` (for development)
     - Your production domain
5. Copy the Client ID

### 4. Create API Key

1. Go to APIs & Services > Credentials
2. Click "Create Credentials" > "API Key"
3. Copy the API Key
4. (Recommended) Click "Restrict Key":
   - API restrictions: Select "Google Calendar API"
   - Application restrictions: HTTP referrers
   - Add your domains

### 5. Update Environment Variables

Add the following to your `.env` file:

```env
# Google Meet API (for video calling)
REACT_APP_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
REACT_APP_GOOGLE_API_KEY=your_api_key_here
```

### 6. Test the Integration

1. Start your development server: `npm start`
2. Navigate to a study room
3. Click "Start Call"
4. You'll be prompted to sign in with Google (first time only)
5. Grant calendar permissions
6. A Google Meet link will be created and opened

## How It Works

### Simple Mode (Default)
- Creates a Google Meet link without authentication
- Users can join by clicking the link
- No calendar event is created
- Best for quick meetings

### Calendar Mode (Optional)
- Requires Google authentication
- Creates a calendar event with Meet link
- Event appears in user's Google Calendar
- Can set meeting duration and add attendees
- Better for scheduled meetings

## Usage in Code

```javascript
import { useGoogleMeet } from '../hooks/useGoogleMeet';

function RoomComponent() {
  const {
    meetLink,
    inCall,
    startCall,
    endCall,
    copyMeetLink,
  } = useGoogleMeet(roomId, roomName);

  // Start a call (simple mode - no auth required)
  const handleStartCall = () => {
    startCall(true); // true = simple mode
  };

  // Start a call (calendar mode - requires auth)
  const handleStartCallWithCalendar = () => {
    startCall(false); // false = calendar mode
  };

  return (
    <div>
      {!inCall ? (
        <button onClick={handleStartCall}>Start Call</button>
      ) : (
        <>
          <p>Meeting Link: {meetLink}</p>
          <button onClick={copyMeetLink}>Copy Link</button>
          <button onClick={endCall}>End Call</button>
        </>
      )}
    </div>
  );
}
```

## Features

### Current Features
- ✅ Create Google Meet links
- ✅ Join meetings in new window
- ✅ Copy meeting links to clipboard
- ✅ Simple mode (no authentication)
- ✅ Calendar mode (with authentication)
- ✅ End meetings and cleanup

### Limitations
- Google Meet cannot be embedded in iframes (Google's policy)
- Meetings open in a new window/tab
- Simple mode links are temporary
- Calendar mode requires user authentication

## Troubleshooting

### "Failed to load Google API"
- Check that your API key is correct
- Verify that Google Calendar API is enabled
- Check browser console for specific errors

### "Authentication failed"
- Verify OAuth Client ID is correct
- Check that authorized origins include your domain
- Clear browser cache and try again

### "Meeting link not working"
- Simple mode links may expire after some time
- Use calendar mode for persistent links
- Check that users have Google accounts

## Security Best Practices

1. **Restrict API Key**
   - Limit to specific APIs (Calendar API)
   - Restrict to your domains only
   - Regenerate if exposed

2. **OAuth Consent Screen**
   - Only request necessary scopes
   - Provide clear privacy policy
   - Keep user data secure

3. **Production Deployment**
   - Use environment variables
   - Never commit credentials to git
   - Use different credentials for dev/prod

## Cost Considerations

- Google Calendar API: Free (up to 1,000,000 requests/day)
- Google Meet: Free for personal use
- Google Workspace: Required for advanced features (recording, etc.)

## Alternative Approaches

If you need more control over the video experience, consider:
1. **Daily.co** - Embeddable video with API
2. **Whereby** - Simple embedded video rooms
3. **Jitsi Meet** - Open-source, self-hosted option
4. **Twilio Video** - Programmable video API

## Support

For issues or questions:
- Check [Google Calendar API Documentation](https://developers.google.com/calendar)
- Review [Google Meet API Documentation](https://developers.google.com/meet)
- Open an issue in the project repository

## Migration from Agora

If you're migrating from Agora:
1. Remove Agora SDK: `npm uninstall agora-rtc-sdk-ng`
2. Update environment variables (remove AGORA_APP_ID)
3. Replace `useAgora` with `useGoogleMeet` in components
4. Update UI to show Meet links instead of video grid
5. Test all video calling features

The new implementation is simpler and requires less code, but provides a professional video experience through Google Meet.
