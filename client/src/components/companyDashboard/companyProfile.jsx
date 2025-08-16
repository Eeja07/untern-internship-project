import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../auth/AuthContext.jsx';
import { companyAPI } from '../auth/api.jsx';

const CompanyProfile = () => {
    const { user } = useContext(AuthContext);
    const [companyData, setCompanyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({});

    // Debug: Log the user object to see what fields are available
    useEffect(() => {
        console.log('User object from AuthContext:', user);
        console.log('Available user fields:', user ? Object.keys(user) : 'No user');
        
        // Fetch company profile data
        const fetchCompanyProfile = async () => {
            try {
                const response = await companyAPI.getProfile();
                console.log('Company profile response:', response);
                console.log('Company profile fields:', response?.data ? Object.keys(response.data) : 'No data');
                const profileData = response.data || response;
                setCompanyData(profileData);
                setFormData(profileData);
            } catch (error) {
                console.error('Error fetching company profile:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchCompanyProfile();
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        
        try {
            const response = await companyAPI.updateProfile(formData);
            setCompanyData(response.data || response);
            console.log('Profile updated successfully:', response);
            // You can add a success notification here
        } catch (error) {
            console.error('Error updating profile:', error);
            // You can add an error notification here
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSaveProfile} style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            marginBottom: '40px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <img 
                    src={user?.logo_url || "https://via.placeholder.com/60"} 
                    alt="Company Logo" 
                    style={{ width: '60px', height: '60px', borderRadius: '12px', marginRight: '15px' }}
                />
                <h2 style={{ color: '#2c3e50', margin: 0 }}>Company Profile</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#2c3e50' }}>
                        Company ID
                    </label>
                    <input 
                        type="text" 
                        value={
                            companyData?.company_id || 
                            user?.company_id || 
                            user?.id || 
                            "Not available"
                        }
                        readOnly
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            backgroundColor: '#f8f9fa'
                        }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#2c3e50' }}>
                        Company Name
                    </label>
                    <input 
                        type="text" 
                        name="company_name"
                        placeholder="Your Company Name"
                        value={formData.company_name || user?.company_name || ""}
                        onChange={handleInputChange}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '1rem'
                        }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#2c3e50' }}>
                        Company Website
                    </label>
                    <input 
                        type="url" 
                        name="company_website"
                        placeholder="https://www.yourcompany.com"
                        value={formData.company_website || user?.company_website || ""}
                        onChange={handleInputChange}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '1rem'
                        }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#2c3e50' }}>
                        Industry
                    </label>
                    <select 
                        name="industry"
                        value={formData.industry || user?.industry || "Technology"}
                        onChange={handleInputChange}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '1rem'
                        }}
                    >
                        <option value="Technology">Technology</option>
                        <option value="Finance">Finance</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Education">Education</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Retail">Retail</option>
                        <option value="Consulting">Consulting</option>
                        <option value="Media">Media</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#2c3e50' }}>
                        Company Size
                    </label>
                    <select 
                        name="company_size"
                        value={formData.company_size || user?.company_size || "500-1000 employees"}
                        onChange={handleInputChange}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '1rem'
                        }}
                    >
                        <option value="1-10 employees">1-10 employees</option>
                        <option value="11-50 employees">11-50 employees</option>
                        <option value="51-200 employees">51-200 employees</option>
                        <option value="201-500 employees">201-500 employees</option>
                        <option value="500-1000 employees">500-1000 employees</option>
                        <option value="1000+ employees">1000+ employees</option>
                    </select>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#2c3e50' }}>
                        Address
                    </label>
                    <input 
                        type="text" 
                        name="address"
                        placeholder="Your company address"
                        value={formData.address || user?.address || ""}
                        onChange={handleInputChange}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '1rem'
                        }}
                    />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#2c3e50' }}>
                        About
                    </label>
                    <textarea 
                        rows="4"
                        name="about"
                        placeholder="Describe your company..."
                        value={formData.about || user?.about || ""}
                        onChange={handleInputChange}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            resize: 'vertical'
                        }}
                    />
                </div>
            </div>
            <button 
                type="submit"
                disabled={saving}
                style={{
                    padding: '12px 24px',
                    backgroundColor: saving ? '#6c757d' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    marginTop: '20px'
                }}
            >
                {saving ? 'Saving...' : 'Save Company Profile'}
            </button>
        </form>
    );
};

export default CompanyProfile;