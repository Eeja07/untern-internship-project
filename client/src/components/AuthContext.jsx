// context/AuthContext.js - Authentication context for managing user state
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, utils } from './api';

// Create the auth context
// Update context untuk include userType
const AuthContext = createContext({
  isAuthenticated: false,
  userType: null, // 'student' or 'company'
  user: null,
  login: () => {},
  logout: () => {}
});
// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state on component mount
  useEffect(() => {
    initializeAuth();
    
    // Listen for auth expiration events
    const handleAuthExpired = () => {
      logout();
    };
    
    window.addEventListener('auth-expired', handleAuthExpired);
    
    return () => {
      window.removeEventListener('auth-expired', handleAuthExpired);
    };
  }, []);

  // Initialize authentication state
  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const savedUser = utils.getCurrentUser();
      
      if (token && savedUser) {
        // Verify token is still valid
        try {
          const response = await authAPI.verifyToken();
          if (response.success) {
            setUser(savedUser);
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          // Token verification failed, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials);
      
      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
        return response;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authAPI.register(userData);
      
      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
        return response;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authAPI.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user profile
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Get fresh user profile
  const refreshUserProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      if (response.success) {
        updateUser(response.user);
        return response.user;
      }
    } catch (error) {
      console.error('Error refreshing user profile:', error);
      throw error;
    }
  };

  // Get user type from user object
  const userType = user?.userType || user?.type || null;

  // Context value
  const value = {
    user,
    userType,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
    refreshUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
