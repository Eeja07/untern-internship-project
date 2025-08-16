import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../auth/AuthContext.jsx';
import { studentAPI } from '../auth/api.jsx';

const BuildProfile = () => {
  const { user, refreshUserProfile } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await studentAPI.getProfile();
      if (response.success) {
        setProfile(response.profile);
        setSkills(response.profile.skills || []);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const formData = new FormData(e.target);
      const profileData = {
        name: formData.get('name'),
        phone_number: formData.get('phone_number'),
        university: formData.get('university'),
        major: formData.get('major'),
        portfolio_url: formData.get('portfolio_url'),
        bio: formData.get('bio')
      };

      const response = await studentAPI.updateProfile(profileData);
      if (response.success) {
        await refreshUserProfile();
        await fetchProfile();
        alert('Profile updated successfully!');
      } else {
        console.error('Update failed:', response);
        alert(response.message || 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert(error.response?.data?.message || error.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    
    try {
      const response = await studentAPI.addSkill(newSkill.trim());
      if (response.success) {
        setSkills(response.skills);
        setNewSkill('');
      }
    } catch (error) {
      console.error('Failed to add skill:', error);
      alert(error.message || 'Failed to add skill');
    }
  };

  const handleRemoveSkill = async (skillName) => {
    try {
      const response = await studentAPI.removeSkill(skillName);
      if (response.success) {
        setSkills(response.skills);
      }
    } catch (error) {
      console.error('Failed to remove skill:', error);
      alert('Failed to remove skill');
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div>
      <h2 style={{ color: '#007bff', marginBottom: '20px' }}>Build Your Profile</h2>
      <div style={{
        background: '#f8f9fa',
        padding: '30px',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: '#007bff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            marginRight: '20px'
          }}>
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h3>{user?.email}</h3>
            <p style={{ color: '#6c757d' }}>Complete your profile to attract employers</p>
          </div>
        </div>

        {/* Student Profile Section */}
        <form onSubmit={handleSaveProfile}>
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#007bff', marginBottom: '20px' }}>Student Profile Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Student Profile ID
                </label>
                <input 
                  type="text" 
                  value={profile?.student_id || "Loading..."}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: '#f8f9fa'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Name
                </label>
                <input 
                  type="text" 
                  name="name"
                  placeholder="Your Full Name"
                  defaultValue={profile?.name || ""}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Phone Number
                </label>
                <input 
                  type="tel" 
                  name="phone_number"
                  placeholder="Your Phone Number"
                  defaultValue={profile?.phone_number || ""}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  University
                </label>
                <input 
                  type="text" 
                  name="university"
                  placeholder="Your University Name"
                  defaultValue={profile?.university || ""}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Major
                </label>
                <input 
                  type="text" 
                  name="major"
                  placeholder="e.g., Computer Science"
                  defaultValue={profile?.major || ""}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Portfolio URL
                </label>
                <input 
                  type="url" 
                  name="portfolio_url"
                  placeholder="https://your-portfolio.com"
                  defaultValue={profile?.portfolio_url || ""}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Resume URL
                </label>
                <input 
                  type="url" 
                  name="resume_url"
                  placeholder="https://your-resume-link.com"
                  defaultValue={profile?.resume_url || ""}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: '#f8f9fa'
                  }}
                />
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Bio
            </label>
            <textarea 
              rows="4"
              name="bio"
              defaultValue={profile?.bio || ""}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                resize: 'vertical'
              }}
              placeholder="Tell employers about yourself..."
            />
          </div>

          <button 
            type="submit"
            disabled={saving}
            style={{
              background: saving ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '4px',
              cursor: saving ? 'not-allowed' : 'pointer',
              marginTop: '20px'
            }}
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>

        {/* Skills Section */}
        <div style={{ marginTop: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            Skills
          </label>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '10px', 
            marginBottom: '15px',
            minHeight: '40px',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: '#f8f9fa'
          }}>
            {skills.map(skill => (
              <span key={skill} style={{
                padding: '5px 10px',
                backgroundColor: '#007bff',
                color: 'white',
                borderRadius: '15px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                {skill}
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
                  onClick={() => handleRemoveSkill(skill)}
                >
                  ×
                </button>
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
        
      </div>
    </div>
  );
};

export default BuildProfile;