import React from 'react';

export default function Orders() {
  // Temporary static data until backend is ready
  const orders = [
    { id: 1, customerName: 'Alice', date: '2025-07-24', total: 49.99, status: 'Shipped' },
    { id: 2, customerName: 'Bob',   date: '2025-07-23', total: 29.95, status: 'Processing' },
    { id: 3, customerName: 'Carol', date: '2025-07-22', total: 15.00, status: 'Shipped' },
    { id: 4, customerName: 'Dave',  date: '2025-07-21', total: 99.90, status: 'Processing' },
  ];

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <h1>Orders</h1>
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
          {orders.map(order => (
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

