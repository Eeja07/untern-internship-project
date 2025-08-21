import React, { useState } from 'react';
import ManageApplicationsByStatus from './ManageApplicationsByStatus.jsx';
import ManageApplicationsByPost from './ManageApplicationsByPost.jsx';

const ManageApplications = () => {
    const [activeTab, setActiveTab] = useState('all');
    return (
        <div>
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Manage Applications</h1>
                <p style={{ color: '#6c757d' }}>Review and manage internship applications from candidates.</p>
            </div>
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
            {activeTab === 'all' ? <ManageApplicationsByStatus /> : <ManageApplicationsByPost />}
        </div>
    );
};

export default ManageApplications;