import React, { useState } from 'react';

export default function Products() {
  // TODO: Replace this mock array with data fetched from the backend
  // (e.g., GET /api/products) once your API is available.
  const [products] = useState([
    { id: 1,  name: 'Cake',    img: '/productImages/cake.png',    price: 10, available: true,  quantity: 5  },
    { id: 2,  name: 'Steak',   img: '/productImages/steak.png',   price: 25, available: false, quantity: 0  },
    { id: 3,  name: 'Sushi',   img: '/productImages/sushi.png',   price: 15, available: true,  quantity: 12 },
    { id: 4,  name: 'Ramen',   img: '/productImages/ramen.png',   price: 12, available: true,  quantity: 8  },
    { id: 5,  name: 'Burger',  img: '/productImages/burger.png',  price: 8,  available: false, quantity: 0  },
    { id: 6,  name: 'Pizza',   img: '/productImages/pizza.png',   price: 14, available: true,  quantity: 20 },
    { id: 7,  name: 'Chicken', img: '/productImages/chicken.png', price: 11, available: true,  quantity: 7  },
    { id: 8,  name: 'Lasagna', img: '/productImages/lasagna.png', price: 20, available: false, quantity: 0  },
    { id: 9,  name: 'Salmon',  img: '/productImages/salmon.png',  price: 18, available: true,  quantity: 15 },
    { id: 10, name: 'Pie',     img: '/productImages/pie.png',     price: 9,  available: true,  quantity: 10 },
  ]);

  const [search, setSearch] = useState('');
  const [sort, setSort]     = useState(''); // '', 'price', or 'availability'

  // Filter by search term
  let filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Sort logic on frontend
  if (sort === 'price') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sort === 'availability') {
    filtered = [...filtered].sort((a, b) => {
      if (a.available !== b.available) {
        return a.available ? -1 : 1;
      }
      // secondary: highest quantity first
      return b.quantity - a.quantity;
    });
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '32px' }}>
      {/* Search & Sort Controls */}
      <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '8px', flex: 1 }}
        />
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          style={{ padding: '8px' }}
        >
          <option value="">Sort...</option>
          <option value="price">Sort by Price</option>
          <option value="availability">Sort by Availability</option>
        </select>
      </div>

      {/* Product Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '32px',
        }}
      >
        {filtered.map(p => (
          <div
            key={p.id}
            style={{
              textAlign: 'center',
              border: '1px solid #ccc',
              padding: '24px',
              borderRadius: '8px',
            }}
          >
            {/* TODO: Serve correct image URLs from backend */}
            <div
              style={{
                width: '100%',
                height: '220px',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '4px',
              }}
            >
              <img
                src={p.img}
                alt={p.name}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  maxWidth: '100%',
                  maxHeight: '100%',
                }}
              />
            </div>

            <p style={{ marginTop: '16px', fontWeight: 'bold', fontSize: '1.2rem' }}>
              {p.name}
            </p>
            <p style={{ margin: '12px 0' }}>${p.price.toFixed(2)}</p>

            {/* TODO: Quantity should come from backend */}
            <p style={{ marginBottom: '8px' }}>Quantity: {p.quantity}</p>

            {/* TODO: 'available' should reflect real stock status */}
            <p style={{ color: p.available ? 'green' : 'red', margin: 0 }}>
              {p.available ? 'In stock' : 'Out of stock'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

