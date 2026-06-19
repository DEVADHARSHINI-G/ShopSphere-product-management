// ═══════════════════════════════════════
// ShopSphere – Contact Us Page
// ═══════════════════════════════════════

const ContactPage = {
  render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="page-enter">
        <section class="section" style="padding-top: var(--space-2xl);">
          <div class="container">
            <div class="section-header reveal">
              <span class="section-label">Get in Touch</span>
              <h2 class="section-title">Contact Us</h2>
              <p class="section-subtitle">Have a question or feedback? We'd love to hear from you.</p>
            </div>

            <div class="contact-layout">
              <div class="contact-info-cards reveal-left">
                <div class="contact-info-card">
                  <div class="contact-info-icon">
                    <i class="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <h3>Our Office</h3>
                    <p>ShopSphere Office, KK Nagar<br>Madurai, Tamil Nadu, India</p>
                  </div>
                </div>
                <div class="contact-info-card">
                  <div class="contact-info-icon">
                    <i class="fas fa-envelope"></i>
                  </div>
                  <div>
                    <h3>Email Us</h3>
                    <p>devapapa64@gmail.com<br>support@shopsphere.com</p>
                  </div>
                </div>
                <div class="contact-info-card">
                  <div class="contact-info-icon">
                    <i class="fas fa-phone-alt"></i>
                  </div>
                  <div>
                    <h3>Call Us</h3>
                    <p>+91 9360981562<br>Mon-Sat: 9am - 6pm IST</p>
                  </div>
                </div>
                <div class="contact-info-card">
                  <div class="contact-info-icon">
                    <i class="fas fa-clock"></i>
                  </div>
                  <div>
                    <h3>Business Hours</h3>
                    <p>Monday - Friday: 9:00 AM - 6:00 PM<br>Saturday: 10:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>

              <div class="contact-form reveal-right">
                <h2>Send a Message</h2>
                <form id="contact-form" onsubmit="ContactPage.handleSubmit(event)">
                  <div class="form-group">
                    <label class="form-label" for="contact-name">Your Name *</label>
                    <input type="text" class="form-input" id="contact-name" placeholder="John Doe" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="contact-email">Email Address *</label>
                    <input type="email" class="form-input" id="contact-email" placeholder="john@example.com" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="contact-subject">Subject *</label>
                    <input type="text" class="form-input" id="contact-subject" placeholder="How can we help?" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="contact-message">Message *</label>
                    <textarea class="form-input" id="contact-message" placeholder="Tell us more..." rows="5" required></textarea>
                  </div>
                  <button type="submit" class="btn btn-primary btn-lg btn-glow" style="width: 100%;" id="contact-btn">
                    <i class="fas fa-paper-plane"></i> Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;

    ScrollReveal.observe();
  },

  async handleSubmit(event) {
    event.preventDefault();
    const btn = document.getElementById('contact-btn');

    const data = {
      name: document.getElementById('contact-name').value,
      email: document.getElementById('contact-email').value,
      subject: document.getElementById('contact-subject').value,
      message: document.getElementById('contact-message').value
    };

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    try {
      await Api.contact.submit(data);
      Toast.success('Message sent successfully! We\'ll get back to you soon. 🎉');
      document.getElementById('contact-form').reset();
    } catch (error) {
      Toast.error(error.message);
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    }
  }
};
