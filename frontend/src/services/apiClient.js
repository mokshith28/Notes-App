import { authService } from './authService';

const API_BASE_URL = `http://${window.location.hostname}:5090/api`;

/**
 * Creates fetch headers with authorization token
 */
function createAuthHeaders(token, customHeaders = {}) {
  return {
    ...customHeaders,
    'Authorization': `Bearer ${token}`,
  };
}

/**
 * Executes a fetch request with credentials
 */
function executeFetch(url, options, token) {
  return fetch(url, {
    ...options,
    headers: createAuthHeaders(token, options.headers),
    credentials: 'include',
  });
}

/**
 * Handles session expiration by clearing auth state and redirecting to login
 */
function handleSessionExpired(error) {
  console.error('Session expired:', error);
  authService.clearSession();
  window.location.href = '/';
  throw new Error('Session expired. Please login again.');
}

/**
 * Fetch wrapper that automatically handles token refresh on 401 errors
 */
export async function authenticatedFetch(url, options = {}) {
  const token = authService.getAccessToken();

  if (!token) {
    handleSessionExpired(new Error('No access token found'));
  }

  let response = await executeFetch(url, options, token);

  // Handle 401 Unauthorized - refresh token and retry once
  if (response.status === 401) {
    try {
      await authService.refreshAccessToken();
      const newToken = authService.getAccessToken();
      response = await executeFetch(url, options, newToken);
    } catch (error) {
      handleSessionExpired(error);
    }
  }

  return response;
}

export { API_BASE_URL };
