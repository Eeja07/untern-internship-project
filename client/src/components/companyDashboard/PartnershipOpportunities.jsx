import React from 'react';

const PartnershipOpportunities = () => {
    const partnershipTypes = [
        {
            title: 'University Partnerships',
            description: 'Connect directly with top universities to access their best students.',
            benefits: ['Direct access to student talent pool', 'Campus recruitment events', 'Collaborative projects'],
            icon: '🎓'
        },
        {
            title: 'Startup Ecosystem',
            description: 'Join our network of innovative startups and tech companies.',
            benefits: ['Cross-referral opportunities', 'Shared resources', 'Networking events'],
            icon: '🚀'
        },
        {
            title: 'Corporate Partners',
            description: 'Partner with established corporations for mutual growth.',
            benefits: ['Enterprise-level collaborations', 'Resource sharing', 'Joint initiatives'],
            icon: '🏢'
        }
    ];

    return (
        <div>
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Partnership Opportunities</h1>
                <p style={{ color: '#6c757d' }}>Explore collaboration opportunities to expand your reach and impact.</p>
            </div>

            {/* Partnership Types */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '30px',
                marginBottom: '40px'
            }}>
                {partnershipTypes.map((partnership, index) => (
                    <div key={index} style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '30px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        transition: 'transform 0.3s ease'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>{partnership.icon}</div>
                        <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>{partnership.title}</h3>
                        <p style={{ color: '#6c757d', marginBottom: '20px', lineHeight: '1.6' }}>{partnership.description}</p>
                        
                        <h4 style={{ color: '#007bff', marginBottom: '10px', fontSize: '1rem' }}>Benefits:</h4>
                        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '25px' }}>
                            {partnership.benefits.map((benefit, idx) => (
                                <li key={idx} style={{ 
                                    padding: '5px 0', 
                                    color: '#555',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <span style={{ color: '#28a745' }}>•</span>
                                    {benefit}
                                </li>
                            ))}
                        </ul>
                        
                        <button style={{
                            width: '100%',
                            padding: '12px 0',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '600'
                        }}>
                            Learn More
                        </button>
                    </div>
                ))}
            </div>

            {/* Contact Form */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '40px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Interested in Partnering?</h2>
                <p style={{ color: '#6c757d', marginBottom: '30px' }}>
                    Get in touch with our partnership team to explore collaboration opportunities.
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <input
                        type="text"
                        placeholder="Company Name"
                        style={{
                            padding: '12px 16px',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '1rem'
                        }}
                    />
                    <input
                        type="email"
                        placeholder="Email Address"
                        style={{
                            padding: '12px 16px',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '1rem'
                        }}
                    />
                </div>
                
                <textarea
                    placeholder="Tell us about your partnership ideas..."
                    rows={4}
                    style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e9ecef',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        marginBottom: '20px',
                        resize: 'vertical'
                    }}
                />
                
                <button style={{
                    padding: '12px 30px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600'
                }}>
                    Send Partnership Inquiry
                </button>
            </div>
        </div>
    );
};

export default PartnershipOpportunities;