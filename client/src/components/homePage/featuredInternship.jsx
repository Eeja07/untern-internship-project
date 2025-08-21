import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const FeaturedInternships = ({ onForStudentsClick, onClose }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [lastAction, setLastAction] = useState(null);
  const [featuredInternships, setFeaturedInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user && lastAction === 'student' && user.userType === 'student') {
      navigate('/student-dashboard/featured');
      setLastAction(null);
    }
    fetchFeaturedInternships();
  }, [isAuthenticated, user, lastAction, navigate]);

  const fetchFeaturedInternships = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/featured-internships');
      const data = await response.json();

      if (data.success) {
        setFeaturedInternships(data.internships);
      }
    } catch (error) {
      console.error('Error fetching featured internships:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleForStudentsClick = (e) => {
    e.preventDefault();
    if (isAuthenticated && user?.userType === 'student') {
      navigate('/student-dashboard/featured');
      return;
    }
    if (isAuthenticated && user?.userType === 'company') {
      alert('You are already logged in as a company. Please log out to access student features.');
      return;
    }
    setLastAction('student');
    if (onForStudentsClick) {
      onForStudentsClick(); 
    }
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary not specified';
    if (min && max) return `Rp ${min?.toLocaleString()} - Rp ${max?.toLocaleString()}`;
    if (min) return `From Rp ${min?.toLocaleString()}`;
    if (max) return `Up to Rp ${max?.toLocaleString()}`;
  };

  // Split featured internships into two rows of 3
  const firstRowInternships = featuredInternships.slice(0, 3);
  const secondRowInternships = featuredInternships.slice(3, 6);
  

  return (
    <div className="featured-internships" style={{ backgroundColor: '#DBE2EF' }}>
      <div className="container-fi" style={{maxWidth:'1500px', margin:'0 auto'}}>
        <div className="section-header" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4rem 0'}}>
          <h2 style={{fontWeight: '100'}}>Featured Internship</h2>
          <button onClick={handleForStudentsClick} style={{ backgroundColor: '#112D4E',color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer', fontSize: '1.125rem', fontWeight: '600' }}onMouseEnter={(e) => { e.target.style.backgroundColor = '#2563EB'; e.target.style.transform = 'translateY(0px)'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = '#112D4E'; e.target.style.transform = 'translateY(0)'; }} className="view-all-btn">View All →</button>
        </div>
        <div className="internships-grid" style={{ display: 'flex', flexDirection: 'column'}}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#112D4E' }}>
              <p>Loading featured internships...</p>
            </div>
          ) : featuredInternships.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#112D4E' }}>
              <p>No featured internships available at the moment.</p>
            </div>
          ) : (
            <>
              {/* First Row - First 3 internships */}
              {firstRowInternships.length > 0 && (
                <div className="internship-grid1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div className='internship-card-header1' style={{ marginBottom:'2rem', display:'flex', gap:'2rem', width:'100%', padding: '2rem', color: '#112D4E', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 19px rgba(0, 0, 0, 0.1)' }}>
                    {firstRowInternships.map((internship) => (
                      <div key={internship.internship_id} className="internship-card" style={{ width: '30%', padding: '1rem', color: '#112D4E', borderRadius: '8px', backgroundColor: '#DBE2EF', boxShadow: '0 2px 19px rgba(0, 0, 0, 0.1)' }}>
                        <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
                          <div className="company-logo">
                            {internship.logo_url ? (
                              <img 
                                src={`http://localhost:4000${internship.logo_url}`} 
                                alt={`${internship.company_name} logo`} 
                                style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} 
                              />
                            ) : (
                              <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '8px',
                                backgroundColor: '#112D4E',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '20px',
                                fontWeight: 'bold'
                              }}>
                                {internship.company_name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="internship-info">
                            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{internship.title}</h3>
                            <p className="company" style={{ fontWeight:'600', margin: 0 }}>{internship.company_name}</p>
                            <small style={{ color: '#6c757d' }}>{internship.application_count} applications</small>
                          </div>
                        </div>

                        <div className="internship-details" style={{ color: '#112D4E',display: 'flex', flexDirection: 'column', gap: '0.5rem', backgroundColor: 'white', padding: '1rem', borderRadius: '8px' }}>
                          <div className="detail-item">
                            <span className="icon">📍 </span>
                            <span>{internship.location || 'Location not specified'}</span>
                          </div>
                          <div className="detail-item">
                            <span className="icon">💼 </span>
                            <span>{internship.type || 'Type not specified'}</span>
                          </div>
                          <div className="detail-item">
                            <span className="icon">💰 </span>
                            <span>{formatSalary(internship.salary_min, internship.salary_max)}</span>
                          </div>
                          <div className="detail-item">
                            <span className="icon">⏰ </span>
                            <span>{internship.duration_months ? `${internship.duration_months} months` : 'Duration not specified'}</span>
                          </div>
                        </div>
                        <button className="apply-btn" onClick={handleForStudentsClick} style={{fontWeight:'600', marginTop:'1rem', marginLeft:'auto', marginRight:'auto', backgroundColor: '#112D4E', color: 'white', borderRadius: '5px', cursor: 'pointer', padding: '0.75rem 1.5rem', border: 'none', boxShadow: '0 2px 19px rgba(0, 0, 0, 0.1)', display: 'block', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.target.style.backgroundColor = '#2563EB'; e.target.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = '#112D4E'; e.target.style.transform = 'translateY(0)'; }}>Apply Now</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Second Row - Next 3 internships */}
              {secondRowInternships.length > 0 && (
                <div className="internship-grid2" style={{ display: 'flex', padding:'2rem 0',alignItems: 'center', justifyContent: 'space-between' }}>
                  <div className='internship-card-header2' style={{ marginBottom:'2rem', display:'flex', gap:'2rem', width:'100%', padding: '2rem', color: '#112D4E', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 19px rgba(0, 0, 0, 0.1)' }}>
                    {secondRowInternships.map((internship) => (
                      <div key={internship.internship_id} className="internship-card" style={{width: '30%', padding: '1rem', color: '#112D4E', borderRadius: '8px', backgroundColor: '#DBE2EF', boxShadow: '0 2px 19px rgba(0, 0, 0, 0.1)'}}>
                        <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
                          <div className="company-logo">
                            {internship.logo_url ? (
                              <img 
                                src={`http://localhost:4000${internship.logo_url}`} 
                                alt={`${internship.company_name} logo`} 
                                style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} 
                              />
                            ) : (
                              <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '8px',
                                backgroundColor: '#112D4E',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '20px',
                                fontWeight: 'bold'
                              }}>
                                {internship.company_name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="internship-info">
                            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{internship.title}</h3>
                            <p className="company" style={{ fontWeight:'600', margin: 0 }}>{internship.company_name}</p>
                            <small style={{ color: '#6c757d' }}>{internship.application_count} applications</small>
                          </div>
                        </div>
                        
                        <div className="internship-details" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', backgroundColor: 'white', padding: '1rem', borderRadius: '8px' }}>
                          <div className="detail-item">
                            <span className="icon">📍 </span>
                            <span>{internship.location || 'Location not specified'}</span>
                          </div>
                          <div className="detail-item">
                            <span className="icon">💼 </span>
                            <span>{internship.type || 'Type not specified'}</span>
                          </div>
                          <div className="detail-item">
                            <span className="icon">💰 </span>
                            <span>{formatSalary(internship.salary_min, internship.salary_max)}</span>
                          </div>
                          <div className="detail-item">
                            <span className="icon">⏰ </span>
                            <span>{internship.duration_months ? `${internship.duration_months} months` : 'Duration not specified'}</span>
                          </div>
                        </div>
                        <button className="apply-btn" onClick={handleForStudentsClick} style={{fontWeight:'600',marginTop:'1rem', marginLeft:'auto', marginRight:'auto', backgroundColor: '#112D4E', color: 'white', borderRadius: '5px', cursor: 'pointer', padding: '0.75rem 1.5rem', border: 'none', boxShadow: '0 2px 19px rgba(0, 0, 0, 0.1)', display: 'block', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.target.style.backgroundColor = '#2563EB'; e.target.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = '#112D4E'; e.target.style.transform = 'translateY(0)'; }}>Apply Now</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedInternships;