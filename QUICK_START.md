# 🚀 Quick Start Guide

Get Scramble up and running in minutes!

## Prerequisites

- Node.js 16+ installed
- npm or yarn
- Firebase account (free tier works)
- Google account for OAuth

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Firebase Setup

### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it "Scramble" (or your preferred name)
4. Disable Google Analytics (optional)
5. Click "Create project"

### Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Enable **Email/Password**
4. Enable **Google** (set support email)

### Create Firestore Database

1. Go to **Firestore Database**
2. Click "Create database"
3. Start in **test mode** (we'll add rules later)
4. Choose a location close to you
5. Click "Enable"

### Get Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps"
3. Click the web icon (`</>`)
4. Register app as "Scramble"
5. Copy the config object

### Update Environment Variables

Create or update `.env` file in project root:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Step 3: Deploy Security Rules

### Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Login to Firebase

```bash
firebase login
```

### Initialize Firebase

```bash
firebase init
```

Select:
- Firestore
- Storage
- Hosting (optional)

Use existing project and accept defaults.

### Deploy Rules

```bash
firebase deploy --only firestore:rules,storage:rules
```

## Step 4: Run the App

```bash
npm start
```

The app will open at `http://localhost:3000`

## Step 5: Test the App

### Create an Account

1. Click "Get Started" on landing page
2. Click "Sign up" tab
3. Enter email, password, and name
4. Click "Create Account"
5. Check email for verification link (optional)

### Or Sign In with Google

1. Click "Continue with Google"
2. Select your Google account
3. You'll be redirected to dashboard

### Explore Features

1. **Dashboard** - View your stats (empty initially)
2. **Create Room** - Click "New Room" button
   - Enter room name: "Test Study Room"
   - Enter subject: "Computer Science"
   - Add description
   - Click "Create Room"
3. **Browse Rooms** - Go to Rooms page
   - See your created room
   - Search for rooms
   - Join other rooms
4. **Navigation** - All buttons work!

## 🎉 You're Done!

Your Scramble app is now running with:
- ✅ Firebase Authentication
- ✅ Firestore Database
- ✅ Real-time data
- ✅ All features working

## 🐛 Troubleshooting

### "Firebase not configured" error
- Check `.env` file exists
- Verify all variables start with `REACT_APP_`
- Restart development server after changing `.env`

### "Permission denied" in Firestore
- Deploy security rules: `firebase deploy --only firestore:rules`
- Check rules in Firebase Console

### "Auth domain not authorized"
- Go to Firebase Console → Authentication → Settings
- Add `localhost` to authorized domains

### Google Sign-In not working
- Enable Google provider in Firebase Console
- Set support email in Google provider settings

## 📚 Next Steps

1. Read `IMPLEMENTATION_GUIDE.md` for detailed features
2. Check `FEATURES_IMPLEMENTED.md` for what's working
3. See `FIREBASE_SETUP.md` for advanced configuration
4. Start building new features!

## 💡 Development Tips

### Use Firebase Emulators (Optional)

```bash
firebase init emulators
firebase emulators:start
```

Benefits:
- Test without affecting production data
- Faster development
- Free (no Firebase usage)

### Hot Reload

The app uses React hot reload. Changes appear instantly without refresh.

### Debug Mode

Open browser DevTools (F12) to see:
- Console logs
- Network requests
- Firebase operations

### Test Data

Create multiple accounts to test:
- Room joining
- Member counts
- User interactions

## 🔗 Useful Links

- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🆘 Need Help?

1. Check console for errors
2. Verify Firebase configuration
3. Ensure security rules are deployed
4. Check Firebase Console for data
5. Review `IMPLEMENTATION_GUIDE.md`

---

Happy coding! 🎓✨