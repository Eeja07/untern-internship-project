import picRealExp2 from "../../assets/realExp2.webp";

const Story = () => {
  return (
    <div className="story-section" style={{ padding: '80px 0', backgroundColor: '#DBE2EF' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '60px', 
          alignItems: 'center' 
        }}>
          <div style={{
            height: '450px',
            backgroundColor: 'white',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <img 
              src={picRealExp2}
              alt="Company Profile" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
          <div>
            <h2 style={{ 
              fontSize: '2.5rem', 
              marginBottom: '25px',
              color: '#2c3e50',
              fontWeight: '600'
            }}>
              Our Mission
            </h2>
            <p style={{ 
              fontSize: '1.2rem', 
              lineHeight: '1.8',
              color: '#555',
              marginBottom: '20px',
              textAlign: 'justify'
            }}>
              At Untern, we're passionate about creating pathways for the next generation of professionals. We believe that internships are more than just work experience—they're transformative opportunities that shape careers and drive innovation.
            </p>
            <p style={{ 
              fontSize: '1.2rem', 
              lineHeight: '1.8',
              color: '#555',
              textAlign: 'justify'
            }}>
              Founded in 2025, we've grown from a simple idea to a comprehensive platform that serves thousands of students and companies across Indonesia and beyond.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Story;