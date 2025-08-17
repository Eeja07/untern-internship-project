import React from 'react';

const ExperienceSection = ({ 
  title,
  experienceList, 
  addExperience, 
  updateExperience, 
  removeExperience, 
  isEditMode,
  experienceType 
}) => {
  const renderFields = (experience, index) => {
    switch (experienceType) {
      case 'work':
        return (
          <>
            <div style={{ minWidth: 0 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Job Title
              </label>
              <input
                type="text"
                value={experience.title}
                onChange={(e) => updateExperience(experience.id, 'title', e.target.value)}
                placeholder="e.g., Software Developer"
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
                Company
              </label>
              <input
                type="text"
                value={experience.company}
                onChange={(e) => updateExperience(experience.id, 'company', e.target.value)}
                placeholder="Company Name"
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
                <input
                  type="checkbox"
                  checked={experience.current}
                  onChange={(e) => updateExperience(experience.id, 'current', e.target.checked)}
                  disabled={!isEditMode}
                  style={{ marginRight: '5px' }}
                />
                Currently Working Here
              </label>
            </div>
          </>
        );
      
      case 'event':
        return (
          <>
            <div style={{ minWidth: 0 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Event Name
              </label>
              <input
                type="text"
                value={experience.event_name}
                onChange={(e) => updateExperience(experience.id, 'event_name', e.target.value)}
                placeholder="e.g., Tech Conference 2023"
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
                Role
              </label>
              <input
                type="text"
                value={experience.role}
                onChange={(e) => updateExperience(experience.id, 'role', e.target.value)}
                placeholder="e.g., Volunteer, Speaker"
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
                Organization
              </label>
              <input
                type="text"
                value={experience.organization}
                onChange={(e) => updateExperience(experience.id, 'organization', e.target.value)}
                placeholder="Organizing Organization"
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
          </>
        );

      case 'organization':
        return (
          <>
            <div style={{ minWidth: 0 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Organization Name
              </label>
              <input
                type="text"
                value={experience.organization_name}
                onChange={(e) => updateExperience(experience.id, 'organization_name', e.target.value)}
                placeholder="e.g., Student Association"
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
                Role
              </label>
              <input
                type="text"
                value={experience.role}
                onChange={(e) => updateExperience(experience.id, 'role', e.target.value)}
                placeholder="e.g., President, Member"
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
                <input
                  type="checkbox"
                  checked={experience.current}
                  onChange={(e) => updateExperience(experience.id, 'current', e.target.checked)}
                  disabled={!isEditMode}
                  style={{ marginRight: '5px' }}
                />
                Currently Active
              </label>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ color: '#007bff', marginBottom: '15px' }}>{title}</h3>
      {experienceList.map((experience, index) => (
        <div key={experience.id} style={{
          border: '1px solid #ddd',
          borderRadius: '6px',
          padding: '15px',
          marginBottom: '12px',
          backgroundColor: '#f8f9fa',
          maxWidth: '100%',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
            <h4 style={{ margin: 0, color: '#007bff' }}>{title} #{index + 1}</h4>
            <button
              type="button"
              onClick={() => removeExperience(experience.id)}
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
            {renderFields(experience, index)}
            <div style={{ minWidth: 0 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Location
              </label>
              <input
                type="text"
                value={experience.location}
                onChange={(e) => updateExperience(experience.id, 'location', e.target.value)}
                placeholder="City, Country"
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
                Start Date
              </label>
              <input
                type="date"
                value={experience.start_date}
                onChange={(e) => updateExperience(experience.id, 'start_date', e.target.value)}
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
                End Date
              </label>
              <input
                type="date"
                value={experience.end_date}
                onChange={(e) => updateExperience(experience.id, 'end_date', e.target.value)}
                disabled={!isEditMode || experience.current}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: (!isEditMode || experience.current) ? '#f8f9fa' : 'white',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div style={{ gridColumn: '1 / -1', minWidth: 0 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Description
              </label>
              <textarea
                value={experience.description}
                onChange={(e) => updateExperience(experience.id, 'description', e.target.value)}
                placeholder="Describe your role and responsibilities..."
                rows="3"
                disabled={!isEditMode}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  resize: 'vertical',
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
        onClick={addExperience}
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
        Add {title}
      </button>
    </div>
  );
};

export default ExperienceSection;