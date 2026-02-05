# 🎨 Scramble - Design System & UI Guidelines

## 🌟 Design Philosophy

Scramble embodies a **modern, fun, and friendly** aesthetic that resonates with Gen-Z students. Our design philosophy centers around:

- **Approachable Learning**: Making study sessions feel less intimidating and more engaging
- **Social Connection**: Emphasizing collaboration and community through visual cues
- **Playful Professionalism**: Balancing fun elements with academic seriousness
- **Inclusive Design**: Ensuring accessibility and usability for all students

## 🎯 Target Audience

**Primary Users**: Gen-Z students (ages 16-24)
- Tech-savvy and mobile-first
- Value social interaction and gamification
- Prefer visual and interactive content
- Expect fast, intuitive interfaces

## 🎨 Visual Identity

### Brand Personality
- **Energetic** yet **Focused**
- **Collaborative** and **Supportive**
- **Modern** and **Approachable**
- **Trustworthy** and **Reliable**

### Logo Concept
```
🎓 SCRAMBLE
   Study • Collaborate • Achieve
```

## 🌈 Color System

### Primary Palette

```css
/* Core Brand Colors */
--deep-black: #151313;        /* Primary text, navigation, headers */
--vibrant-orange: #ff5734;    /* CTAs, active states, notifications */
--soft-purple: #be94f5;       /* Group study features, quizzes */
--warm-yellow: #fccc42;       /* Private space features, achievements */
--light-cream: #f7f7f5;       /* Card backgrounds, input fields */
--cool-blue-gray: #d4e4e8;    /* Main background, subtle elements */
```

### Semantic Colors

```css
/* Feedback & Status Colors */
--success-green: #4caf50;     /* Completed tasks, correct answers */
--warning-red: #f44336;       /* Errors, deadlines, incorrect answers */
--info-blue: #2196f3;         /* Links, informational messages */
--muted-gray: #9e9e9e;        /* Disabled states, placeholders */
```

### Feature-Specific Color Mapping

