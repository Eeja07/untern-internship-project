import React from "react";
import pio from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/pio.svg';
import mae from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/mae.svg';
import bytp from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/bytp.svg';
import arwleft from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/arwleft.svg';
import arwright from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/arwright.svg';
import jeff from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/jeff.svg';
import eeja from '/home/eeja/Downloads/Github/Untern-webApp-internship-winnicode/client/src/assets/eeja.svg';
import { Grid, Star } from 'lucide-react';
import '../App.css';

const WhatIntern = () => {
    const whatInternCards = [
    {
        name: 'Mahija Ibad',
        background: 'Undergraduate Student At Institute Technology Sepuluh Nopember',
        description: 'loremipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.loremipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.loremipsum dolor sit amet, consectetur adipiscing elit.',
        pic: eeja
    },
    {
        name: 'Mark Elliot Zuckerberg',
        background: 'Undergraduate Student At Harvard University',
        description: 'loremipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.loremipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.loremipsum dolor sit amet, consectetur adipiscing elit.',
        pic: eeja
    },
    {
        name: 'Jeffrey Preston Bezos',
        background: 'Undergraduate Student At Princeton University',
        description: 'loremipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.loremipsum dolor sit amet, consectetur adipiscing elit.',
        pic: jeff
    },
    {
        name: 'Jeffrey Preston Bezos',
        background: 'Undergraduate Student At Princeton University',
        description: 'loremipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.loremipsum dolor sit amet, consectetur adipiscing elit.',
        pic: jeff
    }
    ];
    
return (
    <div className="container-what-intern">
        <div className="section-1-what-intern" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '3rem 15rem' }}>
            <button className="btn-left-what-intern" style={{ backgroundColor: '#112D4E', borderRadius: '10px', padding: '0.5rem 2rem', border: 'none', cursor: 'pointer' }}>
                <img src={arwleft} alt="Left Arrow" className="left-arrow-icon" />
            </button>
            <h2 style={{ textAlign: 'center', fontWeight: '100' }} className="section-what-intern-title">What <span style={{ fontWeight: 'bold' }}>Intern</span> Think About <span className="palette3">Untern</span></h2>
            <button className="btn-right-what-intern" style={{ backgroundColor: '#112D4E', borderRadius: '10px', padding: '0.5rem 2rem', border: 'none', cursor: 'pointer' }}>
                <img src={arwright} alt="Right Arrow" className="right-arrow-icon" />
            </button>
        </div>
        <div className='section-2-what-intern-container' style={{ display: 'flex', flexWrap: 'center', justifyContent: 'space-between', margin: '0 15rem' }}>
            {whatInternCards.map((feature, index) => (
                <div key={index} className="section-2-what-intern-card" style={{ width: '21%', padding: '1rem', color: '#112D4E', borderRadius: '8px', backgroundColor: '#DBE2EF', boxShadow: '0 2px 19px rgba(0, 0, 0, 0.1)' }}>
                    <div className="name-whatinter-container" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#112D4E', fontWeight: 'bold' }}>
                        <div className="profile-image-container">
                            <img src={feature.pic} alt={feature.name} className="icon-number" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <h4 style={{ fontSize: '1rem' }}>{feature.name}</h4>
                            <p style={{ fontSize: '0.75rem'}}>{feature.background}</p>
                        </div>
                    </div>
                    <p style={{ fontSize: '1.1rem', margin: '1rem 0' }}>{feature.description}</p>
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4].map((star) => (
                                <Star key={star} className="w-5 h-5 fill-blue-600 text-blue-600" />
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

export default WhatIntern;
