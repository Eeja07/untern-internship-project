import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import afi from '../../assets/afi.svg';
import cwp from '../../assets/cwp.svg';
import pio from '../../assets/pio.svg';
import mae from '../../assets/mae.svg';
import typ from '../../assets/typ.svg';
import bytp from '../../assets/bytp.svg';

const WhyChooseUs = ({ onGetStartedClick }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [lastAction, setLastAction] = useState(null);
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

  useEffect(() => {
    if (isAuthenticated && user && lastAction === 'getStarted') {
      if (user.userType === 'student') {
        navigate('/student-dashboard/overview');
      } else if (user.userType === 'company') {
        navigate('/company-dashboard');
      }
      setLastAction(null);
    }
  }, [isAuthenticated, user, lastAction, navigate]);

  const handleGetStartedClick = (e) => {
    e.preventDefault();
    setLastAction('getStarted');
    if (onGetStartedClick) {
      onGetStartedClick();
    }
  };
  const studentFeatures = [
    {
      title: 'Apply for internship',
      description: 'Browse through thousands of internship opportunities and apply with just few clicks',
      icon: afi
    },
    {
      title: 'Track your progress',
      description: 'Monitor your applications, interviews, and feedback all in one dashboard',
      icon: typ
    },
    {
      title: 'Connect with people',
      description: 'Interact with other people to get experience about internship',
      icon: cwp
    }
  ];

  const companyFeatures = [
    {
      title: 'Post Internship Opportunities',
      description: 'Easily post internship positions and attract top talent from universities.',
      icon: pio
    },
    {
      title: 'Manage Applications Efficiently',
      description: 'Streamline your hiring process with our application management tools.',
      icon: mae
    },
    {
      title: 'Build Your Talent Pipeline',
      description: 'Identify and nurture future employees through our internship platform.',
      icon: bytp
    }
  ];

  return (
    <div style={{ 
      backgroundColor: '#DBE2EF',
      padding: '2rem 0'
    }}>
      <div style={{ 
        maxWidth: '1500px', 
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: isMobile ? '2rem 1rem' : '3rem'
        }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: isMobile ? '2rem' : (isTablet ? '2.25rem' : '2.5rem'),
            fontWeight: 700,
            color: '#112D4E',
            margin: 0
          }}>Why you must choose <span style={{ color: '#3F72AF' }}>Untern</span></h2>
        </div>
        
        <div style={{ width: '100%', position: 'relative' }}>
          <div style={{
            background: '#DBE2EF',
            color: '#112D4E',
            padding: '0.75rem 2rem',
            borderRadius: '15px',
            display: 'block',
            width: isMobile ? '120px' : '135px',
            position: 'relative',
            left: isMobile ? '-1rem' : '-6rem',
            fontSize: isMobile ? '1rem' : '1.25rem',
            fontWeight: 600,
            transform: 'rotate(-12deg)',
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)',
            marginBottom: '1rem',
            bottom: '-3rem',
            zIndex: 10
          }}>
            <span>For Student</span>
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '1.5rem' : '2rem',
            justifyContent: 'center',
            backgroundColor: 'white',
            padding: isMobile ? '1.5rem' : '2rem',
            borderRadius: '15px',
            marginBottom: '1rem',
            position: 'relative',
            zIndex: 1
          }}>
            {studentFeatures.map((feature, index) => (
              <div key={index} style={{
                background: '#DBE2EF',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                maxWidth: '100%',
                transition: 'transform 0.8s, box-shadow 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
              }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  background: '#112D4E',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem'
                }}>
                  <img src={feature.icon} alt={feature.title} style={{ 
                    width: '60px', 
                    height: '60px', 
                    objectFit: 'contain' 
                  }} />
                </div>
                <h4 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                  color: '#1F2937',
                  textAlign: 'center'
                }}>{feature.title}</h4>
                <p style={{
                  color: '#112D4E',
                  lineHeight: 1.6,
                  textAlign: 'center'
                }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ width: '100%', position: 'relative' }}>
          <div style={{
            background: '#DBE2EF',
            color: '#112D4E',
            padding: '0.75rem 2rem',
            borderRadius: '15px',
            display: 'block',
            width: isMobile ? '130px' : '150px',
            position: 'relative',
            left: isMobile ? '-1rem' : '-5rem',
            fontSize: isMobile ? '1rem' : '1.25rem',
            fontWeight: 600,
            transform: 'rotate(-12deg)',
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)',
            marginBottom: '1rem',
            bottom: '-3rem',
            zIndex: 10
          }}>
            <span>For Company</span>
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '1.5rem' : '2rem',
            justifyContent: 'center',
            backgroundColor: 'white',
            padding: isMobile ? '1.5rem' : '2rem',
            borderRadius: '15px',
            marginBottom: '1rem',
            position: 'relative',
            zIndex: 1
          }}>
            {companyFeatures.map((feature, index) => (
              <div key={index} style={{
                background: '#DBE2EF',
                padding: isMobile ? '1.5rem' : '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                maxwidth: '100%',
                transition: 'transform 0.8s, box-shadow 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
              }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  background: '#112D4E',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem'
                }}>
                  <img src={feature.icon} alt={feature.title} style={{ 
                    width: '60px', 
                    height: '60px', 
                    objectFit: 'contain' 
                  }} />
                </div>
                <h4 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                  color: '#1F2937',
                  textAlign: 'center'
                }}>{feature.title}</h4>
                <p style={{
                  color: '#112D4E',
                  lineHeight: 1.6,
                  textAlign: 'center'
                }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{
          display: 'block',
          padding: isMobile ? '2rem 0' : '3rem 0rem',
          textAlign: 'center'
        }}>
          <button style={{
            fontSize: isMobile ? '1.5rem' : '1.75rem',
            background: '#112D4E',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.background = '#2563EB'}
          onMouseLeave={(e) => e.target.style.background = '#112D4E'}
          onClick={handleGetStartedClick}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;