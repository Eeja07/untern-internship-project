import React, { useState } from 'react';
import Navbar from '../homePage/navbar.jsx';
import FooterHome from '../homePage/footerHome.jsx';
import BlogHeader from './BlogHeader.jsx';
import CategoryFilter from './CategoryFilter.jsx';
import FeaturedPosts from './FeaturedPosts.jsx';
import LatestPosts from './LatestPosts.jsx';
import Newsletter from './Newsletter.jsx';
import { blogData } from './BlogData.jsx';

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  const filteredPosts = selectedCategory === 'all' 
    ? blogData.blogPosts 
    : blogData.blogPosts.filter(post => post.category === selectedCategory);

  const featuredPosts = blogData.blogPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <>
      <Navbar />
      
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