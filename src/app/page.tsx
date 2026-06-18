'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { HeroSection } from '@/components/landing/HeroSection';
import { Footer } from '@/components/Footer';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
import { Pill, CalendarClock, Hospital, Video, Bell, FileHeart, Siren, LineChart, PackageCheck, Shield, Stethoscope, Building2, Store, User, Heart } from 'lucide-react';

const features = [
  { icon: Pill, title: 'Digital Prescriptions', desc: 'View, download, share with pharmacies, track status, and receive refill reminders.' },
  { icon: CalendarClock, title: 'Appointment Scheduling', desc: 'Book, reschedule, cancel, join telehealth consultations, and review appointment history.' },
  { icon: Hospital, title: 'Hospital Check-In', desc: 'Mobile check-in, live queue position, estimated waiting time, and lower waiting room congestion.' },
  { icon: Video, title: 'Telemedicine', desc: 'Secure virtual consultations with document upload, chat, and connected prescriptions.' },
  { icon: Bell, title: 'Medication Reminders', desc: 'Dosage, frequency, time of day, remaining doses, missed doses, and adherence percentage.' },
  { icon: FileHeart, title: 'Digital Health Records', desc: 'Consultation history, diagnoses, lab results, imaging, vaccinations, allergies, and chronic conditions.' },
  { icon: Siren, title: 'Emergency Assistance', desc: 'Notify emergency contacts, share GPS location, and expose the critical medical profile.' },
  { icon: LineChart, title: 'Health Tracking', desc: 'Blood pressure, blood sugar, heart rate, weight, and oxygen trends with reports.' },
  { icon: PackageCheck, title: 'Inventory Tracking', desc: 'Stock levels, expiry dates, reorder alerts, and low-stock warnings for pharmacies.' },
];

const roles = [
  { icon: User, label: 'Patients', desc: 'Appointments, prescriptions, records, reminders, check-in, telehealth, emergency assistance.' },
  { icon: Stethoscope, label: 'Doctors & Specialists', desc: 'Verification, schedules, high-risk flags, patient records, notes, prescriptions, follow-ups.' },
  { icon: Building2, label: 'Hospitals', desc: 'Patient load, queue management, bed availability, ICU visibility, staffing, appointment volume.' },
  { icon: Store, label: 'Pharmacies', desc: 'Digital prescription processing, verification, fulfillment, inventory, expiry, reorder alerts.' },
  { icon: Shield, label: 'Administrators', desc: 'User management, provider approvals, facility verification, analytics, audit logs, system health.' },
];

