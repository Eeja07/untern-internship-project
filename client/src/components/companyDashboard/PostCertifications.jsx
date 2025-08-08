import React, { useState } from 'react';

const PostCertifications = () => {
    const [certData, setCertData] = useState({
        title: '',
        description: '',
        duration: '',
        requirements: '',
        benefits: '',
        cost: ''
    });

    const handleInputChange = (e) => {
        setCertData({
            ...certData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Certification posted:', certData);
        alert('Certification program posted successfully!');
    };

    return (
        <div>
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Post Internship Certifications</h1>
                <p style={{ color: '#6c757d' }}>Create certification programs to validate intern skills and achievements.</p>
            </div>

            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '40px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gap: '25px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                Certification Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={certData.title}
                                onChange={handleInputChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #e9ecef',
                                    borderRadius: '8px',
                                    fontSize: '1rem'
                                }}
                                placeholder="e.g., Frontend Development Certificate"
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={certData.description}
                                onChange={handleInputChange}
                                required
                                rows={4}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #e9ecef',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    resize: 'vertical'
                                }}
                                placeholder="Describe what this certification covers and validates..."
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                    Duration
                                </label>
                                <input
                                    type="text"
                                    name="duration"
                                    value={certData.duration}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '8px',
                                        fontSize: '1rem'
                                    }}
                                    placeholder="e.g., 3 months"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                    Cost
                                </label>
                                <input
                                    type="text"
                                    name="cost"
                                    value={certData.cost}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '8px',
                                        fontSize: '1rem'
                                    }}
                                    placeholder="e.g., Free or Rp 500,000"
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                Requirements
                            </label>
                            <textarea
                                name="requirements"
                                value={certData.requirements}
                                onChange={handleInputChange}
                                rows={3}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #e9ecef',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    resize: 'vertical'
                                }}
                                placeholder="List prerequisites or requirements for this certification..."
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                Benefits
                            </label>
                            <textarea
                                name="benefits"
                                value={certData.benefits}
                                onChange={handleInputChange}
                                rows={3}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #e9ecef',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    resize: 'vertical'
                                }}
                                placeholder="What will participants gain from this certification?"
                            />
                        </div>

                        <button
                            type="submit"
                            style={{
                                padding: '15px 30px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                transition: 'background-color 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
                        >
                            Post Certification
                        </button>
                    </div>
                </form>
            </div>

            {/* Existing Certifications */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '30px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                marginTop: '30px'
            }}>
                <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Your Certification Programs</h2>
                <div style={{ display: 'grid', gap: '20px' }}>
                    {[
                        {
                            title: 'Frontend Development Certificate',
                            participants: 45,
                            status: 'Active',
                            completion: '78%'
                        },
                        {
                            title: 'Digital Marketing Fundamentals',
                            participants: 32,
                            status: 'Active',
                            completion: '65%'
                        }
                    ].map((cert, index) => (
                        <div key={index} style={{
                            padding: '20px',
                            border: '1px solid #e9ecef',
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <h4 style={{ color: '#2c3e50', margin: '0 0 5px 0' }}>{cert.title}</h4>
                                <p style={{ color: '#6c757d', margin: 0, fontSize: '0.9rem' }}>
                                    {cert.participants} participants • {cert.completion} completion rate
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <span style={{
                                    padding: '4px 12px',
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem'
                                }}>
                                    {cert.status}
                                </span>
                                <button style={{
                                    padding: '6px 12px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem'
                                }}>
                                    Manage
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PostCertifications;