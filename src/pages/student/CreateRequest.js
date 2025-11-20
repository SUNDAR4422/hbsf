import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bonafideAPI } from '../../services/api';

function CreateRequest() {
  const [formData, setFormData] = useState({
    reason: 'bank_loan',
    reason_description: '',
  });
  const [attachment, setAttachment] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingPending, setCheckingPending] = useState(true);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [cooldownError, setCooldownError] = useState(null);
  const navigate = useNavigate();

  const reasons = [
    { value: 'bank_loan', label: 'Bank Loan' },
    { value: 'scholarship', label: 'Scholarship' },
    { value: 'passport', label: 'Passport Application' },
    { value: 'visa', label: 'Visa Application' },
    { value: 'identity_proof', label: 'Identity Proof' },
    { value: 'other', label: 'Other' },
  ];

  useEffect(() => {
    checkPendingRequests();
  }, []);

  const checkPendingRequests = async () => {
    try {
      const response = await bonafideAPI.getMyRequests();
      const data = response.data?.results || response.data;
      const requests = Array.isArray(data) ? data : [];
      
      // Check if there's any pending request (not rejected or approved by dean)
      const pending = requests.some(req => 
        req.status === 'pending' || 
        req.status === 'warden_approved'
      );
      
      setHasPendingRequest(pending);
    } catch (err) {
      console.error('Error checking pending requests:', err);
    } finally {
      setCheckingPending(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should not exceed 5MB');
        e.target.value = '';
        return;
      }
      setAttachment(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (hasPendingRequest || loading) {
      setError('You already have a pending request. Please wait for it to be processed.');
      return;
    }

    setError('');
    setSuccess('');
    setCooldownError(null);
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('reason', formData.reason);
      submitData.append('reason_description', formData.reason_description);
      if (attachment) {
        submitData.append('attachment', attachment);
      }

      await bonafideAPI.createRequest(submitData);
      setShowSuccessModal(true);
      setHasPendingRequest(true); // Immediately set to prevent double submission
      setLoading(false);
    } catch (err) {
      console.error('Error creating request:', err);
      
      // Check if it's a cooldown error
      if (err.response?.data?.cooldown) {
        setCooldownError(err.response.data);
        setError('');
      } else if (err.response?.data) {
        // Handle validation errors from Django Rest Framework
        const errorData = err.response.data;
        
        // Check for non_field_errors (general validation errors)
        if (errorData.non_field_errors) {
          const firstError = Array.isArray(errorData.non_field_errors) 
            ? errorData.non_field_errors[0] 
            : errorData.non_field_errors;
          
          // Check if it's a cooldown-related error in non_field_errors
          if (typeof firstError === 'object' && firstError.cooldown) {
            setCooldownError(firstError);
            setError('');
          } else {
            setError(typeof firstError === 'string' ? firstError : 'Failed to submit request. Please try again.');
            setCooldownError(null);
          }
        } else {
          // Handle other error formats
          const errorMessage = errorData.error || 
                              errorData.message ||
                              errorData.detail ||
                              err.message ||
                              'Failed to submit request. Please try again.';
          setError(errorMessage);
          setCooldownError(null);
        }
      } else {
        setError(err.message || 'Failed to submit request. Please try again.');
        setCooldownError(null);
      }
      setLoading(false);
    }
  };

  if (checkingPending) {
    return (
      <div>
        <h2>Apply for Bonafide Certificate</h2>
        <div className="card">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Checking for pending requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>Apply for Bonafide Certificate</h2>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay" onClick={(e) => e.stopPropagation()} style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div className="modal-content" style={{ 
            maxWidth: '420px',
            width: '100%',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            animation: 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            border: 'none',
            background: 'white'
          }}>
            {/* Header Section */}
            <div style={{ 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              padding: '24px 24px 20px',
              textAlign: 'center',
              position: 'relative',
              borderRadius: '24px 24px 0 0'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'white',
                margin: '0 auto 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                animation: 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both'
              }}>
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h2 style={{ 
                margin: 0, 
                fontSize: '22px',
                fontWeight: '800',
                color: 'white',
                letterSpacing: '-0.5px',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}>
                Success!
              </h2>
              <p style={{
                margin: '5px 0 0',
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.95)',
                fontWeight: '500'
              }}>
                Request Submitted
              </p>
            </div>

            {/* Content Section */}
            <div style={{ padding: '32px 24px' }}>
              {/* Success Message Card */}
              <div style={{
                background: 'linear-gradient(to bottom, #ecfdf5, #f0fdf4)',
                border: '2px solid #86efac',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '24px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '80px',
                  height: '80px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '50%',
                  pointerEvents: 'none'
                }}></div>
                <h3 style={{ 
                  color: '#065f46', 
                  marginBottom: '12px',
                  fontSize: '18px',
                  fontWeight: '700',
                  lineHeight: '1.4',
                  position: 'relative'
                }}>
                  Bonafide Certificate Request
                  <br />
                  Submitted Successfully
                </h3>
                <p style={{ 
                  color: '#047857', 
                  margin: 0,
                  fontSize: '14px',
                  lineHeight: '1.6',
                  fontWeight: '500',
                  position: 'relative'
                }}>
                  Your request has been forwarded to your hostel warden for review and approval.
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <button
                  onClick={() => navigate('/student/my-requests')}
                  className="btn btn-primary"
                  style={{ 
                    width: '100%',
                    padding: '18px 24px',
                    fontSize: '16px',
                    fontWeight: '700',
                    borderRadius: '14px',
                    background: '#001f3f',
                    color: '#fff',
                    border: 'none',
                    boxShadow: '0 4px 14px rgba(0, 31, 63, 0.4)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    letterSpacing: '0.2px',
                    textTransform: 'none'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#001a33';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 20px rgba(0, 31, 63, 0.5)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = '#001f3f';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 14px rgba(0, 31, 63, 0.4)';
                  }}
                >
                  View My Requests
                </button>
                <button
                  onClick={() => navigate('/student')}
                  className="btn btn-secondary"
                  style={{ 
                    width: '100%',
                    padding: '18px 24px',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderRadius: '14px',
                    background: 'white',
                    border: '2px solid #e5e7eb',
                    color: '#6b7280',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    letterSpacing: '0.2px',
                    textTransform: 'none'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#f9fafb';
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.color = '#374151';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'white';
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.color = '#6b7280';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        {hasPendingRequest && !showSuccessModal && (
          <div style={{ 
            marginBottom: '24px',
            background: 'linear-gradient(to right, #fef2f2, #fee2e2)',
            border: '2px solid #fca5a5',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.08)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-30px',
              right: '-30px',
              width: '100px',
              height: '100px',
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '50%',
              pointerEvents: 'none'
            }}></div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-start',
              gap: '16px',
              marginBottom: '16px',
              position: 'relative'
            }}>
              <div style={{
                minWidth: '48px',
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  margin: '0 0 8px 0',
                  color: '#991b1b',
                  fontSize: '18px',
                  fontWeight: '700',
                  letterSpacing: '-0.3px'
                }}>
                  Cannot Submit New Request
                </h3>
                <p style={{ 
                  margin: 0,
                  color: '#b91c1c',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  fontWeight: '500'
                }}>
                  You already have a pending bonafide request. Please wait for your current request to be approved or rejected before submitting a new one.
                </p>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/student/my-requests')}
              className="btn btn-primary"
              style={{ 
                width: '100%',
                padding: '14px 20px',
                fontSize: '15px',
                fontWeight: '600',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #003366 0%, #004d99 100%)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0, 51, 102, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                marginTop: '4px'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(0, 51, 102, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 51, 102, 0.3)';
              }}
            >
              View My Requests
            </button>
          </div>
        )}

        {cooldownError && !showSuccessModal && (
          <div style={{ 
            marginBottom: '24px',
            background: 'linear-gradient(to right, #fefce8, #fef3c7)',
            border: '2px solid #fcd34d',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.08)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-30px',
              right: '-30px',
              width: '100px',
              height: '100px',
              background: 'rgba(251, 191, 36, 0.1)',
              borderRadius: '50%',
              pointerEvents: 'none'
            }}></div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-start',
              gap: '16px',
              marginBottom: '16px',
              position: 'relative'
            }}>
              <div style={{
                minWidth: '48px',
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  margin: '0 0 12px 0',
                  color: '#92400e',
                  fontSize: '18px',
                  fontWeight: '700',
                  letterSpacing: '-0.3px'
                }}>
                  Cooldown Period Active
                </h3>
                <p style={{ 
                  margin: '0 0 12px 0',
                  color: '#b45309',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  fontWeight: '500'
                }}>
                  {cooldownError.message}
                </p>
                
                <div style={{
                  background: 'rgba(251, 191, 36, 0.15)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  marginTop: '12px'
                }}>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    fontSize: '13px'
                  }}>
                    <div>
                      <div style={{ color: '#78350f', fontWeight: '600', marginBottom: '4px' }}>
                        Last Approved:
                      </div>
                      <div style={{ color: '#92400e', fontWeight: '700' }}>
                        {new Date(cooldownError.last_approved_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#78350f', fontWeight: '600', marginBottom: '4px' }}>
                        Can Reapply On:
                      </div>
                      <div style={{ color: '#92400e', fontWeight: '700' }}>
                        {new Date(cooldownError.can_reapply_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    marginTop: '12px',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(251, 191, 36, 0.3)',
                    textAlign: 'center'
                  }}>
                    <div style={{ color: '#78350f', fontWeight: '600', fontSize: '12px', marginBottom: '4px' }}>
                      Days Remaining
                    </div>
                    <div style={{ 
                      color: '#92400e', 
                      fontWeight: '800', 
                      fontSize: '24px',
                      lineHeight: '1'
                    }}>
                      {cooldownError.days_remaining}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/student/my-requests')}
              className="btn btn-warning"
              style={{ 
                width: '100%',
                padding: '14px 20px',
                fontSize: '15px',
                fontWeight: '600',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                border: 'none',
                color: 'white',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                marginTop: '4px'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(245, 158, 11, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
              }}
            >
              View My Requests
            </button>
          </div>
        )}

        {error && !hasPendingRequest && !cooldownError && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Reason for Request *</label>
            <select
              name="reason"
              className="form-control"
              value={formData.reason}
              onChange={handleChange}
              required
              disabled={hasPendingRequest || cooldownError}
            >
              {reasons.map((reason) => (
                <option key={reason.value} value={reason.value}>
                  {reason.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="reason_description"
              className="form-control"
              value={formData.reason_description}
              onChange={handleChange}
              rows="4"
              placeholder="Provide additional details about your request (optional)"
              disabled={hasPendingRequest || cooldownError}
            />
          </div>

          <div className="form-group">
            <label>Supporting Document (Optional)</label>
            <input
              type="file"
              className="form-control"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              disabled={hasPendingRequest || cooldownError}
            />
            <small style={{ color: '#666', fontSize: '13px', marginTop: '6px', display: 'block' }}>
              Upload supporting documents if required (PDF, Image, or Word document - Max 5MB)
            </small>
            {attachment && (
              <div style={{
                marginTop: '10px',
                padding: '10px',
                background: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                  <span style={{ color: '#0c4a6e', fontSize: '14px', fontWeight: '500' }}>
                    {attachment.name} ({(attachment.size / 1024).toFixed(2)} KB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAttachment(null);
                    document.querySelector('input[type="file"]').value = '';
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#dc2626',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="action-buttons">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || hasPendingRequest || cooldownError}
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/student')}
            >
              Cancel
            </button>
          </div>
        </form>

        {!hasPendingRequest && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#B3C7E6', borderRadius: '8px', border: '1px solid #003366' }}>
            <p style={{ fontSize: '14px', color: '#003366', margin: 0, fontWeight: '500' }}>
              <strong>Note:</strong> Your request will be forwarded to your hostel warden for approval.
              Once approved by the warden, it will be sent to the Dean for final approval.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateRequest;
