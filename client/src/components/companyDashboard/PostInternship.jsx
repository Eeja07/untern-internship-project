import React, { useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext.jsx';
import { companyAPI } from '../auth/api.jsx';
import { useNavigate } from 'react-router-dom';

const PostInternship = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        location: '',
        type: 'remote',
        duration_months: '3',
        salary_min: '',
        salary_max: '',
        application_deadline: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [postedInternships, setPostedInternships] = useState([]);
    const [loadingInternships, setLoadingInternships] = useState(true);
    const [activeTab, setActiveTab] = useState('post'); // 'post' or 'manage'
    const [editingInternship, setEditingInternship] = useState(null); // For editing mode

    React.useEffect(() => {
        if (activeTab === 'manage') {
            fetchPostedInternships();
        }
    }, [activeTab]);

    const fetchPostedInternships = async () => {
        setLoadingInternships(true);
        try {
            const result = await companyAPI.getInternships();
            if (result.success) {
                setPostedInternships(result.internships);
            } else {
                console.error('Failed to fetch internships:', result.message);
            }
        } catch (error) {
            console.error('Error fetching internships:', error);
        } finally {
            setLoadingInternships(false);
        }
    };

    const handleToggleInternshipStatus = async (internshipId, currentStatus) => {
        try {
            const result = await companyAPI.updateInternship(internshipId, {
                is_active: !currentStatus
            });
            
            if (result.success) {
                // Refresh the internships list
                fetchPostedInternships();
                alert(`Internship ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
            } else {
                alert(result.message || 'Failed to update internship status');
            }
        } catch (error) {
            console.error('Error updating internship:', error);
            alert('Error updating internship status');
        }
    };

    const handleDeleteInternship = async (internshipId) => {
        if (window.confirm('Are you sure you want to delete this internship? This action cannot be undone.')) {
            try {
                const result = await companyAPI.deleteInternship(internshipId);
                
                if (result.success) {
                    // Refresh the internships list
                    fetchPostedInternships();
                    alert('Internship deleted successfully!');
                } else {
                    alert(result.message || 'Failed to delete internship');
                }
            } catch (error) {
                console.error('Error deleting internship:', error);
                alert('Error deleting internship');
            }
        }
    };

    const handleEditInternship = (internship) => {
        setEditingInternship(internship);
        setFormData({
            title: internship.title || '',
            description: internship.description || '',
            requirements: internship.requirements || '',
            location: internship.location || '',
            type: internship.type || 'remote',
            duration_months: internship.duration_months?.toString() || '3',
            salary_min: internship.salary_min?.toString() || '',
            salary_max: internship.salary_max?.toString() || '',
            application_deadline: internship.application_deadline ? internship.application_deadline.split('T')[0] : ''
        });
        setActiveTab('post');
    };

    const handleCancelEdit = () => {
        setEditingInternship(null);
        setFormData({
            title: '',
            description: '',
            requirements: '',
            location: '',
            type: 'remote',
            duration_months: '3',
            salary_min: '',
            salary_max: '',
            application_deadline: ''
        });
    };

    const formatSalary = (min, max) => {
        if (!min && !max) return 'Salary not specified';
        if (min && max) return `Rp ${min?.toLocaleString()} - Rp ${max?.toLocaleString()}`;
        if (min) return `From Rp ${min?.toLocaleString()}`;
        if (max) return `Up to Rp ${max?.toLocaleString()}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No deadline';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleViewApplications = (internshipId, internshipTitle) => {
        navigate('/company-dashboard/manage-applications', {
            state: { 
                selectedInternshipId: internshipId,
                selectedInternshipTitle: internshipTitle
            }
        });
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            // Prepare the data for submission
            const submissionData = {
                ...formData,
                company_id: user?.company_id,
                duration_months: parseInt(formData.duration_months),
                salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
                salary_max: formData.salary_max ? parseInt(formData.salary_max) : null
            };
            
            console.log('Submitting internship data:', submissionData);
            
            let result;
            if (editingInternship) {
                // Update existing internship
                result = await companyAPI.updateInternship(editingInternship.internship_id, submissionData);
            } else {
                // Create new internship
                result = await companyAPI.createInternship(submissionData);
            }
            
            if (result.success) {
                alert(`Internship ${editingInternship ? 'updated' : 'created'} successfully!`);
                // Reset form and editing state
                setFormData({
                    title: '',
                    description: '',
                    requirements: '',
                    location: '',
                    type: 'remote',
                    duration_months: '3',
                    salary_min: '',
                    salary_max: '',
                    application_deadline: ''
                });
                setEditingInternship(null);
                // Refresh the manage tab if we're currently on it
                fetchPostedInternships();
            } else {
                console.error('Server error:', result);
                alert(result.message || `Error ${editingInternship ? 'updating' : 'creating'} internship`);
            }
            
        } catch (error) {
            console.error('API error:', error);
            alert(error.message || `Error ${editingInternship ? 'updating' : 'creating'} internship. Please try again.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Manage Internships</h1>
                <p style={{ color: '#6c757d' }}>Post new internship opportunities or manage existing ones.</p>
            </div>

            {/* Tab Navigation */}
            <div style={{
                display: 'flex',
                marginBottom: '30px',
                borderBottom: '2px solid #e9ecef'
            }}>
                <button
                    onClick={() => setActiveTab('post')}
                    style={{
                        padding: '12px 24px',
                        border: 'none',
                        background: activeTab === 'post' ? '#007bff' : 'transparent',
                        color: activeTab === 'post' ? 'white' : '#6c757d',
                        borderRadius: '8px 8px 0 0',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginRight: '10px',
                        transition: 'all 0.3s ease'
                    }}
                >
                    Post New Internship
                </button>
                <button
                    onClick={() => setActiveTab('manage')}
                    style={{
                        padding: '12px 24px',
                        border: 'none',
                        background: activeTab === 'manage' ? '#007bff' : 'transparent',
                        color: activeTab === 'manage' ? 'white' : '#6c757d',
                        borderRadius: '8px 8px 0 0',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                >
                    Manage Posted Internships ({postedInternships.length})
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'post' ? (
                /* Post New Internship Form */
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '40px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                    {editingInternship && (
                        <div style={{
                            marginBottom: '20px',
                            padding: '15px',
                            backgroundColor: '#e3f2fd',
                            borderRadius: '8px',
                            border: '1px solid #2196f3'
                        }}>
                            <h3 style={{ color: '#1976d2', margin: '0 0 10px 0' }}>Editing Internship</h3>
                            <p style={{ color: '#1976d2', margin: 0 }}>You are currently editing: {editingInternship.title}</p>
                            <button
                                onClick={handleCancelEdit}
                                style={{
                                    marginTop: '10px',
                                    padding: '6px 12px',
                                    backgroundColor: 'transparent',
                                    color: '#1976d2',
                                    border: '1px solid #1976d2',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem'
                                }}
                            >
                                Cancel Edit
                            </button>
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gap: '25px' }}>
                            {/* ...existing form fields... */}
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
                                    name="duration_months"
                                    value={formData.duration_months}
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
                                    Salary Range (Min)
                                </label>
                                <input
                                    type="number"
                                    name="salary_min"
                                    value={formData.salary_min}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '8px',
                                        fontSize: '1rem'
                                    }}
                                    placeholder="e.g., 2000000"
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                    Salary Range (Max)
                                </label>
                                <input
                                    type="number"
                                    name="salary_max"
                                    value={formData.salary_max}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '8px',
                                        fontSize: '1rem'
                                    }}
                                    placeholder="e.g., 3000000"
                                />
                            </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                Application Deadline
                            </label>
                            <input
                                type="date"
                                name="application_deadline"
                                value={formData.application_deadline}
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
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                                padding: '15px 30px',
                                backgroundColor: isSubmitting ? '#6c757d' : '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                transition: 'background-color 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                if (!isSubmitting) e.target.style.backgroundColor = '#0056b3';
                            }}
                            onMouseLeave={(e) => {
                                if (!isSubmitting) e.target.style.backgroundColor = '#007bff';
                            }}
                        >
                            {isSubmitting ? (editingInternship ? 'Updating...' : 'Posting...') : (editingInternship ? 'Update Internship' : 'Post Internship')}
                        </button>
                    </div>
                </form>
            </div>
            ) : (
                /* Manage Posted Internships */
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '40px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Your Posted Internships</h2>
                    
                    {loadingInternships ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <p>Loading your internships...</p>
                        </div>
                    ) : postedInternships.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📝</div>
                            <h3 style={{ color: '#6c757d', marginBottom: '10px' }}>No internships posted yet</h3>
                            <p style={{ color: '#6c757d', marginBottom: '20px' }}>
                                Start by posting your first internship opportunity to attract talented students.
                            </p>
                            <button
                                onClick={() => setActiveTab('post')}
                                style={{
                                    padding: '12px 24px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    fontWeight: '600'
                                }}
                            >
                                Post Your First Internship
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '20px' }}>
                            {postedInternships.map(internship => (
                                <div 
                                    key={internship.internship_id}
                                    style={{
                                        border: '1px solid #e9ecef',
                                        borderRadius: '12px',
                                        padding: '25px',
                                        backgroundColor: '#f8f9fa',
                                        position: 'relative'
                                    }}
                                >
                                    {/* Status Badge */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '20px',
                                        right: '20px',
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        backgroundColor: internship.is_active ? '#d4edda' : '#f8d7da',
                                        color: internship.is_active ? '#155724' : '#721c24',
                                        border: `1px solid ${internship.is_active ? '#c3e6cb' : '#f5c6cb'}`
                                    }}>
                                        {internship.is_active ? 'Active' : 'Inactive'}
                                    </div>

                                    {/* Internship Details */}
                                    <div style={{ marginRight: '100px' }}>
                                        <h3 style={{ 
                                            color: '#2c3e50', 
                                            marginBottom: '8px',
                                            fontSize: '1.4rem'
                                        }}>
                                            {internship.title}
                                        </h3>
                                        
                                        <div style={{ 
                                            display: 'grid', 
                                            gridTemplateColumns: '1fr 1fr', 
                                            gap: '15px',
                                            marginBottom: '15px'
                                        }}>
                                            <div>
                                                <strong style={{ color: '#2c3e50' }}>Location:</strong>
                                                <span style={{ marginLeft: '8px', color: '#6c757d' }}>
                                                    {internship.location}
                                                </span>
                                            </div>
                                            <div>
                                                <strong style={{ color: '#2c3e50' }}>Type:</strong>
                                                <span style={{ marginLeft: '8px', color: '#6c757d' }}>
                                                    {internship.type}
                                                </span>
                                            </div>
                                            <div>
                                                <strong style={{ color: '#2c3e50' }}>Duration:</strong>
                                                <span style={{ marginLeft: '8px', color: '#6c757d' }}>
                                                    {internship.duration_months} months
                                                </span>
                                            </div>
                                            <div>
                                                <strong style={{ color: '#2c3e50' }}>Salary:</strong>
                                                <span style={{ marginLeft: '8px', color: '#6c757d' }}>
                                                    {formatSalary(internship.salary_min, internship.salary_max)}
                                                </span>
                                            </div>
                                            <div>
                                                <strong style={{ color: '#2c3e50' }}>Deadline:</strong>
                                                <span style={{ marginLeft: '8px', color: '#6c757d' }}>
                                                    {formatDate(internship.application_deadline)}
                                                </span>
                                            </div>
                                            <div>
                                                <strong style={{ color: '#2c3e50' }}>Applications:</strong>
                                                <span style={{ marginLeft: '8px', color: '#007bff', fontWeight: '600' }}>
                                                    {internship.application_count || 0}
                                                </span>
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '15px' }}>
                                            <strong style={{ color: '#2c3e50' }}>Description:</strong>
                                            <p style={{ 
                                                marginTop: '8px', 
                                                color: '#6c757d',
                                                lineHeight: '1.5',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                                {internship.description}
                                            </p>
                                        </div>

                                        <div style={{ marginBottom: '20px' }}>
                                            <strong style={{ color: '#2c3e50' }}>Requirements:</strong>
                                            <p style={{ 
                                                marginTop: '8px', 
                                                color: '#6c757d',
                                                lineHeight: '1.5',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                                {internship.requirements}
                                            </p>
                                        </div>

                                        {/* Action Buttons */}
                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                            <button
                                                onClick={() => handleToggleInternshipStatus(internship.internship_id, internship.is_active)}
                                                style={{
                                                    padding: '8px 16px',
                                                    backgroundColor: internship.is_active ? '#ffc107' : '#28a745',
                                                    color: internship.is_active ? '#212529' : 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.9rem',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                {internship.is_active ? 'Deactivate' : 'Activate'}
                                            </button>
                                            
                                            <button
                                                onClick={() => handleViewApplications(internship.internship_id, internship.title)}
                                                style={{
                                                    padding: '8px 16px',
                                                    backgroundColor: '#17a2b8',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.9rem',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                View Applications ({internship.application_count || 0})
                                            </button>
                                            
                                            <button
                                                onClick={() => handleEditInternship(internship)}
                                                style={{
                                                    padding: '8px 16px',
                                                    backgroundColor: '#6c757d',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.9rem',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                Edit
                                            </button>
                                            
                                            <button
                                                onClick={() => handleDeleteInternship(internship.internship_id)}
                                                style={{
                                                    padding: '8px 16px',
                                                    backgroundColor: '#dc3545',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.9rem',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>

                                        {/* Posted Date */}
                                        <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #e9ecef' }}>
                                            <small style={{ color: '#6c757d' }}>
                                                Posted on: {formatDate(internship.created_at)}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PostInternship;