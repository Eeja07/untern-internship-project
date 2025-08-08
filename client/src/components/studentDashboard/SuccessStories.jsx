import React from 'react';

const SuccessStories = () => {
  return (
    <div>
      <h2 style={{ color: '#007bff', marginBottom: '20px' }}>Success Stories</h2>
      <div style={{ display: 'grid', gap: '20px' }}>
        {[1, 2, 3].map((story) => (
          <div key={story} style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: '#007bff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                marginRight: '15px'
              }}>
                {String.fromCharCode(65 + story - 1)}
              </div>
              <div>
                <h4>Mahija Success Story {story}</h4>
                <p style={{ color: '#6c757d', margin: 0 }}>Now at Tech Company</p>
              </div>
            </div>
            <p>
              "My internship experience was incredible. I learned so much and made valuable connections 
              that helped me land my dream job. The platform made it easy to find the perfect opportunity."
            </p>
            <span style={{ color: '#007bff', fontSize: '14px' }}>⭐⭐⭐⭐⭐</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuccessStories;