// src/Orders.jsx

import React, { useState, useEffect } from 'react';
import { getOrders, executeOrder } from './utils/api';

// Styled button matching Home sidebar style
function StyledButton({ children, onClick, disabled, type = 'button', style: userStyle, ...rest }) {
  const [hovered, setHovered] = useState(false);
  const baseStyle = {
    padding: '8px 12px',
    background: 'white',
    border: '1px solid #007bff',
    borderRadius: '4px',
    color: '#007bff',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    textAlign: 'center',
    fontSize: '1rem',
    transition: 'background 0.2s, color 0.2s',
    ...userStyle,
  };
  const hoverStyle = disabled
    ? {}
    : {
        background: '#007bff',
        color: 'white',
      };
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={hovered ? { ...baseStyle, ...hoverStyle } : baseStyle}
      {...rest}
    >
      {children}
    </button>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    getOrders(token)
      .then(setOrders)
      .catch(console.error);
  }, [token]);

  const handleExecute = async id => {
    try {
      const updated = await executeOrder(id, token);
      setOrders(prev => prev.map(o => (o.id === id ? updated : o)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="orders-page" style={{ padding: '1rem' }}>
      <h2>Orders</h2>
      {!orders.length && <p>No orders yet.</p>}
      {orders.map(o => (
        <div
          key={o.id}
          className="order-card"
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <p style={{ margin: 0, marginBottom: '0.5rem' }}>
            <strong>Order #{o.id}</strong> — {o.status}
          </p>
          <StyledButton
            onClick={() => handleExecute(o.id)}
            disabled={o.status !== 'Processing'}
          >
            Execute
          </StyledButton>
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
            {(o.items || []).map((item, idx) => (
              <li key={idx} style={{ marginBottom: '0.25rem' }}>
                {item.product?.name || 'Unknown'} × {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

