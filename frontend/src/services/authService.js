import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = 'https://localhost:7211/api';

// Track ongoing refresh promise to prevent multiple simultaneous refreshes
let refreshPromise = null;

export const authService = {
  // Register new user
  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data || 'Registration failed');
    }

    return data;
  },

  // Login user
  async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies in request
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data || 'Login failed');
    }

    // Store only access token (refresh token is in HTTP-only cookie)
    localStorage.setItem('accessToken', data.accessToken);

    return data;
  },

  // Logout user
  async logout() {
    const accessToken = this.getAccessToken();
    
    if (accessToken) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies in request
        });
      } catch (error) {
        console.error('Logout request failed:', error);
      }
    }

    // Clear access token from localStorage
    localStorage.removeItem('accessToken');
  },

  // Get access token
  getAccessToken() {
    return localStorage.getItem('accessToken');
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getAccessToken();
  },

  // Get user data from JWT access token
  getUserData() {
    const token = this.getAccessToken();
    if (!token) {
      return null;
    }

    try {
      const decoded = jwtDecode(token);
      return {
        id: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || decoded.nameid,
        username: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || decoded.unique_name,
        email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || decoded.email,
        exp: decoded.exp, // Token expiration time
      };
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  },

  // Check if access token is expired
  isAccessTokenExpired() {
    const userData = this.getUserData();
    if (!userData || !userData.exp) {
      return true;
    }
    // Add 10 second buffer to refresh before actual expiry
    return Date.now() >= (userData.exp * 1000) - 10000;
  },

  // Refresh the access token using refresh token (from HTTP-only cookie)
  async refreshAccessToken() {
    // If a refresh is already in progress, wait for it
    if (refreshPromise) {
      return refreshPromise;
    }

    // Start a new refresh operation
    refreshPromise = (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies (refresh token) in request
        });

        const data = await response.json();

        if (!response.ok) {
          // If refresh token is invalid, clear access token
          localStorage.removeItem('accessToken');
          throw new Error(data.message || data || 'Token refresh failed');
        }

        // Update access token
        localStorage.setItem('accessToken', data.accessToken);

        return data;
      } finally {
        // Clear the refresh promise when done (success or failure)
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  },

  // Get valid access token (refresh if needed)
  async getValidAccessToken() {
    if (this.isAccessTokenExpired()) {
      try {
        await this.refreshAccessToken();
      } catch (error) {
        console.error('Failed to refresh token:', error);
        throw error;
      }
    }
    return this.getAccessToken();
  },
};
