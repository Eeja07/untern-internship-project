import React, { useState } from 'react';

const PostInternship = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        location: '',
        type: 'remote',
        duration_months: '3',
        salary_min: '',
        salary_max: '',
        application_deadline: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        
        // Here you would typically send the data to your backend API
        // For now, we'll just simulate the process
        try {
            // Uncomment and modify when you have a backend API
            // const response = await fetch('/api/internships', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${localStorage.getItem('token')}`
            //     },
            //     body: JSON.stringify(formData)
            // });
            // 
            // if (response.ok) {
            //     alert('Internship posting submitted successfully!');
            //     // Reset form
            //     setFormData({
            //         title: '',
            //         description: '',
            //         requirements: '',
            //         location: '',
            //         type: 'remote',
            //         duration_months: '3',
            //         salary_min: '',
            //         salary_max: '',
            //         application_deadline: ''
            //     });
            // } else {
            //     alert('Error submitting internship posting');
            // }
            
            // Temporary success simulation
            alert('Internship posting submitted successfully!');
            
            // Reset form
            setFormData({
                title: '',
                description: '',
                requirements: '',
                location: '',
                type: 'remote',
                duration_months: '3',
                salary_min: '',
                salary_max: '',
                application_deadline: ''
            });
            
        } catch (error) {
            console.error('Error:', error);
            alert('Error submitting internship posting');
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Post Internship Opening</h1>
                <p style={{ color: '#6c757d' }}>Create a new internship opportunity for students.</p>
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
                                Job Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #e9ecef',
                                    borderRadius: '8px',
                                    fontSize: '1rem'
                                }}
                                placeholder="e.g., Frontend Developer Intern"
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                Job Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                rows={5}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #e9ecef',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    resize: 'vertical'
                                }}
                                placeholder="Describe the role, responsibilities, and what the intern will learn..."
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                Requirements *
                            </label>
                            <textarea
                                name="requirements"
                                value={formData.requirements}
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
                                placeholder="List required skills, education level, experience, etc..."
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                    Location *
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '8px',
                                        fontSize: '1rem'
                                    }}
                                    placeholder="e.g., Jakarta or Remote"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                    Work Type *
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '8px',
                                        fontSize: '1rem'
                                    }}
                                >
                                    <option value="remote">Remote</option>
                                    <option value="on-site">On-site</option>
                                    <option value="hybrid">Hybrid</option>
                                    <option value="full-time">Full-time</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                    Duration (months) *
                                </label>
                                <select
                                    name="duration_months"
                                    value={formData.duration_months}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '8px',
                                        fontSize: '1rem'
                                    }}
                                >
                                    <option value="3">3 months</option>
                                    <option value="4">4 months</option>
                                    <option value="6">6 months</option>
                                    <option value="12">12 months</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                    Salary Range (Min)
                                </label>
                                <input
                                    type="number"
                                    name="salary_min"
                                    value={formData.salary_min}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '8px',
                                        fontSize: '1rem'
                                    }}
                                    placeholder="e.g., 2000000"
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                    Salary Range (Max)
                                </label>
                                <input
                                    type="number"
                                    name="salary_max"
                                    value={formData.salary_max}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '8px',
                                        fontSize: '1rem'
                                    }}
                                    placeholder="e.g., 3000000"
                                />
                            </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                Application Deadline
                            </label>
                            <input
                                type="date"
                                name="application_deadline"
                                value={formData.application_deadline}
                                onChange={handleInputChange}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #e9ecef',
                                    borderRadius: '8px',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
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
                            Post Internship
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostInternship;