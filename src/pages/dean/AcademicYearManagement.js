import React, { useState, useEffect } from 'react';
import { studentsAPI } from '../../services/api';
import './AcademicYearManagement.css';

function AcademicYearManagement() {
  const [academicYear, setAcademicYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newYear, setNewYear] = useState('');

  useEffect(() => {
    fetchAcademicYear();
  }, []);

  const fetchAcademicYear = async () => {
    try {
      setLoading(true);
      const { data } = await studentsAPI.getAcademicYear();
      setAcademicYear(data);
      setNewYear(data.current_year.toString());
      setError('');
    } catch (err) {
      console.error('Error fetching academic year:', err);
      setError(err.response?.data?.message || 'Failed to load academic year');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!newYear || isNaN(newYear)) {
      setError('Please enter a valid year');
      return;
    }

    const yearNum = parseInt(newYear);
    const currentYear = new Date().getFullYear();
    
    if (yearNum < 2000 || yearNum > currentYear + 10) {
      setError(`Please enter a year between 2000 and ${currentYear + 10}`);
      return;
    }

    try {
      setLoading(true);
      const { data } = await studentsAPI.updateAcademicYear({ current_year: yearNum });
      setAcademicYear({
        current_year: data.current_year,
        display: data.display,
        updated_at: new Date().toISOString()
      });
      setSuccess(`${data.message}. ${data.students_updated} students updated.`);
      setError('');
      setShowForm(false);
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Error updating academic year:', err);
      setError(err.response?.data?.error || 'Failed to update academic year');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    if (academicYear) {
      setNewYear(academicYear.current_year.toString());
    }
    setError('');
  };

  if (loading && !academicYear) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Academic Year Management</h2>
        {academicYear && !showForm && (
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            Update Academic Year
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {academicYear && !showForm && (
        <div className="academic-year-display">
          <div className="card">
            <h3>Current Academic Year</h3>
            <div className="year-info">
              <div className="academic-year-display-badge">{academicYear.display}</div>
              <p className="text-muted">
                Last updated: {new Date(academicYear.updated_at).toLocaleString()}
              </p>
            </div>
            <div className="info-box">
              <p>
                <strong>⚠️ Important:</strong> When you update the academic year, 
                all students' current year will be automatically recalculated based on 
                their admission year.
              </p>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Update Academic Year</h3>
              <button className="close-btn" onClick={handleCancel}>×</button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Academic Year Start *</label>
                <input
                  type="number"
                  value={newYear}
                  onChange={(e) => setNewYear(e.target.value)}
                  required
                  min="2000"
                  max={new Date().getFullYear() + 10}
                  placeholder="e.g., 2024"
                  className="form-control"
                />
                <small>
                  Enter the starting year (e.g., 2024 for academic year 2024-25)
                </small>
              </div>

              <div className="warning-box">
                <strong>⚠️ Warning:</strong>
                <ul>
                  <li>This will update the academic year system-wide</li>
                  <li>All students' current year will be recalculated automatically</li>
                  <li>This action will be logged in the audit trail</li>
                </ul>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Academic Year'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AcademicYearManagement;
