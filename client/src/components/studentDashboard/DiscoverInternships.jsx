import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

const DiscoverInternships = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [internships, setInternships] = useState([]);
  const [featuredInternships, setFeaturedInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    industry: '',
    company_size: ''
  });
  const [filterOptions, setFilterOptions] = useState({
    locations: [],
    types: [],
    industries: [],
    company_sizes: []
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    limit: 9
  });
  const [showCaptchaModal, setShowCaptchaModal] = useState(false);
  const [captchaInternshipId, setCaptchaInternshipId] = useState(null);
  const [captchaToken, setCaptchaToken] = useState('');
  const [showInternshipModal, setShowInternshipModal] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);

  useEffect(() => {
    // Get the search query from URL parameters
    const queryParam = searchParams.get('q');
    if (queryParam) {
      setSearchTerm(queryParam);
    }
    fetchFilterOptions();
    fetchInternships();
    fetchFeaturedInternships();
  }, [searchParams]);

  useEffect(() => {
    fetchInternships();
  }, [searchTerm, filters, pagination.current_page]);

  useEffect(() => {
    fetchInternships();
  }, [searchTerm, filters, pagination.current_page]);

  const fetchFeaturedInternships = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/featured-internships');
      const data = await response.json();

      if (data.success) {
        setFeaturedInternships(data.internships);
      }
    } catch (error) {
      console.error('Error fetching featured internships:', error);
    }
  };

  const fetchInternships = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: pagination.current_page,
        limit: pagination.limit
      });

      // Add search term if exists
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
        // Also search by requirements
        params.append('requirements', searchTerm.trim());
      }

      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value.trim()) {
          params.append(key, value);
        }
      });

      const response = await fetch(`http://localhost:4000/api/internships?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setInternships(data.internships);
        setPagination(data.pagination);
      } else {
        setError(data.message || 'Failed to fetch internships');
      }
    } catch (error) {
      console.error('Error fetching internships:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/internships-filters');
      const data = await response.json();

      if (data.success) {
        setFilterOptions(data.filters);
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    // Reset to first page when filter changes
    setPagination(prev => ({
      ...prev,
      current_page: 1
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Reset to first page when search changes
    setPagination(prev => ({
      ...prev,
      current_page: 1
    }));
  };

  const handleApplyInternship = (internshipId) => {
    setCaptchaInternshipId(internshipId);
    setShowCaptchaModal(true);
  };

  const handleCaptchaChange = async (token) => {
    setCaptchaToken(token);
    if (!token) return;
    setShowCaptchaModal(false);
    try {
      const applyId = captchaInternshipId;
      setCaptchaInternshipId(null);
      const apiToken = localStorage.getItem('token');
      if (!apiToken) {
        alert('Please log in to apply for internships');
        return;
      }
      // Optionally, send captcha token to backend for verification
      const response = await fetch(`http://localhost:4000/api/internships/${applyId}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ captcha: token }) // send captcha token if backend supports
      });
      const data = await response.json();
      if (data.success) {
        alert('Application submitted successfully!');
        fetchFeaturedInternships();
      } else {
        alert(data.message || 'Failed to apply for internship');
      }
    } catch (error) {
      console.error('Error applying for internship:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleCardClick = (internship) => {
    setSelectedInternship(internship);
    setShowInternshipModal(true);
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary not specified';
    if (min && max) return `Rp ${min?.toLocaleString()} - Rp ${max?.toLocaleString()}`;
    if (min) return `From Rp ${min?.toLocaleString()}`;
    if (max) return `Up to Rp ${max?.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      current_page: newPage
    }));
  };

  return (
    <div>
      <h2 style={{ color: '#007bff', marginBottom: '20px' }}>Discover Internships</h2>
      
      {/* Featured Internships Section */}
      <div style={{
        background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
        padding: '30px',
        borderRadius: '12px',
        marginBottom: '30px',
        color: 'white'
      }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '1.5rem' }}>Featured Internships</h3>
        <p style={{ margin: '0 0 20px 0', opacity: 0.9 }}>
          Most popular internship opportunities based on application count. Browse through {pagination.total_count} available positions.
        </p>
        
        {/* Featured Internships Grid */}
        {featuredInternships.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            marginBottom: '20px'
          }}>
            {featuredInternships.map(internship => (
              <div 
                key={internship.internship_id}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  padding: '20px',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  transition: 'transform 0.2s ease',
                  cursor: 'pointer'
                }}
                onClick={() => handleCardClick(internship)}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {/* Company Logo and Info */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  {internship.logo_url ? (
                    <img 
                      src={`http://localhost:4000${internship.logo_url}`}
                      alt={`${internship.company_name} logo`}
                      style={{
                        width: '35px',
                        height: '35px',
                        borderRadius: '6px',
                        marginRight: '10px',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '35px',
                      height: '35px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(255,255,255,0.3)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '10px',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      {internship.company_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h4 style={{ margin: 0, color: 'white', fontSize: '1rem' }}>{internship.company_name}</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>{internship.industry}</p>
                  </div>
                  {/* Application Count Badge */}
                  <div style={{
                    marginLeft: 'auto',
                    background: 'rgba(255,255,255,0.2)',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold'
                  }}>
                    {internship.application_count} applies
                  </div>
                </div>

                {/* Internship Title */}
                <h4 style={{ color: 'white', marginBottom: '8px', fontSize: '1.1rem' }}>{internship.title}</h4>

                {/* Key Details */}
                <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '12px' }}>
                  <div style={{ marginBottom: '4px' }}>📍 {internship.location || 'Location not specified'}</div>
                  <div style={{ marginBottom: '4px' }}>💼 {internship.type || 'Type not specified'}</div>
                  <div style={{ marginBottom: '4px' }}>💰 {formatSalary(internship.salary_min, internship.salary_max)}</div>
                </div>

                {/* Apply Button */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleApplyInternship(internship.internship_id); }}
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.3)';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px', opacity: 0.8 }}>
            <p>No featured internships available at the moment.</p>
          </div>
        )}

        {/* Stats Row */}
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '10px 15px',
            borderRadius: '8px',
            backdropFilter: 'blur(10px)'
          }}>
            <strong>{pagination.total_count}</strong> Total Opportunities
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '10px 15px',
            borderRadius: '8px',
            backdropFilter: 'blur(10px)'
          }}>
            <strong>{filterOptions.industries.length}</strong> Industries
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '10px 15px',
            borderRadius: '8px',
            backdropFilter: 'blur(10px)'
          }}>
            <strong>{filterOptions.locations.length}</strong> Locations
          </div>
        </div>
      </div>

      {/* Search, Filters, and Summary in One Container (Summary below search/filters) */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        border: '1px solid #e9ecef',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '30px',
        maxWidth: '100%',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>Search & Filters</h3>
        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', width: '100%', margin: '0 auto' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
              Search Internships
            </label>
            <input 
              type="text" 
              placeholder="Search by title, company, description, or requirements..." 
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                width: '95%',
                padding: '12px 16px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            />
          </div>
          <button
            onClick={() => {
              setFilters({
                location: '',
                type: '',
                industry: '',
                company_size: ''
              });
              setSearchTerm('');
            }}
            style={{
              marginLeft: '16px',
              marginTop: '35px',
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              height: '44px'
            }}
          >
            Clear Filters
          </button>
        </div>
        {/* Filter Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#2c3e50' 
            }}>
              Industry
            </label>
            <select 
              value={filters.industry}
              onChange={(e) => handleFilterChange('industry', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            >
              <option value="">All Industries</option>
              {filterOptions.industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#2c3e50' 
            }}>
              Type
            </label>
            <select 
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            >
              <option value="">All Types</option>
              {filterOptions.types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#2c3e50' 
            }}>
              Location
            </label>
            <select 
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            >
              <option value="">All Locations</option>
              {filterOptions.locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#2c3e50' 
            }}>
              Company Size
            </label>
            <select 
              value={filters.company_size}
              onChange={(e) => handleFilterChange('company_size', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            >
              <option value="">All Company Sizes</option>
              {filterOptions.company_sizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>      

        {/* Search Summary Below */}
        <div style={{ height: 'fit-content', marginTop: '10px' }}>
          <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>Search Summary</h3>
          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: '600', color: '#2c3e50' }}>Results Found:</span>
              <span style={{ color: '#007bff', fontWeight: 'bold' }}>{pagination.total_count}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: '600', color: '#2c3e50' }}>Current Page:</span>
              <span style={{ color: '#6c757d' }}>{pagination.current_page} of {pagination.total_pages}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: '600', color: '#2c3e50' }}>Per Page:</span>
              <span style={{ color: '#6c757d' }}>{pagination.limit}</span>
            </div>
          </div>
          {/* Active Filters */}
          {(searchTerm || Object.values(filters).some(filter => filter)) && (
            <div style={{ marginTop: '20px' }}>
              <h4 style={{ marginBottom: '10px', color: '#2c3e50', fontSize: '1rem' }}>Active Filters:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {searchTerm && (
                  <div style={{
                    padding: '5px 10px',
                    backgroundColor: '#e3f2fd',
                    borderRadius: '15px',
                    fontSize: '0.8rem',
                    color: '#1976d2'
                  }}>
                    Search: "{searchTerm}"
                  </div>
                )}
                {Object.entries(filters).map(([key, value]) => 
                  value && (
                    <div key={key} style={{
                      padding: '5px 10px',
                      backgroundColor: '#f3e5f5',
                      borderRadius: '15px',
                      fontSize: '0.8rem',
                      color: '#7b1fa2'
                    }}>
                      {key.replace('_', ' ')}: {value}
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {loading && (
            <div style={{ 
              textAlign: 'center', 
              padding: '20px',
              color: '#6c757d'
            }}>
              <div style={{
                width: '30px',
                height: '30px',
                border: '3px solid #e9ecef',
                borderTop: '3px solid #007bff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 10px'
              }}></div>
              Searching...
            </div>
          )}
        </div>
      </div>

      {/* Search Results Section */}
      <div style={{
        background: 'white',
        padding: '25px',
        borderRadius: '12px',
        border: '1px solid #e9ecef',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '25px', color: '#2c3e50' }}>
          Search Results 
          {pagination.total_count > 0 && (
            <span style={{ color: '#6c757d', fontWeight: 'normal', fontSize: '1rem' }}>
              ({pagination.total_count} internship{pagination.total_count !== 1 ? 's' : ''} found)
            </span>
          )}
        </h3>

        {/* Error State */}
        {error && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '8px',
            color: '#721c24',
            marginBottom: '20px'
          }}>
            <p>{error}</p>
            <button 
              onClick={fetchInternships}
              style={{
                marginTop: '10px',
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading or Results */}
        {!error && (
          <>
            {internships.length === 0 && !loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
                <h4 style={{ color: '#6c757d', marginBottom: '10px' }}>No internships found</h4>
                <p style={{ color: '#6c757d' }}>Try adjusting your search criteria or filters</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px',
                marginBottom: '30px'
              }}>
                {internships.map(internship => (
                  <div 
                    key={internship.internship_id}
                    style={{
                      background: 'white',
                      padding: '20px',
                      borderRadius: '12px',
                      border: '1px solid #e9ecef',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleCardClick(internship)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                  >
                    {/* Company Logo and Info */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                      {internship.logo_url ? (
                        <img 
                          src={`http://localhost:4000${internship.logo_url}`}
                          alt={`${internship.company_name} logo`}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            marginRight: '12px',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '12px',
                          fontSize: '16px',
                          fontWeight: 'bold'
                        }}>
                          {internship.company_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4 style={{ margin: 0, color: '#2c3e50' }}>{internship.company_name}</h4>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#6c757d' }}>{internship.industry}</p>
                      </div>
                    </div>

                    {/* Internship Title */}
                    <h3 style={{ color: '#007bff', marginBottom: '10px' }}>{internship.title}</h3>

                    {/* Details */}
                    <div style={{ marginBottom: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: '600', color: '#2c3e50' }}>Location:</span>
                        <span style={{ color: '#6c757d' }}>{internship.location}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: '600', color: '#2c3e50' }}>Type:</span>
                        <span style={{ color: '#6c757d' }}>{internship.type}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: '600', color: '#2c3e50' }}>Duration:</span>
                        <span style={{ color: '#6c757d' }}>{internship.duration_months} months</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: '600', color: '#2c3e50' }}>Salary:</span>
                        <span style={{ color: '#6c757d' }}>{formatSalary(internship.salary_min, internship.salary_max)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: '600', color: '#2c3e50' }}>Deadline:</span>
                        <span style={{ color: internship.application_deadline ? '#dc3545' : '#6c757d' }}>
                          {formatDate(internship.application_deadline)}
                        </span>
                      </div>
                    </div>

                    {/* Apply Button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleApplyInternship(internship.internship_id); }}
                      style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '600',
                        transition: 'background-color 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
                    >
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                marginTop: '30px'
              }}>
                <button
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: pagination.current_page === 1 ? '#e9ecef' : '#007bff',
                    color: pagination.current_page === 1 ? '#6c757d' : 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: pagination.current_page === 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  Previous
                </button>

                <span style={{ margin: '0 20px', color: '#6c757d' }}>
                  Page {pagination.current_page} of {pagination.total_pages}
                </span>

                <button
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.total_pages}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: pagination.current_page === pagination.total_pages ? '#e9ecef' : '#007bff',
                    color: pagination.current_page === pagination.total_pages ? '#6c757d' : 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: pagination.current_page === pagination.total_pages ? 'not-allowed' : 'pointer'
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* CAPTCHA Modal */}
      {showCaptchaModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
            minWidth: '320px',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '20px' }}>Confirm Application</h3>
            <p style={{ marginBottom: '20px' }}>Please complete the CAPTCHA to confirm your application.</p>
            <ReCAPTCHA
              sitekey="6Lf2E6krAAAAAAzXkluXdOa1A7XVSOMV0cdUyDZM"
              onChange={handleCaptchaChange}
            />
            <button
              onClick={() => setShowCaptchaModal(false)}
              style={{ marginTop: '20px', padding: '8px 16px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Internship Detail Modal */}
      {showInternshipModal && selectedInternship && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
            minWidth: '400px',
            maxWidth: '600px',
            textAlign: 'left',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowInternshipModal(false)}
              style={{ position: 'absolute', top: 10, right: 10, background: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' }}
            >
              Close
            </button>
            <h2 style={{ color: '#007bff', marginBottom: '10px' }}>{selectedInternship.title}</h2>
            <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>{selectedInternship.company_name}</h4>
            <div style={{ marginBottom: '10px', color: '#6c757d' }}>
              <strong>Industry:</strong> {selectedInternship.industry || selectedInternship.company_industry}<br/>
              <strong>Location:</strong> {selectedInternship.location}<br/>
              <strong>Type:</strong> {selectedInternship.type}<br/>
              <strong>Duration:</strong> {selectedInternship.duration_months} months<br/>
              <strong>Salary:</strong> {formatSalary(selectedInternship.salary_min, selectedInternship.salary_max)}<br/>
              <strong>Deadline:</strong> {formatDate(selectedInternship.application_deadline)}<br/>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Description:</strong>
              <p style={{ color: '#2c3e50', whiteSpace: 'pre-line' }}>{selectedInternship.description}</p>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Requirements:</strong>
              <p style={{ color: '#2c3e50', whiteSpace: 'pre-line' }}>{selectedInternship.requirements}</p>
            </div>
            <button
              onClick={() => { setShowInternshipModal(false); handleApplyInternship(selectedInternship.internship_id); }}
              style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: '600', marginTop: '10px' }}
            >
              Apply Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscoverInternships;