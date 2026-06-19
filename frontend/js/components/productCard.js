// ═══════════════════════════════════════
// ShopSphere – Product Card Component
// ═══════════════════════════════════════

const ProductCard = {
  render(product) {
    const isWishlisted = AppState.isWishlisted(product.id);
    const stars = this.renderStars(product.rating);

    return `
      <div class="product-card reveal-scale" data-product-id="${product.id}">
        <div class="product-card-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy"
               onerror="this.src='https://via.placeholder.com/400x300/1a1a1a/FF1493?text=Product'">
          <div class="product-card-overlay">
            <button class="btn btn-primary btn-sm" onclick="ProductCard.quickView(${product.id})">
              <i class="fas fa-eye"></i> Quick View
            </button>
          </div>
        </div>
        <div class="product-card-body">
          <span class="product-card-category">${product.category_name || 'Uncategorized'}</span>
          <h3 class="product-card-name">${product.name}</h3>
          <div class="product-card-rating">
            ${stars}
            <span>(${product.rating})</span>
          </div>
          <div class="product-card-footer">
            <span class="product-card-price">$${product.price.toFixed(2)}</span>
            <div class="product-card-actions">
              <button class="wishlist-btn ${isWishlisted ? 'active' : ''}"
                      onclick="ProductCard.toggleWishlist(event, ${product.id})"
                      title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}">
                <i class="fa${isWishlisted ? 's' : 'r'} fa-heart"></i>
              </button>
              <button class="btn btn-primary btn-sm btn-icon"
                      onclick="ProductCard.addToCart(${product.id})"
                      title="Add to Cart">
                <i class="fas fa-cart-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalf) {
      stars += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars += '<i class="far fa-star"></i>';
    }
    return stars;
  },

  async quickView(productId) {
    Modal.showProduct(productId);
  },

  toggleWishlist(event, productId) {
    event.stopPropagation();
    const isNowWishlisted = AppState.toggleWishlist(productId);
    const btn = event.currentTarget;
    const icon = btn.querySelector('i');

    if (isNowWishlisted) {
      btn.classList.add('active');
      icon.className = 'fas fa-heart';
      Toast.success('Added to wishlist!');
    } else {
      btn.classList.remove('active');
      icon.className = 'far fa-heart';
      Toast.info('Removed from wishlist');
    }
  },

  async addToCart(productId) {
    try {
      if (AppState.isAuthenticated()) {
        await Api.cart.add(productId, 1);
      } else {
        // Guest cart — need product details
        const result = await Api.products.getOne(productId);
        AppState.addToGuestCart(result.data.product);
      }
      Toast.success('Added to cart!');
      Navbar.updateCartBadge();
    } catch (error) {
      Toast.error(error.message);
    }
  }
};
