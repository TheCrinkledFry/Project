// src/utils/api.js

const API_URL = process.env.REACT_APP_API_URL || '';

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('authToken');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, { headers, ...options });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw error;
  }
  return res.json();
}

export function login(email, password) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export function register(email, password, role = 'employee') {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, role })
  });
}

export function getProducts() {
  return request('/api/products');
}

export function createProduct(data) {
  return request('/api/products', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function updateProduct(id, data) {
  return request(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export function getOrders() {
  return request('/api/orders');
}

export function executeOrder(id) {
  return request(`/api/orders/${id}/execute`, {
    method: 'POST'
  });
}

export function getDiscounts() {
  return request('/api/discounts');
}

export function createDiscount(data) {
  return request('/api/discounts', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

