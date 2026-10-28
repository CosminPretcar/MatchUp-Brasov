import { useState } from 'react';
import { Menu, X, User as UserIcon } from 'lucide-react';
import logoNavbar from '../assets/logo_navbar.svg';
import { ProfileModal } from './ProfileModal';
import { useLanguage } from '../context/LanguageContext';

// Link sets for each user role
const guestLinks = [
  { href: '#gaseste-terenuri', label: 'Găsește Terenuri' },
  { href: '#meciuri-active', label: 'Caută Jucători' },
  { href: '#panou-proprietari', label: 'Pentru Proprietari' },
  { href: '#faq', label: 'FAQ' },
];

const playerLinks = [
  { href: '#gaseste-terenuri', label: 'Găsește Terenuri' },
  { href: '#meciuri-active', label: 'Meciuri Deschise' },
  { href: '#rezervarile-mele', label: 'Rezervările mele' },
  { href: '#faq', label: 'FAQ' },
];

const ownerLinks = [
  { href: '#panou-proprietari', label: 'Panou Administrare' },
  { href: '#terenurile-mele', label: 'Terenurile mele' },
  { href: '#rezervari-primite', label: 'Rezervări primite' },
];

interface NavbarProps {
  user?: {
    fullName?: string;
    role?: number | string;
    token?: string;
  } | null;
  onOpenAuth?: (tab?: 'login' | 'register') => void;
  onLogout?: () => void;
}

export const Navbar = ({ user, onOpenAuth, onLogout }: NavbarProps) => {
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Determine the user role
  const isOwner = user?.role === 1 || user?.role === 'FieldOwner';
  const isPlayer = user && !isOwner;

  // Select the links based on the user role
  let navLinks = guestLinks;
  if (isOwner) navLinks = ownerLinks;
  else if (isPlayer) navLinks = playerLinks;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.3)]">
      <div className="h-20 max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <a href="#top" className="font-headline text-lg text-on-surface tracking-tight font-bold transition-transform duration-300 hover:scale-105 active:scale-95 inline-block">
            <img src={logoNavbar} alt="Matchup Brașov" className="h-16 w-auto object-contain" />
          </a>
        </div>

        {/* Dynamic desktop navigation */}
        <nav className="hidden lg:flex items-center gap-1 p-1">
          {navLinks.map((link) => (
            <a 
              key={link.href} 
              href={link.href} 
              className="px-4 py-2 rounded-xl text-sm font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 inline-block"
            >
              {t(link.label)}
            </a>
          ))}
        </nav>

        {/* Desktop authentication and profile area */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              
              {/* User profile - available only to players */}
              <div
                className={`flex items-center gap-2.5 text-right ${isPlayer ? 'group cursor-pointer hover:opacity-90 transition-all' : ''}`}
                onClick={isPlayer ? () => setIsProfileModalOpen(true) : undefined}
                role={isPlayer ? 'button' : undefined}
                tabIndex={isPlayer ? 0 : undefined}
                onKeyDown={isPlayer ? (event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    setIsProfileModalOpen(true);
                  }
                } : undefined}
                title={isPlayer ? 'Deschide profilul' : undefined}
              >
                <div className="flex flex-col items-end">
                  <span className={`text-sm font-bold text-on-surface ${isPlayer ? 'group-hover:text-primary transition-colors' : ''}`}>
                    {user.fullName}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isOwner 
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {t(isOwner ? 'Proprietar Teren' : 'Jucător')}
                  </span>
                </div>

                <div className={`w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-primary border border-white/10 ${isPlayer ? 'group-hover:border-primary/50 group-hover:scale-105 transition-all' : ''}`}>
                  <UserIcon className="w-4 h-4" />
                </div>
              </div>

              {/* Logout button */}
              <button
                type="button"
                onClick={onLogout}
                className="px-3.5 py-1.5 text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 cursor-pointer"
              >
                {t('Deconectare')}
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onOpenAuth?.('login')}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-on-surface hover:text-primary hover:bg-surface-container/50 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 cursor-pointer inline-block"
              >
                {t('Autentificare')}
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth?.('register')}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-primary-container text-on-primary-container shadow-[0_0_20px_-2px_rgba(16,185,129,0.3)] hover:brightness-110 hover:shadow-[0_0_25px_2px_rgba(16,185,129,0.5)] transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 cursor-pointer inline-block"
              >
                {t('Creează Cont')}
              </button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden p-2 rounded-xl text-on-surface hover:bg-surface-container transition-all duration-300 hover:scale-110 active:scale-90 cursor-pointer"
          aria-label={t(isMenuOpen ? 'Închide meniul' : 'Deschide meniul')}
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
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all duration-200 active:scale-98"
                onClick={() => setIsMenuOpen(false)}
              >
                {t(link.label)}
              </a>
            ))}

            <div className="pt-2 border-t border-surface-container-high mt-1">
              {user ? (
                <div className="flex items-center justify-between px-2 py-1">
                  <div
                    className={`flex items-center gap-2.5 text-left ${isPlayer ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
                    onClick={isPlayer ? () => {
                      setIsProfileModalOpen(true);
                      setIsMenuOpen(false);
                    } : undefined}
                    role={isPlayer ? 'button' : undefined}
                    tabIndex={isPlayer ? 0 : undefined}
                    onKeyDown={isPlayer ? (event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        setIsProfileModalOpen(true);
                        setIsMenuOpen(false);
                      }
                    } : undefined}
                  >
                    <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary border border-white/10">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-on-surface">
                        {user.fullName}
                      </span>
                      <span className="text-[10px] font-extrabold text-primary uppercase">
                        {t(isOwner ? 'Proprietar Teren' : 'Jucător')}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (onLogout) onLogout();
                      setIsMenuOpen(false);
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-all active:scale-95"
                  >
                    {t('Deconectare')}
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
                  {t('Autentificare')} / {t('Creează Cont')}
                </button>
              )}
            </div>
          </div>
        </nav>
      )}

      <button
        type="button"
        onClick={() => setLanguage(language === 'ro' ? 'en' : 'ro')}
        role="switch"
        aria-checked={language === 'en'}
        className="absolute right-20 top-5 z-[60] flex h-8 w-[72px] items-center rounded-full border border-white/10 bg-surface-container-high p-1 text-[10px] font-extrabold text-on-surface shadow-xl transition hover:bg-surface-container-highest lg:right-6"
        aria-label={language === 'ro' ? t('Schimbă în engleză') : t('Schimbă în română')}
      >
        <span className={`z-10 flex-1 text-center transition-colors ${language === 'ro' ? 'text-slate-950' : 'text-slate-400'}`}>
          RO
        </span>
        <span className={`z-10 flex-1 text-center transition-colors ${language === 'en' ? 'text-slate-950' : 'text-slate-400'}`}>
          EN
        </span>
        <span
          aria-hidden="true"
          className={`absolute top-1 h-6 w-8 rounded-full bg-primary transition-transform ${language === 'en' ? 'translate-x-8' : 'translate-x-0'}`}
        />
      </button>

      {/* Player profile modal */}
      {isPlayer && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          token={user.token ?? ''}
        />
      )}
    </header>
  );
};