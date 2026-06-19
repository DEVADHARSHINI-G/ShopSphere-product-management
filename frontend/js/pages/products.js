// ═══════════════════════════════════════
// ShopSphere – Products Page
// ═══════════════════════════════════════

const ProductsPage = {
  currentFilters: { search: '', category: '', sort: '', page: 1 },

  async render(params = {}) {
    if (params.category) {
      this.currentFilters.category = params.category;
    }

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="page-enter">
        <section class="section" style="padding-top: var(--space-2xl);">
          <div class="container">
            <div class="section-header reveal">
              <span class="section-label">Shop</span>
              <h2 class="section-title">All Products</h2>
              <p class="section-subtitle">Browse our complete collection of premium products</p>
            </div>

            <!-- Search & Filters -->
            <div class="search-bar reveal">
              <div class="search-input-wrapper">
                <i class="fas fa-search"></i>
                <input type="text" class="form-input" id="product-search"
                       placeholder="Search products..." value="${this.currentFilters.search}"
                       oninput="ProductsPage.debounceSearch(this.value)">
              </div>
              <select class="form-input filter-select" id="category-filter"
                      onchange="ProductsPage.filterByCategory(this.value)">
                <option value="">All Categories</option>
              </select>
              <select class="form-input filter-select" id="sort-filter"
                      onchange="ProductsPage.sortProducts(this.value)">
                <option value="">Sort By</option>
                <option value="price_asc" ${this.currentFilters.sort === 'price_asc' ? 'selected' : ''}>Price: Low to High</option>
                <option value="price_desc" ${this.currentFilters.sort === 'price_desc' ? 'selected' : ''}>Price: High to Low</option>
                <option value="rating" ${this.currentFilters.sort === 'rating' ? 'selected' : ''}>Top Rated</option>
                <option value="newest" ${this.currentFilters.sort === 'newest' ? 'selected' : ''}>Newest First</option>
              </select>
            </div>

            <!-- Products Grid -->
            <div class="product-grid" id="products-grid">
              ${Spinner.render('Loading products...')}
            </div>

            <!-- Pagination -->
            <div id="products-pagination"></div>
          </div>
        </section>
      </div>
    `;

    this.loadCategories();
    this.loadProducts();
    ScrollReveal.observe();
  },

  searchTimeout: null,
  debounceSearch(value) {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.currentFilters.search = value;
      this.currentFilters.page = 1;
      this.loadProducts();
    }, 400);
  },

  filterByCategory(categoryId) {
    this.currentFilters.category = categoryId;
    this.currentFilters.page = 1;
    this.loadProducts();
  },

  sortProducts(sort) {
    this.currentFilters.sort = sort;
    this.currentFilters.page = 1;
    this.loadProducts();
  },

  async loadCategories() {
    try {
      const result = await Api.categories.getAll();
      const select = document.getElementById('category-filter');
      if (!select) return;

      result.data.categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        if (this.currentFilters.category == cat.id) option.selected = true;
        select.appendChild(option);
      });
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  },

  async loadProducts() {
    const grid = document.getElementById('products-grid');
    const paginationContainer = document.getElementById('products-pagination');
    if (!grid) return;

    grid.innerHTML = Spinner.render('Loading products...');

    try {
      const params = {};
      if (this.currentFilters.search) params.search = this.currentFilters.search;
      if (this.currentFilters.category) params.category = this.currentFilters.category;
      if (this.currentFilters.sort) params.sort = this.currentFilters.sort;
      params.page = this.currentFilters.page;
      params.limit = 12;

      const result = await Api.products.getAll(params);
      const { products, pagination } = result.data;

      if (products.length === 0) {
        grid.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <i class="fas fa-search"></i>
            <h2>No Products Found</h2>
            <p>Try adjusting your search or filter criteria</p>
            <button class="btn btn-primary" onclick="ProductsPage.clearFilters()">
              <i class="fas fa-times"></i> Clear Filters
            </button>
          </div>
        `;
        if (paginationContainer) paginationContainer.innerHTML = '';
        return;
      }

      grid.innerHTML = products.map(product => ProductCard.render(product)).join('');

      if (paginationContainer) {
        paginationContainer.innerHTML = Pagination.render(pagination, (page) => {
          this.currentFilters.page = page;
          this.loadProducts();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }

      ScrollReveal.observe();
    } catch (error) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <i class="fas fa-exclamation-circle"></i>
          <h2>Error Loading Products</h2>
          <p>${error.message}</p>
          <button class="btn btn-primary" onclick="ProductsPage.loadProducts()">
            <i class="fas fa-redo"></i> Retry
          </button>
        </div>
      `;
    }
  },

  clearFilters() {
    this.currentFilters = { search: '', category: '', sort: '', page: 1 };
    const search = document.getElementById('product-search');
    const category = document.getElementById('category-filter');
    const sort = document.getElementById('sort-filter');
    if (search) search.value = '';
    if (category) category.value = '';
    if (sort) sort.value = '';
    this.loadProducts();
  }
};
