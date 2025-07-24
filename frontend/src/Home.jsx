import React from 'react';
import { Link } from 'react-router-dom';

export default function Home({ children }) {
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: '200px', background: '#f4f4f4', padding: '20px' }}>
        {/* Clickable logo */}
        <div style={{ marginBottom: '30px' }}>
          <Link to="/dashboard">
            <img
              src="/shopping_cart.png"
              alt="Store Logo"
              style={{ width: '100px', cursor: 'pointer' }}
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '10px' }}>
              <Link to="/dashboard">Home</Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link to="/products">Products</Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link to="/orders">Orders</Link>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '20px' }}>
        {children || <h1>Welcome to the Store!</h1>}
      </main>
    </div>
  );
}

