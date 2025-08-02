// src/Home.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home({ children }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [user, setUser] = useState({ email: '', role: '' });

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
    width: '180px',
    padding: '8px 12px',
    background: 'white',
    border: '1px solid #007bff',
    borderRadius: '4px',
    color: '#007bff',
    cursor: 'pointer',
    textAlign: 'center',
    fontSize: '1rem',
    marginBottom: '8px',
    transition: 'background 0.2s, color 0.2s',
    fontWeight: 500
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
          padding: '20px 0',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          height: '100vh',
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
          borderRight: '1px solid #000',
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: '12px', textAlign: 'center' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}
          >
            <img src="/shopping_cart.png" alt="Logo" style={{ width: '100px' }} />
          </button>
          <div
            style={{
              marginTop: '8px',
              fontWeight: 'bold',
              fontSize: '1.12rem',
              color: '#111',  // black
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}
          >
            FULLSTACK FOOD
          </div>
        </div>

        {/* Nav buttons (move up with top margin) */}
        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '26px',
            marginBottom: 'auto'
          }}
        >
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

        {/* Logout above black line */}
        <div style={{ padding: '0 20px' }}>
          <button
            onClick={handleLogout}
            onMouseEnter={() => setHovered('logout')}
            onMouseLeave={() => setHovered(null)}
            style={{
              ...baseStyle,
              ...(hovered === 'logout' ? hoverStyle : {}),
              width: '100%',
              marginBottom: 0
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
        </div>
      </aside>

      <main style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        {children || (
          <div style={{ maxWidth: 750, margin: '0 auto', textAlign: 'center' }}>
            <img
              src="/shopping_cart.png"
              alt="Company Logo"
              style={{
                width: 130,
                marginBottom: 24,
                filter: 'drop-shadow(0px 2px 6px rgba(0,0,0,0.09))'
              }}
            />
            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: 'bold',
              margin: 0,
              letterSpacing: '2px',
              color: '#007bff',
              textTransform: 'uppercase'
            }}>
              FULLSTACK FOOD
            </h1>
            {/* Even more spacing between main title and subtitle */}
            <div style={{ height: 56 }} />
            <h2 style={{
              fontSize: '2.4rem',
              marginBottom: 16,
              marginTop: 0,
              color: '#23366b',
              fontWeight: '600'
            }}>
              Welcome to the Internal Portal
            </h2>
            <p style={{ fontSize: '1.2rem', color: '#4b4b4b', marginBottom: 0 }}>
              Welcome to our internal portal for Fullstack Food, the all-in-one dashboard for our food delivery operation. We specialize in delivering fully prepared, restaurant-quality meals straight to your door—fresh, hot, and always delicious. Our dedicated team works around the clock to make sure every customer enjoys a seamless ordering experience, fast delivery, and a rotating menu of mouthwatering entrees, sides, and desserts. Whether you’re a manager, employee, or part of our support staff, this portal gives you the tools you need to keep operations running smoothly, track orders, manage inventory, and ensure our customers always get the best meals in town.
              <br /><br />
              Use the sidebar to navigate between sections. You can view, add, and edit products, keep track of all customer orders, and manage discount codes. If you are a manager, you’ll have access to even more advanced controls.
              <br /><br />
              Questions? Contact Hayes, Gabriel, or Noah, and Christian your group 8 experts.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

