import React, { useState, useEffect } from 'react';
import { bonafideAPI } from '../../services/api';

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await bonafideAPI.getMyRequests();
      const data = response.data?.results || response.data;
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (requestId) => {
    try {
      const response = await bonafideAPI.download(requestId);
      
      // Create blob from response
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Create link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `bonafide_certificate_${requestId}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download certificate');
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { class: 'badge-pending', text: 'Pending with Warden' },
      warden_approved: { class: 'badge-pending', text: 'Approved by Warden (Pending Dean)' },
      warden_rejected: { class: 'badge-rejected', text: 'Rejected by Warden' },
      dean_approved: { class: 'badge-approved', text: 'Approved by Dean' },
      dean_rejected: { class: 'badge-rejected', text: 'Rejected by Dean' },
    };
    
    const statusInfo = statusMap[status] || { class: '', text: status };
    return <span className={`badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <h2>My Bonafide Requests</h2>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        {requests.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
            No requests found. Apply for a bonafide certificate to get started.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Submitted On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.request_id}>
                    <td>{request.request_id.substr(0, 8)}...</td>
                    <td>{request.reason_display}</td>
                    <td>{getStatusBadge(request.status)}</td>
                    <td>{new Date(request.created_at).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {request.status === 'dean_approved' ? (
                          <button
                            onClick={() => handleDownload(request.request_id)}
                            className="btn btn-success"
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                          >
                            Download PDF
                          </button>
                        ) : request.status.includes('rejected') ? (
                          <span style={{ fontSize: '12px', color: '#dc3545' }}>
                            Reason: {request.warden_remarks || request.dean_remarks}
                          </span>
                        ) : (
                          <span style={{ fontSize: '12px', color: '#666' }}>
                            Under Review
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyRequests;
