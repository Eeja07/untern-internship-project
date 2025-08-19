// context/AuthContext.js - Authentication context for managing user state
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, studentAPI, companyAPI, utils } from './api';

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
      
      if (token) {
        // Verify token is still valid and get fresh user data
        try {
          const response = await authAPI.verifyToken();
          if (response.success) {
            // Get fresh profile data from server
            const profileResponse = await authAPI.getProfile();
            if (profileResponse.success) {
              let fullProfile = profileResponse.user;
              
              // Get additional profile data based on user type
              if (profileResponse.user.user_type === 'student') {
                try {
                  const studentResponse = await studentAPI.getProfile();
                  if (studentResponse.success) {
                    fullProfile = {
                      ...fullProfile,
                      student_profile: studentResponse.profile
                    };
                  }
                } catch (studentError) {
                  console.error('Failed to fetch student profile:', studentError);
                }
              } else if (profileResponse.user.user_type === 'company') {
                try {
                  const companyResponse = await companyAPI.getProfile();
                  if (companyResponse.success) {
                    fullProfile = {
                      ...fullProfile,
                      company: companyResponse.profile
                    };
                  }
                } catch (companyError) {
                  console.error('Failed to fetch company profile:', companyError);
                }
              }
              
              setUser(fullProfile);
              setIsAuthenticated(true);
              localStorage.setItem('user', JSON.stringify(fullProfile));
            } else {
              throw new Error('Failed to fetch profile');
            }
          } else {
            // console.log('Token is invalid, clearing storage');
            // Token is invalid, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          // console.log('Token verification failed:', error);
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
        let fullProfile = response.user;
        // Fetch student profile if userType is student
        if (response.user.userType === 'student') {
          try {
            const studentResponse = await studentAPI.getProfile();
            if (studentResponse.success) {
              fullProfile = {
                ...fullProfile,
                student_profile: studentResponse.profile
              };
            }
          } catch (studentError) {
            console.error('Failed to fetch student profile after login:', studentError);
          }
        }
        setUser(fullProfile);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(fullProfile));
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
      setLoading(true);
      
      // Use specific endpoint based on user type
      let response;
      const currentUserType = user?.userType || user?.user_type;
      
      if (currentUserType === 'student') {
        response = await authAPI.getProfile(); // This will get basic profile
        // Also get detailed student profile
        const studentResponse = await studentAPI.getProfile();
        if (studentResponse.success) {
          response.user = {
            ...response.user,
            student_profile: studentResponse.profile
          };
        }
      } else if (currentUserType === 'company') {
        response = await authAPI.getProfile(); // This will get basic profile
        // Also get detailed company profile
        const companyResponse = await companyAPI.getProfile();
        if (companyResponse.success) {
          response.user = {
            ...response.user,
            company: companyResponse.profile
          };
        }
      } else {
        response = await authAPI.getProfile();
      }
      
      if (response.success) {
        updateUser(response.user);
        return response.user;
      } else {
        throw new Error(response.message || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error refreshing user profile:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get user type from user object
  const userType = user?.userType || user?.user_type || null;

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

export { AuthContext };
export default AuthContext;
