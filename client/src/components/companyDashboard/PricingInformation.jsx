import React from 'react';

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
            recommended: false
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
            recommended: true
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
            recommended: false
        }
    ];

    return (
        <div>
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Pricing Information</h1>
                <p style={{ color: '#6c757d' }}>Choose the plan that best fits your company's needs.</p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '30px',
                marginBottom: '40px'
            }}>
                {pricingPlans.map((plan, index) => (
                    <div key={index} style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '40px 30px',
                        boxShadow: plan.recommended ? '0 8px 30px rgba(0,123,255,0.15)' : '0 4px 20px rgba(0,0,0,0.1)',
                        border: plan.recommended ? '2px solid #007bff' : '2px solid transparent',
                        position: 'relative',
                        textAlign: 'center'
                    }}>
                        {plan.recommended && (
                            <div style={{
                                position: 'absolute',
                                top: '-12px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                backgroundColor: '#007bff',
                                color: 'white',
                                padding: '5px 20px',
                                borderRadius: '15px',
                                fontSize: '0.85rem',
                                fontWeight: '600'
                            }}>
                                RECOMMENDED
                            </div>
                        )}
                        
                        <h3 style={{ color: '#2c3e50', marginBottom: '10px', fontSize: '1.5rem' }}>{plan.name}</h3>
                        <div style={{ marginBottom: '20px' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#007bff' }}>{plan.price}</span>
                            {plan.price !== 'Free' && (
                                <span style={{ color: '#6c757d', fontSize: '1rem' }}> / {plan.duration}</span>
                            )}
                        </div>
                        
                        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '30px' }}>
                            {plan.features.map((feature, idx) => (
                                <li key={idx} style={{ 
                                    padding: '8px 0', 
                                    color: '#555',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    <span style={{ color: '#28a745' }}>✓</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        
                        <button style={{
                            width: '100%',
                            padding: '12px 0',
                            backgroundColor: plan.recommended ? '#007bff' : 'white',
                            color: plan.recommended ? 'white' : '#007bff',
                            border: '2px solid #007bff',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '600',
                            transition: 'all 0.3s ease'
                        }}>
                            {plan.name === 'Basic' ? 'Current Plan' : 'Upgrade Now'}
                        </button>
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