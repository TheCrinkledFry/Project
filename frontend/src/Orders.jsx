import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Styled button
function StyledButton({
  children,
  onClick,
  type = "button",
  disabled,
  style: userStyle,
  ...rest
}) {
  const [hovered, setHovered] = useState(false);
  const baseStyle = {
    padding: "8px 12px",
    background: "white",
    border: "1px solid #007bff",
    borderRadius: "4px",
    color: "black", // text black
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    fontSize: "1rem",
    transition: "background 0.2s, color 0.2s",
    ...userStyle,
  };
  const hoverStyle = disabled
    ? {}
    : {
        background: "#007bff",
        color: "white",
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
  const [sort, setSort] = useState({ key: "date", dir: -1 });
  const [hovered, setHovered] = useState(null);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const API_BASE = "http://localhost:8080";

  useEffect(() => {
    fetch(`${API_BASE}/orders`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch orders");
        return res.json();
      })
      .then(setOrders)
      .catch(console.error);

    fetch(`${API_BASE}/discounts`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch discounts");
        return res.json();
      })
      .then(setDiscounts)
      .catch(console.error);

    const storedUserName = localStorage.getItem("userName");
    const storedUserRole = localStorage.getItem("userRole");
    if (storedUserName) setUserName(storedUserName);
    if (storedUserRole) setUserRole(storedUserRole);
  }, []);

  const handleExecute = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}/execute`, {
        method: "POST",
      });
      if (!res.ok) throw new Error(`Execution failed for order ${id}`);
      const updatedOrder = await res.json();

      setOrders((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, status: updatedOrder.status } : o,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSort = (key) => {
    setSort((s) => (s.key === key ? { key, dir: -s.dir } : { key, dir: 1 }));
  };

  const getDiscountAmount = (code) => {
    const d = discounts.find((x) => x.code === code);
    return d ? d.amount : 0;
  };

  const sortedOrders = [...orders].sort((a, b) => {
    switch (sort.key) {
      case "customer":
        return sort.dir * a.customerName.localeCompare(b.customerName);
      case "total":
        return sort.dir * ((b.total || 0) - (a.total || 0));
      case "date":
        return sort.dir * (new Date(b.date) - new Date(a.date));
      case "status":
        return sort.dir * a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  const baseStyle = {
    width: "100%",
    padding: "8px 12px",
    background: "white",
    border: "1px solid #007bff",
    borderRadius: "4px",
    color: "black", // changed to black
    cursor: "pointer",
    textAlign: "left",
    fontSize: "1rem",
    marginBottom: "8px",
    transition: "background 0.2s, color 0.2s",
  };

  const hoverStyle = {
    background: "#007bff",
    color: "white",
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    navigate("/", { replace: true });
  };

  const buttons = [
    {
      key: "home",
      label: "Home",
      action: () => {
        if (location.pathname !== "/home") {
          navigate("/home");
        }
      },
    },
    { key: "products", label: "Products", action: () => navigate("/products") },
    { key: "orders", label: "Orders", action: () => navigate("/orders") },
    { key: "logout", label: "Logout", action: handleLogout },
  ];

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "sans-serif",
        color: "black",
      }}
    >
      <aside
        style={{
          width: "220px",
          background: "#fcffc4",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          height: "calc(100vh - 15px)",
          marginBottom: "40px",
          color: "black",
        }}
      >
        <div style={{ marginBottom: "16px", textAlign: "center" }}>
          <button
            onClick={() => navigate("/home")}
            style={{
              border: "none",
              background: "none",
              padding: 0,
              cursor: "pointer",
              color: "black",
            }}
          >
            <img
              src="/shopping_cart.png"
              alt="Logo"
              style={{ width: "100px" }}
            />
          </button>
        </div>

        <nav
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          {buttons.map(({ key, label, action }) => (
            <button
              key={key}
              onClick={action}
              onMouseEnter={() => setHovered(key)}
              onMouseLeave={() => setHovered(null)}
              style={{
                ...baseStyle,
                ...(hovered === key ? hoverStyle : {}),
              }}
            >
              {label}
            </button>
          ))}
        </nav>

        <div
          style={{
            marginTop: "auto",
            padding: "10px 0",
            fontSize: "0.9rem",
            fontWeight: "bold",
            color: "black",
            textAlign: "left",
            borderTop: "1px solid #ccc",
          }}
        >
          {userRole && `Role: ${userRole}`}
        </div>
      </aside>

      <main
        style={{
          flex: 1,
          padding: "20px",
          background: "white",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          height: "100%",
          color: "black",
        }}
      >
        <h2>Orders</h2>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "1rem",
            flexWrap: "wrap",
          }}
        >
          <StyledButton onClick={() => toggleSort("customer")}>
            Customer{" "}
            {sort.key === "customer" && (sort.dir === 1 ? "A→Z" : "Z→A")}
          </StyledButton>
          <StyledButton onClick={() => toggleSort("date")}>
            Date{" "}
            {sort.key === "date" &&
              (sort.dir === 1 ? "Oldest First" : "Newest First")}
          </StyledButton>
          <StyledButton onClick={() => toggleSort("total")}>
            Total{" "}
            {sort.key === "total" &&
              (sort.dir === 1 ? "Lowest→Highest" : "Highest→Lowest")}
          </StyledButton>
          <StyledButton onClick={() => toggleSort("status")}>
            Status{" "}
            {sort.key === "status" &&
              (sort.dir === 1 ? "Processing" : "Executed")}
          </StyledButton>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {sortedOrders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            sortedOrders.map((o) => {
              const discountAmount = getDiscountAmount(o.discountCode);
              const origTotal = o.total || 0;
              const discount =
                discountAmount > 0
                  ? parseFloat(
                      (origTotal * (1 - discountAmount / 100)).toFixed(2),
                    )
                  : null;

              return (
                <div
                  key={o.id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "1rem",
                    marginBottom: "1rem",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    color: "black",
                  }}
                >
                  <p style={{ margin: 0, marginBottom: "0.5rem" }}>
                    <strong>Order #{o.id}</strong> — Customer:{" "}
                    <em>{o.customerName}</em> — Status: {o.status}
                  </p>
                  <p style={{ margin: "0.25rem 0", color: "black" }}>
                    Date: {new Date(o.date).toLocaleString()}
                  </p>
                  <StyledButton
                    onClick={() => handleExecute(o.id)}
                    disabled={o.status !== "Processing"}
                    style={{ marginBottom: "0.5rem" }}
                  >
                    Execute
                  </StyledButton>
                  <ul style={{ marginTop: "0.5rem", paddingLeft: "1.25rem" }}>
                    {(o.items || []).map((item, idx) => (
                      <li
                        key={idx}
                        style={{ marginBottom: "0.25rem", color: "black" }}
                      >
                        {item.product?.name || `Product #${item.productId}`} ×{" "}
                        {item.quantity}
                      </li>
                    ))}
                  </ul>
                  <p
                    style={{
                      marginTop: "0.5rem",
                      fontWeight: "bold",
                      color: "black",
                    }}
                  >
                    Total: ${origTotal.toFixed(2)}
                    {discount !== null && discount !== origTotal && (
                      <>
                        {" "}
                        <span
                          style={{
                            textDecoration: "line-through",
                            color: "red",
                            marginLeft: "8px",
                            fontWeight: "normal",
                          }}
                        >
                          ${discount.toFixed(2)}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
