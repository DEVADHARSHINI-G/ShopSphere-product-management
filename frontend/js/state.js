// ═══════════════════════════════════════
// ShopSphere – State Management
// ═══════════════════════════════════════

const AppState = {
  // --- User State ---
  user: null,
  token: null,

  // --- Cart State (for guests, stored locally) ---
  guestCart: [],

  // --- Wishlist ---
  wishlist: [],

  // --- App State ---
  currentPage: 'home',
  isLoading: false,

  // --- Initialize ---
  init() {
    // Load token
    this.token = localStorage.getItem('shopsphere_token');

    // Load user
    const savedUser = localStorage.getItem('shopsphere_user');
    if (savedUser) {
      try { this.user = JSON.parse(savedUser); } catch (e) { this.user = null; }
    }

    // Load wishlist
    const savedWishlist = localStorage.getItem('shopsphere_wishlist');
    if (savedWishlist) {
      try { this.wishlist = JSON.parse(savedWishlist); } catch (e) { this.wishlist = []; }
    }

    // Load guest cart
    const savedCart = localStorage.getItem('shopsphere_guest_cart');
    if (savedCart) {
      try { this.guestCart = JSON.parse(savedCart); } catch (e) { this.guestCart = []; }
    }
  },

  // --- Auth ---
  setAuth(user, token) {
    this.user = user;
    this.token = token;
    localStorage.setItem('shopsphere_token', token);
    localStorage.setItem('shopsphere_user', JSON.stringify(user));
  },

  clearAuth() {
    this.user = null;
    this.token = null;
    localStorage.removeItem('shopsphere_token');
    localStorage.removeItem('shopsphere_user');
  },

  isAuthenticated() {
    return !!this.token && !!this.user;
  },

  isAdmin() {
    return this.user && this.user.role === 'admin';
  },

  // --- Wishlist ---
  toggleWishlist(productId) {
    const index = this.wishlist.indexOf(productId);
    if (index > -1) {
      this.wishlist.splice(index, 1);
    } else {
      this.wishlist.push(productId);
    }
    localStorage.setItem('shopsphere_wishlist', JSON.stringify(this.wishlist));
    return this.isWishlisted(productId);
  },

  isWishlisted(productId) {
    return this.wishlist.includes(productId);
  },

  // --- Guest Cart ---
  addToGuestCart(product, quantity = 1) {
    const existing = this.guestCart.find(item => item.product_id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.guestCart.push({
        id: Date.now(),
        product_id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
        stock: product.stock
      });
    }
    this.saveGuestCart();
  },

  removeFromGuestCart(productId) {
    this.guestCart = this.guestCart.filter(item => item.product_id !== productId);
    this.saveGuestCart();
  },

  updateGuestCartQuantity(productId, quantity) {
    const item = this.guestCart.find(item => item.product_id === productId);
    if (item) {
      item.quantity = quantity;
    }
    this.saveGuestCart();
  },

  clearGuestCart() {
    this.guestCart = [];
    this.saveGuestCart();
  },

  getGuestCartTotal() {
    return this.guestCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  getGuestCartCount() {
    return this.guestCart.reduce((sum, item) => sum + item.quantity, 0);
  },

  saveGuestCart() {
    localStorage.setItem('shopsphere_guest_cart', JSON.stringify(this.guestCart));
  }
};
