import React from 'react';
import astra from '../../assets/astra.svg';
import bni from '../../assets/bni.svg';
import garuda from '../../assets/garuda.svg';
import mandiri from '../../assets/mandiri.svg';
import pertamina from '../../assets/pertamina.svg';
import pln from '../../assets/pln.svg';
import telkom from '../../assets/telkom.svg'; 

const CompanyLogos = () => {
  const companies = [
    { logo: pertamina },
    { logo: pln },
    { logo: telkom },
    { logo: bni },
    { logo: garuda },
    { logo: mandiri },
    { logo: astra }
  ];

  const scrollingStyle = {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    position: 'relative'
  };

  const animationStyle = {
    display: 'inline-block',
    animation: 'scroll-right 10s linear infinite'
  };

  return (
    <div style={{
      padding: '4rem 0',
      background: 'white'
    }}>
      <p style={{
        textAlign: 'center',
        fontSize: '2rem',
        color: '#112D4E',
        marginBottom: '3rem'
      }}>Apply your dream company</p>
      <style>
        {`
          @keyframes scroll-right {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>
      <div style={scrollingStyle}>
        <div style={animationStyle}>
          {/* First set of images */}
          {companies.map((company, index) => (
            <div key={index} style={{ display: 'inline-block', margin: '0 50px' }}>
              <img 
                src={company.logo} 
                alt={`Company logo ${index}`} 
                style={{ width: '200px', height: '150px', objectFit: 'contain' }}
              />
            </div>
          ))}
          {/* Duplicate set for continuous effect */}
          {companies.map((company, index) => (
            <div key={`duplicate-${index}`} style={{ display: 'inline-block', margin: '0 50px' }}>
              <img 
                src={company.logo} 
                alt={`Company logo ${index}`} 
                style={{ width: '200px', height: '150px', objectFit: 'contain' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyLogos;