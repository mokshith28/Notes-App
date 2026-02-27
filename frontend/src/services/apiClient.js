import { authService } from './authService';

const API_BASE_URL = `http://${window.location.hostname}:5090/api`;

// Fetch wrapper that automatically handles token refresh on 401 errors
export async function authenticatedFetch(url, options = {}) {
  // Get valid access token (will refresh if expired)
  const token = await authService.getValidAccessToken();

  // Add authorization header
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  };

  // Make the request
  let response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  // If 401 Unauthorized, try to refresh token and retry once
  if (response.status === 401) {
    try {
      // Attempt to refresh the token (this uses the lock mechanism in authService)
      await authService.refreshAccessToken();

      // Get the new token
      const newToken = authService.getAccessToken();

      // Retry the request with new token
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${newToken}`,
        },
        credentials: 'include',
      });
    } catch (refreshError) {
      // If refresh fails, redirect to login
      console.error('Token refresh failed:', refreshError);
      localStorage.removeItem('accessToken');
      window.location.href = '/';
      throw new Error('Session expired. Please login again.');
    }
  }

  return response;
}

export { API_BASE_URL };
