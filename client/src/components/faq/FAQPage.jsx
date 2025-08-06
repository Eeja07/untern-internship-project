import React, { useState } from 'react';
import Navbar from '../homePage/navbar.jsx';
import FooterHome from '../homePage/footerHome.jsx';
import FAQHeader from './FAQHeader.jsx';
import FAQList, { faqData } from './FAQList.jsx';
import FAQCallToAction from './FAQCallToAction.jsx';

const FAQPage = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

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

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <>
      <Navbar />
      
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