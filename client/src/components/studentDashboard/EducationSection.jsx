import React from 'react';

const EducationSection = ({ 
  educationList, 
  updateEducation, 
  removeEducation, 
  addEducation, 
  isEditMode 
}) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ color: '#007bff', marginBottom: '15px' }}>Education Background</h3>
      {educationList.map((education, index) => (
        <div key={education.id} style={{
          border: '1px solid #ddd',
          borderRadius: '6px',
          padding: '15px',
          marginBottom: '12px',
          backgroundColor: '#f8f9fa',
          maxWidth: '100%',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
            <h4 style={{ margin: 0, color: '#007bff' }}>Education #{index + 1}</h4>
            <button
              type="button"
              onClick={() => removeEducation(education.id)}
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
                Degree Level
              </label>
              <select
                value={education.degree}
                onChange={(e) => updateEducation(education.id, 'degree', e.target.value)}
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
                <option value="">Select Degree</option>
                <option value="High School">High School</option>
                <option value="Associate">Associate</option>
                <option value="Bachelor">Bachelor</option>
                <option value="Master">Master</option>
                <option value="Doctor">Doctor</option>
                <option value="Professor">Professor</option>
              </select>
            </div>
            <div style={{ minWidth: 0 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Institution
              </label>
              <input
                type="text"
                value={education.institution}
                onChange={(e) => updateEducation(education.id, 'institution', e.target.value)}
                placeholder="University/School Name"
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
                Field of Study
              </label>
              <input
                type="text"
                value={education.field_of_study}
                onChange={(e) => updateEducation(education.id, 'field_of_study', e.target.value)}
                placeholder="e.g., Computer Science"
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
                Grade/GPA
              </label>
              <input
                type="text"
                value={education.grade}
                onChange={(e) => updateEducation(education.id, 'grade', e.target.value)}
                placeholder="e.g., 3.8/4.0 or A"
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
                value={education.start_date}
                onChange={(e) => updateEducation(education.id, 'start_date', e.target.value)}
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
                value={education.end_date}
                onChange={(e) => updateEducation(education.id, 'end_date', e.target.value)}
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
            <div style={{ gridColumn: '1 / -1', minWidth: 0 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Description
              </label>
              <textarea
                value={education.description}
                onChange={(e) => updateEducation(education.id, 'description', e.target.value)}
                placeholder="Additional details about your education..."
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
        onClick={addEducation}
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
        Add Education
      </button>
    </div>
  );
};

export default EducationSection;