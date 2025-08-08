import React, { useState } from 'react';

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

export default ManageApplications;