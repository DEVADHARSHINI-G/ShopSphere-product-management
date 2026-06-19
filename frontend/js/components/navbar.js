// ═══════════════════════════════════════
// ShopSphere – Responsive Navbar
// ═══════════════════════════════════════

const Navbar = {
  render() {
    const isAuth = AppState.isAuthenticated();
    const isAdmin = AppState.isAdmin();
    const cartCount = isAuth ? 0 : AppState.getGuestCartCount(); // Will be updated async for auth users

    const navEl = document.getElementById('navbar');
    navEl.innerHTML = `
      <div class="navbar">
        <div class="navbar-inner">
          <a class="navbar-brand" onclick="Router.navigate('home')">
            <i class="fas fa-globe"></i>
            <span>ShopSphere</span>
          </a>

          <div class="navbar-links" id="navbar-links">
            <a class="nav-link" data-page="home" onclick="Router.navigate('home')">
              <i class="fas fa-home"></i> Home
            </a>
            <a class="nav-link" data-page="products" onclick="Router.navigate('products')">
              <i class="fas fa-box"></i> Products
            </a>
            <a class="nav-link" data-page="categories" onclick="Router.navigate('categories')">
              <i class="fas fa-th-large"></i> Categories
            </a>
            <a class="nav-link" data-page="about" onclick="Router.navigate('about')">
              <i class="fas fa-info-circle"></i> About
            </a>
            <a class="nav-link" data-page="contact" onclick="Router.navigate('contact')">
              <i class="fas fa-envelope"></i> Contact
            </a>
            ${isAuth ? `
              <a class="nav-link" data-page="${isAdmin ? 'admin' : 'dashboard'}" onclick="Router.navigate('${isAdmin ? 'admin' : 'dashboard'}')">
                <i class="fas fa-${isAdmin ? 'shield-alt' : 'user'}"></i> ${isAdmin ? 'Admin' : 'Dashboard'}
              </a>
            ` : ''}
          </div>

          <div class="navbar-actions">
            <button class="nav-icon-btn" id="cart-nav-btn" onclick="Router.navigate('cart')" title="Cart">
              <i class="fas fa-shopping-cart"></i>
              <span class="cart-badge" id="cart-badge" style="display: ${cartCount > 0 ? 'flex' : 'none'}">${cartCount}</span>
            </button>

            ${isAuth ? `
              <button class="nav-icon-btn" onclick="Navbar.logout()" title="Logout">
                <i class="fas fa-sign-out-alt"></i>
              </button>
            ` : `
              <a class="nav-auth-btn" onclick="Router.navigate('login')">
                <i class="fas fa-sign-in-alt"></i> Login
              </a>
            `}

            <div class="hamburger" id="hamburger" onclick="Navbar.toggleMenu()">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    `;

    this.setupScrollEffect();
    this.setActivePage(AppState.currentPage);
    this.updateCartBadge();
  },

  setActivePage(page) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.page === page);
    });
  },

  toggleMenu() {
    const hamburger = document.getElementById('hamburger');
    const links = document.getElementById('navbar-links');
    hamburger.classList.toggle('active');
    links.classList.toggle('open');
  },

  closeMenu() {
    const hamburger = document.getElementById('hamburger');
    const links = document.getElementById('navbar-links');
    if (hamburger) hamburger.classList.remove('active');
    if (links) links.classList.remove('open');
  },

  setupScrollEffect() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  },

  async updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;

    let count = 0;
    if (AppState.isAuthenticated()) {
      try {
        const result = await Api.cart.get();
        count = result.data.items.reduce((sum, item) => sum + item.quantity, 0);
      } catch (e) {
        count = 0;
      }
    } else {
      count = AppState.getGuestCartCount();
    }

    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  },

  logout() {
    AppState.clearAuth();
    Toast.success('Logged out successfully!');
    Router.navigate('home');
    this.render();
  }
};
