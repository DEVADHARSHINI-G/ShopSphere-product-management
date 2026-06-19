// ═══════════════════════════════════════
// ShopSphere – Cart Page
// ═══════════════════════════════════════

const CartPage = {
  async render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="page-enter">
        <section class="section" style="padding-top: var(--space-2xl);">
          <div class="container">
            <div class="section-header reveal">
              <span class="section-label">Your Cart</span>
              <h2 class="section-title">Shopping Cart</h2>
            </div>
            <div id="cart-content">
              ${Spinner.render('Loading cart...')}
            </div>
          </div>
        </section>
      </div>
    `;

    this.loadCart();
    ScrollReveal.observe();
  },

  async loadCart() {
    const container = document.getElementById('cart-content');
    if (!container) return;

    try {
      let items, total;

      if (AppState.isAuthenticated()) {
        const result = await Api.cart.get();
        items = result.data.items;
        total = result.data.total;
      } else {
        items = AppState.guestCart;
        total = AppState.getGuestCartTotal();
      }

      if (!items || items.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-shopping-cart"></i>
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added any products yet.</p>
            <button class="btn btn-primary btn-lg" onclick="Router.navigate('products')">
              <i class="fas fa-shopping-bag"></i> Start Shopping
            </button>
          </div>
        `;
        return;
      }

      container.innerHTML = `
        <div class="cart-layout">
          <div class="cart-items">
            ${items.map(item => this.renderCartItem(item)).join('')}
          </div>
          <div class="cart-summary glass-card">
            <h3>Order Summary</h3>
            <div class="cart-summary-row">
              <span>Items (${items.length})</span>
              <span>$${total.toFixed(2)}</span>
            </div>
            <div class="cart-summary-row">
              <span>Shipping</span>
              <span style="color: var(--success);">Free</span>
            </div>
            <div class="cart-summary-row">
              <span>Tax</span>
              <span>$${(total * 0.08).toFixed(2)}</span>
            </div>
            <div class="cart-summary-total">
              <span>Total</span>
              <span>$${(total * 1.08).toFixed(2)}</span>
            </div>
            <button class="btn btn-primary btn-lg btn-glow" style="width:100%; margin-top: var(--space-lg);"
                    onclick="CartPage.checkout()">
              <i class="fas fa-lock"></i> Checkout
            </button>
            <button class="btn btn-secondary" style="width:100%; margin-top: var(--space-sm);"
                    onclick="CartPage.clearCart()">
              <i class="fas fa-trash"></i> Clear Cart
            </button>
          </div>
        </div>
      `;
    } catch (error) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-exclamation-circle"></i>
          <h2>Error Loading Cart</h2>
          <p>${error.message}</p>
          <button class="btn btn-primary" onclick="CartPage.loadCart()">
            <i class="fas fa-redo"></i> Retry
          </button>
        </div>
      `;
    }
  },

  renderCartItem(item) {
    const productId = item.product_id;
    const itemId = item.id;

    return `
      <div class="cart-item" data-item-id="${itemId}">
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.name}"
               onerror="this.src='https://via.placeholder.com/100x100/1a1a1a/FF1493?text=Product'">
        </div>
        <div class="cart-item-info">
          <h3>${item.name}</h3>
          <p class="price">$${item.price.toFixed(2)}</p>
          <div class="cart-item-quantity">
            <button class="qty-btn" onclick="CartPage.updateQuantity(${itemId}, ${productId}, ${item.quantity - 1})">
              <i class="fas fa-minus"></i>
            </button>
            <span style="min-width: 30px; text-align: center;">${item.quantity}</span>
            <button class="qty-btn" onclick="CartPage.updateQuantity(${itemId}, ${productId}, ${item.quantity + 1})">
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="CartPage.removeItem(${itemId}, ${productId})" title="Remove">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `;
  },

  async updateQuantity(itemId, productId, newQuantity) {
    if (newQuantity < 1) {
      this.removeItem(itemId, productId);
      return;
    }

    try {
      if (AppState.isAuthenticated()) {
        await Api.cart.update(itemId, newQuantity);
      } else {
        AppState.updateGuestCartQuantity(productId, newQuantity);
      }
      this.loadCart();
      Navbar.updateCartBadge();
    } catch (error) {
      Toast.error(error.message);
    }
  },

  async removeItem(itemId, productId) {
    try {
      if (AppState.isAuthenticated()) {
        await Api.cart.remove(itemId);
      } else {
        AppState.removeFromGuestCart(productId);
      }
      Toast.success('Item removed from cart');
      this.loadCart();
      Navbar.updateCartBadge();
    } catch (error) {
      Toast.error(error.message);
    }
  },

  async clearCart() {
    try {
      if (AppState.isAuthenticated()) {
        await Api.cart.clear();
      } else {
        AppState.clearGuestCart();
      }
      Toast.success('Cart cleared!');
      this.loadCart();
      Navbar.updateCartBadge();
    } catch (error) {
      Toast.error(error.message);
    }
  },

  async checkout() {
    if (!AppState.isAuthenticated()) {
      Toast.warning('Please log in to complete your purchase.');
      Router.navigate('login');
      return;
    }

    try {
      const result = await Api.orders.create('');
      Toast.success('Order placed successfully! 🎉');
      Navbar.updateCartBadge();
      Router.navigate('dashboard');
    } catch (error) {
      Toast.error(error.message);
    }
  }
};
