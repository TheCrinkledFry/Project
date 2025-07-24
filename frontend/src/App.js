// src/App.js
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from 'react-router-dom';

import LoginPage from './Login';         // src/Login.jsx
import Home from './Home';               // src/Home.jsx
import PrivateRoute from './PrivateRoute'; // src/PrivateRoute.jsx
import Products from './Products';       // src/Products.jsx

function App() {
  return (
    <Router>
      <Routes>
        {/* public login */}
        <Route path="/" element={<LoginWrapper />} />

        {/* protected dashboard (home) */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        {/* protected products page */}
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <Home>
                <Products />
              </Home>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

function LoginWrapper() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = ({ email, password }) => {
    // stubbed credentials for testing
    if (email === 'user@test.com' && password === 'password123') {
      localStorage.setItem('authToken', 'dummy-token');
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <LoginPage
      onLogin={handleLogin}
      errorMessage={error}
    />
  );
}

export default App;