| Feature Category | Primary Color | Usage |
|-----------------|---------------|--------|
| Private Space | Warm Yellow (#fccc42) | Study timer, personal tasks, achievements |
| Group Study | Soft Purple (#be94f5) | Room features, collaborative tools |
| Communication | Info Blue (#2196f3) | Chat, video calls, notifications |
| Actions | Vibrant Orange (#ff5734) | Buttons, CTAs, active states |
| Success States | Success Green (#4caf50) | Completed items, correct answers |
| Warnings | Warning Red (#f44336) | Errors, deadlines, urgent items |

### Color Usage Guidelines

#### Accessibility Standards
- **Contrast Ratio**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Color Blindness**: Never rely on color alone to convey information
- **Dark Mode**: Provide alternative color schemes

#### Color Combinations
```css
/* High Contrast Combinations */
.primary-text { color: #151313; background: #f7f7f5; }
.cta-button { color: #ffffff; background: #ff5734; }
.success-badge { color: #ffffff; background: #4caf50; }
.warning-alert { color: #ffffff; background: #f44336; }
```

## ✍️ Typography

### Font Family
**Primary**: Kodchasan (Google Fonts)
- Modern, friendly, and highly readable
- Excellent for both headings and body text
- Supports multiple weights and styles

```css
@import url('https://fonts.googleapis.com/css2?family=Kodchasan:wght@300;400;500;600;700&display=swap');

font-family: 'Kodchasan', sans-serif;
```

### Type Scale

| Element | Weight | Size | Line Height | Usage |
|---------|--------|------|-------------|--------|
| **Page Titles** | 700 (Bold) | 28-32px | 1.2 | Room names, main headings |
| **Section Headings** | 600 (SemiBold) | 20-24px | 1.3 | Card titles, section headers |
| **Body Text** | 500 (Medium) | 15-16px | 1.5 | Main content, descriptions |
| **Secondary Text** | 400 (Regular) | 13-14px | 1.4 | Metadata, timestamps |
| **Small Labels** | 300 (Light) | 11-12px | 1.3 | Captions, fine print |

### Typography Examples

```css
/* Heading Styles */
.page-title {
  font-family: 'Kodchasan', sans-serif;
  font-weight: 700;
  font-size: 2rem; /* 32px */
  line-height: 1.2;
  color: var(--deep-black);
}

.section-heading {
  font-family: 'Kodchasan', sans-serif;
  font-weight: 600;
  font-size: 1.5rem; /* 24px */
  line-height: 1.3;
  color: var(--deep-black);
}

/* Body Text */
.body-text {
  font-family: 'Kodchasan', sans-serif;
  font-weight: 500;
  font-size: 1rem; /* 16px */
  line-height: 1.5;
  color: var(--deep-black);
}

.secondary-text {
  font-family: 'Kodchasan', sans-serif;
  font-weight: 400;
  font-size: 0.875rem; /* 14px */
  line-height: 1.4;
  color: var(--muted-gray);
}
```

## 🏗️ Layout & Spacing

### Grid System
- **12-column grid** for desktop layouts
- **Flexible grid** that adapts to mobile (4-column on mobile)
- **Container max-width**: 1200px
- **Gutter width**: 24px

### Spacing Scale
```css
/* Consistent spacing scale */
--space-xs: 4px;    /* Tight spacing */
--space-sm: 8px;    /* Small spacing */
--space-md: 16px;   /* Medium spacing */
--space-lg: 24px;   /* Large spacing */
--space-xl: 32px;   /* Extra large spacing */
--space-2xl: 48px;  /* Section spacing */
--space-3xl: 64px;  /* Page spacing */
```

### Layout Principles
- **Card-based design** with consistent spacing
- **Generous white space** for readability
- **Logical information hierarchy**
- **Mobile-first responsive approach**

## 🎴 Component Design

### Cards
The foundation of our UI - everything lives in cards!

```css
.card {
  background: var(--light-cream);
  border-radius: 24px;
  padding: var(--space-xl);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}
```

### Buttons

#### Primary Button (CTA)
```css
.btn-primary {
  background: var(--vibrant-orange);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 12px 24px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: #e64a2e;
  transform: translateY(-2px);
}
```

#### Secondary Button
```css
.btn-secondary {
  background: transparent;
  color: var(--deep-black);
  border: 2px solid var(--deep-black);
  border-radius: 20px;
  padding: 10px 22px;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: var(--deep-black);
  color: white;
}
```

### Form Elements

#### Input Fields
```css
.input-field {
  background: var(--light-cream);
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: var(--vibrant-orange);
  box-shadow: 0 0 0 3px rgba(255, 87, 52, 0.1);
}
```

### Navigation

#### Sidebar Design
- **Collapsible sidebar** for desktop
- **Bottom navigation** for mobile
- **Icon + text** layout with clear hierarchy
- **Active state** highlighting with orange accent

#### Tab Navigation
```css
.tab-nav {
  display: flex;
  background: var(--light-cream);
  border-radius: 20px;
  padding: 4px;
}

.tab-item {
  flex: 1;
  padding: 12px 16px;
  border-radius: 16px;
  text-align: center;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-item.active {
  background: var(--vibrant-orange);
  color: white;
}
```

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
.container {
  padding: 16px;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 24px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: 32px;
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

### Mobile Optimizations
- **Touch targets**: Minimum 44px for interactive elements
- **Thumb-friendly navigation**: Bottom navigation bar
- **Swipe gestures**: For cards and navigation
- **Optimized typography**: Larger text on mobile

## 🎭 Animations & Micro-interactions

### Animation Principles
- **Purposeful**: Every animation serves a functional purpose
- **Smooth**: 60fps performance with hardware acceleration
- **Quick**: Animations complete within 300ms
- **Consistent**: Same easing curves throughout the app

### Common Animations
```css
/* Smooth transitions */
.smooth-transition {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover lift effect */
.hover-lift:hover {
  transform: translateY(-4px);
}

/* Loading spinner */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-spinner {
  animation: spin 1s linear infinite;
}
```

### Micro-interactions
- **Button press**: Slight scale down (0.95) on click
- **Card hover**: Lift effect with shadow increase
- **Form focus**: Smooth border color transition
- **Loading states**: Skeleton screens and spinners
- **Success feedback**: Green checkmark animation

## 🎮 Gamification Elements

### Progress Indicators
```css
.progress-bar {
  background: var(--light-cream);
  border-radius: 10px;
  height: 8px;
  overflow: hidden;
}

.progress-fill {
  background: linear-gradient(90deg, var(--warm-yellow), var(--vibrant-orange));
  height: 100%;
  border-radius: 10px;
  transition: width 0.5s ease;
}
```

### Badges & Achievements
- **Circular badges** with icons
- **Gradient backgrounds** for premium feel
- **Subtle animations** on unlock
- **Consistent sizing** (32px, 48px, 64px)

### Leaderboard Design
- **Podium visualization** for top 3
- **Color-coded rankings** (Gold, Silver, Bronze)
- **Avatar integration** with user photos
- **Progress indicators** for scores

## 🌙 Dark Mode Support

### Dark Color Palette
```css
/* Dark Mode Colors */
--dark-bg: #1a1a1a;
--dark-card: #2d2d2d;
--dark-text: #ffffff;
--dark-text-secondary: #b3b3b3;
--dark-border: #404040;
```

### Implementation Strategy
- **CSS custom properties** for easy switching
- **Automatic detection** of system preference
- **Manual toggle** in user settings
- **Consistent contrast ratios** maintained

## ♿ Accessibility Guidelines

### Color & Contrast
- **WCAG AA compliance**: 4.5:1 contrast ratio minimum
- **Color independence**: Information not conveyed by color alone
- **Focus indicators**: Clear, high-contrast focus states

### Typography
- **Readable fonts**: Kodchasan chosen for clarity
- **Scalable text**: Supports browser zoom up to 200%
- **Adequate spacing**: Line height 1.5 for body text

### Interactive Elements
- **Touch targets**: Minimum 44px for mobile
- **Keyboard navigation**: Full functionality without mouse
- **Screen reader support**: Proper ARIA labels and semantic HTML

### Motion & Animation
- **Reduced motion**: Respect user preferences
- **Optional animations**: Can be disabled in settings
- **No seizure triggers**: Avoid rapid flashing

## 📐 Design Tokens

### Spacing Tokens
```json
{
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px",
    "2xl": "48px",
    "3xl": "64px"
  }
}
```

### Border Radius Tokens
```json
{
  "borderRadius": {
    "sm": "8px",
    "md": "12px",
    "lg": "16px",
    "xl": "20px",
    "2xl": "24px",
    "full": "9999px"
  }
}
```

### Shadow Tokens
```json
{
  "shadows": {
    "sm": "0 1px 3px rgba(0, 0, 0, 0.1)",
    "md": "0 2px 8px rgba(0, 0, 0, 0.08)",
    "lg": "0 4px 16px rgba(0, 0, 0, 0.12)",
    "xl": "0 8px 32px rgba(0, 0, 0, 0.16)"
  }
}
```

## 🎯 Component Library Structure

### Atomic Design Methodology
```
components/
├── atoms/           # Basic building blocks
│   ├── Button/
│   ├── Input/
│   ├── Avatar/
│   └── Badge/
├── molecules/       # Simple combinations
│   ├── SearchBar/
│   ├── UserCard/
│   └── ProgressBar/
├── organisms/       # Complex components
│   ├── Navigation/
│   ├── ChatWindow/
│   └── QuizInterface/
└── templates/       # Page layouts
    ├── DashboardLayout/
    ├── RoomLayout/
    └── AuthLayout/
```

## 🎨 Design Tools & Resources

### Design System Tools
- **Figma**: Primary design tool with component library
- **Storybook**: Component documentation and testing
- **Design Tokens**: JSON-based token system

### Asset Resources
- **Icons**: Heroicons, Lucide React
- **Illustrations**: Custom illustrations in brand style
- **Images**: Unsplash for stock photography
- **Animations**: Lottie files for complex animations

## 📋 Design Checklist

### Before Development
- [ ] All components designed in Figma
- [ ] Design tokens documented
- [ ] Accessibility requirements defined
- [ ] Responsive breakpoints specified
- [ ] Animation specifications provided

### During Development
- [ ] Design system implemented in code
- [ ] Components match Figma designs
- [ ] Responsive behavior tested
- [ ] Accessibility features implemented
- [ ] Performance optimizations applied

### Quality Assurance
- [ ] Cross-browser testing completed
- [ ] Mobile device testing done
- [ ] Accessibility audit passed
- [ ] Performance benchmarks met
- [ ] User testing feedback incorporated

---

*This design system serves as the single source of truth for all visual and interaction design decisions in Scramble. It ensures consistency, accessibility, and a delightful user experience across all platforms.*