// ═══════════════════════════════════════
// ShopSphere – Client-Side Router
// ═══════════════════════════════════════

const Router = {
  routes: {
    'home': { page: HomePage, title: 'Home' },
    'products': { page: ProductsPage, title: 'Products' },
    'categories': { page: CategoriesPage, title: 'Categories' },
    'cart': { page: CartPage, title: 'Cart' },
    'login': { page: LoginPage, title: 'Login' },
    'register': { page: RegisterPage, title: 'Register' },
    'dashboard': { page: DashboardPage, title: 'Dashboard' },
    'admin': { page: AdminPage, title: 'Admin Dashboard' },
    'about': { page: AboutPage, title: 'About Us' },
    'contact': { page: ContactPage, title: 'Contact Us' }
  },

  currentParams: {},

  init() {
    // Listen for hash changes
    window.addEventListener('hashchange', () => this.handleRoute());
    // Handle initial route
    this.handleRoute();
  },

  navigate(page, params = {}) {
    this.currentParams = params;
    window.location.hash = `#/${page}`;
    Navbar.closeMenu();
  },

  handleRoute() {
    const hash = window.location.hash.slice(2) || 'home'; // Remove #/
    const routeName = hash.split('?')[0]; // Remove query params

    const route = this.routes[routeName];
    if (!route) {
      this.navigate('home');
      return;
    }

    // Update state
    AppState.currentPage = routeName;

    // Update page title
    document.title = `${route.title} | ShopSphere`;

    // Update active nav link
    Navbar.setActivePage(routeName);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Disconnect old observers
    ScrollReveal.disconnect();

    // Render page with transition
    const app = document.getElementById('app');
    app.classList.add('page-exit');

    setTimeout(() => {
      app.classList.remove('page-exit');
      route.page.render(this.currentParams);
      this.currentParams = {};

      // Re-initialize scroll reveal
      setTimeout(() => {
        ScrollReveal.init();
        ScrollReveal.observe();
      }, 100);
    }, 200);
  }
};
