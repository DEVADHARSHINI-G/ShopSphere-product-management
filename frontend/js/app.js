// ═══════════════════════════════════════
// ShopSphere – Application Entry Point
// ═══════════════════════════════════════

(function() {
  'use strict';

  // Initialize the application
  function init() {
    // Initialize state (load from localStorage)
    AppState.init();

    // Initialize components
    Toast.init();
    Modal.init();
    ScrollReveal.init();

    // Render layout
    Navbar.render();
    Footer.render();

    // Initialize router (renders the first page)
    Router.init();

    // Hide loading screen
    setTimeout(() => {
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        // Remove from DOM after transition
        setTimeout(() => {
          if (loadingScreen.parentNode) {
            loadingScreen.parentNode.removeChild(loadingScreen);
          }
        }, 600);
      }
    }, 800);
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
