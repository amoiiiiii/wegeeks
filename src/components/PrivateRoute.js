// src/components/PrivateRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const PrivateRoute = ({ element, requiredRole }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Replace with your backend API endpoint for checking authentication
        const response = await axios.get('http://localhost:8080/api/auth/check', { 
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
        });
        
        setIsAuthenticated(true);
        
        // Check if user has the required role
        if (response.data.role === requiredRole || !requiredRole) {
          setHasAccess(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [requiredRole]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!hasAccess) {
    return <div>Access Denied</div>; // Or you can redirect to an access denied page
  }

  return element;
};

export default PrivateRoute;