export default function LandingPage() {
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('medlink_splash_seen')) {
      setSplashDone(true);
      return;
    }
    const timer = setTimeout(() => {
      sessionStorage.setItem('medlink_splash_seen', '1');
      setSplashDone(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!splashDone) return <SplashScreen3D onSkip={() => { sessionStorage.setItem('medlink_splash_seen', '1'); setSplashDone(true); }} />;
  return <MainLanding />;
}

function SplashScreen3D({ onSkip }: { onSkip?: () => void }) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    const skipTimer = setTimeout(() => setCanSkip(true), 1500);
    return () => clearTimeout(skipTimer);
  }, []);

  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const w = window.innerWidth;
    const h = window.innerHeight;
    const aspect = w / h;
    const isMobile = w < 768;
    const camZ = isMobile ? 9 : 7;
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    camera.position.set(0, 0.5, camZ);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xffffff, 4);
    key.position.set(5, 8, 7);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x3B82F6, 1.5);
    fill.position.set(-4, 2, 5);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0x60A5FA, 1.2);
    rim.position.set(0, -5, -6);
    scene.add(rim);
    const top = new THREE.DirectionalLight(0xffffff, 1.5);
    top.position.set(0, 12, 0);
    scene.add(top);

    let heartGroup: THREE.Group | null = null;

    const loader = new GLTFLoader();
    loader.load(
      '/models/realistic_human_heart.glb',
      (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 5.6 / maxDim;
        model.scale.set(scale, scale, scale);
        model.position.set(0, 0, 0);

        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const mat = child.material as THREE.MeshPhysicalMaterial;
            if (mat) {
              mat.roughness = 0.25;
              mat.metalness = 0.15;
              mat.clearcoat = 0.5;
              mat.clearcoatRoughness = 0.2;
              mat.envMapIntensity = 1.4;
            }
          }
        });

        heartGroup = new THREE.Group();
        heartGroup.add(model);
        scene.add(heartGroup);
      },
      undefined,
      () => {
        // Fallback geometric heart
        const group = new THREE.Group();
        const mat = new THREE.MeshPhysicalMaterial({ color: 0xDC2626, roughness: 0.3, metalness: 0.1, clearcoat: 0.4, clearcoatRoughness: 0.3, envMapIntensity: 1.2 });
        const r = 0.95;
        const l = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 32), mat); l.position.set(-0.5, 0.25, 0); group.add(l);
        const r2 = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 32), mat); r2.position.set(0.5, 0.25, 0); group.add(r2);
        const b1 = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 32), mat); b1.position.set(0, -0.7, 0); group.add(b1);
        const b2 = new THREE.Mesh(new THREE.SphereGeometry(0.28, 32, 32), mat); b2.position.set(0, -1.05, 0); group.add(b2);
        const t = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.5, 16), mat); t.position.set(0, 1.4, 0); group.add(t);
        group.scale.set(2, 2, 2);
        heartGroup = group;
        scene.add(group);
      }
    );

    const pCount = 80;
    const pGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) pos[i] = (Math.random() - 0.5) * 12;
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.03, color: 0x3B82F6, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    const timer = new THREE.Timer();
    let destroyed = false;

    const animate = () => {
      if (destroyed) return;
      requestAnimationFrame(animate);
      timer.update();
      const t = timer.getElapsed();
      if (heartGroup) {
        const beat = Math.sin(t * 2.8) * 0.02 + 1;
        heartGroup.scale.setScalar(beat);
        heartGroup.position.y = Math.sin(t * 0.5) * 0.03;
        heartGroup.rotation.y = t * 0.12;
        heartGroup.rotation.x = Math.sin(t * 0.15) * 0.03;
      }
      const pp = particles.geometry.attributes.position.array;
      for (let i = 0; i < pCount; i++) {
        pp[i * 3] += Math.sin(t * 0.3 + i) * 0.001;
        pp[i * 3 + 1] += Math.cos(t * 0.2 + i) * 0.001;
        pp[i * 3 + 2] += Math.sin(t * 0.25 + i * 2) * 0.001;
        if (Math.abs(pp[i * 3]) > 6) pp[i * 3] *= -0.9;
        if (Math.abs(pp[i * 3 + 1]) > 6) pp[i * 3 + 1] *= -0.9;
        if (Math.abs(pp[i * 3 + 2]) > 6) pp[i * 3 + 2] *= -0.9;
      }
      particles.geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      camera.aspect = nw / nh;
      camera.position.set(0, 0.5, nw < 768 ? 9 : 7);
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    const start = Date.now();
    const tick = () => {
      if (destroyed) return;
      const elapsed = Date.now() - start;
      setProgress(Math.min(elapsed / 3000, 1));
      if (elapsed < 3000) requestAnimationFrame(tick);
    };
    const raf = requestAnimationFrame(tick);

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#070707', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 24px', maxWidth: '85vw', width: 360 }}>
        <h1 style={{ fontSize: 'clamp(28px, 8vw, 40px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#F8FAFC', marginBottom: 12 }}>MedLink SA</h1>
        <p style={{ fontSize: 'clamp(11px, 3vw, 14px)', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(248,250,252,0.45)', marginBottom: 40 }}>The Future of Healthcare, Available Today.</p>
        <div style={{ width: 200, height: 2, margin: '0 auto', borderRadius: 1, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 1, background: 'linear-gradient(90deg, #2563EB, #3B82F6)', width: `${progress * 100}%`, transition: 'width 0.3s linear' }} />
        </div>
        {canSkip && (
          <button onClick={onSkip} style={{ marginTop: 24, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(248,250,252,0.35)', background: 'none', border: '1px solid rgba(248,250,252,0.1)', borderRadius: 8, padding: '8px 16px', transition: 'all 0.2s' }}>
            Skip &rarr;
          </button>
        )}
      </div>
    </div>
  );
}

function MainLanding() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    gsap.fromTo('.gsap-stats', { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.stats-section', start: 'top 85%', toggleActions: 'play none none none' },
    });

    gsap.fromTo('.gsap-feature', { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: '.features-section', start: 'top 80%', toggleActions: 'play none none none' },
    });

    gsap.fromTo('.gsap-role', { opacity: 0, x: -30 }, {
      opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.roles-section', start: 'top 80%', toggleActions: 'play none none none' },
    });

    gsap.fromTo('.gsap-cta', { opacity: 0, scale: 0.95 }, {
      opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.cta-section', start: 'top 85%', toggleActions: 'play none none none' },
    });

    return () => ScrollTrigger.getAll().forEach(st => st.kill());
  }, []);

  const isLight = theme !== 'dark';

  return (
    <div className="min-h-screen" style={{ background: 'var(--landing-bg)' }}>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <RolesSection />
      <CTASection />
      <Footer />
    </div>
  );
}

