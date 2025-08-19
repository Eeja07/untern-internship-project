import React, { useState } from 'react';
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
            type: 'basic'
        },
        {
            name: 'Professional',
            price: 'Rp 500,000',
            duration: 'per month',
            features: [
                'Unlimited internship postings',
                'Advanced candidate search',
                'Priority support',
                'Analytics dashboard',
                'Featured job listings',
                'Application management tools'
            ],
            recommended: true,
            type: 'payable'
        },
        {
            name: 'Enterprise',
            price: 'Rp 1,500,000',
            duration: 'per month',
            features: [
                'Everything in Professional',
                'Dedicated account manager',
                'Custom branding',
                'API access',
                'Advanced analytics',
                'Bulk operations',
                'Custom integrations'
            ],
            recommended: false,
            type: 'payable'
        },
        {
            name: 'Custom/Enterprise',
            price: 'Contact Sales',
            duration: '',
            features: [
                'Tailored solutions for large organizations',
                'Custom integrations & onboarding',
                'Dedicated enterprise support',
                'SLAs & compliance',
                'On-premise or hybrid deployment',
                'Consulting & training'
            ],
            recommended: false,
            type: 'contact'
        }
    ];

    const [loading, setLoading] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const handleUpgrade = async (plan) => {
        setLoading(true);
        setPaymentInfo(null);
        setErrorMsg('');
        try {
            const res = await axios.post('http://localhost:4000/api/pay/midtrans', {
                amount: plan.name === 'Professional' ? 500000 : 1500000,
                orderId: `order-${Date.now()}`,
                name: 'Company Name', // Replace with actual company name
                email: 'company@email.com', // Replace with actual company email
                phone: '081234567890', // Replace with actual company phone
            });
            setPaymentInfo(res.data);
            if (res.data.redirect_url) {
                window.location.href = res.data.redirect_url;
            }
        } catch (err) {
            setErrorMsg(err.response?.data?.error || 'Payment initiation failed');
        }
        setLoading(false);
    };

    return (
        <div>
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Pricing Information</h1>
                <p style={{ color: '#6c757d' }}>Choose the plan that best fits your company's needs.</p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: '40px',
                marginBottom: '50px',
                alignItems: 'stretch'
            }}>
                {pricingPlans.map((plan, index) => (
                    <div key={index} style={{
                        background: 'linear-gradient(135deg, #f8fafc 60%, #e9ecef 100%)',
                        borderRadius: '20px',
                        padding: '48px 36px',
                        boxShadow: plan.recommended ? '0 12px 40px rgba(0,123,255,0.18)' : '0 6px 24px rgba(0,0,0,0.08)',
                        border: plan.recommended ? '2.5px solid #007bff' : '2px solid #e9ecef',
                        position: 'relative',
                        textAlign: 'center',
                        minHeight: '520px',
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
                                padding: '7px 28px',
                                borderRadius: '18px',
                                fontSize: '1rem',
                                fontWeight: '700',
                                letterSpacing: '0.5px',
                                boxShadow: '0 2px 8px rgba(0,123,255,0.12)'
                            }}>
                                RECOMMENDED
                            </div>
                        )}
                        <h3 style={{ color: '#2c3e50', marginBottom: '16px', fontSize: '2rem', fontWeight: 700 }}>{plan.name}</h3>
                        <div style={{ marginBottom: '28px' }}>
                            <span style={{ fontSize: '2.8rem', fontWeight: 'bold', color: plan.type === 'contact' ? '#fd7e14' : '#007bff' }}>{plan.price}</span>
                            {plan.price !== 'Free' && plan.type !== 'contact' && (
                                <span style={{ color: '#6c757d', fontSize: '1.1rem' }}> / {plan.duration}</span>
                            )}
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px', textAlign: 'left' }}>
                            {plan.features.map((feature, idx) => (
                                <li key={idx} style={{
                                    padding: '10px 0',
                                    color: '#444',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    fontSize: '1.08rem'
                                }}>
                                    <span style={{ color: '#28a745', fontSize: '1.2rem' }}>✓</span>
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

            {/* Additional Information */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '30px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Frequently Asked Questions</h2>
                <div style={{ display: 'grid', gap: '20px' }}>
                    <div>
                        <h4 style={{ color: '#007bff', marginBottom: '8px' }}>Can I change my plan anytime?</h4>
                        <p style={{ color: '#6c757d', margin: 0 }}>Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
                    </div>
                    <div>
                        <h4 style={{ color: '#007bff', marginBottom: '8px' }}>Is there a setup fee?</h4>
                        <p style={{ color: '#6c757d', margin: 0 }}>No, there are no setup fees. You only pay the monthly subscription fee for your chosen plan.</p>
                    </div>
                    <div>
                        <h4 style={{ color: '#007bff', marginBottom: '8px' }}>What payment methods do you accept?</h4>
                        <p style={{ color: '#6c757d', margin: 0 }}>We accept all major credit cards, bank transfers, and popular Indonesian payment methods like GoPay and OVO.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingInformation;