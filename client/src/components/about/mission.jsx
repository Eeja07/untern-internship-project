import React, { useState, useEffect } from 'react';
import picRealExp2 from "../../assets/realExp2.webp";

const Story = () => {
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
    <div className="story-section" style={{ padding: isMobile ? '60px 0' : '80px 0', backgroundColor: '#DBE2EF' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '0 15px' : '0 20px' }}>
        <div style={{ 
          display: isMobile ? 'flex' : 'grid', 
          flexDirection: isMobile ? 'column' : 'row',
          gridTemplateColumns: isMobile ? 'none' : '1fr 1fr', 
          gap: isMobile ? '30px' : '60px', 
          alignItems: 'center' 
        }}>
          <div>
            <h2 style={{ 
              fontSize: isMobile ? '1.8rem' : isTablet ? '2.2rem' : '2.5rem', 
              marginBottom: '25px',
              color: '#2c3e50',
              fontWeight: '600'
            }}>
              Our Mission
            </h2>
            <p style={{ 
              fontSize: isMobile ? '1rem' : isTablet ? '1.1rem' : '1.2rem', 
              lineHeight: '1.8',
              color: '#555',
              marginBottom: '20px',
              textAlign: 'justify'
            }}>
              At Untern, we're passionate about creating pathways for the next generation of professionals. We believe that internships are more than just work experience—they're transformative opportunities that shape careers and drive innovation.
            </p>
            <p style={{ 
              fontSize: isMobile ? '1rem' : isTablet ? '1.1rem' : '1.2rem', 
              lineHeight: '1.8',
              color: '#555',
              textAlign: 'justify'
            }}>
              Founded in 2025, we've grown from a simple idea to a comprehensive platform that serves thousands of students and companies across Indonesia and beyond.
            </p>
          </div>
          <div style={{
            height: isMobile ? '250px' : isTablet ? '350px' : '450px',
            backgroundColor: 'white',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <img 
              src={picRealExp2}
              alt="Company Profile" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Story;