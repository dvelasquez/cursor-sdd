/**
 * Component Interface Contracts
 *
 * TypeScript interfaces for Vue components and Astro layouts
 * Used for type checking and documentation
 *
 * Feature: 002-vue-prime-layouts
 * Date: 2026-01-10
 */

// Types are defined in this file to avoid circular dependencies
// See types.ts for MockUserSession definition

// ============================================================================
// Layout Configuration Types (from data-model.md)
// ============================================================================

export type LayoutType = 'public' | 'private';

export interface HeaderConfig {
  navigation: NavigationItem[];
  showBranding: boolean;
  authIndicators?: AuthIndicatorConfig; // Only for private layouts
}

export interface AuthIndicatorConfig {
  position: 'header-top-right';
  showUsername: boolean;
  showAvatar: boolean;
  showLogout: boolean;
}

export interface FooterConfig {
  content?: string;
  links?: NavigationItem[];
}

export interface BreakpointConfig {
  mobile: number; // max width
  tablet: number; // max width
  desktop: number; // min width
  minWidth: number; // 320px per SC-003
  maxWidth: number; // 2560px per SC-003
}

export interface ThemeConfig {
  preset?: 'Aura' | 'Material' | 'Lara' | 'Nora';
  mode?: 'styled' | 'unstyled';
}

export interface LayoutConfiguration {
  type: LayoutType;
  header: HeaderConfig;
  footer?: FooterConfig;
  responsiveBreakpoints: BreakpointConfig;
  theme?: ThemeConfig;
}

// ============================================================================
// Navigation Item Types
// ============================================================================

export interface NavigationItem {
  label: string;
  href: string;
  icon?: string; // PrimeIcons class name (e.g., 'pi pi-home')
}

// Public layout navigation items (per spec clarification)
export const PUBLIC_NAV_ITEMS: NavigationItem[] = [
  { label: 'Home', href: '/', icon: 'pi pi-home' },
  { label: 'About', href: '/about', icon: 'pi pi-info-circle' },
  { label: 'Login', href: '/login', icon: 'pi pi-sign-in' },
];

// Private layout navigation items (per spec clarification)
export const PRIVATE_NAV_ITEMS: NavigationItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'pi pi-th-large' },
  { label: 'Profile', href: '/profile', icon: 'pi pi-user' },
  { label: 'Logout', href: '#', icon: 'pi pi-sign-out' }, // Logout handled by event, not navigation
];

// ============================================================================
// Vue Component Props Interfaces
// ============================================================================

/**
 * PublicNav.vue Component Props
 * Navigation component for public layout
 */
export interface PublicNavProps {
  items: NavigationItem[]; // Should be PUBLIC_NAV_ITEMS
  showBranding?: boolean;
}

/**
 * PrivateNav.vue Component Props
 * Navigation component for private layout
 */
export interface PrivateNavProps {
  items: NavigationItem[]; // Should be PRIVATE_NAV_ITEMS
  userSession: import('./types').MockUserSession;
}

/**
 * UserProfile.vue Component Props
 * Authentication state indicator component (username/email, avatar/initial, logout button)
 *
 * Note: MockUserSession type imported from types.ts
 */
export interface UserProfileProps {
  userSession: import('./types').MockUserSession;
  position?: 'header-top-right'; // Default: 'header-top-right' per clarification
}

// ============================================================================
// Vue Component Emits Interfaces
// ============================================================================

/**
 * Navigation Event Payload
 * Emitted when user clicks a navigation item
 */
export interface NavigateEvent {
  href: string;
  item: NavigationItem;
}

/**
 * Logout Event Payload
 * Emitted when user clicks logout button
 */
export interface LogoutEvent {
  userId: string;
  timestamp: Date;
}

// ============================================================================
// Astro Layout Props Interfaces
// ============================================================================

/**
 * PublicLayout.astro Props
 * Standard layout for public pages (landing, docs, marketing)
 * Uses Astro slots for content
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PublicLayoutProps {
  // No props needed - uses Astro slots
  // Can add optional props for customization if needed
}

/**
 * PrivateLayout.astro Props
 * Standard layout for authenticated pages
 */
export interface PrivateLayoutProps {
  userSession: import('./types').MockUserSession; // Mock data for UI development
}

// ============================================================================
// Responsive Breakpoint Defaults
// ============================================================================

/**
 * Default breakpoint configuration
 * Per spec SC-003: Must support 320px-2560px width
 */
export const DEFAULT_BREAKPOINTS: BreakpointConfig = {
  mobile: 640, // Tailwind 'sm' breakpoint
  tablet: 1024, // Tailwind 'md' breakpoint
  desktop: 1024, // Tailwind 'lg' breakpoint (min width)
  minWidth: 320, // SC-003 requirement
  maxWidth: 2560, // SC-003 requirement
};

// ============================================================================
// Theme Configuration Defaults
// ============================================================================

/**
 * Default theme configuration
 * Uses styled mode with tailwindcss-primeui plugin (per research.md)
 */
export const DEFAULT_THEME: ThemeConfig = {
  preset: 'Aura', // PrimeVue theme preset
  mode: 'styled', // Using styled mode with tailwindcss-primeui plugin
};
