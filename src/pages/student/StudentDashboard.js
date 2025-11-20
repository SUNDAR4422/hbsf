import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bonafideAPI } from '../../services/api';
import MyRequests from './MyRequests';
import CreateRequest from './CreateRequest';
import Profile from './Profile';

function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);

  useEffect(() => {
    checkPendingRequests();
  }, []);

  const checkPendingRequests = async () => {
    try {
      const response = await bonafideAPI.getMyRequests();
      const data = response.data?.results || response.data;
      const requests = Array.isArray(data) ? data : [];
      
      const pending = requests.some(req => 
        req.status === 'pending' || 
        req.status === 'warden_approved'
      );
      
      setHasPendingRequest(pending);
    } catch (err) {
      console.error('Error checking pending requests:', err);
    }
  };

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
                <span style={{ background: '#001f3f', color: '#fff', borderRadius: 8, padding: '4px 14px', fontWeight: 600, fontSize: '0.95rem', boxShadow: '0 1px 4px rgba(0,31,63,0.08)' }}>STUDENT PORTAL</span>
              </div>
              <p className="navbar-subtitle" style={{ fontSize: '1rem', color: '#3b3b3b', margin: '4px 0 0 0', fontWeight: 500 }}>Regional Campus Coimbatore - Hostel Bonafide Management System</p>
            </div>
          </div>
          
          <div className="navbar-logout">
            <div className="user-info">
              <span className="user-role">Student</span>
              <span className="user-name">{user?.username}</span>
            </div>
            {/* IMPROVED LOGOUT BUTTON */}
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

      {/* --- MOBILE HEADER (FIXED) --- */}
      <nav className="navbar mobile-header">
        <div className="mobile-header-content">
            
            {/* 1. Hamburger Icon */}
            <div className={`hamburger-icon ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
              <span></span>
              <span></span>
              <span></span>
            </div>

            {/* 2. Logo and Title */}
            <div className="mobile-brand" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src="/anna-university-logo-png.png" alt="Logo" style={{ width: 40, height: 40, borderRadius: 8 }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 700, color: '#001f3f', fontSize: '1rem' }}>Anna University</span>
                    <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: 600 }}>Regional Campus Coimbatore</span>
                </div>
            </div>
        </div>

        {/* 3. Dropdown Menu */}
        {menuOpen && (
          <div className="mobile-dropdown">
             <div className="sidebar-user" style={{ marginBottom: 10, padding: '0 15px' }}>
                  <div className="sidebar-avatar">
                    {(user?.first_name || user?.username)?.charAt(0).toUpperCase()}
                  </div>
                  <div className="sidebar-user-info">
                    <div className="sidebar-user-name">{user?.first_name || user?.username}</div>
                    <div className="sidebar-user-role">Student</div>
                  </div>
              </div>
              
              {/* Mobile Navigation Links */}
              <div className="mobile-nav-links">
                 <Link to="/student" onClick={closeMenu}>Dashboard</Link>
                 <Link to="/student/create-request" onClick={closeMenu}>Apply for Bonafide</Link>
                 <Link to="/student/my-requests" onClick={closeMenu}>My Requests</Link>
                 <Link to="/student/profile" onClick={closeMenu}>Profile</Link>
              </div>

              {/* IMPROVED MOBILE LOGOUT BUTTON */}
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
                <div className="sidebar-user-role">Student</div>
              </div>
            </div>
          </div>
          
          <nav className={menuOpen ? 'open' : ''}>
            <Link to="/student" onClick={closeMenu}>Dashboard</Link>
            <Link to="/student/create-request" onClick={closeMenu}>Apply for Bonafide</Link>
            <Link to="/student/my-requests" onClick={closeMenu}>My Requests</Link>
            <Link to="/student/profile" onClick={closeMenu}>Profile</Link>
            
            <div className="sidebar-nav-footer">
               {/* IMPROVED SIDEBAR LOGOUT BUTTON */}
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
             {/* IMPROVED SIDEBAR FOOTER LOGOUT BUTTON */}
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
            <Route path="/" element={<StudentHome />} />
            <Route path="/create-request" element={<CreateRequest />} />
            <Route path="/my-requests" element={<MyRequests />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>

      <style>{`
        /* --- MODERN LOGOUT BUTTON STYLES --- */
        .btn-logout-modern {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 18px;
            background-color: #fee2e2; /* Soft Red Background */
            color: #dc2626;            /* Deep Red Text */
            border: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            text-decoration: none;
        }

        /* Hover State */
        .btn-logout-modern:hover {
            background-color: #dc2626; /* Solid Red on Hover */
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px -2px rgba(220, 38, 38, 0.3);
        }

        /* Active State */
        .btn-logout-modern:active {
            transform: translateY(0);
        }

        /* Icon Animation */
        .btn-logout-modern svg {
            transition: transform 0.2s ease;
        }
        
        .btn-logout-modern:hover svg {
            transform: translateX(3px); /* Slide icon right */
        }

        /* --- Layout Styles --- */
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
             justify-content: center; /* Center text on mobile */
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

function StudentHome() {
  const { user } = useAuth();
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkPendingRequests();
  }, []);

  const checkPendingRequests = async () => {
    try {
      const response = await bonafideAPI.getMyRequests();
      const data = response.data?.results || response.data;
      const requests = Array.isArray(data) ? data : [];
      
      const pending = requests.some(req => 
        req.status === 'pending' || 
        req.status === 'warden_approved'
      );
      
      setHasPendingRequest(pending);
    } catch (err) {
      console.error('Error checking pending requests:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>

      <div className="card">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <Link to="/student/create-request" className="btn btn-primary">
            Apply for New Bonafide Certificate
          </Link>
          <Link to="/student/my-requests" className="btn btn-secondary">
            View My Requests
          </Link>
        </div>
      </div>

      <div className="card">
        <h3>Important Information</h3>
        <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>You can only have one pending bonafide request at a time</li>
          <li>Bonafide requests are processed through a two-step approval process</li>
          <li>First, your hostel warden will review your request</li>
          <li>If approved by warden, it will be forwarded to the Dean for final approval</li>
          <li>Once approved by Dean, you can download your certificate</li>
          <li>All certificates include a QR code for verification</li>
        </ul>
      </div>
    </div>
  );
}

export default StudentDashboard;