import React from 'react';
import { studentAPI } from '../auth/api.jsx';

const PersonalInformation = ({ 
  profile, 
  user, 
  isEditMode, 
  phoneVerification, 
  setPhoneVerification,
  sendPhoneVerification,
  verifyPhone,
  handleCVUpload,
  fetchProfile // Add this prop to refresh profile after removal
}) => {
  // Function to get filename from resume URL
  const getFileName = (resumeUrl) => {
    if (!resumeUrl) return '';
    const filename = resumeUrl.split('/').pop();
    // Remove the timestamp prefix (resume-timestamp-randomnumber-)
    return filename.replace(/^resume-\d+-\d+-/, '');
  };

  // Function to handle CV removal
  const handleRemoveCV = async () => {
    if (window.confirm('Are you sure you want to remove your CV?')) {
      try {
        const response = await studentAPI.removeResume();
        if (response.success) {
          alert('CV removed successfully!');
          if (fetchProfile) {
            await fetchProfile(); // Refresh profile to update UI
          }
        }
      } catch (error) {
        console.error('Error removing CV:', error);
        if (error.message?.includes('401') || error.message?.includes('403') || error.code === 'TOKEN_EXPIRED') {
          alert('Session expired. Please login again.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        } else {
          alert(`Failed to remove CV: ${error.message || 'Unknown error'}`);
        }
      }
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ color: '#007bff', marginBottom: '15px' }}>Personal Information</h3>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '15px',
        maxWidth: '100%'
      }}>
        <div style={{ minWidth: 0 }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Student Profile ID
          </label>
          <input 
            type="text" 
            value={profile?.student_id || "Loading..."}
            disabled
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: '#f8f9fa',
              boxSizing: 'border-box'
            }}
          />
        </div>
        <div style={{ minWidth: 0 }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Full Name
          </label>
          <input 
            type="text" 
            name="name"
            placeholder="Your Full Name"
            defaultValue={profile?.name || ""}
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
            Email Address
          </label>
          <input 
            type="email" 
            name="email"
            placeholder="your.email@example.com"
            defaultValue={profile?.email || user?.email || ""}
            disabled
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
            Phone Number
            {phoneVerification.isVerified && (
              <span style={{ color: '#28a745', fontSize: '12px', marginLeft: '5px' }}>✓ Verified</span>
            )}
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="tel" 
              name="phone_number"
              placeholder="Your Phone Number"
              defaultValue={profile?.phone_number || ""}
              disabled={!isEditMode}
              style={{
                flex: 1,
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: !isEditMode ? '#f8f9fa' : 'white',
                boxSizing: 'border-box'
              }}
            />
            {!phoneVerification.isVerified && isEditMode && (
              <button
                type="button"
                onClick={sendPhoneVerification}
                style={{
                  padding: '10px 15px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Verify
              </button>
            )}
          </div>
          {phoneVerification.codeSent && !phoneVerification.isVerified && isEditMode && (
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Verification Code"
                value={phoneVerification.code}
                onChange={(e) => setPhoneVerification({...phoneVerification, code: e.target.value})}
                style={{
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '12px',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={verifyPhone}
                disabled={phoneVerification.isVerifying}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                {phoneVerification.isVerifying ? 'Verifying...' : 'Confirm'}
              </button>
            </div>
          )}
        </div>
        <div style={{ minWidth: 0 }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Portfolio URL
          </label>
          <input 
            type="url" 
            name="portfolio_url"
            placeholder="https://your-portfolio.com"
            defaultValue={profile?.portfolio_url || ""}
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
            CV Upload
          </label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleCVUpload}
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
              {profile?.resume_url && !isEditMode && (
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  bottom: '0',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: '#f8f9fa',
                  color: '#495057',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  boxSizing: 'border-box'
                }}>
                  📄 {getFileName(profile.resume_url)}
                </div>
              )}
            </div>
            {profile?.resume_url && (
              <>
                <a
                  href={`${import.meta.env.VITE_API_URL || ''}${profile.resume_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '10px 15px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  View CV
                </a>
                {isEditMode && (
                  <button
                    type="button"
                    onClick={handleRemoveCV}
                    style={{
                      padding: '10px 15px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Remove CV
                  </button>
                )}
              </>
            )}
          </div>
        </div>
        <div style={{ gridColumn: '1 / -1', minWidth: 0 }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Address
          </label>
          <input 
            type="text" 
            name="address"
            placeholder="Your complete address"
            defaultValue={profile?.address || ""}
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
  );
};

export default PersonalInformation;