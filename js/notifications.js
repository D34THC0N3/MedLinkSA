/* ============================================
   MedLink SA — Toast Notifications System
   ============================================ */

class NotificationManager {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.createContainer();
    });
  }

  createContainer() {
    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    document.body.appendChild(this.container);
  }

  /**
   * Show a toast notification
   * @param {string} title 
   * @param {string} message 
   * @param {string} type 'success', 'error', 'warning', 'info'
   * @param {number} duration ms before auto-close
   */
  show(title, message, type = 'info', duration = 5000) {
    if (!this.container) this.createContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Icons based on type
    const icons = {
      success: `<svg class="toast-icon text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
      error: `<svg class="toast-icon text-danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
      warning: `<svg class="toast-icon text-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
      info: `<svg class="toast-icon text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
    };

    toast.innerHTML = `
      ${icons[type]}
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="modal-close" onclick="this.parentElement.remove()" style="width:20px;height:20px;margin-top:-2px;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;

    this.container.appendChild(toast);

    if (duration > 0) {
      setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        // The CSS doesn't have slideOut, let's just fade out
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }
  }

  success(title, message) { this.show(title, message, 'success'); }
  error(title, message) { this.show(title, message, 'error'); }
  warning(title, message) { this.show(title, message, 'warning'); }
  info(title, message) { this.show(title, message, 'info'); }
}

window.notify = new NotificationManager();
