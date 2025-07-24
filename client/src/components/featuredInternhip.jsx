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
      tags: ['AI', 'Machine Learning']
    },
    {
      id: 2,
      title: 'AI Prompt Engineer',
      company: 'Telu, Inc.',
      location: 'Jakarta, Washington, US',
      type: 'Part-time',
      salary: 'Rp 3,500,000/month',
      duration: '3 months',
      tags: ['AI', 'NLP']
    },
    {
      id: 3,
      title: 'AI Prompt Engineer',
      company: 'Telu, Inc.',
      location: 'Jakarta, Blangladesh, US',
      type: 'Full-time',
      salary: 'Rp 4,500,000/month',
      duration: '6 months',
      tags: ['AI', 'Deep Learning']
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
      tags: ['AI', 'Remote Work']
    },
    {
      id: 5,
      title: 'AI Prompt Engineer',
      company: 'Telu, Inc.',
      location: 'Jakarta, Blangladesh, US',
      type: 'Full-time',
      salary: 'Rp 5,500,000/month',
      duration: '6 months',
      tags: ['AI', 'Research']
    },
    {
      id: 6,
      title: 'AI Prompt Engineer',
      company: 'Telu, Inc.',
      location: 'Jakarta, Washington, US',
      type: 'Part-time',
      salary: 'Rp 4,000,000/month',
      duration: '3 months',
      tags: ['AI', 'Innovation']
    }
  ];
  

  return (
    <div className="featured-internships">
      <div className="container">
        <div className="section-header" style={{margin: '0 15rem', marginTop: '3rem', padding: '2rem 0'}}>
          <h2 style={{fontWeight: '100'}}>Featured Internship</h2>
          <button style={{ backgroundColor: '#112D4E',color: 'white' }} className="view-all-btn">View All →</button>
        </div>
        
        <div className="internships-grid" style={{ display: 'flex', flexDirection: 'column'}}>
          <div className="internship-grid1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '1rem 15rem' }}>
          {internships_1.map((internship) => (
            <div key={internship.id} className="internship-card" style={{ width: '30%', padding: '1rem', color: '#112D4E', borderRadius: '8px', backgroundColor: '#DBE2EF', boxShadow: '0 2px 19px rgba(0, 0, 0, 0.1)' }}>
              <div className="card-header">
                <div className="company-logo">
                  <div className="logo-placeholder">AI</div>
                </div>
                <div className="internship-info">
                  <h3>{internship.title}</h3>
                  <p className="company">{internship.company}</p>
                </div>
              </div>
              
              <div className="internship-details">
                <div className="detail-item">
                  <span className="icon">📍</span>
                  <span>{internship.location}</span>
                </div>
                <div className="detail-item">
                  <span className="icon">💼</span>
                  <span>{internship.type}</span>
                </div>
                <div className="detail-item">
                  <span className="icon">💰</span>
                  <span>{internship.salary}</span>
                </div>
                <div className="detail-item">
                  <span className="icon">⏰</span>
                  <span>{internship.duration}</span>
                </div>
              </div>
              
              <div className="tags">
                {internship.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
              
              <button className="apply-btn">Apply Now</button>
            </div>
          ))}
          </div>
          <div className="internship-grid2" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '1rem 15rem' }}>
          {internships_2.map((internship) => (
            <div key={internship.id} className="internship-card" style={{width: '30%', padding: '1rem', color: '#112D4E', borderRadius: '8px', backgroundColor: '#DBE2EF', boxShadow: '0 2px 19px rgba(0, 0, 0, 0.1)'}}>
              <div className="card-header">
                <div className="company-logo">
                  <div className="logo-placeholder">AI</div>
                </div>
                <div className="internship-info">
                  <h3>{internship.title}</h3>
                  <p className="company">{internship.company}</p>
                </div>
              </div>
              
              <div className="internship-details">
                <div className="detail-item">
                  <span className="icon">📍</span>
                  <span>{internship.location}</span>
                </div>
                <div className="detail-item">
                  <span className="icon">💼</span>
                  <span>{internship.type}</span>
                </div>
                <div className="detail-item">
                  <span className="icon">💰</span>
                  <span>{internship.salary}</span>
                </div>
                <div className="detail-item">
                  <span className="icon">⏰</span>
                  <span>{internship.duration}</span>
                </div>
              </div>
              
              <div className="tags">
                {internship.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
              
              <button className="apply-btn">Apply Now</button>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedInternships;