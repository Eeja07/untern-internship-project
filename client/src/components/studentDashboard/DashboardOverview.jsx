import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../auth/AuthContext.jsx';

const DashboardOverview = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const statsRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/student/dashboard-stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const statsData = await statsRes.json();
        const activityRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/student/recent-activity`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const activityData = await activityRes.json();
        if (statsData.success && activityData.success) {
          setStats([
            { label: 'Active Internships', value: statsData.stats.active_internships, icon: '📝', color: '#007bff' },
            { label: 'Applications Submitted', value: statsData.stats.applications_submitted, icon: '📋', color: '#28a745' },
            { label: 'Internships Completed', value: statsData.stats.internships_completed, icon: '✅', color: '#17a2b8' },
            { label: 'Profile Views', value: statsData.stats.profile_views, icon: '👁️', color: '#ffc107' }
          ]);
          setRecentActivity(activityData.activities);
        } else {
          setError('Failed to fetch dashboard data');
        }
      } catch (err) {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

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
        {loading ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#6c757d' }}>Loading stats...</div>
        ) : error ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#dc3545' }}>{error}</div>
        ) : (
          stats.map((stat, index) => (
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
          ))
        )}
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
          {loading ? (
            <div style={{ textAlign: 'center', color: '#6c757d' }}>Loading activity...</div>
          ) : error ? (
            <div style={{ textAlign: 'center', color: '#dc3545' }}>{error}</div>
          ) : recentActivity.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#6c757d' }}>No recent activity found.</div>
          ) : (
            recentActivity.map((activity, index) => (
              <div key={index} style={{
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                borderLeft: `4px solid ${activity.type === 'application' ? '#28a745' : activity.type === 'completed' ? '#17a2b8' : activity.type === 'certificate' ? '#ffc107' : '#007bff'}`
              }}>
                <p style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>{activity.action}</p>
                <small style={{ color: '#6c757d' }}>{activity.time}</small>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;