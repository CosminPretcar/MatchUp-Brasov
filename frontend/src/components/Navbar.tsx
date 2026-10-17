import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import logoNavbar from '../assets/logo_navbar.svg';

const navigationLinks = [
  { href: '#gaseste-terenuri', label: 'Găsește Terenuri' },
  { href: '#meciuri-active', label: 'Caută Jucători' },
  { href: '#panou-proprietari', label: 'Pentru Proprietari' },
  { href: '#faq', label: 'FAQ' },
];

interface NavbarProps {
  user?: any;
  onOpenAuth?: (tab?: 'login' | 'register') => void;
  onLogout?: () => void;
}

export const Navbar = ({ user, onOpenAuth, onLogout }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.3)]">
      <div className="h-20 max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <a href="#" className="font-headline text-lg text-on-surface tracking-tight font-bold transition-transform duration-300 hover:scale-105 active:scale-95 inline-block">
            <img src={logoNavbar} alt="Matchup Brașov" className="h-16 w-auto object-contain" />
          </a>
        </div>

        {/* Desktop navigation menu */}
        <nav className="hidden lg:flex items-center gap-1 p-1">
          {navigationLinks.map((link) => (
            <a 
              key={link.href} 
              href={link.href} 
              className="px-4 py-2 rounded-xl text-sm font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 inline-block"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop authentication area */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-200">
                Salut, <strong>{user.fullName}</strong>
              </span>
              <button
                onClick={onLogout}
                className="px-3.5 py-1.5 text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 cursor-pointer"
              >
                Deconectare
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onOpenAuth?.('login')}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-on-surface hover:text-primary hover:bg-surface-container/50 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 cursor-pointer inline-block"
              >
                Autentificare
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth?.('register')}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-primary-container text-on-primary-container shadow-[0_0_20px_-2px_rgba(16,185,129,0.3)] hover:brightness-110 hover:shadow-[0_0_25px_2px_rgba(16,185,129,0.5)] transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 cursor-pointer inline-block"
              >
                Creează Cont
              </button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden p-2 rounded-xl text-on-surface hover:bg-surface-container transition-all duration-300 hover:scale-110 active:scale-90 cursor-pointer"
          aria-label={isMenuOpen ? 'Închide meniul' : 'Deschide meniul'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {isMenuOpen && (
        <nav className="lg:hidden border-t border-surface-container-high bg-surface px-6 py-4 shadow-xl">
          <div className="flex flex-col gap-2">
            {navigationLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all duration-200 active:scale-98"
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
                    className="px-3 py-1.5 text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-all active:scale-95"
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
                  className="w-full py-3 rounded-xl text-sm font-bold bg-primary-container text-on-primary-container text-center transition-all duration-300 ease-in-out hover:brightness-110 active:scale-95 cursor-pointer shadow-lg"
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