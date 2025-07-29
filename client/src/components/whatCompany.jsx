import React from "react";
// It's better practice to use relative paths for assets so your project is portable.
// For example: import pio from '../assets/pio.webp;
import pio from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/pio.svg';
import mae from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/mae.svg';
import bytp from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/bytp.svg';
import arwleft from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/arwleft.svg';
import arwright from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/arwright.svg';
import jeff from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/jeff.svg';
import eeja from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/eeja.webp';
import { Star } from 'lucide-react';
import '../App.css';

const WhatCompany = () => {
    // FIX: Initialize the state for the carousel's index
    const [currentIndex, setCurrentIndex] = React.useState(0);

    const whatCompanyCards = [
    {
        id: 1, // It's good practice to add a unique ID for keys
        name: 'Mahija Ibad',
        background: 'Human Resources at Eeja, Inc.',
        description: 'loremipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.loremipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.loremipsum dolor sit amet, consectetur adipiscing elit.',
        pic: eeja
    },
    {
        id: 2,
        name: 'Mark Elliot Zuckerberg',
        background: 'Chief Executive Officer at Facebook, Inc.',
        description: 'loremipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.loremipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.loremipsum dolor sit amet, consectetur adipiscing elit.',
        pic: eeja
    },
    {
        id: 3,
        name: 'Jeffrey Preston Bezos',
        background: 'Founder and Executive Chairman at Amazon, Inc.',
        description: 'loremipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.loremipsum dolor sit amet, consectetur adipiscing elit.',
        pic: jeff
    },
    {
        id: 4,
        name: 'Jeffrey Preston Bezos',
        background:  'Founder and Executive Chairman at Amazon, Inc.',
        description: 'loremipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.loremipsum dolor sit amet, consectetur adipiscing elit.',
        pic: jeff
    }
    ];

    const handlePrevious = () => {
        setCurrentIndex(prevIndex => 
            prevIndex === 0 ? whatCompanyCards.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex(prevIndex => 
            prevIndex === whatCompanyCards.length - 1 ? 0 : prevIndex + 1
        );
    };

    const getVisibleCards = () => {
        const cardsToShow = 4; 
        const result = [];
        for (let i = 0; i < cardsToShow; i++) {
            const index = (currentIndex + i) % whatCompanyCards.length;
            result.push(whatCompanyCards[index]);
        }
        return result;
    };
    
    
return (
    <div className="container-what-company" style={{maxWidth:'1500px', margin: '0 auto' }}>
        <div className="section-1-what-company" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding:'2rem 0'}}>
            <button className="btn-left-what-company" style={{ backgroundColor: '#112D4E', borderRadius: '10px', padding: '0.5rem 2rem', border: 'none', cursor: 'pointer' }} onClick={handlePrevious}>
                <img src={arwleft} alt="Left Arrow" className="left-arrow-icon" />
            </button>
            <h2 style={{ textAlign: 'center', fontWeight: '100' }} className="section-what-company-title">What <span style={{ fontWeight: 'bold' }}>Company</span> Think About <span className="palette3">Untern</span></h2>
            <button className="btn-right-what-company" style={{ backgroundColor: '#112D4E', borderRadius: '10px', padding: '0.5rem 2rem', border: 'none', cursor: 'pointer' }} onClick={handleNext}>
                <img src={arwright} alt="Right Arrow" className="right-arrow-icon" />
            </button>
        </div>
        <div className='section-2-what-company-container' style={{ display: 'flex', justifyContent: 'space-between', padding:'2rem 0'}}>
            {getVisibleCards().map((feature) => (
                // FIX: Use a unique and stable key, like an id from your data.
                <div key={feature.id} className="section-2-what-company-card" style={{ width: '21%', padding: '1rem', color: '#112D4E', borderRadius: '8px', backgroundColor: '#DBE2EF', boxShadow: '0 2px 19px rgba(0, 0, 0, 0.1)' }}>
                    <div className="name-whatinter-container" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#112D4E', fontWeight: 'bold' }}>
                        <div className="profile-image-container" style={{ width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden' }}>
                            <img src={feature.pic} alt={feature.name} className="icon-number" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <h4 style={{ fontSize: '1rem', margin: '0' }}>{feature.name}</h4>
                            <p style={{ fontSize: '0.75rem', margin: '0', fontWeight: 'normal'}}>{feature.background}</p>
                        </div>
                    </div>
                    <p style={{ fontSize: '0.9rem', margin: '1rem 0' }}>{feature.description}</p>
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                            {[...Array(4)].map((_, i) => (
                                <Star key={i} className="w-5 h-5 fill-blue-600 text-blue-600" />
                            ))}
                            <Star className="w-5 h-5 fill-blue-300 text-blue-300" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
};

export default WhatCompany;