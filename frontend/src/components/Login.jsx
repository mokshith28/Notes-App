import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import Button from './ui/Button';
import Input from './ui/Input';
import Badge from './ui/Badge';
import './Login.css';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await authService.login({
          email: formData.email,
          password: formData.password,
        });
        navigate('/home');
      } else {
        await authService.register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        setError('✓ REGISTRATION SUCCESSFUL! PLEASE LOGIN.');
        setIsLogin(true);
        setFormData({ username: '', email: '', password: '' });
      }
    } catch (err) {
      setError(err.message || 'AN ERROR OCCURRED. PLEASE TRY AGAIN.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ username: '', email: '', password: '' });
    setError('');
  };

  return (
    <div className="login-container">
      {/* Decorative Background Elements */}
      <div className="login-bg-pattern"></div>
      
      {/* Hero Section */}
      <div className="login-hero">
        <div className="login-hero__badge-container">
          <Badge variant="accent" pill rotate className="login-hero__badge">
            💰 FINANCE
          </Badge>
          <Badge variant="secondary" pill className="login-hero__badge -rotate-2">
            ⚡ FAST
          </Badge>
          <Badge variant="muted" pill rotate className="login-hero__badge">
            🔒 SECURE
          </Badge>
        </div>

        <h1 className="login-hero__title">
          <span className="login-hero__title-line rotate-1">EXPENSE</span>
          <span className="login-hero__title-line -rotate-2">TRACKER</span>
        </h1>

        <p className="login-hero__subtitle">
          YOUR MONEY. <span className="highlight-secondary">YOUR RULES.</span>
          <br />
          TRACK IT LIKE A <span className="highlight-accent">PRO</span>.
        </p>

        {/* Decorative Shapes */}
        <div className="login-hero__shape login-hero__shape--1"></div>
        <div className="login-hero__shape login-hero__shape--2"></div>
        <div className="login-hero__shape login-hero__shape--3"></div>
      </div>

      {/* Form Section */}
      <div className="login-form-container">
        <div className="login-form-card">
          <div className="login-form-header">
            <h2 className="login-form-title uppercase">
              {isLogin ? '→ LOGIN' : '→ REGISTER'}
            </h2>
            <p className="login-form-subtitle">
              {isLogin ? 'WELCOME BACK!' : 'CREATE YOUR ACCOUNT'}
            </p>
          </div>

          {error && (
            <div className={`login-message ${error.includes('SUCCESSFUL') ? 'login-message--success' : 'login-message--error'}`}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            {!isLogin && (
              <Input
                label="Username"
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="YOUR AWESOME USERNAME"
                required
                disabled={loading}
                fullWidth
              />
            )}

            <Input
              label="Email"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="YOUR@EMAIL.COM"
              required
              disabled={loading}
              fullWidth
            />

            <Input
              label="Password"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              disabled={loading}
              fullWidth
            />

            <Button 
              type="submit" 
              variant="primary" 
              size="lg"
              fullWidth
              disabled={loading}
            >
              {loading ? 'WAIT...' : isLogin ? '→ LOGIN NOW' : '→ CREATE ACCOUNT'}
            </Button>
          </form>

          <div className="login-form-footer">
            <div className="login-form-divider">
              <span>OR</span>
            </div>
            <Button 
              type="button" 
              onClick={toggleMode} 
              variant="outline"
              fullWidth
              disabled={loading}
            >
              {isLogin ? '← NEED AN ACCOUNT?' : '← ALREADY HAVE ONE?'}
            </Button>
          </div>
        </div>

        {/* Side Decorations */}
        <div className="login-form-decoration">
          <Badge variant="secondary" size="lg" rotate>
            🎯 FREE
          </Badge>
        </div>
      </div>
    </div>
  );
}

export default Login;
