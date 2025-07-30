// src/Home.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home({ children }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [user, setUser] = useState({ email: '', role: '' });

  // On mount, decode user from JWT
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ email: payload.email, role: payload.role });
      } catch (e) {
        console.error('Failed to parse token', e);
      }
    }
  }, []);

  const baseStyle = {
    width: '100%',
    padding: '8px 12px',
    background: 'white',
    border: '1px solid #007bff',
    borderRadius: '4px',
    color: '#007bff',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '1rem',
    marginBottom: '8px',
    transition: 'background 0.2s, color 0.2s',
  };

  const hoverStyle = {
    background: '#007bff',
    color: 'white',
  };

  const navButtons = [
    { key: 'dashboard', label: 'Home', action: () => navigate('/dashboard') },
    { key: 'products',  label: 'Products', action: () => navigate('/products') },
    { key: 'orders',    label: 'Orders',  action: () => navigate('/orders') },
    { key: 'discounts', label: 'Discounts',  action: () => navigate('/discounts') }
  ];

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/', { replace: true });
  };

  // Capitalize role
  const displayRole = user.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : '';

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      <aside
        style={{
          width: '220px',
          background: '#fcffc4',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          height: '100vh',
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
          borderRight: '1px solid #000',    // line now black
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: '16px', textAlign: 'center' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}
          >
            <img src="/shopping_cart.png" alt="Logo" style={{ width: '100px' }} />
          </button>
        </div>

        {/* Nav buttons */}
        <nav style={{ display: 'flex', flexDirection: 'column' }}>
          {navButtons.map(({ key, label, action }) => (
            <button
              key={key}
              onClick={action}
              onMouseEnter={() => setHovered(key)}
              onMouseLeave={() => setHovered(null)}
              style={{
                ...baseStyle,
                ...(hovered === key ? hoverStyle : {}),
              }}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Spacer to push logout and user info to bottom */}
        <div style={{ flexGrow: 1 }} />

        {/* Logout above black line */}
        <button
          onClick={handleLogout}
          onMouseEnter={() => setHovered('logout')}
          onMouseLeave={() => setHovered(null)}
          style={{
            ...baseStyle,
            ...(hovered === 'logout' ? hoverStyle : {}),
          }}
        >
          Logout
        </button>

        {/* Black separator line */}
        <div style={{ borderTop: '1px solid #000', margin: '16px 0' }} />

        {/* User info */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: '4px 0', fontWeight: 'bold' }}>{user.email}</p>
          <p style={{ margin: '4px 0', color: '#555' }}>{displayRole}</p>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        {children || <h1>Welcome!</h1>}
      </main>
    </div>
  );
}

