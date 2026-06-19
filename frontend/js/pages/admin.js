// ═══════════════════════════════════════
// ShopSphere – Admin Dashboard Page
// ═══════════════════════════════════════

const AdminPage = {
  activeTab: 'overview',

  async render() {
    if (!AppState.isAuthenticated() || !AppState.isAdmin()) {
      Toast.warning('Admin access required.');
      Router.navigate('login');
      return;
    }

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="page-enter">
        <div class="dashboard-page">
          <div class="container">
            <div class="dashboard-header reveal">
              <h1><i class="fas fa-shield-alt" style="color: var(--color-primary);"></i> Admin Dashboard</h1>
              <p>Manage your store, products, and orders</p>
            </div>

            <div class="admin-tabs reveal">
              <button class="admin-tab ${this.activeTab === 'overview' ? 'active' : ''}"
                      onclick="AdminPage.switchTab('overview')">
                <i class="fas fa-chart-bar"></i> Overview
              </button>
              <button class="admin-tab ${this.activeTab === 'products' ? 'active' : ''}"
                      onclick="AdminPage.switchTab('products')">
                <i class="fas fa-box"></i> Products
              </button>
              <button class="admin-tab ${this.activeTab === 'categories' ? 'active' : ''}"
                      onclick="AdminPage.switchTab('categories')">
                <i class="fas fa-th-large"></i> Categories
              </button>
              <button class="admin-tab ${this.activeTab === 'orders' ? 'active' : ''}"
                      onclick="AdminPage.switchTab('orders')">
                <i class="fas fa-receipt"></i> Orders
              </button>
              <button class="admin-tab ${this.activeTab === 'users' ? 'active' : ''}"
                      onclick="AdminPage.switchTab('users')">
                <i class="fas fa-users"></i> Users
              </button>
              <button class="admin-tab ${this.activeTab === 'messages' ? 'active' : ''}"
                      onclick="AdminPage.switchTab('messages')">
                <i class="fas fa-envelope"></i> Messages
              </button>
            </div>

            <div id="admin-content">
              ${Spinner.render('Loading...')}
            </div>
          </div>
        </div>
      </div>
    `;

    this.loadTab();
    ScrollReveal.observe();
  },

  switchTab(tab) {
    this.activeTab = tab;
    document.querySelectorAll('.admin-tab').forEach(t => {
      t.classList.toggle('active', t.textContent.toLowerCase().includes(tab));
    });
    this.loadTab();
  },

  async loadTab() {
    const content = document.getElementById('admin-content');
    content.innerHTML = Spinner.render('Loading...');

    switch (this.activeTab) {
      case 'overview': await this.loadOverview(content); break;
      case 'products': await this.loadProducts(content); break;
      case 'categories': await this.loadCategories(content); break;
      case 'orders': await this.loadOrders(content); break;
      case 'users': await this.loadUsers(content); break;
      case 'messages': await this.loadMessages(content); break;
    }
  },

  async loadOverview(container) {
    try {
      const result = await Api.admin.getStats();
      const { stats, recentOrders, topProducts, ordersByStatus } = result.data;

      container.innerHTML = `
        <div class="stats-grid">
          <div class="stat-card reveal-scale">
            <div class="stat-card-icon"><i class="fas fa-dollar-sign"></i></div>
            <h3>$${stats.totalRevenue.toFixed(2)}</h3>
            <p>Total Revenue</p>
          </div>
          <div class="stat-card reveal-scale">
            <div class="stat-card-icon"><i class="fas fa-shopping-bag"></i></div>
            <h3>${stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
          <div class="stat-card reveal-scale">
            <div class="stat-card-icon"><i class="fas fa-box"></i></div>
            <h3>${stats.totalProducts}</h3>
            <p>Products</p>
          </div>
          <div class="stat-card reveal-scale">
            <div class="stat-card-icon"><i class="fas fa-users"></i></div>
            <h3>${stats.totalUsers}</h3>
            <p>Users</p>
          </div>
          <div class="stat-card reveal-scale">
            <div class="stat-card-icon"><i class="fas fa-th-large"></i></div>
            <h3>${stats.totalCategories}</h3>
            <p>Categories</p>
          </div>
          <div class="stat-card reveal-scale">
            <div class="stat-card-icon"><i class="fas fa-envelope"></i></div>
            <h3>${stats.totalMessages}</h3>
            <p>Messages</p>
          </div>
        </div>

        <div class="dashboard-section">
          <h2>Recent Orders</h2>
          ${recentOrders.length > 0 ? `
            <div style="overflow-x: auto;">
              <table class="data-table">
                <thead>
                  <tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr>
                </thead>
                <tbody>
                  ${recentOrders.map(order => `
                    <tr>
                      <td>#${order.id}</td>
                      <td>${order.user_name}</td>
                      <td>${order.items.length} item(s)</td>
                      <td style="color:var(--color-primary);font-weight:600">$${order.total.toFixed(2)}</td>
                      <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : '<p style="color:var(--text-tertiary)">No orders yet.</p>'}
        </div>

        <div class="dashboard-section">
          <h2>Top Rated Products</h2>
          <div class="product-grid">
            ${topProducts.map(p => `
              <div class="glass-card" style="padding: var(--space-md); display:flex; gap:var(--space-md); align-items:center;">
                <img src="${p.image}" alt="${p.name}" style="width:60px;height:60px;border-radius:var(--radius-sm);object-fit:cover"
                     onerror="this.src='https://via.placeholder.com/60/1a1a1a/FF1493?text=P'">
                <div>
                  <h4 style="font-size:0.9rem">${p.name}</h4>
                  <p style="color:var(--color-primary);font-weight:600">$${p.price.toFixed(2)} · ★${p.rating}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      ScrollReveal.observe();
    } catch (error) {
      container.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-circle"></i><h2>Error</h2><p>${error.message}</p></div>`;
    }
  },

  async loadProducts(container) {
    try {
      const result = await Api.products.getAll({ limit: 100 });
      const products = result.data.products;

      container.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-lg);">
          <h2 style="margin:0;">Products (${products.length})</h2>
          <button class="btn btn-primary" onclick="AdminPage.showProductForm()">
            <i class="fas fa-plus"></i> Add Product
          </button>
        </div>
        <div style="overflow-x:auto;">
          <table class="data-table">
            <thead><tr><th>Image</th><th>Name</th><th>Price</th><th>Stock</th><th>Rating</th><th>Actions</th></tr></thead>
            <tbody>
              ${products.map(p => `
                <tr>
                  <td><img src="${p.image}" style="width:40px;height:40px;border-radius:6px;object-fit:cover"
                       onerror="this.src='https://via.placeholder.com/40/1a1a1a/FF1493?text=P'"></td>
                  <td>${p.name}</td>
                  <td style="color:var(--color-primary);font-weight:600">$${p.price.toFixed(2)}</td>
                  <td>${p.stock}</td>
                  <td>★${p.rating}</td>
                  <td>
                    <button class="btn btn-sm btn-secondary" onclick="AdminPage.showProductForm(${p.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="AdminPage.deleteProduct(${p.id})"><i class="fas fa-trash"></i></button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } catch (error) {
      container.innerHTML = `<div class="empty-state"><p>${error.message}</p></div>`;
    }
  },

  async loadCategories(container) {
    try {
      const result = await Api.categories.getAll();
      const categories = result.data.categories;

      container.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-lg);">
          <h2 style="margin:0;">Categories (${categories.length})</h2>
          <button class="btn btn-primary" onclick="AdminPage.showCategoryForm()">
            <i class="fas fa-plus"></i> Add Category
          </button>
        </div>
        <div style="overflow-x:auto;">
          <table class="data-table">
            <thead><tr><th>Image</th><th>Name</th><th>Description</th><th>Products</th><th>Actions</th></tr></thead>
            <tbody>
              ${categories.map(c => `
                <tr>
                  <td><img src="${c.image}" style="width:40px;height:40px;border-radius:6px;object-fit:cover"
                       onerror="this.src='https://via.placeholder.com/40/1a1a1a/FF1493?text=C'"></td>
                  <td>${c.name}</td>
                  <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${c.description || '-'}</td>
                  <td>${c.product_count}</td>
                  <td>
                    <button class="btn btn-sm btn-secondary" onclick="AdminPage.showCategoryForm(${c.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="AdminPage.deleteCategory(${c.id})"><i class="fas fa-trash"></i></button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } catch (error) {
      container.innerHTML = `<div class="empty-state"><p>${error.message}</p></div>`;
    }
  },

  async loadOrders(container) {
    try {
      const result = await Api.orders.getAll();
      const orders = result.data.orders;

      container.innerHTML = `
        <h2>All Orders (${orders.length})</h2>
        ${orders.length === 0 ? '<p style="color:var(--text-tertiary)">No orders yet.</p>' : `
          <div style="overflow-x:auto;">
            <table class="data-table">
              <thead><tr><th>ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                ${orders.map(order => `
                  <tr>
                    <td>#${order.id}</td>
                    <td>${order.user_name || 'User #' + order.user_id}</td>
                    <td>${order.items.length} item(s)</td>
                    <td style="color:var(--color-primary);font-weight:600">$${order.total.toFixed(2)}</td>
                    <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                    <td>${new Date(order.created_at).toLocaleDateString()}</td>
                    <td>
                      <select class="form-input" style="padding:6px;font-size:0.8rem;width:auto;"
                              onchange="AdminPage.updateOrderStatus(${order.id}, this.value)">
                        ${['pending','processing','shipped','delivered','cancelled'].map(s =>
                          `<option value="${s}" ${order.status === s ? 'selected' : ''}>${s}</option>`
                        ).join('')}
                      </select>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      `;
    } catch (error) {
      container.innerHTML = `<div class="empty-state"><p>${error.message}</p></div>`;
    }
  },

  async loadUsers(container) {
    try {
      const result = await Api.admin.getUsers();
      const users = result.data.users;

      container.innerHTML = `
        <h2>Users (${users.length})</h2>
        <div style="overflow-x:auto;">
          <table class="data-table">
            <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              ${users.map(u => `
                <tr>
                  <td>#${u.id}</td>
                  <td>${u.name}</td>
                  <td>${u.email}</td>
                  <td><span class="status-badge ${u.role === 'admin' ? 'status-shipped' : 'status-delivered'}">${u.role}</span></td>
                  <td>${new Date(u.created_at).toLocaleDateString()}</td>
                  <td>
                    ${u.id !== AppState.user.id ? `
                      <button class="btn btn-sm btn-danger" onclick="AdminPage.deleteUser(${u.id})">
                        <i class="fas fa-trash"></i>
                      </button>
                    ` : '<span style="color:var(--text-muted)">You</span>'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } catch (error) {
      container.innerHTML = `<div class="empty-state"><p>${error.message}</p></div>`;
    }
  },

  async loadMessages(container) {
    try {
      const result = await Api.contact.getAll();
      const messages = result.data.messages;

      container.innerHTML = `
        <h2>Contact Messages (${messages.length})</h2>
        ${messages.length === 0 ? '<p style="color:var(--text-tertiary)">No messages yet.</p>' : `
          <div style="display:flex;flex-direction:column;gap:var(--space-md);">
            ${messages.map(msg => `
              <div class="glass-card" style="padding:var(--space-lg);">
                <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-sm);">
                  <strong>${msg.name}</strong>
                  <span style="color:var(--text-tertiary);font-size:0.8rem">${new Date(msg.created_at).toLocaleString()}</span>
                </div>
                <p style="color:var(--color-primary);font-size:0.85rem;margin-bottom:var(--space-xs)">${msg.email}</p>
                <h4 style="margin-bottom:var(--space-sm)">${msg.subject}</h4>
                <p style="color:var(--text-secondary);font-size:0.9rem">${msg.message}</p>
              </div>
            `).join('')}
          </div>
        `}
      `;
    } catch (error) {
      container.innerHTML = `<div class="empty-state"><p>${error.message}</p></div>`;
    }
  },

  // --- Product Form ---
  async showProductForm(productId = null) {
    let product = null;
    if (productId) {
      try {
        const result = await Api.products.getOne(productId);
        product = result.data.product;
      } catch (e) {
        Toast.error('Failed to load product');
        return;
      }
    }

    let categories = [];
    try {
      const result = await Api.categories.getAll();
      categories = result.data.categories;
    } catch (e) {}

    const overlay = document.createElement('div');
    overlay.className = 'admin-form-overlay';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    overlay.innerHTML = `
      <div class="admin-form-modal">
        <h2>${product ? 'Edit Product' : 'Add Product'}</h2>
        <form onsubmit="AdminPage.submitProduct(event, ${productId})">
          <div class="form-group">
            <label class="form-label">Name *</label>
            <input class="form-input" id="admin-product-name" value="${product?.name || ''}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea class="form-input" id="admin-product-desc">${product?.description || ''}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Price *</label>
            <input type="number" step="0.01" class="form-input" id="admin-product-price" value="${product?.price || ''}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Image URL</label>
            <input class="form-input" id="admin-product-image" value="${product?.image || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Category</label>
            <select class="form-input" id="admin-product-category">
              <option value="">Select Category</option>
              ${categories.map(c => `<option value="${c.id}" ${product?.category_id == c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Stock</label>
            <input type="number" class="form-input" id="admin-product-stock" value="${product?.stock ?? 0}">
          </div>
          <div class="form-group">
            <label class="form-label">Rating</label>
            <input type="number" step="0.1" min="0" max="5" class="form-input" id="admin-product-rating" value="${product?.rating ?? 0}">
          </div>
          <div class="admin-form-actions">
            <button type="button" class="btn btn-secondary" onclick="this.closest('.admin-form-overlay').remove()">Cancel</button>
            <button type="submit" class="btn btn-primary">${product ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(overlay);
  },

  async submitProduct(event, productId) {
    event.preventDefault();
    const data = {
      name: document.getElementById('admin-product-name').value,
      description: document.getElementById('admin-product-desc').value,
      price: parseFloat(document.getElementById('admin-product-price').value),
      image: document.getElementById('admin-product-image').value,
      category_id: parseInt(document.getElementById('admin-product-category').value) || null,
      stock: parseInt(document.getElementById('admin-product-stock').value) || 0,
      rating: parseFloat(document.getElementById('admin-product-rating').value) || 0
    };

    try {
      if (productId) {
        await Api.products.update(productId, data);
        Toast.success('Product updated!');
      } else {
        await Api.products.create(data);
        Toast.success('Product created!');
      }
      document.querySelector('.admin-form-overlay').remove();
      this.loadTab();
    } catch (error) {
      Toast.error(error.message);
    }
  },

  async deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await Api.products.delete(id);
      Toast.success('Product deleted!');
      this.loadTab();
    } catch (error) {
      Toast.error(error.message);
    }
  },

  // --- Category Form ---
  async showCategoryForm(categoryId = null) {
    let category = null;
    if (categoryId) {
      try {
        const result = await Api.categories.getOne(categoryId);
        category = result.data.category;
      } catch (e) {
        Toast.error('Failed to load category');
        return;
      }
    }

    const overlay = document.createElement('div');
    overlay.className = 'admin-form-overlay';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    overlay.innerHTML = `
      <div class="admin-form-modal">
        <h2>${category ? 'Edit Category' : 'Add Category'}</h2>
        <form onsubmit="AdminPage.submitCategory(event, ${categoryId})">
          <div class="form-group">
            <label class="form-label">Name *</label>
            <input class="form-input" id="admin-cat-name" value="${category?.name || ''}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea class="form-input" id="admin-cat-desc">${category?.description || ''}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Image URL</label>
            <input class="form-input" id="admin-cat-image" value="${category?.image || ''}">
          </div>
          <div class="admin-form-actions">
            <button type="button" class="btn btn-secondary" onclick="this.closest('.admin-form-overlay').remove()">Cancel</button>
            <button type="submit" class="btn btn-primary">${category ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(overlay);
  },

  async submitCategory(event, categoryId) {
    event.preventDefault();
    const data = {
      name: document.getElementById('admin-cat-name').value,
      description: document.getElementById('admin-cat-desc').value,
      image: document.getElementById('admin-cat-image').value
    };

    try {
      if (categoryId) {
        await Api.categories.update(categoryId, data);
        Toast.success('Category updated!');
      } else {
        await Api.categories.create(data);
        Toast.success('Category created!');
      }
      document.querySelector('.admin-form-overlay').remove();
      this.loadTab();
    } catch (error) {
      Toast.error(error.message);
    }
  },

  async deleteCategory(id) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await Api.categories.delete(id);
      Toast.success('Category deleted!');
      this.loadTab();
    } catch (error) {
      Toast.error(error.message);
    }
  },

  async updateOrderStatus(orderId, status) {
    try {
      await Api.orders.updateStatus(orderId, status);
      Toast.success('Order status updated!');
    } catch (error) {
      Toast.error(error.message);
      this.loadTab();
    }
  },

  async deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await Api.admin.deleteUser(id);
      Toast.success('User deleted!');
      this.loadTab();
    } catch (error) {
      Toast.error(error.message);
    }
  }
};
