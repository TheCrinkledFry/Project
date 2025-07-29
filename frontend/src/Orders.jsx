import React, { useState } from 'react';

export default function Orders() {
  // TODO: Replace mock initial data with backend API call
  // For example: useEffect(() => {
  //   fetch('/api/orders')
  //     .then(res => res.json())
  //     .then(data => setOrders(data));
  // }, []);
  const initialOrders = [
    { id: 1, customerName: 'Alice', date: '2025-07-24', total: 49.99, status: 'Processing' },
    { id: 2, customerName: 'Bob',   date: '2025-07-23', total: 29.95, status: 'Executed'   },
    { id: 3, customerName: 'Carol', date: '2025-07-22', total: 15.00, status: 'Executed'   },
    { id: 4, customerName: 'Dave',  date: '2025-07-21', total: 99.90, status: 'Processing' },
  ];

  const [orders, setOrders] = useState(initialOrders);
  const [sortBy, setSortBy] = useState('date');
  const [sortDir, setSortDir] = useState('asc');

  // Called when user clicks "Execute". Should update DB and state.
  const handleExecute = id => {
    // TODO: Call backend API to execute order, e.g.:
    // fetch(`/api/orders/${id}/execute`, { method: 'POST' })
    //   .then(res => res.json())
    //   .then(updated => update state accordingly);
    setOrders(prev =>
      prev.map(o => (o.id === id ? { ...o, status: 'Executed' } : o))
    );
  };

  // sort logic on frontend
  const sorted = [...orders].sort((a, b) => {
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

  // Uniform cell style
  const cellStyle = {
    border: '1px solid #ddd',
    padding: '12px',
    height: '60px',
  };
  const actionColWidth = '150px';

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <h1>Orders</h1>

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
              <option value="desc">Processing First</option>
              <option value="asc">Executed First</option>
            </select>
          </label>
        ) : (
          <button
            onClick={() => setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))}
            style={{ padding: '6px 12px', cursor: 'pointer' }}
          >
            {sortDir === 'asc' ? 'Ascending ↑' : 'Descending ↓'}
          </button>
        )}
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={cellStyle}>Order ID</th>
            <th style={cellStyle}>Customer</th>
            <th style={cellStyle}>Date</th>
            <th style={cellStyle}>Total</th>
            <th style={cellStyle}>Status</th>
            <th style={{ ...cellStyle, width: actionColWidth }}>Execute Order</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(order => (
            <tr key={order.id}>
              <td style={cellStyle}>{order.id}</td>
              <td style={cellStyle}>{order.customerName}</td>
              <td style={cellStyle}>{order.date}</td>
              <td style={cellStyle}>${order.total.toFixed(2)}</td>
              <td style={cellStyle}>{order.status}</td>
              <td style={{ ...cellStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {order.status === 'Processing' && (
                  <button
                    onClick={() => handleExecute(order.id)}
                    style={{ padding: '6px 12px', cursor: 'pointer' }}
                  >
                    Execute
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ fontStyle: 'italic', marginTop: '20px' }}>
        * Data is mocked until backend is live
      </p>
    </div>
  );
}

