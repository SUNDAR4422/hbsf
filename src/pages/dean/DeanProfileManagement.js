import React, { useState, useEffect } from 'react';
import { authAPI } from '../../services/api';
import './DeanProfileManagement.css';

function DeanProfileManagement() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    phone_number: '',
    email: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await authAPI.getDeanProfile();
      setProfile(data);
      setFormData({
        name: data.name || '',
        designation: data.designation || '',
        phone_number: data.phone_number || '',
        email: data.email || ''
      });
      setError('');
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone_number) {
      setError('Name and phone number are required');
      return;
    }

    try {
      setSaving(true);
      setError('');
      const { data } = await authAPI.updateDeanProfile(formData);
      setProfile(data);
      setFormData({
        name: data.name,
        designation: data.designation,
        phone_number: data.phone_number,
        email: data.email
      });
      setSuccess('Profile updated successfully!');
      setEditing(false);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name,
        designation: profile.designation,
        phone_number: profile.phone_number,
        email: profile.email
      });
    }
    setEditing(false);
    setError('');
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="dean-profile-container">
      <div className="page-header">
        <div>
          <h2>Dean Profile</h2>
          <p className="subtitle">Manage your contact details displayed on certificates</p>
        </div>
        {!editing && (
          <button
            className="btn btn-primary"
            onClick={() => setEditing(true)}
          >
            <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit Profile
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-danger">
          <svg className="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <svg className="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          {success}
        </div>
      )}

      <div className="profile-card">
        {!editing ? (
          <div className="profile-view">
            <div className="profile-header">
              <div className="profile-avatar">
                <span>{formData.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="profile-title">
                <h3>{profile?.name || 'Not Set'}</h3>
                <p className="designation">{profile?.designation || 'Not Set'}</p>
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-group">
                <label>Full Name</label>
                <div className="detail-value">
                  <svg className="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>{profile?.name || 'Not Set'}</span>
                </div>
              </div>

              <div className="detail-group">
                <label>Designation</label>
                <div className="detail-value">
                  <svg className="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                  <span>{profile?.designation || 'Not Set'}</span>
                </div>
              </div>

              <div className="detail-group">
                <label>Phone Number</label>
                <div className="detail-value">
                  <svg className="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>{profile?.phone_number || 'Not Set'}</span>
                </div>
              </div>

              <div className="detail-group">
                <label>Email Address</label>
                <div className="detail-value">
                  <svg className="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span>{profile?.email || 'Not Set'}</span>
                </div>
              </div>

              {profile?.updated_at && (
                <div className="detail-group">
                  <label>Last Updated</label>
                  <div className="detail-value">
                    <svg className="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>{new Date(profile.updated_at).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="info-box">
              <svg className="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <p>
                These details will be displayed on all bonafide certificates issued to students. 
                Make sure the information is accurate and professional.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label>
                  Full Name with Title *
                  <span className="help-text">e.g., Dr. M. Saravanakumar, Ph.D.</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  maxLength={200}
                  placeholder="Enter full name with academic title"
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  Designation *
                  <span className="help-text">Your official position</span>
                </label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  required
                  maxLength={200}
                  placeholder="e.g., Dean-Regional Campus (Warden)"
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  Phone Number *
                  <span className="help-text">Official contact number</span>
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required
                  maxLength={15}
                  placeholder="e.g., 0422 2200209"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>
                  Email Address *
                  <span className="help-text">Official email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your.email@annauniv.edu"
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                      <polyline points="17 21 17 13 7 13 7 21"></polyline>
                      <polyline points="7 3 7 8 15 8"></polyline>
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="preview-note">
        <h4>Certificate Preview</h4>
        <p>Your name and designation will appear in the header section of all bonafide certificates as shown:</p>
        <div className="certificate-preview">
          <div className="preview-header">
            <div className="preview-left">
              <strong>{formData.name || 'Your Name'}</strong>
              <div className="preview-designation">{formData.designation || 'Your Designation'}</div>
              <div className="preview-phone">Ph: {formData.phone_number || '0000 0000000'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeanProfileManagement;
