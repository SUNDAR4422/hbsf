import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function CommonLogin() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      redirectToDashboard(user);
    }
  }, [user, navigate]);

  const redirectToDashboard = (userData) => {
    if (userData.must_change_password) {
      navigate('/change-password');
      return;
    }

    switch (userData.role) {
      case 'student':
        navigate('/student');
        break;
      case 'warden':
        navigate('/warden');
        break;
      case 'dean':
        navigate('/dean');
        break;
      case 'admin':
        navigate('/admin');
        break;
      default:
        navigate('/');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(identifier, password);
      redirectToDashboard(data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="common-login-container">
      <div className="login-card">
        
        {/* Header Section */}
        <div className="login-header">
          {/* Enhanced Logo */}
          <img 
            src="/anna-university-logo-png.png" 
            alt="Anna University Logo" 
            className="uni-logo"
          />
          <h1 className="uni-title">Anna University <br />Regional Campus Coimbatore</h1>
          <p className="uni-subtitle">Hostel Bonafide Request System</p>
          <div className="portal-badge">CENTRAL PORTAL</div>
        </div>

        {/* Form Section */}
        <div className="form-body">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="identifier">Register Number</label>
              <input
                id="identifier"
                type="text"
                className="form-control"
                placeholder="Enter Register Number"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="alert-box">
                <span className="alert-icon">!</span>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Secure Login'}
            </button>
          </form>
        </div>

        {/* Footer Section */}
        <div className="login-footer">
          <p>Having trouble? Contact the System Administrator.</p>
        </div>
      </div>

      <style>{`
        /* --- Global Reset & Variables --- */
        :root {
          --primary-blue: #003366;
          --bg-gray: #f4f6f9;
          --text-dark: #1f2937;
          --text-muted: #6b7280;
          --border-color: #e5e7eb;
          --white: #ffffff;
        }

        body {
          margin: 0;
          font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        /* --- Container --- */
        .common-login-container {
          min-height: 100vh;
          background-color: var(--bg-gray);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        /* --- Card Design --- */
        .login-card {
          background: var(--white);
          width: 100%;
          max-width: 450px;
          height: 680px; /* Adjusted height for better spacing */
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-radius: 24px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 
                      0 8px 10px -6px rgba(0, 0, 0, 0.1);
          padding: 40px;
          box-sizing: border-box;
        }

        /* --- Header Styling --- */
        .login-header {
          text-align: center;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Enhanced Logo Styling */
        .uni-logo {
          width: 100px; /* Increased size */
          height: auto;
          margin-bottom: 20px; /* Increased spacing */
          object-fit: contain;
          filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1)); /* Added soft shadow */
          transition: transform 0.3s ease; /* Subtle hover effect */
        }
        
        .uni-logo:hover {
            transform: scale(1.05);
        }

        .uni-title {
          font-size: 1.4rem;
          color: var(--primary-blue);
          font-weight: 700;
          margin: 0 0 5px 0;
          letter-spacing: -0.5px;
          line-height: 1.2;
        }

        .uni-subtitle {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin: 0 0 15px 0;
          font-weight: 500;
        }

        .portal-badge {
          display: inline-block;
          background-color: var(--primary-blue);
          color: var(--white);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 5px 14px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* --- Form Body --- */
        .form-body {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 20px 0;
        }

        /* --- Form Inputs --- */
        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 0.9rem;
          color: var(--text-dark);
          font-weight: 600;
          margin-bottom: 8px;
        }

        .form-control {
          width: 100%;
          padding: 14px;
          font-size: 0.95rem;
          border: 1px solid var(--border-color);
          border-radius: 12px;
          background-color: #fff;
          transition: border-color 0.2s, box-shadow 0.2s;
          color: var(--text-dark);
          box-sizing: border-box;
        }

        .form-control:focus {
          outline: none;
          border-color: var(--primary-blue);
          box-shadow: 0 0 0 4px rgba(0, 51, 102, 0.1);
        }

        /* --- Button --- */
        .btn-primary {
          width: 100%;
          background-color: var(--primary-blue);
          color: var(--white);
          border: none;
          padding: 14px;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 12px;
          cursor: pointer;
          transition: background-color 0.2s;
          margin-top: 10px;
        }

        .btn-primary:hover:not(:disabled) {
          background-color: #002244;
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* --- Error Alert --- */
        .alert-box {
          background-color: #fef2f2;
          border: 1px solid #fca5a5;
          color: #991b1b;
          padding: 12px;
          border-radius: 12px;
          font-size: 0.9rem;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .alert-icon {
          font-weight: bold;
          font-size: 1.1rem;
        }

        /* --- Footer --- */
        .login-footer {
          text-align: center;
          font-size: 0.85rem;
          color: var(--text-muted);
          border-top: 1px solid var(--border-color);
          padding-top: 20px;
        }

        /* --- Mobile Responsiveness --- */
        @media (max-width: 480px) {
          .login-card {
            height: auto;
            min-height: 680px;
            padding: 25px;
            margin: 10px;
          }
          .uni-title {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </div>
  );
}

export default CommonLogin;