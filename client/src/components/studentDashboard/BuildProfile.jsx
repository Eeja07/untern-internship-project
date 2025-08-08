import React, { useContext } from 'react';
import AuthContext from '../auth/AuthContext.jsx';

const BuildProfile = () => {
  const { user } = useContext(AuthContext);

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
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#007bff', marginBottom: '20px' }}>Student Profile Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                User ID
              </label>
              <input 
                type="text" 
                value={user?.user_id || "Loading..."}
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
                Student Profile ID
              </label>
              <input 
                type="text" 
                value={user?.student_profile_id || "Loading..."}
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
                defaultValue={user?.name || ""}
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
                defaultValue={user?.phone_number || ""}
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
                defaultValue={user?.university || ""}
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
                defaultValue={user?.major || ""}
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
                Graduation Date
              </label>
              <input 
                type="date" 
                name="graduation_date"
                defaultValue={user?.graduation_date || ""}
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
                defaultValue={user?.portfolio_url || ""}
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
                defaultValue={user?.resume_url || ""}
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
                Profile Picture URL
              </label>
              <input 
                type="url" 
                name="profile_picture_url"
                placeholder="https://your-profile-picture.com"
                defaultValue={user?.profile_picture_url || ""}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
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
            defaultValue={user?.bio || ""}
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
            {/* Sample skills - in real app, these would come from user?.skills */}
            {['React', 'JavaScript', 'Python', 'SQL'].map(skill => (
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
                  onClick={() => {/* Remove skill logic */}}
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
              style={{
                flex: 1,
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
            <button 
              type="button"
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
        
        <button style={{
          background: '#007bff',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '20px'
        }}>
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default BuildProfile;