# Scramble - Responsive Design Guide

## Overview
Scramble is fully responsive and optimized for all devices - mobile phones, tablets, and desktop computers. The app uses a mobile-first approach with progressive enhancement for larger screens.

## Breakpoints

### Standard Breakpoints
- **xs**: 375px - Small mobile devices
- **sm**: 640px - Mobile landscape / Large phones
- **md**: 768px - Tablets
- **lg**: 1024px - Desktop / Laptops
- **xl**: 1280px - Large desktop
- **2xl**: 1536px - Extra large screens

### Usage in Tailwind
```jsx
// Mobile first - applies to all sizes
<div className="p-4">

// Tablet and up
<div className="p-4 md:p-6">

// Desktop and up
<div className="p-4 md:p-6 lg:p-8">

// Responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
```

## Layout Structure

### Desktop (lg and above)
- Fixed sidebar (280px width)
- Main content area with left margin
- No bottom navigation

### Mobile/Tablet (below lg)
- Hidden sidebar by default
- Hamburger menu button (top-left)
- Slide-out sidebar overlay
- Fixed bottom navigation bar
- Content with bottom padding for nav

## Key Responsive Components

### 1. Layout (`src/components/layout/Layout.jsx`)
- Automatically switches between desktop sidebar and mobile bottom nav
- Handles menu overlay for mobile
- Manages safe areas for notched devices

### 2. Sidebar (`src/components/layout/Sidebar.jsx`)
- Collapsible on desktop
- Full-width overlay on mobile
- Touch-optimized buttons (44px minimum)
- Scrollable navigation

### 3. Mobile Bottom Nav (`src/components/layout/MobileBottomNav.jsx`)
- Fixed bottom navigation for mobile
- 5 primary actions
- Active state indicators
- Safe area support

## Responsive Patterns

### Typography
```jsx
// Responsive heading
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">

// Responsive body text
<p className="text-sm sm:text-base md:text-lg">
```

### Spacing
```jsx
// Responsive padding
<div className="p-4 sm:p-6 md:p-8">

// Responsive margin
<div className="mb-4 sm:mb-6 md:mb-8">

// Responsive gap
<div className="gap-3 sm:gap-4 md:gap-6">
```

### Grid Layouts
```jsx
// 1 column mobile, 2 tablet, 4 desktop
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

// 2 columns mobile, 3 tablet, 4 desktop
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
```

### Flex Layouts
```jsx
// Stack on mobile, row on desktop
<div className="flex flex-col lg:flex-row gap-4">

// Responsive alignment
<div className="flex flex-col sm:flex-row items-start sm:items-center">
```

### Visibility
```jsx
// Hide on mobile, show on desktop
<div className="hidden lg:block">

// Show on mobile, hide on desktop
<div className="block lg:hidden">

// Show on tablet and up
<div className="hidden md:block">
```

## Touch Optimization

### Touch Targets
All interactive elements have minimum 44x44px touch targets:
```jsx
<button className="touch-target p-3">
```

### Active States
Mobile devices use active states instead of hover:
```css
button:active {
  @apply scale-95 opacity-80;
}
```

### Scroll Behavior
```css
/* Smooth scrolling on mobile */
.smooth-scroll {
  -webkit-overflow-scrolling: touch;
}
```

## Safe Areas (Notched Devices)

### CSS Classes
```jsx
// Top safe area (status bar)
<div className="safe-area-top">

// Bottom safe area (home indicator)
<div className="safe-area-bottom">

// Combined
<nav className="safe-area-top safe-area-bottom">
```

### CSS Variables
```css
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);
padding-left: env(safe-area-inset-left);
padding-right: env(safe-area-inset-right);
```

## Responsive Utilities

