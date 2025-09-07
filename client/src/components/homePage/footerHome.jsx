import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import yt from "../../assets/ytFooter.svg";
import fb from "../../assets/fbFooter.svg";
import tt from "../../assets/ttFooter.svg";
import ig from "../../assets/igFooter.svg";
import gmail from "../../assets/gmailFooter.svg";
import location from "../../assets/mapsFooter.svg";
import call from "../../assets/callFooter.svg";
import wa from "../../assets/waFooter.svg";

const FooterHome = ({ onForStudentsClick, onForCompaniesClick }) => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const [lastAction, setLastAction] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isAuthenticated && user) {
            if (lastAction && lastAction.startsWith('student') && user.userType === 'student') {
                const path = lastAction === 'student' ? '/student-dashboard' : lastAction.replace('student:', '');
                navigate(path);
                setLastAction(null);
            } else if (lastAction && lastAction.startsWith('company') && user.userType === 'company') {
                const path = lastAction === 'company' ? '/company-dashboard' : lastAction.replace('company:', '');
                navigate(path);
                setLastAction(null);
            }
        }
    }, [isAuthenticated, user, lastAction, navigate]);

    const handleStudentNavigation = (path) => (e) => {
        e.preventDefault();
        
        console.log('Student navigation clicked:', { path, isAuthenticated, userType: user?.userType });
        
        // Check if user is authenticated and is a student
        if (isAuthenticated && user?.userType === 'student') {
            console.log('Navigating to:', path);
            navigate(path);
        } else if (isAuthenticated && user?.userType === 'company') {
            // If authenticated as company, show message or redirect
            alert('Please log in as a student to access this feature');
        } else {
            // If not authenticated, show student login modal
            console.log('Opening student modal');
            setLastAction(path ? `student:${path}` : 'student');
            if (onForStudentsClick) {
                onForStudentsClick();
            }
        }
    };


    const handleCompaniesNavigation = (path) => (e) => {
        e.preventDefault();
        
        console.log('Company navigation clicked:', { path, isAuthenticated, userType: user?.userType });
        
        // Check if user is authenticated and is a company
        if (isAuthenticated && user?.userType === 'company') {
            console.log('Navigating to:', path);
            navigate(path);
        } else if (isAuthenticated && user?.userType === 'student') {
            // If authenticated as student, show message or redirect
            alert('Please log in as a company to access this feature');
        } else {
            // If not authenticated, show company login modal
            console.log('Opening company modal');
            setLastAction(path ? `company:${path}` : 'company');
            if (onForCompaniesClick) {
                onForCompaniesClick();
            }
        }
    };

    return (
        <footer className="footer-home" style={{ backgroundColor: '#112D4E', color: 'white', padding: '20px 0' }}>
            <div className="container-footer" style={{ maxWidth: '1500px', margin: '0 auto', textAlign: 'left', padding: '0 20px' }}>
                <div className="footer-links1" style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', marginTop: '10px', gap: '20px' }}>
                        <div className="footer-link1" style={{ display: 'flex', flexDirection: 'column', margin: '0', flex: '1', minWidth: isMobile ? 'auto' : '250px' }}>
                                <h2 onClick={() => navigate('/')} style={{ color: 'white', fontSize: '1.25rem', margin: '0', padding: '1rem 0' }}>Untern</h2>
                                <p style={{ color: 'white', textDecoration: 'none', marginTop: '10px', lineHeight: '1.5' }}>Connecting students with valuable internship opportunities nationwide.</p>
                                <div className="footer-link" style={{padding:'2rem 0', display: 'flex', flexDirection: 'row', gap: '10px', margin: '0 0' }}>
                                    <button className="yt-footer-btn" onClick={() => window.open('https://youtube.com/', '_blank')} style={{ backgroundColor: '#112D4E', borderRadius: '10px', boxShadow: '0 3px 10px rgba(0,0,0,0.75)', padding: '0.5rem 1rem', border: 'none', cursor: 'pointer' }}>
                                        <img src={yt} alt="YouTube" />
                                    </button>
                                    <button className="fb-footer-btn" onClick={() => window.open('https://facebook.com/', '_blank')} style={{ backgroundColor: '#112D4E', borderRadius: '10px', boxShadow: '0 3px 10px rgba(0,0,0,0.75)', padding: '0.5rem 1rem', border: 'none', cursor: 'pointer' }}>
                                        <img src={fb} alt="Facebook" />
                                    </button>
                                    <button className="tt-footer-btn" onClick={() => window.open('https://tiktok.com/', '_blank')} style={{ backgroundColor: '#112D4E', borderRadius: '10px', boxShadow: '0 3px 10px rgba(0,0,0,0.75)', padding: '0.5rem 1rem', border: 'none', cursor: 'pointer' }}>
                                        <img src={tt} alt="TikTok" />
                                    </button>
                                    <button className="ig-footer-btn" onClick={() => window.open('https://instagram.com/', '_blank')} style={{ backgroundColor: '#112D4E', borderRadius: '10px', boxShadow: '0 3px 10px rgba(0,0,0,0.75)', padding: '0.5rem 1rem', border: 'none', cursor: 'pointer' }}>
                                        <img src={ig} alt="Instagram" />
                                    </button>
                                </div>
                        </div>
                        <div className="footer-link2" style={{ display: 'flex', flexDirection: 'column', margin: '0', flex: '1', minWidth: isMobile ? 'auto' : '200px' }}>
                                <h2 onClick={handleStudentNavigation()} style={{ color: 'white', fontSize: '1.25rem', margin: '0', padding: '1rem 0', cursor:'pointer'}}>For Students</h2>
                                <a onClick={handleStudentNavigation('/student-dashboard/search')} style={{ color: 'white', textDecoration: 'none', marginTop: '10px', lineHeight: '1.6', cursor: 'pointer'}}>Discover Internships</a>
                                <a onClick={handleStudentNavigation('/student-dashboard/profile')} style={{ color: 'white', textDecoration: 'none', marginTop: '10px', lineHeight: '1.6', cursor: 'pointer'}}>Build Your Profile</a>
                                <a onClick={handleStudentNavigation('/student-dashboard/applications')} style={{ color: 'white', textDecoration: 'none', marginTop: '10px', lineHeight: '1.6', cursor: 'pointer' }}>Track Your Applications</a>
                                <a onClick={handleStudentNavigation('/student-dashboard/success-stories')} style={{ color: 'white', textDecoration: 'none', marginTop: '10px', lineHeight: '1.6', cursor: 'pointer' }}>Read Success Stories</a>
                                <a onClick={handleStudentNavigation('/student-dashboard/company-reviews')} style={{ color: 'white', textDecoration: 'none', marginTop: '10px', lineHeight: '1.6', cursor: 'pointer' }}>View Company Reviews</a>
                                <a onClick={handleStudentNavigation('/student-dashboard/certifications')} style={{ color: 'white', textDecoration: 'none', marginTop: '10px', lineHeight: '1.6', cursor: 'pointer' }}>Receive Internship Certifications</a>
                        </div>
                        <div className="footer-link3" style={{ display: 'flex', flexDirection: 'column', margin: '0', flex: '1', minWidth: isMobile ? 'auto' : '200px'}}>
                                <h2 onClick={handleCompaniesNavigation()} style={{ color: 'white', fontSize: '1.25rem', margin: '0', padding: '1rem 0', cursor:'pointer'}}>For Companies</h2>
                                <a onClick={handleCompaniesNavigation('/company-dashboard/post-internship')} style={{ color: 'white', textDecoration: 'none', marginTop: '10px', lineHeight: '1.6', cursor: 'pointer'}}>Post Internship Openings</a>
                                <a onClick={handleCompaniesNavigation('/company-dashboard/manage-applications')} style={{ color: 'white', textDecoration: 'none', marginTop: '10px', lineHeight: '1.6', cursor: 'pointer' }}>Manage Internship Applications</a>
                                <a onClick={handleCompaniesNavigation('/company-dashboard/pricing')} style={{ color: 'white', textDecoration: 'none', marginTop: '10px', lineHeight: '1.6', cursor: 'pointer' }}>Check Pricing Information</a>
                                <a onClick={handleCompaniesNavigation('/company-dashboard/partnerships')} style={{ color: 'white', textDecoration: 'none', marginTop: '10px', lineHeight: '1.6', cursor: 'pointer'}}>Partnership Opportunities</a>
                                <a onClick={handleCompaniesNavigation('/company-dashboard/analytics')} style={{ color: 'white', textDecoration: 'none', marginTop: '10px', lineHeight: '1.6', cursor: 'pointer'}}>Access Analytics and Reporting</a>
                                <a onClick={handleCompaniesNavigation('/company-dashboard/post-certifications')} style={{ color: 'white', textDecoration: 'none', marginTop: '10px', lineHeight: '1.6', cursor: 'pointer'}}>Post Internship Certifications</a>
                        </div>
                        <div className="footer-link4" style={{ display: 'flex', flexDirection: 'column', margin: '0', flex: '1', minWidth: isMobile ? 'auto' : '250px' }}>
                                <h2 style={{ color: 'white', fontSize: '1.25rem', margin: '0', padding: '1rem 0' }}>Contact Us</h2>
                                <button className="contact-btn" onClick={() => window.location.href = 'mailto:mahijapradipta86@gmail.com'} style={{ backgroundColor: '#112D4E', color: 'white', boxShadow:'0 3px 10px rgba(0,0,0,0.75)', padding: '10px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '10px', width: '100%' }}>
                                    <img src={gmail} alt="Email" style={{ width: '20px', height: '20px', marginRight: '10px' }} />
                                    <span style={{ color: 'white', textDecoration: 'none' }}>mahijapradipta86@gmail.com</span>
                                </button>
                                <button className="call-btn" onClick={() => window.open('https://wa.me/6281288092766', '_blank')} style={{ backgroundColor: '#112D4E', color: 'white', boxShadow:'0 3px 10px rgba(0,0,0,0.75)',padding: '10px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '10px', width: '100%' }}>
                                    <img src={call} alt="Call" style={{ width: '20px', height: '20px', marginRight: '10px' }} />
                                    <span style={{ color: 'white', textDecoration: 'none' }}>+62 812-8809-2766</span>
                                </button>
                                <button className="location-btn" onClick={() => window.location.href = 'https://maps.app.goo.gl/XMsQXQ9B9ShZD78y9'} style={{ backgroundColor: '#112D4E', boxShadow:'0 3px 10px rgba(0,0,0,0.75)', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
                                    <img src={location} alt="Location" style={{ width: '20px', height: '20px', marginRight: '10px', flexShrink: 0 }} />
                                    <span style={{ color: 'white', textDecoration: 'none', textAlign: 'left' }}>ITS, Kec. Sukolilo, Surabaya, Jawa Timur 60117</span>
                                </button>
                        </div>
                </div>
                <div className="footer-links2" style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', marginTop: '40px', gap: '20px' }}>
                        <div className="footer-link5" style={{ display: 'flex', flexDirection: 'column', margin: '0', flex: '1', cursor: 'pointer' }}>
                                <h2 onClick={() => navigate('/about')} style={{ color: 'white', fontSize: '1.25rem', margin: '0', padding: '1rem 0' }}>About Us</h2>
                        </div>
                        <div className="footer-link6" style={{ display: 'flex', flexDirection: 'column', margin: '0', flex: '1', cursor: 'pointer' }}>
                                <h2 onClick={() => navigate('/privacy')} style={{ color: 'white', fontSize: '1.25rem', margin: '0', padding: '1rem 0' }}>Privacy Policy</h2>
                        </div>
                        <div className="footer-link7" style={{ display: 'flex', flexDirection: 'column', margin: '0', flex: '1', cursor: 'pointer' }}>
                                <h2 onClick={() => navigate('/terms')} style={{ color: 'white', fontSize: '1.25rem', margin: '0', padding: '1rem 0' }}>Terms of Services</h2>
                        </div>
                        <div className="footer-link8" style={{ display: 'flex', flexDirection: 'column', margin: '0', flex: '1', padding: '1rem 0', alignItems: 'flex-start' }}>
                                <button className="get-started-btn" onClick={() => window.open('https://wa.me/6281288092766', '_blank')}  style={{
                                        backgroundColor: '#112D4E',
                                        width: isMobile ? '100%' : '100%',
                                        color: 'white',
                                        padding: '12px 24px',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        fontSize: '1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow:'0 3px 10px rgba(0,0,0,0.75)',
                                        gap: '8px'
                                }}>
                                    <img src={wa} alt="Call" style={{ width: '20px', height: '20px', marginRight: '10px' }} />
                                    <span style={{ color: 'white', textDecoration: 'none' }}>Chat Us</span>
                                </button>
                        </div>
                </div>
                <p style={{ padding: '3rem 0 1rem 0', margin: '0', fontSize: '1rem', textAlign: 'center'}}>
                    © {new Date().getFullYear()} Untern. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default FooterHome;