import React, { useState, useEffect } from 'react';
import { authAPI } from './api';

const EmailVerification = ({ email, onVerified, onBack, isMobile }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.verifyEmailCode(email, verificationCode);
      
      if (response.success) {
        setSuccess('Email verified successfully!');
        setTimeout(() => onVerified(), 1000);
      }
    } catch (error) {
      setError(error.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setSuccess('');

    try {
      setResendLoading(true);
      const response = await authAPI.sendVerificationCode(email);
      
      if (response.success) {
        setSuccess('New verification code sent to your email!');
        setCountdown(60); // 60 seconds countdown
        setVerificationCode(''); // Clear current code
      }
    } catch (error) {
      setError(error.message || 'Failed to resend verification code');
    } finally {
      setResendLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6); // Only numbers, max 6 digits
    setVerificationCode(value);
    if (error) setError('');
    if (success) setSuccess('');
  };

  return (
    <div style={{
      textAlign: 'center',
      padding: '1rem'
    }}>
      <div style={{
        marginBottom: '2rem'
      }}>
        <h2 style={{
          color: '#1a1a1a',
          fontSize: isMobile ? '1.5rem' : '1.8rem',
          fontWeight: 600,
          marginBottom: '0.5rem'
        }}>Verify Your Email</h2>
        <p style={{
          color: '#666',
          fontSize: '0.95rem',
          marginBottom: '1rem'
        }}>
          We've sent a 6-digit verification code to:
        </p>
        <p style={{
          color: '#007bff',
          fontWeight: 600,
          fontSize: '1rem'
        }}>{email}</p>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '0.75rem',
          borderRadius: '0.5rem',
          marginBottom: '1rem',
          fontSize: '0.9rem'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          backgroundColor: '#d1fae5',
          border: '1px solid #a7f3d0',
          color: '#065f46',
          padding: '0.75rem',
          borderRadius: '0.5rem',
          marginBottom: '1rem',
          fontSize: '0.9rem'
        }}>
          {success}
        </div>
      )}

      <form onSubmit={handleVerifyCode} style={{ marginBottom: '1.5rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="verificationCode" style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#333',
            fontWeight: 500,
            fontSize: '0.9rem'
          }}>Verification Code</label>
          <input
            type="text"
            id="verificationCode"
            name="verificationCode"
            value={verificationCode}
            onChange={handleInputChange}
            placeholder="Enter 6-digit code"
            maxLength={6}
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.875rem 1rem',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '1.2rem',
              textAlign: 'center',
              letterSpacing: '0.5rem',
              transition: 'border-color 0.2s ease',
              backgroundColor: '#fafafa',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#007bff';
              e.target.style.backgroundColor = 'white';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e1e5e9';
              e.target.style.backgroundColor = '#fafafa';
            }}
          />
        </div>

        <button 
          type="submit"
          disabled={loading || verificationCode.length !== 6}
          style={{
            width: '100%',
            padding: '0.875rem',
            background: (loading || verificationCode.length !== 6) ? '#6c757d' : 'linear-gradient(135deg, #28a745, #20c997)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: (loading || verificationCode.length !== 6) ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            marginBottom: '1rem',
            opacity: (loading || verificationCode.length !== 6) ? 0.7 : 1
          }}
          onMouseEnter={(e) => {
            if (!loading && verificationCode.length === 6) {
              e.target.style.background = 'linear-gradient(135deg, #20c997, #17a2b8)';
              e.target.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading && verificationCode.length === 6) {
              e.target.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
              e.target.style.transform = 'translateY(0)';
            }
          }}
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>

      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '0.75rem',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <button
          type="button"
          onClick={handleResendCode}
          disabled={resendLoading || countdown > 0}
          style={{
            background: 'none',
            border: '2px solid #e1e5e9',
            color: (resendLoading || countdown > 0) ? '#6c757d' : '#007bff',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            fontWeight: 500,
            cursor: (resendLoading || countdown > 0) ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '0.9rem'
          }}
          onMouseEnter={(e) => {
            if (!resendLoading && countdown === 0) {
              e.target.style.backgroundColor = '#f8f9fa';
              e.target.style.borderColor = '#007bff';
            }
          }}
          onMouseLeave={(e) => {
            if (!resendLoading && countdown === 0) {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.borderColor = '#e1e5e9';
            }
          }}
        >
          {resendLoading ? 'Sending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
        </button>

        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          style={{
            background: 'none',
            border: '2px solid #e1e5e9',
            color: loading ? '#6c757d' : '#6c757d',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '0.9rem'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#f8f9fa';
              e.target.style.borderColor = '#6c757d';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.borderColor = '#e1e5e9';
            }
          }}
        >
          Back
        </button>
      </div>

      <p style={{
        color: '#666',
        fontSize: '0.85rem',
        marginTop: '1.5rem'
      }}>
        Didn't receive the email? Check your spam folder or try resending the code.
      </p>
    </div>
  );
};

export default EmailVerification;