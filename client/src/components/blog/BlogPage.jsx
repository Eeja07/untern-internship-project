import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import Navbar from '../homePage/navbar.jsx';
import FooterHome from '../homePage/footerHome.jsx';
import BlogHeader from './BlogHeader.jsx';
import CategoryFilter from './CategoryFilter.jsx';
import FeaturedPosts from './FeaturedPosts.jsx';
import LatestPosts from './LatestPosts.jsx';
import Newsletter from './Newsletter.jsx';
import { blogData } from './BlogData.jsx';
import AuthModal from '../auth/authModal.jsx';
import CompanyAuthModal from '../auth/companyAuthModal.jsx';
import GetStartedModal from '../auth/getStarted.jsx';

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
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

  const filteredPosts = selectedCategory === 'all' 
    ? blogData.blogPosts 
    : blogData.blogPosts.filter(post => post.category === selectedCategory);

  const featuredPosts = blogData.blogPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <>
      <Navbar 
        onForStudentsClick={handleForStudentsClick} 
        onGetStartedClick={handleGetStartedClick}
        onForCompaniesClick={handleForCompaniesClick}
      />
      
      <div className="blog-page" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        {/* Header Section */}
        <BlogHeader />

        {/* Content */}
        <div className="blog-content" style={{ padding: '80px 0' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            
            {/* Category Filter */}
            <CategoryFilter 
              categories={blogData.categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

            {/* Featured Posts */}
            {selectedCategory === 'all' && featuredPosts.length > 0 && (
              <FeaturedPosts posts={featuredPosts} />
            )}

            {/* Regular Posts */}
            <LatestPosts 
              posts={regularPosts}
              selectedCategory={selectedCategory}
              categories={blogData.categories}
            />

            {/* Newsletter Signup */}
            <Newsletter />
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
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        @media (max-width: 768px) {
          .blog-header h1 {
            font-size: 2.5rem !important;
          }
          
          .blog-header p {
            font-size: 1.1rem !important;
          }

          [style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }

          .blog-content {
            padding: 60px 0 !important;
          }
        }
      `}</style>
    </>
  );
};

export default BlogPage;