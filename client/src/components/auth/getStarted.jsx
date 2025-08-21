import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const GetStartedModal = ({ isOpen, onClose, onStudentSelect, onCompanySelect }) => {
  const [isMobile, setIsMobile] = useState(false);
  const { isAuthenticated, userType } = useAuth();
  const navigate = useNavigate();

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

  const handleStudentClick = () => {
    // If user is already authenticated as a student, navigate directly to internships
    if (isAuthenticated && userType === 'student') {
      onClose();
      navigate('/student-dashboard/overview');
      return;
    }
    
    // If user is authenticated as company, show message
    if (isAuthenticated && userType === 'company') {
      alert('You are already logged in as a company. Please log out to access student features.');
      return;
    }
    
    // If not authenticated, proceed with student registration/login modal
    onClose(); // Close the get started modal first
    if (onStudentSelect) {
      onStudentSelect(); // This should open the student auth modal
    }
  };

  const handleCompanyClick = () => {
    // If user is already authenticated as a company, navigate directly to company dashboard
    if (isAuthenticated && userType === 'company') {
      onClose();
      navigate('/company-dashboard');
      return;
    }
    
    // If user is authenticated as student, show message
    if (isAuthenticated && userType === 'student') {
      alert('You are already logged in as a student. Please log out to access company features.');
      return;
    }
    
    // If not authenticated, proceed with company registration/login modal
    onClose(); // Close the get started modal first
    if (onCompanySelect) {
      onCompanySelect(); // This should open the company auth modal
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(4px)',
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
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: isMobile ? '2rem 1.5rem' : '3rem 2rem',
        width: isMobile ? 'calc(100% - 2rem)' : '90%',
        maxWidth: isMobile ? 'none' : '450px',
        position: 'relative',
        animation: 'slideUp 0.3s ease-out',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        textAlign: 'center'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Close button */}
        <button style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'none',
          border: 'none',
          fontSize: '1.5rem',
          cursor: 'pointer',
          color: '#666',
          padding: '0.25rem',
          borderRadius: '50%',
          width: '2rem',
          height: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: isMobile ? '1.5rem' : '1.75rem',
            fontWeight: 700,
            color: '#333',
            marginBottom: '0.5rem',
            lineHeight: '1.3'
          }}>
            Get Started
          </h2>
          <p style={{
            color: '#666',
            fontSize: '1rem',
            lineHeight: '1.5'
          }}>
            {isAuthenticated 
              ? `Welcome back! Choose where you'd like to go.`
              : 'Choose your role to continue'
            }
          </p>
        </div>

        {/* Buttons Container */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          {/* Student Button */}
          <button 
            onClick={handleStudentClick}
            style={{
              flex: 1,
              padding: '1rem 1.5rem',
              background: isAuthenticated && userType === 'student' ? '#112D4E' : '#112D4E',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              minHeight: '80px'
            }}
            onMouseEnter={(e) => {
              if (isAuthenticated && userType === 'student') {
                e.target.style.background = '#112D4E';
              }
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              if (isAuthenticated && userType === 'student') {
                e.target.style.background = '#112D4E';
              }
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🎓</span>
            <span>
              {isAuthenticated && userType === 'student' ? 'Go to Dashboard' : 'Student'}
            </span>
          </button>

          {/* Company Button */}
          <button 
            onClick={handleCompanyClick}
            style={{
              flex: 1,
              padding: '1rem 1.5rem',
              background: isAuthenticated && userType === 'company' ? '#112D4E' : '#112D4E',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              minHeight: '80px'
            }}
            onMouseEnter={(e) => {
              if (isAuthenticated && userType === 'company') {
                e.target.style.background = '#112D4E';
              }
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              if (isAuthenticated && userType === 'company') {
                e.target.style.background = '#112D4E';
              }
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🏢</span>
            <span>
              {isAuthenticated && userType === 'company' ? 'Go to Dashboard' : 'Company'}
            </span>
          </button>
        </div>

        {/* Footer text */}
        <p style={{
          color: '#999',
          fontSize: '0.875rem',
          marginTop: '1rem'
        }}>
          {isAuthenticated 
            ? `Logged in as ${userType === 'student' ? 'Student' : 'Company'}`
            : 'Select your role to access the appropriate features'
          }
        </p>
      </div>
    </div>
  );
};

export default GetStartedModal;