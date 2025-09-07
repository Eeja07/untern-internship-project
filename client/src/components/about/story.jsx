import React, { useState, useEffect } from 'react';
import picRealExp1 from "../../assets/realExp1.webp";

const Mission = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024 && window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth <= 1024 && window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <div className="mission-section" style={{ padding: isMobile ? '60px 0' : '120px 0', backgroundColor: '#DBE2EF' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '0 15px' : '0 20px' }}>
        <h2 style={{ 
              fontSize: isMobile ? '1.8rem' : isTablet ? '2.2rem' : '2.5rem', 
              marginBottom: '3rem',
              color: '#2c3e50',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              Company Profile 
        </h2>
        <div style={{
          height: isMobile ? '250px' : isTablet ? '350px' : '450px',
          backgroundColor: 'white',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          marginBottom: isMobile ? '30px' : '60px'
        }}>
          <img 
            src={picRealExp1}
            alt="Company Profile" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center' 
        }}>
          <div>
            <p style={{ 
              fontSize: isMobile ? '1rem' : isTablet ? '1.1rem' : '1.2rem', 
              lineHeight: '1.8',
              color: '#555',
              marginBottom: '20px',
              textAlign: 'justify'
            }}>
              Untern was born from a simple observation: talented students were struggling to find meaningful internship opportunities, while companies were having difficulty connecting with the right candidates.
            </p>
            <p style={{ 
              fontSize: isMobile ? '1rem' : isTablet ? '1.1rem' : '1.2rem', 
              lineHeight: '1.8',
              color: '#555',
              marginBottom: '20px',
              textAlign: 'justify'
            }}>
              Our founder, Mahija Ibad, experienced this challenge firsthand during their own career journeys. They envisioned a platform that would democratize access to internships and create win-win scenarios for both students and companies.
            </p>
            <p style={{ 
              fontSize: isMobile ? '1rem' : isTablet ? '1.1rem' : '1.2rem', 
              lineHeight: '1.8',
              color: '#555',
              textAlign: 'justify'
            }}>
              Today, we're proud to be Indonesia's leading internship platform, continuously innovating to serve our growing community better.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Mission;