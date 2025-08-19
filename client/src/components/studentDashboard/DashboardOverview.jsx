import React from 'react';

const DashboardOverview = () => {
  const stats = [
    { label: 'Active Internships', value: '5', icon: '📝', color: '#007bff' },
    { label: 'Applications Submitted', value: '14', icon: '📋', color: '#28a745' },
    { label: 'Internships Completed', value: '3', icon: '✅', color: '#17a2b8' },
    { label: 'Profile Views', value: '320', icon: '👁️', color: '#ffc107' }
  ];

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Dashboard Overview</h1>
        <p style={{ color: '#6c757d' }}>Welcome to your student dashboard. Track your internship progress, applications, and achievements here.</p>
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
            { action: 'Application submitted for Software Engineer Internship', time: '2 hours ago', type: 'application' },
            { action: 'Frontend Developer internship completed', time: '1 day ago', type: 'completed' },
            { action: 'Interview scheduled with CompanyA', time: '2 days ago', type: 'interview' },
            { action: 'Received certificate for Backend Developer Internship', time: '3 days ago', type: 'certificate' }
          ].map((activity, index) => (
            <div key={index} style={{
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              borderLeft: `4px solid ${activity.type === 'application' ? '#28a745' : activity.type === 'completed' ? '#17a2b8' : activity.type === 'certificate' ? '#ffc107' : '#007bff'}`
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

export default DashboardOverview;