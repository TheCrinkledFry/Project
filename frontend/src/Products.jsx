import React, { useState } from 'react';

export default function Products() {
  const products = [
    { id: 1, name: 'Cake', img: '/productImages/cake.png', price: 10, available: true },
    { id: 2, name: 'Steak', img: '/productImages/steak.png', price: 25, available: false },
    { id: 3, name: 'Sushi', img: '/productImages/sushi.png', price: 15, available: true },
    { id: 4, name: 'Ramen', img: '/productImages/ramen.png', price: 12, available: true },
    { id: 5, name: 'Burger', img: '/productImages/burger.png', price: 8, available: false },
    { id: 6, name: 'Pizza', img: '/productImages/pizza.png', price: 14, available: true },
    { id: 7, name: 'Chicken', img: '/productImages/chicken.png', price: 11, available: true },
    { id: 8, name: 'Lasagna', img: '/productImages/lasagna.png', price: 20, available: false },
    { id: 9, name: 'Salmon', img: '/productImages/salmon.png', price: 18, available: true },
    { id: 10, name: 'Pie', img: '/productImages/pie.png', price: 9, available: true },
  ];

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState(''); // '', 'price', 'availability'

  // Filter products by search
  let filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Sort products
  if (sort === 'price') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sort === 'availability') {
    filtered = [...filtered].sort((a, b) => (a.available === b.available ? 0 : a.available ? -1 : 1));
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      {/* Controls */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '5px' }}
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort...</option>
          <option value="price">Sort by Price</option>
          <option value="availability">Sort by Availability</option>
        </select>
      </div>

      {/* Product grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '20px',
        }}
      >
        {filtered.map((p) => (
          <div key={p.id} style={{ textAlign: 'center', border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
            <img
              src={p.img}
              alt={p.name}
              style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
            />
            <p style={{ marginTop: '8px', fontWeight: 'bold' }}>{p.name}</p>
            <p>${p.price}</p>
            <p style={{ color: p.available ? 'green' : 'red' }}>
              {p.available ? 'In stock' : 'Out of stock'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
