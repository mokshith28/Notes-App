import { authenticatedFetch, API_BASE_URL } from './apiClient';

export const profileService = {
  // Get user profile
  async getProfile() {
    const response = await authenticatedFetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data || 'Failed to fetch profile');
    }

    return data;
  },

  // Update profile (username)
  async updateProfile(username) {
    const formData = new FormData();
    formData.append('username', username);

    const response = await authenticatedFetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data || 'Failed to update profile');
    }

    return data;
  },

  // Upload profile image
  async uploadProfileImage(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await authenticatedFetch(`${API_BASE_URL}/profile/upload-image`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data || 'Failed to upload image');
    }

    return data;
  },

  // Delete profile image
  async deleteProfileImage() {
    const response = await authenticatedFetch(`${API_BASE_URL}/profile/delete-image`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data || 'Failed to delete image');
    }

    return data;
  },
};
