// src/PrivateRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  // now matches the key we set in Login.jsx
  return localStorage.getItem('authToken')
    ? children
    : <Navigate to="/" replace />;
}

