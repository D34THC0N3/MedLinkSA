import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

window.init3DHeart = function init3DHeart(containerId) {
  const container = document.getElementById(containerId);
  if (!container || container.dataset.initialized === "true") return;
  container.dataset.initialized = "true";

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0.2, 6.2);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.4));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.5;
  container.replaceChildren(renderer.domElement);

  // Enhanced lighting setup for more dramatic effect
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 6);
  directionalLight.position.set(3.2, 4.5, 4.2);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Multiple accent lights for dynamic glow
  const pinkLight = new THREE.PointLight(0xff00ff, 10, 15);
  pinkLight.position.set(-3, 1.5, 3);
  pinkLight.castShadow = false;
  scene.add(pinkLight);

  const cyanLight = new THREE.PointLight(0x00ffff, 8, 15);
  cyanLight.position.set(3, -1, 2);
  cyanLight.castShadow = false;
  scene.add(cyanLight);

  const orangeLight = new THREE.PointLight(0xff6b35, 6, 12);
  orangeLight.position.set(0, 2, 1);
  orangeLight.castShadow = false;
  scene.add(orangeLight);

  const heartGroup = new THREE.Group();
  scene.add(heartGroup);

  const loader = new GLTFLoader();
  loader.load(
    "realistic_human_heart.glb",
    (gltf) => {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDimension = Math.max(size.x, size.y, size.z);

      model.position.sub(center);
      model.scale.setScalar(2.8 / maxDimension);
      model.rotation.set(0.2, -0.4, 0.05);
      
      // Enhanced material properties for more vibrant appearance
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = false;
          child.receiveShadow = false;
          if (child.material) {
            child.material.roughness = Math.min(child.material.roughness ?? 0.65, 0.85);
            child.material.metalness = Math.min(child.material.metalness ?? 0, 0.08);
            child.material.emissive = new THREE.Color(0x001122);
            child.material.emissiveIntensity = 0.05;
          }
        }
      });
      heartGroup.add(model);
      container.classList.add("is-loaded");

      // Initialize glow effect
      if (window.gsap) {
        gsap.to(pinkLight, {
          intensity: 15,
          duration: 2,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut"
        });
        gsap.to(cyanLight, {
          intensity: 12,
          duration: 2.5,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: 0.3
        });
      }
    },
    undefined,
    () => {
      container.classList.add("is-fallback");
      container.innerHTML = '<div class="heart-fallback" aria-hidden="true"></div>';
    }
  );

  // Enhanced interactive tracking
  let pointerX = 0;
  let pointerY = 0;
  let targetX = 0;
  let targetY = 0;
  
  const onMove = (event) => {
    const rect = container.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    targetX = (mouseX / rect.width - 0.5) * 0.5;
    targetY = (mouseY / rect.height - 0.5) * 0.35;
  };
  container.addEventListener("pointermove", onMove, { passive: true });

  const clock = new THREE.Clock();
  const render = () => {
    const elapsed = clock.getElapsedTime();
    
    // Smooth interpolation for responsive interaction
    pointerX += (targetX - pointerX) * 0.1;
    pointerY += (targetY - pointerY) * 0.1;
    
    // Complex animation sequence
    heartGroup.rotation.y = -0.2 + pointerX + Math.sin(elapsed * 0.42) * 0.12;
    heartGroup.rotation.x = pointerY + Math.sin(elapsed * 0.75) * 0.045;
    heartGroup.rotation.z = Math.sin(elapsed * 0.6) * 0.03;
    
    // Breathtaking floating animation
    heartGroup.position.y = Math.sin(elapsed * 1.25) * 0.08 + Math.cos(elapsed * 0.8) * 0.03;
    
    // Subtle scale breathing
    const scale = 1 + Math.sin(elapsed * 0.9) * 0.05;
    heartGroup.scale.setScalar(scale);
    
    // Dynamic lighting influence
    if (window.gsap) {
      pinkLight.position.x = -3 + Math.sin(elapsed * 2) * 0.5;
      cyanLight.position.y = -1 + Math.cos(elapsed * 1.5) * 0.5;
    }
    
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };
  render();

  const resize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.position.z = window.innerWidth < 768 ? 8.5 : 6.5;
    heartGroup.position.x = window.innerWidth < 768 ? 0 : 1.8;
    heartGroup.position.y = window.innerWidth < 768 ? -1.2 : 0.2;
    heartGroup.scale.setScalar(window.innerWidth < 768 ? 0.95 : 1.1);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener("resize", resize, { passive: true });
  resize();

  // Add cursor interaction class
  container.classList.add("interactive");
};
