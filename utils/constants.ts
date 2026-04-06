// Application constants
export const APP_CONFIG = {
  name: 'Readdly Admin',
  version: '1.0.0',
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
}

// Color palette
export const COLORS = {
  primary: '#5f6ad8',
  primaryDark: '#444fc0',
  bgLight: '#edeffa',
  bgDark: '#1a2a4a',
  bgDarkAlt: '#2a3a5a',
  surfaceLight: '#ffffff',
  surfaceDark: '#1f2b4a',
  textMain: '#0f172a',
  textLight: '#f8f4e6',
  textMuted: '#6b7280',
  danger: '#dc2626',
}

// Animation durations
export const ANIMATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
}

// Breakpoints
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
}

// Sidebar configuration
export const SIDEBAR = {
  collapsedWidth: '80px',
  expandedWidth: '320px',
  transitionDuration: 300,
}
