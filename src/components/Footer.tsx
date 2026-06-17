import Link from 'next/link';
import { HeartPulse } from 'lucide-react';

export function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-tertiary)',
      borderTop: '1px solid var(--card-border)',
      boxShadow: '0 -4px 24px var(--card-shadow)',
    }}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-3">
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HeartPulse size={16} style={{ color: '#FFFFFF' }} />
              </div>
              <span className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>MedLink SA</span>
            </Link>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              South Africa&apos;s digital health ecosystem connecting patients, providers, and facilities.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-secondary)' }}>Platform</h4>
            <div className="space-y-2">
              <Link href="/explore" className="block text-xs" style={{ color: 'var(--text-muted)' }}>Explore</Link>
              <Link href="/get-started" className="block text-xs" style={{ color: 'var(--text-muted)' }}>Get Started</Link>
              <Link href="/sign-in" className="block text-xs" style={{ color: 'var(--text-muted)' }}>Sign In</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-secondary)' }}>Portals</h4>
            <div className="space-y-2">
              <Link href="/patient/dashboard" className="block text-xs" style={{ color: 'var(--text-muted)' }}>Patient Portal</Link>
              <Link href="/doctor/dashboard" className="block text-xs" style={{ color: 'var(--text-muted)' }}>Doctor Portal</Link>
              <Link href="/hospital/dashboard" className="block text-xs" style={{ color: 'var(--text-muted)' }}>Hospital Portal</Link>
              <Link href="/admin/dashboard" className="block text-xs" style={{ color: 'var(--text-muted)' }}>Admin Portal</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-secondary)' }}>Contact</h4>
            <div className="space-y-2">
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>support@medlink.co.za</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>+27 21 000 0000</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Cape Town, South Africa</p>
            </div>
          </div>
        </div>
        <div className="pt-6 border-t" style={{ borderColor: 'var(--card-border)' }}>
          <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            &copy; 2026 MedLink SA. Secure, connected healthcare infrastructure.
          </p>
        </div>
      </div>
    </footer>
  );
}
