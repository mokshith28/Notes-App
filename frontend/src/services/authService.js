import { jwtDecode } from 'jwt-decode';
import { API_BASE_URL } from '../config/api';

const TOKEN_KEY = 'accessToken';

// JWT claim mappings for .NET tokens
const JWT_CLAIMS = {
  ID: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
  USERNAME: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
  EMAIL: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
};

// Prevent concurrent refresh requests
let refreshPromise = null;

/**
 * Executes an API request and handles the response
 */
async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Always include cookies
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data || 'Request failed');
  }

  return data;
}

/**
 * Extracts user data from JWT claims
 */
function extractUserData(decoded) {
  return {
    id: decoded[JWT_CLAIMS.ID] || decoded.nameid,
    username: decoded[JWT_CLAIMS.USERNAME] || decoded.unique_name,
    email: decoded[JWT_CLAIMS.EMAIL] || decoded.email,
    exp: decoded.exp,
  };
}

export const authService = {
  /**
   * Register a new user
   */
  async register(userData) {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  /**
   * Login user and store access token
   */
  async login(credentials) {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    localStorage.setItem(TOKEN_KEY, data.accessToken);
    return data;
  },

  /**
   * Logout user and clear session
   */
  async logout() {
    const token = this.getAccessToken();

    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
      } catch (error) {
        console.error('Logout request failed:', error);
      }
    }

    this.clearSession();
  },

  /**
   * Get stored access token
   */
  getAccessToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Clear authentication session
   */
  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getAccessToken();
  },

  /**
   * Decode and extract user data from JWT token
   */
  getUserData() {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      return extractUserData(decoded);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  },

  /**
   * Refresh the access token using the refresh token cookie
   * Uses a lock mechanism to prevent concurrent refresh requests
   */
  async refreshAccessToken() {
    // Return existing refresh promise if already in progress
    if (refreshPromise) {
      return refreshPromise;
    }

    refreshPromise = (async () => {
      try {
        const data = await apiRequest('/auth/refresh-token', {
          method: 'POST',
        });

        localStorage.setItem(TOKEN_KEY, data.accessToken);
        return data;
      } catch (error) {
        this.clearSession();
        throw error;
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  },
};
