/**
 * Mock User Session Fixture
 * 
 * Simulated authentication state data for UI development and layout testing.
 * Per data-model.md: id, username, email, avatar (null), initial ("JD"), isAuthenticated (true)
 */

export interface SessionMetadata {
  loginTime?: Date | string;
  expiresAt?: Date | string;
  role?: string;
}

export interface MockUserSession {
  id: string;
  username?: string;
  email?: string;
  avatar?: string | null;
  initial?: string;
  isAuthenticated: boolean;
  sessionMetadata?: SessionMetadata;
}

/**
 * Mock user session for private layout testing
 * Per task T046-T047: Example fixture with id, username, email, avatar (null), initial ("JD"), isAuthenticated (true)
 */
export const mockUserSession: MockUserSession = {
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
