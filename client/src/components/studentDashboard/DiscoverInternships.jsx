import React from 'react';

const DiscoverInternships = () => {
  return (
    <div>
      <h2 style={{ color: '#007bff', marginBottom: '20px' }}>Discover Internships</h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px' 
      }}>
        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h3>Search Filters</h3>
          <div style={{ marginBottom: '15px' }}>
            <input 
              type="text" 
              placeholder="Search internships..." 
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>
          <select style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            marginBottom: '10px'
          }}>
            <option>All Industries</option>
            <option>Technology</option>
            <option>Finance</option>
            <option>Marketing</option>
            <option>Healthcare</option>
          </select>
        </div>
        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h3>Featured Internships</h3>
          <p>Browse the latest internship opportunities from top companies.</p>
          <button style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            View All
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscoverInternships;