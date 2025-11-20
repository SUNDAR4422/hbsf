import React, { useState, useEffect } from 'react';
import api, { studentAPI, studentsAPI, hostelAPI } from '../../services/api';
import './ManageStudents.css';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterHostel, setFilterHostel] = useState('');

  const [formData, setFormData] = useState({
    register_number: '',
    name: '',
    date_of_birth: '',
    email: '',
    password: '',
    department: '',
    year: '',
    gender: '',
    hostel: '',
    admission_year: ''
  });

  useEffect(() => {
    fetchStudents();
    fetchDepartments();
    fetchHostels();
  }, []);

  const fetchStudents = async () => {
    try {
      console.log('Fetching students...');
      const response = await studentAPI.listStudents();
      console.log('Students response:', response);
      console.log('Students data:', response.data);
      // Handle paginated response - extract results array
      const studentsData = response.data?.results || response.data || [];
      console.log('Setting students:', studentsData);
      setStudents(studentsData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching students:', err);
      console.error('Error response:', err.response);
      setError('Failed to fetch students: ' + (err.response?.data?.detail || err.message));
      setStudents([]); // Set empty array on error
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await studentsAPI.getDepartments();
      console.log('Departments response:', response.data);
      // Handle paginated response if needed
      const departmentsData = response.data?.results || response.data || [];
      setDepartments(departmentsData);
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    }
  };

  const fetchHostels = async () => {
    try {
      const response = await hostelAPI.getHostels();
      console.log('Hostels response:', response.data);
      // Handle paginated response if needed
      const hostelsData = response.data?.results || response.data || [];
      setHostels(hostelsData);
    } catch (err) {
      console.error('Failed to fetch hostels:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingStudent) {
        await studentAPI.updateStudent(editingStudent.id, formData);
      } else {
        await studentAPI.createStudent(formData);
      }
      fetchStudents();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save student');
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      register_number: student.register_number,
      name: student.name,
      date_of_birth: student.date_of_birth || '',
      email: student.user?.email || '',
      password: '',
      department: student.department,
      year: student.year,
      gender: student.gender,
      hostel: student.hostel || '',
      admission_year: student.admission_year
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentAPI.deleteStudent(id);
        fetchStudents();
      } catch (err) {
        setError('Failed to delete student');
      }
    }
  };

  const handleResetPassword = async (student) => {
    const newPassword = prompt(`Enter new password for ${student.name}:`);
    if (newPassword && newPassword.trim()) {
      try {
        await studentAPI.updateStudent(student.id, { password: newPassword });
        alert('Password reset successfully!');
      } catch (err) {
        setError('Failed to reset password');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      register_number: '',
      name: '',
      date_of_birth: '',
      email: '',
      password: '',
      department: '',
      year: '',
      gender: '',
      hostel: '',
      admission_year: ''
    });
    setEditingStudent(null);
    setShowForm(false);
  };

  const filteredStudents = Array.isArray(students) ? students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.register_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || student.department === parseInt(filterDepartment);
    const matchesYear = !filterYear || student.current_year === parseInt(filterYear);
    const matchesHostel = !filterHostel || student.hostel === parseInt(filterHostel);
    
    return matchesSearch && matchesDepartment && matchesYear && matchesHostel;
  }) : [];

  const stats = {
    total: Array.isArray(students) ? students.length : 0,
    firstYear: Array.isArray(students) ? students.filter(s => s.current_year === 1).length : 0,
    secondYear: Array.isArray(students) ? students.filter(s => s.current_year === 2).length : 0,
    thirdYear: Array.isArray(students) ? students.filter(s => s.current_year === 3).length : 0,
    fourthYear: Array.isArray(students) ? students.filter(s => s.current_year === 4).length : 0
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="manage-students">
      <div className="page-header">
        <h2>Manage Students</h2>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Add New Student
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Stats */}
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.firstYear}</div>
          <div className="stat-label">First Year</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.secondYear}</div>
          <div className="stat-label">Second Year</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.thirdYear}</div>
          <div className="stat-label">Third Year</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.fourthYear}</div>
          <div className="stat-label">Fourth Year</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <input
          type="text"
          placeholder="Search by name or register number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} className="filter-select">
          <option value="">All Departments</option>
          {Array.isArray(departments) && departments.map(dept => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>

        <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="filter-select">
          <option value="">All Years</option>
          <option value="1">First Year</option>
          <option value="2">Second Year</option>
          <option value="3">Third Year</option>
          <option value="4">Fourth Year</option>
        </select>

        <select value={filterHostel} onChange={(e) => setFilterHostel(e.target.value)} className="filter-select">
          <option value="">All Hostels</option>
          {Array.isArray(hostels) && hostels.map(hostel => (
            <option key={hostel.id} value={hostel.id}>{hostel.name}</option>
          ))}
        </select>
      </div>

      {/* Students Table */}
      <div className="table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>Register No.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Year</th>
              <th>Hostel</th>
              <th>Gender</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr key={student.id}>
                <td>{student.register_number}</td>
                <td className="student-name">{student.name}</td>
                <td>{student.user?.email}</td>
                <td>
                  <span className="dept-badge">{student.department_code}</span>
                </td>
                <td>
                  <span className="year-badge">{student.year_display}</span>
                </td>
                <td>{student.hostel_name || 'N/A'}</td>
                <td>
                  <span className={`gender-badge ${student.gender === 'M' ? 'gender-male' : 'gender-female'}`}>
                    {student.gender === 'M' ? 'Male' : 'Female'}
                  </span>
                </td>
                <td className="actions-cell">
                  <button className="btn-edit" onClick={() => handleEdit(student)}>Edit</button>
                  <button className="btn-reset" onClick={() => handleResetPassword(student)}>Reset</button>
                  <button className="btn-delete" onClick={() => handleDelete(student.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredStudents.length === 0 && (
        <div className="empty-state">
          <div className="icon">📚</div>
          <h3>No students found</h3>
          <p>Try adjusting your filters or add a new student</p>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingStudent ? 'Edit Student' : 'Add New Student'}</h3>
              <button className="close-btn" onClick={resetForm}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="student-form">
              <div className="form-section">
                <h4>Basic Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Register Number *</label>
                    <input
                      type="text"
                      value={formData.register_number}
                      onChange={(e) => setFormData({...formData, register_number: e.target.value})}
                      required
                      disabled={editingStudent}
                    />
                  </div>
                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Date of Birth *</label>
                    <input
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender *</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      disabled={editingStudent}
                    />
                  </div>
                  <div className="form-group">
                    <label>Password {!editingStudent && '*'}</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required={!editingStudent}
                      placeholder={editingStudent ? 'Leave blank to keep current' : ''}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Academic Details</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Department *</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      required
                    >
                      <option value="">Select Department</option>
                      {Array.isArray(departments) && departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Admission Year *</label>
                    <input
                      type="number"
                      value={formData.admission_year}
                      onChange={(e) => setFormData({...formData, admission_year: e.target.value})}
                      required
                      min="2000"
                      max="2100"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Hostel Details</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Hostel</label>
                    <select
                      value={formData.hostel}
                      onChange={(e) => setFormData({...formData, hostel: e.target.value})}
                    >
                      <option value="">Select Hostel</option>
                      {Array.isArray(hostels) && hostels.map(hostel => (
                        <option key={hostel.id} value={hostel.id}>{hostel.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingStudent ? 'Update Student' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;
