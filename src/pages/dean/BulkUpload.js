import React, { useState } from 'react';
import { studentAPI } from '../../services/api';

function BulkUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setSuccess('');
    setResults(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');
    setResults(null);

    try {
      const response = await studentAPI.bulkUpload(file);
      setSuccess(response.data.message);
      setResults(response.data);
      setFile(null);
      // Reset file input
      e.target.reset();
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Failed to upload students. Please check the file format and try again.'
      );
      
      if (err.response?.data?.details) {
        setResults({ errors: err.response.data.details });
      }
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    // Create CSV template
    const headers = [
      'register_number',
      'name',
      'date_of_birth',
      'gender',
      'department_code',
      'degree',
      'current_year',
      'admission_year',
      'graduation_year',
      'hostel_code',
      'phone_number',
      'email'
    ];
    
    const sampleData = [
      '710023101010',
      'Jhon Doe',
      '2005-05-15',
      'M',
      'CSE',
      'B.E.',
      '1',
      '2023',
      '2027',
      'BH01',
      '9876543210',
      'jhondoe@example.com'
    ];

    const csvContent = headers.join(',') + '\n' + sampleData.join(',');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'student_upload_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h2>Bulk Upload Students</h2>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        <h3>Upload Excel File</h3>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Upload an Excel file (.xlsx or .xls) containing student information.
        </p>

        <button
          onClick={downloadTemplate}
          className="btn btn-secondary"
          style={{ marginBottom: '20px' }}
        >
          Download CSV Template
        </button>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select File *</label>
            <input
              type="file"
              className="form-control"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              required
            />
            <small style={{ color: '#666', fontSize: '12px' }}>
              Accepted formats: .xlsx, .xls
            </small>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={uploading || !file}
          >
            {uploading ? 'Uploading...' : 'Upload Students'}
          </button>
        </form>

        {results && results.created && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#d1fae5', borderRadius: '8px', border: '1px solid #059669', borderLeft: '4px solid #059669' }}>
            <h4 style={{ color: '#065f46', marginBottom: '10px', fontWeight: '600' }}>Successfully Created:</h4>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              {results.created.map((regNo, idx) => (
                <li key={idx} style={{ color: '#065f46' }}>{regNo}</li>
              ))}
            </ul>
          </div>
        )}

        {results && results.errors && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fee2e2', borderRadius: '8px', border: '1px solid #dc2626', borderLeft: '4px solid #dc2626' }}>
            <h4 style={{ color: '#991b1b', marginBottom: '10px', fontWeight: '600' }}>Errors:</h4>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              {results.errors.map((error, idx) => (
                <li key={idx} style={{ color: '#991b1b', fontSize: '14px' }}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="card">
        <h3>File Format Requirements</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Column Name</th>
                <th>Description</th>
                <th>Example</th>
                <th>Required</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>register_number</td>
                <td>Student's university register number</td>
                <td>710023101010</td>
                <td>Yes</td>
              </tr>
            <tr>
              <td>name</td>
              <td>Full name of the student</td>
              <td>Jhon Doe</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td>date_of_birth</td>
              <td>Date of birth (YYYY-MM-DD or DD/MM/YYYY)</td>
              <td>2005-05-15</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td>gender</td>
              <td>M for Male, F for Female</td>
              <td>M</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td>department_code</td>
              <td>CSE, ECE, EEE, AI&DS, MBA</td>
              <td>CSE</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td>degree</td>
              <td>Degree program</td>
              <td>B.E.</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td>current_year</td>
              <td>Current year (1-4)</td>
              <td>3</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td>admission_year</td>
              <td>Year of admission</td>
              <td>2023</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td>graduation_year</td>
              <td>Expected graduation year</td>
              <td>2027</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td>hostel_code</td>
              <td>Hostel code (optional)</td>
              <td>BH01</td>
              <td>No</td>
            </tr>
            <tr>
              <td>phone_number</td>
              <td>Contact number (optional)</td>
              <td>9876543210</td>
              <td>No</td>
            </tr>
            <tr>
              <td>email</td>
              <td>Email address</td>
              <td>jhondoe@example.com</td>
              <td>Yes</td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>

      <div className="card">
        <h3>Important Notes</h3>
        <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>All register numbers must be unique</li>
          <li>Default password for all students will be their date of birth (YYYY-MM-DD format)</li>
          <li>Students will be required to change their password on first login</li>
          <li>Department codes must match existing departments</li>
          <li>Hostel codes must match existing hostels (if provided)</li>
          <li>Gender-based hostel assignment: Male students → Boys Hostel, Female students → Girls Hostel</li>
          <li>The first row must contain column headers</li>
        </ul>
      </div>
    </div>
  );
}

export default BulkUpload;
