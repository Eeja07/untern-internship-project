import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Navbar = ({ onForStudentsClick, onClose,onGetStartedClick, onForCompaniesClick }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [lastAction, setLastAction] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (lastAction === 'student' && user.userType === 'student') {
        navigate('/student-dashboard/overview');
        setLastAction(null);
      } else if (lastAction === 'company' && user.userType === 'company') {
        navigate('/company-dashboard');
        setLastAction(null);
      } else if (lastAction === 'getStarted') {
        if (user.userType === 'student') {
          navigate('/student-dashboard/overview');
        } else if (user.userType === 'company') {
          navigate('/company-dashboard');
        }
        setLastAction(null);
      }
    }
  }, [isAuthenticated, user, lastAction, navigate]);

  const handleForStudentsClick = (e) => {
    e.preventDefault();
    if (isAuthenticated && user?.userType === 'student') {
      navigate('/student-dashboard/');
      return;
    }
    // If user is authenticated as company, show messagex`
    if (isAuthenticated && user?.userType === 'company') {
      alert('You are already logged in as a company. Please log out to access student features.');
      return;
    }
    setLastAction('student');
    if (onForStudentsClick) {
      onForStudentsClick();
    }
  };
  
  const handleForCompaniesClick = (e) => {
    e.preventDefault();
    
    // If user is already authenticated as a company, navigate directly to company dashboard
    if (isAuthenticated && user?.userType === 'company') {  
      navigate('/company-dashboard');
      return;
    }
    
    // If user is authenticated as student, show message
    if (isAuthenticated && user?.userType === 'student') {
      alert('You are already logged in as a student. Please log out to access company features.');
      return;
    }
    setLastAction('company');
    // If not authenticated, proceed with company registration/login modal
    if (onForCompaniesClick) {
      onForCompaniesClick();
    }
  };
  
  const handleGetStartedClick = (e) => {
    e.preventDefault();
    setLastAction('getStarted');
    if (onGetStartedClick) {
      onGetStartedClick();
    }
  };

  const handleLogout = () => {
    logout();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav style={{
      background: 'white',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      padding: '1rem 0',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      width: '100%',
      zIndex: 999
    }}>
      <div style={{
        maxWidth: '1500px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <h2 style={{
            color: '#3B82F6',
            fontWeight: 700,
            margin: 0
          }}>Untern</h2>
        </div>

        {/* Hamburger Menu for Mobile */}
        {isMobile && (
          <button onClick={toggleMenu} style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.5rem',
            color: '#64748B',
            padding: '0.5rem'
          }}>
            {isMenuOpen ? '✕' : '☰'}
          </button>
        )}

        <ul style={{
          display: isMobile ? (isMenuOpen ? 'flex' : 'none') : 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          position: isMobile ? 'absolute' : 'static',
          top: isMobile ? '100%' : 'auto',
          left: isMobile ? '0' : 'auto',
          right: isMobile ? '0' : 'auto',
          backgroundColor: isMobile ? 'white' : 'transparent',
          boxShadow: isMobile ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
          padding: isMobile ? '1rem' : '0',
          listStyle: 'none',
          gap: isMobile ? '1rem' : '2rem',
          margin: 0,
          zIndex: 998
        }}>
          <li>
            <a href="/" style={{
              textDecoration: 'none',
              color: '#64748B',
              fontWeight: 500,
              transition: 'color 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#3B82F6'}
            onMouseLeave={(e) => e.target.style.color = '#64748B'}>Home</a>
          </li>
          <li>
            <a href="" style={{
              textDecoration: 'none',
              color: '#64748B',
              fontWeight: 500,
              transition: 'color 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#3B82F6'}
            onMouseLeave={(e) => e.target.style.color = '#64748B'}
            onClick={handleForStudentsClick}>For Students</a>
          </li>
          <li>
            <a href="" style={{
              textDecoration: 'none',
              color: '#64748B',
              fontWeight: 500,
              transition: 'color 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#3B82F6'}
            onMouseLeave={(e) => e.target.style.color = '#64748B'}
            onClick={handleForCompaniesClick}>For Companies</a>
          </li>
          <li>
            <a href="/faq" style={{
              textDecoration: 'none',
              color: '#64748B',
              fontWeight: 500,
              transition: 'color 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#3B82F6'}
            onMouseLeave={(e) => e.target.style.color = '#64748B'}
            >FAQ</a>
          </li>
          <li>
            <a href="/blog" style={{
              textDecoration: 'none',
              color: '#64748B',
              fontWeight: 500,
              transition: 'color 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#3B82F6'}
            onMouseLeave={(e) => e.target.style.color = '#64748B'}
            >Blog</a>
          </li>
          <li>
            <a href="/about" style={{
              textDecoration: 'none',
              color: '#64748B',
              fontWeight: 500,
              transition: 'color 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#3B82F6'}
            onMouseLeave={(e) => e.target.style.color = '#64748B'}
            >About</a>
          </li>
        </ul>
        
        <div style={{
          display: isMobile ? (isMenuOpen ? 'none' : 'block') : 'block'
        }}>
          {isAuthenticated ? (
            <div className="user-menu" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className="user-welcome" style={{ color: '#64748B', fontSize: '0.9rem' }}>
                Welcome, {user?.email?.split('@')[0]}
              </span>
              <button 
                className="logout-btn" 
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  color: '#64748B',
                  border: '1px solid #64748B',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#64748B';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#64748B';
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button style={{
              background: '#112D4E',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#2563EB'}
            onMouseLeave={(e) => e.target.style.background = '#112D4E'}
            onClick={handleGetStartedClick}>
              Get Started
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;