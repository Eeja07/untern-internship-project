import React, { useState } from 'react';
import homepageImage from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/homepage.svg';
// import './Hero.css';

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
  };

  return (
    <div className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              <span className='palette3'>Unlock Your</span><span className='palette4'> Carrer Potential</span>
            </h1>
            <p>
              <span className='palette3'>
              Find the perfect internship to kickstart your career journey.<br/>
              Thousand of opportunity waiting for you.</span>
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
                <span className="tag">Remote</span>
                <span className="tag">Part-time</span>
                <span className="tag">Full-time</span>
                <span className="tag">Internship</span>
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