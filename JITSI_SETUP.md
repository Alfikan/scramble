# Jitsi Meet Integration Guide

## Overview

The app now uses **Jitsi Meet** for video calling instead of Google Meet. Jitsi is an open-source video conferencing solution that:

- ✅ Requires NO authentication
- ✅ Requires NO API keys
- ✅ Can be embedded directly in the app
- ✅ Is completely FREE
- ✅ Works in all modern browsers
- ✅ Supports screen sharing, recording, and more

## Features

### Built-in Features
- HD video and audio
- Screen sharing
- Chat
- Raise hand
- Reactions
- Virtual backgrounds
- Recording (with Jitsi account)
- Live streaming
- Breakout rooms
- End-to-end encryption

### Our Implementation
- ✅ Embedded video interface
- ✅ Mute/unmute controls
- ✅ Camera on/off
- ✅ Screen sharing
- ✅ Participant count
- ✅ Meeting link sharing
- ✅ No external window needed

## How It Works

### 1. Free Jitsi Server
We use the free public Jitsi server at `meet.jit.si`. No setup required!

### 2. Room Names
Each study room gets a unique Jitsi meeting room based on the room ID.

### 3. Embedded Interface
The Jitsi interface is embedded directly in the room page using the Jitsi External API.

## Usage

### Starting a Call

1. Navigate to any study room
2. Click "Start Call"
3. Jitsi interface loads in the page
4. Other members can join by clicking "Start Call" in the same room

### During a Call

**Controls:**
- 🎤 Mute/Unmute microphone
- 📹 Turn camera on/off
- 🖥️ Share screen
- 👥 Copy meeting link
- ☎️ End call

**Jitsi Toolbar:**
- More options available in the Jitsi interface
- Chat, reactions, settings, etc.

### Sharing the Meeting

Click the "Copy Link" button to share the meeting URL with others. They can join directly from their browser.

## Code Structure

### Service Layer
**`src/services/jitsiService.js`**
- Initializes Jitsi Meet
- Handles audio/video controls
- Manages screen sharing
- Event listeners

### Hook Layer
**`src/hooks/useJitsi.js`**
- React hook for Jitsi integration
- State management
- Event handling
- Cleanup

### UI Layer
**`src/pages/RoomPage.jsx`**
- Embedded Jitsi container
- Control buttons
- Participant count
- Status indicators

## Configuration

### Using Free Server (Default)
No configuration needed! Just works out of the box.

### Using Your Own Server (Optional)

If you want to use your own Jitsi server:

1. **Set up Jitsi server** (see Jitsi documentation)

2. **Update the domain** in `src/services/jitsiService.js`:
```javascript
const JITSI_DOMAIN = 'your-jitsi-server.com';
```

3. **Configure JWT authentication** (optional):
```javascript
const options = {
  // ... other options
  jwt: 'your-jwt-token',
};
```

## Customization

### Interface Options

Edit `interfaceConfigOverwrite` in `jitsiService.js`:

```javascript
interfaceConfigOverwrite: {
  TOOLBAR_BUTTONS: [
    'microphone',
    'camera',
    'desktop',
    'hangup',
    'chat',
    // Add or remove buttons
  ],
  SHOW_JITSI_WATERMARK: false,
  DEFAULT_BACKGROUND: '#474747',
  // More options...
}
```

### Meeting Options

Edit `configOverwrite` in `jitsiService.js`:

```javascript
configOverwrite: {
  startWithAudioMuted: false,
  startWithVideoMuted: false,
  enableWelcomePage: false,
  // More options...
}
```

## Advantages Over Google Meet

| Feature | Jitsi Meet | Google Meet |
|---------|-----------|-------------|
| Authentication | ❌ Not required | ✅ Required |
| API Keys | ❌ Not required | ✅ Required |
| Embedding | ✅ Full support | ❌ Not allowed |
| Cost | ✅ Free | ⚠️ Limited free |
| Setup | ✅ Instant | ⚠️ Complex |
| Open Source | ✅ Yes | ❌ No |
| Self-hosting | ✅ Possible | ❌ Not possible |

## Browser Support

Jitsi works in all modern browsers:
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ✅ Mobile browsers

## Troubleshooting

### Video/Audio Not Working
- Check browser permissions
- Allow camera and microphone access
- Try refreshing the page

### Can't Join Meeting
- Check internet connection
- Try a different browser
- Clear browser cache

### Poor Quality
- Check internet speed
- Close other applications
- Reduce number of participants

### Screen Share Not Working
- Use Chrome or Edge (best support)
- Check browser permissions
- Try refreshing

## Advanced Features

### Recording
To enable recording:
1. Create a Jitsi account
2. Use your own Jitsi server
3. Configure Jibri (Jitsi recording component)

### Live Streaming
To enable live streaming:
1. Configure YouTube/Facebook integration
2. Use your own Jitsi server
3. Set up streaming credentials

### Custom Branding
To add your own branding:
1. Use your own Jitsi server
2. Customize interface config
3. Add custom CSS

## Security

### Default Security
- Meetings are public by default
- Anyone with the link can join
- No password protection

### Enhanced Security (Own Server)
- Enable lobby mode
- Set meeting passwords
- Use JWT authentication
- Enable end-to-end encryption

## Performance

### Optimization Tips
1. Use Chrome/Edge for best performance
2. Close unnecessary tabs
3. Use wired internet when possible
4. Limit participants to 10-15 for best quality

### Bandwidth Requirements
- Audio only: ~50 Kbps
- SD video: ~500 Kbps
- HD video: ~2 Mbps
- Screen share: ~1 Mbps

## Migration from Google Meet

### What Changed
- ❌ Removed Google Calendar API
- ❌ Removed OAuth authentication
- ✅ Added Jitsi External API
- ✅ Embedded video interface
- ✅ Simplified code

### Benefits
- No API keys needed
- No authentication required
- Better user experience (embedded)
- More features available
- Completely free

## Support

### Resources
- [Jitsi Meet Documentation](https://jitsi.github.io/handbook/)
- [Jitsi External API](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-iframe)
- [Jitsi Community](https://community.jitsi.org/)

### Common Issues
- Check browser console for errors
- Verify internet connection
- Test with different browsers
- Check firewall settings

## Conclusion

Jitsi Meet provides a superior video calling experience compared to Google Meet for our use case:

- **Easier to implement** - No API keys or authentication
- **Better UX** - Embedded directly in the app
- **More features** - Full Jitsi toolbar available
- **Free forever** - No usage limits
- **Open source** - Can self-host if needed

The integration is complete and ready to use! 🎉
