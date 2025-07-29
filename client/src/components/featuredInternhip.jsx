import React from 'react';
// import './FeaturedInternships.css';

const FeaturedInternships = () => {
  const internships_1 = [
    {
      id: 1,
      title: 'AI Prompt Engineer',
      company: 'Telu, Inc.',
      location: 'Jakarta, Blangladesh, US',
      type: 'Full-time',
      salary: 'Rp 5,000,000/month',
      duration: '6 months',
    },
    {
      id: 2,
      title: 'AI Prompt Engineer',
      company: 'Telu, Inc.',
      location: 'Jakarta, Washington, US',
      type: 'Part-time',
      salary: 'Rp 3,500,000/month',
      duration: '3 months',
    },
    {
      id: 3,
      title: 'AI Prompt Engineer',
      company: 'Telu, Inc.',
      location: 'Jakarta, Blangladesh, US',
      type: 'Full-time',
      salary: 'Rp 4,500,000/month',
      duration: '6 months',
    }
  ];
  const internships_2 = [
    {
      id: 4,
      title: 'AI Prompt Engineer',
      company: 'Telu, Inc.',
      location: 'Jakarta, Washington, US',
      type: 'Remote',
      salary: 'Rp 6,000,000/month',
      duration: '4 months',
    },
    {
      id: 5,
      title: 'AI Prompt Engineer',
      company: 'Telu, Inc.',
      location: 'Jakarta, Blangladesh, US',
      type: 'Full-time',
      salary: 'Rp 5,500,000/month',
      duration: '6 months',
    },
    {
      id: 6,
      title: 'AI Prompt Engineer',
      company: 'Telu, Inc.',
      location: 'Jakarta, Washington, US',
      type: 'Part-time',
      salary: 'Rp 4,000,000/month',
      duration: '3 months',
    }
  ];
  

  return (
    <div className="featured-internships" style={{ backgroundColor: '#DBE2EF' }}>
      <div className="container-fi" style={{maxWidth:'1500px', margin:'0 auto'}}>
        <div className="section-header" style={{padding: '4rem 0'}}>
          <h2 style={{fontWeight: '100'}}>Featured Internship</h2>
          <button style={{ backgroundColor: '#112D4E',color: 'white' }} className="view-all-btn">View All →</button>
        </div>
        
        <div className="internships-grid" style={{ display: 'flex', flexDirection: 'column'}}>
          <div className="internship-grid1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className='internship-card-header1' style={{ marginBottom:'2rem', display:'flex', gap:'2rem', width:'100%', padding: '2rem', color: '#112D4E', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 19px rgba(0, 0, 0, 0.1)' }}>
              {internships_1.map((internship) => (
                <div key={internship.id} className="internship-card" style={{ width: '30%', padding: '1rem', color: '#112D4E', borderRadius: '8px', backgroundColor: '#DBE2EF', boxShadow: '0 2px 19px rgba(0, 0, 0, 0.1)' }}>
                  <div className="card-header">
                    <div className="company-logo">
                      <div className="logo-placeholder">AI</div>
                    </div>
                    <div className="internship-info">
                      <h3>{internship.title}</h3>
                      <p className="company" style={{ fontWeight:'600'}}>{internship.company}</p>
                    </div>
                  </div>

                  <div className="internship-details" style={{ color: '#112D4E',display: 'flex', flexDirection: 'column', gap: '0.5rem', backgroundColor: 'white', padding: '1rem', borderRadius: '8px' }}>
                    <div className="detail-item">
                      <span className="icon">📍 </span>
                      <span>{internship.location}</span>
                    </div>
                    <div className="detail-item">
                      <span className="icon">💼 </span>
                      <span>{internship.type}</span>
                    </div>
                    <div className="detail-item">
                      <span className="icon">💰 </span>
                      <span>{internship.salary}</span>
                    </div>
                    <div className="detail-item">
                      <span className="icon">⏰ </span>
                      <span>{internship.duration}</span>
                    </div>
                  </div>
                  <button className="apply-btn" style={{ marginTop:'1rem',  backgroundColor: '#112D4E', color: 'white', borderRadius: '5px', cursor: 'pointer', padding: '0.75rem 1.5rem', border: 'none', boxShadow: '0 2px 19px rgba(0, 0, 0, 0.1)', display: 'block', margin: '0 auto', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.target.style.backgroundColor = '#0d1f3a'; e.target.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = '#112D4E'; e.target.style.transform = 'translateY(0)'; }}>Apply Now</button>
                </div>
              ))}
            </div>
          </div>
          <div className="internship-grid2" style={{ display: 'flex', padding:'2rem 0',alignItems: 'center', justifyContent: 'space-between' }}>
            <div className='internship-card-header2' style={{ marginBottom:'2rem', display:'flex', gap:'2rem', width:'100%', padding: '2rem', color: '#112D4E', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 19px rgba(0, 0, 0, 0.1)' }}>
              {internships_2.map((internship) => (
                <div key={internship.id} className="internship-card" style={{width: '30%', padding: '1rem', color: '#112D4E', borderRadius: '8px', backgroundColor: '#DBE2EF', boxShadow: '0 2px 19px rgba(0, 0, 0, 0.1)'}}>
                  <div className="card-header">
                    <div className="company-logo">
                      <div className="logo-placeholder">AI</div>
                    </div>
                    <div className="internship-info">
                      <h3>{internship.title}</h3>
                      <p className="company" style={{ fontWeight:'600'}}>{internship.company}</p>
                    </div>
                  </div>
                  
                  <div className="internship-details" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', backgroundColor: 'white', padding: '1rem', borderRadius: '8px' }}>
                    <div className="detail-item">
                      <span className="icon">📍 </span>
                      <span>{internship.location}</span>
                    </div>
                    <div className="detail-item">
                      <span className="icon">💼 </span>
                      <span>{internship.type}</span>
                    </div>
                    <div className="detail-item">
                      <span className="icon">💰 </span>
                      <span>{internship.salary}</span>
                    </div>
                    <div className="detail-item">
                      <span className="icon">⏰ </span>
                      <span>{internship.duration}</span>
                    </div>
                  </div>
                  <button className="apply-btn" style={{ marginTop:'1rem', backgroundColor: '#112D4E', color: 'white', borderRadius: '5px', cursor: 'pointer', padding: '0.75rem 1.5rem', border: 'none', boxShadow: '0 2px 19px rgba(0, 0, 0, 0.1)', display: 'block', margin: '0 auto', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.target.style.backgroundColor = '#0d1f3a'; e.target.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = '#112D4E'; e.target.style.transform = 'translateY(0)'; }}>Apply Now</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedInternships;