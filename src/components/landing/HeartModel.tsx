'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface HeartModelProps {
  scrollProgress: React.RefObject<{ scale: number; y: number; opacity: number }>;
}

export function HeartModel({ scrollProgress }: HeartModelProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const heartRef = useRef<THREE.Group | null>(null);
  const animFrameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const updateCamera = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      const aspect = w / h;
      const isMobile = w < 768;
      const isSmall = w < 480;
      const camZ = isSmall ? 16 : isMobile ? 15 : 14;
      const camY = isSmall ? 1 : 0.5;

      if (cameraRef.current) {
        cameraRef.current.aspect = aspect;
        cameraRef.current.position.set(-3.5, camY, camZ);
        cameraRef.current.updateProjectionMatrix();
      } else {
        const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        camera.position.set(-3.5, camY, camZ);
        cameraRef.current = camera;
      }
    };

    updateCamera();

    const dpr = Math.min(window.devicePixelRatio, 2);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(dpr);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.7;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 5);
    keyLight.position.set(5, 12, 8);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x3B82F6, 2);
    fillLight.position.set(-6, 3, 6);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x60A5FA, 1.5);
    rimLight.position.set(0, -6, -6);
    scene.add(rimLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 2);
    topLight.position.set(0, 15, 0);
    scene.add(topLight);

    const extraAmbient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(extraAmbient);

    const loader = new GLTFLoader();
    const glbPath = '/models/realistic_human_heart.glb';
    loader.load(
      glbPath,
      (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = (2.5 / maxDim) * 2.6;
        model.scale.set(scale, scale, scale);
        model.position.set(0, 0, 0);

        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const mat = child.material as THREE.MeshPhysicalMaterial;
            if (mat) {
              mat.roughness = 0.3;
              mat.metalness = 0.15;
              mat.clearcoat = 0.4;
              mat.clearcoatRoughness = 0.3;
              mat.envMapIntensity = 1.2;
            }
          }
        });

        const heartGroup = new THREE.Group();
        heartGroup.add(model);
        heartRef.current = heartGroup;
        scene.add(heartGroup);
      },
      undefined,
      () => {
        const group = new THREE.Group();
        const mat = new THREE.MeshPhysicalMaterial({ color: 0xDC2626, roughness: 0.3, metalness: 0.1, clearcoat: 0.3 });
        const r = 1.0 * 2.6;
        const l = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 32), mat);
        l.position.set(-0.55, 0.3, 0);
        group.add(l);
        const r2 = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 32), mat);
        r2.position.set(0.55, 0.3, 0);
        group.add(r2);
        const b1 = new THREE.Mesh(new THREE.SphereGeometry(0.45 * 2.6, 32, 32), mat);
        b1.position.set(0, -0.8, 0);
        group.add(b1);
        const b2 = new THREE.Mesh(new THREE.SphereGeometry(0.3 * 2.6, 32, 32), mat);
        b2.position.set(0, -1.15, 0);
        group.add(b2);
        const t = new THREE.Mesh(new THREE.ConeGeometry(0.3 * 2.6, 0.5 * 2.6, 16), mat);
        t.position.set(0, 1.5, 0);
        group.add(t);
        scene.add(group);
        heartRef.current = group;
      }
    );

    const onMouseMove = (e: MouseEvent) => {
      targetMouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    const animateFn = () => {
      animFrameRef.current = requestAnimationFrame(animateFn);
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.05;
      if (heartRef.current) {
        const sp = scrollProgress.current;
        heartRef.current.rotation.x = -mouseRef.current.y * 0.15;
        heartRef.current.rotation.y = mouseRef.current.x * 0.25;
        heartRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.05 + sp.y;
        heartRef.current.scale.setScalar(sp.scale);
        heartRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const mat = child.material;
            if (Array.isArray(mat)) {
              mat.forEach(m => { m.transparent = true; m.opacity = sp.opacity; });
            } else {
              mat.transparent = true;
              mat.opacity = sp.opacity;
            }
          }
        });
      }
      if (rendererRef.current && cameraRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animateFn();

    const onResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      updateCamera();
      rendererRef.current.setSize(w, h);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(container);
    window.addEventListener('resize', onResize);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animFrameRef.current);
      if (rendererRef.current?.domElement && container.contains(rendererRef.current.domElement)) {
        container.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
    };
  }, []);

  return <div ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ willChange: 'opacity, transform', touchAction: 'none', pointerEvents: 'none' }} />;
}
