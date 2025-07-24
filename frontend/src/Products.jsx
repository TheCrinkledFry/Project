import React from 'react';

export default function Products() {
  const products = [
    { id: 1, name: 'Product 1', img: '/productImages/cake.png' },
    { id: 2, name: 'Product 2', img: '/productImages/steak.png' },
    { id: 3, name: 'Product 3', img: '/productImages/sushi.png' },
    { id: 4, name: 'Product 4', img: '/productImages/ramen.png' },
    { id: 5, name: 'Product 5', img: '/productImages/burger.png' },
    { id: 6, name: 'Product 6', img: '/productImages/pizza.png' },
    { id: 7, name: 'Product 7', img: '/productImages/chicken.png' },
    { id: 8, name: 'Product 8', img: '/productImages/lasagna.png' },
    { id: 9, name: 'Product 9', img: '/productImages/salmon.png' },
    { id: 10, name: 'Product 10', img: '/productImages/pie.png' },
  ];

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '20px',
        }}
      >
        {products.map(p => (
          <div key={p.id} style={{ textAlign: 'center' }}>
            <img
              src={p.img}
              alt={p.name}
              style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
            />
            <p style={{ marginTop: '8px' }}>{p.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

