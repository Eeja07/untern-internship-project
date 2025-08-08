import React from 'react';

const TrackApplications = ({ setActiveSection }) => {
  return (
    <div>
      <h2 style={{ color: '#007bff', marginBottom: '20px' }}>Track Your Applications</h2>
      <div style={{
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3>Your Applications</h3>
          <span style={{ 
            background: '#007bff', 
            color: 'white', 
            padding: '5px 15px', 
            borderRadius: '20px',
            fontSize: '14px'
          }}>
            0 Active
          </span>
        </div>
        
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📋</div>
          <h4>No Applications Yet</h4>
          <p style={{ color: '#6c757d', marginBottom: '20px' }}>
            Start applying to internships to track your progress here.
          </p>
          <button 
            onClick={() => setActiveSection('discover')}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Find Internships
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackApplications;