import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bonafideAPI, auditAPI } from '../../services/api';

function WardenDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div>
      {/* --- DESKTOP HEADER --- */}
      <nav className="navbar desktop-header">
        <div className="navbar-content">
          <div className="navbar-header">
            <div className="navbar-logo">
              <img src="/anna-university-logo-png.png" alt="Anna University Logo" style={{ width: 56, height: 56, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,31,63,0.08)' }} />
            </div>
            <div className="navbar-title" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: 16 }}>
              <div className="navbar-title-main" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#001f3f', margin: 0 }}>Anna University</h1>
                <span style={{ background: '#001f3f', color: '#fff', borderRadius: 8, padding: '4px 14px', fontWeight: 600, fontSize: '0.95rem', boxShadow: '0 1px 4px rgba(0,31,63,0.08)' }}>WARDEN PORTAL</span>
              </div>
              <p className="navbar-subtitle" style={{ fontSize: '1rem', color: '#3b3b3b', margin: '4px 0 0 0', fontWeight: 500 }}>Regional Campus Coimbatore - Hostel Bonafide Management System</p>
            </div>
          </div>
          <div className="navbar-logout">
            <div className="user-info">
              <span className="user-role">Warden</span>
              <span className="user-name">{user?.username}</span>
            </div>
            <button onClick={handleLogout} className="btn-logout-modern">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* --- MOBILE HEADER --- */}
      <nav className="navbar mobile-header">
        <div className="mobile-header-content">
            {/* Hamburger Icon */}
            <div className={`hamburger-icon ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
              <span></span>
              <span></span>
              <span></span>
            </div>

            {/* Logo and Title */}
            <div className="mobile-brand" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src="/anna-university-logo-png.png" alt="Logo" style={{ width: 40, height: 40, borderRadius: 8 }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 700, color: '#001f3f', fontSize: '1rem' }}>Anna University</span>
                    <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: 600 }}>Regional Campus Coimbatore</span>
                </div>
            </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="mobile-dropdown">
             <div className="sidebar-user" style={{ marginBottom: 10, padding: '0 15px' }}>
                  <div className="sidebar-avatar">
                    {(user?.first_name || user?.username)?.charAt(0).toUpperCase()}
                  </div>
                  <div className="sidebar-user-info">
                    <div className="sidebar-user-name">{user?.first_name || user?.username}</div>
                    <div className="sidebar-user-role">Warden</div>
                  </div>
              </div>
              
              <div className="mobile-nav-links">
                 <Link to="/warden" onClick={closeMenu}>Dashboard</Link>
                 <Link to="/warden/pending" onClick={closeMenu}>Pending Requests</Link>
                 <Link to="/warden/all" onClick={closeMenu}>All Requests</Link>
                 <Link to="/warden/audit" onClick={closeMenu}>Audit Logs</Link>
              </div>

              <button className="mobile-logout-btn btn-logout-modern" onClick={(e) => { e.stopPropagation(); handleLogout(); }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Logout</span>
              </button>
          </div>
        )}
      </nav>

      <div className="dashboard-container">
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-user">
              <div className="sidebar-avatar">
                {(user?.first_name || user?.username)?.charAt(0).toUpperCase()}
              </div>
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">{user?.first_name || user?.username}</div>
                <div className="sidebar-user-role">Warden</div>
              </div>
            </div>
          </div>
          
          {/* Note: Hamburger menu removed from here as it's now in the mobile header */}
          
          <nav className={menuOpen ? 'open' : ''}>
            <Link to="/warden" onClick={closeMenu}>Dashboard</Link>
            <Link to="/warden/pending" onClick={closeMenu}>Pending Requests</Link>
            <Link to="/warden/all" onClick={closeMenu}>All Requests</Link>
            <Link to="/warden/audit" onClick={closeMenu}>Audit Logs</Link>
            
            <div className="sidebar-nav-footer">
              <button onClick={handleLogout} className="btn-logout-modern" style={{ width: '100%', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </nav>
          
          <div className="sidebar-footer">
             <button onClick={handleLogout} className="btn-logout-modern" style={{ width: '100%', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Logout</span>
            </button>
          </div>
        </aside>

        <main className="dashboard-content">
          <Routes>
            <Route path="/" element={<WardenHome />} />
            <Route path="/pending" element={<PendingRequests />} />
            <Route path="/all" element={<AllRequests />} />
            <Route path="/audit" element={<AuditLogs />} />
          </Routes>
        </main>
      </div>

      <style>{`
        /* --- MODERN LOGOUT BUTTON --- */
        .btn-logout-modern {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 18px;
            background-color: #fee2e2;
            color: #dc2626;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            text-decoration: none;
        }
        .btn-logout-modern:hover {
            background-color: #dc2626;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px -2px rgba(220, 38, 38, 0.3);
        }
        .btn-logout-modern:active { transform: translateY(0); }
        .btn-logout-modern svg { transition: transform 0.2s ease; }
        .btn-logout-modern:hover svg { transform: translateX(3px); }

        /* --- HEADER VISIBILITY --- */
        .desktop-header { display: block; }
        .mobile-header { display: none; }

        @media (max-width: 600px) {
          .desktop-header { display: none !important; }
          .mobile-header { 
            display: block !important; 
            background: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            position: sticky;
            top: 0;
            z-index: 1000;
          }

          .mobile-header-content {
            display: flex;
            align-items: center;
            padding: 15px;
            gap: 15px;
          }

          .hamburger-icon {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 24px;
            height: 18px;
            cursor: pointer;
          }

          .hamburger-icon span {
            display: block;
            height: 2px;
            width: 100%;
            background: #001f3f;
            border-radius: 2px;
            transition: all 0.3s ease;
          }

          .mobile-dropdown {
            background: white;
            border-top: 1px solid #eee;
            padding: 20px 0;
            animation: slideDown 0.3s ease-out;
          }

          .mobile-nav-links {
            display: flex;
            flex-direction: column;
            margin-bottom: 15px;
          }

          .mobile-nav-links a {
            padding: 12px 20px;
            color: #333;
            text-decoration: none;
            border-left: 3px solid transparent;
          }

          .mobile-nav-links a:hover {
            background: #f8f9fa;
            border-left-color: #001f3f;
            color: #001f3f;
          }

          .mobile-logout-btn {
             margin: 0 20px;
             width: calc(100% - 40px);
             justify-content: center;
          }

          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .sidebar { display: none; }
          .dashboard-content { margin-left: 0; padding: 15px; }
        }
      `}</style>
    </div>
  );
}

function WardenHome() {
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [pending, all] = await Promise.all([
        bonafideAPI.getWardenPending(),
        bonafideAPI.getAllRequests()
      ]);

      const pendingData = pending.data?.results || pending.data;
      const allData = all.data?.results || all.data;

      setStats({
        pending: Array.isArray(pendingData) ? pendingData.length : 0,
        approved: Array.isArray(allData) ? allData.filter(r => r.status === 'warden_approved' || r.status === 'dean_approved').length : 0,
        rejected: Array.isArray(allData) ? allData.filter(r => r.status === 'warden_rejected').length : 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h2>Warden Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/warden/pending')}>
          <h3>Pending Requests</h3>
          <p>{stats.pending}</p>
        </div>
        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/warden/all')}>
          <h3>Approved</h3>
          <p>{stats.approved}</p>
        </div>
        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/warden/all')}>
          <h3>Rejected</h3>
          <p>{stats.rejected}</p>
        </div>
      </div>
      <div className="card">
        <h3>Quick Actions</h3>
        <Link to="/warden/pending" className="btn btn-primary">Review Pending Requests</Link>
      </div>
    </div>
  );
}

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
      const response = await bonafideAPI.getWardenPendingRequests();
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
    if (action === 'reject' && !remarks.trim()) {
      alert('Please provide remarks for rejection');
      return;
    }

    setSubmitting(true);
    try {
      await bonafideAPI.wardenReview(requestId, { action, remarks });
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
      <h2>Pending Requests</h2>
      <div className="card">
        {requests.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>No pending requests</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Register No</th>
                  <th>Reason</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.request_id}>
                    <td>{request.student_details.name}</td>
                    <td>{request.student_details.register_number}</td>
                    <td>{request.reason_display}</td>
                    <td>{new Date(request.created_at).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => setSelectedRequest(request)} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>
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
            maxWidth: '600px',
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
              <h2 style={{ margin: 0, color: 'white', fontSize: '22px', fontWeight: '700' }}>Review Request</h2>
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
                  <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Reason</span>
                  <p style={{ margin: '4px 0 0 0', color: '#1e293b', fontSize: '15px', fontWeight: '500' }}>{selectedRequest.reason_display}</p>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</span>
                  <p style={{ margin: '4px 0 0 0', color: '#1e293b', fontSize: '15px', fontWeight: '500' }}>{selectedRequest.reason_description || 'N/A'}</p>
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
                  Remarks {remarks.length > 0 && <span style={{ color: '#64748b', fontWeight: '500' }}>({remarks.length} characters)</span>}
                </label>
                <textarea 
                  className="form-control" 
                  value={remarks} 
                  onChange={(e) => setRemarks(e.target.value)} 
                  rows="4" 
                  placeholder="Enter remarks (required for rejection)" 
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
                    padding: '12px 28px',
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
                  {submitting ? 'Processing...' : 'Approve'}
                </button>
                <button 
                  onClick={() => handleReview(selectedRequest.request_id, 'reject')} 
                  className="btn btn-danger" 
                  disabled={submitting}
                  style={{
                    padding: '12px 28px',
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

function AllRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await bonafideAPI.getAllRequests();
      const data = response.data?.results || response.data;
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      pending: { class: 'badge-pending', text: 'Pending' },
      warden_approved: { class: 'badge-approved', text: 'Approved by Warden' },
      warden_rejected: { class: 'badge-rejected', text: 'Rejected' },
      dean_approved: { class: 'badge-approved', text: 'Approved by Dean' },
      dean_rejected: { class: 'badge-rejected', text: 'Rejected by Dean' },
    };
    const info = map[status] || { class: '', text: status };
    return <span className={`badge ${info.class}`}>{info.text}</span>;
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h2>All Requests</h2>
      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.request_id}>
                  <td>{request.student_details.name}</td>
                  <td>{request.reason_display}</td>
                  <td>{getStatusBadge(request.status)}</td>
                  <td>{new Date(request.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await auditAPI.getLogs();
      const data = response.data?.results || response.data;
      setLogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h2>Audit Logs</h2>
      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Action</th>
                <th>Description</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.slice(0, 50).map((log) => (
                <tr key={log.id}>
                  <td>{log.username}</td>
                  <td>{log.action_display}</td>
                  <td>{log.description}</td>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default WardenDashboard;