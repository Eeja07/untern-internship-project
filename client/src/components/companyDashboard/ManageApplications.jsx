import React, { useState, useEffect } from 'react';
import ManageApplicationsByStatus from './ManageApplicationsByStatus.jsx';
import ManageApplicationsByPost from './ManageApplicationsByPost.jsx';

const ManageApplications = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const responsiveCols = {
        grid3: isMobile ? '1fr' : 'repeat(3, 1fr)',
        grid2: isMobile ? '1fr' : '1fr 1fr'
    };

    // Update filter row styles
    const filterRowStyle = {
        display: 'flex',
        gap: '16px',
        marginBottom: '20px',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center'
    };

    // Update application grid styles
    const applicationGridStyle = {
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '20px'
    };

    // Update application card styles
    const applicationCardStyle = {
        background: 'white',
        padding: isMobile ? '16px' : '20px',
        borderRadius: '12px',
        border: '1px solid #e9ecef',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    };

    // Update action button container styles
    const actionButtonsStyle = {
        display: 'flex',
        gap: '10px',
        flexDirection: isMobile ? 'column' : 'row',
        marginTop: '15px'
    };

    // Update individual action button styles
    const actionButtonStyle = {
        padding: '8px 16px',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.9rem',
        width: isMobile ? '100%' : 'auto'
    };

    // Update tab styles for mobile
    const tabContainerStyle = {
        display: 'flex',
        gap: '10px',
        marginBottom: '24px',
        flexDirection: isMobile ? 'column' : 'row'
    };

    const tabButtonStyle = {
        padding: '10px 24px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        width: isMobile ? '100%' : 'auto'
    };

    return (
        <div>
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Manage Applications</h1>
                <p style={{ color: '#6c757d' }}>Review and manage internship applications from candidates.</p>
            </div>
            <div style={{
                display: 'flex',
                marginBottom: '30px',
                borderBottom: '2px solid #e9ecef',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '10px' : '0'
            }}>
                <button
                    onClick={() => setActiveTab('all')}
                    style={{
                        padding: '12px 24px',
                        border: 'none',
                        background: activeTab === 'all' ? '#007bff' : 'transparent',
                        color: activeTab === 'all' ? 'white' : '#6c757d',
                        borderRadius: isMobile ? '8px' : '8px 8px 0 0',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginRight: isMobile ? '0' : '10px',
                        transition: 'all 0.3s ease',
                        width: isMobile ? '100%' : 'auto'
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
                        borderRadius: isMobile ? '8px' : '8px 8px 0 0',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        width: isMobile ? '100%' : 'auto'
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