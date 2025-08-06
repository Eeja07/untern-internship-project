import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext.jsx';
import Navbar from '../homePage/navbar.jsx';
import FooterHome from '../homePage/footerHome.jsx';

const CompanyDashboard = () => {
    const navigate = useNavigate();
    const { isAuthenticated, userType, user } = useContext(AuthContext);
    const [activeSection, setActiveSection] = useState('overview');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Modal states
    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
    const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

    // Footer modal handlers
    const handleForStudentsClick = () => {
        setIsStudentModalOpen(true);
    };

    const handleForCompaniesClick = () => {
        setIsCompanyModalOpen(true);
    };

    // Check authentication and user type
    if (!isAuthenticated || userType !== 'company') {
        return (
            <>
                <Navbar />
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f8f9fa'
                }}>
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        maxWidth: '500px'
                    }}>
                        <h2 style={{ color: '#dc3545', marginBottom: '20px' }}>Access Denied</h2>
                        <p style={{ marginBottom: '30px', color: '#6c757d' }}>
                            Please log in as a company to access the company dashboard.
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
                <FooterHome onForStudentsClick={handleForStudentsClick} onForCompaniesClick={handleForCompaniesClick} />
            </>
        );
    }

    const sidebarItems = [
        { id: 'overview', label: 'Dashboard Overview', icon: '📊' },
        { id: 'post-internship', label: 'Post Internship Openings', icon: '📝' },
        { id: 'manage-applications', label: 'Manage Applications', icon: '📋' },
        { id: 'pricing', label: 'Check Pricing Information', icon: '💰' },
        { id: 'partnerships', label: 'Partnership Opportunities', icon: '🤝' },
        { id: 'analytics', label: 'Analytics & Reporting', icon: '📈' },
        { id: 'certifications', label: 'Post Certifications', icon: '🏆' }
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'overview':
                return <DashboardOverview />;
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
            case 'certifications':
                return <PostCertifications />;
            default:
                return <DashboardOverview />;
        }
    };

    return (
        <>
            <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
                {/* Sidebar */}
                <div style={{
                    width: isSidebarCollapsed ? '80px' : '280px',
                    backgroundColor: 'white',
                    boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
                    transition: 'width 0.3s ease',
                    position: 'relative'
                }}>
                    {/* Sidebar Header */}
                    <div style={{
                        padding: '20px',
                        borderBottom: '1px solid #e9ecef',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <button
                            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                            style={{
                                background: 'none',
                                border: 'none',
                                fontSize: '1.2rem',
                                cursor: 'pointer',
                                padding: '5px'
                            }}
                        >
                            {isSidebarCollapsed ? '→' : '←'}
                        </button>
                    </div>

                    {/* Company Info Section */}
                    {!isSidebarCollapsed && (
                        <div style={{
                            borderBottom: '1px solid #e9ecef',
                            paddingBottom: '20px',
                            marginBottom: '20px',
                            padding: '20px'
                        }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                background: '#007bff',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '20px',
                                marginBottom: '10px'
                            }}>
                                {user?.email?.charAt(0).toUpperCase() || 'C'}
                            </div>
                            <h4 style={{ margin: 0, marginBottom: '5px' }}>Eeja Dashboard</h4>
                            <p style={{ margin: 0, color: '#6c757d', fontSize: '14px' }}>{user?.email}</p>
                        </div>
                    )}

                    {/* Sidebar Navigation */}
                    <div style={{ padding: '20px 0' }}>
                        {sidebarItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                style={{
                                    width: '100%',
                                    padding: '15px 20px',
                                    border: 'none',
                                    backgroundColor: activeSection === item.id ? '#007bff' : 'transparent',
                                    color: activeSection === item.id ? 'white' : '#555',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    fontSize: '0.95rem',
                                    fontWeight: activeSection === item.id ? '600' : '400',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    if (activeSection !== item.id) {
                                        e.target.style.backgroundColor = '#f8f9fa';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (activeSection !== item.id) {
                                        e.target.style.backgroundColor = 'transparent';
                                    }
                                }}
                            >
                                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                                {!isSidebarCollapsed && <span>{item.label}</span>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div style={{
                    flex: 1,
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

// Post Internship Component
const PostInternship = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        location: '',
        type: 'remote',
        duration: '3',
        salary: '',
        applicationDeadline: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('Internship posting submitted successfully!');
    };

    return (
        <div>
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Post Internship Opening</h1>
                <p style={{ color: '#6c757d' }}>Create a new internship opportunity for students.</p>
            </div>

            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '40px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gap: '25px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                Job Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #e9ecef',
                                    borderRadius: '8px',
                                    fontSize: '1rem'
                                }}
                                placeholder="e.g., Frontend Developer Intern"
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                Job Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                rows={5}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #e9ecef',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    resize: 'vertical'
                                }}
                                placeholder="Describe the role, responsibilities, and what the intern will learn..."
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                Requirements *
                            </label>
                            <textarea
                                name="requirements"
                                value={formData.requirements}
                                onChange={handleInputChange}
                                required
                                rows={4}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #e9ecef',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    resize: 'vertical'
                                }}
                                placeholder="List required skills, education level, experience, etc..."
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                    Location *
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '8px',
                                        fontSize: '1rem'
                                    }}
                                    placeholder="e.g., Jakarta or Remote"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                    Work Type *
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '8px',
                                        fontSize: '1rem'
                                    }}
                                >
                                    <option value="remote">Remote</option>
                                    <option value="on-site">On-site</option>
                                    <option value="hybrid">Hybrid</option>
                                    <option value="full-time">Full-time</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                    Duration (months) *
                                </label>
                                <select
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '8px',
                                        fontSize: '1rem'
                                    }}
                                >
                                    <option value="3">3 months</option>
                                    <option value="4">4 months</option>
                                    <option value="6">6 months</option>
                                    <option value="12">12 months</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                    Salary Range
                                </label>
                                <input
                                    type="text"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '8px',
                                        fontSize: '1rem'
                                    }}
                                    placeholder="e.g., Rp 2,000,000 - 3,000,000"
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                Application Deadline
                            </label>
                            <input
                                type="date"
                                name="applicationDeadline"
                                value={formData.applicationDeadline}
                                onChange={handleInputChange}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #e9ecef',
                                    borderRadius: '8px',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            style={{
                                padding: '15px 30px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                transition: 'background-color 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
                        >
                            Post Internship
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Manage Applications Component
const ManageApplications = () => {
    const [selectedStatus, setSelectedStatus] = useState('all');
    
    const applications = [
        {
            id: 1,
            candidateName: 'Mahija Ibad',
            position: 'Frontend Developer Intern',
            email: 'mahija@gmail.com',
            appliedDate: '2024-03-15',
            status: 'pending',
            experience: '6 months',
            skills: ['React', 'JavaScript', 'CSS']
        },
        {
            id: 2,
            candidateName: 'Mahija Ibad',
            position: 'Backend Developer Intern',
            email: 'mahija@gmail.com',
            appliedDate: '2024-03-14',
            status: 'shortlisted',
            experience: '1 year',
            skills: ['Node.js', 'Python', 'MongoDB']
        },
        {
            id: 3,
            candidateName: 'Mahija Ibad',
            position: 'UI/UX Designer Intern',
            email: 'mahija@gmail.com',
            appliedDate: '2024-03-13',
            status: 'accepted',
            experience: '3 months',
            skills: ['Figma', 'Adobe XD', 'Photoshop']
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#ffc107';
            case 'shortlisted': return '#007bff';
            case 'accepted': return '#28a745';
            case 'rejected': return '#dc3545';
            default: return '#6c757d';
        }
    };

    const filteredApplications = selectedStatus === 'all' 
        ? applications 
        : applications.filter(app => app.status === selectedStatus);

    return (
        <div>
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Manage Applications</h1>
                <p style={{ color: '#6c757d' }}>Review and manage internship applications from candidates.</p>
            </div>

            {/* Filter Buttons */}
            <div style={{ marginBottom: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {['all', 'pending', 'shortlisted', 'accepted', 'rejected'].map(status => (
                    <button
                        key={status}
                        onClick={() => setSelectedStatus(status)}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: selectedStatus === status ? '#007bff' : 'white',
                            color: selectedStatus === status ? 'white' : '#007bff',
                            border: '2px solid #007bff',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            textTransform: 'capitalize'
                        }}
                    >
                        {status === 'all' ? 'All Applications' : status}
                    </button>
                ))}
            </div>

            {/* Applications List */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                {filteredApplications.map(application => (
                    <div key={application.id} style={{
                        padding: '25px',
                        borderBottom: '1px solid #e9ecef'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                            <div>
                                <h3 style={{ color: '#2c3e50', marginBottom: '5px' }}>{application.candidateName}</h3>
                                <p style={{ color: '#007bff', fontWeight: '500', margin: '0 0 5px 0' }}>{application.position}</p>
                                <p style={{ color: '#6c757d', margin: 0, fontSize: '0.9rem' }}>{application.email}</p>
                            </div>
                            <span style={{
                                padding: '5px 12px',
                                backgroundColor: getStatusColor(application.status),
                                color: 'white',
                                borderRadius: '15px',
                                fontSize: '0.8rem',
                                fontWeight: '500',
                                textTransform: 'capitalize'
                            }}>
                                {application.status}
                            </span>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                            <div>
                                <small style={{ color: '#6c757d', fontWeight: '600' }}>Applied Date:</small>
                                <p style={{ margin: '2px 0 0 0' }}>{application.appliedDate}</p>
                            </div>
                            <div>
                                <small style={{ color: '#6c757d', fontWeight: '600' }}>Experience:</small>
                                <p style={{ margin: '2px 0 0 0' }}>{application.experience}</p>
                            </div>
                            <div>
                                <small style={{ color: '#6c757d', fontWeight: '600' }}>Skills:</small>
                                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '5px' }}>
                                    {application.skills.map(skill => (
                                        <span key={skill} style={{
                                            padding: '3px 8px',
                                            backgroundColor: '#e9ecef',
                                            borderRadius: '10px',
                                            fontSize: '0.8rem'
                                        }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <button style={{
                                padding: '8px 16px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}>
                                Accept
                            </button>
                            <button style={{
                                padding: '8px 16px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}>
                                Shortlist
                            </button>
                            <button style={{
                                padding: '8px 16px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}>
                                Reject
                            </button>
                            <button style={{
                                padding: '8px 16px',
                                backgroundColor: 'white',
                                color: '#007bff',
                                border: '1px solid #007bff',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}>
                                View Profile
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Pricing Information Component
const PricingInformation = () => {
    const pricingPlans = [
        {
            name: 'Basic',
            price: 'Free',
            duration: 'Forever',
            features: [
                'Post up to 3 internships',
                'Basic candidate search',
                'Email support',
                'Application notifications'
            ],
            recommended: false
        },
        {
            name: 'Professional',
            price: 'Rp 500,000',
            duration: 'per month',
            features: [
                'Unlimited internship postings',
                'Advanced candidate search',
                'Priority support',
                'Analytics dashboard',
                'Featured job listings',
                'Application management tools'
            ],
            recommended: true
        },
        {
            name: 'Enterprise',
            price: 'Rp 1,500,000',
            duration: 'per month',
            features: [
                'Everything in Professional',
                'Dedicated account manager',
                'Custom branding',
                'API access',
                'Advanced analytics',
                'Bulk operations',
                'Custom integrations'
            ],
            recommended: false
        }
    ];

    return (
        <div>
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Pricing Information</h1>
                <p style={{ color: '#6c757d' }}>Choose the plan that best fits your company's needs.</p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '30px',
                marginBottom: '40px'
            }}>
                {pricingPlans.map((plan, index) => (
                    <div key={index} style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '40px 30px',
                        boxShadow: plan.recommended ? '0 8px 30px rgba(0,123,255,0.15)' : '0 4px 20px rgba(0,0,0,0.1)',
                        border: plan.recommended ? '2px solid #007bff' : '2px solid transparent',
                        position: 'relative',
                        textAlign: 'center'
                    }}>
                        {plan.recommended && (
                            <div style={{
                                position: 'absolute',
                                top: '-12px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                backgroundColor: '#007bff',
                                color: 'white',
                                padding: '5px 20px',
                                borderRadius: '15px',
                                fontSize: '0.85rem',
                                fontWeight: '600'
                            }}>
                                RECOMMENDED
                            </div>
                        )}
                        
                        <h3 style={{ color: '#2c3e50', marginBottom: '10px', fontSize: '1.5rem' }}>{plan.name}</h3>
                        <div style={{ marginBottom: '20px' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#007bff' }}>{plan.price}</span>
                            {plan.price !== 'Free' && (
                                <span style={{ color: '#6c757d', fontSize: '1rem' }}> / {plan.duration}</span>
                            )}
                        </div>
                        
                        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '30px' }}>
                            {plan.features.map((feature, idx) => (
                                <li key={idx} style={{ 
                                    padding: '8px 0', 
                                    color: '#555',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    <span style={{ color: '#28a745' }}>✓</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        
                        <button style={{
                            width: '100%',
                            padding: '12px 0',
                            backgroundColor: plan.recommended ? '#007bff' : 'white',
                            color: plan.recommended ? 'white' : '#007bff',
                            border: '2px solid #007bff',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '600',
                            transition: 'all 0.3s ease'
                        }}>
                            {plan.name === 'Basic' ? 'Current Plan' : 'Upgrade Now'}
                        </button>
                    </div>
                ))}
            </div>

            {/* Additional Information */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '30px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Frequently Asked Questions</h2>
                <div style={{ display: 'grid', gap: '20px' }}>
                    <div>
                        <h4 style={{ color: '#007bff', marginBottom: '8px' }}>Can I change my plan anytime?</h4>
                        <p style={{ color: '#6c757d', margin: 0 }}>Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
                    </div>
                    <div>
                        <h4 style={{ color: '#007bff', marginBottom: '8px' }}>Is there a setup fee?</h4>
                        <p style={{ color: '#6c757d', margin: 0 }}>No, there are no setup fees. You only pay the monthly subscription fee for your chosen plan.</p>
                    </div>
                    <div>
                        <h4 style={{ color: '#007bff', marginBottom: '8px' }}>What payment methods do you accept?</h4>
                        <p style={{ color: '#6c757d', margin: 0 }}>We accept all major credit cards, bank transfers, and popular Indonesian payment methods like GoPay and OVO.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Partnership Opportunities Component
const PartnershipOpportunities = () => {
    const partnershipTypes = [
        {
            title: 'University Partnerships',
            description: 'Connect directly with top universities to access their best students.',
            benefits: ['Direct access to student talent pool', 'Campus recruitment events', 'Collaborative projects'],
            icon: '🎓'
        },
        {
            title: 'Startup Ecosystem',
            description: 'Join our network of innovative startups and tech companies.',
            benefits: ['Cross-referral opportunities', 'Shared resources', 'Networking events'],
            icon: '🚀'
        },
        {
            title: 'Corporate Partners',
            description: 'Partner with established corporations for mutual growth.',
            benefits: ['Enterprise-level collaborations', 'Resource sharing', 'Joint initiatives'],
            icon: '🏢'
        }
    ];

    return (
        <div>
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Partnership Opportunities</h1>
                <p style={{ color: '#6c757d' }}>Explore collaboration opportunities to expand your reach and impact.</p>
            </div>

            {/* Partnership Types */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '30px',
                marginBottom: '40px'
            }}>
                {partnershipTypes.map((partnership, index) => (
                    <div key={index} style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '30px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        transition: 'transform 0.3s ease'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>{partnership.icon}</div>
                        <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>{partnership.title}</h3>
                        <p style={{ color: '#6c757d', marginBottom: '20px', lineHeight: '1.6' }}>{partnership.description}</p>
                        
                        <h4 style={{ color: '#007bff', marginBottom: '10px', fontSize: '1rem' }}>Benefits:</h4>
                        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '25px' }}>
                            {partnership.benefits.map((benefit, idx) => (
                                <li key={idx} style={{ 
                                    padding: '5px 0', 
                                    color: '#555',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <span style={{ color: '#28a745' }}>•</span>
                                    {benefit}
                                </li>
                            ))}
                        </ul>
                        
                        <button style={{
                            width: '100%',
                            padding: '12px 0',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '600'
                        }}>
                            Learn More
                        </button>
                    </div>
                ))}
            </div>

            {/* Contact Form */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '40px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Interested in Partnering?</h2>
                <p style={{ color: '#6c757d', marginBottom: '30px' }}>
                    Get in touch with our partnership team to explore collaboration opportunities.
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <input
                        type="text"
                        placeholder="Company Name"
                        style={{
                            padding: '12px 16px',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '1rem'
                        }}
                    />
                    <input
                        type="email"
                        placeholder="Email Address"
                        style={{
                            padding: '12px 16px',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '1rem'
                        }}
                    />
                </div>
                
                <textarea
                    placeholder="Tell us about your partnership ideas..."
                    rows={4}
                    style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e9ecef',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        marginBottom: '20px',
                        resize: 'vertical'
                    }}
                />
                
                <button style={{
                    padding: '12px 30px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600'
                }}>
                    Send Partnership Inquiry
                </button>
            </div>
        </div>
    );
};

// Analytics and Reporting Component
const AnalyticsReporting = () => {
    const analyticsData = {
        jobViews: [
            { month: 'Jan', views: 1200 },
            { month: 'Feb', views: 1800 },
            { month: 'Mar', views: 2400 }
        ],
        applications: [
            { month: 'Jan', count: 45 },
            { month: 'Feb', count: 67 },
            { month: 'Mar', count: 89 }
        ]
    };

    return (
        <div>
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Analytics & Reporting</h1>
                <p style={{ color: '#6c757d' }}>Track your internship postings performance and candidate engagement.</p>
            </div>

            {/* Key Metrics */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '40px'
            }}>
                {[
                    { title: 'Total Job Views', value: '5,420', change: '+12%', color: '#007bff' },
                    { title: 'Applications Received', value: '201', change: '+23%', color: '#28a745' },
                    { title: 'Interview Scheduled', value: '45', change: '+8%', color: '#17a2b8' },
                    { title: 'Conversion Rate', value: '22.4%', change: '+3.2%', color: '#ffc107' }
                ].map((metric, index) => (
                    <div key={index} style={{
                        backgroundColor: 'white',
                        padding: '25px',
                        borderRadius: '12px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ color: '#2c3e50', margin: '0 0 10px 0', fontSize: '1rem' }}>{metric.title}</h3>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: metric.color }}>{metric.value}</span>
                            <span style={{ color: '#28a745', fontSize: '0.9rem', fontWeight: '500' }}>{metric.change}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Placeholder */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '30px',
                marginBottom: '40px'
            }}>
                <div style={{
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Job Views Trend</h3>
                    <div style={{
                        height: '200px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6c757d'
                    }}>
                        Chart: Job Views Over Time
                    </div>
                </div>

                <div style={{
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Application Trend</h3>
                    <div style={{
                        height: '200px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6c757d'
                    }}>
                        Chart: Applications Over Time
                    </div>
                </div>
            </div>

            {/* Recent Performance */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '30px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Top Performing Job Postings</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa' }}>
                                <th style={{ padding: '12px', textAlign: 'left', color: '#2c3e50' }}>Job Title</th>
                                <th style={{ padding: '12px', textAlign: 'left', color: '#2c3e50' }}>Views</th>
                                <th style={{ padding: '12px', textAlign: 'left', color: '#2c3e50' }}>Applications</th>
                                <th style={{ padding: '12px', textAlign: 'left', color: '#2c3e50' }}>Conversion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { title: 'Frontend Developer Intern', views: '1,240', applications: '45', conversion: '3.6%' },
                                { title: 'Backend Developer Intern', views: '980', applications: '38', conversion: '3.9%' },
                                { title: 'UI/UX Designer Intern', views: '756', applications: '29', conversion: '3.8%' }
                            ].map((job, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #e9ecef' }}>
                                    <td style={{ padding: '15px 12px', color: '#2c3e50', fontWeight: '500' }}>{job.title}</td>
                                    <td style={{ padding: '15px 12px', color: '#6c757d' }}>{job.views}</td>
                                    <td style={{ padding: '15px 12px', color: '#6c757d' }}>{job.applications}</td>
                                    <td style={{ padding: '15px 12px', color: '#28a745', fontWeight: '500' }}>{job.conversion}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Post Certifications Component
const PostCertifications = () => {
    const [certData, setCertData] = useState({
        title: '',
        description: '',
        duration: '',
        requirements: '',
        benefits: '',
        cost: ''
    });

    const handleInputChange = (e) => {
        setCertData({
            ...certData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Certification posted:', certData);
        alert('Certification program posted successfully!');
    };

    return (
        <div>
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Post Internship Certifications</h1>
                <p style={{ color: '#6c757d' }}>Create certification programs to validate intern skills and achievements.</p>
            </div>

            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '40px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gap: '25px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                Certification Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={certData.title}
                                onChange={handleInputChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #e9ecef',
                                    borderRadius: '8px',
                                    fontSize: '1rem'
                                }}
                                placeholder="e.g., Frontend Development Certificate"
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={certData.description}
                                onChange={handleInputChange}
                                required
                                rows={4}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #e9ecef',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    resize: 'vertical'
                                }}
                                placeholder="Describe what this certification covers and validates..."
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                    Duration
                                </label>
                                <input
                                    type="text"
                                    name="duration"
                                    value={certData.duration}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '8px',
                                        fontSize: '1rem'
                                    }}
                                    placeholder="e.g., 3 months"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                    Cost
                                </label>
                                <input
                                    type="text"
                                    name="cost"
                                    value={certData.cost}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '8px',
                                        fontSize: '1rem'
                                    }}
                                    placeholder="e.g., Free or Rp 500,000"
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                Requirements
                            </label>
                            <textarea
                                name="requirements"
                                value={certData.requirements}
                                onChange={handleInputChange}
                                rows={3}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #e9ecef',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    resize: 'vertical'
                                }}
                                placeholder="List prerequisites or requirements for this certification..."
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                Benefits
                            </label>
                            <textarea
                                name="benefits"
                                value={certData.benefits}
                                onChange={handleInputChange}
                                rows={3}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #e9ecef',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    resize: 'vertical'
                                }}
                                placeholder="What will participants gain from this certification?"
                            />
                        </div>

                        <button
                            type="submit"
                            style={{
                                padding: '15px 30px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                transition: 'background-color 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
                        >
                            Post Certification
                        </button>
                    </div>
                </form>
            </div>

            {/* Existing Certifications */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '30px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                marginTop: '30px'
            }}>
                <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Your Certification Programs</h2>
                <div style={{ display: 'grid', gap: '20px' }}>
                    {[
                        {
                            title: 'Frontend Development Certificate',
                            participants: 45,
                            status: 'Active',
                            completion: '78%'
                        },
                        {
                            title: 'Digital Marketing Fundamentals',
                            participants: 32,
                            status: 'Active',
                            completion: '65%'
                        }
                    ].map((cert, index) => (
                        <div key={index} style={{
                            padding: '20px',
                            border: '1px solid #e9ecef',
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <h4 style={{ color: '#2c3e50', margin: '0 0 5px 0' }}>{cert.title}</h4>
                                <p style={{ color: '#6c757d', margin: 0, fontSize: '0.9rem' }}>
                                    {cert.participants} participants • {cert.completion} completion rate
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <span style={{
                                    padding: '4px 12px',
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem'
                                }}>
                                    {cert.status}
                                </span>
                                <button style={{
                                    padding: '6px 12px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem'
                                }}>
                                    Manage
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CompanyDashboard;