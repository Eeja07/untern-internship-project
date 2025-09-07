import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const AnalyticsReporting = () => {
    const [dateRange, setDateRange] = useState('30d');
    const [jobFilter, setJobFilter] = useState('All');
    const [sortBy, setSortBy] = useState('views');
    const [sortDir, setSortDir] = useState('desc');
    const [showAll, setShowAll] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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

    const jobs = [
        { title: 'Frontend Developer Intern', views: 1240, applications: 45, conversion: 3.6, date: '2024-03-01', status: 'Active' },
        { title: 'Backend Developer Intern', views: 980, applications: 38, conversion: 3.9, date: '2024-02-15', status: 'Active' },
        { title: 'UI/UX Designer Intern', views: 756, applications: 29, conversion: 3.8, date: '2024-01-20', status: 'Closed' },
        { title: 'QA Tester Intern', views: 600, applications: 18, conversion: 3.0, date: '2024-01-10', status: 'Active' },
        { title: 'Marketing Intern', views: 500, applications: 15, conversion: 3.0, date: '2024-02-01', status: 'Closed' }
    ];

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Sorting
    const sortedJobs = [...jobs]
        .filter(j => jobFilter === 'All' || j.title === jobFilter)
        .sort((a, b) => sortDir === 'asc' ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy]);
    const jobsToShow = showAll ? sortedJobs : sortedJobs.slice(0, 3);

    return (
        <div>
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Analytics & Reporting</h1>
                <p style={{ color: '#6c757d' }}>Track your internship postings performance and candidate engagement.</p>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '18px', marginBottom: '28px', flexWrap: 'wrap' }}>
                <select value={dateRange} onChange={e => setDateRange(e.target.value)} style={{ padding: '10px 16px', borderRadius: '8px', border: '2px solid #e9ecef', fontSize: '1rem' }}>
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="custom">Custom Range</option>
                </select>
                <select value={jobFilter} onChange={e => setJobFilter(e.target.value)} style={{ padding: '10px 16px', borderRadius: '8px', border: '2px solid #e9ecef', fontSize: '1rem' }}>
                    <option value="All">All Jobs</option>
                    {jobs.map(j => <option key={j.title} value={j.title}>{j.title}</option>)}
                </select>
            </div>

            {/* Key Metrics */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '40px'
            }}>
                {[{
                    title: 'Total Job Views', value: '5,420', change: '+12%', color: '#007bff', context: 'vs. last month'
                }, {
                    title: 'Applications Received', value: '201', change: '+23%', color: '#28a745', context: 'vs. last month'
                }, {
                    title: 'Interview Scheduled', value: '45', change: '+8%', color: '#17a2b8', context: 'vs. last month'
                }, {
                    title: 'Conversion Rate', value: '22.4%', change: '+3.2%', color: '#ffc107', context: 'vs. last month', tooltip: 'Conversion = Applications ÷ Views'
                }].map((metric, index) => (
                    <div key={index} style={{
                        backgroundColor: 'white',
                        padding: '25px',
                        borderRadius: '12px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        position: 'relative'
                    }}>
                        <h3 style={{ color: '#2c3e50', margin: '0 0 10px 0', fontSize: '1rem' }}>{metric.title}
                            {metric.tooltip && (
                                <span title={metric.tooltip} style={{ marginLeft: '6px', color: '#6c757d', cursor: 'help', fontSize: '1.1rem' }}>ⓘ</span>
                            )}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: metric.color }}>{metric.value}</span>
                            <span style={{ color: '#28a745', fontSize: '0.9rem', fontWeight: '500' }}>{metric.change}</span>
                        </div>
                        <div style={{ color: '#6c757d', fontSize: '0.95rem', marginTop: '6px' }}>{metric.context}</div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '30px',
                marginBottom: '40px',
                maxWidth: '100%',
            }}>
                <div style={{
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Job Views Trend</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={analyticsData.jobViews}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="views" stroke="#007bff" strokeWidth={3} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div style={{
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Application Trend</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={analyticsData.applications}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#28a745" barSize={32} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Performance Table */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '30px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Top Performing Job Postings</h2>
                <div style={{ marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ color: '#6c757d', fontSize: '1rem' }}>Sort by:</span>
                        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '7px 12px', borderRadius: '6px', border: '1.5px solid #e9ecef', fontSize: '1rem' }}>
                            <option value="views">Views</option>
                            <option value="applications">Applications</option>
                            <option value="conversion">Conversion</option>
                        </select>
                        <button onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')} style={{ background: 'none', border: 'none', color: '#007bff', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>{sortDir === 'asc' ? '↑' : '↓'}</button>
                    </div>
                    <button onClick={() => setShowAll(v => !v)} style={{ padding: '8px 22px', background: '#007bff', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '1rem', cursor: 'pointer' }}>{showAll ? 'Show Top 3' : 'View All'}</button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa' }}>
                                <th style={{ padding: '12px', textAlign: 'left', color: '#2c3e50' }}>Job Title</th>
                                <th style={{ padding: '12px', textAlign: 'left', color: '#2c3e50' }}>Views</th>
                                <th style={{ padding: '12px', textAlign: 'left', color: '#2c3e50' }}>Applications</th>
                                <th style={{ padding: '12px', textAlign: 'left', color: '#2c3e50' }}>Conversion <span title="Applications ÷ Views" style={{ color: '#6c757d', cursor: 'help', fontSize: '1.1rem' }}>ⓘ</span></th>
                                <th style={{ padding: '12px', textAlign: 'left', color: '#2c3e50' }}>Date Posted</th>
                                <th style={{ padding: '12px', textAlign: 'left', color: '#2c3e50' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobsToShow.map((job, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #e9ecef' }}>
                                    <td style={{ padding: '15px 12px', color: '#2c3e50', fontWeight: '500' }}>{job.title}</td>
                                    <td style={{ padding: '15px 12px', color: '#6c757d' }}>{job.views}</td>
                                    <td style={{ padding: '15px 12px', color: '#6c757d' }}>{job.applications}</td>
                                    <td style={{ padding: '15px 12px', color: '#28a745', fontWeight: '500' }}>{job.conversion}%</td>
                                    <td style={{ padding: '15px 12px', color: '#6c757d' }}>{job.date}</td>
                                    <td style={{ padding: '15px 12px', color: job.status === 'Active' ? '#007bff' : '#6c757d', fontWeight: '500' }}>{job.status}</td>
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