### JavaScript Helpers (`src/utils/responsive.js`)
```javascript
import { isMobile, isTablet, isDesktop, getCurrentBreakpoint } from './utils/responsive';

// Check device type
if (isMobile()) {
  // Mobile-specific logic
}

// Get current breakpoint
const breakpoint = getCurrentBreakpoint(); // 'xs', 'sm', 'md', 'lg', 'xl', '2xl'

// Responsive values
const columns = responsiveValue({
  xs: 1,
  sm: 2,
  lg: 4,
  default: 3
});
```

## Page-Specific Responsive Features

### Dashboard
- 2-column grid on mobile for quick stats
- 4-column grid on desktop
- Stacked layout for activity and rooms on mobile
- Side-by-side on desktop

### AI Chat
- Full-screen chat on mobile
- Sidebar with info cards on desktop
- Responsive message bubbles
- Mobile-optimized input area

### AI Quiz
- Full-screen questions on mobile
- Centered layout with max-width on desktop
- Touch-friendly answer buttons
- Responsive progress indicators

### Study Rooms
- 1-column room cards on mobile
- 2-column on tablet
- 3-column on desktop
- Responsive filters and search

### Room Page
- Stacked video grid on mobile
- Multi-column grid on desktop
- Collapsible members sidebar
- Mobile-optimized chat

## Performance Optimizations

### Image Loading
```jsx
// Responsive images
<img 
  srcSet="image-small.jpg 640w, image-medium.jpg 1024w, image-large.jpg 1920w"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

### Lazy Loading
```jsx
// Lazy load below fold content
<img loading="lazy" src="image.jpg" />
```

### Code Splitting
```javascript
// Lazy load components
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
```

## Testing Responsive Design

### Browser DevTools
1. Open Chrome DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Test different devices:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPad (768px)
   - iPad Pro (1024px)
   - Desktop (1920px)

### Real Device Testing
- Test on actual mobile devices
- Check touch interactions
- Verify safe areas on notched devices
- Test landscape orientation
- Check performance on lower-end devices

## Common Responsive Patterns

### Card Grid
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
  <Card />
</div>
```

### Hero Section
```jsx
<section className="py-12 sm:py-16 md:py-20">
  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
  <p className="text-base sm:text-lg md:text-xl">
</section>
```

### Navigation
```jsx
// Desktop
<nav className="hidden lg:flex">

// Mobile
<nav className="lg:hidden">
```

### Modal/Dialog
```jsx
<div className="fixed inset-0 p-4 sm:p-6 md:p-8">
  <div className="max-w-md sm:max-w-lg md:max-w-2xl mx-auto">
```

## Accessibility

### Focus States
All interactive elements have visible focus states:
```css
*:focus {
  outline: 2px solid var(--vibrant-orange);
  outline-offset: 2px;
}
```

### Screen Readers
```jsx
// Hide visually but keep for screen readers
<span className="sr-only">Description</span>

// ARIA labels
<button aria-label="Close menu">
```

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Logical tab order
- Escape key closes modals
- Enter key submits forms

## Dark Mode Support

The app supports dark mode with the `dark:` prefix:
```jsx
<div className="bg-white dark:bg-dark-bg text-primary-black dark:text-dark-text">
```

## Best Practices

1. **Mobile First**: Start with mobile styles, add desktop enhancements
2. **Touch Targets**: Minimum 44x44px for all interactive elements
3. **Performance**: Optimize images, lazy load, code split
4. **Testing**: Test on real devices, not just emulators
5. **Safe Areas**: Always account for notches and home indicators
6. **Orientation**: Support both portrait and landscape
7. **Accessibility**: Ensure keyboard and screen reader support
8. **Progressive Enhancement**: Core functionality works everywhere

## Troubleshooting

### Layout Issues
- Check if container has proper responsive classes
- Verify breakpoint values match design
- Test in multiple browsers

### Touch Issues
- Ensure touch targets are large enough
- Check for hover-only interactions
- Test on actual touch devices

### Performance Issues
- Optimize images for mobile
- Reduce bundle size
- Use lazy loading
- Minimize re-renders

## Resources

- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [MDN Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Web.dev Responsive Images](https://web.dev/responsive-images/)
- [iOS Safe Area](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)
