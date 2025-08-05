import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Navbar from '../components/navbar.jsx';
import Hero from '../components/hero.jsx';
import CompanyLogos from '../components/companyLogos.jsx';
import WhyChooseUs from '../components/whyChooseUs.jsx';
import WhatIntern from '../components/whatIntern.jsx';
import FeaturedInternships from '../components/featuredInternhip.jsx';
import WhatCompany from '../components/whatCompany.jsx';
import RealExperience from '../components/realExp.jsx';
import FooterHome from '../components/footerHome.jsx';
import AuthModal from '../components/authModal.jsx';
import CompanyAuthModal from '../components/companyAuthModal.jsx';
import GetStartedModal from '../components/getStarted.jsx';

const HomePage = () => {
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isGetStartedModalOpen, setIsGetStartedModalOpen] = useState(false);
  const [shouldNavigateToInternships, setShouldNavigateToInternships] = useState(false);
  
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleForStudentsClick = () => {
    // Check if user is authenticated
    if (isAuthenticated) {
      // If authenticated, navigate directly to internships page
      navigate('/internships');
    } else {
      // If not authenticated, open login modal and set flag for post-login navigation
      setShouldNavigateToInternships(true);
      setIsStudentModalOpen(true);
    }
  };      

  const handleGetStartedClick = () => {
    setIsGetStartedModalOpen(true);
  };

  const handleForCompaniesClick = () => {
    setIsCompanyModalOpen(true);
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

  // Effect to handle navigation after successful login
  useEffect(() => {
    if (isAuthenticated && shouldNavigateToInternships && !isStudentModalOpen) {
      navigate('/internships');
      setShouldNavigateToInternships(false);
    }
  }, [isAuthenticated, shouldNavigateToInternships, isStudentModalOpen, navigate]);

  const handleCloseCompanyModal = () => {
    setIsCompanyModalOpen(false);
  };

  // Add blur effect to body when modal is open
  useEffect(() => {
    if (isStudentModalOpen || isCompanyModalOpen || isGetStartedModalOpen) {
      // Prevent body scroll without affecting layout
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px'; // Reset any padding
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isStudentModalOpen, isCompanyModalOpen, isGetStartedModalOpen]);

  return (
    <>
      <div className="app-content">
        <Navbar 
          onForStudentsClick={handleForStudentsClick} 
          onGetStartedClick={handleGetStartedClick}
          onForCompaniesClick={handleForCompaniesClick}
        />
        <Hero />
        <CompanyLogos />
        <WhyChooseUs onGetStartedClick={handleGetStartedClick} />
        <WhatIntern />
        <FeaturedInternships onForStudentsClick={handleForStudentsClick} />
        <WhatCompany />
        <RealExperience onGetStartedClick={handleGetStartedClick} />
        <FooterHome onForStudentsClick={handleForStudentsClick} onForCompaniesClick={handleForCompaniesClick} />
      </div>
      
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
    </>
  );
};

export default HomePage;