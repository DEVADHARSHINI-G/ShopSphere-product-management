// ═══════════════════════════════════════
// ShopSphere – Home Page
// ═══════════════════════════════════════

const HomePage = {
  async render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="page-enter">
        <!-- Hero Section -->
        <section class="hero">
          <div class="container">
            <div class="hero-content">
              <div class="hero-badge">
                <i class="fas fa-sparkles"></i>
                <span>Welcome to ShopSphere</span>
              </div>
              <h1>
                Discover Premium<br>
                <span class="gradient-text">Products Online</span>
              </h1>
              <p>
                Explore our curated collection of premium products across electronics, fashion, home decor, and more. Experience shopping like never before.
              </p>
              <div class="hero-actions">
                <button class="btn btn-primary btn-lg btn-glow" onclick="Router.navigate('products')">
                  <i class="fas fa-shopping-bag"></i> Shop Now
                </button>
                <button class="btn btn-secondary btn-lg" onclick="Router.navigate('categories')">
                  <i class="fas fa-th-large"></i> Browse Categories
                </button>
              </div>
              <div class="hero-stats">
                <div class="hero-stat">
                  <h3>500+</h3>
                  <p>Premium Products</p>
                </div>
                <div class="hero-stat">
                  <h3>50k+</h3>
                  <p>Happy Customers</p>
                </div>
                <div class="hero-stat">
                  <h3>4.9★</h3>
                  <p>Average Rating</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Featured Products -->
        <section class="section">
          <div class="container">
            <div class="section-header reveal">
              <span class="section-label">Featured</span>
              <h2 class="section-title">Trending Products</h2>
              <p class="section-subtitle">Discover our most popular picks loved by thousands of customers</p>
            </div>
            <div class="product-grid" id="featured-products">
              ${Spinner.render('Loading featured products...')}
            </div>
            <div style="text-align: center; margin-top: var(--space-2xl);" class="reveal">
              <button class="btn btn-outline btn-lg" onclick="Router.navigate('products')">
                View All Products <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </section>

        <!-- Categories Section -->
        <section class="section" style="background: var(--bg-secondary);">
          <div class="container">
            <div class="section-header reveal">
              <span class="section-label">Categories</span>
              <h2 class="section-title">Shop by Category</h2>
              <p class="section-subtitle">Find exactly what you're looking for in our organized collections</p>
            </div>
            <div class="category-grid" id="home-categories">
              ${Spinner.render('Loading categories...')}
            </div>
          </div>
        </section>

        <!-- Why Choose Us -->
        <section class="section">
          <div class="container">
            <div class="section-header reveal">
              <span class="section-label">Why Us</span>
              <h2 class="section-title">Why Choose ShopSphere?</h2>
              <p class="section-subtitle">We're committed to providing the best shopping experience</p>
            </div>
            <div class="about-grid">
              <div class="about-card reveal-scale">
                <div class="about-card-icon">
                  <i class="fas fa-shipping-fast"></i>
                </div>
                <h3>Free Shipping</h3>
                <p>Free shipping on all orders over $50. Fast and reliable delivery worldwide.</p>
              </div>
              <div class="about-card reveal-scale">
                <div class="about-card-icon">
                  <i class="fas fa-shield-alt"></i>
                </div>
                <h3>Secure Payment</h3>
                <p>Your payments are protected with industry-standard encryption and security.</p>
              </div>
              <div class="about-card reveal-scale">
                <div class="about-card-icon">
                  <i class="fas fa-headset"></i>
                </div>
                <h3>24/7 Support</h3>
                <p>Our dedicated support team is always here to help you with any questions.</p>
              </div>
              <div class="about-card reveal-scale">
                <div class="about-card-icon">
                  <i class="fas fa-undo-alt"></i>
                </div>
                <h3>Easy Returns</h3>
                <p>Not satisfied? Return any product within 30 days for a full refund.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;

    this.loadFeaturedProducts();
    this.loadCategories();
    ScrollReveal.observe();
  },

  async loadFeaturedProducts() {
    const container = document.getElementById('featured-products');
    try {
      const result = await Api.products.getFeatured();
      const products = result.data.products;

      container.innerHTML = products.map(product =>
        ProductCard.render(product)
      ).join('');

      ScrollReveal.observe();
    } catch (error) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <i class="fas fa-exclamation-circle"></i>
          <h2>Unable to Load Products</h2>
          <p>${error.message}</p>
          <button class="btn btn-primary" onclick="HomePage.loadFeaturedProducts()">
            <i class="fas fa-redo"></i> Retry
          </button>
        </div>
      `;
    }
  },

  async loadCategories() {
    const container = document.getElementById('home-categories');
    try {
      const result = await Api.categories.getAll();
      const categories = result.data.categories;

      container.innerHTML = categories.map(cat => `
        <div class="category-card reveal-scale" onclick="Router.navigate('products', { category: ${cat.id} })">
          <img class="category-card-image" src="${cat.image}" alt="${cat.name}"
               onerror="this.src='https://via.placeholder.com/400x250/1a1a1a/FF1493?text=${encodeURIComponent(cat.name)}'">
          <div class="category-card-overlay">
            <h3 class="category-card-name">${cat.name}</h3>
            <span class="category-card-count">${cat.product_count} Products</span>
          </div>
        </div>
      `).join('');

      ScrollReveal.observe();
    } catch (error) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <i class="fas fa-exclamation-circle"></i>
          <h2>Unable to Load Categories</h2>
          <p>${error.message}</p>
        </div>
      `;
    }
  }
};
