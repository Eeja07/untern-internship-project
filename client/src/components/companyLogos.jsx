import React from 'react';
import astra from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/astra.svg';
import bni from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/bni.svg';
import garuda from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/garuda.svg';
import mandiri from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/mandiri.svg';
import pertamina from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/pertamina.svg';
import pln from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/pln.svg';
import telkom from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/telkom.svg'; 

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
    <div className="company-logos">
      <p className="company-text">Apply your dream company</p>
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