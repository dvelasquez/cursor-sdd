/**
 * Type definitions for Authentication Flow - Login and Registration
 * Feature: 006-clerk-auth
 * Date: 2026-01-11
 *
 * Note: These types are application-level definitions. For full type safety,
 * use Clerk's official types from @clerk/astro or @clerk/clerk-react packages.
 */

/**
 * Authentication state (simplified representation of Clerk's auth state)
 */
export interface AuthState {
  isLoaded: boolean;
  isSignedIn: boolean | undefined;
  userId: string | null | undefined;
  sessionId: string | null | undefined;
}

/**
 * User information (subset of Clerk's User object)
 */
export interface UserInfo {
  id: string;
  emailAddress: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
}

/**
 * Registration form state
 */
export interface RegistrationFormState {
  email: string;
  password: string;
  loading: boolean;
  error: string | null;
}

/**
 * Login form state
 */
export interface LoginFormState {
  email: string;
  password: string;
  loading: boolean;
  error: string | null;
}

/**
 * Authentication error
 */
export interface AuthError {
  message: string;
  code?: string;
  field?: string;
}

/**
 * Test user for E2E testing
 */
export interface TestUser {
  email: string;
  password: string;
  userId?: string;
}

/**
 * Redirect configuration
 */
export interface RedirectConfig {
  afterSignIn: string | null;
  afterSignUp: string | null;
  fallback: string; // Default: '/'
}

/**
 * Environment configuration
 */
export interface ClerkEnvConfig {
  publishableKey: string;
  secretKey: string;
  apiKey?: string; // For backend SDK (testing only)
}
