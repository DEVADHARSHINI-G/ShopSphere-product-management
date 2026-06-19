// ═══════════════════════════════════════
// ShopSphere – Login Page
// ═══════════════════════════════════════

const LoginPage = {
  render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="page-enter">
        <div class="auth-page">
          <div class="auth-card">
            <div class="auth-header">
              <h1><i class="fas fa-sign-in-alt" style="color: var(--color-primary);"></i> Welcome Back</h1>
              <p>Sign in to your ShopSphere account</p>
            </div>
            <form id="login-form" onsubmit="LoginPage.handleSubmit(event)">
              <div class="form-group">
                <label class="form-label" for="login-email">Email Address</label>
                <input type="email" class="form-input" id="login-email" placeholder="Enter your email" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="login-password">Password</label>
                <input type="password" class="form-input" id="login-password" placeholder="Enter your password" required>
              </div>
              <button type="submit" class="btn btn-primary btn-lg btn-glow" style="width: 100%;" id="login-btn">
                <i class="fas fa-sign-in-alt"></i> Sign In
              </button>
            </form>
            <div class="auth-footer">
              Don't have an account? <a onclick="Router.navigate('register')">Create one</a>
            </div>
            <div style="margin-top: var(--space-lg); padding: var(--space-md); background: var(--bg-glass); border-radius: var(--radius-sm); font-size: 0.8rem;">
              <p style="color: var(--text-tertiary); margin-bottom: var(--space-sm);">Demo Credentials:</p>
              <p style="color: var(--text-secondary);">Admin: admin@shopsphere.com / Admin@123</p>
              <p style="color: var(--text-secondary);">User: deva@shopsphere.com / User@123</p>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async handleSubmit(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('login-btn');

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';

    try {
      const result = await Api.auth.login(email, password);
      AppState.setAuth(result.data.user, result.data.token);

      Toast.success(`Welcome back, ${result.data.user.name}!`);
      Navbar.render();

      if (result.data.user.role === 'admin') {
        Router.navigate('admin');
      } else {
        Router.navigate('dashboard');
      }
    } catch (error) {
      Toast.error(error.message);
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
    }
  }
};
