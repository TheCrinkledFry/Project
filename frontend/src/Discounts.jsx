// src/Discounts.jsx

import React, { useState, useEffect } from 'react';
import { getDiscounts, createDiscount } from './utils/api';

// Styled button matching Home sidebar style
function StyledButton({ children, onClick, type = 'button', style: userStyle, ...rest }) {
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

export default function Discounts() {
  const [codes, setCodes] = useState([]);
  const [newCode, setNewCode] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    getDiscounts()
      .then(setCodes)
      .catch(console.error);
  }, []);

  const handleCreate = async e => {
    e.preventDefault();
    const payload = { code: newCode.trim(), amount: parseFloat(amount) };
    try {
      const created = await createDiscount(payload);
      setCodes(prev => [...prev, created]);
      setNewCode('');
      setAmount('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Discount Codes</h2>
      <form onSubmit={handleCreate} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          placeholder="Code"
          value={newCode}
          onChange={e => setNewCode(e.target.value)}
          required
          style={{ padding: '0.5rem' }}
        />
        <input
          placeholder="Amount (%)"
          type="number"
          step="0.01"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
          style={{ padding: '0.5rem', width: '120px' }}
        />
        <StyledButton type="submit">Add</StyledButton>
      </form>

      {/* Existing codes list */}
      <h3 style={{ margin: '1rem 0 0.5rem' }}>Existing Codes</h3>
      {codes.length === 0 ? (
        <p style={{ color: '#555' }}>No discount codes available.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {codes.map(c => (
            <li
              key={c.id}
              style={{
                marginBottom: '0.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>
                <strong>{c.code}</strong> — {c.amount}%
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

