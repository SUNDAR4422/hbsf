import React, { useState, useEffect } from 'react';
import { hostelAPI } from '../../services/api';

function ManageHostels() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingHostel, setEditingHostel] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    hostel_type: 'boys',
    capacity: 0,
    mess_fees_per_year: 0,
    establishment_fees_per_year: 0,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      const response = await hostelAPI.getHostels();
      const data = response.data?.results || response.data;
      setHostels(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching hostels:', error);
      setError('Failed to load hostels. Please refresh the page.');
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
      if (editingHostel) {
        await hostelAPI.update(editingHostel.id, formData);
        setSuccess('Hostel updated successfully!');
      } else {
        await hostelAPI.create(formData);
        setSuccess('Hostel created successfully!');
      }
      
      setShowModal(false);
      setEditingHostel(null);
      resetForm();
      fetchHostels();
    } catch (err) {
      console.error('Error creating hostel:', err);
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message ||
                          err.response?.data?.details ||
                          err.message ||
                          'Failed to create hostel. Please check all required fields.';
      setError(typeof errorMessage === 'object' ? JSON.stringify(errorMessage, null, 2) : errorMessage);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      hostel_type: 'boys',
      capacity: 0,
      mess_fees_per_year: 0,
      establishment_fees_per_year: 0,
    });
  };

  const handleEdit = (hostel) => {
    setEditingHostel(hostel);
    setFormData({
      name: hostel.name,
      code: hostel.code,
      hostel_type: hostel.hostel_type,
      capacity: hostel.capacity,
      mess_fees_per_year: hostel.mess_fees_per_year,
      establishment_fees_per_year: hostel.establishment_fees_per_year,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingHostel(null);
    resetForm();
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h2>Manage Hostels</h2>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          Add New Hostel
        </button>

        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Type</th>
                <th>Capacity</th>
                <th>Occupancy</th>
                <th>Mess Fees/Year</th>
                <th>Establishment Fees/Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hostels.map((hostel) => (
                <tr key={hostel.id}>
                  <td>{hostel.code}</td>
                  <td>{hostel.name}</td>
                  <td>{hostel.hostel_type === 'boys' ? 'Boys' : 'Girls'}</td>
                  <td>{hostel.capacity}</td>
                  <td>
                    {hostel.current_occupancy} / {hostel.capacity}
                    {hostel.available_capacity > 0 && (
                      <span style={{ color: 'green', fontSize: '12px', marginLeft: '5px' }}>
                        ({hostel.available_capacity} available)
                      </span>
                    )}
                  </td>
                  <td>₹{hostel.mess_fees_per_year}</td>
                  <td>₹{hostel.establishment_fees_per_year}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(hostel)}
                      className="btn btn-primary"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
        </div>

        {hostels.length === 0 && (
          <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            No hostels found. Create one to get started.
          </p>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingHostel ? 'Edit Hostel' : 'Create New Hostel'}</h2>
              <button className="close-btn" onClick={handleCloseModal}>&times;</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Hostel Code *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  required
                  disabled={!!editingHostel}
                />
              </div>

              <div className="form-group">
                <label>Hostel Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Hostel Type *</label>
                <select
                  className="form-control"
                  value={formData.hostel_type}
                  onChange={(e) => setFormData({...formData, hostel_type: e.target.value})}
                  required
                >
                  <option value="boys">Boys Hostel</option>
                  <option value="girls">Girls Hostel</option>
                </select>
              </div>

              <div className="form-group">
                <label>Capacity *</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                  required
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Mess Fees per Year (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={formData.mess_fees_per_year}
                  onChange={(e) => setFormData({...formData, mess_fees_per_year: parseFloat(e.target.value)})}
                  required
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Establishment Fees per Year (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={formData.establishment_fees_per_year}
                  onChange={(e) => setFormData({...formData, establishment_fees_per_year: parseFloat(e.target.value)})}
                  required
                  min="0"
                />
              </div>

              <div className="action-buttons">
                <button type="submit" className="btn btn-primary">
                  {editingHostel ? 'Update' : 'Create'} Hostel
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
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

export default ManageHostels;
