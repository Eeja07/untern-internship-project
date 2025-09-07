import React, { useState, useEffect } from "react";
import pio from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/pio.svg';
import mae from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/mae.svg';
import bytp from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/bytp.svg';
import arwleft from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/arwleft.svg';
import arwright from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/arwright.svg';
import eeja from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/eeja.webp';
import { Grid, Star } from 'lucide-react';

const WhatIntern = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024 && window.innerWidth > 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            setIsTablet(window.innerWidth <= 1024 && window.innerWidth > 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const whatInternCards = [
    {
        name: 'Mahija Ibad',
        background: 'Undergraduate Student At Institute Technology Sepuluh Nopember',
        description: 'loremipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.loremipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.loremipsum dolor sit amet, consectetur adipiscing elit.',
        pic: eeja,
        rating: 5
    },
    {
        name: 'Mahija Ibad Pradipta',
        background: 'Undergraduate Student At Institute Technology Sepuluh Nopember',
        description: 'loremipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.loremipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.loremipsum dolor sit amet, consectetur adipiscing elit.',
        pic: eeja,
        rating: 4
    },
    {
        name: 'Mahija',
        background: 'Undergraduate Student At Institute Technology Sepuluh Nopember',
        description: 'loremipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.loremipsum dolor sit amet, consectetur adipiscing elit.',
        pic: eeja,
        rating: 1
    },
    {
        name: 'Eeja',
        background: 'Undergraduate Student At Institute Technology Sepuluh Nopember',
        description: 'loremipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.loremipsum dolor sit amet, consectetur adipiscing elit.',
        pic: eeja,
        rating: 3
    }
    ];

    const handlePrevious = () => {
        setCurrentIndex(prevIndex => 
            prevIndex === 0 ? whatInternCards.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex(prevIndex => 
            prevIndex === whatInternCards.length - 1 ? 0 : prevIndex + 1
        );
    };

    const getVisibleCards = () => {
        const cardsToShow = isMobile ? 1 : isTablet ? 3 : 4;
        const result = [];
        for (let i = 0; i < cardsToShow; i++) {
            const index = (currentIndex + i) % whatInternCards.length;
            result.push(whatInternCards[index]);
        }
        return result;
    };
    
return (
    <div className="container-what-intern" style={{height:isMobile?'500px': 'auto',maxWidth:'1500px', margin: '50px auto', padding: isMobile ? '0 1rem' : '0 2rem' }}>
        <div className="section-1-what-intern" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '1rem 0' : '2rem 0'}}>
            <button onMouseEnter={(e) => { e.target.style.backgroundColor = '#2563EB'; e.target.style.transform = 'translateY(0px)'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = '#112D4E'; e.target.style.transform = 'translateY(0)'; }} className="btn-left-what-intern" style={{ backgroundColor: '#112D4E', borderRadius: '10px', padding: isMobile ? '0.5rem 1rem' : '0.5rem 2rem', border: 'none', cursor: 'pointer' }} onClick={handlePrevious}>
                <img src={arwleft} alt="Left Arrow" className="left-arrow-icon" />
            </button>
            <h2 style={{ textAlign: 'center', fontWeight: '100', fontSize: isMobile ? '1.5rem' : isTablet ? '2rem' : '2.5rem', margin: '0 1rem' }} className="section-what-intern-title">What <span style={{ fontWeight: 'bold' }}>Intern</span> Think About <span className="palette3">Untern</span></h2>
            <button onMouseEnter={(e) => { e.target.style.backgroundColor = '#2563EB'; e.target.style.transform = 'translateY(0px)'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = '#112D4E'; e.target.style.transform = 'translateY(0)'; }} className="btn-right-what-intern" style={{ backgroundColor: '#112D4E', borderRadius: '10px', padding: isMobile ? '0.5rem 1rem' : '0.5rem 2rem', border: 'none', cursor: 'pointer' }} onClick={handleNext}>
                <img src={arwright} alt="Right Arrow" className="right-arrow-icon" />
            </button>
        </div>
                <div className='section-2-what-intern-container' style={{ display: 'flex', flexWrap: 'nowrap', justifyContent: isMobile ? 'center' : 'space-between', gap: isMobile ? '0' : '1rem', padding: isMobile ? '1rem 0' : '2rem 0'}}>
            {getVisibleCards().map((feature, index) => (
                <div key={index} className="section-2-what-intern-card" style={{ 
                    width: isMobile ? '90%' : isTablet ? 'calc(33.33% - 0.67rem)' : 'calc(25% - 0.75rem)', 
                    maxWidth: isMobile ? '768px' : 'none',
                    minHeight: isMobile ? '200px' : '350px',
                    flex: isMobile ? 'none' : '1',
                    padding: isMobile ? '1.25rem' : '1.5rem', 
                    color: '#112D4E', 
                    borderRadius: '8px', 
                    backgroundColor: '#DBE2EF', 
                    boxShadow: '0 2px 19px rgba(0, 0, 0, 0.1)' 
                }}>
                    <div className="name-whatinter-container" style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.5rem' : '1rem', color: '#112D4E', fontWeight: 'bold' }}>
                        <div className="profile-image-container" style={{ width: isMobile ? '80px' : '125px', height: isMobile ? '75px' : '60px', borderRadius: '50%', overflow: 'hidden' }}>
                            <img src={feature.pic} alt={feature.name} className="icon-number" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.5)' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <h4 style={{ fontSize: isMobile ? '0.8rem' : '1rem', margin: '0' }}>{feature.name}</h4>
                            <p style={{ fontSize: isMobile ? '0.6rem' : '0.75rem', margin: '0' }}>{feature.background}</p>
                        </div>
                    </div>
                    <p style={{ textAlign:'justify', fontSize: isMobile ? '0.8rem' : '1.1rem', margin: isMobile ? '0.5rem 0' : '1rem 0' }}>{feature.description}</p>
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                    key={star} 
                                    size={isMobile ? 16 : 20}
                                    style={{ 
                                        stroke: '#112D4E',
                                        strokeWidth: '1px',
                                        color: star <= feature.rating ? '#112d4e' : '#d1d5db',
                                        fill: star <= feature.rating ? '#112d4e' : '#d1d5db'
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
};

export default WhatIntern;
