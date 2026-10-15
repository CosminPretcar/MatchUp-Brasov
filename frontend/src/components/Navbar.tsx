import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import logoNavbar from '../assets/logo_navbar.svg';

const navigationLinks = [
  { href: '#găsește-terenuri', label: 'Găsește Terenuri' },
  { href: '#meciuri-active', label: 'Caută Jucători' },
  { href: '#panou-proprietari', label: 'Pentru Proprietari' },
  { href: '#faq', label: 'FAQ' },
];

interface NavbarProps {
  user?: any;
  onOpenAuth?: () => void;
  onLogout?: () => void;
}

export const Navbar = ({ user, onOpenAuth, onLogout }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.3)]">
      <div className="h-20 max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="font-headline text-lg text-on-surface tracking-tight font-bold">
            <img src={logoNavbar} alt="Matchup Brașov" className="h-16 w-auto object-contain" />
          </span>
        </div>

        {/* Meniu Navigare Desktop */}
        <nav className="hidden lg:flex items-center gap-1 p-1">
          {navigationLinks.map((link) => (
            <a key={link.href} href={link.href} className="px-4 py-2 rounded-xl text-sm font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all">
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zona de Autentificare Desktop */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-200">
                Salut, <strong>{user.fullName}</strong>
              </span>
              <button
                onClick={onLogout}
                className="px-3.5 py-1.5 text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-all cursor-pointer"
              >
                Deconectare
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-on-surface hover:text-primary transition-colors cursor-pointer"
              >
                Autentificare
              </button>
              <button
                type="button"
                onClick={onOpenAuth}
                className="px-5 py-2 rounded-xl text-sm font-bold bg-primary-container text-on-primary-container shadow-[0_0_20px_-2px_rgba(16,185,129,0.3)] hover:brightness-105 transition-all cursor-pointer"
              >
                Creează Cont
              </button>
            </>
          )}
        </div>

        {/* Buton Meniu Mobil */}
        <button
          type="button"
          className="lg:hidden p-2 rounded-xl text-on-surface hover:bg-surface-container transition-colors"
          aria-label={isMenuOpen ? 'Închide meniul' : 'Deschide meniul'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Meniu Mobil Dropdown */}
      {isMenuOpen && (
        <nav className="lg:hidden border-t border-surface-container-high bg-surface px-6 py-4 shadow-xl">
          <div className="flex flex-col gap-2">
            {navigationLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}

            <div className="pt-2 border-t border-surface-container-high mt-1">
              {user ? (
                <div className="flex items-center justify-between px-2 py-1">
                  <span className="text-sm font-semibold text-slate-200">
                    Salut, <strong>{user.fullName}</strong>
                  </span>
                  <button
                    onClick={() => {
                      if (onLogout) onLogout();
                      setIsMenuOpen(false);
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-all"
                  >
                    Deconectare
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenAuth) onOpenAuth();
                    setIsMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-xl text-sm font-bold bg-primary-container text-on-primary-container text-center transition-all cursor-pointer"
                >
                  Autentificare / Înregistrare
                </button>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};