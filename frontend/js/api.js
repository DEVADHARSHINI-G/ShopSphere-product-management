// ═══════════════════════════════════════
// ShopSphere – API Client
// ═══════════════════════════════════════

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? `http://localhost:5000/api`
  : `/api`;

const Api = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    // Add auth token if available
    if (AppState.token) {
      headers['Authorization'] = `Bearer ${AppState.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          AppState.clearAuth();
          if (window.location.hash !== '#/login') {
            Toast.show('Session expired. Please log in again.', 'warning');
          }
        }
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please make sure the backend is running.');
      }
      throw error;
    }
  },

  // GET request
  get(endpoint) {
    return this.request(endpoint);
  },

  // POST request
  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  // PUT request
  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  // DELETE request
  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  },

  // --- Auth API ---
  auth: {
    login(email, password) { return Api.post('/auth/login', { email, password }); },
    register(name, email, password) { return Api.post('/auth/register', { name, email, password }); },
    getMe() { return Api.get('/auth/me'); }
  },

  // --- Products API ---
  products: {
    getAll(params = {}) {
      const query = new URLSearchParams(params).toString();
      return Api.get(`/products${query ? '?' + query : ''}`);
    },
    getOne(id) { return Api.get(`/products/${id}`); },
    getFeatured() { return Api.get('/products/featured'); },
    create(data) { return Api.post('/products', data); },
    update(id, data) { return Api.put(`/products/${id}`, data); },
    delete(id) { return Api.delete(`/products/${id}`); }
  },

  // --- Categories API ---
  categories: {
    getAll() { return Api.get('/categories'); },
    getOne(id) { return Api.get(`/categories/${id}`); },
    create(data) { return Api.post('/categories', data); },
    update(id, data) { return Api.put(`/categories/${id}`, data); },
    delete(id) { return Api.delete(`/categories/${id}`); }
  },

  // --- Cart API ---
  cart: {
    get() { return Api.get('/cart'); },
    add(product_id, quantity = 1) { return Api.post('/cart', { product_id, quantity }); },
    update(id, quantity) { return Api.put(`/cart/${id}`, { quantity }); },
    remove(id) { return Api.delete(`/cart/${id}`); },
    clear() { return Api.delete('/cart/clear'); }
  },

  // --- Orders API ---
  orders: {
    getAll() { return Api.get('/orders'); },
    getOne(id) { return Api.get(`/orders/${id}`); },
    create(shipping_address) { return Api.post('/orders', { shipping_address }); },
    updateStatus(id, status) { return Api.put(`/orders/${id}/status`, { status }); }
  },

  // --- Contact API ---
  contact: {
    submit(data) { return Api.post('/contact', data); },
    getAll() { return Api.get('/contact'); }
  },

  // --- Admin API ---
  admin: {
    getStats() { return Api.get('/admin/stats'); },
    getUsers() { return Api.get('/admin/users'); },
    deleteUser(id) { return Api.delete(`/admin/users/${id}`); }
  }
};
