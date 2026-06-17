/* ============================================
   MedLink SA — Authentication System
   ============================================ */

class AuthManager {
  constructor() {
    this.currentUser = this.getStoredUser();
    this.listeners = [];
  }

  // Get currently logged in user
  getStoredUser() {
    const userStr = localStorage.getItem('medlink_auth_user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch (_error) {
      localStorage.removeItem('medlink_auth_user');
      return null;
    }
  }

  // Check if logged in
  isAuthenticated() {
    return this.currentUser !== null;
  }

  // Get current user role
  getRole() {
    return this.currentUser ? this.currentUser.role : null;
  }

  // Subscribe to auth changes
  onChange(callback) {
    this.listeners.push(callback);
  }

  notifyListeners() {
    this.listeners.forEach(cb => cb(this.currentUser));
  }

  /**
   * Login user
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        const user = window.db.getUserByEmail(email);
        
        if (user && user.password === password) {
          // Remove password from stored session data
          const sessionUser = { ...user };
          delete sessionUser.password;
          
          this.currentUser = sessionUser;
          localStorage.setItem('medlink_auth_user', JSON.stringify(sessionUser));
          this.notifyListeners();
          
          resolve({ success: true, user: sessionUser });
        } else {
          reject({ success: false, message: 'Invalid email or password' });
        }
      }, 800);
    });
  }

  /**
   * Simulate 2FA Verification
   */
  async verify2FA(code) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (code.length === 6) { // Any 6 digit code works for demo
          resolve({ success: true });
        } else {
          reject({ success: false, message: 'Invalid verification code' });
        }
      }, 500);
    });
  }

  /**
   * Logout user
   */
  logout() {
    this.currentUser = null;
    localStorage.removeItem('medlink_auth_user');
    this.notifyListeners();
    // Redirect to the public landing page from protected areas.
    const currentPath = window.location.pathname;
    if (!currentPath.endsWith('login.html') && !currentPath.endsWith('index.html') && currentPath !== '/') {
      const depth = currentPath.split('/').filter(p => p.length > 0 && p !== 'serenity-health-3d').length;
      const prefix = depth > 1 ? '../' : './';
      window.location.href = `${prefix}index.html`;
    }
  }

  /**
   * Register new user (Simulated)
   */
  async register(userData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = window.db.addRecord('users', {
          ...userData,
          verified: userData.role === 'patient' // Patients auto-verified, others need admin verification
        });
        
        resolve({ success: true, user: newUser });
      }, 1000);
    });
  }

  /**
   * Route user based on their role
   */
  routeToDashboard() {
    if (!this.isAuthenticated()) return;
    
    const role = this.getRole();
    const currentPath = window.location.pathname;
    
    // Simple routing logic based on relative paths
    // Assumes we are at root or 1 level deep
    let prefix = './';
    if (currentPath.includes('/patient/') || 
        currentPath.includes('/doctor/') || 
        currentPath.includes('/pharmacy/') || 
        currentPath.includes('/hospital/') || 
        currentPath.includes('/admin/')) {
      prefix = '../';
    }

    const routes = {
      'patient': `${prefix}patient/dashboard.html`,
      'doctor': `${prefix}doctor/dashboard.html`,
      'specialist': `${prefix}doctor/dashboard.html`,
      'pharmacy': `${prefix}pharmacy/dashboard.html`,
      'hospital': `${prefix}hospital/dashboard.html`,
      'admin': `${prefix}admin/dashboard.html`
    };

    if (routes[role]) {
      window.location.href = routes[role];
    } else {
      console.error(`Unknown role: ${role}`);
    }
  }

  /**
   * Require Authentication for a page
   * Call this at the top of protected pages
   * @param {string[]} allowedRoles Array of roles that can access this page
   */
  requireAuth(allowedRoles = []) {
    if (!this.isAuthenticated()) {
      console.warn('Unauthorized access attempt. Redirecting to login.');
      const currentPath = window.location.pathname;
      const depth = currentPath.split('/').filter(p => p.length > 0 && p !== 'serenity-health-3d').length;
      const prefix = depth > 1 ? '../' : './';
      window.location.replace(`${prefix}index.html`);
      return false;
    }

    const role = this.getRole();
    const effectiveAllowedRoles = allowedRoles.includes('doctor') ? [...allowedRoles, 'specialist'] : allowedRoles;

    if (effectiveAllowedRoles.length > 0 && !effectiveAllowedRoles.includes(role)) {
      console.warn(`Role ${this.getRole()} not authorized for this page.`);
      this.routeToDashboard(); // Route back to their own dashboard
      return false;
    }

    const user = this.currentUser;
    const providerRoles = ['doctor', 'specialist', 'pharmacy', 'hospital'];
    if (providerRoles.includes(role) && user.verified === false) {
      console.warn(`Role ${role} is not verified. Redirecting to public landing page.`);
      const currentPath = window.location.pathname;
      const depth = currentPath.split('/').filter(p => p.length > 0 && p !== 'serenity-health-3d').length;
      const prefix = depth > 1 ? '../' : './';
      window.location.replace(`${prefix}index.html`);
      return false;
    }

    return true;
  }
}

// Global instance
window.auth = new AuthManager();

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  // Update UI elements based on auth state (e.g. login/logout buttons in topbar)
  updateAuthUI();
  
  // Handle logout buttons
  document.querySelectorAll('[data-action="logout"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.auth.logout();
    });
  });
});

function updateAuthUI() {
  const user = window.auth.getStoredUser();
  
  // Update username displays
  document.querySelectorAll('.current-user-name').forEach(el => {
    if (user) {
      if (user.firstName) {
        el.textContent = `${user.title || ''} ${user.firstName} ${user.lastName}`.trim();
      } else {
        el.textContent = user.name || user.email;
      }
    }
  });
  
  // Update avatar displays
  document.querySelectorAll('.current-user-avatar').forEach(el => {
    if (user && user.avatar) {
      el.textContent = user.avatar;
    }
  });

  // Update role displays
  document.querySelectorAll('.current-user-role').forEach(el => {
    if (user && user.role) {
      el.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    }
  });
}
