import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { profileService } from '../services/profileService';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const profile = await profileService.getProfile();
        if (profile.profileImageUrl) {
          setProfileImageUrl(`https://localhost:7211${profile.profileImageUrl}`);
        } else {
          setProfileImageUrl(null);
        }
      } catch (error) {
        console.error('Failed to fetch profile image:', error);
      }
    };
    
    fetchProfileImage();

    // Listen for profile update events
    const handleProfileUpdate = () => {
      fetchProfileImage();
    };
    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLogoClick = () => {
    navigate('/home');
  };


  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <h1>💰 Expense Tracker</h1>
          <p className="app-subtitle">Track your expenses and manage your budget</p>
        </div>
        <div className="header-right">
          <button className="profile-icon-btn" onClick={handleProfileClick} aria-label="Profile">
            {profileImageUrl ? (
              <img src={profileImageUrl} alt="Profile" className="profile-icon-img" />
            ) : (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
