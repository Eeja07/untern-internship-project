import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../auth/AuthContext.jsx';
import { studentAPI } from '../auth/api';
import DiscoverInternships from './DiscoverInternships.jsx';
import BuildProfile from './BuildProfile.jsx';
import TrackApplications from './TrackApplications.jsx';
import SuccessStories from './SuccessStories.jsx';
import CompanyReviews from './CompanyReviews.jsx';
import InternshipCertifications from './InternshipCertifications.jsx';

const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState('discover');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { user, profile, logout } = useContext(AuthContext);
  const [localProfile, setLocalProfile] = useState(null);
  const [profileRefreshFlag, setProfileRefreshFlag] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems = [
    { id: 'discover', label: 'Discover Internships', icon: '🔍' },
    { id: 'profile', label: 'Build Your Profile', icon: '👤' },
    { id: 'applications', label: 'Track Your Applications', icon: '📋' },
    { id: 'stories', label: 'Read Success Stories', icon: '🌟' },
    { id: 'reviews', label: 'View Company Reviews', icon: '⭐' }, 
    { id: 'certifications', label: 'Receive Certifications', icon: '🏆' }
  ];

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const profileResponse = await studentAPI.getProfile();
        if (profileResponse.success) {
          setLocalProfile(profileResponse.profile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    
    fetchProfile();
  }, [profileRefreshFlag]);

  // Set active section based on URL path
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    const validSections = sidebarItems.map(item => item.id);
    console.log('Current path:', location.pathname);
    console.log('Extracted section:', path);
    console.log('Valid sections:', validSections);
    
    if (path && validSections.includes(path)) {
      setActiveSection(path);
      console.log('Setting active section to:', path);
    } else {
      // If no valid path, default to discover
      setActiveSection('discover');
      console.log('Setting default section: discover');
    }
  }, [location.pathname]);

  // Handle window resize for mobile responsiveness
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    navigate(`/student-dashboard/${sectionId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderContent = () => {
    console.log('Rendering content for section:', activeSection);
    switch (activeSection) {
      case 'discover':
        return <DiscoverInternships />;
      case 'profile':
        return <BuildProfile onProfileSaved={() => setProfileRefreshFlag(f => f + 1)} />;
      case 'applications':
        return <TrackApplications />;
      case 'stories':
        return <SuccessStories />;
      case 'reviews':
        return <CompanyReviews />;
      case 'certifications':
        return <InternshipCertifications />;
      default:
        console.log('No matching section, showing discover');
        return <DiscoverInternships />;
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
            {((localProfile || user)?.name?.charAt(0) || 
             (localProfile || user)?.firstName?.charAt(0) || 'S').toUpperCase()}
          </div>
          <h4 style={{ margin: 0, marginBottom: '5px' }}>Student Dashboard</h4>
          <p style={{ margin: 0, color: '#6c757d', fontSize: '14px' }}>
            {(localProfile || user)?.name || ((localProfile || user)?.firstName && (localProfile || user)?.lastName ? `${(localProfile || user).firstName} ${(localProfile || user).lastName}` : 'Student')}
          </p>
        </div>

        {/* Navigation Items */}
        <nav>
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSectionChange(item.id)}
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