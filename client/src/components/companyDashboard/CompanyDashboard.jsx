import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext.jsx';
import Navbar from '../homePage/navbar.jsx';
import FooterHome from '../homePage/footerHome.jsx';
import PostInternship from './PostInternship.jsx';
import ManageApplications from './ManageApplications.jsx';
import PricingInformation from './PricingInformation.jsx';
import PartnershipOpportunities from './PartnershipOpportunities.jsx';
import AnalyticsReporting from './AnalyticsReporting.jsx';
import PostCertifications from './PostCertifications.jsx';
import CompanyProfile from './companyProfile.jsx';

const CompanyDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, userType, user, logout } = useContext(AuthContext);
    const [activeSection, setActiveSection] = useState('overview');
    const [companyProfile, setCompanyProfile] = useState(null);
    const [profileRefreshFlag, setProfileRefreshFlag] = useState(0);

    // Modal states
    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
    const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

    const sidebarItems = [
        { id: 'overview', label: 'Dashboard Overview', icon: '📊' },
        { id: 'profile', label: 'Company Profile', icon: '🏢' },
        { id: 'post-internship', label: 'Post Internship Openings', icon: '📝' },
        { id: 'manage-applications', label: 'Manage Applications', icon: '📋' },
        { id: 'pricing', label: 'Check Pricing Information', icon: '💰' },
        { id: 'partnerships', label: 'Partnership Opportunities', icon: '🤝' },
        { id: 'analytics', label: 'Analytics & Reporting', icon: '📈' },
        { id: 'post-certifications', label: 'Post Certifications', icon: '🏆' }
    ];

    // Set active section based on URL path
    useEffect(() => {
        const path = location.pathname.split('/').pop();
        const validSections = sidebarItems.map(item => item.id);
        // console.log('Current path:', location.pathname);
        // console.log('Extracted section:', path);
        // console.log('Valid sections:', validSections);
        
        if (path && validSections.includes(path)) {
            setActiveSection(path);
            // console.log('Setting active section to:', path);
        } else {
            // If no valid path, default to overview
            setActiveSection('overview');
            // console.log('Setting default section: overview');
        }
    }, [location.pathname]);

    // Fetch company profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await import('../auth/api.jsx').then(m => m.companyAPI.getProfile());
                setCompanyProfile(response.profile || response.data || response);
            } catch (error) {
                setCompanyProfile(null);
            }
        };
        if (isAuthenticated && userType === 'company') {
            fetchProfile();
        }
    }, [isAuthenticated, userType, profileRefreshFlag]);

    // Footer modal handlers
    const handleForStudentsClick = () => {
        setIsStudentModalOpen(true);
    };

    const handleForCompaniesClick = () => {
        setIsCompanyModalOpen(true);
    };

    const handleSectionChange = (sectionId) => {
        setActiveSection(sectionId);
        navigate(`/company-dashboard/${sectionId}`);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };
    const renderContent = () => {
        // console.log('Rendering content for section:', activeSection);
        switch (activeSection) {
            case 'overview':
                return <DashboardOverview />;
            case 'profile':
                return <CompanyProfile onProfileSaved={() => {
                    setProfileRefreshFlag(f => f + 1);
                }} profileData={companyProfile} />;
            case 'post-internship':
                return <PostInternship />;
            case 'manage-applications':
                return <ManageApplications />;
            case 'pricing':
                return <PricingInformation />;
            case 'partnerships':
                return <PartnershipOpportunities />;
            case 'analytics':
                return <AnalyticsReporting />;
            case 'post-certifications':
                return <PostCertifications />;
            default:
                console.log('No matching section, showing overview');
                return <DashboardOverview />;
        }
    };

    return (
        <>
            <div style={{ display: 'flex', minHeight: '90vh', backgroundColor: '#f8f9fa' }}>
                {/* Sidebar */}
                <div style={{
                    width: '280px',
                    backgroundColor: 'white',
                    borderRight: '1px solid #e9ecef',
                    padding: '20px'
                }}>
                    {/* Company Info Section */}
                    <div style={{
                        borderBottom: '1px solid #e9ecef',
                        paddingBottom: '20px',
                        marginBottom: '20px'
                    }}>
                        {/* Profile Picture from DB */}
                        <div style={{
                            width: '60px',
                            height: '60px',
                            backgroundColor: companyProfile?.logo_url ? 'transparent' : '#007bff',
                            backgroundImage: companyProfile?.logo_url ? `url(${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${companyProfile.logo_url})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '20px',
                            marginBottom: '10px'
                        }}>
                            {!companyProfile?.logo_url && (companyProfile?.company_name?.charAt(0).toUpperCase() || 'C')}
                        </div>
                        <h4 style={{ margin: 0, marginBottom: '5px' }}>Company Dashboard</h4>
                        <p style={{ margin: 0, color: '#2c3e50', fontSize: '16px' }}>{companyProfile?.company_name || ''}</p>
                    </div>

                    {/* Navigation Items */}
                    <nav>
                        {sidebarItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => handleSectionChange(item.id)}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '12px 16px',
                                    margin: '4px 0',
                                    background: activeSection === item.id ? '#e7f3ff' : 'transparent',
                                    color: activeSection === item.id ? '#007bff' : '#495057',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    textAlign: 'left',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    if (activeSection !== item.id) {
                                        e.target.style.background = '#f8f9fa';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (activeSection !== item.id) {
                                        e.target.style.background = 'transparent';
                                    }
                                }}
                            >
                                <span style={{ marginRight: '12px', fontSize: '18px' }}>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            margin: '20px 0 0 0',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#c82333'}
                        onMouseLeave={(e) => e.target.style.background = '#dc3545'}
                    >
                        🚪 Logout
                    </button>
                </div>

                {/* Main Content */}
                <div style={{
                    flex: '1',
                    padding: '30px',
                    overflow: 'auto'
                }}>
                    {renderContent()}
                </div>
            </div>

            <FooterHome onForStudentsClick={handleForStudentsClick} onForCompaniesClick={handleForCompaniesClick} />
        </>
    );
};

// Dashboard Overview Component
const DashboardOverview = () => {
    const { user } = useContext(AuthContext);
    
    const stats = [
        { label: 'Active Internships', value: '12', icon: '📝', color: '#007bff' },
        { label: 'Applications Received', value: '248', icon: '📋', color: '#28a745' },
        { label: 'Candidates Hired', value: '8', icon: '✅', color: '#17a2b8' },
        { label: 'Profile Views', value: '1,240', icon: '👁️', color: '#ffc107' }
    ];

    return (
        <div>
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Dashboard Overview</h1>
                <p style={{ color: '#6c757d' }}>Welcome to your company dashboard. Manage your internship postings and applications here.</p>
            </div>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '40px'
            }}>
                {stats.map((stat, index) => (
                    <div key={index} style={{
                        backgroundColor: 'white',
                        padding: '25px',
                        borderRadius: '12px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px'
                    }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '12px',
                            backgroundColor: `${stat.color}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem'
                        }}>
                            {stat.icon}
                        </div>
                        <div>
                            <h3 style={{ color: stat.color, margin: '0 0 5px 0', fontSize: '2rem' }}>{stat.value}</h3>
                            <p style={{ color: '#6c757d', margin: 0, fontSize: '0.9rem' }}>{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '30px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>Recent Activity</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {[
                        { action: 'New application received for Frontend Developer position', time: '2 hours ago', type: 'application' },
                        { action: 'Backend Developer internship posting expired', time: '1 day ago', type: 'expired' },
                        { action: 'Interview scheduled with candidate Sarah Johnson', time: '2 days ago', type: 'interview' },
                        { action: 'Mobile Developer position received 15 new applications', time: '3 days ago', type: 'application' }
                    ].map((activity, index) => (
                        <div key={index} style={{
                            padding: '15px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '8px',
                            borderLeft: `4px solid ${activity.type === 'application' ? '#28a745' : activity.type === 'expired' ? '#dc3545' : '#007bff'}`
                        }}>
                            <p style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>{activity.action}</p>
                            <small style={{ color: '#6c757d' }}>{activity.time}</small>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CompanyDashboard;