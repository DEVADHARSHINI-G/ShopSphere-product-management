// ═══════════════════════════════════════
// ShopSphere – Scroll Reveal Animation
// ═══════════════════════════════════════

const ScrollReveal = {
  observer: null,

  init() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Add staggered delay for grid children
          const delay = entry.target.dataset.revealDelay || 0;
          entry.target.style.transitionDelay = `${delay}ms`;
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
  },

  observe() {
    if (!this.observer) this.init();

    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    elements.forEach((el, index) => {
      // Set staggered delay for grid items
      if (!el.dataset.revealDelay) {
        const parent = el.closest('.product-grid, .category-grid, .stats-grid, .about-grid, .team-grid');
        if (parent) {
          const siblings = Array.from(parent.children);
          const childIndex = siblings.indexOf(el);
          el.dataset.revealDelay = childIndex * 100;
        }
      }
      this.observer.observe(el);
    });
  },

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
};
