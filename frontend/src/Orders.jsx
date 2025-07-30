import React, { useState, useEffect } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleExecute = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`/api/orders/${id}/execute`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to execute order");
      // Optimistically update UI (or refetch orders)
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: "Executed" } : o)),
      );
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const sorted = [...orders].sort((a, b) => {
    let vA = a[sortBy];
    let vB = b[sortBy];
    if (sortBy === "date") {
      vA = new Date(vA).getTime();
      vB = new Date(vB).getTime();
    }
    if (vA > vB) return sortDir === "asc" ? 1 : -1;
    if (vA < vB) return sortDir === "asc" ? -1 : 1;
    return 0;
  });

  const cellStyle = {
    border: "1px solid #ddd",
    padding: "12px",
    height: "60px",
  };
  const actionColWidth = "150px";

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
      <h1>Orders</h1>

      <div style={{ marginBottom: "16px" }}>
        <label>
          Sort by:
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ marginLeft: "8px", marginRight: "16px" }}
          >
            <option value="customerName">Customer</option>
            <option value="date">Date</option>
            <option value="status">Status</option>
            <option value="total">Price</option>
          </select>
        </label>
        {sortBy === "status" ? (
          <label>
            Priority:
            <select
              value={sortDir}
              onChange={(e) => setSortDir(e.target.value)}
              style={{ marginLeft: "8px" }}
            >
              <option value="desc">Processing First</option>
              <option value="asc">Executed First</option>
            </select>
          </label>
        ) : (
          <button
            onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
            style={{ padding: "6px 12px", cursor: "pointer" }}
          >
            {sortDir === "asc" ? "Ascending ↑" : "Descending ↓"}
          </button>
        )}
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={cellStyle}>Order ID</th>
            <th style={cellStyle}>Customer</th>
            <th style={cellStyle}>Date</th>
            <th style={cellStyle}>Total</th>
            <th style={cellStyle}>Status</th>
            <th style={{ ...cellStyle, width: actionColWidth }}>
              Execute Order
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((order) => (
            <tr key={order.id}>
              <td style={cellStyle}>{order.id}</td>
              <td style={cellStyle}>{order.customerName}</td>
              <td style={cellStyle}>{order.date}</td>
              <td style={cellStyle}>${order.total.toFixed(2)}</td>
              <td style={cellStyle}>{order.status}</td>
              <td
                style={{
                  ...cellStyle,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {order.status === "Processing" && (
                  <button onClick={() => handleExecute(order.id)}>
                    Execute
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
