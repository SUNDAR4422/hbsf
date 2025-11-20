import React, { useState, useEffect } from 'react';
import { bonafideAPI } from '../../services/api';

function PendingRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await bonafideAPI.getDeanPendingRequests();
      const data = response.data?.results || response.data;
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (requestId, action) => {
    setSubmitting(true);
    try {
      await bonafideAPI.deanReview(requestId, { action, remarks });
      alert(`Request ${action}d successfully`);
      setSelectedRequest(null);
      setRemarks('');
      fetchRequests();
    } catch (error) {
      alert('Failed to review request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h2>Pending Requests for Final Approval</h2>
      <div className="card">
        {requests.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            No requests pending for approval
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Register No</th>
                  <th>Reason</th>
                  <th>Warden</th>
                  <th>Warden Remarks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.request_id}>
                    <td>{request.student_details.name}</td>
                    <td>{request.student_details.register_number}</td>
                    <td>{request.reason_display}</td>
                    <td>{request.warden_name || 'N/A'}</td>
                    <td>{request.warden_remarks || 'No remarks'}</td>
                    <td>
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="btn btn-primary"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedRequest && (
        <div className="modal-overlay" onClick={() => setSelectedRequest(null)} style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          overflowY: 'auto'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            maxWidth: '650px',
            width: '100%',
            borderRadius: '16px',
            overflow: 'visible',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div className="modal-header" style={{
              background: '#003366',
              padding: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: 'none',
              borderRadius: '16px 16px 0 0'
            }}>
              <h2 style={{ margin: 0, color: 'white', fontSize: '22px', fontWeight: '700' }}>Final Review</h2>
              <button 
                className="close-btn" 
                onClick={() => setSelectedRequest(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: 'white',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  fontSize: '24px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
              >
                ×
              </button>
            </div>
            <div style={{ padding: '24px', overflowY: 'auto', flex: '1' }}>
              <div style={{
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Student</span>
                  <p style={{ margin: '4px 0 0 0', color: '#1e293b', fontSize: '16px', fontWeight: '600' }}>{selectedRequest.student_details.name}</p>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Register Number</span>
                  <p style={{ margin: '4px 0 0 0', color: '#1e293b', fontSize: '15px', fontWeight: '500' }}>{selectedRequest.student_details.register_number}</p>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Department</span>
                  <p style={{ margin: '4px 0 0 0', color: '#1e293b', fontSize: '15px', fontWeight: '500' }}>{selectedRequest.student_details.department_name}</p>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Reason</span>
                  <p style={{ margin: '4px 0 0 0', color: '#1e293b', fontSize: '15px', fontWeight: '500' }}>{selectedRequest.reason_display}</p>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</span>
                  <p style={{ margin: '4px 0 0 0', color: '#1e293b', fontSize: '15px', fontWeight: '500' }}>{selectedRequest.reason_description || 'N/A'}</p>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Warden Remarks</span>
                  <p style={{ margin: '4px 0 0 0', color: '#1e293b', fontSize: '15px', fontWeight: '500', fontStyle: selectedRequest.warden_remarks ? 'normal' : 'italic' }}>{selectedRequest.warden_remarks || 'No remarks'}</p>
                </div>
              </div>
              
              {selectedRequest.attachment && (
                <div style={{
                  marginBottom: '20px',
                  padding: '16px',
                  background: 'linear-gradient(to right, #eff6ff, #dbeafe)',
                  border: '2px solid #93c5fd',
                  borderRadius: '12px'
                }}>
                  <p style={{ margin: '0 0 12px 0', fontWeight: '700', color: '#1e40af', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Supporting Document:
                  </p>
                  <a
                    href={selectedRequest.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 20px',
                      fontSize: '15px',
                      fontWeight: '600',
                      borderRadius: '10px',
                      background: '#003366',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0, 51, 102, 0.3)',
                      transition: 'all 0.3s',
                      textDecoration: 'none'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 16px rgba(0, 51, 102, 0.4)';
                      e.target.style.background = '#004d99';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 12px rgba(0, 51, 102, 0.3)';
                      e.target.style.background = '#003366';
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    View Attachment
                  </a>
                </div>
              )}
              
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: '#334155', 
                  fontSize: '14px', 
                  fontWeight: '600' 
                }}>
                  Dean Remarks (Optional)
                </label>
                <textarea
                  className="form-control"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows="3"
                  placeholder="Enter remarks (optional)"
                  style={{
                    borderRadius: '10px',
                    border: '2px solid #e2e8f0',
                    padding: '12px',
                    fontSize: '14px',
                    transition: 'border-color 0.2s',
                    width: '100%',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div className="action-buttons" style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => handleReview(selectedRequest.request_id, 'approve')}
                  className="btn btn-success"
                  disabled={submitting}
                  style={{
                    padding: '12px 24px',
                    fontSize: '15px',
                    fontWeight: '600',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                    transition: 'all 0.3s',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.6 : 1
                  }}
                  onMouseOver={(e) => {
                    if (!submitting) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                  }}
                >
                  {submitting ? 'Processing...' : 'Approve & Generate Certificate'}
                </button>
                <button
                  onClick={() => handleReview(selectedRequest.request_id, 'reject')}
                  className="btn btn-danger"
                  disabled={submitting}
                  style={{
                    padding: '12px 24px',
                    fontSize: '15px',
                    fontWeight: '600',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
                    transition: 'all 0.3s',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.6 : 1
                  }}
                  onMouseOver={(e) => {
                    if (!submitting) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 16px rgba(220, 38, 38, 0.4)';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
                  }}
                >
                  {submitting ? 'Processing...' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PendingRequests;
