// ═══════════════════════════════════════
// ShopSphere – Loading Spinner
// ═══════════════════════════════════════

const Spinner = {
  render(text = 'Loading...') {
    return `
      <div class="spinner-container">
        <div class="spinner"></div>
        <p class="spinner-text">${text}</p>
      </div>
    `;
  },

  show(container, text = 'Loading...') {
    if (typeof container === 'string') {
      container = document.querySelector(container);
    }
    if (container) {
      container.innerHTML = this.render(text);
    }
  }
};
