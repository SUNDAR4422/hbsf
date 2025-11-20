import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, changePassword } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!user.must_change_password) {
      // Redirect to appropriate dashboard if password change not required
      redirectToDashboard();
    }
  }, [user, navigate]);

  const redirectToDashboard = () => {
    if (!user) return;
    
    switch (user.role) {
      case 'student':
        navigate('/student');
        break;
      case 'warden':
        navigate('/warden');
        break;
      case 'dean':
        navigate('/dean');
        break;
      default:
        navigate('/');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      await changePassword(oldPassword, newPassword, confirmPassword);
      setSuccess('Password changed successfully! Redirecting...');
      
      setTimeout(() => {
        redirectToDashboard();
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.old_password?.[0] ||
        err.response?.data?.new_password?.[0] ||
        'Failed to change password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Change Password</h2>
        <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
          For security reasons, please change your password
        </p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              className="form-control"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength="8"
            />
            <small style={{ color: '#666', fontSize: '12px' }}>
              Must be at least 8 characters long
            </small>
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="8"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>

        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fef3c7', borderRadius: '8px', border: '1px solid #d97706' }}>
          <p style={{ fontSize: '12px', color: '#856404', margin: 0 }}>
            <strong>Password Requirements:</strong>
          </p>
          <ul style={{ fontSize: '12px', color: '#856404', marginTop: '10px', paddingLeft: '20px' }}>
            <li>At least 8 characters long</li>
            <li>Cannot be too similar to your personal information</li>
            <li>Cannot be a commonly used password</li>
            <li>Cannot be entirely numeric</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
