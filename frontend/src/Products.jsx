// src/Products.jsx

import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct } from './utils/api';

// Styled button matching Home sidebar style
function StyledButton({ children, onClick, disabled, type = 'button', style: userStyle, ...rest }) {
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

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '', price: '', quantity: '', imageUrl: '', description: '', discontinued: false
  });
  const API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(console.error);
  }, []);

  const handleAdd = async e => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      name: form.name.value.trim(),
      price: parseFloat(form.price.value),
      quantity: parseInt(form.quantity.value, 10),
      available: true,
      imageUrl: form.imageUrl.value.trim(),
      description: form.description.value.trim(),
      discontinued: false
    };

    try {
      const newProd = await createProduct(payload);
      setProducts(prev => [...prev, newProd]);
      form.reset();
    } catch (err) {
      console.error('Failed to add product:', err);
    }
  };

  const startEditing = p => {
    setEditingId(p.id);
    setEditForm({
      name: p.name || '',
      price: p.price?.toString() || '',
      quantity: p.quantity?.toString() || '',
      imageUrl: p.imageUrl || '',
      description: p.description || '',
      discontinued: p.discontinued || false
    });
  };

  const handleEditChange = e => {
    const { name, value, type, checked } = e.target;
    setEditForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    try {
      const data = {
        name: editForm.name.trim(),
        price: parseFloat(editForm.price),
        quantity: parseInt(editForm.quantity, 10),
        imageUrl: editForm.imageUrl.trim(),
        description: editForm.description.trim(),
        discontinued: !!editForm.discontinued
      };
      const updated = await updateProduct(editingId, data);
      setProducts(prev => prev.map(p => (p.id === editingId ? updated : p)));
      setEditingId(null);
    } catch (err) {
      console.error('Failed to update product:', err);
    }
  };

  const handleCancel = () => setEditingId(null);

  const filtered = products.filter(p =>
    (p.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem',
    marginTop: '1rem'
  };
  const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };
  const imgStyle = {
    width: '100%',
    height: '350px',
    objectFit: 'cover'
  };
  const cardContentStyle = { padding: '1rem', flexGrow: 1 };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Products</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <input name="name" placeholder="Name" required style={{ padding: '0.5rem' }} />
          <input name="price" type="number" step="0.01" placeholder="Price" required style={{ padding: '0.5rem' }} />
          <input name="quantity" type="number" placeholder="Qty" required style={{ padding: '0.5rem' }} />
          <input name="imageUrl" placeholder="Image URL (e.g. /images/burger.png)" required style={{ padding: '0.5rem', width: '300px' }} />
          <textarea
            name="description"
            placeholder="Description"
            style={{
              padding: '0.5rem',
              width: '250px',
              minHeight: '60px',
              resize: 'vertical'
            }}
          />
          <StyledButton type="submit">Add</StyledButton>
        </form>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '0.5rem', marginLeft: 'auto', flexGrow: 1 }}
        />
      </div>
      <div style={gridStyle}>
        {filtered.map(p => (
          <div key={p.id} style={cardStyle}>
            {editingId === p.id ? (
              <form onSubmit={handleEditSubmit} style={cardContentStyle}>
                <div style={{ marginBottom: '0.5rem' }}>
                  <label>
                    Name:{' '}
                    <input
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                      required
                      style={{ padding: '0.5rem', width: '90%' }}
                    />
                  </label>
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <label>
                    Price:{' '}
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      value={editForm.price}
                      onChange={handleEditChange}
                      required
                      style={{ padding: '0.5rem', width: '90%' }}
                    />
                  </label>
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <label>
                    Quantity:{' '}
                    <input
                      name="quantity"
                      type="number"
                      value={editForm.quantity}
                      onChange={handleEditChange}
                      required
                      style={{ padding: '0.5rem', width: '90%' }}
                    />
                  </label>
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <label>
                    Image URL:{' '}
                    <input
                      name="imageUrl"
                      value={editForm.imageUrl}
                      onChange={handleEditChange}
                      required
                      style={{ padding: '0.5rem', width: '90%' }}
                    />
                  </label>
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <label>
                    Description:{' '}
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      style={{
                        padding: '0.5rem',
                        width: '90%',
                        minHeight: '60px',
                        resize: 'vertical'
                      }}
                    />
                  </label>
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <label>
                    Discontinued:{' '}
                    <input
                      name="discontinued"
                      type="checkbox"
                      checked={!!editForm.discontinued}
                      onChange={handleEditChange}
                      style={{ marginLeft: '0.5rem' }}
                    />
                  </label>
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <StyledButton type="submit">Save</StyledButton>
                  <StyledButton type="button" onClick={handleCancel}>Cancel</StyledButton>
                </div>
              </form>
            ) : (
              <>
                <img src={`${API}${p.imageUrl}`} alt={p.name} style={imgStyle} />
                <div style={cardContentStyle}>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>{p.name}</h3>
                  <p style={{ margin: '0.25rem 0' }}>${p.price.toFixed(2)}</p>
                  <p style={{ margin: '0.25rem 0' }}>Stock: {p.quantity}</p>
                  {p.quantity === 0 && <span style={{ color: 'red', fontWeight: 'bold', display: 'block', margin: '0.5rem 0' }}>Out of Stock</span>}
                  {p.discontinued && <span style={{ color: 'red', fontWeight: 'bold', display: 'block', margin: '0.5rem 0' }}>Discontinued</span>}
                  {p.description && <p style={{ margin: '0.25rem 0', maxHeight: 100, overflowY: 'auto' }}>{p.description}</p>}
                </div>
                <div style={{ padding: '1rem', marginTop: 'auto' }}>
                  <StyledButton onClick={() => startEditing(p)}>Edit</StyledButton>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

