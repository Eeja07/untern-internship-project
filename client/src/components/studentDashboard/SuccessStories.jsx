import React from 'react';

const DashboardOverview = () => {
  return (
    <div>
      <h2 style={{ color: '#007bff', marginBottom: '20px' }}>Dashboard Overview</h2>
      <div style={{ background: '#f8f9fa', padding: '30px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
        <h3>Welcome to your student dashboard!</h3>
        <p style={{ color: '#6c757d' }}>
          Here you can track your internship progress, view your certifications, read company reviews, and manage your profile. Use the navigation to explore opportunities and resources tailored for your career growth.
        </p>
        <ul style={{ color: '#007bff', marginTop: '20px' }}>
          <li>Internship Progress</li>
          <li>Certificates & Letters</li>
          <li>Student Experiences</li>
          <li>Profile & Settings</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardOverview;