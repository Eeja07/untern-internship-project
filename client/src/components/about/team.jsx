import React from 'react';

const Team = () => {
  const teamMembers = [
    {
      name: "Mahija Ibad",
      role: "CEO",
      bio: "Visionary leader with 4+ years experience in Tech and business strategy. Passionate about connecting students with meaningful opportunities.",
      image: "MI"
    },
    {
      name: "Mahija Ibad",
      role: "CTO",
      bio: "Tech lead with expertise in full-stack development and platform architecture. Previously at Microsoft and several successful startups.",
      image: "MI"
    },
    {
      name: "Mahija Ibad",
      role: "CFO",
      bio: "Financial strategist with deep expertise in business operations, growth planning, and investor relations in the education sector.",
      image: "MI"
    }
  ];

  return (
    <div className="team-section" style={{ padding: '80px 0', backgroundColor: 'white' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <h2 style={{ 
          fontSize: '2.5rem', 
          textAlign: 'center',
          marginBottom: '20px',
          color: '#2c3e50',
          fontWeight: '600'
        }}>
          Meet Our Team
        </h2>
        <p style={{ 
          fontSize: '1.2rem', 
          textAlign: 'center',
          marginBottom: '50px',
          color: '#6c757d',
          maxWidth: '600px',
          margin: '0 auto 50px'
        }}>
          We're a passionate team of educators, technologists, and career enthusiasts dedicated to transforming the internship experience.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '40px'
        }}>
          {teamMembers.map((member, index) => (
            <div key={index} style={{
              backgroundColor: '#DBE2EF',
              borderRadius: '16px',
              padding: '40px 30px',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: '#112D4E',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                margin: '0 auto 20px'
              }}>
                {member.image}
              </div>
              <h3 style={{ 
                fontSize: '1.4rem',
                marginBottom: '8px',
                color: '#2c3e50',
                fontWeight: '600'
              }}>
                {member.name}
              </h3>
              <p style={{ 
                color: '#112D4E',
                fontWeight: '500',
                marginBottom: '15px'
              }}>
                {member.role}
              </p>
              <p style={{ 
                color: '#555',
                lineHeight: '1.6',
                fontSize: '0.95rem'
              }}>
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;