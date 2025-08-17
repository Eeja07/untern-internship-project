import React from 'react';

const SkillsSection = ({ 
  skills, 
  newSkill, 
  setNewSkill, 
  handleAddSkill, 
  handleRemoveSkill, 
  isEditMode 
}) => {
  return (
    <div style={{ marginTop: '15px' }}>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
        Skills
      </label>
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '8px', 
        marginBottom: '12px',
        minHeight: '35px',
        padding: '8px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: '#f8f9fa'
      }}>
        {skills.map((skill, index) => (
          <span key={skill.skill_name || index} style={{
            padding: '5px 10px',
            backgroundColor: '#007bff',
            color: 'white',
            borderRadius: '15px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            {skill.skill_name || skill}
            {isEditMode && (
              <button 
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '0',
                  marginLeft: '5px'
                }}
                onClick={() => handleRemoveSkill(skill.skill_name || skill)}
              >
                ×
              </button>
            )}
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Add a skill (e.g., React, Python, Design)"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
        <button 
          type="button"
          onClick={handleAddSkill}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add Skill
        </button>
      </div>
    </div>
  );
};

export default SkillsSection;