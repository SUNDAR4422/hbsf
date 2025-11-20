import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import ChangePassword from './pages/ChangePassword';
import StudentDashboard from './pages/student/StudentDashboard';
import WardenDashboard from './pages/warden/WardenDashboard';
import DeanDashboard from './pages/dean/DeanDashboard';
import VerifyCertificate from './pages/public/VerifyCertificate';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/verify/:code" element={<VerifyCertificate />} />
            <Route path="/verify" element={<VerifyCertificate />} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/change-password" element={<ChangePassword />} />
            
            <Route
              path="/student/*"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/warden/*"
              element={
                <ProtectedRoute allowedRoles={['warden']}>
                  <WardenDashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/dean/*"
              element={
                <ProtectedRoute allowedRoles={['dean']}>
                  <DeanDashboard />
                </ProtectedRoute>
              }
            />
            
            <Route path="/unauthorized" element={<div className="container"><h2>Unauthorized Access</h2></div>} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
