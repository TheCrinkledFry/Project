// frontend/src/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  return localStorage.getItem('authToken')
    ? children
    : <Navigate to="/" replace />;
}

