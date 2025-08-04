import React, { useState, useEffect } from 'react';
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

const HomePage = () => {
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  const handleForStudentsClick = () => {
    setIsStudentModalOpen(true);
  };      

  const handleGetStartedClick = () => {
    setIsStudentModalOpen(true);
  };

  const handleForCompaniesClick = () => {
    setIsCompanyModalOpen(true);
  };

  const handleCloseStudentModal = () => {
    setIsStudentModalOpen(false);
  };

  const handleCloseCompanyModal = () => {
    setIsCompanyModalOpen(false);
  };

  // Add blur effect to body when modal is open
  useEffect(() => {
    if (isStudentModalOpen || isCompanyModalOpen) {
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
  }, [isStudentModalOpen, isCompanyModalOpen]);

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
        <WhyChooseUs />
        <WhatIntern />
        <FeaturedInternships />
        <WhatCompany />
        <RealExperience />
        <FooterHome />
      </div>
      
      {(isStudentModalOpen || isCompanyModalOpen) && (
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
      
      <AuthModal isOpen={isStudentModalOpen} onClose={handleCloseStudentModal} />
      <CompanyAuthModal isOpen={isCompanyModalOpen} onClose={handleCloseCompanyModal} />
    </>
  );
};

export default HomePage;