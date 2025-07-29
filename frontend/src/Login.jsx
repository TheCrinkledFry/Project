import React, { useState } from 'react';

export default function LoginPage({ onLogin, errorMessage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    // Basic front-end validation
    if (!email || !password) {
      setLocalError('Email and password are required.');
      return;
    }
    setLocalError('');

    // TODO: Call backend login API here (e.g., POST /api/login)
    // fetch('/api/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    //   .then(res => res.json())
    //   .then(data => {
    //     // On success, store token (e.g., localStorage.setItem('authToken', data.token));
    //     // then call onLogin or redirect
    //     onLogin(data);
    //   })
    //   .catch(err => {
    //     // Handle login errors from server
    //     setLocalError(err.message || 'Login failed');
    //   });

    // Current onLogin prop: backend should call this after API returns token
    onLogin({ email, password });
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>Login</h2>

      {/* Display front-end validation errors */}
      {localError && <p style={{ color: 'red' }}>{localError}</p>}
      {/* Display server-side errors (e.g., invalid credentials) */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="email">Email</label><br />
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="password">Password</label><br />
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

