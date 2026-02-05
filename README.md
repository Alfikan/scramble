# 🎓 Scramble - Collaborative Study Platform

> **Study together, achieve together!** A modern, fun, and friendly platform where students can collaborate, learn, and excel in their academic journey.

![Scramble Banner](https://via.placeholder.com/800x200/ff5734/ffffff?text=Scramble+-+Study+Together)

## ✨ What is Scramble?

Scramble is a comprehensive collaborative study platform designed for Gen-Z students who want to make studying social, engaging, and effective. Think of it as Discord meets Google Classroom with a sprinkle of gamification magic!

### 🎯 Core Features

- **🏠 Private Study Space** - Your personal study sanctuary with timers, to-dos, and analytics
- **👥 Study Rooms** - Join or create study groups with friends and classmates
- **🎮 Quiz Sprints** - AI-powered competitive quizzes that make learning fun
- **💬 Smart Chat** - Rich messaging with LaTeX math, code snippets, and file sharing
- **📹 Video Meetings** - Built-in video calls with screen sharing and collaborative whiteboard
- **❓ Doubt System** - Ticket-based help system for getting answers fast
- **📊 Analytics** - Track your progress and see your study patterns
- **🏆 Gamification** - Earn XP, badges, and climb leaderboards
- **🤖 AI Assistant** - Get help with quiz generation and study recommendations

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Firebase account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/scramble.git
   cd scramble
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase and API keys
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library with hooks
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Router v6** - Client-side routing
- **React Query** - Data fetching and caching
- **React Hook Form + Yup** - Forms and validation

### Backend & Services
- **Firebase Auth** - Authentication (Email, Google)
- **Cloud Firestore** - NoSQL database
- **Cloud Storage** - File and media storage
- **Cloud Functions** - Serverless backend logic
- **Firebase Realtime Database** - Real-time presence

### Third-Party Integrations
- **Agora.io** - Video calling and screen sharing
- **OpenAI API** - AI quiz generation
- **Google Calendar API** - Schedule synchronization

## 🎨 Design System

### Typography
- **Font**: Kodchasan (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Color Palette
- **Deep Black**: `#151313` - Primary text, headers
- **Vibrant Orange**: `#ff5734` - CTAs, active states
- **Soft Purple**: `#be94f5` - Group study features
- **Warm Yellow**: `#fccc42` - Private space features
- **Light Cream**: `#f7f7f5` - Card backgrounds
- **Cool Blue-Gray**: `#d4e4e8` - Main background

### Design Principles
- **Card-based UI** with 24px border radius
- **Generous spacing** (24-32px padding)
- **Soft shadows** for depth
- **Smooth transitions** (0.3s ease)
- **Mobile-first** responsive design

## 📱 Mobile Support

Scramble is built as a Progressive Web App (PWA) with Capacitor for native mobile features:

- **iOS App** - Deploy to App Store
- **Android App** - Deploy to Google Play Store
- **Offline Mode** - Study even without internet
- **Push Notifications** - Stay updated on study activities

## 🔧 Development

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── common/         # Generic components (Button, Modal, etc.)
│   ├── auth/           # Authentication components
│   ├── rooms/          # Room-related components
│   ├── chat/           # Chat and messaging
│   ├── quiz/           # Quiz and assessment components
│   └── meetings/       # Video meeting components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── services/           # API and external service integrations
├── utils/              # Helper functions
├── contexts/           # React contexts
└── styles/             # Global styles and Tailwind config
```

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier

### Building for Mobile

```bash
# Build web app
npm run build

# Add mobile platforms
npx cap add ios
npx cap add android

# Sync and open in IDE
npx cap sync
npx cap open ios
npx cap open android
```

## 🧪 Testing

We use a comprehensive testing strategy:

- **Unit Tests** - Jest + React Testing Library
- **Integration Tests** - Testing user flows
- **E2E Tests** - Cypress for full user journeys
- **Security Tests** - Firestore rules testing

```bash
npm test                 # Run unit tests
npm run test:e2e        # Run E2E tests
npm run test:coverage   # Generate coverage report
```

## 🚀 Deployment

### Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init

# Deploy
firebase deploy
```

### Environment Variables

Create `.env` file with:

```env
# Firebase
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# Agora
REACT_APP_AGORA_APP_ID=your_agora_app_id

# Google
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_GOOGLE_API_KEY=your_google_api_key
```

## 🤝 Contributing

We love contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details on:

- Code of conduct
- Development process
- Pull request process
- Coding standards

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write tests
5. Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Firebase** - For the amazing backend infrastructure
- **Agora.io** - For seamless video calling capabilities
- **OpenAI** - For AI-powered quiz generation
- **Tailwind CSS** - For the beautiful and responsive design system
- **React Community** - For the incredible ecosystem

## 📞 Support

- **Documentation**: [docs.scramble.app](https://docs.scramble.app)
- **Discord Community**: [Join our Discord](https://discord.gg/scramble)
- **Email Support**: support@scramble.app
- **Bug Reports**: [GitHub Issues](https://github.com/yourusername/scramble/issues)

## 🗺️ Roadmap

### Phase 1: MVP (Current)
- [x] Authentication & User Management
- [x] Room System
- [x] Basic Chat
- [x] Study Timer
- [x] Personal To-Do List
- [ ] AI Quiz Generation

### Phase 2: Collaboration
- [ ] Advanced Chat Features
- [ ] Doubt System
- [ ] Resource Library
- [ ] Leaderboards

### Phase 3: Advanced Features
- [ ] Video Meetings
- [ ] Analytics Dashboard
- [ ] Study Planner
- [ ] Gamification System

### Phase 4: Polish & Scale
- [ ] Mobile Apps
- [ ] Offline Mode
- [ ] Performance Optimization
- [ ] Advanced AI Features

---

**Made with ❤️ by students, for students**

*Study smarter, not harder. Study together with Scramble!* 🎓✨