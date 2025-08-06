import React from 'react';

const Values = () => {
  const values = [
    {
      title: "Accessibility",
      description: "We believe every student deserves access to quality internship opportunities, regardless of their background or location.",
      icon: "🌍"
    },
    {
      title: "Quality",
      description: "We carefully vet our partner companies to ensure students get meaningful, educational internship experiences.",
      icon: "⭐"
    },
    {
      title: "Support",
      description: "Our dedicated team provides ongoing support to both students and companies throughout the internship journey.",
      icon: "🤝"
    }
  ];

  return (
    <div className="values-section" style={{ padding: '80px 0', backgroundColor: '#DBE2EF' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <h2 style={{ 
          fontSize: '2.5rem', 
          textAlign: 'center',
          marginBottom: '50px',
          color: '#2c3e50',
          fontWeight: '600'
        }}>
          Core Values
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '40px'
        }}>
          {values.map((value, index) => (
            <div key={index} style={{
              padding: '40px 30px',
              textAlign: 'center',
              backgroundColor: 'white',
              borderRadius: '16px',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ 
                fontSize: '3rem',
                marginBottom: '20px'
              }}>
                {value.icon}
              </div>
              <h3 style={{ 
                fontSize: '1.5rem',
                marginBottom: '15px',
                color: '#2c3e50',
                fontWeight: '600'
              }}>
                {value.title}
              </h3>
              <p style={{ 
                color: '#555',
                lineHeight: '1.7',
                fontSize: '1rem'
              }}>
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Values;