/**
 * Shared Type Definitions
 * 
 * Re-exported types from data-model.md for use in contracts and implementation
 * 
 * Feature: 002-vue-prime-layouts
 * Date: 2026-01-10
 */

// ============================================================================
// Mock User Session Types
// ============================================================================

export interface SessionMetadata {
  loginTime?: Date | string;
  expiresAt?: Date | string;
  role?: string;
}

/**
 * Mock User Session
 * Simulated authentication state data for UI development and layout testing
 * 
 * Per spec clarification:
 * - Standard profile indicator set: username/email displayed, avatar or initial, logout button
 * - Located in header area, typically top-right (per clarification)
 */
export interface MockUserSession {
  id: string;
  username?: string;
  email?: string;
  avatar?: string | null;
  initial?: string;
  isAuthenticated: boolean;
  sessionMetadata?: SessionMetadata;
}

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validates MockUserSession structure
 * @param session - Session to validate
 * @returns true if valid, false otherwise
 */
export function isValidMockSession(session: unknown): session is MockUserSession {
  if (typeof session !== 'object' || session === null) return false;
  
  const s = session as Partial<MockUserSession>;
  
  // Required fields
  if (typeof s.id !== 'string' || s.id.length === 0) return false;
  if (typeof s.isAuthenticated !== 'boolean') return false;
  
  // At least one of username or email must be provided
  if (!s.username && !s.email) return false;
  
  // If avatar is null, initial must be provided
  if (s.avatar === null && !s.initial) return false;
  
  return true;
}

/**
 * Creates a valid initial from username or email
 * @param username - Username string
 * @param email - Email string
 * @returns Initial string (1-2 characters)
 */
export function createInitial(username?: string, email?: string): string {
  const source = username || email || '';
  if (source.length === 0) return '?';
  
  // Get first letter of first word
  const first = source.charAt(0).toUpperCase();
  
  // If username has multiple words, get first letter of last word too
  if (username && username.includes(' ')) {
    const parts = username.split(' ');
    const last = parts[parts.length - 1].charAt(0).toUpperCase();
    return `${first}${last}`;
  }
  
  return first;
}

// ============================================================================
// Example Mock Data
// ============================================================================

/**
 * Example mock user session for development/testing
 * Use this as a template for creating additional test fixtures
 */
export const EXAMPLE_MOCK_SESSION: MockUserSession = {
  id: 'mock-user-001',
  username: 'johndoe',
  email: 'john.doe@example.com',
  avatar: null,
  initial: 'JD',
  isAuthenticated: true,
  sessionMetadata: {
    loginTime: '2026-01-10T10:00:00Z',
    role: 'user',
  },
};

/**
 * Example mock session with avatar
 */
export const EXAMPLE_MOCK_SESSION_WITH_AVATAR: MockUserSession = {
  id: 'mock-user-002',
  username: 'janedoe',
  email: 'jane.doe@example.com',
  avatar: 'https://example.com/avatar.jpg',
  initial: 'JD', // Fallback if avatar fails to load
  isAuthenticated: true,
  sessionMetadata: {
    loginTime: '2026-01-10T10:00:00Z',
    role: 'admin',
  },
};

/**
 * Example unauthenticated state (for public layout testing)
 */
export const EXAMPLE_UNAUTHENTICATED: MockUserSession = {
  id: 'anonymous',
  isAuthenticated: false,
};
