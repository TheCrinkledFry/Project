// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './Login';
import Home from './Home';
import PrivateRoute from './PrivateRoute';
import Products from './Products';
import Orders from './Orders';
import Discounts from './Discounts';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public login route */}
        <Route path="/" element={<Login />} />

        {/* Protected routes */}
        <Route element={<PrivateRoute />}>  
          <Route
            path="dashboard"
            element={<Home />}
          />
          <Route
            path="products"
            element={<Home><Products /></Home>}
          />
          <Route
            path="orders"
            element={<Home><Orders /></Home>}
          />
          <Route
            path="discounts"
            element={<Home><Discounts /></Home>}
          />
          {/* Redirect /app to dashboard, if you have /app prefix, otherwise consider default */}
        </Route>

        {/* Fallback to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

