// ═══════════════════════════════════════
// ShopSphere – Toast Notifications
// ═══════════════════════════════════════

const Toast = {
  container: null,

  init() {
    this.container = document.getElementById('toast-container');
  },

  show(message, type = 'info', duration = 4000) {
    if (!this.container) this.init();

    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <i class="toast-icon ${icons[type] || icons.info}"></i>
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="Toast.dismiss(this)">
        <i class="fas fa-times"></i>
      </button>
    `;

    this.container.appendChild(toast);

    // Auto dismiss
    setTimeout(() => {
      this.remove(toast);
    }, duration);

    return toast;
  },

  dismiss(closeBtn) {
    const toast = closeBtn.closest('.toast');
    this.remove(toast);
  },

  remove(toast) {
    if (!toast || !toast.parentNode) return;
    toast.classList.add('removing');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  },

  success(message) { return this.show(message, 'success'); },
  error(message) { return this.show(message, 'error'); },
  warning(message) { return this.show(message, 'warning'); },
  info(message) { return this.show(message, 'info'); }
};
