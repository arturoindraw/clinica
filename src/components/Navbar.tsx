import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { CaathLogo } from './CaathLogo';

interface NavbarProps {
  onQuickSchedule: () => void;
}

const NAV_LINKS = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#tecnologia', label: 'Tecnología' },
  { href: '#convenios', label: 'Convenios' },
  { href: '#ubicacion', label: 'Ubicación' },
];

export function Navbar({ onQuickSchedule }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0B2545]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line brand mark */}
        <a
          href="#inicio"
          aria-label="CAATH Inicio"
          className="whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
        >
          <CaathLogo size="sm" showSubtitle={false} />
        </a>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-200 hover:text-white hover:underline underline-offset-8 decoration-cyan-400 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded px-1 py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 Primary CTA button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onQuickSchedule}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-[#06172D] bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Agendar Cita
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          aria-label="Menú móvil"
          className="md:hidden bg-[#06172D] border-t border-white/10 px-4 py-4 space-y-1"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-3 rounded-lg text-base font-medium text-slate-100 hover:bg-white/10 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#ubicacion"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-3 rounded-lg text-base font-medium text-slate-100 hover:bg-white/10 transition-colors"
          >
            Contacto
          </a>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onQuickSchedule();
              }}
              className="w-full py-3 px-4 rounded-lg text-sm font-semibold text-[#06172D] bg-cyan-400 hover:bg-cyan-300 transition-colors"
            >
              Agendar Cita
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
