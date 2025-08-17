import React from 'react';

const CertificationsSection = ({ 
  certificationList, 
  updateCertification, 
  removeCertification, 
  addCertification, 
  isEditMode 
}) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ color: '#007bff', marginBottom: '15px' }}>Certifications</h3>
      {certificationList.map((certification, index) => (
        <div key={certification.id} style={{
          border: '1px solid #ddd',
          borderRadius: '6px',
          padding: '15px',
          marginBottom: '12px',
          backgroundColor: '#f8f9fa',
          maxWidth: '100%',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
            <h4 style={{ margin: 0, color: '#007bff' }}>Certification #{index + 1}</h4>
            <button
              type="button"
              onClick={() => removeCertification(certification.id)}
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
                Certification Name
              </label>
              <input
                type="text"
                value={certification.name}
                onChange={(e) => updateCertification(certification.id, 'name', e.target.value)}
                placeholder="e.g., AWS Solutions Architect"
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
                Issuing Organization
              </label>
              <input
                type="text"
                value={certification.issuing_organization}
                onChange={(e) => updateCertification(certification.id, 'issuing_organization', e.target.value)}
                placeholder="e.g., Amazon Web Services"
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
                Issue Date
              </label>
              <input
                type="date"
                value={certification.issue_date}
                onChange={(e) => updateCertification(certification.id, 'issue_date', e.target.value)}
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
                Expiry Date
              </label>
              <input
                type="date"
                value={certification.expiry_date}
                onChange={(e) => updateCertification(certification.id, 'expiry_date', e.target.value)}
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
                Credential ID
              </label>
              <input
                type="text"
                value={certification.credential_id}
                onChange={(e) => updateCertification(certification.id, 'credential_id', e.target.value)}
                placeholder="Credential ID"
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
                Credential URL
              </label>
              <input
                type="url"
                value={certification.credential_url}
                onChange={(e) => updateCertification(certification.id, 'credential_url', e.target.value)}
                placeholder="https://credential-url.com"
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
                value={certification.description}
                onChange={(e) => updateCertification(certification.id, 'description', e.target.value)}
                placeholder="Additional details about this certification..."
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
        onClick={addCertification}
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
        Add Certification
      </button>
    </div>
  );
};

export default CertificationsSection;