function StatsSection() {
  return (
    <section className="py-16 px-6 stats-section" style={{ background: 'var(--section-bg)' }}>
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {[
          { value: '10,000+', label: 'Patients Supported' },
          { value: '500+', label: 'Prescriptions Managed' },
          { value: '99.9%', label: 'Data Availability' },
          { value: '24/7', label: 'Access' },
        ].map((s) => (
          <div key={s.label} className="text-center p-6 rounded-xl glass-card gsap-stats">
            <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="py-20 px-6 features-section" style={{ background: 'var(--section-bg-alt)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[#2563EB] text-sm font-semibold mb-2">One healthcare nervous system</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Built to remove friction from care.</h2>
          <p className="max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>Appointments, prescriptions, records, emergency response, follow-ups, and operations work together instead of living in disconnected systems.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.title} className="gsap-feature p-5 rounded-xl glass-card hover:border-[#2563EB]/30 transition-all">
              <f.icon className="text-[#2563EB] mb-3" size={24} />
              <h3 className="font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RolesSection() {
  return (
    <section className="py-20 px-6 roles-section" style={{ background: 'var(--section-bg-role)' }}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        <div>
          <p className="text-[#2563EB] text-sm font-semibold mb-2">Role-aware by design</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Every user sees the right workspace.</h2>
          <p style={{ color: 'var(--text-muted)' }}>Patients enter the patient portal, verified doctors and specialists enter provider tools, pharmacies and hospitals enter operations dashboards, administrators enter governance, and everyone else remains on the public site.</p>
        </div>
        <div className="space-y-3">
          {roles.map((r) => (
            <div key={r.label} className="flex gap-3 p-4 rounded-xl glass-card gsap-role">
              <r.icon className="text-[#2563EB] shrink-0 mt-0.5" size={20} />
              <div>
                <strong className="text-sm" style={{ color: 'var(--text-primary)' }}>{r.label}</strong>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 px-6 cta-section" style={{ background: 'var(--section-bg-cta)' }}>
      <div className="max-w-3xl mx-auto text-center p-12 rounded-2xl glass-card gsap-cta">
        <Heart size={36} className="text-[#2563EB] mx-auto mb-4" />
        <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Ready to Modernize Healthcare?</h2>
        <p className="mb-8" style={{ color: 'var(--text-muted)' }}>Create a connected path from appointment booking to treatment completion.</p>
        <Link href="/get-started" className="btn-primary inline-flex text-sm">
          Get Started
        </Link>
      </div>
    </section>
  );
}
