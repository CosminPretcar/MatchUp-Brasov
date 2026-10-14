import React from 'react';
import logoNavbar from '../assets/logo_navbar.svg';

export const Navbar: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.3)]">
      <div className="h-20 max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-headline text-lg text-on-surface tracking-tight font-bold">
            <img src={logoNavbar} alt="Matchup Brașov" className="h-16 w-auto object-contain" />
          </span>
        </div>
        <nav className="hidden lg:flex items-center gap-1 p-1">
          <a href="#găsește-terenuri" className="px-4 py-2 rounded-xl text-sm font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all">Găsește Terenuri</a>
          <a href="#meciuri-active" className="px-4 py-2 rounded-xl text-sm font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all">Caută Jucători</a>
          <a href="#panou-proprietari" className="px-4 py-2 rounded-xl text-sm font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all">Pentru Proprietari</a>
          <a href="#faq" className="px-4 py-2 rounded-xl text-sm font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all">FAQ</a>
        </nav>
        <div className="flex items-center gap-4">
          <a href="#autentificare" className="px-4 py-2 rounded-xl text-sm font-semibold text-on-surface hover:text-primary transition-colors">Autentificare</a>
          <a href="#inregistrare" className="px-5 py-2 rounded-xl text-sm font-bold bg-primary-container text-on-primary-container shadow-[0_0_20px_-2px_rgba(16,185,129,0.3)] hover:brightness-105 transition-all">Creează Cont</a>
        </div>
      </div>
    </header>
  );
};