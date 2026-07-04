// utils/api.jsx - API service for communicating with backend
import axios from 'axios';

// Base URL for API requests
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Check if token is expired before making request
      // console.log('Current token:', token);
      if (utils.isTokenExpired()) {
        try {
          const refreshResponse = await authAPI.refreshToken();
          if (refreshResponse.success && refreshResponse.token) {
            config.headers.Authorization = `Bearer ${refreshResponse.token}`;
          } else {
            // If refresh fails, clear auth data
            utils.clearAuthData();
            window.location.href = '/login';
            return Promise.reject(new Error('Session expired'));
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          utils.clearAuthData();
          window.location.href = '/login';
          return Promise.reject(new Error('Session expired'));
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token first
        const refreshResponse = await api.post('/refresh');
        if (refreshResponse.data.success && refreshResponse.data.token) {
          localStorage.setItem('token', refreshResponse.data.token);
          // Update the authorization header for the original request
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }
      
      // If refresh fails, remove invalid token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-expired'));
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  // Send verification code
  sendVerificationCode: async (email) => {
    try {
      const response = await api.post('/send-verification-code', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to send verification code' };
    }
  },

  // Verify email code
  verifyEmailCode: async (email, code) => {
    try {
      const response = await api.post('/verify-email-code', { email, code });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Email verification failed' };
    }
  },

  // Register a new user
  register: async (userData) => {
    try {
      // Map frontend field names to backend field names
      const backendData = {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        phone_number: userData.phone_number,
        user_type: userData.userType || userData.user_type || 'student',
        // Company specific fields
        company_name: userData.company_name,
        company_website: userData.company_website,
        industry: userData.industry,
        company_size: userData.company_size,
        about: userData.about,
        address: userData.address,
        // Student specific fields
        university: userData.university,
        major: userData.major,
        graduation_date: userData.graduation_date,
        bio: userData.bio
      };
      
      const response = await api.post('/register', backendData);
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Registration failed' };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      // Extract expectedUserType for client-side validation
      const { expectedUserType, ...loginCredentials } = credentials;
      
      // Map frontend field names to backend field names for login too
      const backendData = {
        ...loginCredentials,
        user_type: loginCredentials.userType || loginCredentials.user_type
      };
      
      // Remove the frontend field to avoid confusion
      delete backendData.userType;
      
      const response = await api.post('/login', backendData);
      if (response.data.success && response.data.token) {
        // Validate user type matches the expected type for the login context
        if (expectedUserType && response.data.user.userType !== expectedUserType) {
          throw { 
            success: false, 
            message: `This account is not authorized for ${expectedUserType} access` 
          };
        }
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Login failed' };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Verify token
  verifyToken: async () => {
    try {
      const response = await api.get('/verify');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Token verification failed' };
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await api.post('/refresh');
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Token refresh failed' };
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/profile', profileData);
      if (response.data.success && response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Profile update failed' };
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch profile' };
    }
  }
};

// Student Profile API calls
export const studentAPI = {
  // Get student profile
  getProfile: async () => {
    try {
      const response = await api.get('/student/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch student profile' };
    }
  },

  // Update student profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/student/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to update student profile' };
    }
  },

  // Get student skills
  getSkills: async () => {
    try {
      const response = await api.get('/student/skills');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch skills' };
    }
  },

  // Add skill to student
  addSkill: async (skillName) => {
    try {
      const response = await api.post('/student/skills', { skill_name: skillName });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to add skill' };
    }
  },

  // Remove skill from student
  removeSkill: async (skillName) => {
    try {
      const response = await api.delete(`/student/skills/${encodeURIComponent(skillName)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to remove skill' };
    }
  },

  // Upload resume
  uploadResume: async (formData) => {
    try {
      const response = await api.post('/student/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to upload resume' };
    }
  },

  // Upload profile picture
  uploadProfilePicture: async (formData) => {
    try {
      const response = await api.post('/student/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to upload profile picture' };
    }
  },

  // Send phone verification code
  sendPhoneVerification: async (phoneNumber) => {
    try {
      const response = await api.post('/student/phone/send-verification', { phone_number: phoneNumber });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to send verification code' };
    }
  },

  // Verify phone code
  verifyPhoneCode: async (code) => {
    try {
      const response = await api.post('/student/phone/verify-code', { code });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to verify phone code' };
    }
  },

  // Remove resume
  removeResume: async () => {
    try {
      const response = await api.delete('/student/resume');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to remove resume' };
    }
  },

  // Remove profile picture
  removeProfilePicture: async () => {
    try {
      const response = await api.delete('/student/profile-picture');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to remove profile picture' };
    }
  }
};

// Company API calls
export const companyAPI = {
  // Get company profile
  getProfile: async () => {
    try {
      const response = await api.get('/company/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch company profile' };
    }
  },

  // Update company profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/company/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to update company profile' };
    }
  },

  // Create internship
  createInternship: async (internshipData) => {
    try {
      const response = await api.post('/company/internships', internshipData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to create internship' };
    }
  },

  // Get company's internships
  getInternships: async () => {
    try {
      const response = await api.get('/company/internships');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch company internships' };
    }
  },

  // Update internship
  updateInternship: async (internshipId, internshipData) => {
    try {
      const response = await api.put(`/company/internships/${internshipId}`, internshipData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to update internship' };
    }
  },

  // Delete internship
  deleteInternship: async (internshipId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/company/internships/${internshipId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return await response.json();
    } catch (error) {
      throw new Error('Failed to delete internship: ' + error.message);
    }
  },

  // Get applications for company's internships
  getApplications: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/company/applications`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return await response.json();
    } catch (error) {
      throw new Error('Failed to fetch applications: ' + error.message);
    }
  },

  // Update application status
  updateApplicationStatus: async (applicationId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/company/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      return await response.json();
    } catch (error) {
      throw new Error('Failed to update application status: ' + error.message);
    }
  },

  // Upload company logo
  uploadLogo: async (formData) => {
    try {
      const response = await api.post('/company/logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to upload logo' };
    }
  },

  // Mark application as done
  markApplicationDone: async (applicationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/company/applications/${applicationId}/done`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return await response.json();
    } catch (error) {
      throw new Error('Failed to mark application as done: ' + error.message);
    }
  },

  // Get student profile by ID (company access)
  getStudentProfileById: async (studentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/company/student-profile/${studentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return await response.json();
    } catch (error) {
      throw new Error('Failed to fetch student profile: ' + error.message);
    }
  },

  // Insert profile view when company views student profile
  insertProfileView: async (studentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/company/profile-view`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ student_id: studentId })
      });
      return await response.json();
    } catch (error) {
      throw new Error('Failed to insert profile view: ' + error.message);
    }
  }
};

