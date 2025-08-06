import React from 'react';

export const faqData = [    
    {
        question: "What is Untern and how does it work?",
        answer: "Untern is a comprehensive internship platform that connects students with companies offering internship opportunities. Students can search for internships based on their interests, skills, and location preferences, while companies can post internship positions and find talented candidates."
    },
    {
        question: "How do I apply for internships on Untern?",
        answer: "To apply for internships, first create a student account and complete your profile. Browse through available internships using our search feature, and click 'Apply' on positions that interest you. Make sure your profile is complete with your skills, education, and portfolio to increase your chances of selection."
    },
    {
        question: "Is Untern free to use for students?",
        answer: "Yes, Untern is completely free for students. You can create an account, search for internships, apply to positions, and access all student features at no cost. We believe in making internship opportunities accessible to all students."
    },
    {
        question: "How do companies post internship opportunities?",
        answer: "Companies can create a business account on Untern and post detailed internship listings. Each posting can include job requirements, compensation details, duration, and application deadlines. Companies can also browse student profiles and reach out to potential candidates directly."
    },
    {
        question: "What types of internships are available?",
        answer: "Untern hosts a diverse range of internships including technology (frontend, backend, mobile development), design (UI/UX, graphic design), marketing, data science, finance, consulting, and many other fields. We offer remote, on-site, and hybrid opportunities."
    },
    {
        question: "How long do internships typically last?",
        answer: "Internship durations vary depending on the company and position. Most internships on our platform range from 3 to 6 months, though some may be shorter (summer internships) or longer (up to 12 months). Each listing clearly specifies the expected duration."
    },
    {
        question: "Do I need prior experience to apply for internships?",
        answer: "Not necessarily! Many internships are designed for students who are just starting their careers. However, having relevant coursework, personal projects, or basic skills in your field of interest will make you a stronger candidate. Focus on showcasing your passion and willingness to learn."
    },
    {
        question: "How are students matched with internship opportunities?",
        answer: "Our platform uses a combination of keyword matching, skill alignment, and location preferences to help students find relevant opportunities. Students can also use filters to narrow down searches by industry, location, duration, and job type."
    },
    {
        question: "What should I include in my profile to attract companies?",
        answer: "Create a comprehensive profile that includes your education background, relevant skills, portfolio projects, certifications, and career objectives. Add a professional photo and write a compelling bio that highlights your strengths and interests."
    },
    {
        question: "Can I apply to multiple internships at the same time?",
        answer: "Yes, you can apply to multiple internships simultaneously. However, we recommend applying only to positions that genuinely interest you and match your skills. Quality applications are more effective than quantity."
    },
    {
        question: "How do I know if my application has been viewed?",
        answer: "You'll receive notifications when companies view your application or when there are updates to your application status. You can also track all your applications in your student dashboard."
    },
    {
        question: "What if I need help with my application or profile?",
        answer: "Untern provides resources and tips for creating strong profiles and applications. You can also contact our support team through the platform if you need personalized assistance or have technical issues."
    }
];

const FAQItem = ({ faq, index, isOpen, onToggle }) => {
    return (
        <div 
            className="faq-item"
            style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                marginBottom: '16px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
            }}
        >
            <button
                className="faq-question"
                onClick={() => onToggle(index)}
                style={{
                    width: '100%',
                    padding: '24px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#2c3e50',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
                <span>{faq.question}</span>
                <span style={{
                    fontSize: '1.5rem',
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    color: '#112D4E'
                }}>
                    +
                </span>
            </button>
            
            {isOpen && (
                <div 
                    className="faq-answer"
                    style={{
                        padding: '0 24px 24px',
                        fontSize: '1.1rem',
                        lineHeight: '1.8',
                        color: '#555',
                        borderTop: '1px solid #e9ecef',
                        animation: 'fadeIn 0.3s ease-in-out'
                    }}
                >
                    {faq.answer}
                </div>
            )}
        </div>
    );
};

const FAQList = ({ faqData, openFAQ, toggleFAQ }) => {
    return (
        <div className="faq-list">
            {faqData.map((faq, index) => (
                <FAQItem
                    key={index}
                    faq={faq}
                    index={index}
                    isOpen={openFAQ === index}
                    onToggle={toggleFAQ}
                />
            ))}
        </div>
    );
};

export default FAQList;