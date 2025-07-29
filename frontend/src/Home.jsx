import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home({ children }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/', { replace: true });
  };

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

  const buttons = [
    { key: 'dashboard', label: 'Home', action: () => navigate('/dashboard') },
    { key: 'products',  label: 'Products', action: () => navigate('/products') },
    { key: 'orders',    label: 'Orders', action: () => navigate('/orders') },
    { key: 'logout',    label: 'Logout', action: handleLogout },
  ];

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
          height: 'calc(100vh - 15px)',
          marginBottom: '40px',
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
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
          {buttons.map(({ key, label, action }) => (
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
      </aside>

      <main style={{ flex: 1, padding: '20px' }}>
        {children || <h1>Welcome!</h1>}
      </main>
    </div>
  );
}