// Skills API calls
export const skillsAPI = {
  // Get all available skills
  getAllSkills: async () => {
    try {
      const response = await api.get('/skills');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch skills' };
    }
  },

  // Search skills
  searchSkills: async (query) => {
    try {
      const response = await api.get(`/skills/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to search skills' };
    }
  }
};

// Reviews API calls
export const reviewsAPI = {
  // Get company reviews
  getCompanyReviews: async (companyId) => {
    try {
      let response;
      if (companyId) {
        response = await api.get(`/companies/${companyId}/reviews`);
      } else {
        response = await api.get('/companies/reviews');
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch reviews' };
    }
  },

  // Create review
  createReview: async (companyId, reviewData) => {
    try {
      const response = await api.post(`/companies/${companyId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to create review' };
    }
  }
};

// Internship API calls
export const internshipAPI = {
  // Get all internships with optional filters
  getInternships: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== '' && filters[key] !== 'all') {
          params.append(key, filters[key]);
        }
      });

      const response = await api.get(`/internships?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch internships' };
    }
  },

  // Get single internship by ID
  getInternship: async (id) => {
    try {
      const response = await api.get(`/internships/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch internship' };
    }
  },

  // Apply for internship
  applyForInternship: async (internshipId, applicationData) => {
    try {
      const response = await api.post(`/internships/${internshipId}/apply`, applicationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to apply for internship' };
    }
  },

  // Get user's applications
  getMyApplications: async () => {
    try {
      // Uses /student/applications endpoint, which returns student_profile_id and done_intern
      const response = await api.get('/student/applications');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch applications' };
    }
  },

  // Get application by ID
  getApplication: async (id) => {
    try {
      const response = await api.get(`/applications/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch application' };
    }
  },

  // Get filter options
  getFilters: async () => {
    try {
      const response = await api.get('/internships-filters');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch filters' };
    }
  }
};

// Internship Documents API calls
export const internshipDocumentsAPI = {
  // Upload internship documents
  upload: async (formData) => {
    const response = await api.post('/internship-documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  // Get internship documents for student
  getForStudent: async (studentId) => {
    const response = await api.get(`/internship-documents/student/${studentId}`);
    return response.data;
  },
  // Get internship documents for company
  getForCompany: async (companyId) => {
    const response = await api.get(`/internship-documents/company/${companyId}`);
    return response.data;
  }
};

// Utility functions
export const utils = {
  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user && !utils.isTokenExpired());
  },

  // Check if token is expired
  isTokenExpired: () => {
    const token = localStorage.getItem('token');
    if (!token) return true;
    
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  },

  // Clear auth data
  clearAuthData: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Format currency (Indonesian Rupiah)
  formatCurrency: (amount) => {
    if (!amount) return 'Not specified';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  },

  // Format date
  formatDate: (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  // Format salary range
  formatSalaryRange: (min, max, currency = 'IDR') => {
    if (!min && !max) return 'Salary not specified';
    if (min && max) {
      return `${utils.formatCurrency(min)} - ${utils.formatCurrency(max)}`;
    }
    if (min) return `From ${utils.formatCurrency(min)}`;
    if (max) return `Up to ${utils.formatCurrency(max)}`;
  },

  // Get file URL with proper base URL
  getFileUrl: (filePath) => {
    if (!filePath) return null;
    if (filePath.startsWith('http')) return filePath;
    return `${import.meta.env.VITE_API_URL || ''}${filePath}`;
  }
};

export default api;
