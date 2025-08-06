import React from 'react';

const Story = () => {
  return (
    <div className="story-section" style={{ padding: '80px 0', backgroundColor: '#DBE2EF' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '60px', 
          alignItems: 'center' 
        }}>
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
          <div>
            <h2 style={{ 
              fontSize: '2.5rem', 
              marginBottom: '25px',
              color: '#2c3e50',
              fontWeight: '600'
            }}>
              Our Story
            </h2>
            <p style={{ 
              fontSize: '1.2rem', 
              lineHeight: '1.8',
              color: '#555',
              marginBottom: '20px'
            }}>
              Untern was born from a simple observation: talented students were struggling to find meaningful internship opportunities, while companies were having difficulty connecting with the right candidates.
            </p>
            <p style={{ 
              fontSize: '1.2rem', 
              lineHeight: '1.8',
              color: '#555',
              marginBottom: '20px'
            }}>
              Our founder, Mahija Ibad, experienced this challenge firsthand during their own career journeys. They envisioned a platform that would democratize access to internships and create win-win scenarios for both students and companies.
            </p>
            <p style={{ 
              fontSize: '1.2rem', 
              lineHeight: '1.8',
              color: '#555'
            }}>
              Today, we're proud to be Indonesia's leading internship platform, continuously innovating to serve our growing community better.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Story;