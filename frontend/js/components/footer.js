// ═══════════════════════════════════════
// ShopSphere – Footer Component
// ═══════════════════════════════════════

const Footer = {
  render() {
    const footerEl = document.getElementById('footer');
    footerEl.innerHTML = `
      <div class="site-footer">
        <p class="footer-text">
          Created by <span>Deva</span> <span class="footer-heart">❤️</span>
        </p>
      </div>
    `;
  }
};
