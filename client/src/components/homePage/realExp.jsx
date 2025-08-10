import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import picRealExp1 from "../../assets/realExp1.webp";
import picRealExp2 from "../../assets/realExp2.webp";
import picRealExp3 from "../../assets/realExp3.webp";
import picRealExp4 from "../../assets/realExp4.webp";
import picRealExp5 from "../../assets/realExp5.webp";
import arwleft from "../../assets/arwleft.svg";
import arwright from "../../assets/arwright.svg";

const RealExperience = ({ onGetStartedClick }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [lastAction, setLastAction] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (isAuthenticated && user && lastAction === 'getStarted') {
      if (user.userType === 'student') {
        navigate('/student-dashboard');
      } else if (user.userType === 'company') {
        navigate('/company-dashboard');
      }
      setLastAction(null);
    }
  }, [isAuthenticated, user, lastAction, navigate]);

  const handleGetStartedClick = (e) => {
    e.preventDefault();
    setLastAction('getStarted');
    if (onGetStartedClick) {
      onGetStartedClick();
    }
  };
  const experiences = [
    picRealExp1,
    picRealExp2,
    picRealExp3,
    picRealExp4,
    picRealExp5
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === experiences.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? experiences.length - 1 : prev - 1
    );
  };

  return (
    <div className="real-experience" style={{backgroundColor: '#DBE2EF'}}>
      <div className="container-realExperience" style={{maxWidth: '1500px', margin: '0 auto', textAlign: 'center'}}>
        <div className="real-experience-header" style={{padding: '3rem 0'}}>
          <h2 style={{ color: '#112D4E', fontWeight: "normal", fontSize: '1.75rem' }}>
            Go join <span style={{ fontWeight:'bold', color:'#3F72AF' }}>Untern</span> to reach your dream company<br />
            and share your experience
          </h2>
        </div>
        <div className="container-realExperience-contents" style={{ backgroundColor: 'white', padding: '20px'}}>
          <div className="container-realExperience-content" style={{ 
            display: 'flex', 
            backgroundColor: '#DBE2EF', 
            padding: '20px', 
            borderRadius: '10px', 
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <button
              className="carousel-btn btn-left"
              onClick={prevSlide}
              aria-label="Previous experience"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                zIndex: 10,
                padding: '10px'
              }}
            >
              <img src={arwleft} alt="Previous"onMouseEnter={(e) => { e.target.style.backgroundColor = '#2563EB'; e.target.style.transform = 'translateY(0px)'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = '#112D4E'; e.target.style.transform = 'translateY(0)'; }} className="arrow-icon" style={{ backgroundColor: '#112D4E', padding: '10px 20px', borderRadius: '10px' }} />
            </button>
            
            <div className="carousel-wrapper" style={{ 
              position: 'relative', 
              width: '1500px', 
              height: '600px', 
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {experiences.map((experience, index) => {
                const isActive = index === currentSlide;
                const isPrev = index === (currentSlide - 1 + experiences.length) % experiences.length;
                const isNext = index === (currentSlide + 1) % experiences.length;
                const isVisible = isActive || isPrev || isNext;
                
                let translateX = 0;
                if (isPrev) translateX = -325;
                if (isNext) translateX = 325;
                
                return (
                  <div 
                    key={index} 
                    className="carousel-slide" 
                    style={{ 
                      position: 'absolute',
                      transition: 'all 0.5s ease-in-out',
                      transform: `translateX(${translateX}px) scale(${isActive ? 1.1 : 0.8})`,
                      opacity: isVisible ? (isActive ? 1 : 0.4) : 0,
                      filter: isActive ? 'none' : 'blur(2px)',
                      zIndex: isActive ? 5 : 1,
                      width: '700px',
                      height: '500px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '10px'
                    }}
                  >
                    <img
                      src={experience}
                      alt={`Real Experience ${index + 1}`}
                      className="experience-image"
                      style={{ 
                        width: '700px', 
                        height: '500px', 
                        objectFit: 'cover',
                        borderRadius: '10px'
                      }}
                    />
                  </div>
                );
              })}
            </div>
            
            <button
              className="carousel-btn btn-right"
              onClick={nextSlide}
              aria-label="Next experience"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                zIndex: 10,
                padding: '10px'
              }}
            >
              <img src={arwright}onMouseEnter={(e) => { e.target.style.backgroundColor = '#2563EB'; e.target.style.transform = 'translateY(0px)'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = '#112D4E'; e.target.style.transform = 'translateY(0)'; }} alt="Next" className="arrow-icon" style={{ backgroundColor: '#112D4E', padding: '10px 20px', borderRadius: '10px' }}/>
            </button>
          </div>
        </div>
        <div className="get-started-btn-container" style={{
          display: 'block',
          padding: '3rem 0rem',
          textAlign: 'center'
        }}>
          <button className="get-started-btn" style={{
              background: '#112D4E',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.3s',
              fontSize: '1.75rem'
            }}
            onMouseEnter={(e) => e.target.style.background = '#2563EB'}
            onMouseLeave={(e) => e.target.style.background = '#112D4E'}
            onClick={handleGetStartedClick}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default RealExperience;