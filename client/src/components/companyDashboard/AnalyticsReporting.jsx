import React from 'react';

const AnalyticsReporting = () => {
    const analyticsData = {
        jobViews: [
            { month: 'Jan', views: 1200 },
            { month: 'Feb', views: 1800 },
            { month: 'Mar', views: 2400 }
        ],
        applications: [
            { month: 'Jan', count: 45 },
            { month: 'Feb', count: 67 },
            { month: 'Mar', count: 89 }
        ]
    };

    return (
        <div>
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Analytics & Reporting</h1>
                <p style={{ color: '#6c757d' }}>Track your internship postings performance and candidate engagement.</p>
            </div>

            {/* Key Metrics */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '40px'
            }}>
                {[
                    { title: 'Total Job Views', value: '5,420', change: '+12%', color: '#007bff' },
                    { title: 'Applications Received', value: '201', change: '+23%', color: '#28a745' },
                    { title: 'Interview Scheduled', value: '45', change: '+8%', color: '#17a2b8' },
                    { title: 'Conversion Rate', value: '22.4%', change: '+3.2%', color: '#ffc107' }
                ].map((metric, index) => (
                    <div key={index} style={{
                        backgroundColor: 'white',
                        padding: '25px',
                        borderRadius: '12px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ color: '#2c3e50', margin: '0 0 10px 0', fontSize: '1rem' }}>{metric.title}</h3>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: metric.color }}>{metric.value}</span>
                            <span style={{ color: '#28a745', fontSize: '0.9rem', fontWeight: '500' }}>{metric.change}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Placeholder */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '30px',
                marginBottom: '40px'
            }}>
                <div style={{
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Job Views Trend</h3>
                    <div style={{
                        height: '200px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6c757d'
                    }}>
                        Chart: Job Views Over Time
                    </div>
                </div>

                <div style={{
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Application Trend</h3>
                    <div style={{
                        height: '200px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6c757d'
                    }}>
                        Chart: Applications Over Time
                    </div>
                </div>
            </div>

            {/* Recent Performance */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '30px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Top Performing Job Postings</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa' }}>
                                <th style={{ padding: '12px', textAlign: 'left', color: '#2c3e50' }}>Job Title</th>
                                <th style={{ padding: '12px', textAlign: 'left', color: '#2c3e50' }}>Views</th>
                                <th style={{ padding: '12px', textAlign: 'left', color: '#2c3e50' }}>Applications</th>
                                <th style={{ padding: '12px', textAlign: 'left', color: '#2c3e50' }}>Conversion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { title: 'Frontend Developer Intern', views: '1,240', applications: '45', conversion: '3.6%' },
                                { title: 'Backend Developer Intern', views: '980', applications: '38', conversion: '3.9%' },
                                { title: 'UI/UX Designer Intern', views: '756', applications: '29', conversion: '3.8%' }
                            ].map((job, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #e9ecef' }}>
                                    <td style={{ padding: '15px 12px', color: '#2c3e50', fontWeight: '500' }}>{job.title}</td>
                                    <td style={{ padding: '15px 12px', color: '#6c757d' }}>{job.views}</td>
                                    <td style={{ padding: '15px 12px', color: '#6c757d' }}>{job.applications}</td>
                                    <td style={{ padding: '15px 12px', color: '#28a745', fontWeight: '500' }}>{job.conversion}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsReporting;