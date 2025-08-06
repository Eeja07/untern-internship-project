import React from 'react';
import { useNavigate } from 'react-router-dom';

const FAQCallToAction = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      textAlign: 'center',
      marginTop: '60px',
      padding: '40px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ 
        fontSize: '1.8rem', 
        marginBottom: '16px',
        color: '#2c3e50'
      }}>
        Still have questions?
      </h3>
      <p style={{ 
        fontSize: '1.1rem', 
        color: '#6c757d',
        marginBottom: '24px'
      }}>
        Can't find the answer you're looking for? Get in touch with our support team.
      </p>
      <button
        onClick={() => window.location.href = 'mailto:mahijapradipta86@gmail.com'}
        style={{
          padding: '14px 28px',
          backgroundColor: '#112D4E',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          cursor: 'pointer',
          fontSize: '1.1rem',
          fontWeight: '500',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#2563EB'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#112D4E'}
      >
        Contact Support
      </button>
    </div>
  );
};

export default FAQCallToAction;