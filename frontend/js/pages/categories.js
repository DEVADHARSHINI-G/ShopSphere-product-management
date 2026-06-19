// ═══════════════════════════════════════
// ShopSphere – Categories Page
// ═══════════════════════════════════════

const CategoriesPage = {
  async render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="page-enter">
        <section class="section" style="padding-top: var(--space-2xl);">
          <div class="container">
            <div class="section-header reveal">
              <span class="section-label">Browse</span>
              <h2 class="section-title">Shop by Category</h2>
              <p class="section-subtitle">Explore our carefully curated product categories</p>
            </div>
            <div class="category-grid" id="categories-grid">
              ${Spinner.render('Loading categories...')}
            </div>
          </div>
        </section>
      </div>
    `;

    this.loadCategories();
    ScrollReveal.observe();
  },

  async loadCategories() {
    const grid = document.getElementById('categories-grid');
    try {
      const result = await Api.categories.getAll();
      const categories = result.data.categories;

      if (categories.length === 0) {
        grid.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <i class="fas fa-th-large"></i>
            <h2>No Categories Yet</h2>
            <p>Categories will appear here once added.</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = categories.map(cat => `
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
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <i class="fas fa-exclamation-circle"></i>
          <h2>Error Loading Categories</h2>
          <p>${error.message}</p>
          <button class="btn btn-primary" onclick="CategoriesPage.loadCategories()">
            <i class="fas fa-redo"></i> Retry
          </button>
        </div>
      `;
    }
  }
};
