import React, { useState, useEffect } from 'react';
import { bonafideAPI } from '../../services/api';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function AllRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);

  // Audit log filter state
  const [auditAction, setAuditAction] = useState('all');
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await bonafideAPI.getAllRequests();
      const data = response.data?.results || response.data;
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch audit logs for bonafide actions
  const fetchAuditLogs = async () => {
    try {
      const response = await bonafideAPI.getAuditLogs({
        action: auditAction,
        startDate: customStartDate,
        endDate: customEndDate
      });
      setAuditLogs(response.data || []);
    } catch (err) {
      setAuditLogs([]);
    }
  };

  useEffect(() => {
    if (auditAction !== 'all' || (customStartDate && customEndDate)) {
      fetchAuditLogs();
    }
  }, [auditAction, customStartDate, customEndDate]);

  const getStatusBadge = (status) => {
    const map = {
      pending: { class: 'badge-pending', text: 'Pending with Warden' },
      warden_approved: { class: 'badge-pending', text: 'Pending with Dean' },
      warden_rejected: { class: 'badge-rejected', text: 'Rejected by Warden' },
      dean_approved: { class: 'badge-approved', text: 'Approved' },
      dean_rejected: { class: 'badge-rejected', text: 'Rejected by Dean' },
    };
    const info = map[status] || { class: '', text: status };
    return <span className={`badge ${info.class}`}>{info.text}</span>;
  };

  const getStatusText = (status) => {
    const map = {
      pending: 'Pending with Warden',
      warden_approved: 'Pending with Dean',
      warden_rejected: 'Rejected by Warden',
      dean_approved: 'Approved',
      dean_rejected: 'Rejected by Dean',
    };
    return map[status] || status;
  };

  const handleDownload = async (requestId) => {
    try {
      const response = await bonafideAPI.download(requestId);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bonafide_certificate_${requestId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download certificate');
    }
  };

  // Export audit logs (must be inside component to access auditLogs)
  const exportAuditLogs = (type) => {
    if (type === 'xlsx') {
      const ws = XLSX.utils.json_to_sheet(auditLogs);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'AuditLogs');
      XLSX.writeFile(wb, 'audit_logs.xlsx');
    } else if (type === 'pdf') {
      const doc = new jsPDF();
      autoTable(doc, {
        head: [['Action', 'User', 'Date', 'Details']],
        body: auditLogs.map(log => [log.action, log.user, log.date, log.details]),
      });
      doc.save('audit_logs.pdf');
    }
  };

  const getDateFilteredRequests = (requestsList) => {
    if (dateRange === 'all') return requestsList;

    const now = new Date();
    let startDate = new Date();

    switch (dateRange) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '3months':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '6months':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          startDate = new Date(customStartDate);
          const endDate = new Date(customEndDate);
          return requestsList.filter(r => {
            const reqDate = new Date(r.created_at);
            return reqDate >= startDate && reqDate <= endDate;
          });
        }
        return requestsList;
      default:
        return requestsList;
    }

    return requestsList.filter(r => new Date(r.created_at) >= startDate);
  };

  const filteredRequests = getDateFilteredRequests(
    filter === 'all' ? requests : requests.filter(r => r.status === filter)
  );

  const exportToExcel = () => {
    const exportData = filteredRequests.map(request => ({
      'Student Name': request.student_details.name,
      'Register Number': request.student_details.register_number,
      'Department': request.student_details.department_name,
      'Year': request.student_details.current_year,
      'Hostel': request.student_details.hostel_name,
      'Reason': request.reason_display,
      'Status': getStatusText(request.status),
      'Submitted Date': new Date(request.created_at).toLocaleDateString(),
      'Warden Action': request.warden_approved_at ? new Date(request.warden_approved_at).toLocaleDateString() : 'N/A',
      'Dean Action': request.dean_approved_at ? new Date(request.dean_approved_at).toLocaleDateString() : 'N/A',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Bonafide Requests');
    
    // Set column widths
    const wscols = [
      { wch: 25 }, // Student Name
      { wch: 15 }, // Register Number
      { wch: 20 }, // Department
      { wch: 8 },  // Year
      { wch: 20 }, // Hostel
      { wch: 30 }, // Reason
      { wch: 20 }, // Status
      { wch: 15 }, // Submitted Date
      { wch: 15 }, // Warden Action
      { wch: 15 }, // Dean Action
    ];
    ws['!cols'] = wscols;

    const fileName = `Bonafide_Requests_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    setShowExportModal(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4'); // landscape orientation
    
    // Add title
    doc.setFontSize(16);
    doc.text('Bonafide Requests Report', 14, 15);
    
    // Add metadata
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
    doc.text(`Total Records: ${filteredRequests.length}`, 14, 27);
    doc.text(`Filter: ${filter === 'all' ? 'All Statuses' : getStatusText(filter)}`, 14, 32);

    // Prepare table data
    const tableData = filteredRequests.map(request => [
      request.student_details.name,
      request.student_details.register_number,
      request.student_details.department_name,
      request.student_details.current_year,
      request.reason_display,
      getStatusText(request.status),
      new Date(request.created_at).toLocaleDateString(),
    ]);

    // Add table
    autoTable(doc, {
      startY: 37,
      head: [['Student', 'Register No', 'Department', 'Year', 'Reason', 'Status', 'Date']],
      body: tableData,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [0, 51, 102], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 37, left: 14, right: 14 },
    });

    const fileName = `Bonafide_Requests_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    setShowExportModal(false);
  };  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>All Bonafide Requests</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowExportModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Export Report
        </button>
      </div>
      
      <div className="card">
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <label style={{ marginRight: '10px', fontWeight: '500' }}>Status:</label>
            <select
              className="form-control"
              style={{ width: '200px', display: 'inline-block' }}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="pending">Pending with Warden</option>
              <option value="warden_approved">Pending with Dean</option>
              <option value="dean_approved">Approved</option>
              <option value="warden_rejected">Rejected by Warden</option>
              <option value="dean_rejected">Rejected by Dean</option>
            </select>
          </div>

          <div>
            <label style={{ marginRight: '10px', fontWeight: '500' }}>Date Range:</label>
            <select
              className="form-control"
              style={{ width: '150px', display: 'inline-block' }}
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="year">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {dateRange === 'custom' && (
            <>
              <div>
                <label style={{ marginRight: '10px', fontWeight: '500' }}>From:</label>
                <input
                  type="date"
                  className="form-control"
                  style={{ width: '150px', display: 'inline-block' }}
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                />
              </div>
              <div>
                <label style={{ marginRight: '10px', fontWeight: '500' }}>To:</label>
                <input
                  type="date"
                  className="form-control"
                  style={{ width: '150px', display: 'inline-block' }}
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        <div style={{ marginBottom: '15px', padding: '10px', background: '#f5f5f5', borderRadius: '6px' }}>
          <strong>Total Records: </strong>{filteredRequests.length}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Register No</th>
                <th>Department</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.request_id}>
                  <td>{request.student_details.name}</td>
                  <td>{request.student_details.register_number}</td>
                  <td>{request.student_details.department_name}</td>
                  <td>{request.reason_display}</td>
                  <td>{getStatusBadge(request.status)}</td>
                  <td>{new Date(request.created_at).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {request.status === 'dean_approved' && (
                        <button
                          onClick={() => handleDownload(request.request_id)}
                          className="btn btn-success"
                          style={{ padding: '4px 10px', fontSize: '12px' }}
                        >
                          PDF
                        </button>
                      )}
                      {request.attachment && (
                        <a
                          href={request.attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary"
                          style={{ 
                            padding: '4px 10px', 
                            fontSize: '12px',
                            textDecoration: 'none'
                          }}
                        >
                          Attachment
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredRequests.length === 0 && (
          <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            No requests found
          </p>
        )}
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowExportModal(false)}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '30px',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#003366' }}>Export Report</h3>
            <p style={{ marginBottom: '20px', color: '#666' }}>
              Choose the format to export {filteredRequests.length} records
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                className="btn btn-primary"
                onClick={exportToExcel}
                style={{ 
                  width: '100%', 
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  fontSize: '15px',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                Export to Excel (.xlsx)
              </button>
              
              <button
                className="btn btn-primary"
                onClick={exportToPDF}
                style={{ 
                  width: '100%', 
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  fontSize: '15px',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
                Export to PDF
              </button>
              
              <button
                className="btn btn-secondary"
                onClick={() => setShowExportModal(false)}
                style={{ 
                  width: '100%', 
                  padding: '12px',
                  marginTop: '8px',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Log Section */}
      <div className="audit-log-section" style={{ margin: '32px 0' }}>
        <h3>Bonafide Audit Log</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
          <select value={auditAction} onChange={e => setAuditAction(e.target.value)} className="form-control" style={{ width: '200px' }}>
            <option value="all">All Actions</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="downloaded">Downloaded</option>
          </select>
          <input 
            type="date" 
            value={customStartDate} 
            onChange={e => setCustomStartDate(e.target.value)} 
            className="form-control"
            style={{ width: '150px' }}
          />
          <input 
            type="date" 
            value={customEndDate} 
            onChange={e => setCustomEndDate(e.target.value)} 
            className="form-control"
            style={{ width: '150px' }}
          />
          <button onClick={() => exportAuditLogs('pdf')} className="btn btn-primary" style={{ padding: '10px 20px' }}>
            Export PDF
          </button>
          <button onClick={() => exportAuditLogs('xlsx')} className="btn btn-primary" style={{ padding: '10px 20px' }}>
            Export XLSX
          </button>
        </div>
        <table className="audit-log-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '2px solid #003366', padding: '10px', textAlign: 'left' }}>Action</th>
              <th style={{ borderBottom: '2px solid #003366', padding: '10px', textAlign: 'left' }}>User</th>
              <th style={{ borderBottom: '2px solid #003366', padding: '10px', textAlign: 'left' }}>Date</th>
              <th style={{ borderBottom: '2px solid #003366', padding: '10px', textAlign: 'left' }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: '#888', padding: '10px' }}>
                  No audit logs found.
                </td>
              </tr>
            ) : (
              auditLogs.map((log, idx) => (
                <tr key={idx}>
                  <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>{log.action}</td>
                  <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>{log.user}</td>
                  <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>{log.date}</td>
                  <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>{log.details}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}



export default AllRequests;
