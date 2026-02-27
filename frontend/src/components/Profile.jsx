import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { expenseService } from '../services/expenseService';
import { profileService } from '../services/profileService';
import { BASE_URL } from '../config/api';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Badge from './ui/Badge';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    totalExpenses: 0,
    totalAmount: 0,
    totalIncome: 0,
    totalExpense: 0,
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

      const totalIncome = expenses
        .filter(expense => expense.categoryType === 'Income')
        .reduce((sum, expense) => sum + expense.amount, 0);

      const totalExpense = expenses
        .filter(expense => expense.categoryType === 'Expense')
        .reduce((sum, expense) => sum + expense.amount, 0);

      const totalAmount = totalIncome - totalExpense;

      setStats({
        totalExpenses: expenses.length,
        totalAmount: totalAmount,
        totalIncome: totalIncome,
        totalExpense: totalExpense,
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
      return `${BASE_URL}${profile.profileImageUrl}`;
    }
    return null;
  };

  return (
    <div className="profile-container">
      <Card className="profile-card">
        <Button 
          variant="outline" 
          size="small" 
          onClick={handleBackClick}
          className="back-button"
        >
          ← BACK TO EXPENSES
        </Button>

        {error && (
          <div className="profile-message profile-message--error">
            {error}
          </div>
        )}
        {success && (
          <div className="profile-message profile-message--success">
            {success}
          </div>
        )}

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
              <h2 className="profile-name">{profile?.username || user?.username}</h2>
              <p className="profile-email">{profile?.email || user?.email}</p>
            </div>

            <div className="profile-section">
              <h3 className="section-title">STATS</h3>
              <div className="stats-grid">
                <Badge variant="secondary" className="stat-badge stat-1">
                  <span className="stat-emoji">📝</span>
                  <span className="stat-value">{stats.totalExpenses}</span>
                  <span className="stat-label">TRANSACTIONS</span>
                </Badge>
                <Badge variant="success" className="stat-badge stat-2">
                  <span className="stat-emoji">💰</span>
                  <span className="stat-value">${stats.totalIncome.toFixed(2)}</span>
                  <span className="stat-label">INCOME</span>
                </Badge>
                <Badge variant="danger" className="stat-badge stat-3">
                  <span className="stat-emoji">💸</span>
                  <span className="stat-value">${stats.totalExpense.toFixed(2)}</span>
                  <span className="stat-label">EXPENSES</span>
                </Badge>
                <Badge variant="primary" className="stat-badge stat-4">
                  <span className="stat-emoji">💵</span>
                  <span className="stat-value" style={{color: stats.totalAmount >= 0 ? '#119842' : '#9f1717'}}>
                    ${Math.abs(stats.totalAmount).toFixed(2)}
                  </span>
                  <span className="stat-label">BALANCE</span>
                </Badge>
                <Badge variant="accent" className="stat-badge stat-5">
                  <span className="stat-emoji">📁</span>
                  <span className="stat-value">{stats.categories}</span>
                  <span className="stat-label">CATEGORIES</span>
                </Badge>
              </div>
            </div>

            <div className="profile-section">
              <h3 className="section-title">DETAILS</h3>
              <div className="details-list">
                <div className="detail-row">
                  <span className="detail-label">USER ID</span>
                  <Badge variant="outline" size="small">{profile?.id || user?.id}</Badge>
                </div>
                <div className="detail-row">
                  <span className="detail-label">USERNAME</span>
                  <Badge variant="outline" size="small">{profile?.username || user?.username}</Badge>
                </div>
                <div className="detail-row">
                  <span className="detail-label">EMAIL</span>
                  <Badge variant="outline" size="small">{profile?.email || user?.email}</Badge>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              <Button variant="primary" onClick={handleEditProfile}>
                ✏️ EDIT PROFILE
              </Button>
              <Button variant="accent" onClick={handleLogout}>
                🚪 LOGOUT
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="edit-header">
              <h2 className="edit-title">EDIT PROFILE</h2>
              <Badge variant="secondary">⚙️</Badge>
            </div>

            <form onSubmit={handleSaveProfile} className="edit-profile-form">
              <div className="form-section">
                <h3 className="section-subtitle">PROFILE PICTURE</h3>
                <div className="image-upload-section">
                  <div className="profile-avatar profile-avatar--edit">
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
                    <label htmlFor="image-upload" className="upload-button">
                      <Button as="span" variant="primary" size="small">
                        📷 CHOOSE IMAGE
                      </Button>
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                    {(profile?.profileImageUrl || imagePreview) && (
                      <Button
                        type="button"
                        variant="accent"
                        size="small"
                        onClick={handleDeleteImage}
                      >
                        🗑️ DELETE
                      </Button>
                    )}
                  </div>
                  <p className="form-hint">Max 5MB • JPG, PNG, GIF</p>
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-subtitle">USERNAME</h3>
                <Input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  placeholder="Enter username"
                />
              </div>

              <div className="form-section">
                <h3 className="section-subtitle">EMAIL</h3>
                <Input
                  type="email"
                  value={profile?.email || user?.email}
                  disabled
                />
                <p className="form-hint">Email cannot be changed</p>
              </div>

              <div className="edit-actions">
                <Button type="submit" variant="primary">
                  ✔️ SAVE CHANGES
                </Button>
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  ❌ CANCEL
                </Button>
              </div>
            </form>
          </>
        )}
      </Card>
    </div>
  );
}

export default Profile;
