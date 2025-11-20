import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DeanHome from './DeanHome';
import PendingRequests from './PendingRequests';
import AllRequests from './AllRequests';
import ManageWardens from './ManageWardens';
import ManageHostels from './ManageHostels';
import ManageStudents from './ManageStudents';
import BulkUpload from './BulkUpload';
import AuditLogs from './AuditLogs';
import ManageBankAccounts from './ManageBankAccounts';
import ManageDepartments from './ManageDepartments';
import AcademicYearManagement from './AcademicYearManagement';
import DeanProfileManagement from './DeanProfileManagement';
import Settings from './Settings';

function DeanDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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

  // Define menu items in a sorted, logical order for reuse in Mobile & Desktop menus
  const menuItems = [
    { to: "/dean", label: "Dashboard" },
    { to: "/dean/pending", label: "Pending Requests" },
    { to: "/dean/all-requests", label: "All Requests" },
    // Management
    { to: "/dean/manage-students", label: "Manage Students" },
    { to: "/dean/manage-wardens", label: "Manage Wardens" },
    { to: "/dean/manage-hostels", label: "Manage Hostels" },
    { to: "/dean/departments", label: "Departments" },
    // System/Config
    { to: "/dean/academic-year", label: "Academic Year" },
    { to: "/dean/bank-accounts", label: "Bank Accounts" },
    // Data/Admin
    { to: "/dean/bulk-upload", label: "Bulk Upload" },
    { to: "/dean/audit", label: "Audit Logs" },
    // Settings
    { to: "/dean/profile", label: "Dean Profile" },
    { to: "/dean/settings", label: "Settings" },
  ];

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
                <span style={{ background: '#001f3f', color: '#fff', borderRadius: 8, padding: '4px 14px', fontWeight: 600, fontSize: '0.95rem', boxShadow: '0 1px 4px rgba(0,31,63,0.08)' }}>DEAN PORTAL</span>
              </div>
              <p className="navbar-subtitle" style={{ fontSize: '1rem', color: '#3b3b3b', margin: '4px 0 0 0', fontWeight: 500 }}>Regional Campus Coimbatore - Hostel Bonafide Management System</p>
            </div>
          </div>
          
          <div className="navbar-logout">
            <div className="user-info">
              <span className="user-role">Dean</span>
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
                    <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: 600 }}>DEAN PORTAL</span>
                </div>
            </div>
        </div>

        {/* 3. Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="mobile-dropdown">
             <div className="sidebar-user" style={{ marginBottom: 10, padding: '0 15px' }}>
                  <div className="sidebar-avatar">
                    {(user?.first_name || user?.username)?.charAt(0).toUpperCase()}
                  </div>
                  <div className="sidebar-user-info">
                    <div className="sidebar-user-name">{user?.first_name || user?.username}</div>
                    <div className="sidebar-user-role">Dean</div>
                  </div>
              </div>
              
              {/* Mobile Navigation Links (Sorted) */}
              <div className="mobile-nav-links">
                 {menuItems.map((item, index) => (
                   <Link key={index} to={item.to} onClick={closeMenu}>{item.label}</Link>
                 ))}
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
        {/* --- SIDEBAR --- */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-user">
              <div className="sidebar-avatar">
                {(user?.first_name || user?.username)?.charAt(0).toUpperCase()}
              </div>
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">{user?.first_name || user?.username}</div>
                <div className="sidebar-user-role">Dean</div>
              </div>
            </div>
          </div>
          
          <nav className={menuOpen ? 'open' : ''}>
            {/* Render Sorted Menu Items */}
            {menuItems.map((item, index) => (
               <Link key={index} to={item.to} onClick={closeMenu}>{item.label}</Link>
            ))}
            
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
            <Route path="/" element={<DeanHome />} />
            <Route path="/pending" element={<PendingRequests />} />
            <Route path="/all-requests" element={<AllRequests />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/manage-students" element={<ManageStudents />} />
            <Route path="/manage-wardens" element={<ManageWardens />} />
            <Route path="/manage-hostels" element={<ManageHostels />} />
            <Route path="/bank-accounts" element={<ManageBankAccounts />} />
            <Route path="/departments" element={<ManageDepartments />} />
            <Route path="/academic-year" element={<AcademicYearManagement />} />
            <Route path="/profile" element={<DeanProfileManagement />} />
            <Route path="/bulk-upload" element={<BulkUpload />} />
            <Route path="/audit" element={<AuditLogs />} />
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

export default DeanDashboard;