import React from 'react';

const BlogHeader = () => {
  return (
    <div className="blog-header" style={{
      background: '#112D4E',
      color: 'white',
      padding: '100px 0 60px',
      textAlign: 'center'
    }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <h1 style={{ 
          fontSize: '3.5rem', 
          fontWeight: 'bold', 
          marginBottom: '20px',
          textShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          Untern Blog
        </h1>
        <p style={{ 
          fontSize: '1.3rem', 
          opacity: '0.9',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Insights, tips, and stories to help you succeed in your internship journey
        </p>
      </div>
    </div>
  );
};

export default BlogHeader;