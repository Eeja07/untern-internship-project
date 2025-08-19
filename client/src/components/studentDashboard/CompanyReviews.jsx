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

const uniqueCompanies = [...new Set(studentReviews.map(r => r.company.name))];

const CompanyReviews = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  const filteredReviews = studentReviews.filter(item => {
    const matchesSearch =
      item.company.name.toLowerCase().includes(search.toLowerCase()) ||
      item.student.fullName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter ? item.company.name === filter : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <h2 style={{ color: '#007bff', marginBottom: '20px' }}>Student Experiences in Companies</h2>
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
    </div>
  );
};

export default CompanyReviews;