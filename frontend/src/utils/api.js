// src/utils/api.js
const BASE = process.env.REACT_APP_API_URL;

async function request(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {})
    },
    ...opts
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export function login(email, password) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export function getProducts(token) {
  return request('/api/products', { token });
}

export function createProduct(data, token) {
  return fetch(`${BASE}/api/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(data)
  }).then(r => r.json());
}

export function getDiscounts(token) {
  return request('/api/discounts', { token });
}

export function createDiscount(code, percent, token) {
  return request('/api/discounts', {
    method: 'POST',
    token,
    body: JSON.stringify({ code, percent })
  });
}

export function getOrders(token) {
  return request('/api/orders', { token });
}

export function executeOrder(id, token) {
  return request(`/api/orders/${id}/execute`, {
    method: 'POST',
    token
  });
}

export function updateProduct(id, data, token) {
  return request(`/api/products/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(data)
  });
}

