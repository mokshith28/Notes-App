import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { expenseService } from '../services/expenseService';
import { profileService } from '../services/profileService';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    totalExpenses: 0,
    totalAmount: 0,
    categories: 0
  });
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Get user data from JWT token
    const userData = authService.getUserData();
    if (!userData) {
      navigate('/');
      return;
    }

    setUser(userData);

    // Fetch profile data and user stats
    fetchProfileData();
    fetchUserStats();
  }, [navigate]);

  const fetchProfileData = async () => {
    try {
      const profileData = await profileService.getProfile();
      setProfile(profileData);
      setEditUsername(profileData.username);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setError('Failed to load profile data');
    }
  };

  const fetchUserStats = async () => {
    try {
      const expenses = await expenseService.getAllExpenses();
      const categories = await expenseService.getCategories();

      const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

      setStats({
        totalExpenses: expenses.length,
        totalAmount: totalAmount,
        categories: categories.length
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate('/home');
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const handleEditProfile = () => {
    setIsEditMode(true);
    setError('');
    setSuccess('');
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditUsername(profile?.username || '');
    setSelectedImage(null);
    setImagePreview(null);
    setError('');
    setSuccess('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Only JPG, PNG, and GIF are allowed.');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit.');
        return;
      }

      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleDeleteImage = async () => {
    if (!profile?.profileImageUrl) {
      return;
    }

    if (!confirm('Are you sure you want to delete your profile image?')) {
      return;
    }

    try {
      await profileService.deleteProfileImage();
      setSuccess('Profile image deleted successfully!');
      await fetchProfileData();
      setImagePreview(null);
      setSelectedImage(null);
      
      // Notify other components (like Header) that profile was updated
      window.dispatchEvent(new Event('profileUpdated'));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Update username if changed
      if (editUsername !== profile?.username) {
        if (!editUsername.trim()) {
          setError('Username cannot be empty');
          return;
        }
        await profileService.updateProfile(editUsername);
        
        // Refresh token to get updated username in JWT claims
        await authService.refreshAccessToken();
        const updatedUserData = authService.getUserData();
        setUser(updatedUserData);
      }

      // Upload image if selected
      if (selectedImage) {
        await profileService.uploadProfileImage(selectedImage);
      }

      setSuccess('Profile updated successfully!');
      await fetchProfileData();
      
      // Notify other components (like Header) that profile was updated
      window.dispatchEvent(new Event('profileUpdated'));
      
      setTimeout(() => {
        setIsEditMode(false);
        setSelectedImage(null);
        setImagePreview(null);
      }, 1500);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading || !user) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Get initials for avatar
  const getInitials = () => {
    const username = profile?.username || user?.username;
    const email = profile?.email || user?.email;
    
    if (username) {
      return username.substring(0, 2).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  const getProfileImageUrl = () => {
    if (profile?.profileImageUrl) {
      return `https://localhost:7211${profile.profileImageUrl}`;
    }
    return null;
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <button className="back-button" onClick={handleBackClick}>
          ← Back to Expenses
        </button>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {!isEditMode ? (
          <>
            <div className="profile-header">
              <div className="profile-avatar">
                {getProfileImageUrl() ? (
                  <img src={getProfileImageUrl()} alt="Profile" />
                ) : (
                  <div className="avatar-placeholder">
                    {getInitials()}
                  </div>
                )}
              </div>
              <h2>{profile?.username || user?.username}</h2>
              <p className="profile-email">{profile?.email || user?.email}</p>
            </div>

            <div className="profile-stats">
              <h3>Account Details</h3>
              <div className="user-details">
                <div className="detail-item">
                  <span className="detail-label">User ID:</span>
                  <span className="detail-value">{profile?.id || user?.id}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Username:</span>
                  <span className="detail-value">{profile?.username || user?.username}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{profile?.email || user?.email}</span>
                </div>
              </div>
            </div>

            <div className="profile-stats">
              <h3>Your Stats</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-value">{stats.totalExpenses}</span>
                  <span className="stat-label">Total Expenses</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">${stats.totalAmount.toFixed(2)}</span>
                  <span className="stat-label">Total Amount</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{stats.categories}</span>
                  <span className="stat-label">Categories Used</span>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              <button className="btn-edit" onClick={handleEditProfile}>
                Edit Profile
              </button>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="profile-header">
              <h2>Edit Profile</h2>
            </div>

            <form onSubmit={handleSaveProfile} className="edit-profile-form">
              <div className="form-section">
                <h3>Profile Picture</h3>
                <div className="image-upload-section">
                  <div className="profile-avatar">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" />
                    ) : getProfileImageUrl() ? (
                      <img src={getProfileImageUrl()} alt="Profile" />
                    ) : (
                      <div className="avatar-placeholder">
                        {getInitials()}
                      </div>
                    )}
                  </div>
                  <div className="image-actions">
                    <label htmlFor="image-upload" className="btn-upload">
                      Choose Image
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                    {(profile?.profileImageUrl || imagePreview) && (
                      <button
                        type="button"
                        className="btn-delete-image"
                        onClick={handleDeleteImage}
                      >
                        Delete Image
                      </button>
                    )}
                  </div>
                  <p className="image-hint">Max size: 5MB. Formats: JPG, PNG, GIF</p>
                </div>
              </div>

              <div className="form-section">
                <h3>Username</h3>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="edit-input"
                  placeholder="Enter username"
                />
              </div>

              <div className="form-section">
                <h3>Email</h3>
                <input
                  type="email"
                  value={profile?.email || user?.email}
                  className="edit-input"
                  disabled
                />
                <p className="input-hint">Email cannot be changed</p>
              </div>

              <div className="edit-actions">
                <button type="submit" className="btn-save">
                  Save Changes
                </button>
                <button type="button" className="btn-cancel" onClick={handleCancelEdit}>
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
