// ═══════════════════════════════════════
// ShopSphere – About Us Page
// ═══════════════════════════════════════

const AboutPage = {
  render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="page-enter">
        <div class="about-hero reveal">
          <div class="container">
            <span class="section-label">About Us</span>
            <h1>Welcome to <span style="color: var(--color-primary);">ShopSphere</span></h1>
            <p>We're on a mission to revolutionize online shopping by delivering premium products with an exceptional shopping experience.</p>
          </div>
        </div>

        <section class="section">
          <div class="container">
            <div class="section-header reveal">
              <span class="section-label">Our Values</span>
              <h2 class="section-title">What Drives Us</h2>
            </div>
            <div class="about-grid">
              <div class="about-card reveal-scale">
                <div class="about-card-icon"><i class="fas fa-gem"></i></div>
                <h3>Quality First</h3>
                <p>Every product in our catalog is carefully curated and quality-checked to ensure you get nothing but the best.</p>
              </div>
              <div class="about-card reveal-scale">
                <div class="about-card-icon"><i class="fas fa-heart"></i></div>
                <h3>Customer Love</h3>
                <p>Our customers are at the heart of everything we do. Your satisfaction is our ultimate goal.</p>
              </div>
              <div class="about-card reveal-scale">
                <div class="about-card-icon"><i class="fas fa-rocket"></i></div>
                <h3>Innovation</h3>
                <p>We constantly push boundaries to bring you the latest products and the most seamless shopping experience.</p>
              </div>
              <div class="about-card reveal-scale">
                <div class="about-card-icon"><i class="fas fa-globe-americas"></i></div>
                <h3>Global Reach</h3>
                <p>We deliver worldwide, bringing premium products to customers in over 150 countries.</p>
              </div>
              <div class="about-card reveal-scale">
                <div class="about-card-icon"><i class="fas fa-leaf"></i></div>
                <h3>Sustainability</h3>
                <p>We're committed to eco-friendly packaging and partnering with sustainable brands.</p>
              </div>
              <div class="about-card reveal-scale">
                <div class="about-card-icon"><i class="fas fa-lock"></i></div>
                <h3>Trust & Security</h3>
                <p>Your data and transactions are protected by industry-leading security measures.</p>
              </div>
            </div>
          </div>
        </section>

        <section class="section" style="background: var(--bg-secondary);">
          <div class="container">
            <div class="section-header reveal">
              <span class="section-label">Our Team</span>
              <h2 class="section-title">Meet the Team</h2>
              <p class="section-subtitle">The talented people behind ShopSphere</p>
            </div>
            <div class="team-grid">
              <div class="team-card reveal-scale">
                <div class="team-avatar">D</div>
                <h3>Deva</h3>
                <p>Founder & CEO</p>
              </div>
              <div class="team-card reveal-scale">
                <div class="team-avatar">A</div>
                <h3>Alex Chen</h3>
                <p>Lead Developer</p>
              </div>
              <div class="team-card reveal-scale">
                <div class="team-avatar">S</div>
                <h3>Sarah Miller</h3>
                <p>UX Designer</p>
              </div>
              <div class="team-card reveal-scale">
                <div class="team-avatar">M</div>
                <h3>Mike Johnson</h3>
                <p>Marketing Head</p>
              </div>
            </div>
          </div>
        </section>

        <section class="section">
          <div class="container" style="text-align: center;">
            <div class="reveal">
              <h2 class="section-title">Ready to Start Shopping?</h2>
              <p class="section-subtitle" style="margin-bottom: var(--space-xl);">Join thousands of happy customers who trust ShopSphere for their shopping needs.</p>
              <button class="btn btn-primary btn-lg btn-glow" onclick="Router.navigate('products')">
                <i class="fas fa-shopping-bag"></i> Explore Products
              </button>
            </div>
          </div>
        </section>
      </div>
    `;

    ScrollReveal.observe();
  }
};
