import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { companyAPI, studentAPI } from '../auth/api.jsx';
import ReCAPTCHA from 'react-google-recaptcha';

const ProfileModal = ({ userId, onClose }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setFetchError(false);
            try {
                if (!userId) {
                    setFetchError(true);
                    setProfile({});
                    return;
                }
                const result = await companyAPI.getStudentProfileById(userId);
                if (!result || !result.profile) {
                    setFetchError(true);
                    setProfile({});
                } else {
                    setProfile(result.profile);
                }
            } catch (err) {
                setFetchError(true);
                setProfile({});
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [userId]);

    const getFileUrl = (filePath) => {
        if (!filePath) return null;
        if (filePath.startsWith('http')) return filePath;
        return `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${filePath}`;
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
            <div style={{ background: 'white', padding: '30px', borderRadius: '12px', minWidth: '350px', maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto' }}>
                <h3 style={{ marginBottom: '20px' }}>Student Profile</h3>
                {loading ? <p>Loading...</p> : fetchError ? (
                    <p style={{ color: '#dc3545' }}>Failed to fetch profile. Please try again later.</p>
                ) : (
                    <div>
                        {profile.profile_picture_url && (
                            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                <img src={getFileUrl(profile.profile_picture_url)} alt="Profile" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '2px solid #007bff' }} />
                            </div>
                        )}
                        <p><b>Name:</b> {profile.name || <span style={{color:'#dc3545'}}>Not provided</span>}</p>
                        <p><b>Email:</b> {profile.email || <span style={{color:'#dc3545'}}>Not provided</span>}</p>
                        <p><b>Phone:</b> {profile.phone_number || <span style={{color:'#dc3545'}}>Not provided</span>}</p>
                        <p><b>Address:</b> {profile.address || <span style={{color:'#dc3545'}}>Not provided</span>}</p>
                        <p><b>Bio:</b> {profile.bio || <span style={{color:'#dc3545'}}>Not provided</span>}</p>
                        <p><b>Portfolio:</b> {profile.portfolio_url ? <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer">{profile.portfolio_url}</a> : <span style={{color:'#dc3545'}}>Not provided</span>}</p>
                        <p><b>Resume:</b> {profile.resume_url ? <a href={getFileUrl(profile.resume_url)} target="_blank" rel="noopener noreferrer">View Resume</a> : <span style={{color:'#dc3545'}}>Not provided</span>}</p>
                        <p><b>Skills:</b> {profile.skills && profile.skills.length > 0 ? profile.skills.map(skill => (typeof skill === 'string' ? skill : skill.skill_name)).join(', ') : <span style={{color:'#dc3545'}}>Not provided</span>}</p>
                        {/* Education */}
                        {profile.education && profile.education.length > 0 ? (
                            <div>
                                <b>Education:</b>
                                <ul style={{ paddingLeft: 20 }}>
                                    {profile.education.map((edu, idx) => {
                                        if (typeof edu === 'string') return <li key={idx}>{edu}</li>;
                                        const degree = edu.degree || '';
                                        const institution = edu.institution || '';
                                        const field = edu.field_of_study ? `, ${edu.field_of_study}` : '';
                                        const start = edu.start_date ? ` (${edu.start_date}` : '';
                                        const end = edu.end_date ? ` - ${edu.end_date})` : (start ? ')' : '');
                                        const grade = edu.grade ? `, Grade: ${edu.grade}` : '';
                                        const desc = edu.description ? `, ${edu.description}` : '';
                                        return (
                                            <li key={idx}>
                                                {degree}{degree && institution ? ' at ' : ''}{institution}{field}{start}{end}{grade}{desc}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ) : <div><b>Education:</b> <span style={{color:'#dc3545'}}>Not provided</span></div>}
                        {/* Languages */}
                        {profile.languages && profile.languages.length > 0 ? (
                            <div>
                                <b>Languages:</b>
                                <ul style={{ paddingLeft: 20 }}>
                                    {profile.languages.map((lang, idx) => {
                                        if (typeof lang === 'string') return <li key={idx}>{lang}</li>;
                                        const language = lang.language || '';
                                        const proficiency = lang.proficiency ? ` (${lang.proficiency})` : '';
                                        const cert = lang.certification ? `, Certification: ${lang.certification}` : '';
                                        return (
                                            <li key={idx}>{language}{proficiency}{cert}</li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ) : <div><b>Languages:</b> <span style={{color:'#dc3545'}}>Not provided</span></div>}
                        {/* Certifications */}
                        {profile.certifications && profile.certifications.length > 0 ? (
                            <div>
                                <b>Certifications:</b>
                                <ul style={{ paddingLeft: 20 }}>
                                    {profile.certifications.map((cert, idx) => {
                                        if (typeof cert === 'string') return <li key={idx}>{cert}</li>;
                                        const name = cert.name || '';
                                        const org = cert.issuing_organization ? ` (${cert.issuing_organization})` : '';
                                        const issue = cert.issue_date ? `, Issued: ${cert.issue_date}` : '';
                                        const expiry = cert.expiry_date ? `, Expires: ${cert.expiry_date}` : '';
                                        const credId = cert.credential_id ? `, ID: ${cert.credential_id}` : '';
                                        const credUrl = cert.credential_url ? `, URL: ${cert.credential_url}` : '';
                                        const desc = cert.description ? `, ${cert.description}` : '';
                                        return (
                                            <li key={idx}>{name}{org}{issue}{expiry}{credId}{credUrl}{desc}</li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ) : <div><b>Certifications:</b> <span style={{color:'#dc3545'}}>Not provided</span></div>}
                        {/* Work Experience */}
                        {profile.work_experience && profile.work_experience.length > 0 ? (
                            <div>
                                <b>Work Experience:</b>
                                <ul style={{ paddingLeft: 20 }}>
                                    {profile.work_experience.map((work, idx) => {
                                        if (typeof work === 'string') return <li key={idx}>{work}</li>;
                                        const title = work.title || '';
                                        const company = work.company ? ` at ${work.company}` : '';
                                        const location = work.location ? `, ${work.location}` : '';
                                        const start = work.start_date ? ` (${work.start_date}` : '';
                                        const end = work.end_date ? ` - ${work.end_date})` : (start ? ')' : '');
                                        const current = work.current ? ', Current' : '';
                                        const desc = work.description ? `, ${work.description}` : '';
                                        return (
                                            <li key={idx}>{title}{company}{location}{start}{end}{current}{desc}</li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ) : <div><b>Work Experience:</b> <span style={{color:'#dc3545'}}>Not provided</span></div>}
                        {/* Event Experience */}
                        {profile.event_experience && profile.event_experience.length > 0 ? (
                            <div>
                                <b>Event Experience:</b>
                                <ul style={{ paddingLeft: 20 }}>
                                    {profile.event_experience.map((event, idx) => {
                                        if (typeof event === 'string') return <li key={idx}>{event}</li>;
                                        const eventName = event.event_name || '';
                                        const role = event.role ? ` (${event.role})` : '';
                                        const org = event.organization ? `, ${event.organization}` : '';
                                        const location = event.location ? `, ${event.location}` : '';
                                        const start = event.start_date ? ` (${event.start_date}` : '';
                                        const end = event.end_date ? ` - ${event.end_date})` : (start ? ')' : '');
                                        const desc = event.description ? `, ${event.description}` : '';
                                        return (
                                            <li key={idx}>{eventName}{role}{org}{location}{start}{end}{desc}</li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ) : <div><b>Event Experience:</b> <span style={{color:'#dc3545'}}>Not provided</span></div>}
                        {/* Organization Experience */}
                        {profile.organization_experience && profile.organization_experience.length > 0 ? (
                            <div>
                                <b>Organization Experience:</b>
                                <ul style={{ paddingLeft: 20 }}>
                                    {profile.organization_experience.map((org, idx) => {
                                        if (typeof org === 'string') return <li key={idx}>{org}</li>;
                                        const name = org.organization_name || '';
                                        const role = org.role ? ` (${org.role})` : '';
                                        const location = org.location ? `, ${org.location}` : '';
                                        const start = org.start_date ? ` (${org.start_date}` : '';
                                        const end = org.end_date ? ` - ${org.end_date})` : (start ? ')' : '');
                                        const current = org.current ? ', Current' : '';
                                        const desc = org.description ? `, ${org.description}` : '';
                                        return (
                                            <li key={idx}>{name}{role}{location}{start}{end}{current}{desc}</li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ) : <div><b>Organization Experience:</b> <span style={{color:'#dc3545'}}>Not provided</span></div>}
                    </div>
                )}
                <button onClick={onClose} style={{ marginTop: '20px', padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Close</button>
            </div>
        </div>
    );
};

const ManageApplicationsByStatus = () => {
    const location = useLocation();
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedInternship, setSelectedInternship] = useState('all');
    const [applications, setApplications] = useState([]);
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCaptchaModal, setShowCaptchaModal] = useState(false);
    const [pendingAction, setPendingAction] = useState({ applicationId: null, newStatus: null });
    const [captchaToken, setCaptchaToken] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [expandedInternshipId, setExpandedInternshipId] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileUserId, setProfileUserId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchInternshipsAndApplications();
        if (location.state?.selectedInternshipId) {
            setSelectedInternship(location.state.selectedInternshipId);
        }
    }, [location.state]);

    const fetchInternshipsAndApplications = async () => {
        setLoading(true);
        try {
            const [internshipsResult, applicationsResult] = await Promise.all([
                companyAPI.getInternships(),
                companyAPI.getApplications()
            ]);
            if (internshipsResult.success) {
                setInternships(internshipsResult.internships);
            } else {
                console.error('Failed to fetch internships:', internshipsResult.message);
            }
            if (applicationsResult.success) {
                setApplications(applicationsResult.applications);
            } else {
                console.error('Failed to fetch applications:', applicationsResult.message);
                setError('Failed to fetch applications');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Error loading applications: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateApplicationStatus = (applicationId, newStatus) => {
        setPendingAction({ applicationId, newStatus });
        setShowCaptchaModal(true);
    };

    const handleCaptchaChange = async (token) => {
        setCaptchaToken(token);
        if (!token) return;
        setShowCaptchaModal(false);
        try {
            const { applicationId, newStatus } = pendingAction;
            setPendingAction({ applicationId: null, newStatus: null });
            const result = await companyAPI.updateApplicationStatus(applicationId, newStatus);
            if (result.success) {
                fetchInternshipsAndApplications();
                alert(`Application ${newStatus} successfully!`);
            } else {
                alert(result.message || 'Failed to update application status');
            }
        } catch (error) {
            console.error('Error updating application status:', error);
            alert('Error updating application status');
        }
    };

    const handleMarkDone = async (applicationId) => {
        try {
            const result = await companyAPI.markApplicationDone(applicationId);
            if (result.success) {
                fetchInternshipsAndApplications();
                alert('Applicant marked as done!');
            } else {
                alert(result.message || 'Failed to mark as done');
            }
        } catch (error) {
            console.error('Error marking as done:', error);
            alert('Error marking as done');
        }
    };

    const handleViewProfile = async (userId) => {
        if (!userId) {
            console.warn('[handleViewProfile] Tried to open profile modal with undefined userId');
            return;
        }
        setProfileUserId(userId);
        setShowProfileModal(true);
        try {
            await companyAPI.insertProfileView(userId); // API to insert into profile_Views
        } catch (err) {
            // handle error silently
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#ffc107';
            case 'shortlisted': return '#007bff';
            case 'accepted': return '#28a745';
            case 'rejected': return '#dc3545';
            default: return '#6c757d';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const filteredApplications = applications.filter(app => {
        const statusMatch = selectedStatus === 'all' || app.status === selectedStatus;
        const internshipMatch = selectedInternship === 'all' || String(app.internship_id) === String(selectedInternship);
        const searchMatch =
            !searchTerm ||
            (app.student_name && app.student_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (app.student_email && app.student_email.toLowerCase().includes(searchTerm.toLowerCase()));
        return statusMatch && internshipMatch && searchMatch;
    });

    const selectedInternshipTitle = internships.find(int => String(int.internship_id) === String(selectedInternship))?.title || 'All Internships';

    return (
        <div>            {/* Tab Content */}
            {activeTab === 'all' ? (
                <>
                    {/* Filter Controls */}
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        marginBottom: '20px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}>
                        {/* Search and Filter Controls */}
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <input
                                type="text"
                                placeholder="Search by name or email"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                style={{ padding: '8px', borderRadius: '6px', border: '1px solid #e9ecef', minWidth: '200px' }}
                            />
                            <select value={selectedInternship} onChange={e => setSelectedInternship(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #e9ecef' }}>
                                <option value="all">All Internships</option>
                                {internships.map(int => (
                                    <option key={int.internship_id} value={int.internship_id}>{int.title}</option>
                                ))}
                            </select>
                            <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #e9ecef' }}>
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="shortlisted">Shortlisted</option>
                                <option value="accepted">Accepted</option>
                                <option value="rejected">Rejected</option>
                            </select>
                            {selectedInternship !== 'all' && (
                                <button
                                    onClick={() => (setSelectedInternship('all'), setSelectedStatus('all'))}
                                    style={{
                                        padding: '6px 12px',
                                        backgroundColor: 'transparent',
                                        color: '#007bff',
                                        border: '1px solid #007bff',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    Clear Internship Filter
                                </button>
                            )}
                    </div>
                    {/* Results Summary */}
                    <div style={{
                        padding: '15px',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#2c3e50', fontWeight: '600' }}>
                                Showing {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                    </div>
                    {/* Applications List */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <p>Loading applications...</p>
                            </div>
                        ) : error ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#dc3545' }}>
                                <p>{error}</p>
                                <button
                                    onClick={fetchInternshipsAndApplications}
                                    style={{
                                        marginTop: '10px',
                                        padding: '8px 16px',
                                        backgroundColor: '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        marginRight: '10px'
                                    }}
                                >
                                    Retry
                                </button>
                                <button
                                    onClick={async () => {
                                        try {
                                            const token = localStorage.getItem('token');
                                            const response = await fetch('http://localhost:4000/api/company/debug-applications', {
                                                headers: { 'Authorization': `Bearer ${token}` }
                                            });
                                            const data = await response.json();
                                            alert('Check console for debug info');
                                        } catch (error) {
                                            console.error('Debug error:', error);
                                        }
                                    }}
                                    style={{
                                        marginTop: '10px',
                                        padding: '8px 16px',
                                        backgroundColor: '#ffc107',
                                        color: 'black',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Debug
                                </button>
                            </div>
                        ) : filteredApplications.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <div style={{ fontSize: '48px', marginBottom: '20px' }}>📝</div>
                                <h3 style={{ color: '#6c757d', marginBottom: '10px' }}>No applications found</h3>
                                <p style={{ color: '#6c757d' }}>
                                    {selectedInternship !== 'all' 
                                        ? `No applications found for "${selectedInternshipTitle}"`
                                        : 'No applications found matching your current filters'}
                                </p>
                            </div>
                        ) : (
                            filteredApplications.map(application => (
                                <div key={application.application_id} style={{
                                    padding: '25px',
                                    borderBottom: '1px solid #e9ecef'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                        <div>
                                            <h3 style={{ color: '#2c3e50', marginBottom: '5px' }}>
                                                {application.student_name || 'Student Name'}
                                            </h3>
                                            <p style={{ color: '#007bff', fontWeight: '500', margin: '0 0 5px 0' }}>
                                                {application.internship_title}
                                            </p>
                                            <p style={{ color: '#6c757d', margin: 0, fontSize: '0.9rem' }}>
                                                {application.student_email || 'No email provided'}
                                            </p>
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
                                    {/* Application Details */}
                                    <div style={{ marginBottom: '15px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ color: '#6c757d', fontSize: '0.9rem' }}>Application ID:</span>
                                                <span style={{ color: '#2c3e50', fontWeight: '500' }}>
                                                    {application.application_id}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ color: '#6c757d', fontSize: '0.9rem' }}>Internship Type:</span>
                                                <span style={{ color: '#2c3e50', fontWeight: '500' }}>
                                                    {application.internship_type || 'N/A'}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ color: '#6c757d', fontSize: '0.9rem' }}>Location:</span>
                                                <span style={{ color: '#2c3e50', fontWeight: '500' }}>
                                                    {application.location || 'N/A'}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ color: '#6c757d', fontSize: '0.9rem' }}>Date Applied:</span>
                                                <span style={{ color: '#2c3e50', fontWeight: '500' }}>
                                                    {formatDate(application.date_applied)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Application Actions */}
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                        <button 
                                            onClick={() => handleUpdateApplicationStatus(application.application_id, 'accepted')}
                                            disabled={application.status === 'accepted'}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: application.status === 'accepted' ? '#6c757d' : '#28a745',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: application.status === 'accepted' ? 'not-allowed' : 'pointer',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            {application.status === 'accepted' ? 'Accepted' : 'Accept'}
                                        </button>
                                        <button 
                                            onClick={() => handleUpdateApplicationStatus(application.application_id, 'shortlisted')}
                                            disabled={application.status === 'shortlisted' || application.status === 'accepted'}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: (application.status === 'shortlisted' || application.status === 'accepted') ? '#6c757d' : '#007bff',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: (application.status === 'shortlisted' || application.status === 'accepted') ? 'not-allowed' : 'pointer',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            {application.status === 'shortlisted' ? 'Shortlisted' : 'Shortlist'}
                                        </button>
                                        <button 
                                            onClick={() => handleUpdateApplicationStatus(application.application_id, 'rejected')}
                                            disabled={application.status === 'rejected'}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: application.status === 'rejected' ? '#6c757d' : '#dc3545',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: application.status === 'rejected' ? 'not-allowed' : 'pointer',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            {application.status === 'rejected' ? 'Rejected' : 'Reject'}
                                        </button>
                                        <button 
                                            onClick={() => handleMarkDone(application.application_id)}
                                            disabled={application.done_intern}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: application.done_intern ? '#6c757d' : '#17a2b8',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: application.done_intern ? 'not-allowed' : 'pointer',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            {application.done_intern ? 'Internship Done' : 'Mark as Done'}
                                        </button>
                                        <button 
                                            onClick={() => handleViewProfile(application.student_profile_id)}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: 'white',
                                                color: '#17a2b8',
                                                border: '1px solid #17a2b8',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            View Profile
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            ) : null}
            {/* CAPTCHA Modal */}
            {showCaptchaModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <div style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: '12px',
                        boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
                        minWidth: '320px',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ marginBottom: '20px' }}>Confirm Action</h3>
                        <p style={{ marginBottom: '20px' }}>Please complete the CAPTCHA to confirm this action.</p>
                        <ReCAPTCHA
                            sitekey="6Lf2E6krAAAAAAzXkluXdOa1A7XVSOMV0cdUyDZM"
                            onChange={handleCaptchaChange}
                        />
                        <button
                            onClick={() => setShowCaptchaModal(false)}
                            style={{ marginTop: '20px', padding: '8px 16px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
            {showProfileModal && (
                <ProfileModal userId={profileUserId} onClose={() => setShowProfileModal(false)} />
            )}
        </div>
    );
};

export default ManageApplicationsByStatus;
