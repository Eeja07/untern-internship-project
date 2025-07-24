import React from 'react';
import afi from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/afi.svg';
import cwp from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/cwp.svg';
import pio from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/pio.svg';
import mae from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/mae.svg';
import typ from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/typ.svg';
import bytp from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/bytp.svg';
import '../App.css';

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
    <div className="why-choose-us">
      <div className="container">
        <div className="section-header-wcu">
          <h2>Why you must choose <span className="palette3">Untern</span></h2>
        </div>
        <div className="features-section">
          <div className="section-title-1">
            <span>For Student</span>
          </div>
          <div className="features-grid">
            <div className='features-card-container'>
              {studentFeatures.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">
                    <img src={feature.icon} alt={feature.title} className="icon-number" 
                    style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                  </div>
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Company Features Section - Keep original structure */}
        <div className="features-section">
          <div className="section-title-2">
            <span>For Company</span>
          </div>
          <div className="features-grid">
            <div className='features-card-container'>
              {companyFeatures.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">
                    <img src={feature.icon} alt={feature.title} className="icon-number" 
                    style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                  </div>
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className='get-started-btn-container'>
          <button className="get-started-btn">Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;