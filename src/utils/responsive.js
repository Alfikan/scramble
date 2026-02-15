/**
 * Responsive Utilities
 * Helper functions for responsive design
 */

// Breakpoint values (must match tailwind.config.js)
export const BREAKPOINTS = {
  xs: 375,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

/**
 * Check if current viewport matches a breakpoint
 */
export const useBreakpoint = (breakpoint) => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= BREAKPOINTS[breakpoint];
};

/**
 * Get current breakpoint name
 */
export const getCurrentBreakpoint = () => {
  if (typeof window === 'undefined') return 'lg';
  
  const width = window.innerWidth;
  
  if (width >= BREAKPOINTS['2xl']) return '2xl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  if (width >= BREAKPOINTS.xs) return 'xs';
  return 'xs';
};

/**
 * Check if device is mobile
 */
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < BREAKPOINTS.lg;
};

/**
 * Check if device is tablet
 */
export const isTablet = () => {
  if (typeof window === 'undefined') return false;
  const width = window.innerWidth;
  return width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
};

/**
 * Check if device is desktop
 */
export const isDesktop = () => {
  if (typeof window === 'undefined') return true;
  return window.innerWidth >= BREAKPOINTS.lg;
};

/**
 * Check if device has touch capability
 */
export const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Get safe area insets for devices with notches
 */
export const getSafeAreaInsets = () => {
  if (typeof window === 'undefined' || !CSS.supports('padding: env(safe-area-inset-top)')) {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }

  const style = getComputedStyle(document.documentElement);
  return {
    top: parseInt(style.getPropertyValue('env(safe-area-inset-top)')) || 0,
    right: parseInt(style.getPropertyValue('env(safe-area-inset-right)')) || 0,
    bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)')) || 0,
    left: parseInt(style.getPropertyValue('env(safe-area-inset-left)')) || 0,
  };
};

/**
 * Responsive value selector
 * Returns different values based on current breakpoint
 */
export const responsiveValue = (values) => {
  const breakpoint = getCurrentBreakpoint();
  
  // Return the value for current breakpoint or closest smaller one
  if (values[breakpoint]) return values[breakpoint];
  
  const breakpointOrder = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  const currentIndex = breakpointOrder.indexOf(breakpoint);
  
  for (let i = currentIndex - 1; i >= 0; i--) {
    if (values[breakpointOrder[i]]) {
      return values[breakpointOrder[i]];
    }
  }
  
  return values.default || values[breakpointOrder[0]];
};

/**
 * Clamp value between min and max based on viewport width
 */
export const clampValue = (min, max, minVw = 375, maxVw = 1920) => {
  if (typeof window === 'undefined') return max;
  
  const vw = window.innerWidth;
  if (vw <= minVw) return min;
  if (vw >= maxVw) return max;
  
  const slope = (max - min) / (maxVw - minVw);
  return min + slope * (vw - minVw);
};

/**
 * Get optimal grid columns based on viewport
 */
export const getGridColumns = (options = {}) => {
  const {
    xs = 1,
    sm = 2,
    md = 2,
    lg = 3,
    xl = 4,
  } = options;
  
  const breakpoint = getCurrentBreakpoint();
  const columns = { xs, sm, md, lg, xl };
  
  return columns[breakpoint] || lg;
};

/**
 * Get optimal spacing based on viewport
 */
export const getResponsiveSpacing = (base = 16) => {
  const breakpoint = getCurrentBreakpoint();
  const multipliers = {
    xs: 0.75,
    sm: 0.875,
    md: 1,
    lg: 1,
    xl: 1.125,
    '2xl': 1.25,
  };
  
  return base * (multipliers[breakpoint] || 1);
};

/**
 * Check if viewport is in landscape orientation
 */
export const isLandscape = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth > window.innerHeight;
};

/**
 * Check if viewport is in portrait orientation
 */
export const isPortrait = () => {
  if (typeof window === 'undefined') return true;
  return window.innerHeight >= window.innerWidth;
};

/**
 * Get viewport dimensions
 */
export const getViewportDimensions = () => {
  if (typeof window === 'undefined') {
    return { width: 1920, height: 1080 };
  }
  
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

/**
 * Debounce function for resize events
 */
export const debounce = (func, wait = 150) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Hook for responsive behavior
 * Usage: const { isMobile, isTablet, isDesktop, breakpoint } = useResponsive();
 */
export const useResponsive = () => {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      breakpoint: 'lg',
      width: 1920,
      height: 1080,
    };
  }

  return {
    isMobile: isMobile(),
    isTablet: isTablet(),
    isDesktop: isDesktop(),
    breakpoint: getCurrentBreakpoint(),
    width: window.innerWidth,
    height: window.innerHeight,
    isLandscape: isLandscape(),
    isPortrait: isPortrait(),
    isTouchDevice: isTouchDevice(),
  };
};
