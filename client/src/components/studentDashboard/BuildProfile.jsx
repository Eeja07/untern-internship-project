import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../auth/AuthContext.jsx';
import { studentAPI } from '../auth/api.jsx';
import ProfileHeader from './ProfileHeader.jsx';
import PersonalInformation from './PersonalInformation.jsx';
import EducationSection from './EducationSection.jsx';
import LanguagesSection from './LanguagesSection.jsx';
import CertificationsSection from './CertificationsSection.jsx';
import ExperienceSection from './ExperienceSection.jsx';
import SkillsSection from './SkillsSection.jsx';

const BuildProfile = ({ onProfileSaved }) => {
  const { user, refreshUserProfile } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);
  const [educationList, setEducationList] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [phoneVerification, setPhoneVerification] = useState({
    code: '',
    isVerified: false,
    isVerifying: false,
    codeSent: false
  });
  const [languageList, setLanguageList] = useState([]);
  const [certificationList, setCertificationList] = useState([]);
  const [workExperienceList, setWorkExperienceList] = useState([]);
  const [eventExperienceList, setEventExperienceList] = useState([]);
  const [organizationExperienceList, setOrganizationExperienceList] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      // console.log('Token exists:', !!token);
      // console.log('Token value:', token ? token.substring(0, 20) + '...' : 'null');
      
      // Fetch student profile
      const profileResponse = await studentAPI.getProfile();
      // console.log('Profile response:', profileResponse);
      
      if (profileResponse.success) {
        setProfile(profileResponse.profile);
        
        // Parse and set education
        if (profileResponse.profile.education) {
          try {
            const parsedEducation = typeof profileResponse.profile.education === 'string' 
              ? JSON.parse(profileResponse.profile.education) 
              : profileResponse.profile.education;
            setEducationList(Array.isArray(parsedEducation) ? parsedEducation : []);
          } catch (error) {
            console.error('Error parsing education:', error);
            setEducationList([]);
          }
        }
        
        // Set profile picture preview if exists
        if (profileResponse.profile.profile_picture_url) {
          const imageUrl = profileResponse.profile.profile_picture_url.startsWith('http') 
            ? profileResponse.profile.profile_picture_url
            : `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${profileResponse.profile.profile_picture_url}`;
          setProfilePicturePreview(imageUrl);
        }
      }
      
      // Fetch skills
      const skillsResponse = await studentAPI.getSkills();
      // console.log('Skills response:', skillsResponse);
      
      if (skillsResponse.success) {
        setSkills(skillsResponse.skills || []);
      }
      
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.message?.includes('401') || error.message?.includes('403') || error.code === 'TOKEN_EXPIRED') {
        alert('Session expired. Please login again.');
        // Clear auth data and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else {
        alert(`Failed to load profile: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      // Debug token before saving
      const token = localStorage.getItem('token');
      console.log('Save Profile - Token exists:', !!token);
      console.log('Save Profile - Token value:', token ? token.substring(0, 20) + '...' : 'null');
      
      if (!token) {
        alert('Please login first to save your profile');
        return;
      }
      
      // Get form data from the form
      const formData = new FormData(e.target);
      const profileData = {
        name: formData.get('name') || profile?.name || '',
        phone_number: formData.get('phone_number') || profile?.phone_number || '',
        email: formData.get('email') || profile?.email || '',
        address: formData.get('address') || profile?.address || '',
        bio: formData.get('bio') || profile?.bio || '',
        portfolio_url: formData.get('portfolio_url') || profile?.portfolio_url || '',
        education: educationList
      };
      
      console.log('Saving profile data:', profileData);
      
      const response = await studentAPI.updateProfile(profileData);
      
      if (response.success) {
        // Update local user context if needed
        if (refreshUserProfile) {
          try {
            await refreshUserProfile();
          } catch (refreshError) {
            console.error('Error refreshing user profile:', refreshError);
            // Continue even if refresh fails
          }
        }
        // Show success message
        console.log('Profile updated successfully');
        alert('Profile updated successfully!');
        setIsEditMode(false);
        
        // Refresh profile data
        fetchProfile();
        if (onProfileSaved) onProfileSaved();
      }
      
    } catch (error) {
      console.error('Error saving profile:', error);
      if (error.message?.includes('401') || error.message?.includes('403') || error.code === 'TOKEN_EXPIRED') {
        alert('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else {
        alert(`Failed to save profile: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    
    try {
      const response = await studentAPI.addSkill(newSkill.trim());
      if (response.success) {
        setSkills(prev => [...prev, { skill_name: newSkill.trim() }]);
        setNewSkill('');
      }
    } catch (error) {
      console.error('Error adding skill:', error);
      // Handle error
    }
  };

  const handleRemoveSkill = async (skillName) => {
    try {
      const response = await studentAPI.removeSkill(skillName);
      if (response.success) {
        setSkills(prev => prev.filter(skill => skill.skill_name !== skillName));
      }
    } catch (error) {
      console.error('Error removing skill:', error);
      // Handle error
    }
  };

    const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => setProfilePicturePreview(e.target.result);
      reader.readAsDataURL(file);
      
      // Upload the file
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      const response = await studentAPI.uploadProfilePicture(formData);
      if (response.success) {
        alert('Profile picture uploaded successfully!');
        await fetchProfile(); // Refresh profile
        
        // Update preview with the new URL
        const newImageUrl = response.profile_picture_url.startsWith('http') 
          ? response.profile_picture_url
          : `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${response.profile_picture_url}`;
        setProfilePicturePreview(newImageUrl);
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      if (error.message?.includes('401') || error.message?.includes('403') || error.code === 'TOKEN_EXPIRED') {
        alert('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else {
        alert(`Failed to upload profile picture: ${error.message || 'Unknown error'}`);
      }
      setProfilePicturePreview(null); // Reset preview on error
    }
  };

    const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const formData = new FormData();
      formData.append('cv', file);
      
      const response = await studentAPI.uploadResume(formData);
      if (response.success) {
        alert('CV uploaded successfully!');
        await fetchProfile(); // Refresh to show the uploaded CV
      }
    } catch (error) {
      console.error('Error uploading CV:', error);
      if (error.message?.includes('401') || error.message?.includes('403') || error.code === 'TOKEN_EXPIRED') {
        alert('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else {
        alert(`Failed to upload CV: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const addEducation = () => {
    setEducationList([...educationList, {
      id: Date.now(),
      degree: '',
      institution: '',
      field_of_study: '',
      start_date: '',
      end_date: '',
      grade: '',
      description: ''
    }]);
  };

  const updateEducation = (id, field, value) => {
    setEducationList(educationList.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const removeEducation = (id) => {
    setEducationList(educationList.filter(edu => edu.id !== id));
  };

  const addLanguage = () => {
    setLanguageList([...languageList, {
      id: Date.now(),
      language: '',
      proficiency: '',
      certification: ''
    }]);
  };

  const updateLanguage = (id, field, value) => {
    setLanguageList(languageList.map(lang => 
      lang.id === id ? { ...lang, [field]: value } : lang
    ));
  };

  const removeLanguage = (id) => {
    setLanguageList(languageList.filter(lang => lang.id !== id));
  };

  const addCertification = () => {
    setCertificationList([...certificationList, {
      id: Date.now(),
      name: '',
      issuing_organization: '',
      issue_date: '',
      expiry_date: '',
      credential_id: '',
      credential_url: '',
      description: ''
    }]);
  };

  const updateCertification = (id, field, value) => {
    setCertificationList(certificationList.map(cert => 
      cert.id === id ? { ...cert, [field]: value } : cert
    ));
  };

  const removeCertification = (id) => {
    setCertificationList(certificationList.filter(cert => cert.id !== id));
  };

  const addWorkExperience = () => {
    setWorkExperienceList([...workExperienceList, {
      id: Date.now(),
      title: '',
      company: '',
      location: '',
      start_date: '',
      end_date: '',
      current: false,
      description: ''
    }]);
  };

  const updateWorkExperience = (id, field, value) => {
    setWorkExperienceList(workExperienceList.map(work => 
      work.id === id ? { ...work, [field]: value } : work
    ));
  };

  const removeWorkExperience = (id) => {
    setWorkExperienceList(workExperienceList.filter(work => work.id !== id));
  };

  const addEventExperience = () => {
    setEventExperienceList([...eventExperienceList, {
      id: Date.now(),
      event_name: '',
      role: '',
      organization: '',
      location: '',
      start_date: '',
      end_date: '',
      description: ''
    }]);
  };

  const updateEventExperience = (id, field, value) => {
    setEventExperienceList(eventExperienceList.map(event => 
      event.id === id ? { ...event, [field]: value } : event
    ));
  };

  const removeEventExperience = (id) => {
    setEventExperienceList(eventExperienceList.filter(event => event.id !== id));
  };

  const addOrganizationExperience = () => {
    setOrganizationExperienceList([...organizationExperienceList, {
      id: Date.now(),
      organization_name: '',
      role: '',
      location: '',
      start_date: '',
      end_date: '',
      current: false,
      description: ''
    }]);
  };

  const updateOrganizationExperience = (id, field, value) => {
    setOrganizationExperienceList(organizationExperienceList.map(org => 
      org.id === id ? { ...org, [field]: value } : org
    ));
  };

  const removeOrganizationExperience = (id) => {
    setOrganizationExperienceList(organizationExperienceList.filter(org => org.id !== id));
  };

  const sendPhoneVerification = async () => {
    try {
      const phoneNumber = document.querySelector('input[name="phone_number"]').value;
      if (!phoneNumber) {
        alert('Please enter a phone number first');
        return;
      }
      
      const response = await studentAPI.sendPhoneVerification(phoneNumber);
      if (response.success) {
        setPhoneVerification({ ...phoneVerification, codeSent: true });
        alert('Verification code sent to your phone');
      }
    } catch (error) {
      console.error('Error sending verification:', error);
      alert(`Failed to send verification: ${error.message || 'Unknown error'}`);
    }
  };

  const verifyPhone = async () => {
    try {
      setPhoneVerification({ ...phoneVerification, isVerifying: true });
      
      const response = await studentAPI.verifyPhoneCode(phoneVerification.code);
      if (response.success) {
        setPhoneVerification({ 
          ...phoneVerification, 
          isVerified: true, 
          isVerifying: false 
        });
        alert('Phone number verified successfully!');
      }
    } catch (error) {
      console.error('Error verifying phone:', error);
      alert(`Failed to verify phone: ${error.message || 'Unknown error'}`);
    } finally {
      setPhoneVerification(prev => ({ ...prev, isVerifying: false }));
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div>
      <h2 style={{ color: '#007bff', marginBottom: '15px' }}>Build Your Profile</h2>
      <div style={{
        background: '#f8f9fa',
        padding: '15px',
        borderRadius: '6px',
        border: '1px solid #e9ecef'
      }}>
        <ProfileHeader 
          user={profile || user}
          profilePicturePreview={profilePicturePreview}
          handleProfilePictureChange={handleProfilePictureChange}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          saving={saving}
          handleSaveProfile={handleSaveProfile}
          fetchProfile={fetchProfile}
          setProfilePicturePreview={setProfilePicturePreview}
        />

        {/* Student Profile Section */}
        <form id="profileForm" onSubmit={handleSaveProfile}>
          <PersonalInformation 
            profile={profile}
            user={user}
            isEditMode={isEditMode}
            phoneVerification={phoneVerification}
            setPhoneVerification={setPhoneVerification}
            sendPhoneVerification={sendPhoneVerification}
            verifyPhone={verifyPhone}
            handleCVUpload={handleCVUpload}
            fetchProfile={fetchProfile}
          />
          <EducationSection 
            educationList={educationList}
            updateEducation={updateEducation}
            removeEducation={removeEducation}
            addEducation={addEducation}
            isEditMode={isEditMode}
          />

          <LanguagesSection 
            languageList={languageList}
            updateLanguage={updateLanguage}
            removeLanguage={removeLanguage}
            addLanguage={addLanguage}
            isEditMode={isEditMode}
          />

          <CertificationsSection 
            certificationList={certificationList}
            updateCertification={updateCertification}
            removeCertification={removeCertification}
            addCertification={addCertification}
            isEditMode={isEditMode}
          />

          <ExperienceSection 
            title="Work Experience"
            experienceList={workExperienceList}
            addExperience={addWorkExperience}
            updateExperience={updateWorkExperience}
            removeExperience={removeWorkExperience}
            isEditMode={isEditMode}
            experienceType="work"
          />

          <ExperienceSection 
            title="Event Experience"
            experienceList={eventExperienceList}
            addExperience={addEventExperience}
            updateExperience={updateEventExperience}
            removeExperience={removeEventExperience}
            isEditMode={isEditMode}
            experienceType="event"
          />

          <ExperienceSection 
            title="Organization Experience"
            experienceList={organizationExperienceList}
            addExperience={addOrganizationExperience}
            updateExperience={updateOrganizationExperience}
            removeExperience={removeOrganizationExperience}
            isEditMode={isEditMode}
            experienceType="organization"
          />
          
          <div style={{ marginTop: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Bio
            </label>
            <textarea 
              rows="4"
              name="bio"
              defaultValue={profile?.bio || ""}
              disabled={!isEditMode}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                resize: 'vertical',
                backgroundColor: !isEditMode ? '#f8f9fa' : 'white'
              }}
              placeholder="Tell employers about yourself..."
            />
          </div>
        </form>

        <SkillsSection 
          skills={skills}
          newSkill={newSkill}
          setNewSkill={setNewSkill}
          handleAddSkill={handleAddSkill}
          handleRemoveSkill={handleRemoveSkill}
          isEditMode={isEditMode}
        />
        
      </div>
    </div>
  );
};

export default BuildProfile;