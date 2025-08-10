import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import Navbar from '../homePage/navbar.jsx';
import FooterHome from '../homePage/footerHome.jsx';
import Mission from './story.jsx';
import Story from './mission.jsx';
import Team from './team.jsx';
import Values from './values.jsx';
import AuthModal from '../auth/authModal.jsx';
import CompanyAuthModal from '../auth/companyAuthModal.jsx';
import GetStartedModal from '../auth/getStarted.jsx';

const AboutPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [shouldNavigateToInternships, setShouldNavigateToInternships] = useState(false);

  // Modal states for footer navigation
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isGetStartedModalOpen, setIsGetStartedModalOpen] = useState(false);

  // Handlers for footer modals
  const handleForStudentsClick = () => {
    if (isAuthenticated) {
      navigate('/internships');
    } else {
      setShouldNavigateToInternships(true);
      setIsStudentModalOpen(true);
    }
  };

  const handleForCompaniesClick = () => {
    setIsCompanyModalOpen(true);
  };

  const handleGetStartedClick = () => {
    setIsGetStartedModalOpen(true);
  };

  const handleGetStartedStudentSelect = () => {
    setIsGetStartedModalOpen(false);
    setIsStudentModalOpen(true);
  };

  const handleGetStartedCompanySelect = () => {
    setIsGetStartedModalOpen(false);
    setIsCompanyModalOpen(true);
  };

  const handleCloseGetStartedModal = () => {
    setIsGetStartedModalOpen(false);
  };

  const handleCloseStudentModal = () => {
    setIsStudentModalOpen(false);
    setShouldNavigateToInternships(false);
  };

  const handleCloseCompanyModal = () => {
    setIsCompanyModalOpen(false);
  };

  // Effect to handle navigation after successful login
  useEffect(() => {
    if (isAuthenticated && shouldNavigateToInternships && !isStudentModalOpen) {
      navigate('/internships');
      setShouldNavigateToInternships(false);
    }
  }, [isAuthenticated, shouldNavigateToInternships, isStudentModalOpen, navigate]);

  // Add blur effect to body when modal is open
  useEffect(() => {
    if (isStudentModalOpen || isCompanyModalOpen || isGetStartedModalOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px';
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isStudentModalOpen, isCompanyModalOpen, isGetStartedModalOpen]);

  const stats = [
    { number: "50,000+", label: "Students Registered" },
    { number: "2,500+", label: "Companies Partnered" },
    { number: "15,000+", label: "Internships Posted" },
    { number: "85%", label: "Success Rate" }
  ];

  return (
    <>
      <Navbar 
        onForStudentsClick={handleForStudentsClick} 
        onGetStartedClick={handleGetStartedClick}
        onForCompaniesClick={handleForCompaniesClick}
      />
      
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

      {(isStudentModalOpen || isCompanyModalOpen || isGetStartedModalOpen) && (
        <div 
          className="blur-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 998,
            pointerEvents: 'none'
          }}
        />
      )}

      <GetStartedModal 
        isOpen={isGetStartedModalOpen} 
        onClose={handleCloseGetStartedModal}
        onStudentSelect={handleGetStartedStudentSelect}
        onCompanySelect={handleGetStartedCompanySelect}
      />
      <AuthModal isOpen={isStudentModalOpen} onClose={handleCloseStudentModal} />
      <CompanyAuthModal isOpen={isCompanyModalOpen} onClose={handleCloseCompanyModal} />

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