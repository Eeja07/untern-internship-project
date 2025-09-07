import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { internshipAPI } from '../auth/api.jsx';

const TrackApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const remapStatus = (status) => {
    if (status === 'shortlisted') return 'pending';
    return status;
  };

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await internshipAPI.getMyApplications();
      if (result.success) {
        // Remap any 'shortlisted' status to 'pending' just in case
        const mappedApps = (result.applications || []).map(app => ({ ...app, status: remapStatus(app.status) }));
        setApplications(mappedApps);
        console.log('Student applications:', mappedApps);
      } else {
        setError(result.message || 'Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError('Error loading applications: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
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

  const handleNavigateToDiscover = () => {
    navigate('/student-dashboard/discover');
  };

  const filteredApplications = applications.filter(app => {
    const title = app.title?.toLowerCase() || '';
    const company = app.company_name?.toLowerCase() || '';
    const term = searchTerm.toLowerCase();
    const statusMatch = statusFilter === 'all' || app.status === statusFilter;
    return statusMatch && (title.includes(term) || company.includes(term));
  });

  return (
    <div>
      <h2 style={{ color: '#007bff', marginBottom: '20px' }}>Track Your Applications</h2>
      <div style={{
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
      }}>
        {/* Search input for applications */}
        <div style={{marginBottom: '20px' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by internship title or company name..."
            style={{
              padding: '0px',
              width: '100%',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '1rem',
              marginBottom: '10px'
            }}
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3>Your Applications</h3>
          <span style={{ 
            background: '#007bff', 
            color: 'white', 
            padding: '5px 15px', 
            borderRadius: '20px',
            fontSize: '14px'
          }}>
            {filteredApplications.filter(app => app.status === 'pending').length} Active
          </span>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading your applications...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#dc3545' }}>
            <p>{error}</p>
            <button 
              onClick={fetchApplications}
              style={{
                marginTop: '10px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        ) : applications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📋</div>
            <h4>No Applications Yet</h4>
            <p style={{ color: '#6c757d', marginBottom: '20px' }}>
              Start applying to internships to track your progress here.
            </p>
            <button 
              onClick={handleNavigateToDiscover}
              style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Find Internships
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {filteredApplications.map(application => (
              <div 
                key={application.application_id}
                style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid #e9ecef',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div>
                    <h4 style={{ color: '#2c3e50', marginBottom: '5px' }}>
                      {application.title || 'Internship Position'}
                    </h4>
                    <p style={{ color: '#007bff', fontWeight: '500', margin: '0 0 5px 0' }}>
                      {application.company_name || 'Company Name'}
                    </p>
                    <p style={{ color: '#6c757d', margin: 0, fontSize: '0.9rem' }}>
                      Applied on: {formatDate(application.applied_date)}
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
                
                {application.internship_description && (
                  <div style={{ marginBottom: '15px' }}>
                    <p style={{ 
                      color: '#6c757d',
                      lineHeight: '1.5',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      margin: 0
                    }}>
                      {application.internship_description}
                    </p>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', fontSize: '0.9rem' }}>
                  {application.location && (
                    <div>
                      <strong style={{ color: '#2c3e50' }}>Location:</strong>
                      <span style={{ marginLeft: '5px', color: '#6c757d' }}>{application.location}</span>
                    </div>
                  )}
                  {application.type && (
                    <div>
                      <strong style={{ color: '#2c3e50' }}>Type:</strong>
                      <span style={{ marginLeft: '5px', color: '#6c757d' }}>{application.type}</span>
                    </div>
                  )}
                  {application.duration_months && (
                    <div>
                      <strong style={{ color: '#2c3e50' }}>Duration:</strong>
                      <span style={{ marginLeft: '5px', color: '#6c757d' }}>{application.duration_months} months</span>
                    </div>
                  )}
                  {(application.salary_min || application.salary_max) && (
                    <div>
                      <strong style={{ color: '#2c3e50' }}>Salary:</strong>
                      <span style={{ marginLeft: '5px', color: '#6c757d' }}>
                        {application.salary_min && application.salary_max 
                          ? `Rp ${application.salary_min?.toLocaleString()} - Rp ${application.salary_max?.toLocaleString()}`
                          : application.salary_min 
                            ? `From Rp ${application.salary_min?.toLocaleString()}`
                            : `Up to Rp ${application.salary_max?.toLocaleString()}`
                        }
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackApplications;