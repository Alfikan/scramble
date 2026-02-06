# 🧭 Navigation Guide - Quick Reference

## Sidebar Navigation Structure

```
┌─────────────────────────────────────┐
│  📚 Scramble          [Collapse →]  │
├─────────────────────────────────────┤
│  👤 User Name                       │
│     Level 3 | 2450 XP               │
├─────────────────────────────────────┤
│  📊 Dashboard                       │
│  👥 Study Rooms                     │
│  ⏰ Private Space                   │
│  🏆 Leaderboard          [Soon]     │
│  💬 Messages             [Soon]     │
│                                     │
│                                     │
│                                     │
├─────────────────────────────────────┤
│  👤 Profile                         │
│  ⚙️  Settings                       │
│  ❓ Help                            │
│  🚪 Sign Out                        │
└─────────────────────────────────────┘
```

## Page Hierarchy

```
Landing Page (/)
  │
  └─→ Auth (/auth)
       │
       └─→ Protected Pages (with Sidebar)
            │
            ├─→ Dashboard (/dashboard)
            │    └─ Quick stats, recent activity, rooms
            │
            ├─→ Study Rooms (/rooms)
            │    ├─ Browse public rooms
            │    ├─ My rooms
            │    └─→ Room (/room/:id)
            │         └─ Chat, video, members
            │
            ├─→ Private Space (/private-space)
            │    ├─ Study timer
            │    ├─ To-do list
            │    └─ Analytics
            │
            ├─→ Profile (/profile)
            │    ├─ Edit profile
            │    ├─ Statistics
            │    └─ Achievements
            │
            └─→ Settings (/settings)
                 ├─ Appearance
                 ├─ Notifications
                 ├─ Study preferences
                 ├─ Privacy
                 └─ Account
```

## Quick Actions

### From Sidebar

| Action | Click | Result |
|--------|-------|--------|
| Go to Dashboard | Dashboard icon | View stats & activity |
| Browse Rooms | Study Rooms icon | See all rooms |
| Start Timer | Private Space icon | Study timer page |
| View Profile | User avatar or Profile | Profile page |
| Change Settings | Settings icon | Settings page |
| Sign Out | Sign Out button | Logout & go to landing |

### From Dashboard

| Action | Click | Result |
|--------|-------|--------|
| Join Room | Room card | Navigate to room |
| Create Room | New Room button | Opens create modal |
| Start Study | Start Timer card | Go to Private Space |
| View Activity | View All Activity | Go to Private Space |

### From Rooms Page

| Action | Click | Result |
|--------|-------|--------|
| Create Room | Create Room button | Opens modal |
| Join Room | Join button | Join & enter room |
| Enter Room | Enter button | Go to room page |
| Search | Search input | Filter rooms |

### From Private Space

| Action | Click | Result |
|--------|-------|--------|
| Start Session | Start button | Opens modal |
| Take Break | Break button | Pause timer |
| End Session | End button | Stop & save |
| Add Todo | Add button | Create task |
| Switch Tab | Tab buttons | Change view |

### From Room Page

| Action | Click | Result |
|--------|-------|--------|
| Send Message | Send button | Post to chat |
| Start Call | Start Call button | Begin video call |
| Leave Room | Leave button | Exit room |
| View Members | Members sidebar | See all members |

### From Profile Page

| Action | Click | Result |
|--------|-------|--------|
| Edit Profile | Edit button | Enable editing |
| Save Changes | Save button | Update profile |
| Cancel Edit | Cancel button | Discard changes |
| Change Avatar | Camera icon | Upload photo (future) |

### From Settings Page

| Action | Click | Result |
|--------|-------|--------|
| Toggle Theme | Theme button | Switch light/dark |
| Change Setting | Toggle/Input | Update preference |
| Save Settings | Save button | Apply changes |
| Delete Account | Delete button | Confirm & delete |

## Keyboard Shortcuts (Future)

| Key | Action |
|-----|--------|
| `Ctrl/Cmd + K` | Quick search |
| `Ctrl/Cmd + B` | Toggle sidebar |
| `Ctrl/Cmd + ,` | Open settings |
| `Ctrl/Cmd + P` | Open profile |
| `Esc` | Close modal |

## Navigation Tips

### 1. Always Visible Sidebar
The sidebar is always visible on protected pages, making navigation easy.

### 2. Active Page Indicator
The current page is highlighted in orange in the sidebar.

### 3. Collapse for More Space
Click the collapse button to get more screen space while keeping navigation accessible.

### 4. Quick Profile Access
Click your avatar in the sidebar to quickly access your profile.

### 5. Breadcrumb Navigation
Use the browser back button or sidebar to navigate between pages.

## Common Workflows

### Start a Study Session
1. Click "Private Space" in sidebar
2. Click "Start Study Session"
3. Enter subject
4. Click "Start"

### Join a Study Room
1. Click "Study Rooms" in sidebar
2. Browse or search for room
3. Click "Join"
4. Start chatting!

### Update Your Profile
1. Click your avatar or "Profile" in sidebar
2. Click "Edit Profile"
3. Update information
4. Click "Save"

### Change App Settings
1. Click "Settings" in sidebar
2. Adjust preferences
3. Click "Save Settings"

### Sign Out
1. Click "Sign Out" in sidebar
2. Confirm in dialog
3. You're logged out!

## Mobile Navigation (Future)

```
┌─────────────────────┐
│  ☰  Scramble    👤  │
├─────────────────────┤
│                     │
│   Page Content      │
│                     │
└─────────────────────┘

Tap ☰ to open sidebar
Tap 👤 for profile menu
```

## URL Structure

```
Public:
  /                    Landing page
  /auth                Sign in/up

Protected:
  /dashboard           Main dashboard
  /rooms               Browse rooms
  /room/:id            Individual room
  /private-space       Study timer
  /profile             User profile
  /settings            App settings
  /help                Help center (future)
  /leaderboard         Rankings (future)
  /messages            Direct messages (future)
```

## State Indicators

### Sidebar
- **Orange background** = Current page
- **Gray text** = Inactive page
- **"Soon" badge** = Coming soon
- **Green dot** = Online status

### Navigation
- **Hover effect** = Clickable
- **Disabled** = Not available yet
- **Loading spinner** = Page loading

## Troubleshooting

### Sidebar not showing?
- Check if you're on a protected page
- Refresh the page
- Clear browser cache

### Can't navigate?
- Check internet connection
- Verify you're logged in
- Try refreshing the page

### Active state wrong?
- Hard refresh (Ctrl+Shift+R)
- Check URL matches page

### Sign out not working?
- Check console for errors
- Try again
- Contact support

---

## 🎯 Quick Reference Card

**Main Navigation:**
- Dashboard → Overview
- Rooms → Study groups
- Private Space → Timer & todos
- Profile → Your info
- Settings → Preferences

**Quick Actions:**
- Avatar → Profile
- Sign Out → Logout
- Collapse → More space

**Page Actions:**
- Dashboard → View stats, join rooms
- Rooms → Create, join, search
- Private Space → Study, todos, analytics
- Room → Chat, video, members
- Profile → Edit, view stats
- Settings → Customize app

---

**Navigation is now centralized and consistent across the entire app!** 🎊