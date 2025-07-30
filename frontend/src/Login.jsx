// src/Login.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from './utils/api';

// Styled button matching Home sidebar style
function StyledButton({ children, type = 'button', onClick, style: userStyle, ...rest }) {
  const [hovered, setHovered] = useState(false);
  const baseStyle = {
    padding: '8px 12px',
    background: 'white',
    border: '1px solid #007bff',
    borderRadius: '4px',
    color: '#007bff',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background 0.2s, color 0.2s',
    ...userStyle,
  };
  const hoverStyle = {
    background: '#007bff',
    color: 'white',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={hovered ? { ...baseStyle, ...hoverStyle } : baseStyle}
      {...rest}
    >
      {children}
    </button>
  );
}

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate                = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { token } = await login(email, password);
      localStorage.setItem('authToken', token);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.error || err.message || 'Login failed');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingTop: '15vh',
      minHeight: '100vh',
      background: '#f9f9f9'
    }}>
      <div style={{
        width: '320px',
        padding: '2rem',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            letterSpacing: '2px',
            color: '#111',
            margin: 0,
            marginBottom: '1.2rem',
            textTransform: 'uppercase'
          }}
        >
          FULLSTACK FOOD
        </h1>
        <h2 style={{ marginBottom: '1rem' }}>Login</h2>
        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ padding: '0.5rem', fontSize: '1rem' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ padding: '0.5rem', fontSize: '1rem' }}
          />
          <StyledButton type="submit">Log In</StyledButton>
        </form>
      </div>
    </div>
  );
}

