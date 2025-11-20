import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bonafideAPI, studentAPI, hostelAPI, studentsAPI } from '../../services/api';

function DeanHome() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pendingApproval: 0,
    totalApproved: 0,
    totalRejected: 0,
    totalStudents: 0,
    totalHostels: 0,
  });
  const [academicYear, setAcademicYear] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [pending, all, students, hostels, academicYearData] = await Promise.all([
        bonafideAPI.getDeanPending(),
        bonafideAPI.getAllRequests(),
        studentAPI.listStudents(),
        hostelAPI.list(),
        studentsAPI.getAcademicYear()
      ]);

      console.log('API Responses:', {
        pending: pending.data,
        all: all.data,
        students: students.data,
        hostels: hostels.data
      });

      setAcademicYear(academicYearData.data);

      // Handle paginated responses (data.results) or direct arrays
      const pendingData = Array.isArray(pending.data?.results) ? pending.data.results : (Array.isArray(pending.data) ? pending.data : []);
      const allData = Array.isArray(all.data?.results) ? all.data.results : (Array.isArray(all.data) ? all.data : []);
      const studentsData = Array.isArray(students.data?.results) ? students.data.results : (Array.isArray(students.data) ? students.data : []);
      const hostelsData = Array.isArray(hostels.data?.results) ? hostels.data.results : (Array.isArray(hostels.data) ? hostels.data : []);

      console.log('Processed data:', {
        pendingCount: pendingData.length,
        allCount: allData.length,
        studentsCount: studentsData.length,
        hostelsCount: hostelsData.length
      });

      setStats({
        pendingApproval: pendingData.length,
        totalApproved: allData.filter(r => r.status === 'dean_approved').length,
        totalRejected: allData.filter(r => r.status === 'dean_rejected').length,
        totalStudents: studentsData.length,
        totalHostels: hostelsData.length,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h2>Dean Dashboard</h2>

      {academicYear && (
        <div style={{ 
          background: 'linear-gradient(135deg, #003366 0%, #004d99 100%)',
          color: 'white',
          padding: '24px 40px',
          borderRadius: '16px',
          marginBottom: '24px',
          boxShadow: '0 8px 24px rgba(0, 51, 102, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '300px',
            height: '300px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px'
            }}>
          
              <h3 style={{ 
                margin: 0, 
                fontSize: '13px', 
                fontWeight: '600', 
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.9)'
              }}>
                Current Academic Year
              </h3>
            </div>
            <p style={{ 
              margin: 0, 
              fontSize: '32px', 
              fontWeight: '800', 
              letterSpacing: '3px',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
            }}>
              {academicYear.display}
            </p>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            padding: '12px 20px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '4px' }}>
              Last Updated
            </div>
            <div style={{ fontSize: '13px', fontWeight: '600' }}>
              {new Date(academicYear.updated_at).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </div>
          </div>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card" onClick={() => navigate('/dean/pending')} style={{ cursor: 'pointer' }}>
          <h3>Pending Approval</h3>
          <p>{stats.pendingApproval}</p>
        </div>

        <div className="stat-card" onClick={() => navigate('/dean/all-requests')} style={{ cursor: 'pointer' }}>
          <h3>Total Approved</h3>
          <p>{stats.totalApproved}</p>
        </div>

        <div className="stat-card" onClick={() => navigate('/dean/all-requests')} style={{ cursor: 'pointer' }}>
          <h3>Total Rejected</h3>
          <p>{stats.totalRejected}</p>
        </div>

        <div className="stat-card" onClick={() => navigate('/dean/manage-students')} style={{ cursor: 'pointer' }}>
          <h3>Total Students</h3>
          <p>{stats.totalStudents}</p>
        </div>

        <div className="stat-card" onClick={() => navigate('/dean/manage-hostels')} style={{ cursor: 'pointer' }}>
          <h3>Total Hostels</h3>
          <p>{stats.totalHostels}</p>
        </div>
      </div>      <div className="card">
        <h3>Management Actions</h3>
        <div className="action-buttons">
          <a href="/dean/pending" className="btn btn-primary">Review Pending Requests</a>
          <a href="/dean/manage-wardens" className="btn btn-primary">Manage Wardens</a>
          <a href="/dean/manage-hostels" className="btn btn-primary">Manage Hostels</a>
          <a href="/dean/bulk-upload" className="btn btn-primary">Upload Students</a>
        </div>
      </div>
    </div>
  );
}

export default DeanHome;
