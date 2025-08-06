import React from 'react';

const LatestPosts = ({ posts, selectedCategory, categories }) => {
  const categoryName = selectedCategory === 'all' 
    ? 'Latest Posts' 
    : categories.find(c => c.id === selectedCategory)?.name;

  return (
    <div>
      <h2 style={{ 
        fontSize: '2.2rem', 
        marginBottom: '30px',
        textAlign: 'center',
        color: '#2c3e50'
      }}>
        {categoryName}
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '30px'
      }}>
        {posts.map(post => (
          <article
            key={post.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 2px 15px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 6px 25px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 15px rgba(0,0,0,0.1)';
            }}
          >
            <div style={{ height: '200px', overflow: 'hidden' }}>
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
            <div style={{ padding: '25px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '12px',
                fontSize: '0.85rem',
                color: '#6c757d'
              }}>
                <span>{post.readTime}</span>
              </div>
              <h3 style={{
                fontSize: '1.3rem',
                marginBottom: '12px',
                color: '#2c3e50',
                fontWeight: '600'
              }}>
                {post.title}
              </h3>
              <p style={{
                color: '#555',
                lineHeight: '1.6',
                marginBottom: '15px',
                fontSize: '0.95rem'
              }}>
                {post.excerpt}
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.85rem',
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

export default LatestPosts;