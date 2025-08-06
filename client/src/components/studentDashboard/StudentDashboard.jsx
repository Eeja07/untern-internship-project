import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../auth/AuthContext.jsx';

const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState('discover');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Handle window resize for mobile responsiveness
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarItems = [
    { id: 'discover', label: 'Discover Internships', icon: '🔍' },
    { id: 'profile', label: 'Build Your Profile', icon: '👤' },
    { id: 'applications', label: 'Track Your Applications', icon: '📋' },
    { id: 'stories', label: 'Read Success Stories', icon: '🌟' },
    { id: 'reviews', label: 'View Company Reviews', icon: '⭐' },
    { id: 'certifications', label: 'Receive Certifications', icon: '🏆' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'discover':
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
      
      case 'profile':
        return (
          <div>
            <h2 style={{ color: '#007bff', marginBottom: '20px' }}>Build Your Profile</h2>
            <div style={{
              background: '#f8f9fa',
              padding: '30px',
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: '#007bff',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '24px',
                  marginRight: '20px'
                }}>
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h3>{user?.email}</h3>
                  <p style={{ color: '#6c757d' }}>Complete your profile to attract employers</p>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    University
                  </label>
                  <input 
                    type="text" 
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ marginTop: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Bio
                </label>
                <textarea 
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    resize: 'vertical'
                  }}
                  placeholder="Tell employers about yourself..."
                />
              </div>
              
              <button style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '20px'
              }}>
                Save Profile
              </button>
            </div>
          </div>
        );
      
      case 'applications':
        return (
          <div>
            <h2 style={{ color: '#007bff', marginBottom: '20px' }}>Track Your Applications</h2>
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3>Your Applications</h3>
                <span style={{ 
                  background: '#007bff', 
                  color: 'white', 
                  padding: '5px 15px', 
                  borderRadius: '20px',
                  fontSize: '14px'
                }}>
                  0 Active
                </span>
              </div>
              
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>📋</div>
                <h4>No Applications Yet</h4>
                <p style={{ color: '#6c757d', marginBottom: '20px' }}>
                  Start applying to internships to track your progress here.
                </p>
                <button 
                  onClick={() => setActiveSection('discover')}
                  style={{
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Find Internships
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'stories':
        return (
          <div>
            <h2 style={{ color: '#007bff', marginBottom: '20px' }}>Success Stories</h2>
            <div style={{ display: 'grid', gap: '20px' }}>
              {[1, 2, 3].map((story) => (
                <div key={story} style={{
                  background: '#f8f9fa',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid #e9ecef'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      background: '#007bff',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      marginRight: '15px'
                    }}>
                      {String.fromCharCode(65 + story - 1)}
                    </div>
                    <div>
                      <h4>Mahija Success Story {story}</h4>
                      <p style={{ color: '#6c757d', margin: 0 }}>Now at Tech Company</p>
                    </div>
                  </div>
                  <p>
                    "My internship experience was incredible. I learned so much and made valuable connections 
                    that helped me land my dream job. The platform made it easy to find the perfect opportunity."
                  </p>
                  <span style={{ color: '#007bff', fontSize: '14px' }}>⭐⭐⭐⭐⭐</span>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'reviews':
        return (
          <div>
            <h2 style={{ color: '#007bff', marginBottom: '20px' }}>Company Reviews</h2>
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #e9ecef',
              marginBottom: '20px'
            }}>
              <input 
                type="text" 
                placeholder="Search companies..." 
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
            
            <div style={{ display: 'grid', gap: '20px' }}>
              {['Tech Corp', 'Innovation Labs', 'StartupHub'].map((company, index) => (
                <div key={company} style={{
                  background: '#f8f9fa',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid #e9ecef'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4>{company}</h4>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ color: '#007bff', marginRight: '10px' }}>
                        ⭐ {(4.2 + index * 0.3).toFixed(1)}
                      </span>
                      <span style={{ color: '#6c757d' }}>({12 + index * 5} reviews)</span>
                    </div>
                  </div>
                  <p style={{ color: '#6c757d' }}>
                    Great company culture with excellent mentorship opportunities. 
                    Interns are given meaningful projects and real responsibilities.
                  </p>
                  <div style={{ marginTop: '10px' }}>
                    <span style={{
                      background: '#e7f3ff',
                      color: '#007bff',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      marginRight: '8px'
                    }}>
                      Technology
                    </span>
                    <span style={{
                      background: '#e7f3ff',
                      color: '#007bff',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}>
                      Remote Friendly
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'certifications':
        return (
          <div>
            <h2 style={{ color: '#007bff', marginBottom: '20px' }}>Internship Certifications</h2>
            <div style={{
              background: '#f8f9fa',
              padding: '30px',
              borderRadius: '8px',
              border: '1px solid #e9ecef',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>🏆</div>
              <h3>No Certifications Yet</h3>
              <p style={{ color: '#6c757d', marginBottom: '20px' }}>
                Complete internships to receive official certifications that validate your experience 
                and skills to future employers.
              </p>
              <div style={{
                background: 'white',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #e9ecef',
                marginBottom: '20px'
              }}>
                <h4>How It Works</h4>
                <div style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
                  <div style={{ marginBottom: '15px' }}>
                    <strong>1.</strong> Complete your internship program
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <strong>2.</strong> Receive evaluation from your supervisor
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <strong>3.</strong> Get your official certification
                  </div>
                  <div>
                    <strong>4.</strong> Share it on your profile and resume
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setActiveSection('discover')}
                style={{
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Start Your Journey
              </button>
            </div>
          </div>
        );
      
      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Sidebar */}
      <div style={{
        width: isMobile ? '100%' : '280px',
        background: 'white',
        borderRight: '1px solid #e9ecef',
        padding: '20px',
        display: isMobile && activeSection ? 'none' : 'block'
      }}>
        {/* User Info */}
        <div style={{
          borderBottom: '1px solid #e9ecef',
          paddingBottom: '20px',
          marginBottom: '20px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: '#007bff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '20px',
            marginBottom: '10px'
          }}>
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <h4 style={{ margin: 0, marginBottom: '5px' }}>Student Dashboard</h4>
          <p style={{ margin: 0, color: '#6c757d', fontSize: '14px' }}>{user?.email}</p>
        </div>

        {/* Navigation Items */}
        <nav>
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                margin: '4px 0',
                background: activeSection === item.id ? '#e7f3ff' : 'transparent',
                color: activeSection === item.id ? '#007bff' : '#495057',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (activeSection !== item.id) {
                  e.target.style.background = '#f8f9fa';
                }
              }}
              onMouseLeave={(e) => {
                if (activeSection !== item.id) {
                  e.target.style.background = 'transparent';
                }
              }}
            >
              <span style={{ marginRight: '12px', fontSize: '18px' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '12px 16px',
            margin: '20px 0 0 0',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
          onMouseEnter={(e) => e.target.style.background = '#c82333'}
          onMouseLeave={(e) => e.target.style.background = '#dc3545'}
        >
          🚪 Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: isMobile ? '10px' : '30px',
        overflow: 'auto'
      }}>
        {isMobile && (
          <button
            onClick={() => setActiveSection(null)}
            style={{
              display: 'block',
              marginBottom: '20px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ← Back to Menu
          </button>
        )}
        
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '30px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;