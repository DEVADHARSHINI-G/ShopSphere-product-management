// ═══════════════════════════════════════
// ShopSphere – Product Detail Modal
// ═══════════════════════════════════════

const Modal = {
  overlay: null,

  init() {
    this.overlay = document.getElementById('modal-overlay');
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  },

  async showProduct(productId) {
    if (!this.overlay) this.init();

    this.overlay.classList.add('active');
    this.overlay.innerHTML = `
      <div class="modal">
        <button class="modal-close" onclick="Modal.close()">
          <i class="fas fa-times"></i>
        </button>
        <div class="modal-body">
          ${Spinner.render('Loading product...')}
        </div>
      </div>
    `;

    try {
      const result = await Api.products.getOne(productId);
      const product = result.data.product;
      const stars = ProductCard.renderStars(product.rating);

      let stockClass = 'in-stock';
      let stockText = `${product.stock} in stock`;
      if (product.stock === 0) {
        stockClass = 'out-of-stock';
        stockText = 'Out of stock';
      } else if (product.stock < 10) {
        stockClass = 'low-stock';
        stockText = `Only ${product.stock} left!`;
      }

      this.overlay.innerHTML = `
        <div class="modal">
          <button class="modal-close" onclick="Modal.close()">
            <i class="fas fa-times"></i>
          </button>
          <div class="modal-body">
            <div class="modal-product">
              <div class="modal-product-image">
                <img src="${product.image}" alt="${product.name}"
                     onerror="this.src='https://via.placeholder.com/500x400/1a1a1a/FF1493?text=Product'">
              </div>
              <div class="modal-product-info">
                <span class="product-card-category">${product.category_name || 'Uncategorized'}</span>
                <h2>${product.name}</h2>
                <div class="product-card-rating">
                  ${stars}
                  <span>(${product.rating} rating)</span>
                </div>
                <p class="modal-product-price">$${product.price.toFixed(2)}</p>
                <p class="modal-product-desc">${product.description}</p>
                <p class="modal-product-stock ${stockClass}">
                  <i class="fas fa-${product.stock > 0 ? 'check-circle' : 'times-circle'}"></i>
                  ${stockText}
                </p>
                <div class="modal-product-actions">
                  <button class="btn btn-primary btn-glow" onclick="Modal.addToCart(${product.id})"
                          ${product.stock === 0 ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ''}>
                    <i class="fas fa-cart-plus"></i> Add to Cart
                  </button>
                  <button class="btn btn-secondary" onclick="Modal.toggleWishlist(${product.id})">
                    <i class="fa${AppState.isWishlisted(product.id) ? 's' : 'r'} fa-heart"></i>
                    ${AppState.isWishlisted(product.id) ? 'Wishlisted' : 'Wishlist'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } catch (error) {
      this.overlay.innerHTML = `
        <div class="modal">
          <button class="modal-close" onclick="Modal.close()">
            <i class="fas fa-times"></i>
          </button>
          <div class="modal-body">
            <div class="empty-state">
              <i class="fas fa-exclamation-circle"></i>
              <h2>Error Loading Product</h2>
              <p>${error.message}</p>
            </div>
          </div>
        </div>
      `;
    }
  },

  async addToCart(productId) {
    try {
      if (AppState.isAuthenticated()) {
        await Api.cart.add(productId, 1);
      } else {
        const result = await Api.products.getOne(productId);
        AppState.addToGuestCart(result.data.product);
      }
      Toast.success('Added to cart!');
      Navbar.updateCartBadge();
      this.close();
    } catch (error) {
      Toast.error(error.message);
    }
  },

  toggleWishlist(productId) {
    const isNowWishlisted = AppState.toggleWishlist(productId);
    if (isNowWishlisted) {
      Toast.success('Added to wishlist!');
    } else {
      Toast.info('Removed from wishlist');
    }
    // Re-render the modal to update the button
    this.showProduct(productId);
  },

  close() {
    if (this.overlay) {
      this.overlay.classList.remove('active');
      this.overlay.innerHTML = '';
    }
  }
};
