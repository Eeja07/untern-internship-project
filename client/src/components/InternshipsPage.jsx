import React from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const InternshipsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        style={{
          backgroundColor: 'transparent',
          border: '2px solid #112D4E',
          color: '#112D4E', 
          padding: '0.5rem 1rem',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '1rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        ← Back to Home
      </button>
      <header style={{
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          color: '#112D4E',
          marginBottom: '1rem'
        }}>
          Discover Internships
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#666',
          marginBottom: '2rem'
        }}>
          Welcome back, {user?.name}! Find the perfect internship opportunity for you.
        </p>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* Search Filters */}
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '10px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{
            marginBottom: '1rem',
            color: '#112D4E'
          }}>
            Filter Internships
          </h3>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Location:
            </label>
            <input 
              type="text" 
              placeholder="Enter city or remote"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '5px'
              }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Field:
            </label>
            <select style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '5px'
            }}>
              <option value="">All Fields</option>
              <option value="tech">Technology</option>
              <option value="marketing">Marketing</option>
              <option value="finance">Finance</option>
              <option value="design">Design</option>
            </select>
          </div>
          <button style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#112D4E',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}>
            Search Internships
          </button>
        </div>

        {/* Quick Stats */}
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '10px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{
            marginBottom: '1rem',
            color: '#112D4E'
          }}>
            Your Dashboard
          </h3>
          <div style={{ marginBottom: '1rem' }}>
            <p><strong>Applications Sent:</strong> 5</p>
            <p><strong>Interviews Scheduled:</strong> 2</p>
            <p><strong>Profile Completeness:</strong> 85%</p>
          </div>
        </div>
      </div>

      {/* Sample Internship Listings */}
      <div>
        <h2 style={{
          marginBottom: '1.5rem',
          color: '#112D4E'
        }}>
          Available Internships
        </h2>
        
        {[1, 2, 3].map((item) => (
          <div key={item} style={{
            backgroundColor: 'white',
            border: '1px solid #e9ecef',
            borderRadius: '10px',
            padding: '1.5rem',
            marginBottom: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1rem'
            }}>
              <div>
                <h3 style={{
                  color: '#112D4E',
                  marginBottom: '0.5rem'
                }}>
                  Software Development Intern
                </h3>
                <p style={{
                  color: '#666',
                  marginBottom: '0.5rem'
                }}>
                  Tech Company {item} • Jakarta, Indonesia
                </p>
                <p style={{
                  color: '#28a745',
                  fontWeight: 'bold'
                }}>
                  Remote Available
                </p>
              </div>
              <button style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#112D4E',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}>
                Apply Now
              </button>
            </div>
            <p style={{
              color: '#666',
              lineHeight: '1.6'
            }}>
              Join our development team to work on exciting projects using React, Node.js, and modern web technologies. 
              Perfect opportunity for computer science students to gain real-world experience.
            </p>
            <div style={{
              marginTop: '1rem',
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap'
            }}>
              <span style={{
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                padding: '0.25rem 0.5rem',
                borderRadius: '3px',
                fontSize: '0.875rem'
              }}>
                React
              </span>
              <span style={{
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                padding: '0.25rem 0.5rem',
                borderRadius: '3px',
                fontSize: '0.875rem'
              }}>
                Node.js
              </span>
              <span style={{
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                padding: '0.25rem 0.5rem',
                borderRadius: '3px',
                fontSize: '0.875rem'
              }}>
                JavaScript
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InternshipsPage;
