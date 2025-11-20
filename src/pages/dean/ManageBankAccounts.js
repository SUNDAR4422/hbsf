import React, { useState, useEffect } from 'react';
import { hostelAPI } from '../../services/api';
import './ManageBankAccounts.css';

const ManageBankAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [filterHostel, setFilterHostel] = useState('');

  const [formData, setFormData] = useState({
    hostel: '',
    account_type: 'establishment',
    account_number: '',
    bank_name: '',
    branch_name: '',
    ifsc_code: '',
    account_name: '',
    is_active: true
  });

  useEffect(() => {
    fetchAccounts();
    fetchHostels();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await hostelAPI.getBankAccounts();
      const accountsData = response.data?.results || response.data || [];
      setAccounts(accountsData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching accounts:', err);
      setError('Failed to fetch bank accounts');
      setLoading(false);
    }
  };

  const fetchHostels = async () => {
    try {
      const response = await hostelAPI.getHostels();
      const hostelsData = response.data?.results || response.data || [];
      setHostels(hostelsData);
    } catch (err) {
      console.error('Failed to fetch hostels:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingAccount) {
        await hostelAPI.updateBankAccount(editingAccount.id, formData);
        setSuccess('Bank account updated successfully');
      } else {
        await hostelAPI.createBankAccount(formData);
        setSuccess('Bank account added successfully');
      }
      fetchAccounts();
      resetForm();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Save error:', err.response?.data);
      const errorMsg = err.response?.data?.error || 
                       JSON.stringify(err.response?.data) || 
                       'Failed to save bank account';
      setError(errorMsg);
    }
  };

  const handleEdit = (account) => {
    setEditingAccount(account);
    setFormData({
      hostel: account.hostel,
      account_type: account.account_type || 'establishment',
      account_number: account.account_number,
      bank_name: account.bank_name,
      branch_name: account.branch_name || account.branch,
      ifsc_code: account.ifsc_code,
      account_name: account.account_name || account.account_holder_name,
      is_active: account.is_active
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bank account?')) {
      try {
        await hostelAPI.deleteBankAccount(id);
        setSuccess('Bank account deleted successfully');
        fetchAccounts();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete bank account');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      hostel: '',
      account_type: 'establishment',
      account_number: '',
      bank_name: '',
      branch_name: '',
      ifsc_code: '',
      account_name: '',
      is_active: true
    });
    setEditingAccount(null);
    setShowForm(false);
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesHostel = !filterHostel || account.hostel === parseInt(filterHostel);
    return matchesHostel;
  });

  const stats = {
    total: accounts.length,
    establishment: accounts.filter(a => a.account_type === 'establishment').length,
    maintenance: accounts.filter(a => a.account_type === 'maintenance').length,
    active: accounts.filter(a => a.is_active).length
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="manage-bank-accounts">
      <div className="page-header">
        <div>
          <h2>Bank Accounts Management</h2>
          <p className="page-subtitle">Manage hostel bank accounts for fees collection</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          Add Bank Account
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Filters */}
      <div className="filters-section">
        <select 
          value={filterHostel} 
          onChange={(e) => setFilterHostel(e.target.value)} 
          className="filter-select"
        >
          <option value="">All Hostels</option>
          {hostels.map(hostel => (
            <option key={hostel.id} value={hostel.id}>{hostel.name}</option>
          ))}
        </select>
      </div>

      {/* Accounts Table */}
      <div className="table-container">
        <table className="accounts-table">
          <thead>
            <tr>
              <th>Bank Name</th>
              <th>Branch</th>
              <th>Account Number</th>
              <th>IFSC Code</th>
              <th>Account Holder</th>
              <th>Hostel</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map(account => (
              <tr key={account.id}>
                <td className="bank-name">{account.bank_name}</td>
                <td>{account.branch_name || account.branch}</td>
                <td className="account-number">
                  {'•'.repeat(account.account_number.length - 4) + account.account_number.slice(-4)}
                </td>
                <td className="ifsc-code">{account.ifsc_code}</td>
                <td>{account.account_name || account.account_holder_name}</td>
                <td>{account.hostel_name || 'N/A'}</td>
                <td>
                  <span className={`type-badge ${account.account_type}`}>
                    {account.account_type === 'establishment' ? 'Establishment' : 'Mess'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${account.is_active ? 'active' : 'inactive'}`}>
                    {account.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="actions-cell">
                  <button className="btn-edit" onClick={() => handleEdit(account)}>
                    Edit
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(account.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAccounts.length === 0 && (
        <div className="empty-state">
          <h3>No Bank Accounts Found</h3>
          <p>Add a new bank account to get started</p>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingAccount ? 'Edit Bank Account' : 'Add New Bank Account'}</h3>
              <button className="close-btn" onClick={resetForm}>&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="bank-form">
              <div className="form-section">
                <h4>Account Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Hostel *</label>
                    <select
                      value={formData.hostel}
                      onChange={(e) => setFormData({...formData, hostel: e.target.value})}
                      required
                    >
                      <option value="">Select Hostel</option>
                      {hostels.map(hostel => (
                        <option key={hostel.id} value={hostel.id}>{hostel.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Account Type *</label>
                    <select
                      value={formData.account_type}
                      onChange={(e) => setFormData({...formData, account_type: e.target.value})}
                      required
                    >
                      <option value="establishment">Establishment</option>
                      <option value="mess">Mess</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Bank Name *</label>
                    <input
                      type="text"
                      value={formData.bank_name}
                      onChange={(e) => setFormData({...formData, bank_name: e.target.value})}
                      placeholder="e.g., State Bank of India"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Branch *</label>
                    <input
                      type="text"
                      value={formData.branch_name}
                      onChange={(e) => setFormData({...formData, branch_name: e.target.value})}
                      placeholder="e.g., Anna University Branch"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Account Number *</label>
                    <input
                      type="text"
                      value={formData.account_number}
                      onChange={(e) => setFormData({...formData, account_number: e.target.value})}
                      placeholder="Enter account number"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>IFSC Code *</label>
                    <input
                      type="text"
                      value={formData.ifsc_code}
                      onChange={(e) => setFormData({...formData, ifsc_code: e.target.value.toUpperCase()})}
                      placeholder="e.g., SBIN0001234"
                      required
                      maxLength="11"
                    />
                  </div>
                  <div className="form-group">
                    <label>Account Holder Name *</label>
                    <input
                      type="text"
                      value={formData.account_name}
                      onChange={(e) => setFormData({...formData, account_name: e.target.value})}
                      placeholder="e.g., Anna University Hostel"
                      required
                    />
                  </div>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    />
                    <span>Mark as Active Account</span>
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingAccount ? 'Update Account' : 'Add Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBankAccounts;
