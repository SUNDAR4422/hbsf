import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './VerifyCertificate.css';

function VerifyCertificate() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState(code || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (code) {
      verifyCertificate(code);
    }
  }, [code]);

  const verifyCertificate = async (codeToVerify) => {
    if (!codeToVerify) {
      setError('Please enter a verification code');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`http://localhost:8000/api/bonafide/verify/${codeToVerify}/`);
      setResult(response.data);
    } catch (err) {
      console.error('Verification error:', err);
      setError('Failed to verify certificate. Please check the code and try again.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyCertificate(verificationCode);
  };

  return (
    <div className="verify-container">
      <div className="verify-card">
        <div className="verify-header">
          <div className="university-badge">
            <div className="badge-circle">
              <span>AU</span>
            </div>
          </div>
          <h1>Certificate Verification</h1>
          <p className="subtitle">Anna University - Regional Campus Coimbatore</p>
        </div>

        <form onSubmit={handleSubmit} className="verify-form">
          <div className="form-group">
            <label htmlFor="verificationCode">
              <i className="icon">🔍</i> Enter Verification Code
            </label>
            <input
              type="text"
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter the code from certificate QR code"
              className="verify-input"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="verify-button"
            disabled={loading || !verificationCode}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Verifying...
              </>
            ) : (
              <>
                <i className="icon">✓</i>
                Verify Certificate
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="alert alert-error">
            <i className="icon">⚠️</i>
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="verification-result">
            {result.valid ? (
              <div className="result-valid">
                <div className="success-icon">
                  <svg viewBox="0 0 50 50" width="80" height="80">
                    <circle cx="25" cy="25" r="23" fill="none" stroke="#4CAF50" strokeWidth="3"/>
                    <path d="M15 25 L22 32 L35 18" fill="none" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </div>
                <h2 className="result-title">✓ Valid Certificate</h2>
                <p className="result-message">This certificate is authentic and verified.</p>

                <div className="certificate-details">
                  <div className="detail-row">
                    <span className="detail-label">Certificate Number:</span>
                    <span className="detail-value">{result.certificate_number}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Student Name:</span>
                    <span className="detail-value">{result.student_name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Register Number:</span>
                    <span className="detail-value">{result.register_number}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Department:</span>
                    <span className="detail-value">{result.department}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Issued Date:</span>
                    <span className="detail-value">
                      {new Date(result.issued_date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span className={`status-badge status-${result.status}`}>
                      {result.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="result-invalid">
                <div className="error-icon">
                  <svg viewBox="0 0 50 50" width="80" height="80">
                    <circle cx="25" cy="25" r="23" fill="none" stroke="#f44336" strokeWidth="3"/>
                    <path d="M18 18 L32 32 M32 18 L18 32" stroke="#f44336" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </div>
                <h2 className="result-title">✗ Invalid Certificate</h2>
                <p className="result-message">
                  {result.error || 'This certificate could not be verified. It may be fake or the verification code is incorrect.'}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="help-section">
          <h3>How to verify?</h3>
          <ol>
            <li>Scan the QR code on the certificate using your phone camera</li>
            <li>Or manually enter the verification code shown below the QR code</li>
            <li>Click "Verify Certificate" to check authenticity</li>
          </ol>
        </div>

        <div className="footer-links">
          <button onClick={() => navigate('/')} className="link-button">
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerifyCertificate;
