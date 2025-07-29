import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import homepageImage from '../assets/homepage.webp';

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tags, setTags] = useState(['Remote', 'Part-time', 'Full-time', 'Internship']);
  const navigate = useNavigate();

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
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Handle tag click
  const handleTagClick = (tag) => {
    navigate(`/search?q=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              <span className='palette3'>Unlock Your</span><span className='palette4'> Career Potential</span>
            </h1>
            <p>
              <span className='palette3'>
              Find the perfect internship to kickstart your career journey.<br/>
              Thousands of opportunities waiting for you.</span>
            </p>
            
            <form className="search-form" onSubmit={handleSearch}>
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search for internships..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-btn">
                  Search
                </button>
              </div>
              <div className="search-tags">
                {tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="tag"
                    onClick={() => handleTagClick(tag)}
                    style={{ cursor: 'pointer' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </form>
          </div>
          
          <div className="homepage-image">
            <div className="office-placeholder">
              <img src={homepageImage} alt="Homepage Illustration" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;