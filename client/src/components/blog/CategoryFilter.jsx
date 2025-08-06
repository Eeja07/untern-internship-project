import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div style={{ marginBottom: '50px', textAlign: 'center' }}>
      <div style={{ 
        display: 'inline-flex', 
        gap: '10px', 
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            style={{
              padding: '10px 20px',
              backgroundColor: selectedCategory === category.id ? '#112D4E' : 'white',
              color: selectedCategory === category.id ? 'white' : '#112D4E',
              border: '2px solid #112D4E',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;