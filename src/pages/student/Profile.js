import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await studentAPI.getProfile();
      setProfile(response.data);
    } catch (err) {
      setError('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div>
      <h2>My Profile</h2>

      <div className="card">
        <h3>Personal Information</h3>
        <table style={{ width: '100%', marginTop: '20px' }}>
          <tbody>
            <tr>
              <td style={{ padding: '12px', fontWeight: 'bold', width: '30%' }}>Name:</td>
              <td style={{ padding: '12px' }}>{profile.name}</td>
            </tr>
            <tr>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>Register Number:</td>
              <td style={{ padding: '12px' }}>{profile.register_number}</td>
            </tr>
            <tr>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>Email:</td>
              <td style={{ padding: '12px' }}>{profile.email}</td>
            </tr>
            <tr>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>Phone:</td>
              <td style={{ padding: '12px' }}>{profile.phone_number || 'N/A'}</td>
            </tr>
            <tr>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>Date of Birth:</td>
              <td style={{ padding: '12px' }}>
                {new Date(profile.date_of_birth).toLocaleDateString()}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>Gender:</td>
              <td style={{ padding: '12px' }}>{profile.gender === 'M' ? 'Male' : 'Female'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Academic Information</h3>
        <table style={{ width: '100%', marginTop: '20px' }}>
          <tbody>
            <tr>
              <td style={{ padding: '12px', fontWeight: 'bold', width: '30%' }}>Department:</td>
              <td style={{ padding: '12px' }}>{profile.department_name}</td>
            </tr>
            <tr>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>Degree:</td>
              <td style={{ padding: '12px' }}>{profile.degree}</td>
            </tr>
            <tr>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>Current Year:</td>
              <td style={{ padding: '12px' }}>{profile.year_display}</td>
            </tr>
            <tr>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>Admission Year:</td>
              <td style={{ padding: '12px' }}>{profile.admission_year}</td>
            </tr>
            <tr>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>Graduation Year:</td>
              <td style={{ padding: '12px' }}>{profile.graduation_year}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Hostel Information</h3>
        <table style={{ width: '100%', marginTop: '20px' }}>
          <tbody>
            <tr>
              <td style={{ padding: '12px', fontWeight: 'bold', width: '30%' }}>Hostel:</td>
              <td style={{ padding: '12px' }}>{profile.hostel_name || 'Not Assigned'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Profile;
