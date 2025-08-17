import React from 'react';
import { studentAPI } from '../auth/api.jsx';

const ProfileHeader = ({ 
  user, 
  profilePicturePreview, 
  handleProfilePictureChange, 
  isEditMode, 
  setIsEditMode, 
  saving, 
  handleSaveProfile,
  fetchProfile, // Add this prop to refresh profile after removal
  setProfilePicturePreview // Add this prop to update preview
}) => {
  
  // Function to handle profile picture removal
  const handleRemoveProfilePicture = async () => {
    if (window.confirm('Are you sure you want to remove your profile picture?')) {
      try {
        const response = await studentAPI.removeProfilePicture();
        if (response.success) {
          alert('Profile picture removed successfully!');
          setProfilePicturePreview(null); // Clear the preview
          if (fetchProfile) {
            await fetchProfile(); // Refresh profile to update UI
          }
        }
      } catch (error) {
        console.error('Error removing profile picture:', error);
        if (error.message?.includes('401') || error.message?.includes('403') || error.code === 'TOKEN_EXPIRED') {
          alert('Session expired. Please login again.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        } else {
          alert(`Failed to remove profile picture: ${error.message || 'Unknown error'}`);
        }
      }
    }
  };
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
      <div style={{ position: 'relative', marginRight: '20px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: profilePicturePreview ? 'transparent' : '#007bff',
          backgroundImage: profilePicturePreview ? `url(${profilePicturePreview})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer',
          border: '3px solid #007bff'
        }}>
          {!profilePicturePreview && (
            (user?.name?.charAt(0) || 
             user?.firstName?.charAt(0) || 'S').toUpperCase()
          )}
        </div>
        <input
          type="file"
          id="profilePicture"
          accept="image/*"
          onChange={handleProfilePictureChange}
          style={{ display: 'none' }}
        />
        <label
          htmlFor="profilePicture"
          style={{
            position: 'absolute',
            bottom: '0',
            right: '0',
            backgroundColor: '#28a745',
            color: 'white',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          +
        </label>
        {profilePicturePreview && isEditMode && (
          <button
            type="button"
            onClick={handleRemoveProfilePicture}
            style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            ×
          </button>
        )}
      </div>
      <div>
        <h3>{user?.name || (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Student')}</h3>
        <p style={{ color: '#6c757d' }}>Complete your profile to attract employers</p>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
        {!isEditMode ? (
          <button
            type="button"
            onClick={() => setIsEditMode(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Edit Profile
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setIsEditMode(false)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel Edit
            </button>
            <button 
              type="submit"
              form="profileForm"
              disabled={saving}
              style={{
                background: saving ? '#6c757d' : '#28a745',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: saving ? 'not-allowed' : 'pointer'
              }}
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;       