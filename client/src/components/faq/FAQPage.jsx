import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import Navbar from '../homePage/navbar.jsx';
import FooterHome from '../homePage/footerHome.jsx';
import FAQHeader from './FAQHeader.jsx';
import FAQList, { faqData } from './FAQList.jsx';
import FAQCallToAction from './FAQCallToAction.jsx';
import AuthModal from '../auth/authModal.jsx';
import CompanyAuthModal from '../auth/companyAuthModal.jsx';
import GetStartedModal from '../auth/getStarted.jsx';

const FAQPage = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [shouldNavigateToInternships, setShouldNavigateToInternships] = useState(false);

  // Modal states for footer navigation
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isGetStartedModalOpen, setIsGetStartedModalOpen] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

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

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <>
      <Navbar 
        onForStudentsClick={handleForStudentsClick} 
        onGetStartedClick={handleGetStartedClick}
        onForCompaniesClick={handleForCompaniesClick}
      />
      
      <div className="faq-page" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        {/* Header Section */}
        <FAQHeader />

        {/* FAQ Content */}
        <div className="faq-content" style={{ padding: '80px 0' }}>
          <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
    
            {/* FAQ Items */}
            <FAQList 
              faqData={faqData}
              openFAQ={openFAQ}
              toggleFAQ={toggleFAQ}
            />

            {/* Call to Action */}
            <FAQCallToAction />
          </div>
        </div>
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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .faq-item:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          transform: translateY(-2px);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        @media (max-width: 768px) {
          .faq-header h1 {
            font-size: 2.5rem !important;
          }
          
          .faq-header p {
            font-size: 1.1rem !important;
          }
          
          .faq-question {
            font-size: 1.1rem !important;
            padding: 20px !important;
          }
          
          .faq-answer {
            font-size: 1rem !important;
            padding: 0 20px 20px !important;
          }
        }
      `}</style>
    </>
  );
};

export default FAQPage;