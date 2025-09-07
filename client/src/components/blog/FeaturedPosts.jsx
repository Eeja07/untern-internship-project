import React from 'react';

const FeaturedPosts = ({ posts }) => {
  if (!posts || posts.length === 0) return null;

  return (
    <div style={{ marginBottom: '60px' }}>
      <h2 style={{ 
        fontSize: '2.2rem', 
        marginBottom: 'clamp(20px, 5vw, 30px)',
        textAlign: 'center',
        color: '#2c3e50'
      }}>
        Featured Posts
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
        gap: 'clamp(20px, 4vw, 30px)',
        marginBottom: '40px',
        padding: '0 clamp(10px, 3vw, 20px)'
      }}>
        {posts.map(post => (
          <article
            key={post.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
            }}
          >
            <div style={{ height: 'clamp(200px, 25vw, 250px)', overflow: 'hidden' }}>
              <img 
                src={post.image}
                alt={post.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
            <div style={{ padding: 'clamp(20px, 4vw, 30px)' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '15px',
                fontSize: '0.9rem',
                color: '#6c757d'
              }}>
                <span style={{
                  backgroundColor: '#112D4E',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '15px',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}>
                  FEATURED
                </span>
                <span>{post.readTime}</span>
              </div>
              <h3 style={{
                fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
                marginBottom: '15px',
                color: '#2c3e50',
                fontWeight: '600',
                lineHeight: '1.3'
              }}>
                {post.title}
              </h3>
              <p style={{
                color: '#555',
                lineHeight: '1.7',
                marginBottom: '20px',
                fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
              }}>
                {post.excerpt}
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                color: '#6c757d',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <span>By {post.author}</span>
                <span>{post.date}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default FeaturedPosts;