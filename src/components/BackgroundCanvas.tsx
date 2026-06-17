'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function BackgroundCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const isDark = document.documentElement.classList.contains('dark');

    const scene = new THREE.Scene();
    if (isDark) scene.background = new THREE.Color(0x1A1A1E);
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 20);

    const renderer = new THREE.WebGLRenderer({ alpha: !isDark, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.6;
    container.appendChild(renderer.domElement);

    // Floating geometric shapes
    const shapes: THREE.Mesh[] = [];
    const geos = [
      new THREE.IcosahedronGeometry(0.4, 0),
      new THREE.OctahedronGeometry(0.35, 0),
      new THREE.TetrahedronGeometry(0.3, 0),
    ];
    for (let i = 0; i < 12; i++) {
      const geo = geos[i % geos.length];
      const mat = new THREE.MeshPhysicalMaterial({
        color: i % 2 === 0 ? 0x2563EB : 0x3B82F6,
        transparent: true,
        opacity: 0.06 + Math.random() * 0.08,
        roughness: 0.4,
        metalness: 0.2,
        wireframe: i % 3 === 0,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15 - 5
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      const data = {
        speed: 0.1 + Math.random() * 0.2,
        rotSpeed: 0.005 + Math.random() * 0.015,
        floatAmp: 0.2 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
      };
      (mesh as any).__data = data;
      scene.add(mesh);
      shapes.push(mesh);
    }

    // Particles
    const pCount = 200;
    const pGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) pos[i] = (Math.random() - 0.5) * 50;
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x3B82F6,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    const timer = new THREE.Timer();
    let destroyed = false;
    let animId = 0;

    const animate = () => {
      if (destroyed) return;
      animId = requestAnimationFrame(animate);
      timer.update();
      const t = timer.getElapsed();

      shapes.forEach((mesh) => {
        const d = (mesh as any).__data;
        mesh.position.y += Math.sin(t * d.speed + d.phase) * 0.002;
        mesh.rotation.x += d.rotSpeed;
        mesh.rotation.y += d.rotSpeed * 0.7;
      });

      const pp = particles.geometry.attributes.position.array;
      for (let i = 0; i < pCount; i++) {
        pp[i * 3] += Math.sin(t * 0.15 + i * 0.1) * 0.0005;
        pp[i * 3 + 1] += Math.cos(t * 0.12 + i * 0.1) * 0.0005;
        pp[i * 3 + 2] += Math.sin(t * 0.1 + i * 0.15) * 0.0005;
        if (Math.abs(pp[i * 3]) > 25) pp[i * 3] *= -0.9;
        if (Math.abs(pp[i * 3 + 1]) > 25) pp[i * 3 + 1] *= -0.9;
        if (Math.abs(pp[i * 3 + 2]) > 25) pp[i * 3 + 2] *= -0.9;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      camera.position.x = Math.sin(t * 0.03) * 1.5;
      camera.position.y = Math.cos(t * 0.02) * 0.5;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      destroyed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ willChange: 'transform' }}
    />
  );
}
