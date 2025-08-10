import React from 'react';
import { useNavigate } from 'react-router-dom';

const InternshipCertifications = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h2 style={{ color: '#007bff', marginBottom: '20px' }}>Internship Certifications</h2>
      <div style={{
        background: '#f8f9fa',
        padding: '30px',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🏆</div>
        <h3>No Certifications Yet</h3>
        <p style={{ color: '#6c757d', marginBottom: '20px' }}>
          Complete internships to receive official certifications that validate your experience 
          and skills to future employers.
        </p>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          marginBottom: '20px'
        }}>
          <h4>How It Works</h4>
          <div style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
            <div style={{ marginBottom: '15px' }}>
              <strong>1.</strong> Complete your internship program
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>2.</strong> Receive evaluation from your supervisor
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>3.</strong> Get your official certification
            </div>
            <div>
              <strong>4.</strong> Share it on your profile and resume
            </div>
          </div>
        </div>
        <button 
          onClick={() => navigate('/student-dashboard/discover')}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Start Your Journey
        </button>
      </div>
    </div>
  );
};

export default InternshipCertifications;