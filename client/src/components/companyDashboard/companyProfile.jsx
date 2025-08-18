import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../auth/AuthContext.jsx';
import { companyAPI } from '../auth/api.jsx';

const CompanyProfile = ({ onProfileSaved }) => {
    const { user } = useContext(AuthContext);
    const [companyData, setCompanyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);
    const [logoPreview, setLogoPreview] = useState('');
    const [logoFile, setLogoFile] = useState(null);

    useEffect(() => {
        const fetchCompanyProfile = async () => {
            try {
                const response = await companyAPI.getProfile();
                const profileData = response.profile || response.data || response;
                setCompanyData(profileData);
                setFormData(profileData);
                setLogoPreview(profileData.logo_url ? `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${profileData.logo_url}` : '');
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
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEdit = (e) => {
        e.preventDefault();
        setIsEditMode(true);
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
        setFormData(companyData);
        setLogoPreview(companyData.logo_url ? `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${companyData.logo_url}` : '');
        setLogoFile(null);
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveLogo = async () => {
        if (!window.confirm('Are you sure you want to remove your company logo?')) return;
        try {
            const formData = new FormData();
            formData.append('logo', ''); // Send empty to remove
            await companyAPI.uploadLogo(formData); // Backend should handle removal
            setLogoPreview('');
            setLogoFile(null);
            // Refresh profile
            const response = await companyAPI.getProfile();
            setCompanyData(response.profile || response.data || response);
            setFormData(response.profile || response.data || response);
        } catch (error) {
            alert('Failed to remove logo');
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            let updatedProfile = { ...formData };
            // Upload logo if changed
            if (logoFile) {
                const logoForm = new FormData();
                logoForm.append('logo', logoFile);
                const logoRes = await companyAPI.uploadLogo(logoForm);
                if (logoRes.success && logoRes.logo_url) {
                    updatedProfile.logo_url = logoRes.logo_url;
                }
            }
            const response = await companyAPI.updateProfile(updatedProfile);
            const profileData = response.profile || response.data || response;
            setCompanyData(profileData);
            setFormData(profileData);
            setLogoPreview(profileData.logo_url ? `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${profileData.logo_url}` : '');
            setIsEditMode(false);
            if (onProfileSaved) onProfileSaved();
            alert('Profile updated successfully');
        } catch (error) {
            alert('Error updating profile');
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
            {/* Profile Header Section */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px' }}>
                <div style={{ position: 'relative', marginRight: '20px' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: logoPreview ? 'transparent' : '#007bff',
                        backgroundImage: logoPreview ? `url(${logoPreview})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '24px',
                        border: '3px solid #007bff',
                        position: 'relative'
                    }}>
                        {!logoPreview && (
                            (companyData?.company_name?.charAt(0) || 'C').toUpperCase()
                        )}
                    </div>
                    <input
                        type="file"
                        id="companyLogoHeader"
                        accept=".jpg,.jpeg,.png,.gif"
                        onChange={handleLogoChange}
                        style={{ display: 'none' }}
                        disabled={!isEditMode}
                    />
                    {isEditMode && (
                        <label
                            htmlFor="companyLogoHeader"
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
                                fontSize: '12px',
                                border: '2px solid white'
                            }}
                        >
                            +
                        </label>
                    )}
                    {logoPreview && isEditMode && (
                        <button
                            type="button"
                            onClick={handleRemoveLogo}
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
                                fontSize: '12px',
                                border: '2px solid white'
                            }}
                        >
                            ×
                        </button>
                    )}
                </div>
                <div>
                    <h3 style={{ margin: 0 }}>{companyData?.company_name || 'Company Name'}</h3>
                    <p style={{ color: '#6c757d', margin: '5px 0 0 0' }}>Complete your profile to attract employers</p>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
                    {!isEditMode ? (
                        <button
                            type="button"
                            onClick={handleEdit}
                            style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', fontWeight: '600' }}
                        >
                            Edit Profile
                        </button>
                    ) : (
                        <>
                            <button
                                type="submit"
                                disabled={saving}
                                style={{ background: saving ? '#6c757d' : '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '1rem', fontWeight: '600' }}
                            >
                                {saving ? 'Saving...' : 'Save Profile'}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', fontWeight: '600' }}
                            >
                                Cancel Edit
                            </button>
                        </>
                    )}
                </div>
            </div>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '15px',
                maxWidth: '100%'
            }}>
                <div style={{ minWidth: 0 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Company ID</label>
                    <input
                        type="text"
                        value={companyData?.company_id || user?.company_id || user?.id || "Not available"}
                        disabled
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f8f9fa', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ minWidth: 0 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Company Name</label>
                    <input
                        type="text"
                        name="company_name"
                        placeholder="Your Company Name"
                        value={formData.company_name || ''}
                        onChange={handleInputChange}
                        disabled={!isEditMode}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: !isEditMode ? '#f8f9fa' : 'white', boxSizing: 'border-box' }}
                    />
                </div>
                {/* Company Email */}
                <div style={{ minWidth: 0 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Company Email</label>
                    <input
                        type="email"
                        name="company_email"
                        placeholder="company@email.com"
                        value={formData.company_email || ''}
                        onChange={handleInputChange}
                        disabled={!isEditMode}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: !isEditMode ? '#f8f9fa' : 'white', boxSizing: 'border-box' }}
                    />
                </div>
                {/* Company Number */}
                <div style={{ minWidth: 0 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Company Number</label>
                    <input
                        type="text"
                        name="company_number"
                        placeholder="Company Phone Number"
                        value={formData.company_number || ''}
                        onChange={handleInputChange}
                        disabled={!isEditMode}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: !isEditMode ? '#f8f9fa' : 'white', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ minWidth: 0 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Company Website</label>
                    <input
                        type="url"
                        name="company_website"
                        placeholder="https://www.yourcompany.com"
                        value={formData.company_website || ''}
                        onChange={handleInputChange}
                        disabled={!isEditMode}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: !isEditMode ? '#f8f9fa' : 'white', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ minWidth: 0 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Industry</label>
                    <select
                        name="industry"
                        value={formData.industry || ''}
                        onChange={handleInputChange}
                        disabled={!isEditMode}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: !isEditMode ? '#f8f9fa' : 'white', boxSizing: 'border-box' }}
                    >
                        <option value="">Select Industry</option>
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
                <div style={{ minWidth: 0 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Company Size</label>
                    <select
                        name="company_size"
                        value={formData.company_size || ''}
                        onChange={handleInputChange}
                        disabled={!isEditMode}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: !isEditMode ? '#f8f9fa' : 'white', boxSizing: 'border-box' }}
                    >
                        <option value="">Select Size</option>
                        <option value="1-10 employees">1-10 employees</option>
                        <option value="11-50 employees">11-50 employees</option>
                        <option value="51-200 employees">51-200 employees</option>
                        <option value="201-500 employees">201-500 employees</option>
                        <option value="500-1000 employees">500-1000 employees</option>
                        <option value="1000+ employees">1000+ employees</option>
                    </select>
                </div>
                <div style={{ minWidth: 0 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Address</label>
                    <input
                        type="text"
                        name="address"
                        placeholder="Your company address"
                        value={formData.address || ''}
                        onChange={handleInputChange}
                        disabled={!isEditMode}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: !isEditMode ? '#f8f9fa' : 'white', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ minWidth: 0, gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>About</label>
                    <textarea
                        rows="4"
                        name="about"
                        placeholder="Describe your company..."
                        value={formData.about || ''}
                        onChange={handleInputChange}
                        disabled={!isEditMode}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: !isEditMode ? '#f8f9fa' : 'white', boxSizing: 'border-box', resize: 'vertical' }}
                    />
                </div>
            </div>
        </form>
    );
};

export default CompanyProfile;