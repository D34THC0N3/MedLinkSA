/* ============================================
   MedLink SA — Core App Logic & Global Handlers
   ============================================ */

class AppController {
  constructor() {
    this.theme = localStorage.getItem('medlink_theme') || 'dark'; // Default to dark per spec
    this.sidebarCollapsed = localStorage.getItem('medlink_sidebar_collapsed') === 'true';
    
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.applyTheme();
      this.applySidebarState();
      this.initEventListeners();
      this.initTooltips();
      this.initDropdowns();
      this.initTabs();
      this.initModals();
      this.setActiveNav();
      
      // Add page enter animation class
      this.playPageEnterTransition();
    });
  }

  // --- Theme Management ---
  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    
    // Update theme toggles if present
    const toggles = document.querySelectorAll('.theme-toggle input');
    toggles.forEach(toggle => {
      toggle.checked = this.theme === 'light';
    });
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('medlink_theme', this.theme);
    this.applyTheme();
    
    // Trigger custom event for charts/3D elements to re-render
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: this.theme } }));
  }

  // --- Sidebar Management ---
  applySidebarState() {
    const sidebar = document.querySelector('.sidebar');
    const topbar = document.querySelector('.topbar');
    const mainContent = document.querySelector('.main-content');
    
    if (!sidebar || !topbar || !mainContent) return;

    if (this.sidebarCollapsed) {
      document.documentElement.style.setProperty('--sidebar-width', 'var(--sidebar-collapsed)');
      sidebar.classList.add('collapsed');
      // Hide text in nav items
      sidebar.querySelectorAll('.nav-item-text').forEach(el => el.style.display = 'none');
      sidebar.querySelectorAll('.sidebar-section-title').forEach(el => el.style.opacity = '0');
    } else {
      document.documentElement.style.setProperty('--sidebar-width', '260px');
      sidebar.classList.remove('collapsed');
      // Show text in nav items
      setTimeout(() => {
        sidebar.querySelectorAll('.nav-item-text').forEach(el => el.style.display = 'block');
        sidebar.querySelectorAll('.sidebar-section-title').forEach(el => el.style.opacity = '1');
      }, 150); // Wait for transition
    }
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    localStorage.setItem('medlink_sidebar_collapsed', this.sidebarCollapsed);
    this.applySidebarState();
  }

  // --- Navigation Active State ---
  setActiveNav() {
    const currentPath = window.location.pathname;
    const filename = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
    
    document.querySelectorAll('.nav-item').forEach(item => {
      const href = item.getAttribute('href');
      if (href && (href.includes(filename) || (filename === 'index.html' && href === './'))) {
        item.classList.add('active');
        
        // Auto-expand sidebar if active item is hidden inside a collapsed menu (if implementing accordion menus)
      } else {
        item.classList.remove('active');
      }
    });
  }

  // --- Page Transitions ---
  playPageEnterTransition() {
    const curtain = document.getElementById('page-transition-curtain');
    if (!curtain || typeof gsap === 'undefined') {
      document.body.classList.add('page-enter');
      return;
    }

    const logo = curtain.querySelector('.transition-curtain-logo');
    const glow = curtain.querySelector('.transition-curtain-glow');

    // Make sure curtain starts covering the screen
    gsap.set(curtain, { display: 'flex', translateY: '0%' });
    gsap.set(logo, { opacity: 1, translateY: 0 });
    if (glow) gsap.set(glow, { opacity: 1 });

    // Animate out
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(curtain, { display: 'none' });
        document.body.classList.add('page-enter');
      }
    });

    tl.to(logo, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: "power2.in"
    })
    .to(curtain, {
      translateY: '-100%',
      duration: 0.6,
      ease: "power3.inOut"
    }, "-=0.1");
  }

  navigateTo(url) {
    const curtain = document.getElementById('page-transition-curtain');
    if (!curtain || typeof gsap === 'undefined') {
      document.body.classList.remove('page-enter');
      document.body.classList.add('page-exit');
      
      setTimeout(() => {
        window.location.href = url;
      }, 300); // Wait for animation to finish
      return;
    }

    gsap.set(curtain, { display: 'flex', translateY: '100%' });
    const logo = curtain.querySelector('.transition-curtain-logo');
    const glow = curtain.querySelector('.transition-curtain-glow');

    gsap.set(logo, { opacity: 0, translateY: 30 });

    const tl = gsap.timeline({
      onComplete: () => {
        window.location.href = url;
      }
    });

    tl.to(curtain, {
      translateY: '0%',
      duration: 0.6,
      ease: "power3.inOut"
    })
    .to(logo, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: "power2.out"
    }, "-=0.2");
  }

  // --- Global Event Listeners ---
  initEventListeners() {
    // Theme Toggles
    document.querySelectorAll('.theme-toggle').forEach(el => {
      el.addEventListener('change', () => this.toggleTheme());
    });

    // Sidebar Toggles
    document.querySelectorAll('[data-action="toggle-sidebar"]').forEach(btn => {
      btn.addEventListener('click', () => this.toggleSidebar());
    });

    // Intercept internal links for page transitions
    document.querySelectorAll('a').forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('#') && !link.hasAttribute('target')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          this.navigateTo(href);
        });
      }
    });
    
    // Add depth structure if not present (to satisfy design system requirement)
    if (!document.querySelector('.depth-bg')) {
      this.injectDepthSystem();
    }
  }

  // --- UI Components ---
  initTooltips() {
    // Simple CSS tooltips used mostly, but JS can handle positioning if needed
  }

  initDropdowns() {
    document.querySelectorAll('.dropdown-trigger').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = trigger.closest('.dropdown');
        
        // Close others
        document.querySelectorAll('.dropdown.active').forEach(d => {
          if (d !== dropdown) d.classList.remove('active');
        });
        
        dropdown.classList.toggle('active');
      });
    });

    // Close on outside click
    document.addEventListener('click', () => {
      document.querySelectorAll('.dropdown.active').forEach(d => d.classList.remove('active'));
    });
  }

  initTabs() {
    document.querySelectorAll('.tabs').forEach(tabGroup => {
      const tabs = tabGroup.querySelectorAll('.tab');
      const targetPrefix = tabGroup.getAttribute('data-target-prefix');
      
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          // Remove active from all tabs
          tabs.forEach(t => t.classList.remove('active'));
          // Add active to clicked
          tab.classList.add('active');
          
          // Handle content switching if target is specified
          const targetId = tab.getAttribute('data-target');
          if (targetId) {
            // Find all related panes (assuming they have a common class or we find siblings)
            const panes = document.querySelectorAll(`[id^="${targetPrefix}"]`);
            panes.forEach(pane => pane.style.display = 'none');
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
              targetPane.style.display = 'block';
              targetPane.classList.add('slide-up-enter'); // Re-trigger animation
            }
          }
        });
      });
    });
  }

  initModals() {
    document.querySelectorAll('[data-modal-target]').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const targetId = trigger.getAttribute('data-modal-target');
        const modal = document.getElementById(targetId);
        if (modal) {
          modal.classList.add('active');
        }
      });
    });

    document.querySelectorAll('.modal-close, [data-modal-close]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal-overlay');
        if (modal) {
          modal.classList.remove('active');
        }
      });
    });

    // Close on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('active');
        }
      });
    });
  }
  
  injectDepthSystem() {
    const depthHTML = `
      <div class="depth-bg">
        <div class="depth-background">
          <div class="bg-grid"></div>
        </div>
        <div class="depth-vignette"></div>
      </div>
      
      <!-- Liquid Glass SVG Filter Definition -->
      <svg style="display: none;">
        <defs>
          <filter id="liquid-refraction" x="-20%" y="-20%" width="140%" height="140%">
            <!-- Generate distortion noise -->
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
            <!-- Blur the noise slightly for smoother waves -->
            <feGaussianBlur in="noise" stdDeviation="2" result="smoothNoise" />
            <!-- Displace the background graphic using the smooth noise -->
            <feDisplacementMap in="SourceGraphic" in2="smoothNoise" scale="15" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <!-- Optional subtle specular highlight -->
            <feSpecularLighting in="smoothNoise" surfaceScale="2" specularConstant="0.8" specularExponent="30" lighting-color="#ffffff" result="specular">
              <fePointLight x="100" y="100" z="200" />
            </feSpecularLighting>
            <feComposite in="specular" in2="SourceAlpha" operator="in" result="specularLight" />
            <feComposite in="displaced" in2="specularLight" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
          </filter>
        </defs>
      </svg>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', depthHTML);
  }
}

// Global instance
window.app = new AppController();
