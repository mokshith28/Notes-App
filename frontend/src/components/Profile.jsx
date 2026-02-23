import { useNavigate } from 'react-router-dom';
import './Profile.css';

// TODO: Replace with real user data when authentication is ready
const DUMMY_USER = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: null, // Will be replaced with real avatar URL
  joinedDate: 'January 2024',
  stats: {
    totalExpenses: 0,
    totalAmount: 0,
    categories: 0
  }
};

function Profile() {
  const navigate = useNavigate();
  
  // TODO: Replace with actual user data from authentication context
  const user = DUMMY_USER;

  const handleBackClick = () => {
    navigate('/');
  };

  // TODO: Implement when authentication is ready
  const handleLogout = () => {
    console.log('Logout functionality - to be implemented with authentication');
    // Future: Clear auth token, redirect to login
  };

  // TODO: Implement profile edit when authentication is ready
  const handleEditProfile = () => {
    console.log('Edit profile functionality - to be implemented');
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <button className="back-button" onClick={handleBackClick}>
          ← Back to Expenses
        </button>

        <div className="profile-header">
          <div className="profile-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <div className="avatar-placeholder">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
          </div>
          <h2>{user.name}</h2>
          <p className="profile-email">{user.email}</p>
          <p className="profile-joined">Member since {user.joinedDate}</p>
        </div>

        <div className="profile-stats">
          <h3>Your Stats</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{user.stats.totalExpenses}</span>
              <span className="stat-label">Total Expenses</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">${user.stats.totalAmount.toFixed(2)}</span>
              <span className="stat-label">Total Amount</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{user.stats.categories}</span>
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

        <div className="profile-info-notice">
          <p>🔒 Authentication is not yet implemented. This is a preview with dummy data.</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
