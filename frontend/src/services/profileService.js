import { authenticatedFetch, API_BASE_URL } from './apiClient';

/**
 * Makes an authenticated API request and handles the response
 */
async function makeRequest(url, options = {}) {
  const response = await authenticatedFetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data || `Request failed with status ${response.status}`);
  }

  return data;
}

export const profileService = {
  /**
   * Get user profile data
   */
  async getProfile() {
    return makeRequest(`${API_BASE_URL}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  /**
   * Update user profile (username)
   */
  async updateProfile(username) {
    const formData = new FormData();
    formData.append('username', username);

    return makeRequest(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      body: formData,
    });
  },

  /**
   * Upload user profile image
   */
  async uploadProfileImage(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    return makeRequest(`${API_BASE_URL}/profile/upload-image`, {
      method: 'POST',
      body: formData,
    });
  },

  /**
   * Delete user profile image
   */
  async deleteProfileImage() {
    return makeRequest(`${API_BASE_URL}/profile/delete-image`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
};
