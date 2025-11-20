import React, { useState, useEffect } from 'react';
import { bonafideAPI } from '../../services/api';

function Settings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await bonafideAPI.getSettings();
      setSettings(response.data);
    } catch (err) {
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await bonafideAPI.updateSettings({ cooldown_period: settings.cooldown_period });
      setSuccess('Settings updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div 
          className="card-header" 
          style={{ 
            background: 'linear-gradient(135deg, #003366 0%, #004080 100%)',
            color: 'white',
            padding: '20px'
          }}
        >
          <h4 style={{ margin: 0, fontWeight: '600' }}>
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              style={{ marginRight: '10px', verticalAlign: 'middle' }}
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6m6-11.66l-5.2 3M7.2 15.34l-5.2 3M6 6l3 5.2m6 3.6l3 5.2m6-6h-6m-6 0H1m17.66-6l-3 5.2M9.34 7.2l-3-5.2"></path>
            </svg>
            Bonafide Request Settings
          </h4>
          <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '14px' }}>
            Configure cooldown period for student reapplications
          </p>
        </div>
        
        <div className="card-body" style={{ padding: '30px' }}>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleUpdate}>
            <div className="mb-4">
              <label className="form-label" style={{ fontWeight: '600', marginBottom: '12px' }}>
                Reapplication Cooldown Period
              </label>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                After a bonafide request is approved, students must wait for this period before they can submit another request.
              </p>
              
              <div className="row g-3">
                {[
                  { value: 'disabled', label: 'Disabled', desc: 'No cooldown - students can reapply anytime', highlight: true },
                  { value: '1_month', label: '1 Month', desc: 'Students can reapply after 30 days' },
                  { value: '3_months', label: '3 Months', desc: 'Students can reapply after 90 days' },
                  { value: '6_months', label: '6 Months', desc: 'Students can reapply after 180 days' },
                  { value: '1_year', label: '1 Year', desc: 'Students can reapply after 365 days' }
                ].map((option) => (
                  <div key={option.value} className="col-md-6">
                    <div 
                      className={`card ${settings?.cooldown_period === option.value ? 'border-primary' : ''}`}
                      style={{ 
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: settings?.cooldown_period === option.value 
                          ? '0 0 0 2px #003366' 
                          : 'none',
                        background: option.highlight && settings?.cooldown_period === option.value
                          ? 'linear-gradient(to bottom right, #e0f2fe, #f0f9ff)'
                          : 'white'
                      }}
                      onClick={() => setSettings({ ...settings, cooldown_period: option.value })}
                    >
                      <div className="card-body" style={{ padding: '15px' }}>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="cooldown_period"
                            id={option.value}
                            value={option.value}
                            checked={settings?.cooldown_period === option.value}
                            onChange={(e) => setSettings({ ...settings, cooldown_period: e.target.value })}
                            style={{ 
                              width: '20px', 
                              height: '20px',
                              marginTop: '2px'
                            }}
                          />
                          <label 
                            className="form-check-label" 
                            htmlFor={option.value}
                            style={{ marginLeft: '10px', cursor: 'pointer' }}
                          >
                            <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>
                              {option.label}
                            </div>
                            <div style={{ fontSize: '13px', color: '#666' }}>
                              {option.desc}
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {settings?.updated_at && (
              <div 
                style={{ 
                  background: '#f8f9fa', 
                  padding: '15px', 
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}
              >
                <div style={{ fontSize: '13px', color: '#666' }}>
                  <strong>Last Updated:</strong> {new Date(settings.updated_at).toLocaleString()}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={saving}
                style={{
                  background: 'linear-gradient(135deg, #003366 0%, #004080 100%)',
                  border: 'none',
                  padding: '10px 24px',
                  fontWeight: '500'
                }}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
              
              {success && (
                <div 
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    background: 'linear-gradient(to right, #d1fae5, #a7f3d0)',
                    border: '1px solid #6ee7b7',
                    borderRadius: '10px',
                    color: '#065f46',
                    fontSize: '14px',
                    fontWeight: '600',
                    animation: 'slideIn 0.3s ease-out',
                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  {success}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="card mt-4" style={{ maxWidth: '800px', margin: '20px auto 0' }}>
        <div className="card-header bg-light">
          <h6 style={{ margin: 0, fontWeight: '600' }}>ℹ️ How It Works</h6>
        </div>
        <div className="card-body">
          <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>
              When a student's bonafide request is <strong>approved by the dean</strong>, a cooldown period begins.
            </li>
            <li style={{ marginBottom: '8px' }}>
              During the cooldown period, students cannot submit new bonafide requests.
            </li>
            <li style={{ marginBottom: '8px' }}>
              Students will see a clear message indicating when they can reapply.
            </li>
            <li>
              This helps manage the frequency of bonafide certificate requests across the system.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Settings;
