import React, { useState, useEffect } from 'react';
import { internshipDocumentsAPI } from '../auth/api.jsx';
import api from '../auth/api.jsx';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const FILE_BASE_URL = API_BASE_URL.replace(/\/api$/, '');

const InternshipCertifications = () => {
  const [openPost, setOpenPost] = useState({});
  const [search, setSearch] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [jobTitleFilter, setJobTitleFilter] = useState('');
  const [certificates, setCertificates] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchDocs = async () => {
      const user = localStorage.getItem('user');
      let studentId = '';
      if (user) {
        try {
          const parsed = JSON.parse(user);
          studentId = parsed.student_id || parsed.id;
        } catch (e) {
          studentId = '';
        }
      }
      if (!studentId) return;
      try {
        const data = await internshipDocumentsAPI.getForStudent(studentId);
        // Log raw data for debugging
        // console.log('Fetched internship documents:', data.documents);
        // Map backend data to expected frontend structure
        const mapped = (data.documents || []).map(doc => ({
          company: doc.company_name || doc.company || '',
          jobTitle: doc.internship_title || doc.title || '',
          startDate: doc.start_date || '',
          endDate: doc.end_date || '',
          mentor: doc.mentor || '',
          feedback: doc.feedback || '',
          letter: doc.letter_file_url ? 'Letter' : '',
          certificate: doc.certificate_file_url ? 'Certificate' : '',
          fileUrl: doc.certificate_file_url || doc.letter_file_url || '',
          certificate_file_url: doc.certificate_file_url || '',
          letter_file_url: doc.letter_file_url || '',
        }));
        setCertificates(mapped);
      } catch (err) {
        setCertificates([]);
      }
    };
    fetchDocs();
  }, []);

  // Group posts by company
  const companyGroups = {};
  certificates.forEach(cert => {
    const postKey = `${cert.jobTitle}-${cert.startDate}-${cert.endDate}`;
    if (!companyGroups[cert.company]) {
      companyGroups[cert.company] = [];
    }
    let post = companyGroups[cert.company].find(p => p.key === postKey);
    if (!post) {
      post = {
        key: postKey,
        jobTitle: cert.jobTitle,
        startDate: cert.startDate,
        endDate: cert.endDate,
        mentor: cert.mentor,
        feedback: cert.feedback,
        certificate_file_url: cert.certificate_file_url,
        letter_file_url: cert.letter_file_url,
        certs: []
      };
      companyGroups[cert.company].push(post);
    }
    post.certs.push(cert);
  });

  // Get unique companies and job titles for filter options
  const allCompanies = Object.keys(companyGroups);
  const allJobTitles = Array.from(new Set(certificates.map(cert => cert.jobTitle)));

  // Filter companies and posts by search and filters
  const filteredCompanies = Object.entries(companyGroups).filter(([company, posts]) => {
    const matchesCompany = companyFilter ? company === companyFilter : true;
    const matchesSearch = company.toLowerCase().includes(search.toLowerCase());
    const filteredPosts = posts.filter(post => {
      const matchesJob = jobTitleFilter ? post.jobTitle === jobTitleFilter : true;
      const matchesPostSearch = post.jobTitle.toLowerCase().includes(search.toLowerCase());
      return matchesJob && matchesPostSearch;
    });
    return matchesCompany && (matchesSearch || filteredPosts.length > 0);
  });

  return (
    <div>
      <h2 style={{ color: '#007bff', marginBottom: '20px' }}>My Internship Completions</h2>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center' }}>
        <input
          type="text"
          placeholder="Search by company or job title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: isMobile ? 'none' : '1', width: isMobile ? '100%' : 'auto', minWidth: isMobile ? 'auto' : '220px', padding: '0px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <select
          value={companyFilter}
          onChange={e => setCompanyFilter(e.target.value)}
          style={{ minWidth: isMobile ? '100%' : '180px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
        >
          <option value="">All Companies</option>
          {allCompanies.map(company => (
            <option key={company} value={company}>{company}</option>
          ))}
        </select>
        <select
          value={jobTitleFilter}
          onChange={e => setJobTitleFilter(e.target.value)}
          style={{ minWidth: isMobile ? '100%' : '180px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
        >
          <option value="">All Job Titles</option>
          {allJobTitles.map(title => (
            <option key={title} value={title}>{title}</option>
          ))}
        </select>
      </div>
      {filteredCompanies.length === 0 ? (
        <div style={{ color: '#6c757d', textAlign: 'center', padding: '30px' }}>No internship applications found.</div>
      ) : (
        <div style={{ display: 'grid', gap: '32px' }}>
          {filteredCompanies.map(([company, posts], cIdx) => (
            <div key={company} style={{ background: '#e7f3ff', padding: '28px', borderRadius: '16px', border: '1px solid #b6d4fe' }}>
              <h2 style={{ color: '#007bff', marginBottom: '18px' }}>{company}</h2>
              <div style={{ display: 'grid', gap: '18px' }}>
                {posts.filter(post => {
                  const matchesJob = jobTitleFilter ? post.jobTitle === jobTitleFilter : true;
                  const matchesPostSearch = post.jobTitle.toLowerCase().includes(search.toLowerCase());
                  return matchesJob && matchesPostSearch;
                }).map((post, pIdx) => {
                  const postKey = `${company}-${post.key}`;
                  return (
                    <div key={postKey} style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'center', gap: isMobile ? '12px' : '0' }}>
                        <div>
                          <div style={{ fontWeight: 'bold', color: '#343a40', marginBottom: '4px' }}>{post.jobTitle}</div>
                          <div style={{ color: '#343a40', marginBottom: '4px' }}>Internship Period: {post.startDate} - {post.endDate}</div>
                        </div>
                        <button
                          onClick={() => setOpenPost(prev => ({ ...prev, [postKey]: !prev[postKey] }))}
                          style={{ background: '#007bff', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', width: isMobile ? '100%' : 'auto' }}
                        >
                          {openPost[postKey] ? 'Hide' : 'View'}
                        </button>
                      </div>
                      {openPost[postKey] && (
                        <div style={{ background: '#fff', padding: '16px', borderRadius: '10px', border: '1px solid #e9ecef', boxShadow: '0 1px 4px #e9ecef', marginTop: '12px' }}>
                          <p style={{ margin: '4px 0', color: '#6c757d' }}><strong>Mentor:</strong> {post.mentor}</p>
                          <div style={{ marginTop: '10px', color: '#343a40', background: '#e7f3ff', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                            <strong>Feedback/Evaluation:</strong> {post.feedback}
                          </div>
                          {/* Certificate Section */}
                          <div style={{ marginBottom: '10px' }}>
                            <span style={{ fontWeight: 'bold', color: '#007bff' }}>Certificate:</span>
                            {post.certificate_file_url ? (
                              <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '10px', border: '1px solid #e9ecef', marginTop: '8px' }}>
                                <a
                                  href={post.certificate_file_url ? `${FILE_BASE_URL}${post.certificate_file_url}` : '#'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ background: '#28a745', color: 'white', textDecoration: 'none', padding: '6px 16px', borderRadius: '4px', fontSize: '14px' }}
                                >
                                  View Certificate
                                </a>
                              </div>
                            ) : (
                              <div style={{ color: '#dc3545', marginTop: '8px' }}>No certificate available.</div>
                            )}
                          </div>
                          {/* Letter Section */}
                          <div style={{ marginBottom: '10px' }}>
                            <span style={{ fontWeight: 'bold', color: '#007bff' }}>Letter:</span>
                            {post.letter_file_url ? (
                              <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '10px', border: '1px solid #e9ecef', marginTop: '8px' }}>
                                <a
                                  href={post.letter_file_url ? `${FILE_BASE_URL}${post.letter_file_url}` : '#'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ background: '#28a745', color: 'white', textDecoration: 'none', padding: '6px 16px', borderRadius: '4px', fontSize: '14px' }}
                                >
                                  View Letter
                                </a>
                              </div>
                            ) : (
                              <div style={{ color: '#dc3545', marginTop: '8px' }}>No letter available.</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InternshipCertifications;