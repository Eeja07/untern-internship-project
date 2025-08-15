import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { authAPI } from './api';
import EmailVerification from './EmailVerification';

const CompanyAuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    companyWebsite: '',
    companySize: '',
    industry: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  const { login, register } = useAuth();

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }

    if (!isLogin) {
      if (!formData.companyName) {
        setError('Company name is required');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      setLoading(true);
      if (isLogin) {
        await login({
          email: formData.email,
          password: formData.password,
          userType: 'company', // Add user type for company login
          expectedUserType: 'company' // Add expected user type validation
        });
        
        // Success - close modal and reset form
        onClose();
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          companyName: '',
          companyWebsite: '',
          companySize: '',
          industry: ''
        });
      } else {
        // For registration, first send verification code
        const response = await authAPI.sendVerificationCode(formData.email);
        if (response.success) {
          setShowEmailVerification(true);
        }
      }
      
    } catch (error) {
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailVerified = async () => {
    try {
      setLoading(true);
      await register({
        email: formData.email,
        password: formData.password,
        company_name: formData.companyName,
        company_website: formData.companyWebsite,
        company_size: formData.companySize,
        industry: formData.industry,
        userType: 'company' // Add user type for company registration
      });

      // Success - close modal and reset form
      onClose();
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        companyName: '',
        companyWebsite: '',
        companySize: '',
        industry: ''
      });
      setShowEmailVerification(false);
      
    } catch (error) {
      setError(error.message || 'Registration failed. Please try again.');
      setShowEmailVerification(false);
    } finally {
      setLoading(false);
    }
  };

  const handleBackFromVerification = () => {
    setShowEmailVerification(false);
    setError('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      companyName: '',
      companyWebsite: '',
      companySize: '',
      industry: ''
    });
    setError('');
    setShowEmailVerification(false);
  };

