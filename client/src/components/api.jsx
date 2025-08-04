// utils/api.jsx - API service for communicating with backend
import axios from 'axios';

// Base URL for API requests
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
  (error) => {
    if (error.response?.status === 401) {
      // Remove invalid token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // You might want to redirect to login or show login modal
      window.dispatchEvent(new Event('auth-expired'));
    }
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post('/register', userData);
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
      const response = await api.post('/login', credentials);
      if (response.data.success && response.data.token) {
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

  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch profile' };
    }
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
      const response = await api.get('/my-applications');
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

// Utility functions
export const utils = {
  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
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
  }
};

export default api;
