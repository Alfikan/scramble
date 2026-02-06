# Agora Video Calling Integration

## Overview
Scramble now includes real-time video calling powered by Agora RTC SDK. Users can start video calls within study rooms to collaborate face-to-face.

## Features Implemented

### ✅ Core Video Calling
- **Join/Leave Calls**: Start and end video calls in any room
- **Real-time Video**: See all participants with live video streams
- **Audio Communication**: Crystal-clear audio with all participants
- **Automatic User Management**: Handles users joining and leaving dynamically

### ✅ Call Controls
- **Mute/Unmute**: Toggle microphone on/off
- **Video On/Off**: Toggle camera on/off
- **End Call**: Leave the video call
- **Screen Share**: UI ready (implementation pending)

### ✅ User Experience
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Visual Feedback**: Shows muted/video-off states
- **User Avatars**: Displays avatars when video is off
- **Connection Status**: Shows joining/error states

## Technical Implementation

### Services Created

#### 1. `src/services/agoraService.js`
Core Agora SDK wrapper with functions:
- `initializeAgora()` - Initialize Agora client
- `joinCall(channelName, userId, token)` - Join a video call
- `leaveCall()` - Leave the video call
- `toggleMicrophone(enabled)` - Toggle mic
- `toggleCamera(enabled)` - Toggle camera
- `playLocalVideo(containerId)` - Play local video
- `playRemoteVideo(user, containerId)` - Play remote video
- `subscribeToUserEvents()` - Listen to user join/leave events
- `getRemoteUsers()` - Get all remote users
- `isAgoraSupported()` - Check browser support
- `getDevices()` - Get available cameras/microphones

#### 2. `src/hooks/useAgora.js`
Custom React hook for easy Agora integration:
```javascript
const {
  inCall,           // Boolean: currently in call
  isMuted,          // Boolean: microphone muted
  isVideoOff,       // Boolean: camera off
  remoteUsers,      // Array: remote participants
  joining,          // Boolean: joining in progress
  error,            // String: error message
  startCall,        // Function: join call
  endCall,          // Function: leave call
  toggleMic,        // Function: toggle microphone
  toggleVideo,      // Function: toggle camera
  playLocal,        // Function: play local video
  playRemote        // Function: play remote video
} = useAgora(roomId, userId);
```

### Integration in RoomPage

The `RoomPage.jsx` has been updated to:
1. Import and use the `useAgora` hook
2. Display video streams in a responsive grid
3. Show local video with user's camera
4. Display remote users' video streams
5. Handle video on/off states with avatars
6. Provide intuitive call controls

## Configuration

### Environment Variables
Add to `.env`:
```env
REACT_APP_AGORA_APP_ID=your_agora_app_id
```

### Agora Setup
1. Create account at [Agora.io](https://www.agora.io/)
2. Create a new project
3. Get your App ID
4. Add App ID to `.env` file

### Token Server (Production)
For production, you need a token server:
1. Agora requires tokens for security
2. Set up a backend endpoint to generate tokens
3. Pass token to `joinCall()` function

**Current Setup**: Using null token (works for testing, not production)

## Usage

### Starting a Call
```javascript
// In RoomPage
const handleStartCall = async () => {
  await startCall();
  // Video automatically plays
};
```

### Ending a Call
```javascript
const handleEndCall = async () => {
  await endCall();
  // Cleans up all tracks and connections
};
```

### Toggle Controls
```javascript
// Mute/unmute
await toggleMic();

// Camera on/off
await toggleVideo();
```

## Video Stream Display

### Local Video
```jsx
<div id="local-video" ref={localVideoRef} className="w-full h-full" />
```

### Remote Videos
```jsx
{remoteUsers.map((remoteUser) => (
  <div key={remoteUser.uid}>
    <div id={`remote-video-${remoteUser.uid}`} className="w-full h-full" />
  </div>
))}
```

## Browser Support

Agora RTC SDK supports:
- ✅ Chrome 58+
- ✅ Firefox 56+
- ✅ Safari 11+
- ✅ Edge 80+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

Check support:
```javascript
import { isAgoraSupported } from '../services/agoraService';

if (isAgoraSupported()) {
  // Proceed with video call
} else {
  // Show unsupported message
}
```

## Responsive Design

The video call UI is fully responsive:
- **Mobile**: Single column, touch-friendly controls
- **Tablet**: 2-column grid
- **Desktop**: 3-4 column grid
- **Large Desktop**: 4+ column grid

## Error Handling

Errors are captured and displayed:
```javascript
const { error } = useAgora(roomId, userId);

{error && (
  <div className="text-warning-red">
    Error: {error}
  </div>
)}
```

Common errors:
- No camera/microphone permission
- Invalid App ID
- Network issues
- Browser not supported

## Performance Optimization

### Automatic Cleanup
- Tracks are stopped and closed on unmount
- Event listeners are removed
- Client leaves channel properly

### Bandwidth Management
- Video quality adjusts based on network
- Audio prioritized over video
- Automatic fallback to audio-only

## Future Enhancements

### Planned Features
- [ ] Screen sharing
- [ ] Recording calls
- [ ] Virtual backgrounds
- [ ] Noise cancellation
- [ ] Beauty filters
- [ ] Grid/speaker view toggle
- [ ] Chat during call
- [ ] Raise hand feature
- [ ] Breakout rooms

### Advanced Features
- [ ] Call analytics
- [ ] Quality indicators
- [ ] Network stats display
- [ ] Device selection UI
- [ ] Call recording to cloud
- [ ] Live transcription

## Testing

### Local Testing
1. Open room in two browser windows
2. Start call in both windows
3. Test mute/unmute
4. Test video on/off
5. Test ending call

### Multi-user Testing
1. Share room link with others
2. All join the same room
3. Start video call
4. Verify all users see each other

## Troubleshooting

### No Video/Audio
- Check browser permissions
- Verify camera/microphone are not in use
- Check Agora App ID is correct
- Ensure HTTPS (required for camera access)

### Connection Issues
- Check network connectivity
- Verify firewall settings
- Test with different network
- Check Agora service status

### Performance Issues
- Close other tabs/applications
- Check CPU usage
- Reduce video quality
- Use wired connection

## Security

### Best Practices
1. **Use Tokens**: Never use null tokens in production
2. **Validate Users**: Verify user permissions before joining
3. **Rate Limiting**: Limit call creation frequency
4. **Monitor Usage**: Track Agora usage for billing
5. **Secure Credentials**: Never expose App ID in public repos

### Token Generation
```javascript
// Backend endpoint
app.post('/api/agora/token', async (req, res) => {
  const { channelName, userId } = req.body;
  
  // Generate token with Agora SDK
  const token = generateAgoraToken(channelName, userId);
  
  res.json({ token });
});
```

## Cost Considerations

Agora pricing:
- **Free Tier**: 10,000 minutes/month
- **Pay-as-you-go**: $0.99 per 1,000 minutes
- **Video**: Higher cost than audio
- **Recording**: Additional charges

Monitor usage in Agora Console.

## Resources

- [Agora Documentation](https://docs.agora.io/)
- [React SDK Guide](https://docs.agora.io/en/video-calling/get-started/get-started-sdk)
- [API Reference](https://docs.agora.io/en/video-calling/reference/api)
- [Sample Projects](https://github.com/AgoraIO)

## Support

For issues:
1. Check Agora Console logs
2. Review browser console errors
3. Test with Agora demo app
4. Contact Agora support

---

**Status**: ✅ Fully Implemented and Ready for Testing
**Last Updated**: February 6, 2026
