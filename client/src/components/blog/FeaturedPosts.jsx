import React from 'react';

const FeaturedPosts = ({ posts }) => {
  if (!posts || posts.length === 0) return null;

  return (
    <div style={{ marginBottom: '60px' }}>
      <h2 style={{ 
        fontSize: '2.2rem', 
        marginBottom: '30px',
        textAlign: 'center',
        color: '#2c3e50'
      }}>
        Featured Posts
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '30px',
        marginBottom: '40px'
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
            <div style={{ height: '250px', overflow: 'hidden' }}>
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
            <div style={{ padding: '30px' }}>
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
                fontSize: '1.6rem',
                marginBottom: '15px',
                color: '#2c3e50',
                fontWeight: '600'
              }}>
                {post.title}
              </h3>
              <p style={{
                color: '#555',
                lineHeight: '1.7',
                marginBottom: '20px'
              }}>
                {post.excerpt}
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.9rem',
                color: '#6c757d'
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