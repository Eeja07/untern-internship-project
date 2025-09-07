import React, { useState, useEffect } from 'react';
import { reviewsAPI } from '../auth/api.jsx';
import { internshipAPI } from '../auth/api.jsx';
import { useAuth } from '../auth/AuthContext';
import ReCAPTCHA from 'react-google-recaptcha';

const CompanyReviews = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [activeTab, setActiveTab] = useState('view');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [reviewForm, setReviewForm] = useState({
    company: '',
    post: '',
    review: '',
    rating: 5
  });
  const [formMessage, setFormMessage] = useState('');
  const [reviews, setReviews] = useState([]);
  const [uniqueCompanies, setUniqueCompanies] = useState([]);
  const [verifiedInternships, setVerifiedInternships] = useState([]);
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const RECAPTCHA_SITE_KEY = '6Lf2E6krAAAAAAzXkluXdOa1A7XVSOMV0cdUyDZM'; // Replace with your actual site key
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await reviewsAPI.getCompanyReviews();
        if (res.success) {
          setReviews(res.reviews || []);
          setUniqueCompanies([...new Set((res.reviews || []).map(r => r.company_name))]);
        }
      } catch (err) {
        setReviews([]);
        setUniqueCompanies([]);
      }
    };
    fetchReviews();
  }, [activeTab, localStorage.getItem('user')]);

  // Fetch verified internships for review form
  useEffect(() => {
    const fetchVerifiedInternships = async () => {
      try {
        const res = await internshipAPI.getMyApplications();
        if (res.success) {
          if (res.applications && res.applications.length > 0) {
            res.applications.forEach(app => {
            });
          }
          const verified = (res.applications || []).filter(a => a.done_intern);
          setVerifiedInternships(verified);
        }
      } catch (err) {
        console.error('Error fetching verified internships:', err);
        setVerifiedInternships([]);
      }
    };
    fetchVerifiedInternships();
  }, []); // Add empty dependency array so it only runs once

  // Fetch reviews when tab changes to 'write'
  useEffect(() => {
    if (activeTab === 'write') {
      const fetchReviews = async () => {
        try {
          const res = await reviewsAPI.getCompanyReviews();
          if (res.success) {
            setReviews(res.reviews || []);
            setUniqueCompanies([...new Set((res.reviews || []).map(r => r.company_name))]);
          }
        } catch (err) {
          setReviews([]);
          setUniqueCompanies([]);
        }
      };
      fetchReviews();
    }
  }, [activeTab]);

  // Fetch reviews after login
  useEffect(() => {
    if (isAuthenticated) {
      const fetchReviews = async () => {
        try {
          const res = await reviewsAPI.getCompanyReviews();
          if (res.success) {
            setReviews(res.reviews || []);
            setUniqueCompanies([...new Set((res.reviews || []).map(r => r.company_name))]);
          }
        } catch (err) {
          setReviews([]);
          setUniqueCompanies([]);
        }
      };
      fetchReviews();
    }
  }, [isAuthenticated, user, activeTab]);

  const filteredReviews = reviews.filter(item => {
    const matchesSearch =
      (item.company_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.reviewer_name || '').toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter ? item.company_name === filter : true;
    return matchesSearch && matchesFilter;
  });

  // For review form: only allow companies/posts where done_intern === true
  const verifiedCompanies = [...new Set(verifiedInternships.map(i => i.company_name))];
  const acceptedPosts = reviewForm.company
    ? verifiedInternships.filter(i => i.company_name === reviewForm.company)
    : [];
  const isCompanyVerified = verifiedCompanies.includes(reviewForm.company);

  // Track reviewed posts for the selected company
  // Use user from AuthContext, prefer student name
  const userName =
    user?.student_profile?.name ||
    user?.student?.name ||
    user?.name ||
    user?.username ||
    user?.email ||
    '';

  const reviewedPosts = reviews
    .filter(r => r.company_name === reviewForm.company && r.reviewer_name === userName)
    .map(r => {
      // Debug: log each review object
      return r.job_title || r.internship_title || r.title;
    });

  // Track reviewed internship_ids for the selected company and user
  const reviewedInternshipIds = reviews
    .filter(r => r.company_name === reviewForm.company && r.reviewer_name === userName && r.internship_id)
    .map(r => r.internship_id);

  // Debug: log reviewed internship_ids for the selected company

  const handleFormChange = (e) => {
    if (e.target.name === 'post') {
      const alreadyReviewed = reviewedPosts.includes(e.target.value);
      if (alreadyReviewed) {
        setReviewForm(f => ({ ...f, post: '' }));
        return;
      }
    }
    setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
    if (e.target.name === 'company') {
      setReviewForm(f => ({ ...f, post: '' }));
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!recaptchaToken) {
      setFormMessage('Please complete the reCAPTCHA to submit your review.');
      return;
    }
    if (!reviewForm.company || !reviewForm.post) {
      setFormMessage('You must select a verified company and internship post.');
      return;
    }
    try {
      // Find the company_id and internship_id for the selected post from verifiedInternships
      const selectedIntern = acceptedPosts.find(i => (i.internship_title || i.title) === reviewForm.post);
      if (!selectedIntern) {
        setFormMessage('Invalid internship post selection.');
        return;
      }
      // Call API to create review, now sending internship_id
      const res = await reviewsAPI.createReview(selectedIntern.company_id || selectedIntern.companyId, {
        rating: reviewForm.rating,
        review_text: reviewForm.review,
        internship_id: selectedIntern.internship_id // <-- send internship_id
      });
      if (res.success) {
        setFormMessage('Review submitted!');
        setReviewForm({ company: '', post: '', review: '', rating: 5 });
        // Fetch updated reviews
        const reviewsRes = await reviewsAPI.getCompanyReviews();
        if (reviewsRes.success) {
          setReviews(reviewsRes.reviews || []);
          setUniqueCompanies([...new Set((reviewsRes.reviews || []).map(r => r.company_name))]);
        }
      } else {
        setFormMessage(res.message || 'Failed to submit review.');
      }
    } catch (err) {
      setFormMessage(err?.message || err?.response?.data?.message || 'Failed to submit review.');
    }
    setRecaptchaToken('');
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <h2 style={{ color: '#007bff', marginBottom: '20px' }}>Company Reviews</h2>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexDirection: isMobile ? 'column' : 'row' }}>
        <button
          onClick={() => setActiveTab('view')}
          style={{
            padding: '10px 24px',
            background: activeTab === 'view' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'view' ? 'white' : '#007bff',
            border: '1px solid #007bff',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            width: isMobile ? '100%' : 'auto'
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
            fontWeight: 'bold',
            width: isMobile ? '100%' : 'auto'
          }}
        >
          Write Review
        </button>
      </div>
      {activeTab === 'view' ? (
        <>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center' }}>
            <input
              type="text"
              placeholder="Search by company or student name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: isMobile ? 'none' : '1', width: isMobile ? '100%' : 'auto', minWidth: isMobile ? 'auto' : '220px', padding: '0px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              style={{ minWidth: isMobile ? '100%' : '180px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
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
                  <h4 style={{ color: '#007bff', marginBottom: '8px' }}>{item.company_name}</h4>
                  <p style={{ margin: '4px 0', color: '#6c757d' }}><strong>Job Title:</strong> {item.job_title}</p>
                  <p style={{ margin: '4px 0' }}><strong>Student:</strong> {item.reviewer_name}</p>
                  <p style={{ margin: '4px 0', color: '#6c757d' }}><strong>Education:</strong> {item.education}</p>
                  <div style={{ margin: '4px 0' }}>
                    <strong>Rating:</strong> {'★'.repeat(item.rating || 0)}{'☆'.repeat(5 - (item.rating || 0))}
                  </div>
                  <div style={{ marginTop: '14px', fontStyle: 'italic', color: '#343a40', background: '#e7f3ff', padding: '12px', borderRadius: '8px' }}>
                    "{item.review_text}"
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <form onSubmit={handleReviewSubmit} style={{ maxwidth: '100%', background: '#f8f9fa', padding: isMobile ? '16px' : '24px', borderRadius: '12px', border: '1px solid #e9ecef' }}>
          <h3 style={{ color: '#007bff', marginBottom: '16px' }}>Write a Review</h3>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontWeight: 'bold', color: '#343a40' }}>Company</label>
            <select
              name="company"
              value={reviewForm.company}
              onChange={handleFormChange}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', marginTop: '6px' }}
            >
              <option value="">Select Company</option>
              {verifiedCompanies.map(company => (
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
              {acceptedPosts.map((i, idx) => {
                const postTitle = i.internship_title || i.title;
                const alreadyReviewed = reviewedInternshipIds.includes(i.internship_id);
                // Debug: log each post and its reviewed status
                return (
                  <option key={idx} value={postTitle} disabled={alreadyReviewed}>
                    {postTitle}{alreadyReviewed ? ' (already reviewed)' : ''}
                  </option>
                );
              })}
            </select>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontWeight: 'bold', color: '#343a40' }}>Rating</label>
            <select
              name="rating"
              value={reviewForm.rating}
              onChange={e => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
              required
              style={{ width: isMobile ? '100%' : '100px', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', marginTop: '6px' }}
            >
              {[1,2,3,4,5].map(star => (
                <option key={star} value={star}>{star} Star{star > 1 ? 's' : ''}</option>
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
              style={{ width: '100%', padding: '0px', borderRadius: '6px', border: '1px solid #ddd', marginTop: '6px', minHeight: isMobile ? '120px' : '80px', background: !isCompanyVerified || acceptedPosts.length === 0 ? '#e9ecef' : 'white' }}
              placeholder="Write your review here..."
            />
          </div>
          {/* Google reCAPTCHA for review submission */}
          <div style={{ marginBottom: '12px' }}>
            <ReCAPTCHA
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={token => setRecaptchaToken(token)}
              size={isMobile ? "compact" : "normal"}
            />
          </div>
          <button
            type="submit"
            disabled={!isCompanyVerified || acceptedPosts.length === 0}
            style={{ background: '#007bff', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '6px', cursor: !isCompanyVerified || acceptedPosts.length === 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold', marginTop: '10px', width: isMobile ? '100%' : 'auto' }}
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