import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../homePage/navbar.jsx';
import FooterHome from '../homePage/footerHome.jsx';
import Mission from './story.jsx';
import Story from './mission.jsx';
import Team from './team.jsx';
import Values from './values.jsx';

const AboutPage = () => {
  const navigate = useNavigate();

  // Modal states for footer navigation
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  // Handlers for footer modals
  const handleForStudentsClick = () => {
    setIsStudentModalOpen(true);
  };

  const handleForCompaniesClick = () => {
    setIsCompanyModalOpen(true);
  };

  const stats = [
    { number: "50,000+", label: "Students Registered" },
    { number: "2,500+", label: "Companies Partnered" },
    { number: "15,000+", label: "Internships Posted" },
    { number: "85%", label: "Success Rate" }
  ];

  return (
    <>
      <Navbar />
      
      <div className="about-page" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>

        {/* Mission Section */}
        <Mission />

        {/* Stats Section */}
        <div className="stats-section" style={{ 
          padding: '80px 0', 
          backgroundColor: 'white',
          color: '#112D4E'
        }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              textAlign: 'center',
              marginBottom: '50px',
              fontWeight: '600'
            }}>
              Our Impact
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '40px',
              textAlign: 'center'
            }}>
              {stats.map((stat, index) => (
                <div key={index} style={{ padding: '20px' }}>
                  <div style={{ 
                    fontSize: '3rem', 
                    fontWeight: 'bold',
                    marginBottom: '10px',
                    color: '#112D4E'
                  }}>
                    {stat.number}
                  </div>
                  <div style={{ 
                    fontSize: '1.1rem',
                    opacity: '0.9'
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values Section */}
        <Values />

        {/* Team Section */}
        <Team />

        {/* Story Section */}
        <Story />
      </div>

      <FooterHome onForStudentsClick={handleForStudentsClick} onForCompaniesClick={handleForCompaniesClick} />

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .team-section .team-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 30px rgba(0,0,0,0.15);
        }

        .values-section .value-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        @media (max-width: 768px) {
          .about-hero h1 {
            font-size: 2.5rem !important;
          }
          
          .about-hero p {
            font-size: 1.2rem !important;
          }

          [style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }

          .mission-section,
          .story-section {
            padding: 60px 0 !important;
          }

          .mission-section h2,
          .story-section h2 {
            font-size: 2rem !important;
          }
        }
      `}</style>
    </>
  );
};

export default AboutPage;