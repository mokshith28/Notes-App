import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { profileService } from '../services/profileService';
import { BASE_URL } from '../config/api';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const profile = await profileService.getProfile();
        if (profile.profileImageUrl) {
          setProfileImageUrl(`${BASE_URL}${profile.profileImageUrl}`);
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
    <header className="neo-header">
      <div className="neo-header__container">
        <div className="neo-header__logo-section" onClick={handleLogoClick}>
          <div className="neo-header__logo">
            <img
              src="/wallet-icon.png"
              alt="Expense Tracker"
              className="neo-header__logo-img"
            />
            <span className="neo-header__logo-text uppercase">
              EXPENSE TRACKER
            </span>
          </div>
        </div>

        <nav className="neo-header__nav">
          <button 
            className="neo-header__profile-btn" 
            onClick={handleProfileClick}
            aria-label="Go to Profile"
          >
            {profileImageUrl ? (
              <div className="neo-header__profile-image">
                <img src={profileImageUrl} alt="Profile" />
              </div>
            ) : (
              <div className="neo-header__profile-placeholder">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="3" 
                  strokeLinecap="square" 
                  strokeLinejoin="miter"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            )}
            <span className="uppercase">PROFILE</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
