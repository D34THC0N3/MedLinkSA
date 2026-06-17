/* ============================================
    MedLink SA — Scroll Animations & Counters
    ============================================ */

class AnimationController {
  constructor() {
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.initScrollReveal();
      this.initCounters();
      this.initParallax();
      this.initProgressBars();
      this.initAdvancedEffects();
    });
  }

  // --- Scroll Reveal (Intersection Observer) ---
  initScrollReveal() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Optional: stop observing once revealed
          // observer.unobserve(entry.target);
        }
      });
    }, options);

    document.querySelectorAll('.scroll-reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
      observer.observe(el);
    });
  }

  // --- Animated Number Counters ---
  initCounters() {
    const options = {
      threshold: 0.5
    };

    const animateCounter = (el) => {
      const target = parseFloat(el.getAttribute('data-target'));
      const duration = 2000; // ms
      const stepTime = 20; // ms
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;
      
      const isDecimal = target % 1 !== 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          el.innerText = isDecimal ? target.toFixed(1) : target.toLocaleString();
          clearInterval(timer);
        } else {
          el.innerText = isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString();
        }
      }, stepTime);
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          animateCounter(entry.target);
        }
      });
    }, options);

    document.querySelectorAll('.counter-anim').forEach(el => observer.observe(el));
  }

  // --- Subtle Parallax for Background Elements ---
  initParallax() {
    // Only apply on desktop
    if (window.innerWidth < 1024) return;

    document.addEventListener('mousemove', (e) => {
      const mouseX = e.clientX / window.innerWidth - 0.5;
      const mouseY = e.clientY / window.innerHeight - 0.5;

      document.querySelectorAll('.parallax-el').forEach(el => {
        const speed = parseFloat(el.getAttribute('data-speed')) || 20;
        const x = mouseX * speed;
        const y = mouseY * speed;
        
        // Use transform, but keep existing transforms if any
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
    });
  }

  // --- Progress Bar Animation ---
  initProgressBars() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetWidth = bar.getAttribute('data-progress') || '0%';
          bar.style.width = targetWidth;
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.progress-bar[data-progress]').forEach(el => {
      el.style.width = '0%'; // Start at 0
      observer.observe(el);
    });
  }

  // --- Advanced Visual Effects ---
  initAdvancedEffects() {
    // Heartbeat pulse effect for the hero section
    this.initHeartbeatEffect();
    
    // Scanline effect for immersive feel
    this.initScanlineEffect();
    
    // Glitch effect for feature cards
    this.initGlitchEffect();
  }

  initHeartbeatEffect() {
    // Add subtle heartbeat animation to the hero section
    if (window.gsap) {
      gsap.to('.hero-badge-dot', {
        scale: 1.2,
        duration: 1,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      });
      
      gsap.to('.heart-group', {
        scale: 1.05,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      });
    }
  }

  initScanlineEffect() {
    // Add scanline effect to the hero visual
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
      const scanline = document.createElement('div');
      scanline.className = 'scanline';
      heroVisual.appendChild(scanline);
    }
  }

  initGlitchEffect() {
    // Add glitch effect to feature cards on hover
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        if (window.gsap) {
          gsap.to(card, {
            x: 5,
            duration: 0.1,
            yoyo: true,
            repeat: 3,
            ease: "power2.inOut"
          });
        }
      });
      
      card.addEventListener('mouseleave', () => {
        if (window.gsap) {
          gsap.to(card, {
            x: 0,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });
    });
  }
}

window.animations = new AnimationController();
