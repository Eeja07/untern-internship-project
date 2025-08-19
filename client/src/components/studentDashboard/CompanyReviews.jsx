import React, { useState } from 'react';

const studentReviews = [
  {
    company: {
      name: 'CompanyA',
      address: '123 Main St, Cityville',
    },
    student: {
      fullName: 'Mahija Rahman',
      education: 'BSc Computer Science, University of Cityville',
    },
    review: 'My internship at CompanyA was transformative. I worked on real projects and received mentorship from experienced engineers. The company culture was supportive and innovative.',
  },
  {
    company: {
      name: 'CompanyB',
      address: '456 Tech Ave, Townsburg',
    },
    student: {
      fullName: 'Arjun Patel',
      education: 'BA Business Administration, Townsburg College',
    },
    review: 'CompanyB provided a great learning environment. I gained practical skills and the team encouraged my growth. Highly recommended for future interns.',
  },
];

// Dummy verification data: only verified internships can be reviewed
const acceptedInternships = [
  { company: 'CompanyA', post: 'Software Engineer Intern', verified: true },
  { company: 'CompanyA', post: 'Frontend Developer Intern', verified: false },
  { company: 'CompanyB', post: 'Business Analyst Intern', verified: true }
];

const uniqueCompanies = [...new Set(studentReviews.map(r => r.company.name))];

const CompanyReviews = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [activeTab, setActiveTab] = useState('view');
  const [reviewForm, setReviewForm] = useState({
    company: '',
    post: '',
    review: ''
  });
  const [formMessage, setFormMessage] = useState('');

  const filteredReviews = studentReviews.filter(item => {
    const matchesSearch =
      item.company.name.toLowerCase().includes(search.toLowerCase()) ||
      item.student.fullName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter ? item.company.name === filter : true;
    return matchesSearch && matchesFilter;
  });

  // Filter accepted and verified posts for selected company
  const acceptedPosts = reviewForm.company
    ? acceptedInternships.filter(i => i.company === reviewForm.company && i.verified)
    : [];
  const isCompanyVerified = acceptedInternships.some(i => i.company === reviewForm.company && i.verified);

  const handleFormChange = (e) => {
    setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
    // Reset post if company changes
    if (e.target.name === 'company') {
      setReviewForm(f => ({ ...f, post: '' }));
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewForm.company || !reviewForm.post) {
      setFormMessage('You must select a verified company and internship post.');
      return;
    }
    setFormMessage('Review submitted! (In real app, this would be verified and saved to DB)');
    setReviewForm({ company: '', post: '', review: '' });
  };

  return (
    <div>
      <h2 style={{ color: '#007bff', marginBottom: '20px' }}>Company Reviews</h2>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('view')}
          style={{
            padding: '10px 24px',
            background: activeTab === 'view' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'view' ? 'white' : '#007bff',
            border: '1px solid #007bff',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          View Reviews
        </button>
        <button
          onClick={() => setActiveTab('write')}
          style={{
            padding: '10px 24px',
            background: activeTab === 'write' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'write' ? 'white' : '#007bff',
            border: '1px solid #007bff',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Write Review
        </button>
      </div>
      {activeTab === 'view' ? (
        <>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search by company or student name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: '1', minWidth: '220px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              style={{ minWidth: '180px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="">All Companies</option>
              {uniqueCompanies.map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'grid', gap: '20px' }}>
            {filteredReviews.length === 0 ? (
              <div style={{ color: '#6c757d', textAlign: 'center', padding: '30px' }}>No reviews found.</div>
            ) : (
              filteredReviews.map((item, idx) => (
                <div key={idx} style={{ background: '#f8f9fa', padding: '24px', borderRadius: '12px', border: '1px solid #e9ecef', boxShadow: '0 2px 8px #e9ecef' }}>
                  <h4 style={{ color: '#007bff', marginBottom: '8px' }}>{item.company.name}</h4>
                  <p style={{ margin: '4px 0', color: '#6c757d' }}><strong>Address:</strong> {item.company.address}</p>
                  <p style={{ margin: '4px 0' }}><strong>Student:</strong> {item.student.fullName}</p>
                  <p style={{ margin: '4px 0', color: '#6c757d' }}><strong>Education:</strong> {item.student.education}</p>
                  <div style={{ marginTop: '14px', fontStyle: 'italic', color: '#343a40', background: '#e7f3ff', padding: '12px', borderRadius: '8px' }}>
                    "{item.review}"
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <form onSubmit={handleReviewSubmit} style={{ width: '100%', background: '#f8f9fa', padding: '24px', borderRadius: '12px', border: '1px solid #e9ecef' }}>
          <h3 style={{ color: '#007bff', marginBottom: '16px' }}>Write a Review</h3>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontWeight: 'bold', color: '#343a40' }}>Company</label>
            <select
              name="company"
              value={reviewForm.company}
              onChange={handleFormChange}
              required
              disabled={reviewForm.company && !isCompanyVerified}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', marginTop: '6px', background: reviewForm.company && !isCompanyVerified ? '#e9ecef' : 'white' }}
            >
              <option value="">Select Company</option>
              {uniqueCompanies.map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontWeight: 'bold', color: '#343a40' }}>Internship Post (Verified)</label>
            <select
              name="post"
              value={reviewForm.post}
              onChange={handleFormChange}
              required
              disabled={!isCompanyVerified || acceptedPosts.length === 0}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', marginTop: '6px', background: !isCompanyVerified || acceptedPosts.length === 0 ? '#e9ecef' : 'white' }}
            >
              <option value="">{!isCompanyVerified ? 'Not verified by company' : acceptedPosts.length === 0 ? 'No verified internship posts available' : 'Select Internship Post'}</option>
              {acceptedPosts.map((i, idx) => (
                <option key={idx} value={i.post}>{i.post}</option>
              ))}
            </select>
          </div>
          {!isCompanyVerified && reviewForm.company && (
            <div style={{ color: '#dc3545', marginBottom: '12px', fontWeight: 'bold' }}>
              You cannot review this company or internship post because you are not verified by the company as having completed the internship.
            </div>
          )}
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontWeight: 'bold', color: '#343a40' }}>Review</label>
            <textarea
              name="review"
              value={reviewForm.review}
              onChange={handleFormChange}
              required
              disabled={!isCompanyVerified || acceptedPosts.length === 0}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', marginTop: '6px', minHeight: '80px', background: !isCompanyVerified || acceptedPosts.length === 0 ? '#e9ecef' : 'white' }}
              placeholder="Write your review here..."
            />
          </div>
          <button
            type="submit"
            disabled={!isCompanyVerified || acceptedPosts.length === 0}
            style={{ background: '#007bff', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '6px', cursor: !isCompanyVerified || acceptedPosts.length === 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold', marginTop: '10px' }}
          >
            Submit Review
          </button>
          {formMessage && (
            <div style={{ marginTop: '16px', color: formMessage.includes('submitted') ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>
              {formMessage}
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default CompanyReviews;