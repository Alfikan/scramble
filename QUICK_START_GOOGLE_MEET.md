# Quick Start: Google Meet Integration

## 🚀 Get Started in 5 Minutes

### Step 1: Get Google Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable **Google Calendar API**
4. Create **OAuth 2.0 Client ID** (Web application)
5. Create **API Key**

### Step 2: Update .env File

```env
REACT_APP_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
REACT_APP_GOOGLE_API_KEY=your_api_key
```

### Step 3: Start the App

```bash
npm start
```

### Step 4: Test Video Calling

1. Navigate to any study room
2. Click "Start Call"
3. A Google Meet window will open
4. Share the link with others to join

## 🎯 Two Modes Available

### Simple Mode (Default - No Auth Required)
```javascript
startCall(true); // Creates instant Meet link
```
- ✅ No Google sign-in needed
- ✅ Instant meeting creation
- ⚠️ Links may be temporary

### Calendar Mode (Requires Auth)
```javascript
startCall(false); // Creates calendar event with Meet
```
- ✅ Persistent meeting links
- ✅ Appears in Google Calendar
- ✅ Can set duration and attendees
- ⚠️ Requires Google sign-in

## 📝 Basic Usage

```javascript
import { useGoogleMeet } from '../hooks/useGoogleMeet';

function MyComponent() {
  const { meetLink, inCall, startCall, endCall, copyMeetLink } = 
    useGoogleMeet(roomId, roomName);

  return (
    <div>
      {!inCall ? (
        <button onClick={() => startCall(true)}>Start Call</button>
      ) : (
        <>
          <p>Meeting: {meetLink}</p>
          <button onClick={copyMeetLink}>Copy Link</button>
          <button onClick={endCall}>End Call</button>
        </>
      )}
    </div>
  );
}
```

## 🔧 OAuth Setup (For Calendar Mode)

### Authorized JavaScript Origins
```
http://localhost:3000
https://yourdomain.com
```

### Authorized Redirect URIs
```
http://localhost:3000
https://yourdomain.com
```

### Required Scopes
```
https://www.googleapis.com/auth/calendar.events
```

## 🎨 Features

- ✅ Create instant Meet links
- ✅ Open Meet in new window
- ✅ Copy link to clipboard
- ✅ Calendar integration (optional)
- ✅ No installation required
- ✅ Works on all devices
- ✅ Professional video interface

## 🐛 Troubleshooting

### "Failed to load Google API"
- Check API key is correct
- Verify Calendar API is enabled
- Check browser console for errors

### "Authentication failed"
- Verify Client ID is correct
- Check authorized origins
- Clear browser cache

### "Meeting link not working"
- Try calendar mode for persistent links
- Check user has Google account
- Verify link hasn't expired

## 📚 Full Documentation

See `GOOGLE_MEET_SETUP.md` for complete setup instructions and advanced features.

## 💡 Tips

1. **Use Simple Mode for quick meetings** - No auth required
2. **Use Calendar Mode for scheduled meetings** - Better for planning
3. **Share links via chat** - Built-in copy functionality
4. **Test with multiple users** - Ensure everyone can join

## 🆘 Need Help?

- Check `GOOGLE_MEET_SETUP.md` for detailed setup
- Review `MIGRATION_AGORA_TO_GMEET.md` for migration info
- Open an issue on GitHub
- Check Google Calendar API docs

## ✨ That's It!

You're now ready to use Google Meet for video calling in your app. The integration is simple, reliable, and provides a professional video experience.
