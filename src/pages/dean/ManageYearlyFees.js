import React, { useState, useEffect } from 'react';
import { hostelAPI } from '../../services/api';

function ManageYearlyFees() {
  const [hostels, setHostels] = useState([]);
  const [yearlyFees, setYearlyFees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedHostel, setSelectedHostel] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
  const [formData, setFormData] = useState({
    hostel: '',
    year: 1,
    establishment_fee: '',
    mess_fee: ''
  });

  useEffect(() => {
    fetchHostels();
    fetchYearlyFees();
  }, []);

  const fetchHostels = async () => {
    try {
      const response = await hostelAPI.getHostels();
      setHostels(response.data?.results || response.data || []);
    } catch (error) {
      console.error('Failed to fetch hostels:', error);
    }
  };

  const fetchYearlyFees = async (hostelId = null) => {
    try {
      setLoading(true);
      const response = await hostelAPI.getYearlyFees(hostelId);
      setYearlyFees(response.data?.results || response.data || []);
    } catch (error) {
      console.error('Failed to fetch yearly fees:', error);
      alert('Failed to load yearly fees');
    } finally {
      setLoading(false);
    }
  };

  const handleHostelChange = (e) => {
    const hostelId = e.target.value;
    setSelectedHostel(hostelId);
    if (hostelId) {
      fetchYearlyFees(hostelId);
    } else {
      fetchYearlyFees();
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
        establishment_fee: parseFloat(formData.establishment_fee),
        mess_fee: parseFloat(formData.mess_fee)
      };

      if (editingFee) {
        await hostelAPI.updateYearlyFee(editingFee.id, data);
        alert('Yearly fee updated successfully');
      } else {
        await hostelAPI.createYearlyFee(data);
        alert('Yearly fee created successfully');
      }
      setShowForm(false);
      setEditingFee(null);
      resetForm();
      fetchYearlyFees(selectedHostel || null);
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.response?.data?.detail || 'Failed to save yearly fee';
      alert(errorMsg);
    }
  };

  const handleEdit = (fee) => {
    setEditingFee(fee);
    setFormData({
      hostel: fee.hostel,
      year: fee.year,
      establishment_fee: fee.establishment_fee,
      mess_fee: fee.mess_fee
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this yearly fee record?')) return;
    
    try {
      await hostelAPI.deleteYearlyFee(id);
      alert('Yearly fee deleted successfully');
      fetchYearlyFees(selectedHostel || null);
    } catch (error) {
      alert('Failed to delete yearly fee');
    }
  };

  const resetForm = () => {
    setFormData({
      hostel: '',
      year: 1,
      establishment_fee: '',
      mess_fee: ''
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingFee(null);
    resetForm();
  };

  // Group fees by hostel for better display
  const groupedFees = yearlyFees.reduce((acc, fee) => {
    const hostelName = fee.hostel_name || 'Unknown';
    if (!acc[hostelName]) {
      acc[hostelName] = [];
    }
    acc[hostelName].push(fee);
    return acc;
  }, {});

  return (
    <div>
      <div className="page-header">
        <h2>Manage Yearly Fees</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(true)}
        >
          Add Yearly Fee
        </button>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="form-group">
          <label>Filter by Hostel:</label>
          <select 
            value={selectedHostel} 
            onChange={handleHostelChange}
            className="form-control"
          >
            <option value="">All Hostels</option>
            {hostels.map(hostel => (
              <option key={hostel.id} value={hostel.id}>
                {hostel.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingFee ? 'Edit Yearly Fee' : 'Add Yearly Fee'}</h3>
              <button className="close-btn" onClick={handleCancel}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Hostel *</label>
                <select
                  name="hostel"
                  value={formData.hostel}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                >
                  <option value="">Select Hostel</option>
                  {hostels.map(hostel => (
                    <option key={hostel.id} value={hostel.id}>
                      {hostel.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Year *</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                >
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                  <option value={4}>4th Year</option>
                </select>
              </div>

              <div className="form-group">
                <label>Establishment Fee (₹) *</label>
                <input
                  type="number"
                  name="establishment_fee"
                  value={formData.establishment_fee}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="e.g., 50000.00"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Mess Fee (₹) *</label>
                <input
                  type="number"
                  name="mess_fee"
                  value={formData.mess_fee}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="e.g., 45000.00"
                  className="form-control"
                />
              </div>

              <div className="form-group" style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                <strong>Total Fee: ₹{formData.establishment_fee && formData.mess_fee ? (parseFloat(formData.establishment_fee) + parseFloat(formData.mess_fee)).toFixed(2) : '0.00'}</strong>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingFee ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <h3>Yearly Fees</h3>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : yearlyFees.length === 0 ? (
          <p>No yearly fees found.</p>
        ) : (
          Object.entries(groupedFees).map(([hostelName, fees]) => (
            <div key={hostelName} style={{ marginBottom: '30px' }}>
              <h4 style={{ marginBottom: '15px', color: 'var(--primary-color)' }}>{hostelName}</h4>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Establishment Fee (₹)</th>
                    <th>Mess Fee (₹)</th>
                    <th>Total Fee (₹)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fees
                    .sort((a, b) => a.year - b.year)
                    .map(fee => (
                      <tr key={fee.id}>
                        <td>
                          <span className="badge badge-info">
                            {fee.year === 1 ? '1st' : fee.year === 2 ? '2nd' : fee.year === 3 ? '3rd' : '4th'} Year
                          </span>
                        </td>
                        <td>₹{parseFloat(fee.establishment_fee).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td>₹{parseFloat(fee.mess_fee).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td><strong>₹{parseFloat(fee.total_fee).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                        <td>
                          <button 
                            className="btn btn-sm btn-secondary" 
                            onClick={() => handleEdit(fee)}
                            style={{ marginRight: '5px' }}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-danger" 
                            onClick={() => handleDelete(fee.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ManageYearlyFees;
