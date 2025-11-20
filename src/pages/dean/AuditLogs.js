import React, { useState, useEffect } from 'react';
import { auditAPI } from '../../services/api';

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await auditAPI.getLogs();
      console.log('Audit logs response:', response);
      const data = response.data?.results || response.data;
      console.log('Processed logs data:', data);
      setLogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching logs:', error);
      console.error('Error details:', error.response?.data);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = filter === 'all'
    ? logs
    : logs.filter(log => log.action === filter);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h2>Audit Logs</h2>

      <div className="card">
        <div style={{ marginBottom: '20px' }}>
          <label style={{ marginRight: '10px' }}>Filter by Action:</label>
          <select
            className="form-control"
            style={{ width: 'auto', display: 'inline-block' }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Actions</option>
            <option value="LOGIN">Login</option>
            <option value="LOGOUT">Logout</option>
            <option value="PASSWORD_CHANGE">Password Change</option>
            <option value="CREATE_USER">Create User</option>
            <option value="CREATE_BONAFIDE_REQUEST">Create Bonafide Request</option>
            <option value="WARDEN_APPROVE">Warden Approve</option>
            <option value="WARDEN_REJECT">Warden Reject</option>
            <option value="DEAN_APPROVE">Dean Approve</option>
            <option value="DEAN_REJECT">Dean Reject</option>
            <option value="DOWNLOAD_BONAFIDE">Download Bonafide</option>
            <option value="BULK_STUDENT_UPLOAD">Bulk Student Upload</option>
          </select>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Role</th>
                <th>Action</th>
                <th>Description</th>
                <th>IP Address</th>
              </tr>
            </thead>
          <tbody>
            {filteredLogs.slice(0, 100).map((log) => (
              <tr key={log.id}>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td>{log.username}</td>
                <td>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    backgroundColor: log.user_role === 'dean' ? '#003366' : log.user_role === 'warden' ? '#059669' : '#A4A4A4',
                    color: 'white'
                  }}>
                    {log.user_role}
                  </span>
                </td>
                <td>{log.action_display}</td>
                <td style={{ fontSize: '13px' }}>{log.description}</td>
                <td style={{ fontSize: '12px', color: '#666' }}>{log.ip_address || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {filteredLogs.length === 0 && (
          <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            No audit logs found
          </p>
        )}

        {filteredLogs.length > 100 && (
          <p style={{ textAlign: 'center', padding: '10px', color: '#666', fontSize: '14px' }}>
            Showing first 100 records
          </p>
        )}
      </div>
    </div>
  );
}

export default AuditLogs;
