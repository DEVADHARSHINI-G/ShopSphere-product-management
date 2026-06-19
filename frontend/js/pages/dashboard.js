// ═══════════════════════════════════════
// ShopSphere – User Dashboard Page
// ═══════════════════════════════════════

const DashboardPage = {
  async render() {
    if (!AppState.isAuthenticated()) {
      Toast.warning('Please log in to access your dashboard.');
      Router.navigate('login');
      return;
    }

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="page-enter">
        <div class="dashboard-page">
          <div class="container">
            <div class="dashboard-header reveal">
              <h1><i class="fas fa-user-circle" style="color: var(--color-primary);"></i> My Dashboard</h1>
              <p>Welcome back, <strong>${AppState.user.name}</strong>!</p>
            </div>

            <!-- User Info -->
            <div class="stats-grid">
              <div class="stat-card reveal-scale">
                <div class="stat-card-icon">
                  <i class="fas fa-user"></i>
                </div>
                <h3>${AppState.user.name}</h3>
                <p>${AppState.user.email}</p>
              </div>
              <div class="stat-card reveal-scale">
                <div class="stat-card-icon">
                  <i class="fas fa-shopping-bag"></i>
                </div>
                <h3 id="user-order-count">-</h3>
                <p>Total Orders</p>
              </div>
              <div class="stat-card reveal-scale">
                <div class="stat-card-icon">
                  <i class="fas fa-heart"></i>
                </div>
                <h3>${AppState.wishlist.length}</h3>
                <p>Wishlist Items</p>
              </div>
            </div>

            <!-- Orders -->
            <div class="dashboard-section reveal">
              <h2><i class="fas fa-receipt"></i> Order History</h2>
              <div id="user-orders">
                ${Spinner.render('Loading orders...')}
              </div>
            </div>

            <!-- Wishlist -->
            <div class="dashboard-section reveal">
              <h2><i class="fas fa-heart"></i> My Wishlist</h2>
              <div id="user-wishlist">
                ${Spinner.render('Loading wishlist...')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.loadOrders();
    this.loadWishlist();
    ScrollReveal.observe();
  },

  async loadOrders() {
    const container = document.getElementById('user-orders');
    const countEl = document.getElementById('user-order-count');
    if (!container) return;

    try {
      const result = await Api.orders.getAll();
      const orders = result.data.orders;

      if (countEl) countEl.textContent = orders.length;

      if (orders.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-receipt"></i>
            <h2>No Orders Yet</h2>
            <p>Your orders will appear here after you make a purchase.</p>
            <button class="btn btn-primary" onclick="Router.navigate('products')">
              <i class="fas fa-shopping-bag"></i> Start Shopping
            </button>
          </div>
        `;
        return;
      }

      container.innerHTML = `
        <div style="overflow-x: auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${orders.map(order => `
                <tr>
                  <td>#${order.id}</td>
                  <td>${order.items.length} item(s)</td>
                  <td style="color: var(--color-primary); font-weight: 600;">$${order.total.toFixed(2)}</td>
                  <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                  <td>${new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } catch (error) {
      container.innerHTML = `<p style="color: var(--error);">${error.message}</p>`;
    }
  },

  async loadWishlist() {
    const container = document.getElementById('user-wishlist');
    if (!container) return;

    if (AppState.wishlist.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="far fa-heart"></i>
          <h2>Wishlist is Empty</h2>
          <p>Save products you love by clicking the heart icon.</p>
        </div>
      `;
      return;
    }

    try {
      const result = await Api.products.getAll({ limit: 100 });
      const allProducts = result.data.products;
      const wishlistProducts = allProducts.filter(p => AppState.isWishlisted(p.id));

      if (wishlistProducts.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <i class="far fa-heart"></i>
            <h2>Wishlist is Empty</h2>
            <p>Save products you love by clicking the heart icon.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = `
        <div class="product-grid">
          ${wishlistProducts.map(product => ProductCard.render(product)).join('')}
        </div>
      `;

      ScrollReveal.observe();
    } catch (error) {
      container.innerHTML = `<p style="color: var(--error);">${error.message}</p>`;
    }
  }
};
