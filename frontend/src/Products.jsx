import React, { useState } from 'react';

export default function Products() {

    const [products, setProducts] = useState([
    { id: 1, name: 'Cake', img: '/productImages/cake.png', price: 10,quantity: 5, available: true },
    { id: 2, name: 'Steak', img: '/productImages/steak.png', price: 25,quantity: 0, available: false },
    { id: 3, name: 'Sushi', img: '/productImages/sushi.png', price: 15,qunatity: 23, available: true },
    { id: 4, name: 'Ramen', img: '/productImages/ramen.png', price: 12,quantity: 4, available: true },
    { id: 5, name: 'Burger', img: '/productImages/burger.png', price: 8,quantity: 0, available: false },
    { id: 6, name: 'Pizza', img: '/productImages/pizza.png', price: 14,quantity: 2, available: true },
    { id: 7, name: 'Chicken', img: '/productImages/chicken.png', price: 11,quantity: 35, available: true },
    { id: 8, name: 'Lasagna', img: '/productImages/lasagna.png', price: 20,quantity: 0, available: false },
    { id: 9, name: 'Salmon', img: '/productImages/salmon.png', price: 18,quantity: 2, available: true },
    { id: 10, name: 'Pie', img: '/productImages/pie.png', price: 9,qunatity: 4, available: true },
  ]);
  
const removeProduct = (id) => {
  setProducts(products.filter((p) => p.id !== id));
};


  const imageOptions = [
  '/productImages/cake.png',
  '/productImages/steak.png',
  '/productImages/sushi.png',
  '/productImages/ramen.png',
  '/productImages/burger.png',
  '/productImages/pizza.png',
  '/productImages/chicken.png',
  '/productImages/lasagna.png',
  '/productImages/salmon.png',
  '/productImages/pie.png',
];

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);

  // Discount codes
  const [discountCodes, setDiscountCodes] = useState([]);
  const [discountInput, setDiscountInput] = useState({ code: '', percent: '' });

  // Form state for create/edit
  const [form, setForm] = useState({ name: '', img: '', price: '', quantity: '' });

  // Filter and sort logic
  let filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (sort === 'price') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sort === 'availability') {
    filtered = [...filtered].sort((a, b) =>
      (a.available === b.available ? 0 : a.available ? -1 : 1)
    );
  }

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      ...form,
      id: editingProduct ? editingProduct.id : Date.now(),
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity, 10),
      available: parseInt(form.quantity, 10) > 0,
    };

    if (editingProduct) {
      setProducts(products.map((p) => (p.id === editingProduct.id ? newProduct : p)));
      setEditingProduct(null);
    } else {
      setProducts([...products, newProduct]);
    }

    setForm({ name: '', img: '', price: '', quantity: '' });
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setForm(product);
  };

  const handleDiscountSubmit = (e) => {
    e.preventDefault();
    setDiscountCodes([...discountCodes, discountInput]);
    setDiscountInput({ code: '', percent: '' });
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      {/* Search & Sort */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort...</option>
          <option value="price">Sort by Price</option>
          <option value="availability">Sort by Availability</option>
        </select>
      </div>

      {/* Product Management Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
        <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <select
          value={form.img}
          onChange={(e) => setForm({ ...form, img: e.target.value })}
        >
        <option value="">Select an image</option>
          {imageOptions.map((imgPath) => (
            <option key={imgPath} value={imgPath}>
              {imgPath.split('/').pop()} {/* show only file name */}
            </option>
        ))}
      </select>

        
        <input placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input placeholder="Quantity" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
        <button type="submit">{editingProduct ? 'Update' : 'Add'}</button>
      </form>

      {/* Discount Code Form */}
      <form onSubmit={handleDiscountSubmit} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
        <h3>Create Discount Code</h3>
        <input placeholder="Code" value={discountInput.code} onChange={(e) => setDiscountInput({ ...discountInput, code: e.target.value })} />
        <input placeholder="Percent Off" type="number" value={discountInput.percent} onChange={(e) => setDiscountInput({ ...discountInput, percent: e.target.value })} />
        <button type="submit">Add Code</button>
      </form>

      {/* Product Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px' }}>
        {filtered.map((p) => (
          <div key={p.id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
            <img src={p.img} alt={p.name} style={{ width: '100%', height: 'auto' }} />
            <p><strong>{p.name}</strong></p>
            <p>${p.price}</p>
            <p>Qty: {p.quantity}</p>
            <p style={{ color: p.available ? 'green' : 'red' }}>{p.available ? 'In stock' : 'Out of stock'}</p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button onClick={() => startEdit(p)}>Edit</button>
              <button
                onClick={() => removeProduct(p.id)}
                style={{ color: 'white', backgroundColor: 'red' }}
              >
                Remove
              </button>
            </div>

            
          </div>
        ))}
      </div>
      
    </div>
  );
}


