import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './navbar.jsx';
import FooterHome from './footerHome.jsx';
import SearchResultCard from './searchResultCards.jsx';

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [originalResults, setOriginalResults] = useState([]); // Store original search results
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    location: 'all',
    duration: 'all'
  });

  // Modal states for footer navigation
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  // Handlers for footer modals
  const handleForStudentsClick = () => {
    setIsStudentModalOpen(true);
  };

  const handleForCompaniesClick = () => {
    setIsCompanyModalOpen(true);
  };

  // Get search query from URL and perform search only once
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query && query !== searchTerm) {
      setSearchTerm(query);
      performSearch(query);
      setHasSearched(true);
    } else if (!query) {
      // Reset when no query in URL
      setSearchTerm('');
      setSearchResults([]);
      setOriginalResults([]);
      setHasSearched(false);
      setFilters({
        type: 'all',
        location: 'all',
        duration: 'all'
      });
    }
  }, [location.search]);

  // Apply filters whenever filters or originalResults change
  useEffect(() => {
    if (hasSearched && originalResults.length > 0) {
      applyAllFilters();
    }
  }, [filters, originalResults, hasSearched]);

  // Mock data untuk demo - nanti bisa diganti dengan API call
  const mockInternships = [
    {
      id: 1,
      title: "Frontend Developer Intern",
      company: "TechStart Indonesia",
      location: "Jakarta",
      type: "Remote",
      duration: "3 months",
      description: "Join our team to build amazing web applications using React and modern technologies.",
      requirements: ["React", "JavaScript", "HTML/CSS"],
      salary: "Rp 2,000,000 - 3,000,000",
      posted: "2 days ago"
    },
    {
      id: 2,
      title: "Backend Developer Intern",
      company: "Startup Hub",
      location: "Bandung",
      type: "On-site",
      duration: "6 months",
      description: "Learn server-side development with Node.js and database management.",
      requirements: ["Node.js", "MongoDB", "Express"],
      salary: "Rp 2,500,000 - 3,500,000",
      posted: "1 week ago"
    },
    {
      id: 3,
      title: "Mobile App Developer Intern",
      company: "Digital Solutions",
      location: "Surabaya",
      type: "Hybrid",
      duration: "4 months",
      description: "Develop mobile applications for Android and iOS platforms.",
      requirements: ["React Native", "Flutter", "Mobile Development"],
      salary: "Rp 1,800,000 - 2,800,000",
      posted: "3 days ago"
    },
    {
      id: 4,
      title: "UI/UX Designer Intern",
      company: "Creative Agency",
      location: "Yogyakarta",
      type: "Remote",
      duration: "3 months",
      description: "Create beautiful and user-friendly designs for web and mobile applications.",
      requirements: ["Figma", "Adobe XD", "Prototyping"],
      salary: "Rp 1,500,000 - 2,500,000",
      posted: "5 days ago"
    },
    {
      id: 5,
      title: "Data Science Intern",
      company: "Analytics Pro",
      location: "Jakarta",
      type: "Full-time",
      duration: "6 months",
      description: "Work with big data and machine learning to derive business insights.",
      requirements: ["Python", "Machine Learning", "SQL"],
      salary: "Rp 3,000,000 - 4,000,000",
      posted: "1 day ago"
    }
  ];

  const performSearch = (query) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const filteredResults = mockInternships.filter(internship =>
        internship.title.toLowerCase().includes(query.toLowerCase()) ||
        internship.company.toLowerCase().includes(query.toLowerCase()) ||
        internship.description.toLowerCase().includes(query.toLowerCase()) ||
        internship.requirements.some(req => req.toLowerCase().includes(query.toLowerCase())) ||
        internship.type.toLowerCase().includes(query.toLowerCase())
      );
      
      setOriginalResults(filteredResults); // Store original results
      setSearchResults(filteredResults); // Set display results
      setIsLoading(false);
    }, 1000);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Reset filters when performing new search
      setFilters({
        type: 'all',
        location: 'all',
        duration: 'all'
      });
      performSearch(searchTerm);
      setHasSearched(true);
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    // Filters will be applied automatically via useEffect
  };

  const applyAllFilters = () => {
    let filtered = [...originalResults]; // Always filter from original results
    
    // Apply type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(item => item.type.toLowerCase() === filters.type.toLowerCase());
    }
    
    // Apply location filter
    if (filters.location !== 'all') {
      filtered = filtered.filter(item => item.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
    
    // Apply duration filter
    if (filters.duration !== 'all') {
      filtered = filtered.filter(item => item.duration.includes(filters.duration));
    }
    
    setSearchResults(filtered);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setOriginalResults([]);
    setHasSearched(false);
    setFilters({
      type: 'all',
      location: 'all',
      duration: 'all'
    });
    navigate('/search');
  };

  return (
    <>
      <Navbar />
      
      <div className="search-page">
        <div className="search-header">
          <div className="container">
            <div className="search-header-content">
              <h1>Search Results</h1>
              
              {/* Search Bar */}
              <form className="search-form-page" onSubmit={handleSearch}>
                <div className="search-input-container">
                  <input
                    type="text"
                    placeholder="Search for internships..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input-page"
                  />
                  <button type="submit" className="search-btn-page">
                    Search
                  </button>
                  <button
                    type="button"
                    className="clear-btn"
                    onClick={clearSearch}
                  >
                    Clear
                  </button>
                </div>
              </form>

              <div className="search-info">
                {searchTerm && hasSearched && !isLoading && (
                  <p>
                    Showing {searchResults.length} results for "<strong>{new URLSearchParams(location.search).get('q') || searchTerm}</strong>"
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="search-content">
          <div className="container">
            <div className="search-layout">
              
              {/* Filters Sidebar */}
              <div className="filters-sidebar">
                <h3>Filter Results</h3>
                
                <div className="filter-group">
                  <label>Job Type:</label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="remote">Remote</option>
                    <option value="on-site">On-site</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Location:</label>
                  <select
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                  >
                    <option value="all">All Locations</option>
                    <option value="jakarta">Jakarta</option>
                    <option value="bandung">Bandung</option>
                    <option value="surabaya">Surabaya</option>
                    <option value="yogyakarta">Yogyakarta</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Duration:</label>
                  <select
                    value={filters.duration}
                    onChange={(e) => handleFilterChange('duration', e.target.value)}
                  >
                    <option value="all">All Durations</option>
                    <option value="3">3 months</option>
                    <option value="4">4 months</option>
                    <option value="6">6 months</option>
                  </select>
                </div>
              </div>

              {/* Search Results */}
              <div className="search-results">
                {isLoading ? (
                  <div className="loading">
                    <p>Loading results...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="results-grid">
                    {searchResults.map(internship => (
                      <SearchResultCard
                        key={internship.id}
                        internship={internship}
                      />
                    ))}
                  </div>
                ) : hasSearched ? (
                  <div className="no-results">
                    <h3>No results found</h3>
                    <p>Try adjusting your search terms or filters.</p>
                    <button className="back-home-btn" onClick={clearSearch}>
                      Back to Home
                    </button>
                  </div>
                ) : (
                  <div className="no-search">
                    <h3>Start your search</h3>
                    <p>Enter keywords to find internships that match your interests.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <FooterHome onForStudentsClick={handleForStudentsClick} onForCompaniesClick={handleForCompaniesClick} />
    </>
  );
};

export default SearchPage;