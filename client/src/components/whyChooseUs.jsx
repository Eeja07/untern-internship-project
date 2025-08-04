import React from 'react';
import afi from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/afi.svg';
import cwp from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/cwp.svg';
import pio from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/pio.svg';
import mae from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/mae.svg';
import typ from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/typ.svg';
import bytp from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/bytp.svg';

const WhyChooseUs = () => {
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
          padding: '3rem'
        }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#112D4E',
            margin: 0
          }}>Why you must choose <span style={{ color: '#3F72AF' }}>Untern</span></h2>
        </div>
        
        <div style={{ width: '100%' }}>
          <div style={{
            background: '#DBE2EF',
            color: '#112D4E',
            padding: '0.75rem 2rem',
            borderRadius: '15px',
            display: 'block',
            width: '135px',
            position: 'relative',
            left: '-6rem',
            bottom: '-4rem',
            fontSize: '1.25rem',
            fontWeight: 600,
            transform: 'rotate(-12deg)',
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)',
            marginBottom: '3rem'
          }}>
            <span>For Student</span>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '2rem',
            justifyContent: 'center',
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '15px',
            marginBottom: '3rem'
          }}>
            {studentFeatures.map((feature, index) => (
              <div key={index} style={{
                background: '#DBE2EF',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                width: '100%',
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
        
        <div style={{ width: '100%' }}>
          <div style={{
            background: '#DBE2EF',
            color: '#112D4E',
            padding: '0.75rem 2rem',
            borderRadius: '15px',
            display: 'block',
            width: '150px',
            position: 'relative',
            left: '-5rem',
            bottom: '-4rem',
            fontSize: '1.25rem',
            fontWeight: 600,
            transform: 'rotate(-12deg)',
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)',
            marginBottom: '3rem'
          }}>
            <span>For Company</span>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '2rem',
            justifyContent: 'center',
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '15px',
            marginBottom: '3rem'
          }}>
            {companyFeatures.map((feature, index) => (
              <div key={index} style={{
                background: '#DBE2EF',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                width: '100%',
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
          padding: '3rem 0rem',
          textAlign: 'center'
        }}>
          <button style={{
            fontSize: '1.75rem',
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
          onMouseLeave={(e) => e.target.style.background = '#112D4E'}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;