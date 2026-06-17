'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { HeartPulse, Sun, Moon, Menu, X, User, Stethoscope, Building2, Store, Shield, Compass, LayoutDashboard, LogOut } from 'lucide-react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuth } from '@/lib/auth-context';
import { getInitials } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const roleIcons: Record<string, React.ReactNode> = {
  patient: <User size={16} />,
  provider: <Stethoscope size={16} />,
  facility: <Building2 size={16} />,
  pharmacy: <Store size={16} />,
  admin: <Shield size={16} />,
};

const roleDashboards: Record<string, { label: string; href: string }> = {
  patient: { label: 'Patient Dashboard', href: '/patient/dashboard' },
  provider: { label: 'Doctor Dashboard', href: '/doctor/dashboard' },
  facility: { label: 'Hospital Dashboard', href: '/hospital/dashboard' },
  pharmacy: { label: 'Pharmacy Dashboard', href: '/pharmacy/dashboard' },
  admin: { label: 'Admin Dashboard', href: '/admin/dashboard' },
};

export function HeroSection() {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const canvasRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const heartRef = useRef<THREE.Group | null>(null);
  const animFrameRef = useRef<number>(0);
  const cleanupRef = useRef<(() => void) | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const scrollProgressRef = useRef({ scale: 1, y: 0, opacity: 1 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  const [counts, setCounts] = useState({ users: 0, appointments: 0, facilities: 0 });
  const targets = { users: 17000, appointments: 1923000, facilities: 40 };

  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(-3.5, 0.5, 14);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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

        const heartbeat = gsap.timeline({ repeat: -1, yoyo: true });
        heartbeat.to(heartGroup.scale, {
          x: 1.06, y: 1.06, z: 1.06, duration: 0.8, ease: 'power2.out',
        });
        heartbeat.to(heartGroup.scale, {
          x: 1.0, y: 1.0, z: 1.0, duration: 0.4, ease: 'power2.in',
        });
        heartbeat.to(heartGroup.scale, {
          x: 1.03, y: 1.03, z: 1.03, duration: 0.6, ease: 'power2.out',
        });
        heartbeat.to(heartGroup.scale, {
          x: 1.0, y: 1.0, z: 1.0, duration: 2.0, ease: 'none',
        });
      },
      (xhr) => { console.log('Heart:', Math.round(xhr.loaded / xhr.total * 100) + '%'); },
      (err) => {
        console.warn('GLB failed:', err);
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
        const sp = scrollProgressRef.current;
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
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(container);
    window.addEventListener('resize', onResize);

    cleanupRef.current = () => {
      ro.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animFrameRef.current);
      if (rendererRef.current?.domElement && container.contains(rendererRef.current.domElement)) {
        container.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
    };

    return () => cleanupRef.current?.();
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    const canvas = canvasRef.current;
    if (!hero || !canvas) return;

    gsap.fromTo('.hero-text', { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.3,
    });

    gsap.fromTo('.gsap-stat', { opacity: 0, y: 20 }, {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 1,
    });

    ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      onEnter: () => {
        gsap.to({ val: 0 }, { val: targets.users, duration: 2.5, ease: 'power2.out', onUpdate: function () { setCounts(p => ({ ...p, users: Math.floor(this.targets()[0].val) })); } });
        gsap.to({ val: 0 }, { val: targets.appointments, duration: 2.5, ease: 'power2.out', onUpdate: function () { setCounts(p => ({ ...p, appointments: Math.floor(this.targets()[0].val) })); } });
        gsap.to({ val: 0 }, { val: targets.facilities, duration: 2.5, ease: 'power2.out', onUpdate: function () { setCounts(p => ({ ...p, facilities: Math.floor(this.targets()[0].val) })); } });
      },
    });

    ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => {
        const p = self.progress;
        if (p < 0.7) {
          scrollProgressRef.current.scale = 1;
          scrollProgressRef.current.y = 0;
          scrollProgressRef.current.opacity = 1;
        } else {
          const t = (p - 0.7) / 0.3;
          scrollProgressRef.current.scale = 1 - t;
          scrollProgressRef.current.y = t * 250;
          scrollProgressRef.current.opacity = 1 - t;
        }
      },
    });



    return () => ScrollTrigger.getAll().forEach(st => st.kill());
  }, []);

  const formatNum = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(0) + 'k';
    return String(n);
  };

  const currentDashboard = user ? roleDashboards[user.role] : null;

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden" style={{ background: 'var(--hero-bg)' }}>
      <div
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        style={{ willChange: 'opacity, transform', opacity: 1, touchAction: 'none' }}
      />
      <div className="absolute inset-0 w-full h-full z-[1] pointer-events-none vignette" />

      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 h-14 nav-glass">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center shrink-0" style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg, #2563EB, #3B82F6)' }}>
            <HeartPulse size={13} className="text-white" />
          </div>
          <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>MedLink SA</span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          <Link href="/explore" className="text-sm px-3 py-1.5 rounded-lg transition-colors hover:bg-white/10" style={{ color: 'var(--text-muted)' }}>
            <Compass size={14} className="inline mr-1" />Explore
          </Link>

          {user && currentDashboard ? (
            <Link href={currentDashboard.href} className="text-sm px-3 py-1.5 rounded-lg transition-colors hover:bg-white/10" style={{ color: 'var(--accent)' }}>
              <LayoutDashboard size={14} className="inline mr-1" />{currentDashboard.label}
            </Link>
          ) : (
            <>
              <Link href="/sign-in" className="text-sm px-3 py-1.5 rounded-lg transition-colors hover:bg-white/10" style={{ color: 'var(--text-muted)' }}>
                Sign In
              </Link>
              <Link href="/get-started" className="btn-primary text-xs px-4 py-1.5">
                Get Started Free
              </Link>
            </>
          )}

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="ml-1 p-2 rounded-lg transition-colors hover:bg-white/10" style={{ color: 'var(--text-muted)' }}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <div className="relative">
            <button
              onClick={() => setHamburgerOpen(!hamburgerOpen)}
              className="ml-1 p-2 rounded-lg transition-colors hover:bg-white/10" style={{ color: 'var(--text-muted)' }}
            >
              <Menu size={18} />
            </button>

            {hamburgerOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setHamburgerOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-64 rounded-xl glass-darker z-50 overflow-hidden" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                  {user && (
                    <div className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: '1px solid var(--card-border)' }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--accent)', color: '#fff' }}>
                        {user.name ? getInitials(user.name) : 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
                        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{user.role}</p>
                      </div>
                    </div>
                  )}

                  <div className="py-2">
                    <p className="px-4 text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Platform</p>
                    <NavDropdownItem href="/explore" icon={<Compass size={15} />} label="Explore" onClick={() => setHamburgerOpen(false)} />

                    {user ? (
                      <>
                        <NavDropdownItem href={currentDashboard?.href || '#'} icon={<LayoutDashboard size={15} />} label={currentDashboard?.label || 'Dashboard'} onClick={() => setHamburgerOpen(false)} />
                        <div className="my-1" style={{ borderTop: '1px solid var(--card-border)' }} />
                        <p className="px-4 text-[11px] font-semibold uppercase tracking-wider mb-1 mt-2" style={{ color: 'var(--text-muted)' }}>Dashboards</p>
                        {Object.entries(roleDashboards).map(([role, db]) => (
                          <NavDropdownItem key={role} href={db.href} icon={roleIcons[role]} label={db.label} onClick={() => setHamburgerOpen(false)} />
                        ))}
                        <div className="my-1" style={{ borderTop: '1px solid var(--card-border)' }} />
                        <button
                          onClick={() => { signOut(); setHamburgerOpen(false); }}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors hover:bg-white/5"
                          style={{ color: 'var(--error)' }}
                        >
                          <LogOut size={15} /> Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <NavDropdownItem href="/sign-in" icon={<Shield size={15} />} label="Sign In" onClick={() => setHamburgerOpen(false)} />
                        <NavDropdownItem href="/get-started" icon={<HeartPulse size={15} />} label="Get Started" onClick={() => setHamburgerOpen(false)} />
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {user && (
            <div className="flex items-center gap-2 ml-2 pl-3" style={{ borderLeft: '1px solid var(--card-border)' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--accent)', color: '#fff' }}>
                {user.name ? getInitials(user.name) : 'U'}
              </div>
              <span className="text-xs font-medium hidden lg:block" style={{ color: 'var(--text-primary)' }}>{user.name?.split(' ')[0]}</span>
            </div>
          )}
        </div>

        <div className="flex md:hidden items-center gap-1">
          {user && (
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold mr-1" style={{ background: 'var(--accent)', color: '#fff' }}>
              {user.name ? getInitials(user.name) : 'U'}
            </div>
          )}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg transition-colors hover:bg-white/10" style={{ color: 'var(--text-muted)' }}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg transition-colors hover:bg-white/10" style={{ color: 'var(--text-muted)' }}>
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed top-14 left-0 right-0 z-40 nav-glass px-4 py-4 space-y-2" style={{ borderRadius: 0, maxHeight: 'calc(100vh - 56px)', overflowY: 'auto' }}>
          <Link href="/explore" className="block text-sm px-3 py-2 rounded-lg transition-colors hover:bg-white/10" style={{ color: 'var(--text-muted)' }} onClick={() => setMobileMenuOpen(false)}>
            <Compass size={14} className="inline mr-2" />Explore
          </Link>

          {user && currentDashboard ? (
            <Link href={currentDashboard.href} className="block text-sm px-3 py-2 rounded-lg transition-colors hover:bg-white/10" style={{ color: 'var(--accent)' }} onClick={() => setMobileMenuOpen(false)}>
              <LayoutDashboard size={14} className="inline mr-2" />{currentDashboard.label}
            </Link>
          ) : (
            <>
              <Link href="/sign-in" className="block text-sm px-3 py-2 rounded-lg transition-colors hover:bg-white/10" style={{ color: 'var(--text-muted)' }} onClick={() => setMobileMenuOpen(false)}>
                Sign In
              </Link>
              <Link href="/get-started" className="block text-sm font-semibold px-3 py-2 rounded-lg text-white text-center" style={{ background: 'linear-gradient(135deg, #2563EB, #3B82F6)' }} onClick={() => setMobileMenuOpen(false)}>
                Get Started Free
              </Link>
            </>
          )}

          <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: 8, marginTop: 8 }}>
            <p className="text-[11px] font-semibold uppercase tracking-wider px-3 mb-1" style={{ color: 'var(--text-muted)' }}>Dashboards</p>
            {Object.entries(roleDashboards).map(([role, db]) => (
              <Link key={role} href={db.href} className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-colors hover:bg-white/10" style={{ color: 'var(--text-muted)' }} onClick={() => setMobileMenuOpen(false)}>
                {roleIcons[role]} {db.label}
              </Link>
            ))}
          </div>

          {user && (
            <button
              onClick={() => { signOut(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-colors hover:bg-white/10 w-full"
              style={{ color: 'var(--error)' }}
            >
              <LogOut size={14} /> Sign Out
            </button>
          )}
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-20 w-full">
        <div className="max-w-xl sm:max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6 hero-text" style={{ background: 'var(--accent-light)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse-dot" />
            South Africa&apos;s Digital Health Ecosystem
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold leading-[1.05] mb-5 tracking-tight hero-text" style={{ color: 'var(--text-primary)' }}>
            <span className="text-gradient">Intelligent Healthcare,</span><br />
            Connected for South Africa
          </h1>

          <p className="text-sm sm:text-base md:text-xl max-w-xl mb-8 leading-relaxed hero-text" style={{ color: 'var(--text-muted)' }}>
            Connect patients, providers, and facilities in one intelligent platform powered by AI.
          </p>

          <div className="flex flex-wrap gap-3 mb-12 hero-text">
            <Link href="/get-started" className="btn-primary text-sm">
              Get Started Free
            </Link>
            <Link href="/explore" className="btn-secondary text-sm">
              Explore the Platform
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3 hero-text">
            <div className="glass-card px-3 sm:px-5 py-3 sm:py-4 gsap-stat">
              <p className="font-bold text-lg sm:text-2xl" style={{ color: 'var(--text-primary)' }}>{formatNum(counts.users)}+</p>
              <p className="text-[10px] sm:text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Active Users</p>
            </div>
            <div className="glass-card px-3 sm:px-5 py-3 sm:py-4 gsap-stat">
              <p className="font-bold text-lg sm:text-2xl" style={{ color: 'var(--text-primary)' }}>{formatNum(counts.appointments)}k</p>
              <p className="text-[10px] sm:text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Appointments</p>
            </div>
            <div className="glass-card px-3 sm:px-5 py-3 sm:py-4 gsap-stat">
              <p className="font-bold text-lg sm:text-2xl" style={{ color: 'var(--text-primary)' }}>{counts.facilities}+</p>
              <p className="text-[10px] sm:text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Facilities</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t z-10 pointer-events-none" style={{ background: `linear-gradient(to top, var(--bg-primary) 0%, transparent 100%)` }} />
    </section>
  );
}

function NavDropdownItem({ href, icon, label, onClick }: { href: string; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors hover:bg-white/5"
      style={{ color: 'var(--text-primary)' }}
    >
      <span style={{ color: 'var(--text-muted)' }}>{icon}</span>
      {label}
    </Link>
  );
}
