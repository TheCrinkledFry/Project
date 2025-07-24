// src/Login.jsx
import React, { useState } from 'react';

export default function LoginPage({ onLogin, errorMessage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!email || !password) {
      setLocalError('Email and password are required.');
      return;
    }
    setLocalError('');
    onLogin({ email, password });
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>Login</h2>

      {/* field‑validation error */}
      {localError && <p style={{ color: 'red' }}>{localError}</p>}
      {/* credential‑check error */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="email">Email</label><br/>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="password">Password</label><br/>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px' }}>
          Login
        </button>
      </form>
    </div>
  );
}

