# Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication with Google, Microsoft, and email/password providers for the Scramble app.

## Prerequisites

1. Node.js and npm installed
2. Firebase CLI installed (`npm install -g firebase-tools`)
3. A Google account for Firebase Console access

## Step 1: Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select your existing project
3. Enable Google Analytics (optional but recommended)
4. Wait for project creation to complete

## Step 2: Enable Authentication Providers

### Email/Password Authentication
1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Click on **Email/Password**
3. Enable **Email/Password** (first toggle)
4. Optionally enable **Email link (passwordless sign-in)**
5. Click **Save**

### Google Authentication
1. In the same **Sign-in method** tab, click on **Google**
2. Enable Google sign-in
3. Set your project support email
4. Add your domain to authorized domains if needed
5. Click **Save**
6. Note down the **Web client ID** for later use

### Microsoft Authentication
1. First, set up Microsoft Azure AD:
   - Go to [Azure Portal](https://portal.azure.com/)
   - Navigate to **Azure Active Directory** > **App registrations**
   - Click **New registration**
   - Name: "Scramble App"
   - Supported account types: "Accounts in any organizational directory and personal Microsoft accounts"
   - Redirect URI: `https://scramble-40e3a.firebaseapp.com/__/auth/handler` (replace with your project ID)
   - Click **Register**

2. Configure the Azure app:
   - Go to **Authentication** > **Platform configurations**
   - Add **Web** platform
   - Add redirect URI: `https://scramble-40e3a.firebaseapp.com/__/auth/handler`
   - Enable **ID tokens**
   - Save changes

3. Get credentials:
   - Go to **Overview** and copy the **Application (client) ID**
   - Go to **Certificates & secrets** > **Client secrets**
   - Click **New client secret**
   - Copy the secret value (you won't see it again!)

4. Back in Firebase Console:
   - Click on **Microsoft** in Sign-in method
   - Enable Microsoft sign-in
   - Enter the **Application (client) ID** from Azure
   - Enter the **Application secret** from Azure
   - Click **Save**

## Step 3: Configure Firebase in Your App

1. In Firebase Console, go to **Project settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click **Web app** icon (`</>`)
4. Register your app with name "Scramble"
5. Copy the Firebase configuration object

6. Update your `.env` file with the Firebase config:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Step 4: Set Up Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (we'll deploy security rules later)
4. Select a location close to your users
5. Click **Done**

## Step 5: Set Up Firebase Storage

1. In Firebase Console, go to **Storage**
2. Click **Get started**
3. Review security rules (we'll update them later)
4. Choose the same location as Firestore
5. Click **Done**

## Step 6: Deploy Security Rules

1. Install Firebase CLI if not already installed:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
firebase init
```
- Select **Firestore**, **Storage**, and **Hosting**
- Choose your existing project
- Accept default file names
- Choose **build** as public directory
- Configure as single-page app: **Yes**
- Don't overwrite index.html: **No**

4. Deploy security rules:
```bash
firebase deploy --only firestore:rules,storage:rules
```

## Step 7: Configure Authorized Domains

1. In Firebase Console, go to **Authentication** > **Settings** > **Authorized domains**
2. Add your domains:
   - `localhost` (for development)
   - Your production domain
   - Your Firebase hosting domain (if using Firebase Hosting)

## Step 8: Test Authentication

1. Start your development server:
```bash
npm start
```

2. Navigate to `/auth` route
3. Test each authentication method:
   - Email/password signup and signin
   - Google sign-in
   - Microsoft sign-in
   - Password reset

## Step 9: Optional - Set Up Firebase Emulators (Development)

For local development with Firebase emulators:

1. Install emulators:
```bash
firebase init emulators
```

2. Select **Authentication**, **Firestore**, and **Storage**
3. Accept default ports or customize as needed

4. Start emulators:
```bash
firebase emulators:start
```

5. Update your development environment to use emulators by adding to your `.env.local`:
```env
REACT_APP_USE_FIREBASE_EMULATORS=true
```

## Troubleshooting

### Common Issues

1. **"auth/unauthorized-domain"**
   - Add your domain to authorized domains in Firebase Console

2. **"auth/popup-blocked"**
   - Browser is blocking popups, ask user to allow popups

3. **Microsoft sign-in not working**
   - Check Azure AD app configuration
   - Verify redirect URIs match exactly
   - Ensure client secret is not expired

4. **Email verification not sending**
   - Check spam folder
   - Verify email templates in Firebase Console
   - Check Authentication > Templates

### Security Considerations

1. **Never expose Firebase Admin SDK keys** in client-side code
2. **Use Firebase Security Rules** to protect your data
3. **Validate user input** on both client and server side
4. **Implement proper error handling** for auth failures
5. **Use HTTPS** in production
6. **Regularly rotate API keys** and secrets

## Production Deployment

1. Build your app:
```bash
npm run build
```

2. Deploy to Firebase Hosting:
```bash
firebase deploy
```

3. Update authorized domains with your production URL
4. Test all authentication flows in production

## Monitoring and Analytics

1. Enable **Firebase Analytics** for user insights
2. Set up **Firebase Performance Monitoring**
3. Use **Firebase Crashlytics** for error tracking
4. Monitor authentication metrics in Firebase Console

Your Firebase authentication is now fully configured with Google, Microsoft, and email/password providers!