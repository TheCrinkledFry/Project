import React, { useState, useEffect } from 'react';
import { getOrders, executeOrder, getDiscounts } from './utils/api';

// Styled button matching sidebar style
function StyledButton({ children, onClick, type = 'button', disabled, style: userStyle, ...rest }) {
  const [hovered, setHovered] = useState(false);
  const baseStyle = {
    padding: '8px 12px',
    background: 'white',
    border: '1px solid #007bff',
    borderRadius: '4px',
    color: '#007bff',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
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
  const [discounts, setDiscounts] = useState([]);
  const [sort, setSort] = useState({ key: 'date', dir: -1 });

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch(console.error);
    getDiscounts()
      .then(setDiscounts)
      .catch(console.error);
  }, []);

  const handleExecute = async id => {
    try {
      await executeOrder(id);
      setOrders(orders =>
        orders.map(o =>
          o.id === id ? { ...o, status: 'Executed' } : o
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSort = key => {
    setSort(s => s.key === key ? { key, dir: -s.dir } : { key, dir: 1 });
  };

  // Get discount percent from code
  const getDiscountAmount = code => {
    const d = discounts.find(x => x.code === code);
    return d ? d.amount : 0;
  };

  const sortedOrders = [...orders].sort((a, b) => {
    switch (sort.key) {
      case 'customer':
        return sort.dir * (a.customerName.localeCompare(b.customerName));
      case 'total':
        return sort.dir * ((b.total || 0) - (a.total || 0));
      case 'date':
        return sort.dir * (new Date(b.date) - new Date(a.date));
      case 'status':
        return sort.dir * (a.status.localeCompare(b.status));
      default:
        return 0;
    }
  });

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Orders</h2>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <StyledButton onClick={() => toggleSort('customer')}>
          Customer {sort.key === 'customer' && (sort.dir === 1 ? 'A→Z' : 'Z→A')}
        </StyledButton>
        <StyledButton onClick={() => toggleSort('date')}>
          Date {sort.key === 'date' && (sort.dir === 1 ? 'Oldest First' : 'Newest First')}
        </StyledButton>
        <StyledButton onClick={() => toggleSort('total')}>
          Total {sort.key === 'total' && (sort.dir === 1 ? 'Lowest→Highest' : 'Highest→Lowest')}
        </StyledButton>
        <StyledButton onClick={() => toggleSort('status')}>
          Status {sort.key === 'status' && (sort.dir === 1 ? 'Processing' : 'Executed')}
        </StyledButton>
      </div>

      {sortedOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        sortedOrders.map(o => {
          const discountAmount = getDiscountAmount(o.discountCode);
          const origTotal = o.total || 0;
          const discount = discountAmount > 0
            ? parseFloat((origTotal * (1 - discountAmount / 100)).toFixed(2))
            : null;

          return (
            <div
              key={o.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <p style={{ margin: 0, marginBottom: '0.5rem' }}>
                <strong>Order #{o.id}</strong> — Customer: <em>{o.customerName}</em> — Status: {o.status}
              </p>
              <p style={{ margin: '0.25rem 0', color: '#555' }}>
                Date: {new Date(o.date).toLocaleString()}
              </p>
              <StyledButton
                onClick={() => handleExecute(o.id)}
                disabled={o.status !== 'Processing'}
                style={{ marginBottom: '0.5rem' }}
              >
                Execute
              </StyledButton>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
                {(o.items || []).map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '0.25rem' }}>
                    {item.product?.name || `Product #${item.productId}`} × {item.quantity}
                  </li>
                ))}
              </ul>
              <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>
                Total:{" "}
                {discount
                  ? (
                      <>
                        <span style={{ textDecoration: 'line-through', color: '#d32f2f', marginRight: 8 }}>
                          ${origTotal.toFixed(2)}
                        </span>
                        <span style={{ color: '#111', fontWeight: 'bold' }}>
                          ${discount.toFixed(2)}
                        </span>
                      </>
                    )
                  : `$${origTotal.toFixed(2)}`
                }
              </p>
              {o.discountCode && (
                <p style={{ margin: 0, color: '#007bff', fontWeight: 'bold' }}>
                  Discount code: <span style={{ fontFamily: 'monospace' }}>{o.discountCode}</span> &nbsp;
                  <span style={{ color: '#007bff', fontWeight: 'normal' }}>
                    ({discountAmount}% off)
                  </span>
                </p>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

