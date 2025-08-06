import React from 'react';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, onUnauthorized }) => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // If not authenticated, trigger the unauthorized callback
  if (!isAuthenticated) {
    if (onUnauthorized) {
      onUnauthorized();
    }
    return null;
  }

  // If authenticated, render the protected content
  return children;
};

export default ProtectedRoute;
