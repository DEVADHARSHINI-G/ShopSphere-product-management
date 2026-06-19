// ═══════════════════════════════════════
// ShopSphere – Register Page
// ═══════════════════════════════════════

const RegisterPage = {
  render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="page-enter">
        <div class="auth-page">
          <div class="auth-card">
            <div class="auth-header">
              <h1><i class="fas fa-user-plus" style="color: var(--color-primary);"></i> Create Account</h1>
              <p>Join ShopSphere and start shopping</p>
            </div>
            <form id="register-form" onsubmit="RegisterPage.handleSubmit(event)">
              <div class="form-group">
                <label class="form-label" for="register-name">Full Name</label>
                <input type="text" class="form-input" id="register-name" placeholder="Enter your full name" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="register-email">Email Address</label>
                <input type="email" class="form-input" id="register-email" placeholder="Enter your email" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="register-password">Password</label>
                <input type="password" class="form-input" id="register-password"
                       placeholder="Create a password (min 6 chars)" required
                       oninput="RegisterPage.checkPasswordStrength(this.value)">
                <div class="password-strength">
                  <div class="password-strength-bar" id="password-strength-bar"></div>
                </div>
                <p id="password-strength-text" style="font-size: 0.75rem; margin-top: 4px; color: var(--text-tertiary);"></p>
              </div>
              <div class="form-group">
                <label class="form-label" for="register-confirm">Confirm Password</label>
                <input type="password" class="form-input" id="register-confirm"
                       placeholder="Confirm your password" required>
              </div>
              <button type="submit" class="btn btn-primary btn-lg btn-glow" style="width: 100%;" id="register-btn">
                <i class="fas fa-user-plus"></i> Create Account
              </button>
            </form>
            <div class="auth-footer">
              Already have an account? <a onclick="Router.navigate('login')">Sign in</a>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  checkPasswordStrength(password) {
    const bar = document.getElementById('password-strength-bar');
    const text = document.getElementById('password-strength-text');
    if (!bar || !text) return;

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
      { width: '0%', color: 'transparent', label: '' },
      { width: '20%', color: '#FF1744', label: 'Very Weak' },
      { width: '40%', color: '#FF9100', label: 'Weak' },
      { width: '60%', color: '#FFD600', label: 'Fair' },
      { width: '80%', color: '#00E676', label: 'Strong' },
      { width: '100%', color: '#00E676', label: 'Very Strong' }
    ];

    const level = levels[strength];
    bar.style.width = level.width;
    bar.style.background = level.color;
    text.textContent = level.label;
    text.style.color = level.color;
  },

  async handleSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;
    const btn = document.getElementById('register-btn');

    if (password !== confirm) {
      Toast.error('Passwords do not match!');
      return;
    }

    if (password.length < 6) {
      Toast.error('Password must be at least 6 characters long.');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';

    try {
      const result = await Api.auth.register(name, email, password);
      AppState.setAuth(result.data.user, result.data.token);

      Toast.success('Account created successfully! 🎉');
      Navbar.render();
      Router.navigate('dashboard');
    } catch (error) {
      Toast.error(error.message);
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
    }
  }
};