return (
  <div className="modal-overlay" style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease-out'
  }} onClick={onClose}>
    <style>
      {`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}
    </style>
    <div className="modal-content" style={{
      background: 'white',
      borderRadius: '16px',
      padding: isMobile ? '1.5rem' : '2rem',
      width: isMobile ? 'calc(100% - 2rem)' : '90%',
      maxWidth: isMobile ? 'none' : '420px',
      maxHeight: '90vh',
      overflowY: 'auto',
      position: 'relative',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
      animation: 'slideUp 0.3s ease-out',
      margin: isMobile ? '1rem' : '0'
    }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'none',
          border: 'none',
          fontSize: '2rem',
          cursor: 'pointer',
          color: '#666',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#f5f5f5';
          e.target.style.color = '#333';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'transparent';
          e.target.style.color = '#666';
        }}
        onClick={onClose}>×</button>
        
        {showEmailVerification ? (
          <EmailVerification
            email={formData.email}
            onVerified={handleEmailVerified}
            onBack={handleBackFromVerification}
            isMobile={isMobile}
          />
        ) : (
          <>
        <div className="modal-header" style={{
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            color: '#1a1a1a',
            fontSize: isMobile ? '1.5rem' : '1.8rem',
            fontWeight: 600,
            marginBottom: '0.5rem'
          }}>{isLogin ? 'Company Login' : 'Company Registration'}</h2>
          <p style={{
            color: '#666',
            fontSize: '0.95rem'
          }}>{isLogin ? 'Welcome back to Untern for Companies!' : 'Post internships and find talented students!'}</p>
        </div>

        {error && (
          <div className="error-message" style={{
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

        <form className="auth-form" style={{ marginBottom: '1.5rem' }} onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label htmlFor="companyName" style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#333',
                  fontWeight: 500,
                  fontSize: '0.9rem'
                }}>Company Name</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Enter your company name"
                  required={!isLogin}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '1rem',
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

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label htmlFor="companyWebsite" style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#333',
                  fontWeight: 500,
                  fontSize: '0.9rem'
                }}>Company Website (Optional)</label>
                <input
                  type="url"
                  id="companyWebsite"
                  name="companyWebsite"
                  value={formData.companyWebsite}
                  onChange={handleInputChange}
                  placeholder="https://www.yourcompany.com"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '1rem',
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

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label htmlFor="companySize" style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#333',
                  fontWeight: 500,
                  fontSize: '0.9rem'
                }}>Company Size</label>
                <select
                  id="companySize"
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleInputChange}
                  required={!isLogin}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '1rem',
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
                >
                  <option value="">Select company size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-1000">201-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label htmlFor="industry" style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#333',
                  fontWeight: 500,
                  fontSize: '0.9rem'
                }}>Industry</label>
                <select
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  required={!isLogin}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '1rem',
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
                >
                  <option value="">Select industry</option>
                  <option value="technology">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="retail">Retail</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="consulting">Consulting</option>
                  <option value="media">Media & Entertainment</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="email" style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#333',
              fontWeight: 500,
              fontSize: '0.9rem'
            }}>Company Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your company email"
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '1rem',
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

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="password" style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#333',
              fontWeight: 500,
              fontSize: '0.9rem'
            }}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '1rem',
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

          {!isLogin && (
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="confirmPassword" style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#333',
                fontWeight: 500,
                fontSize: '0.9rem'
              }}>Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                required={!isLogin}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '1rem',
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
          )}

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.875rem',
              background: loading ? '#6c757d' : 'linear-gradient(135deg, #007bff, #0056b3)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              marginTop: '0.5rem',
              opacity: loading ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.background = 'linear-gradient(135deg, #0056b3, #004085)';
                e.target.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.background = 'linear-gradient(135deg, #007bff, #0056b3)';
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >
            {loading ? (isLogin ? 'Logging in...' : 'Registering...') : (isLogin ? 'Login' : 'Register Company')}
          </button>
        </form>

        <div className="auth-toggle" style={{
          textAlign: 'center',
          marginBottom: '1.5rem'
        }}>
          <p style={{
            color: '#666',
            fontSize: '0.9rem'
          }}>
            {isLogin ? "Don't have a company account? " : "Already have a company account? "}
            <button 
              type="button" 
              className="toggle-button" 
              onClick={toggleMode}
              disabled={loading}
              style={{
                background: 'none',
                border: 'none',
                color: '#007bff',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                textDecoration: 'underline',
                fontSize: '0.9rem'
              }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.color = '#0056b3';
              }}
              onMouseLeave={(e) => {
                if (!loading) e.target.style.color = '#007bff';
              }}
            >
              {isLogin ? 'Register Company' : 'Login'}
            </button>
          </p>
        </div>

        <div className="social-auth" style={{
          textAlign: 'center',
          borderTop: '1px solid #e1e5e9',
          paddingTop: '1.5rem'
        }}>
          <p style={{
            color: '#666',
            fontSize: '0.9rem',
            marginBottom: '1rem'
          }}>Or continue with</p>
          <div className="social-buttons" style={{
            display: 'flex',
            gap: isMobile ? '0.5rem' : '0.75rem',
            flexDirection: isMobile ? 'column' : 'row'
          }}>
            <button className="social-btn google" style={{
              flex: 1,
              padding: '0.75rem',
              border: '2px solid #e1e5e9',
              background: 'white',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              color: '#db4437'
            }}
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#f8f9fa';
                e.target.style.borderColor = '#d1d5db';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = 'white';
                e.target.style.borderColor = '#e1e5e9';
              }
            }}>Google</button>
            <button className="social-btn linkedin" style={{
              flex: 1,
              padding: '0.75rem',
              border: '2px solid #e1e5e9',
              background: 'white',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              color: '#0077b5'
            }}
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#f8f9fa';
                e.target.style.borderColor = '#d1d5db';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = 'white';
                e.target.style.borderColor = '#e1e5e9';
              }
            }}>LinkedIn</button>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
};

export default CompanyAuthModal;
