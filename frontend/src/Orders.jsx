import React, { useState } from 'react';

export default function Orders() {
  // Temporary static data until backend is ready
  const orders = [
    { id: 1, customerName: 'Alice', date: '2025-07-24', total: 49.99, status: 'Shipped' },
    { id: 2, customerName: 'Bob',   date: '2025-07-23', total: 29.95, status: 'Processing' },
    { id: 3, customerName: 'Carol', date: '2025-07-22', total: 15.00, status: 'Processing' },
    { id: 4, customerName: 'Dave',  date: '2025-07-21', total: 99.90, status: 'Shipped' },
  ];

  const [sortBy, setSortBy] = useState('date');
  const [sortDir, setSortDir] = useState('asc');

  const sortedOrders = [...orders].sort((a, b) => {
    let vA = a[sortBy];
    let vB = b[sortBy];

    if (sortBy === 'date') {
      vA = new Date(vA).getTime();
      vB = new Date(vB).getTime();
    }

    if (vA > vB) return sortDir === 'asc' ? 1 : -1;
    if (vA < vB) return sortDir === 'asc' ? -1 : 1;
    return 0;
  });

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <h1>Orders</h1>

      {/* Sorting controls */}
      <div style={{ marginBottom: '16px' }}>
        <label>
          Sort by:
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{ marginLeft: '8px', marginRight: '16px' }}
          >
            <option value="customerName">Customer</option>
            <option value="date">Date</option>
            <option value="status">Status</option>
            <option value="total">Price</option>
          </select>
        </label>

        {sortBy === 'status' ? (
          <label>
            Priority:
            <select
              value={sortDir}
              onChange={e => setSortDir(e.target.value)}
              style={{ marginLeft: '8px' }}
            >
              <option value="desc">Shipped first</option>
              <option value="asc">Processing first</option>
            </select>
          </label>
        ) : (
          <button
            onClick={() => setSortDir(dir => (dir === 'asc' ? 'desc' : 'asc'))}
            style={{ padding: '4px 8px' }}
          >
            {sortDir === 'asc' ? 'Ascending ↑' : 'Descending ↓'}
          </button>
        )}
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Order ID</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Customer</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {sortedOrders.map(order => (
            <tr key={order.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.id}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.customerName}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.date}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>${order.total.toFixed(2)}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ fontStyle: 'italic', marginTop: '20px' }}>
        * Data is mocked in the front-end until the backend is implemented
      </p>
    </div>
  );
}

