import React from 'react';

const SearchResultCard = ({ internship }) => {
  const handleApply = () => {
    // Handle apply logic here
    alert(`Applying to ${internship.title} at ${internship.company}`);
  };

  const handleSave = () => {
    // Handle save logic here
    alert(`Saved ${internship.title}`);
  };

  return (
    <div className="search-result-card">
      <div className="card-header">
        <div className="job-info">
          <h3 className="job-title">{internship.title}</h3>
          <p className="company-name">{internship.company}</p>
        </div>
        <div className="job-meta">
          <span className="job-type">{internship.type}</span>
          <span className="posted-date">{internship.posted}</span>
        </div>
      </div>

      <div className="card-body">
        <div className="location-duration">
          <span className="location">📍 {internship.location}</span>
          <span className="duration">⏰ {internship.duration}</span>
        </div>

        <p className="job-description">{internship.description}</p>

        <div className="requirements">
          <strong>Requirements:</strong>
          <div className="requirement-tags">
            {internship.requirements.map((req, index) => (
              <span key={index} className="requirement-tag">
                {req}
              </span>
            ))}
          </div>
        </div>

        <div className="salary">
          <strong>Salary: </strong>
          <span className="salary-amount">{internship.salary}</span>
        </div>
      </div>

      <div className="card-footer">
        <button className="save-btn" onClick={handleSave}>
          💾 Save
        </button>
        <button className="apply-btn" onClick={handleApply}>
          📝 Apply Now
        </button>
      </div>
    </div>
  );
};

export default SearchResultCard;