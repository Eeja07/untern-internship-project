import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PricingInformation = () => {
    const pricingPlans = [
        {
            name: 'Basic',
            price: 'Free',
            duration: 'Forever',
            features: [
                'Post up to 3 internships',
                'Basic candidate search',
                'Email support',
                'Application notifications'
            ],
            recommended: false,
            type: 'basic',
            description: 'For small teams just getting started.'
        },
        {
            name: 'Growth',
            price: 'Rp 750,000',
            duration: 'per month',
            features: [
                'Everything in Basic',
                'Up to 15 active postings',
                'Candidate recommendations',
                'Featured job visibility',
                'Priority support'
            ],
            recommended: false,
            type: 'payable',
            description: 'Best for growing startups.'
        },
        {
            name: 'Professional',
            price: 'Rp 1,250,000',
            duration: 'per month',
            features: [
                'Unlimited internship postings',
                'Advanced candidate search & filters',
                'Full analytics dashboard',
                'Employer branding profile',
                'Dedicated support manager'
            ],
            recommended: true,
            type: 'payable',
            description: 'For scaling companies.'
        },
        {
            name: 'Enterprise',
            price: 'Custom Pricing',
            duration: '',
            features: [
                'Everything in Professional',
                'API & bulk posting',
                'Custom branding',
                'Advanced analytics & reports',
                'Custom integrations & onboarding'
            ],
            recommended: false,
            type: 'contact',
            description: 'For large organizations.'
        }
    ];

    const [loading, setLoading] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleUpgrade = async (plan) => { 
        setLoading(true);
        setPaymentInfo(null);
        setErrorMsg('');
        try {
            const res = await axios.post('/api/pay/midtrans', {
                amount: plan.name === 'Growth' ? 750000 : plan.name === 'Professional' ? 1250000 : 0,
                orderId: `order-${Date.now()}`,
                name: 'Company Name', // Replace with actual company 
                email: 'company@espospmail.com', // Replace with actual company email
                phone: '081234567890', // Replace with actual company phone
            });
            setPaymentInfo(res.data);
            if (res.data.redirect_url) {
                window.open(res.data.redirect_url, '_blank');
            }
        } catch (err) {
            setErrorMsg(err.response?.data?.error || 'Payment initiation failed');
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: isMobile ? '10px' : '0' }}>
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ color: '#2c3e50', marginBottom: '10px', fontSize: isMobile ? '1.8rem' : '2.5rem' }}>Flexible Pricing for Every Company</h1>
                <p style={{ color: '#6c757d', fontSize: isMobile ? '1rem' : '1.15rem' }}>Choose a plan that scales with your hiring needs.</p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: isMobile ? '20px' : '40px',
                marginBottom: '50px',
                alignItems: 'stretch'
            }}>
                {pricingPlans.map((plan, index) => (
                    <div key={index} style={{
                        background: 'linear-gradient(135deg, #f8fafc 60%, #e9ecef 100%)',
                        borderRadius: '20px',
                        padding: isMobile ? '24px 16px' : '48px 36px',
                        boxShadow: plan.recommended ? '0 12px 40px rgba(0,123,255,0.18)' : '0 6px 24px rgba(0,0,0,0.08)',
                        border: plan.recommended ? '2.5px solid #007bff' : '2px solid #e9ecef',
                        position: 'relative',
                        textAlign: 'center',
                        minHeight: isMobile ? 'auto' : '520px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}>
                        {plan.recommended && (
                            <div style={{
                                position: 'absolute',
                                top: '-16px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                backgroundColor: '#007bff',
                                color: 'white',
                                padding: isMobile ? '5px 16px' : '7px 28px',
                                borderRadius: '18px',
                                fontSize: isMobile ? '0.8rem' : '1.5rem',
                                fontWeight: '700',
                                letterSpacing: '0.5px',
                                boxShadow: '0 2px 8px rgba(0,123,255,0.12)'
                            }}>
                                RECOMMENDED
                            </div>
                        )}
                        <h3 style={{ color: '#2c3e50', marginBottom: '8px', fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 700 }}>{plan.name}</h3>
                        <div style={{ color: '#6c757d', marginBottom: '18px', fontSize: isMobile ? '0.9rem' : '1.08rem' }}>{plan.description}</div>
                        <div style={{ marginBottom: '28px' }}>
                            <span style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 'bold', color: plan.type === 'contact' ? '#fd7e14' : '#007bff' }}>{plan.price}</span>
                            {plan.price !== 'Free' && plan.type !== 'contact' && (
                                <span style={{ color: '#6c757d', fontSize: isMobile ? '0.9rem' : '1.1rem' }}> / {plan.duration}</span>
                            )}
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px', textAlign: 'left' }}>
                            {plan.features.map((feature, idx) => (
                                <li key={idx} style={{
                                    padding: isMobile ? '8px 0' : '10px 0',
                                    color: '#444',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    fontSize: isMobile ? '0.95rem' : '1.08rem'
                                }}>
                                    <span style={{ color: '#28a745', fontSize: isMobile ? '1rem' : '1.2rem' }}>✓</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        {plan.type === 'payable' && (
                            <button
                                style={{
                                    width: '100%',
                                    padding: '14px 0',
                                    backgroundColor: plan.recommended ? '#007bff' : 'white',
                                    color: plan.recommended ? 'white' : '#007bff',
                                    border: '2.5px solid #007bff',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    fontSize: '1.08rem',
                                    fontWeight: '700',
                                    marginTop: '10px',
                                    boxShadow: plan.recommended ? '0 2px 12px rgba(0,123,255,0.10)' : 'none',
                                    transition: 'all 0.3s ease'
                                }}
                                disabled={loading}
                                onClick={() => handleUpgrade(plan)}
                            >
                                {loading ? 'Processing...' : 'Upgrade Now'}
                            </button>
                        )}
                        {plan.type === 'basic' && (
                            <button
                                style={{
                                    width: '100%',
                                    padding: '14px 0',
                                    backgroundColor: 'white',
                                    color: '#007bff',
                                    border: '2.5px solid #007bff',
                                    borderRadius: '10px',
                                    cursor: 'not-allowed',
                                    fontSize: '1.08rem',
                                    fontWeight: '700',
                                    marginTop: '10px',
                                    transition: 'all 0.3s ease'
                                }}
                                disabled
                            >
                                Current Plan
                            </button>
                        )}
                        {plan.type === 'contact' && (
                            <a
                                href="mailto:sales@untern.com?subject=Enterprise%20Plan%20Inquiry"
                                style={{
                                    width: '100%',
                                    display: 'inline-block',
                                    padding: '14px 0',
                                    backgroundColor: '#fd7e14',
                                    color: 'white',
                                    border: '2.5px solid #fd7e14',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    fontSize: '1.08rem',
                                    fontWeight: '700',
                                    marginTop: '10px',
                                    textDecoration: 'none',
                                    boxShadow: '0 2px 12px rgba(253,126,20,0.10)',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Contact Sales
                            </a>
                        )}
                    </div>
                ))}
            </div>

            {/* FAQ Section Expanded */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: isMobile ? '20px' : '30px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ color: '#2c3e50', marginBottom: '20px', fontSize: isMobile ? '1.5rem' : '1.75rem' }}>Frequently Asked Questions</h2>
                <div style={{ display: 'grid', gap: isMobile ? '16px' : '20px' }}>
                    <div>
                        <h4 style={{ color: '#007bff', marginBottom: '8px', fontSize: isMobile ? '1rem' : '1.1rem' }}>Can I change my plan anytime?</h4>
                        <p style={{ color: '#6c757d', margin: 0, fontSize: isMobile ? '0.9rem' : '1rem' }}>Yes, upgrades/downgrades apply next billing cycle.</p>
                    </div>
                    <div>
                        <h4 style={{ color: '#007bff', marginBottom: '8px', fontSize: isMobile ? '1rem' : '1.1rem' }}>Do you offer trials?</h4>
                        <p style={{ color: '#6c757d', margin: 0, fontSize: isMobile ? '0.9rem' : '1rem' }}>Yes, a 14-day free trial for Growth/Professional plans.</p>
                    </div>
                    <div>
                        <h4 style={{ color: '#007bff', marginBottom: '8px', fontSize: isMobile ? '1rem' : '1.1rem' }}>Do job postings roll over?</h4>
                        <p style={{ color: '#6c757d', margin: 0, fontSize: isMobile ? '0.9rem' : '1rem' }}>Yes, unused postings carry into the next month.</p>
                    </div>
                    <div>
                        <h4 style={{ color: '#007bff', marginBottom: '8px', fontSize: isMobile ? '1rem' : '1.1rem' }}>What payment methods are accepted?</h4>
                        <p style={{ color: '#6c757d', margin: 0, fontSize: isMobile ? '0.9rem' : '1rem' }}>Credit cards, bank transfers, GoPay, OVO.</p>
                    </div>
                    <div>
                        <h4 style={{ color: '#007bff', marginBottom: '8px', fontSize: isMobile ? '1rem' : '1.1rem' }}>Is there a refund policy?</h4>
                        <p style={{ color: '#6c757d', margin: 0, fontSize: isMobile ? '0.9rem' : '1rem' }}>Cancellations are prorated for the unused period.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingInformation;