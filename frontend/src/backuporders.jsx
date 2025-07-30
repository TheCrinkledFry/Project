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
    >{children}</button>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [statusPriority, setStatusPriority] = useState('processing');

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch(console.error);
  }, []);

  const handleExecute = async id => {
    try {
      const updated = await executeOrder(id);
      setOrders(prev => prev.map(o => (o.id === id ? updated : o)));
    } catch (err) {
      console.error(err);
    }
  };

  // Sorting logic...
  const sortedOrders = [...orders].sort((a, b) => {
    if (sortField === 'status') {
      if (a.status.toLowerCase() === statusPriority && b.status.toLowerCase() !== statusPriority) return -1;
      if (b.status.toLowerCase() === statusPriority && a.status.toLowerCase() !== statusPriority) return 1;
      return 0;
    }
    let valA, valB;
    switch (sortField) {
      case 'total':
        valA = a.total || 0;
        valB = b.total || 0;
        break;
      case 'customer':
        valA = a.customerName.toLowerCase();
        valB = b.customerName.toLowerCase();
        break;
      case 'date':
      default:
        valA = new Date(a.date);
        valB = new Date(b.date);
    }
    const cmp = valA < valB ? -1 : valA > valB ? 1 : 0;
    return sortOrder === 'asc' ? cmp : -cmp;
  });

  const getToggleLabel = () => {
    if (sortField === 'date') {
      return sortOrder === 'asc' ? 'Show Newest First' : 'Show Oldest First';
    }
    if (sortField === 'total') {
      return sortOrder === 'asc' ? 'Show Highest First' : 'Show Lowest First';
    }
    if (sortField === 'customer') {
      return sortOrder === 'asc' ? 'Show Z to A' : 'Show A to Z';
    }
    return '';
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Orders</h2>
      {/* sort controls... */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
        <label>
          Sort by:
          <select value={sortField} onChange={e => setSortField(e.target.value)} style={{ marginLeft: '0.5rem', padding: '0.25rem' }}>
            <option value="date">Date</option>
            <option value="total">Total</option>
            <option value="customer">Customer</option>
            <option value="status">Status</option>
          </select>
        </label>
        {sortField === 'status' ? (
          <StyledButton onClick={() => setStatusPriority(prev => prev === 'processing' ? 'executed' : 'processing')}>
            Show {statusPriority === 'processing' ? 'Executed' : 'Processing'} First
          </StyledButton>
        ) : (
          <StyledButton onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}>
            {getToggleLabel()}
          </StyledButton>
        )}
      </div>
      {!sortedOrders.length && <p>No orders yet.</p>}
      {sortedOrders.map(o => (
        <div key={o.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <p style={{ margin: 0, marginBottom: '0.5rem' }}>
            <strong>Order #{o.id}</strong> — Customer: <em>{o.customerName}</em> — Status: {o.status}
          </p>
          <p style={{ margin: '0.25rem 0', color: '#555' }}>
            Date: {new Date(o.date).toLocaleString()}
          </p>
          <StyledButton onClick={() => handleExecute(o.id)} disabled={o.status !== 'Processing'}>Execute</StyledButton>
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
            {o.items.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '0.25rem' }}>{item.product?.name || 'Unknown'} × {item.quantity}</li>
            ))}
          </ul>
          <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>Total: ${o.total?.toFixed(2) || '0.00'}</p>
        </div>
      ))}
    </div>
  );
}

