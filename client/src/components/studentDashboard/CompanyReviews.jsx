import React from 'react';

const CompanyReviews = () => {
  return (
    <div>
      <h2 style={{ color: '#007bff', marginBottom: '20px' }}>Company Reviews</h2>
      <div style={{
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
        marginBottom: '20px'
      }}>
        <input 
          type="text" 
          placeholder="Search companies..." 
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </div>
      
      <div style={{ display: 'grid', gap: '20px' }}>
        {['Tech Corp', 'Innovation Labs', 'StartupHub'].map((company, index) => (
          <div key={company} style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4>{company}</h4>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#007bff', marginRight: '10px' }}>
                  ⭐ {(4.2 + index * 0.3).toFixed(1)}
                </span>
                <span style={{ color: '#6c757d' }}>({12 + index * 5} reviews)</span>
              </div>
            </div>
            <p style={{ color: '#6c757d' }}>
              Great company culture with excellent mentorship opportunities. 
              Interns are given meaningful projects and real responsibilities.
            </p>
            <div style={{ marginTop: '10px' }}>
              <span style={{
                background: '#e7f3ff',
                color: '#007bff',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                marginRight: '8px'
              }}>
                Technology
              </span>
              <span style={{
                background: '#e7f3ff',
                color: '#007bff',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px'
              }}>
                Remote Friendly
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyReviews;