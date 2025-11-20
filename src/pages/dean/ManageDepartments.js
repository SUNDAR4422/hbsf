import React, { useState, useEffect } from 'react';
import { studentsAPI } from '../../services/api';

function ManageDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    course_duration_years: 4
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await studentsAPI.getDepartments();
      // Handle different response structures
      const data = response.data?.results || response.data || [];
      setDepartments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      alert('Failed to load departments');
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        course_duration_years: parseInt(formData.course_duration_years)
      };

      if (editingDept) {
        await studentsAPI.updateDepartment(editingDept.id, data);
        alert('Department updated successfully');
      } else {
        await studentsAPI.createDepartment(data);
        alert('Department created successfully');
      }
      setShowForm(false);
      setEditingDept(null);
      resetForm();
      fetchDepartments();
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.response?.data?.detail || 'Failed to save department';
      alert(errorMsg);
    }
  };

  const handleEdit = (dept) => {
    setEditingDept(dept);
    setFormData({
      code: dept.code,
      name: dept.name,
      course_duration_years: dept.course_duration_years
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department? This may affect existing students.')) return;
    
    try {
      await studentsAPI.deleteDepartment(id);
      alert('Department deleted successfully');
      fetchDepartments();
    } catch (error) {
      alert('Failed to delete department. It may have associated students.');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      course_duration_years: 4
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingDept(null);
    resetForm();
  };

  return (
    <div>
      <div className="page-header">
        <h2>Manage Departments</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(true)}
        >
          Add Department
        </button>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingDept ? 'Edit Department' : 'Add Department'}</h3>
              <button className="close-btn" onClick={handleCancel}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Department Code *</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  required
                  maxLength={10}
                  placeholder="e.g., 106, 104, 160, 633"
                  className="form-control"
                />
                <small>Department code (max 10 characters, e.g., 106, 104)</small>
              </div>

              <div className="form-group">
                <label>Department Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  maxLength={200}
                  placeholder="e.g., Computer Science and Engineering"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Course Duration (Years) *</label>
                <select
                  name="course_duration_years"
                  value={formData.course_duration_years}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                >
                  <option value={2}>2 Years</option>
                  <option value={3}>3 Years</option>
                  <option value={4}>4 Years</option>
                  <option value={5}>5 Years</option>
                </select>
                <small>Duration of the degree program</small>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingDept ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <h3>Departments</h3>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : departments.length === 0 ? (
          <p>No departments found.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map(dept => (
                <tr key={dept.id}>
                  <td>
                    <span className="badge badge-info">{dept.code}</span>
                  </td>
                  <td>{dept.name}</td>
                  <td>{dept.course_duration_years} Year{dept.course_duration_years > 1 ? 's' : ''}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-secondary" 
                      onClick={() => handleEdit(dept)}
                      style={{ marginRight: '5px' }}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-danger" 
                      onClick={() => handleDelete(dept.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ManageDepartments;
