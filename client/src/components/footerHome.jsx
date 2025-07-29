import React from "react";
import '../App.css';
import yt from "../assets/ytFooter.svg";
import fb from "../assets/fbFooter.svg";
import tt from "../assets/ttFooter.svg";
import ig from "../assets/igFooter.svg";
import gmail from "../assets/gmailFooter.svg";
import location from "../assets/mapsFooter.svg";
import call from "../assets/callFooter.svg";
import wa from "../assets/waFooter.svg";
import { Divide } from "lucide-react";

const FooterHome = () => {
    return (
        <footer className="footer-home" style={{ backgroundColor: '#112D4E', color: 'white', padding: '20px 0' }}>
            <div className="container-footer" style={{ maxWidth: '1500px', margin: '0 auto', textAlign: 'left', padding: '0 20px' }}>
                <div className="footer-links1" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '10px', gap: '20px' }}>
                        <div className="footer-link1" style={{ display: 'flex', flexDirection: 'column', margin: '0', flex: '1', minWidth: '250px' }}>
                                <h2 style={{ color: 'white', fontSize: '1.25rem', margin: '0', padding: '1rem 0' }}>Untern</h2>
                                <p style={{ color: 'white', textDecoration: 'none', marginTop: '10px', lineHeight: '1.5' }}>Connecting students with valuable internship opportunities nationwide.</p>
                                <div className="footer-link" style={{padding:'2rem 0', display: 'flex', flexDirection: 'row', gap: '10px', margin: '0 0' }}>
                                    <button className="yt-footer-btn" style={{ backgroundColor: '#112D4E', borderRadius: '10px', boxShadow: '0 3px 10px rgba(0,0,0,0.75)', padding: '0.5rem 1rem', border: 'none', cursor: 'pointer' }}>
                                        <img src={yt} alt="YouTube" />
                                    </button>
                                    <button className="fb-footer-btn" style={{ backgroundColor: '#112D4E', borderRadius: '10px', boxShadow: '0 3px 10px rgba(0,0,0,0.75)', padding: '0.5rem 1rem', border: 'none', cursor: 'pointer' }}>
                                        <img src={fb} alt="Facebook" />
                                    </button>
                                    <button className="tt-footer-btn" style={{ backgroundColor: '#112D4E', borderRadius: '10px', boxShadow: '0 3px 10px rgba(0,0,0,0.75)', padding: '0.5rem 1rem', border: 'none', cursor: 'pointer' }}>
                                        <img src={tt} alt="TikTok" />
                                    </button>
                                    <button className="ig-footer-btn" style={{ backgroundColor: '#112D4E', borderRadius: '10px', boxShadow: '0 3px 10px rgba(0,0,0,0.75)', padding: '0.5rem 1rem', border: 'none', cursor: 'pointer' }}>
                                        <img src={ig} alt="Instagram" />
                                    </button>
                                </div>
                        </div>
                        <div className="footer-link2" style={{ display: 'flex', flexDirection: 'column', margin: '0', flex: '1', minWidth: '200px' }}>
                                <h2 style={{ color: 'white', fontSize: '1.25rem', margin: '0', padding: '1rem 0'}}>For Students</h2>
                                <a href="/discover-internships" style={{ color: 'white', textDecoration: 'none', marginTop: '10px', lineHeight: '1.6'}}>Discover Internships</a>
                                <a href="/build-profile" style={{ color: 'white', textDecoration: 'none', marginTop: '10px', lineHeight: '1.6'}}>Build Your Profile</a>
                                <a href="/track-applications" style={{ color: 'white', textDecoration: 'none', marginTop: '10px', lineHeight: '1.6' }}>Track Your Applications</a>
                                <a href="/success-stories" style={{ color: 'white', textDecoration: 'none', marginTop: '10px', lineHeight: '1.6' }}>Read Success Stories</a>
                                <a href="/company-reviews" style={{ color: 'white', textDecoration: 'none', marginTop: '10px', lineHeight: '1.6' }}>View Company Reviews</a>
                                <a href="/internship-certifications" style={{ color: 'white', textDecoration: 'none', marginTop: '10px', lineHeight: '1.6' }}>Receive Internship Certifications</a>
                        </div>
                        <div className="footer-link3" style={{ display: 'flex', flexDirection: 'column', margin: '0', flex: '1', minWidth: '200px'}}>
                                <h2 style={{ color: 'white', fontSize: '1.25rem', margin: '0', padding: '1rem 0' }}>For Companies</h2>
                                <a href="/post-internship" style={{ color: 'white', textDecoration: 'none', marginTop: '10px', lineHeight: '1.6'}}>Post Internship Openings</a>
                                <a href="/manage-applications" style={{ color: 'white', textDecoration: 'none', marginTop: '10px', lineHeight: '1.6' }}>Manage Internship Applications</a>
                                <a href="/pricing" style={{ color: 'white', textDecoration: 'none', marginTop: '10px', lineHeight: '1.6' }}>Check Pricing Information</a>
                                <a href="/partnerships" style={{ color: 'white', textDecoration: 'none', marginTop: '10px', lineHeight: '1.6'}}>Partnership Opportunities</a>
                                <a href="/analytics" style={{ color: 'white', textDecoration: 'none', marginTop: '10px', lineHeight: '1.6'}}>Access Analytics and Reporting</a>
                                <a href="/post-certifications" style={{ color: 'white', textDecoration: 'none', marginTop: '10px', lineHeight: '1.6'}}>Post Internship Certifications</a>
                        </div>
                        <div className="footer-link4" style={{ display: 'flex', flexDirection: 'column', margin: '0', flex: '1', minWidth: '250px' }}>
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
                <div className="footer-links2" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '40px', gap: '20px' }}>
                        <div className="footer-link5" style={{ display: 'flex', flexDirection: 'column', margin: '0', flex: '1' }}>
                                <h2 style={{ color: 'white', fontSize: '1.25rem', margin: '0', padding: '1rem 0' }}>About Us</h2>
                        </div>
                        <div className="footer-link6" style={{ display: 'flex', flexDirection: 'column', margin: '0', flex: '1' }}>
                                <h2 style={{ color: 'white', fontSize: '1.25rem', margin: '0', padding: '1rem 0' }}>Privacy Policy</h2>
                        </div>
                        <div className="footer-link7" style={{ display: 'flex', flexDirection: 'column', margin: '0', flex: '1' }}>
                                <h2 style={{ color: 'white', fontSize: '1.25rem', margin: '0', padding: '1rem 0' }}>Terms of Services</h2>
                        </div>
                        <div className="footer-link8" style={{ display: 'flex', flexDirection: 'column', margin: '0', flex: '1', padding: '1rem 0', alignItems: 'flex-start' }}>
                                <button className="get-started-btn" onClick={() => window.open('https://wa.me/6281288092766', '_blank')}  style={{
                                        backgroundColor: '#112D4E',
                                        width: '100%',
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