import React, { useState } from 'react';

const certificates = [
  {
    company: 'CompanyA',
    jobTitle: 'Software Engineer Intern',
    startDate: '2023-06-01',
    endDate: '2023-08-31',
    letter: 'Internship Completion Letter',
    feedback: 'Mahija showed excellent problem-solving skills and contributed greatly to our team.',
    mentor: 'John Smith',
    fileUrl: 'https://example.com/files/companyA-internship-letter.pdf',
  },
  {
    company: 'CompanyA',
    jobTitle: 'Software Engineer Intern',
    startDate: '2023-06-01',
    endDate: '2023-08-31',
    letter: 'Certificate of Internship',
    feedback: 'Mahija completed all assigned tasks with dedication and professionalism.',
    mentor: 'John Smith',
    fileUrl: 'https://example.com/files/companyA-certificate.pdf',
  },
  {
    company: 'CompanyA',
    jobTitle: 'Frontend Developer Intern',
    startDate: '2022-01-10',
    endDate: '2022-03-30',
    letter: 'Internship Completion Letter',
    feedback: 'Rina excelled in UI/UX and delivered high-quality web components.',
    mentor: 'Sarah Lee',
    fileUrl: 'https://example.com/files/companyA-frontend-letter.pdf',
  },
  {
    company: 'CompanyA',
    jobTitle: 'Backend Developer Intern',
    startDate: '2021-09-01',
    endDate: '2021-12-01',
    letter: 'Certificate of Internship',
    feedback: 'Dewi implemented robust APIs and improved system reliability.',
    mentor: 'Michael Tan',
    fileUrl: 'https://example.com/files/companyA-backend-certificate.pdf',
  },
  {
    company: 'CompanyA',
    jobTitle: 'QA Tester Intern',
    startDate: '2020-05-15',
    endDate: '2020-08-15',
    letter: 'Internship Completion Letter',
    feedback: 'Andi ensured product quality and created detailed test cases.',
    mentor: 'Lisa Wong',
    fileUrl: 'https://example.com/files/companyA-qa-letter.pdf',
  },
  {
    company: 'CompanyB',
    jobTitle: 'Business Analyst Intern',
    startDate: '2023-07-01',
    endDate: '2023-09-30',
    letter: 'Certificate of Internship',
    feedback: 'Arjun demonstrated strong leadership and communication throughout his internship.',
    mentor: 'Priya Kumar',
    fileUrl: 'https://example.com/files/companyB-certificate.pdf',
  },
];

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
      certs: []
    };
    companyGroups[cert.company].push(post);
  }
  post.certs.push(cert);
});

const InternshipCertifications = () => {
  const [openPost, setOpenPost] = useState({});
  const [search, setSearch] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [jobTitleFilter, setJobTitleFilter] = useState('');

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
      <h2 style={{ color: '#007bff', marginBottom: '20px' }}>My Internship Applications</h2>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by company or job title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: '1', minWidth: '220px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <select
          value={companyFilter}
          onChange={e => setCompanyFilter(e.target.value)}
          style={{ minWidth: '180px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
        >
          <option value="">All Companies</option>
          {allCompanies.map(company => (
            <option key={company} value={company}>{company}</option>
          ))}
        </select>
        <select
          value={jobTitleFilter}
          onChange={e => setJobTitleFilter(e.target.value)}
          style={{ minWidth: '180px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
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
                  const firstCert = post.certs[0];
                  // Find certificate and letter
                  const certItem = post.certs.find(item => item.letter.toLowerCase().includes('certificate'));
                  const letterItem = post.certs.find(item => item.letter.toLowerCase().includes('letter'));
                  return (
                    <div key={postKey} style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 'bold', color: '#343a40', marginBottom: '4px' }}>{post.jobTitle}</div>
                          <div style={{ color: '#343a40', marginBottom: '4px' }}>Internship Period: {post.startDate} - {post.endDate}</div>
                        </div>
                        <button
                          onClick={() => setOpenPost(prev => ({ ...prev, [postKey]: !prev[postKey] }))}
                          style={{ background: '#007bff', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          {openPost[postKey] ? 'Hide' : 'View'}
                        </button>
                      </div>
                      {openPost[postKey] && (
                        <div style={{ background: '#fff', padding: '16px', borderRadius: '10px', border: '1px solid #e9ecef', boxShadow: '0 1px 4px #e9ecef', marginTop: '12px' }}>
                          <p style={{ margin: '4px 0', color: '#6c757d' }}><strong>Mentor:</strong> {firstCert.mentor}</p>
                          <div style={{ marginTop: '10px', color: '#343a40', background: '#e7f3ff', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                            <strong>Feedback/Evaluation:</strong> {firstCert.feedback}
                          </div>
                          {/* Certificate Section */}
                          <div style={{ marginBottom: '10px' }}>
                            <span style={{ fontWeight: 'bold', color: '#007bff' }}>Certificate:</span>
                            {certItem ? (
                              <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '10px', border: '1px solid #e9ecef', marginTop: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontWeight: 'bold', color: '#343a40' }}>{certItem.letter}</span>
                                  <a
                                    href={certItem.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ background: '#28a745', color: 'white', textDecoration: 'none', padding: '6px 16px', borderRadius: '4px', fontSize: '14px' }}
                                  >
                                    View File
                                  </a>
                                </div>
                              </div>
                            ) : (
                              <div style={{ color: '#dc3545', marginTop: '8px' }}>No certificate available.</div>
                            )}
                          </div>
                          {/* Letter Section */}
                          <div style={{ marginBottom: '10px' }}>
                            <span style={{ fontWeight: 'bold', color: '#007bff' }}>Letter:</span>
                            {letterItem ? (
                              <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '10px', border: '1px solid #e9ecef', marginTop: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontWeight: 'bold', color: '#343a40' }}>{letterItem.letter}</span>
                                  <a
                                    href={letterItem.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ background: '#28a745', color: 'white', textDecoration: 'none', padding: '6px 16px', borderRadius: '4px', fontSize: '14px' }}
                                  >
                                    View File
                                  </a>
                                </div>
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