import React from 'react';

const FAQHeader = () => {
  return (
    <div className="faq-header" style={{
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
          Frequently Asked Questions
        </h1>
        <p style={{ 
          fontSize: '1.3rem', 
          opacity: '0.9',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Find answers to common questions about using Untern for internships
        </p>
      </div>
    </div>
  );
};

export default FAQHeader;