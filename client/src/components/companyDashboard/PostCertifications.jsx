import React, { useState, useEffect } from 'react';
import { internshipDocumentsAPI } from '../auth/api.jsx';
import api from '../auth/api.jsx';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const FILE_BASE_URL = API_BASE_URL.replace(/\/api$/, '');

const TABS = {
	POST: 'Post Certificate',
	MANAGE: 'Manage Certificates',
};

const PostCertifications = () => {
	const [selectedStudent, setSelectedStudent] = useState('');
	const [selectedPost, setSelectedPost] = useState('');
	const [mentor, setMentor] = useState('');
	const [feedback, setFeedback] = useState('');
	const [certificateFile, setCertificateFile] = useState(null);
	const [letterFile, setLetterFile] = useState(null);
	const [students, setStudents] = useState([]);
	const [internships, setInternships] = useState([]);
	const [studentApplications, setStudentApplications] = useState([]);
	const [uploadedDocs, setUploadedDocs] = useState([]);
	const [editDocId, setEditDocId] = useState(null);
	const [editMentor, setEditMentor] = useState('');
	const [editFeedback, setEditFeedback] = useState('');
	const [editCertificateFile, setEditCertificateFile] = useState(null);
	const [editLetterFile, setEditLetterFile] = useState(null);
	const [activeTab, setActiveTab] = useState(TABS.POST);
	const [searchTerm, setSearchTerm] = useState('');
	const [filterStudent, setFilterStudent] = useState('');
	const [filterPost, setFilterPost] = useState('');
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

	useEffect(() => {
		const fetchStudents = async () => {
			try {
				const res = await api.get('/students');
				setStudents(res.data.students || []);
			} catch (err) {
				setStudents([]);
			}
		};
		const fetchInternships = async () => {
			try {
				const res = await api.get('/company/internships');
				setInternships(res.data.internships || []);
			} catch (err) {
				setInternships([]);
			}
		};
		fetchStudents();
		fetchInternships();
	}, []);

	useEffect(() => {
		if (!selectedStudent) {
			setStudentApplications([]);
			return;
		}
		const fetchApplications = async () => {
			try {
				const studentObj = students.find(s => s.name === selectedStudent);
				if (!studentObj) return;
				const res = await api.get(`/company/student-applications?student_id=${studentObj.student_id}`);
				setStudentApplications(res.data.applications || []);
			} catch (err) {
				setStudentApplications([]);
			}
		};
		fetchApplications();
	}, [selectedStudent, students]);

	const fetchUploadedDocs = async () => {
		// console.log('fetchUploadedDocs called');
		try {
			const company = localStorage.getItem('user');
			// console.log('user:', company);
			const parsedCompany = company ? JSON.parse(company) : null;
			const companyId = parsedCompany ? (parsedCompany.company_id || parsedCompany.id) : null;
			// console.log('companyId:', companyId);
			if (!companyId) return;
			const res = await internshipDocumentsAPI.getForCompany(companyId);
			// console.log('Company dashboard fetched documents:', res.documents);
			setUploadedDocs(res.documents || []);
		} catch (err) {
			console.error('Error fetching uploadedDocs:', err);
			setUploadedDocs([]);
		}
	};
	useEffect(() => {
		fetchUploadedDocs();
	}, []);

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth <= 768);
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const handleStudentChange = (e) => {
		setSelectedStudent(e.target.value);
	};
	const handlePostChange = (e) => {
		setSelectedPost(e.target.value);
	};

	const handleMentorChange = (e) => setMentor(e.target.value);
	const handleFeedbackChange = (e) => setFeedback(e.target.value);
	const handleCertificateFile = (e) => setCertificateFile(e.target.files[0] || null);
	const handleLetterFile = (e) => setLetterFile(e.target.files[0] || null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!selectedStudent || !selectedPost || !mentor || !feedback) {
			alert('Please fill all required fields.');
			return;
		}
		const formData = new FormData();
		formData.append('studentName', selectedStudent);
		formData.append('internshipPost', selectedPost);
		formData.append('mentor', mentor);
		formData.append('feedback', feedback);
		if (certificateFile) formData.append('certificate', certificateFile);
		if (letterFile) formData.append('letter', letterFile);
		try {
			await internshipDocumentsAPI.upload(formData);
			alert('Certificate and/or Letter uploaded successfully!');
			fetchUploadedDocs(); // Refresh list after upload
		} catch (err) {
			alert('Upload failed!');
		}
		setSelectedStudent('');
		setSelectedPost('');
		setMentor('');
		setFeedback('');
		setCertificateFile(null);
		setLetterFile(null);
	};

	const startEdit = (doc) => {
		setEditDocId(doc.document_id);
		setEditMentor(doc.mentor || '');
		setEditFeedback(doc.feedback || '');
		setEditCertificateFile(null);
		setEditLetterFile(null);
	};
	const cancelEdit = () => {
		setEditDocId(null);
		setEditMentor('');
		setEditFeedback('');
		setEditCertificateFile(null);
		setEditLetterFile(null);
	};
	const handleEditFile = (e, type) => {
		if (type === 'certificate') setEditCertificateFile(e.target.files[0] || null);
		if (type === 'letter') setEditLetterFile(e.target.files[0] || null);
	};
	const handleRemoveFile = async (docId, type) => {
		if (!window.confirm(`Remove ${type}?`)) return;
		try {
			await api.delete(`/internship-documents/${docId}?type=${type}`);
			fetchUploadedDocs();
			alert(`${type.charAt(0).toUpperCase() + type.slice(1)} removed.`);
		} catch (err) {
			alert('Remove failed!');
		}
	};
	const handleEditSubmit = async (doc) => {
		const formData = new FormData();
		formData.append('mentor', editMentor);
		formData.append('feedback', editFeedback);
		if (editCertificateFile) formData.append('certificate', editCertificateFile);
		if (editLetterFile) formData.append('letter', editLetterFile);
		try {
			await api.put(`/internship-documents/${doc.document_id}`, formData, {
				headers: { 'Content-Type': 'multipart/form-data' }
			});
			alert('Post updated!');
			cancelEdit();
			fetchUploadedDocs();
		} catch (err) {
			alert('Update failed!');
		}
	};
	const handleDelete = async (docId, type) => {
		if (!docId) {
			alert('Document ID is missing. Cannot delete.');
			return;
		}
		if (!window.confirm(`Are you sure you want to delete this post?`)) return;
		try {
			await api.delete(`/internship-documents/${docId}${type === 'post' ? '' : `?type=${type}`}`);
			fetchUploadedDocs();
			alert('Post deleted successfully.');
			cancelEdit();
		} catch (err) {
			alert('Delete failed!');
		}
	};

	// Filtered uploadedDocs for Manage tab
	const filteredDocs = uploadedDocs.filter(doc => {
		const matchesSearch =
			searchTerm === '' ||
			(doc.student_name && doc.student_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
			(doc.internship_title && doc.internship_title.toLowerCase().includes(searchTerm.toLowerCase()));
		const matchesStudent = filterStudent === '' || doc.student_name === filterStudent;
		const matchesPost = filterPost === '' || doc.internship_title === filterPost;
		return matchesSearch && matchesStudent && matchesPost;
	});

	return (
		<div>
			<div style={{ marginBottom: '30px' }}>
				<h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Certificate & Letter</h1>
				<p style={{ color: '#6c757d' }}>Upload and manage certificates and letters for your interns. These will be visible in the student dashboard.</p>
			</div>
			{/* Tab Navigation */}
			<div style={{ 
				display: 'flex', 
				gap: '16px', 
				marginBottom: '30px',
				flexDirection: isMobile ? 'column' : 'row' 
			}}>
				{Object.values(TABS).map(tab => (
					<button
						key={tab}
						onClick={() => setActiveTab(tab)}
						style={{
							padding: '12px 32px',
							backgroundColor: activeTab === tab ? '#007bff' : '#e9ecef',
							color: activeTab === tab ? 'white' : '#343a40',
							border: 'none',
							borderRadius: '8px',
							cursor: 'pointer',
							fontWeight: 'bold',
							fontSize: '1rem',
							boxShadow: activeTab === tab ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
							transition: 'background-color 0.2s',
							width: isMobile ? '100%' : 'auto'
						}}
					>
						{tab}
					</button>
				))}
			</div>

			{/* Tab Content */}
			{activeTab === TABS.POST && (
				<div>
					<div style={{ backgroundColor: 'white', borderRadius: '12px', padding: isMobile ? '20px' : '40px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
						<form onSubmit={handleSubmit}>
							<div style={{ display: 'grid', gap: '25px' }}>
								<div>
									<label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>Student Name *</label>
									<select
										value={selectedStudent}
										onChange={handleStudentChange}
										required
										style={{ width: '100%', padding: '12px 16px', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '1rem' }}
									>
										<option value="">Select Student</option>
										{students.map(s => (
											<option key={s.student_id} value={s.name}>{s.name}</option>
										))}
									</select>
								</div>
								<div>
									<label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>Internship Post *</label>
									<select
										value={selectedPost}
										onChange={handlePostChange}
										required
										style={{ width: '100%', padding: '12px 16px', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '1rem' }}
									>
										<option value="">Select Internship Post</option>
										{studentApplications.map(app => (
											<option key={app.internship_id} value={app.internship_title}>{app.internship_title}</option>
										))}
									</select>
								</div>
								<div>
									<label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>Mentor *</label>
									<input
										type="text"
										value={mentor}
										onChange={handleMentorChange}
										required
										style={{ width: '100%', padding: '0', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '1rem' }}
										placeholder="e.g., John Smith"
									/>
								</div>
								<div>
									<label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>Feedback/Evaluation *</label>
									<textarea
										value={feedback}
										onChange={handleFeedbackChange}
										required
										rows={3}
										style={{ width: '100%', padding: '0', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '1rem', resize: 'vertical' }}
										placeholder="Feedback or evaluation for the intern"
									/>
								</div>
								<div>
									<label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>Upload Certificate (PDF/JPG/PNG)</label>
									<input
										type="file"
										accept=".pdf,.jpg,.png"
										onChange={handleCertificateFile}
										style={{ width: '100%', padding: '0', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '1rem' }}
									/>
								</div>
								<div>
									<label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>Upload Letter (PDF/JPG/PNG)</label>
									<input
										type="file"
										accept=".pdf,.jpg,.png"
										onChange={handleLetterFile}
										style={{ width: '100%', padding: '0', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '1rem' }}
									/>
								</div>
								<button
									type="submit"
									style={{ padding: '15px 30px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: '600', transition: 'background-color 0.3s ease' }}
									onMouseEnter={e => e.target.style.backgroundColor = '#0056b3'}
									onMouseLeave={e => e.target.style.backgroundColor = '#007bff'}
								>
									Upload Certificate & Letter
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
			{activeTab === TABS.MANAGE && (
				<div>
					<div style={{ marginBottom: '24px' }}>
						<div style={{ 
							display: 'flex', 
							gap: '16px', 
							flexWrap: 'wrap', 
							marginBottom: '16px',
							flexDirection: isMobile ? 'column' : 'row' 
						}}>
							<input
								type="text"
								value={searchTerm}
								onChange={e => setSearchTerm(e.target.value)}
								placeholder="Search by student or post"
								style={{ 
									padding: '0', 
									borderRadius: '8px', 
									border: '2px solid #e9ecef', 
									fontSize: '1rem', 
									minWidth: isMobile ? '100%' : '180px',
									width: isMobile ? '100%' : 'auto'
								}}
							/>
							<select
								value={filterStudent}
								onChange={e => setFilterStudent(e.target.value)}
								style={{ 
									padding: '10px 16px', 
									borderRadius: '8px', 
									border: '2px solid #e9ecef', 
									fontSize: '1rem', 
									minWidth: isMobile ? '100%' : '160px',
									width: isMobile ? '100%' : 'auto'
								}}
							>
								<option value="">All Students</option>
								{[...new Set(uploadedDocs.map(doc => doc.student_name))].map(name => (
									<option key={name} value={name}>{name}</option>
								))}
							</select>
							<select
								value={filterPost}
								onChange={e => setFilterPost(e.target.value)}
								style={{ 
									padding: '10px 16px', 
									borderRadius: '8px', 
									border: '2px solid #e9ecef', 
									fontSize: '1rem', 
									minWidth: isMobile ? '100%' : '160px',
									width: isMobile ? '100%' : 'auto'
								}}
							>
								<option value="">All Posts</option>
								{[...new Set(uploadedDocs.map(doc => doc.internship_title))].map(title => (
									<option key={title} value={title}>{title}</option>
								))}
							</select>
						</div>
					</div>
					<div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginTop: '10px' }}>
						<div style={{ display: 'grid', gap: '32px' }}>
							{filteredDocs.length === 0 ? (
								<div style={{ color: '#6c757d', textAlign: 'center', padding: '20px' }}>No certificates or letters found.</div>
							) : (
								filteredDocs.map((doc, idx) => (
									<div key={doc.document_id || idx} style={{ background: '#e7f3ff', padding: '24px', borderRadius: '14px', border: '1px solid #b6d4fe', marginBottom: '16px' }}>
										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
											<h3 style={{ color: '#007bff', marginBottom: '8px' }}>{doc.internship_title}</h3>
											{editDocId === doc.document_id ? (
												<button style={{ background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', padding: '8px 18px', cursor: 'pointer', marginLeft: '10px' }} onClick={cancelEdit}>Cancel Edit</button>
											) : (
												<button style={{ background: '#ffc107', color: '#343a40', border: 'none', borderRadius: '4px', padding: '8px 18px', cursor: 'pointer', marginLeft: '10px' }} onClick={() => startEdit(doc)}>Edit</button>
											)}
										</div>
										{editDocId === doc.document_id ? (
											<div style={{ marginTop: '12px' }}>
												<div style={{ marginBottom: '10px' }}>
													<label style={{ fontWeight: 'bold' }}>Mentor:</label>
													<input type="text" value={editMentor} onChange={e => setEditMentor(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e9ecef', marginTop: '4px' }} />
												</div>
												<div style={{ marginBottom: '10px' }}>
													<label style={{ fontWeight: 'bold' }}>Feedback/Evaluation:</label>
													<textarea value={editFeedback} onChange={e => setEditFeedback(e.target.value)} rows={3} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e9ecef', marginTop: '4px' }} />
												</div>
												<div style={{ marginBottom: '10px' }}>
													<span style={{ fontWeight: 'bold', color: '#007bff' }}>Certificate:</span>
													{doc.certificate_file_url ? (
														<div style={{ marginTop: '8px' }}>
															<a href={doc.certificate_file_url ? `${FILE_BASE_URL}${doc.certificate_file_url}` : '#'} target="_blank" rel="noopener noreferrer" style={{ background: '#28a745', color: 'white', textDecoration: 'none', padding: '6px 16px', borderRadius: '4px', fontSize: '14px' }}>View Certificate</a>
															<button style={{ marginLeft: '10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer' }} onClick={() => handleRemoveFile(doc.document_id, 'certificate')}>Remove</button>
														</div>
													) : null}
													<input type="file" accept=".pdf,.jpg,.png" onChange={e => handleEditFile(e, 'certificate')} style={{ marginTop: '8px' }} />
												</div>
												<div style={{ marginBottom: '10px' }}>
													<span style={{ fontWeight: 'bold', color: '#007bff' }}>Letter:</span>
													{doc.letter_file_url ? (
														<div style={{ marginTop: '8px' }}>
															<a href={doc.letter_file_url ? `${FILE_BASE_URL}${doc.letter_file_url}` : '#'} target="_blank" rel="noopener noreferrer" style={{ background: '#28a745', color: 'white', textDecoration: 'none', padding: '6px 16px', borderRadius: '4px', fontSize: '14px' }}>View Letter</a>
															<button style={{ marginLeft: '10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer' }} onClick={() => handleRemoveFile(doc.document_id, 'letter')}>Remove</button>
														</div>
													) : null}
													<input type="file" accept=".pdf,.jpg,.png" onChange={e => handleEditFile(e, 'letter')} style={{ marginTop: '8px' }} />
												</div>
												<div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '18px', flexDirection: isMobile ? 'column' : 'row' }}>
													<button style={{ 
														background: '#007bff', 
														color: 'white', 
														border: 'none', 
														borderRadius: '4px', 
														padding: '10px 22px', 
														cursor: 'pointer', 
														fontWeight: 'bold',
														width: isMobile ? '100%' : 'auto'
													}} onClick={() => handleEditSubmit(doc)}>Save</button>
													<button style={{ 
														background: '#dc3545', 
														color: 'white', 
														border: 'none', 
														borderRadius: '4px', 
														padding: '10px 22px', 
														cursor: 'pointer', 
														fontWeight: 'bold',
														width: isMobile ? '100%' : 'auto'
													}} onClick={() => handleDelete(doc.document_id, 'post')}>Delete Post</button>
												</div>
											</div>
										) : (
											<div>
												<p style={{ margin: '4px 0', color: '#343a40' }}><strong>Student:</strong> {doc.student_name}</p>
												<p style={{ margin: '4px 0', color: '#6c757d' }}><strong>Mentor:</strong> {doc.mentor}</p>
												<div style={{ margin: '8px 0', color: '#343a40', background: '#e7f3ff', padding: '10px', borderRadius: '8px' }}>
													<strong>Feedback/Evaluation:</strong> {doc.feedback}
												</div>
												<div style={{ marginBottom: '10px' }}>
													<span style={{ fontWeight: 'bold', color: '#007bff' }}>Certificate:</span>
													{doc.certificate_file_url ? (
														<div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '8px', border: '1px solid #e9ecef', marginTop: '8px' }}>
															<a href={doc.certificate_file_url ? `${FILE_BASE_URL}${doc.certificate_file_url}` : '#'} target="_blank" rel="noopener noreferrer" style={{ background: '#28a745', color: 'white', textDecoration: 'none', padding: '6px 16px', borderRadius: '4px', fontSize: '14px' }}>View Certificate</a>
														</div>
													) : (
														<div style={{ color: '#dc3545', marginTop: '8px' }}>No certificate uploaded.</div>
													)}
												</div>
												<div style={{ marginBottom: '10px' }}>
													<span style={{ fontWeight: 'bold', color: '#007bff' }}>Letter:</span>
													{doc.letter_file_url ? (
														<div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '8px', border: '1px solid #e9ecef', marginTop: '8px' }}>
															<a href={doc.letter_file_url ? `${FILE_BASE_URL}${doc.letter_file_url}` : '#'} target="_blank" rel="noopener noreferrer" style={{ background: '#28a745', color: 'white', textDecoration: 'none', padding: '6px 16px', borderRadius: '4px', fontSize: '14px' }}>View Letter</a>
														</div>
													) : (
														<div style={{ color: '#dc3545', marginTop: '8px' }}>No letter uploaded.</div>
													)}
												</div>
											</div>
										)}
									</div>
								))
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default PostCertifications;