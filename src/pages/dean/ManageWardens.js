import React, { useState, useEffect } from 'react';
import { authAPI, hostelAPI } from '../../services/api';
import './ManageWardens.css';

function ManageWardens() {
  const [wardens, setWardens] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingWarden, setEditingWarden] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    role: 'warden',
    hostel: '',
    name: '',
    phone_number: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [wardensRes, hostelsRes] = await Promise.all([
        hostelAPI.listWardens(),
        hostelAPI.list()
      ]);
      const wardensData = wardensRes.data?.results || wardensRes.data;
      const hostelsData = hostelsRes.data?.results || hostelsRes.data;
      setWardens(Array.isArray(wardensData) ? wardensData : []);
      setHostels(Array.isArray(hostelsData) ? hostelsData : []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError('Failed to load wardens and hostels. Please refresh the page.');
      setWardens([]);
      setHostels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingWarden) {
        // Update existing warden
        await hostelAPI.updateWardenProfile(editingWarden.id, {
          hostel: formData.hostel,
          name: `${formData.first_name} ${formData.last_name}`,
          phone_number: formData.phone_number,
          email: formData.email,
        });

        // Update user details if changed
        await authAPI.updateWarden(editingWarden.user.id, {
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
        });

        setSuccess('Warden updated successfully!');
      } else {
        // Create user account
        const userResponse = await authAPI.createWarden({
          username: formData.username,
          password: formData.password,
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          role: 'warden'
        });

        // Create warden profile
        await hostelAPI.createWardenProfile({
          user_id: userResponse.data.id,
          hostel: formData.hostel,
          name: `${formData.first_name} ${formData.last_name}`,
          phone_number: formData.phone_number,
          email: formData.email,
        });

        setSuccess('Warden created successfully!');
      }

      setShowModal(false);
      setEditingWarden(null);
      setFormData({
        username: '',
        password: '',
        email: '',
        first_name: '',
        last_name: '',
        role: 'warden',
        hostel: '',
        name: '',
        phone_number: '',
      });
      fetchData();
    } catch (err) {
      console.error('Error saving warden:', err);
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message ||
                          err.response?.data?.details ||
                          err.message ||
                          `Failed to ${editingWarden ? 'update' : 'create'} warden. Please check all required fields.`;
      setError(typeof errorMessage === 'object' ? JSON.stringify(errorMessage, null, 2) : errorMessage);
    }
  };

  const handleResetPassword = async (warden) => {
    const newPassword = prompt(`Enter new password for ${warden.name}:`);
    if (newPassword && newPassword.trim()) {
      try {
        await authAPI.updateWarden(warden.user.id, { password: newPassword });
        setSuccess('Password reset successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        console.error('Error resetting password:', err);
        setError('Failed to reset password');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const handleEdit = (warden) => {
    setEditingWarden(warden);
    const nameParts = warden.name.split(' ');
    setFormData({
      username: warden.user?.username || '',
      password: '',
      email: warden.email,
      first_name: nameParts[0] || '',
      last_name: nameParts.slice(1).join(' ') || '',
      role: 'warden',
      hostel: warden.hostel,
      name: warden.name,
      phone_number: warden.phone_number,
    });
    setShowModal(true);
  };

  const handleDelete = async (warden) => {
    if (window.confirm(`Are you sure you want to delete warden ${warden.name}?`)) {
      try {
        await hostelAPI.deleteWardenProfile(warden.id);
        setSuccess('Warden deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
        fetchData();
      } catch (err) {
        console.error('Error deleting warden:', err);
        setError('Failed to delete warden');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h2>Manage Wardens</h2>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <button onClick={() => {
          setEditingWarden(null);
          setFormData({
            username: '',
            password: '',
            email: '',
            first_name: '',
            last_name: '',
            role: 'warden',
            hostel: '',
            name: '',
            phone_number: '',
          });
          setShowModal(true);
        }} className="btn btn-primary">
          Add New Warden
        </button>

        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Hostel</th>
                <th>Username</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {wardens.map((warden) => (
                <tr key={warden.id}>
                  <td>{warden.name}</td>
                  <td>{warden.email}</td>
                  <td>{warden.phone_number}</td>
                  <td>{warden.hostel_name}</td>
                  <td>{warden.user?.username}</td>
                  <td>
                    <div className="actions-cell">
                      <button 
                        className="btn-edit" 
                        onClick={() => handleEdit(warden)}
                        title="Edit Warden"
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-reset" 
                        onClick={() => handleResetPassword(warden)}
                        title="Reset Password"
                      >
                        Reset
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDelete(warden)}
                        title="Delete Warden"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {wardens.length === 0 && (
          <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            No wardens found. Create one to get started.
          </p>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingWarden ? 'Edit Warden' : 'Create New Warden'}</h2>
              <button className="close-btn" onClick={() => {
                setShowModal(false);
                setEditingWarden(null);
              }}>&times;</button>
            </div>

            <form onSubmit={handleSubmit}>
              {!editingWarden && (
                <>
                  <div className="form-group">
                    <label>Username *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Password *</label>
                    <input
                      type="password"
                      className="form-control"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                      minLength="8"
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  className="form-control"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Hostel *</label>
                <select
                  className="form-control"
                  value={formData.hostel}
                  onChange={(e) => setFormData({...formData, hostel: e.target.value})}
                  required
                >
                  <option value="">Select Hostel</option>
                  {hostels.map((hostel) => (
                    <option key={hostel.id} value={hostel.id}>
                      {hostel.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="action-buttons">
                <button type="submit" className="btn btn-primary">Create Warden</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageWardens;
