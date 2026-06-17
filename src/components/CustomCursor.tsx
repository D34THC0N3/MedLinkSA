'use client';

import { useEffect, useRef } from 'react';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const splashRef = useRef<HTMLDivElement>(null);
  const ripplesRef = useRef<HTMLDivElement[]>([]);
  const posRef = useRef({ x: -100, y: -100 });
  const ringPosRef = useRef({ x: -100, y: -100 });
  const floatRef = useRef(0);
  const timeRef = useRef(0);
  const clickingRef = useRef(false);

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const splash = splashRef.current;
    if (!dot || !ring || !splash) return;

    const ripples: HTMLDivElement[] = [];
    for (let i = 0; i < 3; i++) {
      const el = document.createElement('div');
      el.style.cssText = `position:fixed;pointer-events:none;z-index:9996;border-radius:50%;background:transparent;width:12px;height:12px;transform:scale(0);opacity:0;will-change:transform;left:0;top:0;`;
      document.body.appendChild(el);
      ripples.push(el);
    }
    ripplesRef.current = ripples;

    const onMouseMove = (e: MouseEvent) => {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;
      const scale = clickingRef.current ? 0.65 : 1;
      dot.style.transform = `translate(${e.clientX - 2.5}px, ${e.clientY - 2.5}px) scale(${scale})`;
    };

    let rippleIndex = 0;
    const onMouseDown = () => {
      clickingRef.current = true;
      const cx = posRef.current.x;
      const cy = posRef.current.y;
      dot.style.transform = `translate(${cx - 2.5}px, ${cy - 2.5}px) scale(0.65)`;
      ring.style.transform = `translate(${ringPosRef.current.x - 10}px, ${ringPosRef.current.y - 10}px) scale(0.8)`;
      ring.style.background = 'var(--accent)';
      ring.style.opacity = '0.3';

      // Splash burst at click point
      splash.style.left = (cx - 15) + 'px';
      splash.style.top = (cy - 15) + 'px';
      splash.style.width = '30px';
      splash.style.height = '30px';
      splash.style.transition = 'none';
      splash.style.transform = 'scale(0)';
      splash.style.opacity = '0.6';
      requestAnimationFrame(() => {
        splash.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
        splash.style.transform = 'scale(4)';
        splash.style.opacity = '0';
      });

      // Water tap ripple — concentric rings expand outward
      for (let i = 0; i < 3; i++) {
        const r = ripples[(rippleIndex + i) % ripples.length];
        const size = 8 + i * 6;
        r.style.width = size + 'px';
        r.style.height = size + 'px';
        r.style.left = (cx - size / 2) + 'px';
        r.style.top = (cy - size / 2) + 'px';
        r.style.border = `1.5px solid var(--accent)`;
        r.style.transition = 'none';
        r.style.transform = 'scale(0)';
        r.style.opacity = '0.5';
        r.style.borderWidth = String(1.5 - i * 0.3) + 'px';
        requestAnimationFrame(() => {
          r.style.transition = `transform ${0.45 + i * 0.1}s ease-out, opacity ${0.45 + i * 0.1}s ease-out`;
          r.style.transform = 'scale(4)';
          r.style.opacity = '0';
        });
      }
      rippleIndex = (rippleIndex + 3) % ripples.length;
    };

    const onMouseUp = () => {
      clickingRef.current = false;
      dot.style.transform = `translate(${posRef.current.x - 2.5}px, ${posRef.current.y - 2.5}px) scale(1)`;
      ring.style.transform = `translate(${ringPosRef.current.x - 10}px, ${ringPosRef.current.y - 10 + floatRef.current}px) scale(1)`;
      ring.style.background = 'transparent';
      ring.style.opacity = '1';
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = target.tagName === 'A' || target.tagName === 'BUTTON' || target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA' || target.closest('a, button, [role="button"], [tabindex]:not([tabindex="-1"])');
      if (isClickable) {
        ring.style.width = '28px';
        ring.style.height = '28px';
        ring.style.borderColor = 'var(--accent)';
        ring.style.background = 'var(--accent-light)';
      } else {
        ring.style.width = '20px';
        ring.style.height = '20px';
        ring.style.borderColor = 'rgba(37,99,235,0.12)';
        ring.style.background = 'transparent';
      }
    };

    const animateRing = () => {
      timeRef.current += 0.016;
      floatRef.current = Math.sin(timeRef.current * 1.8) * 1.0;
      ringPosRef.current.x += (posRef.current.x - ringPosRef.current.x) * 0.1;
      ringPosRef.current.y += (posRef.current.y - ringPosRef.current.y) * 0.1;
      if (!clickingRef.current) {
        ring.style.transform = `translate(${ringPosRef.current.x - 10}px, ${ringPosRef.current.y - 10 + floatRef.current}px)`;
      }
      requestAnimationFrame(animateRing);
    };

    const raf = requestAnimationFrame(animateRing);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', onMouseOver);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', onMouseOver);
      ripples.forEach(el => el.remove());
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[9999]"
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: '#2563EB',
          boxShadow: '0 0 4px rgba(37,99,235,0.5), 0 0 10px rgba(37,99,235,0.2)',
          transform: 'translate(-100px, -100px)',
          transition: 'transform 0.06s ease-out',
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        className="fixed pointer-events-none z-[9998]"
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          border: '1px solid rgba(37,99,235,0.12)',
          background: 'transparent',
          backdropFilter: 'blur(var(--cursor-ring-blur, 4px))',
          WebkitBackdropFilter: 'blur(var(--cursor-ring-blur, 4px))',
          transform: 'translate(-100px, -100px)',
          transition: 'width 0.25s ease, height 0.25s ease, background 0.25s ease, border-color 0.25s ease, opacity 0.15s ease',
          willChange: 'transform',
        }}
      />
      <div
        ref={splashRef}
        className="fixed pointer-events-none z-[9997]"
        style={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
          opacity: 0,
          transform: 'scale(0)',
          left: -100,
          top: -100,
          willChange: 'transform',
        }}
      />
    </>
  );
}
