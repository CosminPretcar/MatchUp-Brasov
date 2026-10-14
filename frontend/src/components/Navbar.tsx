import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import logoNavbar from '../assets/logo_navbar.svg';

const navigationLinks = [
  { href: '#găsește-terenuri', label: 'Găsește Terenuri' },
  { href: '#meciuri-active', label: 'Caută Jucători' },
  { href: '#panou-proprietari', label: 'Pentru Proprietari' },
  { href: '#faq', label: 'FAQ' },
];

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.3)]">
      <div className="h-20 max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-headline text-lg text-on-surface tracking-tight font-bold">
            <img src={logoNavbar} alt="Matchup Brașov" className="h-16 w-auto object-contain" />
          </span>
        </div>
        <nav className="hidden lg:flex items-center gap-1 p-1">
          {navigationLinks.map((link) => (
            <a key={link.href} href={link.href} className="px-4 py-2 rounded-xl text-sm font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-4">
          <a href="#autentificare" className="px-4 py-2 rounded-xl text-sm font-semibold text-on-surface hover:text-primary transition-colors">Autentificare</a>
          <a href="#inregistrare" className="px-5 py-2 rounded-xl text-sm font-bold bg-primary-container text-on-primary-container shadow-[0_0_20px_-2px_rgba(16,185,129,0.3)] hover:brightness-105 transition-all">Creează Cont</a>
        </div>
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
      {isMenuOpen && (
        <nav className="lg:hidden border-t border-surface-container-high bg-surface px-6 py-4 shadow-xl">
          <div className="flex flex-col gap-1">
            {navigationLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-3 rounded-xl text-sm font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#autentificare"
              className="px-4 py-3 rounded-xl text-sm font-semibold text-on-surface hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Autentificare
            </a>
            <a
              href="#inregistrare"
              className="px-4 py-3 rounded-xl text-sm font-bold bg-primary-container text-on-primary-container"
              onClick={() => setIsMenuOpen(false)}
            >
              Creează Cont
            </a>
          </div>
        </nav>
      )}
    </header>
  );
};