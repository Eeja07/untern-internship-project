import React from 'react';

const Newsletter = () => {
  return (
    <div style={{
      textAlign: 'center',
      marginTop: '80px',
      padding: '50px 40px',
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 25px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ 
        fontSize: '2rem', 
        marginBottom: '15px',
        color: '#2c3e50'
      }}>
        Stay Updated
      </h3>
      <p style={{ 
        fontSize: '1.1rem', 
        color: '#6c757d',
        marginBottom: '30px',
        maxWidth: '500px',
        margin: '0 auto 30px'
      }}>
        Subscribe to our newsletter and get the latest internship tips and opportunities delivered to your inbox.
      </p>
      <div style={{
        display: 'flex',
        gap: '15px',
        maxWidth: '400px',
        margin: '0 auto',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <input
          type="email"
          placeholder="Enter your email"
          style={{
            flex: 1,
            minWidth: '250px',
            padding: '12px 16px',
            border: '2px solid #e9ecef',
            borderRadius: '8px',
            fontSize: '1rem'
          }}
        />
        <button
          style={{
            padding: '12px 24px',
            backgroundColor: '#112D4E',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#2563EB'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#112D4E'}
        >
          Subscribe
        </button>
      </div>
    </div>
  );
};

export default Newsletter;