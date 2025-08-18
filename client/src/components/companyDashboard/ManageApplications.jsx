import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { companyAPI } from '../auth/api.jsx';
import ReCAPTCHA from 'react-google-recaptcha';

const ManageApplications = () => {
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
    const [activeTab, setActiveTab] = useState('all'); // 'all' or 'byInternship'
    const [expandedInternshipId, setExpandedInternshipId] = useState(null);

    useEffect(() => {
        fetchInternshipsAndApplications();
        
        // Set initial filter from navigation state
        if (location.state?.selectedInternshipId) {
            setSelectedInternship(location.state.selectedInternshipId);
        }
    }, [location.state]);

    const fetchInternshipsAndApplications = async () => {
        setLoading(true);
        try {
            // console.log('Fetching internships and applications...');
            
            // Fetch company's internships and applications
            const [internshipsResult, applicationsResult] = await Promise.all([
                companyAPI.getInternships(),
                companyAPI.getApplications()
            ]);

            // console.log('Internships result:', internshipsResult);
            // console.log('Applications result:', applicationsResult);

            if (internshipsResult.success) {
                setInternships(internshipsResult.internships);
            } else {
                console.error('Failed to fetch internships:', internshipsResult.message);
            }

            if (applicationsResult.success) {
                setApplications(applicationsResult.applications);
                // console.log('Applications loaded:', applicationsResult.applications.length);
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
            // Optionally, send captcha token to backend for verification
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

    // Filter applications by both status and internship
    const filteredApplications = applications.filter(app => {
        const statusMatch = selectedStatus === 'all' || app.status === selectedStatus;
        const internshipMatch = selectedInternship === 'all' || String(app.internship_id) === String(selectedInternship);
        return statusMatch && internshipMatch;
    });

    // Get selected internship title for display
    const selectedInternshipTitle = internships.find(int => String(int.internship_id) === String(selectedInternship))?.title || 'All Internships';

    // Place this before the return statement, inside the component
    let filteredApps = [];
    if (expandedInternshipId) {
      filteredApps = applications.filter(app => String(app.internship_id) === String(expandedInternshipId));
    }

    return (
        <div>
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Manage Applications</h1>
                <p style={{ color: '#6c757d' }}>Review and manage internship applications from candidates.</p>
            </div>
            {/* Tab Navigation */}
            <div style={{
                display: 'flex',
                marginBottom: '30px',
                borderBottom: '2px solid #e9ecef'
            }}>
                <button
                    onClick={() => setActiveTab('all')}
                    style={{
                        padding: '12px 24px',
                        border: 'none',
                        background: activeTab === 'all' ? '#007bff' : 'transparent',
                        color: activeTab === 'all' ? 'white' : '#6c757d',
                        borderRadius: '8px 8px 0 0',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginRight: '10px',
                        transition: 'all 0.3s ease'
                    }}
                >
                    Applications by Status
                </button>
                <button
                    onClick={() => setActiveTab('byInternship')}
                    style={{
                        padding: '12px 24px',
                        border: 'none',
                        background: activeTab === 'byInternship' ? '#007bff' : 'transparent',
                        color: activeTab === 'byInternship' ? 'white' : '#6c757d',
                        borderRadius: '8px 8px 0 0',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                >
                    Applications by Post
                </button>
            </div>

            {/* Tab Content */}
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
                        {/* Status Filter Buttons */}
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '10px',
                                fontWeight: '600',
                                color: '#2c3e50'
                            }}>
                                Filter by Status:
                            </label>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
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
                                            textTransform: 'capitalize',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        {status === 'all' ? 'All Status' : status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Results Summary */}
                    <div style={{
                        marginBottom: '20px',
                        padding: '15px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        border: '1px solid #e9ecef'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#2c3e50', fontWeight: '600' }}>
                                Showing {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''}
                            </span>
                            {selectedInternship !== 'all' && (
                                <button
                                    onClick={() => setSelectedInternship('all')}
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
                                            // console.log('Debug data:', data);
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
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                                        <div>
                                            <small style={{ color: '#6c757d', fontWeight: '600' }}>Applied Date:</small>
                                            <p style={{ margin: '2px 0 0 0' }}>
                                                {formatDate(application.applied_date)}
                                            </p>
                                        </div>
                                        <div>
                                            <small style={{ color: '#6c757d', fontWeight: '600' }}>University:</small>
                                            <p style={{ margin: '2px 0 0 0' }}>
                                                {application.university || 'Not specified'}
                                            </p>
                                        </div>
                                        <div>
                                            <small style={{ color: '#6c757d', fontWeight: '600' }}>Major:</small>
                                            <p style={{ margin: '2px 0 0 0' }}>
                                                {application.major || 'Not specified'}
                                            </p>
                                        </div>
                                        <div>
                                            <small style={{ color: '#6c757d', fontWeight: '600' }}>Phone:</small>
                                            <p style={{ margin: '2px 0 0 0' }}>
                                                {application.phone_number || 'Not specified'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Skills Section */}
                                    {application.skills && Array.isArray(application.skills) && application.skills.length > 0 && (
                                        <div style={{ marginBottom: '15px' }}>
                                            <small style={{ color: '#6c757d', fontWeight: '600' }}>Skills:</small>
                                            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '5px' }}>
                                                {application.skills.map((skill, index) => (
                                                    <span key={index} style={{
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
                                    )}

                                    {/* Education Section */}
                                    {application.education && Array.isArray(application.education) && application.education.length > 0 && (
                                        <div style={{ marginBottom: '15px' }}>
                                            <small style={{ color: '#6c757d', fontWeight: '600' }}>Education:</small>
                                            <div style={{ marginTop: '5px' }}>
                                                {application.education.map((edu, index) => (
                                                    <div key={index} style={{ 
                                                        marginBottom: '8px',
                                                        padding: '8px',
                                                        backgroundColor: '#f8f9fa',
                                                        borderRadius: '6px',
                                                        fontSize: '0.9rem'
                                                    }}>
                                                        <strong>{edu.degree}</strong> {edu.field && `in ${edu.field}`}
                                                        {edu.institution && <div style={{ color: '#6c757d' }}>{edu.institution}</div>}
                                                        {edu.year && <div style={{ color: '#6c757d', fontSize: '0.8rem' }}>{edu.year}</div>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Work Experience Section */}
                                    {application.work_experience && Array.isArray(application.work_experience) && application.work_experience.length > 0 && (
                                        <div style={{ marginBottom: '15px' }}>
                                            <small style={{ color: '#6c757d', fontWeight: '600' }}>Work Experience:</small>
                                            <div style={{ marginTop: '5px' }}>
                                                {application.work_experience.map((work, index) => (
                                                    <div key={index} style={{ 
                                                        marginBottom: '8px',
                                                        padding: '8px',
                                                        backgroundColor: '#f8f9fa',
                                                        borderRadius: '6px',
                                                        fontSize: '0.9rem'
                                                    }}>
                                                        <strong>{work.position}</strong> {work.company && `at ${work.company}`}
                                                        {work.duration && <div style={{ color: '#6c757d', fontSize: '0.8rem' }}>{work.duration}</div>}
                                                        {work.description && <div style={{ color: '#6c757d', fontSize: '0.85rem', marginTop: '4px' }}>{work.description}</div>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Bio Section */}
                                    {application.bio && (
                                        <div style={{ marginBottom: '20px' }}>
                                            <small style={{ color: '#6c757d', fontWeight: '600' }}>Bio:</small>
                                            <p style={{ 
                                                margin: '5px 0 0 0', 
                                                color: '#2c3e50',
                                                lineHeight: '1.5',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                                {application.bio}
                                            </p>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
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
                                        {application.resume_url && (
                                            <button 
                                                onClick={() => window.open(`http://localhost:4000${application.resume_url}`, '_blank')}
                                                style={{
                                                    padding: '8px 16px',
                                                    backgroundColor: 'white',
                                                    color: '#007bff',
                                                    border: '1px solid #007bff',
                                                    borderRadius: '5px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                View Resume
                                            </button>
                                        )}
                                        {application.portfolio_url && (
                                            <button 
                                                onClick={() => window.open(application.portfolio_url, '_blank')}
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
                                                View Portfolio
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            ) : (
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '40px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Applications by Post</h2>
                    {internships.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📝</div>
                            <h3 style={{ color: '#6c757d', marginBottom: '10px' }}>No internships posted yet</h3>
                            <p style={{ color: '#6c757d' }}>Post an internship to see applications here.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '20px' }}>
                            {internships.map(internship => (
                                <div key={internship.internship_id} style={{
                                    border: '1px solid #e9ecef',
                                    borderRadius: '12px',
                                    padding: '25px',
                                    backgroundColor: '#f8f9fa',
                                    position: 'relative'
                                }}>
                                    <div style={{ cursor: 'pointer' }} onClick={() => setExpandedInternshipId(expandedInternshipId === internship.internship_id ? null : internship.internship_id)}>
                                        <h3 style={{ color: '#2c3e50', marginBottom: '8px', fontSize: '1.2rem' }}>{internship.title}</h3>
                                        <div style={{ color: '#6c757d', fontSize: '0.95rem', marginBottom: '8px' }}>
                                            {internship.location} | {internship.type} | {internship.duration_months} months
                                        </div>
                                        <div style={{ color: '#007bff', fontWeight: '600', marginBottom: '8px' }}>
                                            {internship.application_count || 0} applicant{(internship.application_count || 0) !== 1 ? 's' : ''}
                                        </div>
                                        <span style={{ color: '#007bff', fontSize: '0.9rem', textDecoration: 'underline' }}>
                                            {expandedInternshipId === internship.internship_id ? 'Hide Applicants' : 'Show Applicants'}
                                        </span>
                                    </div>
                                    {expandedInternshipId === internship.internship_id && (
                                      <div style={{ marginTop: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', padding: '20px' }}>
                                        {loading && <div style={{ textAlign: 'center', padding: '20px' }}>Loading applications...</div>}
                                        {!loading && error && <div style={{ textAlign: 'center', padding: '20px', color: '#dc3545' }}>{error}</div>}
                                        {!loading && !error && (
                                          filteredApps.length === 0 ? (
                                            <div style={{ textAlign: 'center', color: '#6c757d' }}>No applicants for this internship.</div>
                                          ) : (
                                            filteredApps.map(application => (
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
                                                  
                                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                                                    <div>
                                                      <small style={{ color: '#6c757d', fontWeight: '600' }}>Applied Date:</small>
                                                      <p style={{ margin: '2px 0 0 0' }}>
                                                        {formatDate(application.applied_date)}
                                                      </p>
                                                    </div>
                                                    <div>
                                                      <small style={{ color: '#6c757d', fontWeight: '600' }}>University:</small>
                                                      <p style={{ margin: '2px 0 0 0' }}>
                                                        {application.university || 'Not specified'}
                                                      </p>
                                                    </div>
                                                    <div>
                                                      <small style={{ color: '#6c757d', fontWeight: '600' }}>Major:</small>
                                                      <p style={{ margin: '2px 0 0 0' }}>
                                                        {application.major || 'Not specified'}
                                                      </p>
                                                    </div>
                                                    <div>
                                                      <small style={{ color: '#6c757d', fontWeight: '600' }}>Phone:</small>
                                                      <p style={{ margin: '2px 0 0 0' }}>
                                                        {application.phone_number || 'Not specified'}
                                                      </p>
                                                    </div>
                                                  </div>

                                                  {/* Skills Section */}
                                                  {application.skills && Array.isArray(application.skills) && application.skills.length > 0 && (
                                                    <div style={{ marginBottom: '15px' }}>
                                                      <small style={{ color: '#6c757d', fontWeight: '600' }}>Skills:</small>
                                                      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '5px' }}>
                                                        {application.skills.map((skill, index) => (
                                                            <span key={index} style={{
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
                                                  )}

                                                  {/* Education Section */}
                                                  {application.education && Array.isArray(application.education) && application.education.length > 0 && (
                                                    <div style={{ marginBottom: '15px' }}>
                                                      <small style={{ color: '#6c757d', fontWeight: '600' }}>Education:</small>
                                                      <div style={{ marginTop: '5px' }}>
                                                        {application.education.map((edu, index) => (
                                                            <div key={index} style={{ 
                                                                marginBottom: '8px',
                                                                padding: '8px',
                                                                backgroundColor: '#f8f9fa',
                                                                borderRadius: '6px',
                                                                fontSize: '0.9rem'
                                                            }}>
                                                                <strong>{edu.degree}</strong> {edu.field && `in ${edu.field}`}
                                                                {edu.institution && <div style={{ color: '#6c757d' }}>{edu.institution}</div>}
                                                                {edu.year && <div style={{ color: '#6c757d', fontSize: '0.8rem' }}>{edu.year}</div>}
                                                            </div>
                                                        ))}
                                                      </div>
                                                    </div>
                                                  )}

                                                  {/* Work Experience Section */}
                                                  {application.work_experience && Array.isArray(application.work_experience) && application.work_experience.length > 0 && (
                                                    <div style={{ marginBottom: '15px' }}>
                                                      <small style={{ color: '#6c757d', fontWeight: '600' }}>Work Experience:</small>
                                                      <div style={{ marginTop: '5px' }}>
                                                        {application.work_experience.map((work, index) => (
                                                            <div key={index} style={{ 
                                                                marginBottom: '8px',
                                                                padding: '8px',
                                                                backgroundColor: '#f8f9fa',
                                                                borderRadius: '6px',
                                                                fontSize: '0.9rem'
                                                            }}>
                                                                <strong>{work.position}</strong> {work.company && `at ${work.company}`}
                                                                {work.duration && <div style={{ color: '#6c757d', fontSize: '0.8rem' }}>{work.duration}</div>}
                                                                {work.description && <div style={{ color: '#6c757d', fontSize: '0.85rem', marginTop: '4px' }}>{work.description}</div>}
                                                            </div>
                                                        ))}
                                                      </div>
                                                    </div>
                                                  )}

                                                  {/* Bio Section */}
                                                  {application.bio && (
                                                    <div style={{ marginBottom: '15px' }}>
                                                      <small style={{ color: '#6c757d', fontWeight: '600' }}>Bio:</small>
                                                      <p style={{ 
                                                          margin: '5px 0 0 0', 
                                                          color: '#2c3e50',
                                                          lineHeight: '1.5',
                                                          display: '-webkit-box',
                                                          WebkitLineClamp: 2,
                                                          WebkitBoxOrient: 'vertical',
                                                          overflow: 'hidden'
                                                      }}>
                                                          {application.bio}
                                                      </p>
                                                    </div>
                                                  )}

                                                  {/* Action Buttons */}
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
                                                    {application.resume_url && (
                                                        <button 
                                                            onClick={() => window.open(`http://localhost:4000${application.resume_url}`, '_blank')}
                                                            style={{
                                                                padding: '8px 16px',
                                                                backgroundColor: 'white',
                                                                color: '#007bff',
                                                                border: '1px solid #007bff',
                                                                borderRadius: '5px',
                                                                cursor: 'pointer',
                                                                fontSize: '0.9rem'
                                                            }}
                                                        >
                                                            View Resume
                                                        </button>
                                                    )}
                                                    {application.portfolio_url && (
                                                        <button 
                                                            onClick={() => window.open(application.portfolio_url, '_blank')}
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
                                                            View Portfolio
                                                        </button>
                                                    )}
                                                  </div>
                                                </div>
                                            ))
                                          )
                                        )}
                                      </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

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
        </div>
    );
};

export default ManageApplications;