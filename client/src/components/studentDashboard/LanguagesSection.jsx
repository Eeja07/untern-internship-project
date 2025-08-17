import React from 'react';

const LanguagesSection = ({ 
  languageList, 
  updateLanguage, 
  removeLanguage, 
  addLanguage, 
  isEditMode 
}) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ color: '#007bff', marginBottom: '15px' }}>Languages</h3>
      {languageList.map((language, index) => (
        <div key={language.id} style={{
          border: '1px solid #ddd',
          borderRadius: '6px',
          padding: '15px',
          marginBottom: '12px',
          backgroundColor: '#f8f9fa',
          maxWidth: '100%',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
            <h4 style={{ margin: 0, color: '#007bff' }}>Language #{index + 1}</h4>
            <button
              type="button"
              onClick={() => removeLanguage(language.id)}
              disabled={!isEditMode}
              style={{
                backgroundColor: !isEditMode ? '#6c757d' : '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '5px 10px',
                cursor: !isEditMode ? 'not-allowed' : 'pointer',
                fontSize: '12px'
              }}
            >
              Remove
            </button>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '12px',
            maxWidth: '100%'
          }}>
            <div style={{ minWidth: 0 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Language
              </label>
              <input
                type="text"
                value={language.language}
                onChange={(e) => updateLanguage(language.id, 'language', e.target.value)}
                placeholder="e.g., English, Spanish"
                disabled={!isEditMode}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: !isEditMode ? '#f8f9fa' : 'white',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div style={{ minWidth: 0 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Proficiency Level
              </label>
              <select
                value={language.proficiency}
                onChange={(e) => updateLanguage(language.id, 'proficiency', e.target.value)}
                disabled={!isEditMode}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: !isEditMode ? '#f8f9fa' : 'white',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Native">Native</option>
              </select>
            </div>
            <div style={{ minWidth: 0 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Certification
              </label>
              <input
                type="text"
                value={language.certification}
                onChange={(e) => updateLanguage(language.id, 'certification', e.target.value)}
                placeholder="e.g., TOEFL, IELTS"
                disabled={!isEditMode}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: !isEditMode ? '#f8f9fa' : 'white',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addLanguage}
        disabled={!isEditMode}
        style={{
          padding: '10px 20px',
          backgroundColor: !isEditMode ? '#6c757d' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: !isEditMode ? 'not-allowed' : 'pointer'
        }}
      >
        Add Language
      </button>
    </div>
  );
};

export default LanguagesSection;