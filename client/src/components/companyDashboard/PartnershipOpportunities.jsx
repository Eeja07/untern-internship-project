import React, { useState, useRef, useEffect } from 'react';

const PartnershipOpportunities = () => {
    const [modalType, setModalType] = useState(null);
    const [formData, setFormData] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const modalRef = useRef(null);

    useEffect(() => {
        if (!modalType) return;
        const handleEsc = (e) => {
            if (e.key === 'Escape') closeModal();
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [modalType]);

    // Click outside to close
    useEffect(() => {
        if (!modalType) return;
        const handleClick = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) closeModal();
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [modalType]);

    // Toast auto-hide
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3500);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const partnershipOptions = [
        {
            title: 'Universities',
            description: 'Access top student talent and build future workforce pipelines.',
            benefits: [
                'Direct access to student pool',
                'Campus hiring events',
                'Joint research & projects'
            ],
            icon: '🎓',
            button: {
                label: 'Partner with Universities',
                color: '#007bff',
                textColor: 'white',
                onClick: () => setModalType('university')
            }
        },
        {
            title: 'Companies & Startups',
            description: 'Collaborate with innovative businesses to create opportunities.',
            benefits: [
                'Shared internship resources',
                'Cross-referral partnerships',
                'Networking events & co-branding'
            ],
            icon: '🚀',
            button: {
                label: 'Join Startup & Corporate Network',
                color: '#007bff',
                textColor: 'white',
                onClick: () => setModalType('company')
            }
        },
        {
            title: 'Custom Partnerships',
            description: 'Have unique ideas? Let’s build something together.',
            benefits: [
                'Tailored collaboration models',
                'Joint initiatives',
                'Co-hosted programs'
            ],
            icon: '🤝',
            button: {
                label: 'Talk to Us',
                color: '#fd7e14',
                textColor: 'white',
                onClick: () => setModalType('custom')
            }
        }
    ];

    // Simplified form fields
    const simpleFields = [
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'interest', label: 'Interest / Message', type: 'textarea', placeholder: 'How would you like to partner?' }
    ];

    // Validation
    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required.';
        if (!formData.email) newErrors.email = 'Email is required.';
        else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Please enter a valid email.';
        if (!formData.interest) newErrors.interest = 'Please describe your interest.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: undefined });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
            setToast('Thanks! We’ll contact you soon.');
            closeModal();
        }, 1200);
    };

    const closeModal = () => {
        setModalType(null);
        setFormData({});
        setSubmitted(false);
        setErrors({});
        setLoading(false);
    };

    // Modal rendering
    const renderModal = () => {
        if (!modalType) return null;
        let title = '';
        if (modalType === 'university') title = 'Partner with Universities';
        else if (modalType === 'company') title = 'Join Startup & Corporate Network';
        else if (modalType === 'custom') title = 'Custom Partnership Inquiry';
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(44,62,80,0.18)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div ref={modalRef} style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '36px 32px',
                    minWidth: '320px',
                    maxWidth: '45vw',
                    width: '100%',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                    position: 'relative'
                }}>
                    <button onClick={closeModal} aria-label="Close" style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: '1.5rem', color: '#6c757d', cursor: 'pointer' }}>×</button>
                    <h2 style={{ color: '#2c3e50', marginBottom: '18px' }}>{title}</h2>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gap: '18px', marginBottom: '18px' }}>
                            {simpleFields.map(field => (
                                <div key={field.name}>
                                    <label style={{ fontWeight: '600', color: '#2c3e50', marginBottom: '6px', display: 'block' }}>{field.label}</label>
                                    {field.type === 'textarea' ? (
                                        <textarea
                                            name={field.name}
                                            value={formData[field.name] || ''}
                                            onChange={handleInputChange}
                                            rows={3}
                                            placeholder={field.placeholder || ''}
                                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: errors[field.name] ? '2px solid #dc3545' : '2px solid #e9ecef', fontSize: '1rem', resize: 'vertical' }}
                                        />
                                    ) : (
                                        <input
                                            type={field.type}
                                            name={field.name}
                                            value={formData[field.name] || ''}
                                            onChange={handleInputChange}
                                            placeholder={field.placeholder || ''}
                                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: errors[field.name] ? '2px solid #dc3545' : '2px solid #e9ecef', fontSize: '1rem' }}
                                            required
                                        />
                                    )}
                                    {errors[field.name] && <div style={{ color: '#dc3545', fontSize: '0.98rem', marginTop: '4px' }}>{errors[field.name]}</div>}
                                </div>
                            ))}
                        </div>
                        <button type="submit" style={{
                            padding: '12px 30px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '600',
                            marginTop: '10px',
                            position: 'relative'
                        }}>
                            {loading ? <span style={{ display: 'inline-block', verticalAlign: 'middle' }}><span className="spinner" style={{ width: 18, height: 18, border: '2px solid #fff', borderTop: '2px solid #007bff', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }}></span> Submitting...</span> : 'Submit'}
                        </button>
                    </form>
                    <style>{`
                        @keyframes spin { to { transform: rotate(360deg); } }
                    `}</style>
                </div>
            </div>
        );
    };

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div>
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Partnership Opportunities</h1>
                <p style={{ color: '#6c757d', fontSize: '1.15rem' }}>Work with us to expand talent reach and create meaningful collaborations.</p>
            </div>
            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '30px',
                marginBottom: '40px'
            }}>
                {partnershipOptions.map((option, index) => (
                    <div key={index} style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '30px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        transition: 'transform 0.3s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: '340px'
                    }}>
                        <div>
                            <div style={{ fontSize: '3rem', marginBottom: '18px' }}>{option.icon}</div>
                            <h3 style={{ color: '#2c3e50', marginBottom: '12px' }}>{option.title}</h3>
                            <p style={{ color: '#6c757d', marginBottom: '18px', lineHeight: '1.6' }}>{option.description}</p>
                            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '18px' }}>
                                {option.benefits.map((benefit, idx) => (
                                    <li key={idx} style={{
                                        padding: '5px 0',
                                        color: '#555',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontSize: '1rem'
                                    }}>
                                        <span style={{ color: '#28a745', fontSize: '1.2rem' }}>✅</span>
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button style={{
                            width: '100%',
                            padding: '12px 0',
                            backgroundColor: option.button.color,
                            color: option.button.textColor,
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '600',
                            marginTop: '10px',
                            boxShadow: option.button.color === '#fd7e14' ? '0 2px 10px rgba(253,126,20,0.10)' : '0 2px 10px rgba(0,123,255,0.10)'
                        }}
                        onClick={option.button.onClick}
                        >
                            {option.button.label}
                        </button>
                    </div>
                ))}
            </div>
            {renderModal()}
            {toast && (
                <div style={{
                    position: 'fixed',
                    bottom: '32px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#28a745',
                    color: 'white',
                    padding: '16px 32px',
                    borderRadius: '8px',
                    fontSize: '1.08rem',
                    fontWeight: '600',
                    boxShadow: '0 2px 10px rgba(40,167,69,0.10)',
                    zIndex: 99999
                }}>
                    {toast}
                </div>
            )}
            {/* FAQ Section */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '30px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                marginTop: '40px',
                maxWidth: '100%',
                marginLeft: 'auto',
                marginRight: 'auto'
            }}>
                <h2 style={{ color: '#2c3e50', marginBottom: '20px', fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                     Frequently Asked Questions
                </h2>
                <div style={{ display: 'grid', gap: '20px' }}>
                    <div>
                        <h4 style={{ color: '#007bff', marginBottom: '8px' }}>Who can become a partner?</h4>
                        <p style={{ color: '#6c757d', margin: 0 }}>We welcome universities, companies (startups, SMEs, corporates), and organizations that want to collaborate on internships, research projects, or talent development programs.</p>
                    </div>
                    <div>
                        <h4 style={{ color: '#007bff', marginBottom: '8px' }}>What are the benefits of partnering with you?</h4>
                        <ul style={{ color: '#6c757d', margin: 0, paddingLeft: '18px' }}>
                            <li><strong>Universities</strong> → direct placement opportunities, student exposure to real-world work, career support.</li>
                            <li><strong>Companies</strong> → access to pre-screened student talent, co-branding opportunities, faster hiring.</li>
                            <li><strong>Custom partners</strong> → tailored collaboration models like co-hosted events, CSR initiatives, or joint programs.</li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ color: '#007bff', marginBottom: '8px' }}>Does it cost money to become a partner?</h4>
                        <p style={{ color: '#6c757d', margin: 0 }}>Basic partnership is free (you can post opportunities and access talent).<br />However, we also offer premium partnership plans with added benefits such as branding, analytics, and priority support.</p>
                    </div>
                    <div>
                        <h4 style={{ color: '#007bff', marginBottom: '8px' }}>How long does the partnership process take?</h4>
                        <ul style={{ color: '#6c757d', margin: 0, paddingLeft: '18px' }}>
                            <li><strong>Universities</strong> → typically 1–2 weeks for onboarding.</li>
                            <li><strong>Companies</strong> → as soon as your profile is approved, you can start posting internships immediately.</li>
                            <li><strong>Custom partnerships</strong> → depends on the scope, usually 2–4 weeks of planning.</li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ color: '#007bff', marginBottom: '8px' }}>What kind of support do partners receive?</h4>
                        <p style={{ color: '#6c757d', margin: 0 }}>Each partner has access to our partnership support team. Professional/Enterprise partners also receive a dedicated account manager for ongoing collaboration.</p>
                    </div>
                    <div>
                        <h4 style={{ color: '#007bff', marginBottom: '8px' }}>Can we customize the partnership terms?</h4>
                        <p style={{ color: '#6c757d', margin: 0 }}>Yes ✅. Especially for custom partnerships, we tailor collaborations to your goals—whether it’s research, events, CSR, or co-hosted programs.</p>
                    </div>
                    <div>
                        <h4 style={{ color: '#007bff', marginBottom: '8px' }}>How do we measure the impact of our partnership?</h4>
                        <ul style={{ color: '#6c757d', margin: 0, paddingLeft: '18px' }}>
                            <li>Number of student applications</li>
                            <li>Internship fill rates</li>
                            <li>Engagement metrics</li>
                            <li>Success stories (hires, projects completed)</li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ color: '#007bff', marginBottom: '8px' }}>What happens after we submit the partnership form?</h4>
                        <p style={{ color: '#6c757d', margin: 0 }}>You’ll receive a confirmation email.<br />Our partnership team will contact you within 3 business days.<br />For custom requests, we may schedule a discovery call to align expectations.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnershipOpportunities;