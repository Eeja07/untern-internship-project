import React from 'react';

const Mission = () => {
  return (
    <div className="mission-section" style={{ padding: '100px 0', backgroundColor: '#DBE2EF' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '3rem auto', padding: '0 20px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '60px', 
          alignItems: 'center' 
        }}>
          <div>
            <h2 style={{ 
              fontSize: '2.5rem', 
              marginBottom: '25px',
              color: '#2c3e50',
              fontWeight: '600'
            }}>
              Our Mission
            </h2>
            <p style={{ 
              fontSize: '1.2rem', 
              lineHeight: '1.8',
              color: '#555',
              marginBottom: '20px'
            }}>
              At Untern, we're passionate about creating pathways for the next generation of professionals. We believe that internships are more than just work experience—they're transformative opportunities that shape careers and drive innovation.
            </p>
            <p style={{ 
              fontSize: '1.2rem', 
              lineHeight: '1.8',
              color: '#555'
            }}>
              Founded in 2025, we've grown from a simple idea to a comprehensive platform that serves thousands of students and companies across Indonesia and beyond.
            </p>
          </div>
          <div style={{
            height: '400px',
            backgroundColor: 'white',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            color: '#6c757d'
          }}>
            Image
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mission;