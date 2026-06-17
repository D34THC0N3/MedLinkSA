/* ============================================
   MedLink SA — 3D Heart Loader & Interactions
   ============================================ */

class Heart3DLoader {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.heartModel = null;
    this.controls = null;
    this.mixer = null; // For animations if present in GLB
    this.clock = new THREE.Clock();
    
    // Interaction states
    this.isHovered = false;
    this.isDragging = false;
    this.targetRotation = { x: 0, y: 0 };
    this.currentRotation = { x: 0, y: 0 };
    this.dragStart = { x: 0, y: 0 };
    this.baseScale = 1;
    this.targetScale = new THREE.Vector3(1, 1, 1);
    this.currentScale = new THREE.Vector3(1, 1, 1);

    // Load Three.js dynamically if not present
    if (typeof THREE === 'undefined') {
      this.loadThreeJS().then(() => this.init()).catch((err) => {
        console.error('Failed to load ThreeJS:', err);
        const loaderOverlay = document.getElementById('global-loader');
        if (loaderOverlay) {
          loaderOverlay.style.opacity = '0';
          setTimeout(() => loaderOverlay.style.display = 'none', 500);
        }
      });
    } else {
      this.init();
    }
  }

  async loadThreeJS() {
    const scripts = [
      'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
      'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js',
      'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js'
    ];

    for (const src of scripts) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = () => reject(new Error('Failed to load script: ' + src));
        document.head.appendChild(script);
      });
    }
  }

  init() {
    // 1. Setup Scene
    this.scene = new THREE.Scene();
    
    // 2. Setup Camera
    this.camera = new THREE.PerspectiveCamera(
      45, 
      this.container.clientWidth / this.container.clientHeight, 
      0.1, 
      1000
    );
    this.camera.position.set(0, 0, 5);

    // 3. Setup Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Performance optimization
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.container.appendChild(this.renderer.domElement);

    // 4. Setup Lighting (Medical / Clean look)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1);
    dirLight1.position.set(5, 5, 5);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x0EA5E9, 0.5); // Primary medical blue tint
    dirLight2.position.set(-5, 0, 5);
    this.scene.add(dirLight2);

    const dirLight3 = new THREE.DirectionalLight(0x10B981, 0.3); // Accent emerald tint
    dirLight3.position.set(0, -5, 0);
    this.scene.add(dirLight3);

    // 5. Load Model
    const loader = new THREE.GLTFLoader();
    
    // Determine path based on current location (root or subfolder)
    const isRoot = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
    const modelPath = isRoot ? './realistic_human_heart.glb' : '../realistic_human_heart.glb';

    // Show loading progress on UI if elements exist
    const progressText = document.getElementById('loading-text');
    const progressBar = document.getElementById('loading-progress-bar');

    loader.load(
      modelPath,
      (gltf) => {
        this.heartModel = gltf.scene;
        
        // Center and scale model
        const box = new THREE.Box3().setFromObject(this.heartModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = this.camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 * Math.tan(fov * 2));
        cameraZ *= 1.5; // Zoom out a bit
        
        this.camera.position.z = cameraZ;
        
        this.heartModel.position.x = -center.x;
        this.heartModel.position.y = -center.y;
        this.heartModel.position.z = -center.z;
        
        // Wrap in a pivot object for easier rotation
        this.pivot = new THREE.Group();
        this.pivot.add(this.heartModel);
        this.scene.add(this.pivot);

        // Setup material properties for "soft tissue" look
        this.heartModel.traverse((child) => {
          if (child.isMesh) {
            child.material.roughness = 0.3;
            child.material.metalness = 0.1;
            // Add subtle rim lighting/fresnel effect if using custom shader, 
            // but for standard material we tweak specular/shininess
          }
        });

        // Start heartbeat animation
        this.startHeartbeatAnimation();

        // Setup Controls (OrbitControls handles drag rotation, pinch zoom with inertia)
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enablePan = false;
        this.controls.minDistance = cameraZ * 0.5;
        this.controls.maxDistance = cameraZ * 2;
        
        // Setup custom interactions
        this.setupInteractions();

        // Setup GSAP scroll animations
        this.initScrollAnimations();

        // Hide loader overlay if it's the initial page loader
        const loaderOverlay = document.getElementById('global-loader');
        if (loaderOverlay) {
          setTimeout(() => {
            loaderOverlay.classList.add('fade-out');
            setTimeout(() => loaderOverlay.style.display = 'none', 500);
          }, 800);
        }
      },
      (xhr) => {
        // Progress callback
        if (progressText && progressBar) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          progressText.innerText = `Loading Assets... ${percent}%`;
          progressBar.style.width = `${percent}%`;
        }
      },
      (error) => {
        console.error('Error loading 3D model:', error);
        // Hide loader anyway to not block user
        const loaderOverlay = document.getElementById('global-loader');
        if (loaderOverlay) loaderOverlay.style.display = 'none';
      }
    );

    // 6. Handle Window Resize
    window.addEventListener('resize', this.onWindowResize.bind(this));

    // 7. Start Render Loop
    this.animate();
  }

  setupInteractions() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const domElement = this.renderer.domElement;

    // Hover Interaction
    domElement.addEventListener('mousemove', (e) => {
      // Calculate mouse position in normalized device coordinates (-1 to +1)
      const rect = domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, this.camera);
      const intersects = raycaster.intersectObject(this.pivot, true);

      if (intersects.length > 0) {
        if (!this.isHovered) {
          this.isHovered = true;
          document.body.style.cursor = 'grab';
          // Subtle hover reaction: slight rotation speedup or scale
        }
      } else {
        if (this.isHovered) {
          this.isHovered = false;
          document.body.style.cursor = 'default';
        }
      }
    });

    // Click/Deform Interaction
    domElement.addEventListener('mousedown', (e) => {
      if (this.isHovered && this.pivot) {
        document.body.style.cursor = 'grabbing';
        
        // Simulate soft tissue deformation (squash effect)
        // A true vertex deformation requires modifying geometry vertices based on intersection point.
        // For simplicity and performance, we apply a squash scale to the pivot.
        
        raycaster.setFromCamera(mouse, this.camera);
        const intersects = raycaster.intersectObject(this.pivot, true);
        
        if (intersects.length > 0) {
          // Squash along the axis facing the camera
          this.targetScale.set(1.05, 1.05, 0.85); // Compress Z, expand X/Y
        }
      }
    });

    domElement.addEventListener('mouseup', () => {
      document.body.style.cursor = this.isHovered ? 'grab' : 'default';
      // Release deformation - recover naturally with spring physics
      this.targetScale.set(1, 1, 1);
    });
    
    domElement.addEventListener('mouseleave', () => {
      document.body.style.cursor = 'default';
      this.targetScale.set(1, 1, 1);
    });

    // Note: Drag and Pinch interactions are natively handled seamlessly by OrbitControls 
    // with enableDamping=true, providing smooth inertia and mobile support.
  }

  initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not loaded');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const isDesktop = window.innerWidth > 1024;

    // Define responsive targets
    const initialPos = { x: 0, y: -0.15, z: 0 };
    const initialScale = isDesktop ? 1.15 : 0.85;

    const step1Pos = isDesktop ? { x: 1.4, y: -0.1, z: -0.6 } : { x: 0, y: -0.4, z: -1.2 };
    const step1Scale = isDesktop ? 0.8 : 0.5;

    const step2Pos = isDesktop ? { x: -1.4, y: 0.15, z: -1.3 } : { x: 0, y: 0.1, z: -1.8 };
    const step2Scale = isDesktop ? 0.65 : 0.45;

    const step3Pos = isDesktop ? { x: 1.2, y: -0.3, z: -0.9 } : { x: 0, y: -0.5, z: -1.4 };
    const step3Scale = isDesktop ? 0.75 : 0.55;

    // Set initial state
    this.pivot.position.set(initialPos.x, initialPos.y, initialPos.z);
    this.targetScale.set(initialScale, initialScale, initialScale);

    // Make canvas interactive initially
    const canvasEl = this.renderer.domElement.parentNode;
    if (canvasEl) {
      canvasEl.classList.add('interactive');
    }

    // ScrollTrigger to toggle canvas interactivity and OrbitControls
    ScrollTrigger.create({
      trigger: ".hero-section",
      start: "top top",
      end: "bottom top",
      onLeave: () => {
        if (canvasEl) canvasEl.classList.remove('interactive');
        if (this.controls) this.controls.enabled = false;
      },
      onEnterBack: () => {
        if (canvasEl) canvasEl.classList.add('interactive');
        if (this.controls) this.controls.enabled = true;
      }
    });

    // Main scroll timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2, // smooth scrub
        invalidateOnRefresh: true
      }
    });

    // Step 1: Scroll to features section
    tl.to(this.pivot.position, {
      x: step1Pos.x,
      y: step1Pos.y,
      z: step1Pos.z,
      ease: "power1.inOut"
    })
    .to(this.pivot.rotation, {
      y: Math.PI * 0.6,
      x: 0.15,
      ease: "power1.inOut"
    }, 0)
    .to(this.targetScale, {
      x: step1Scale,
      y: step1Scale,
      z: step1Scale,
      ease: "power1.inOut"
    }, 0);

    // Step 2: Scroll to dashboards
    tl.to(this.pivot.position, {
      x: step2Pos.x,
      y: step2Pos.y,
      z: step2Pos.z,
      ease: "power1.inOut"
    })
    .to(this.pivot.rotation, {
      y: Math.PI * 1.3,
      x: -0.1,
      z: 0.1,
      ease: "power1.inOut"
    }, 1)
    .to(this.targetScale, {
      x: step2Scale,
      y: step2Scale,
      z: step2Scale,
      ease: "power1.inOut"
    }, 1);

    // Step 3: Scroll to CTA/Footer
    tl.to(this.pivot.position, {
      x: step3Pos.x,
      y: step3Pos.y,
      z: step3Pos.z,
      ease: "power1.inOut"
    })
    .to(this.pivot.rotation, {
      y: Math.PI * 2.0,
      x: 0,
      z: 0,
      ease: "power1.inOut"
    }, 2)
    .to(this.targetScale, {
      x: step3Scale,
      y: step3Scale,
      z: step3Scale,
      ease: "power1.inOut"
    }, 2);
  }

  startHeartbeatAnimation() {
    // Custom heartbeat animation loop based on time
    this.baseScale = 1;
  }

  onWindowResize() {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    if (this.controls) {
      this.controls.update(); // Required for damping/inertia
    }

    if (this.pivot) {
      // 1. Idle ambient rotation on the model inside pivot (not pivot itself to prevent GSAP conflicts)
      if (this.heartModel && !this.isHovered && (!this.controls || !this.controls.state)) {
        this.heartModel.rotation.y += 0.002;
      }

      // 2. Heartbeat Pulsing (sin wave composition for realistic double-beat)
      // Beat pattern: lub-dub... pause...
      const beatCycle = (time * 1.5) % Math.PI;
      let pulseScale = 1;
      
      if (beatCycle < 0.5) {
        pulseScale = 1 + Math.sin(beatCycle * Math.PI * 2) * 0.05; // First beat
      } else if (beatCycle > 0.6 && beatCycle < 1.0) {
        pulseScale = 1 + Math.sin((beatCycle - 0.6) * Math.PI * 2.5) * 0.03; // Second beat
      }

      // 3. Apply Deformation Scaling (Spring physics interpolation)
      // Interpolate currentScale towards targetScale
      this.currentScale.lerp(this.targetScale, 0.15); // The 0.15 controls the spring stiffness

      // Combine heartbeat pulse with deformation
      this.pivot.scale.set(
        this.currentScale.x * pulseScale,
        this.currentScale.y * pulseScale,
        this.currentScale.z * pulseScale
      );
    }

    if (this.mixer) {
      this.mixer.update(delta);
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Global initialization helper
window.init3DHeart = (containerId) => {
  return new Heart3DLoader(containerId);
};
