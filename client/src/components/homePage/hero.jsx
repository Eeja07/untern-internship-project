import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import homepageImage from '../../assets/homepage.webp';

const Hero = ({ onOpenLoginModal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tags, setTags] = useState(['Remote', 'Part-time', 'Full-time', 'Internship']);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const allTags = ['Remote', 'Part-time', 'Full-time', 'Internship', 'Contract', 'Freelance', 'On-site', 'Hybrid'];

  const shuffleTags = () => {
    const shuffled = [...allTags].sort(() => Math.random() - 0.5);  
    setTags(shuffled.slice(0, 4));
  };

  useEffect(() => {
    const interval = setInterval(shuffleTags, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // If user is authenticated as student, navigate directly
      if (isAuthenticated && user?.userType === 'student') {
        navigate(`/student-dashboard?tab=search&q=${encodeURIComponent(searchTerm)}`);
        return;
      }
      
      // If user is authenticated as company, show message
      if (isAuthenticated && user?.userType === 'company') {
        alert('You are already logged in as a company. Please log out to access student features.');
        return;
      }
      
      // If not authenticated, store search intent and open login modal
      sessionStorage.setItem('searchIntent', JSON.stringify({ 
        type: 'search', 
        query: searchTerm.trim() 
      }));
      if (onOpenLoginModal) {
        onOpenLoginModal();
      }
    }
  };

  // Handle tag click
  const handleTagClick = (tag) => {
    // If user is authenticated as student, navigate directly
    if (isAuthenticated && user?.userType === 'student') {
      navigate(`/student-dashboard?tab=search&q=${encodeURIComponent(tag)}`);
      return;
    }
    
    // If user is authenticated as company, show message
    if (isAuthenticated && user?.userType === 'company') {
      alert('You are already logged in as a company. Please log out to access student features.');
      return;
    }
    
    // If not authenticated, store search intent and open login modal
    sessionStorage.setItem('searchIntent', JSON.stringify({ 
      type: 'tag', 
      query: tag 
    }));
    if (onOpenLoginModal) {
      onOpenLoginModal();
    }
  };

  return (
    <div style={{
      background: '#DBE2EF',
      padding: '10rem 0 10rem',
      marginTop: '70px'
    }}>
      <div style={{
        maxWidth: '1500px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '4rem',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: '1.5rem'
            }}>
              <span style={{ color: '#3F72AF' }}>Unlock Your</span>
              <span style={{ color: '#112D4E' }}> Career Potential</span>
            </h1>
            <p style={{
              fontSize: '1.25rem',
              color: '#3F72AF',
              marginBottom: '2rem'
            }}>
              Find the perfect internship to kickstart your career journey.<br/>
              Thousands of opportunities waiting for you.
            </p>
            
            <form style={{ maxWidth: '500px' }} onSubmit={handleSearch}>
              <div style={{
                display: 'flex',
                marginBottom: '1rem'
              }}>
                <input
                  type="text"
                  placeholder="Search for internships..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    border: '2px solid #112D4E',
                    borderRight: 'none',
                    borderRadius: '12px 0 0 12px',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
                <button type="submit" style={{
                  background: '#112D4E',
                  color: '#F9F7F7',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '0 12px 12px 0',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>
                  Search
                </button>
              </div>
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap'
              }}>
                {tags.map((tag, index) => (
                  <span 
                    key={index}
                    onClick={() => handleTagClick(tag)}
                    style={{ 
                      background: '#3F72AF',
                      color: '#F9F7F7',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </form>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '600px',
              height: '500px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '30px',
              border: '1px solid #ccc',
              overflow: 'hidden'
            }}>
              <img src={homepageImage} alt="Homepage Illustration" style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;