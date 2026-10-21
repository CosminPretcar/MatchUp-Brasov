import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsTicker } from './components/StatsTicker';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { LiveMatches } from './components/LiveMatches';
import { B2BCallout } from './components/B2BCallout';
import { Faq } from './components/Faq';
import { FinalCta } from './components/FinalCta';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { isTokenExpired, msUntilTokenExpiry } from './utils/auth';
import { Building2, Calendar, PlusCircle, TrendingUp } from 'lucide-react';

export function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    if (isTokenExpired(parsed?.token)) {
      localStorage.removeItem('user');
      return null;
    }
    return parsed;
  });

  // Auto-logout la expirarea token-ului JWT
  useEffect(() => {
    if (!user?.token) return;
    const ms = msUntilTokenExpiry(user.token);
    if (ms <= 0) {
      handleLogout();
      return;
    }
    const timer = setTimeout(() => {
      handleLogout();
    }, ms);
    return () => clearTimeout(timer);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleOpenAuth = (tab: 'login' | 'register' = 'login') => {
    setAuthTab(tab);
    setIsAuthModalOpen(true);
  };

  // Identificare rol utilizator (0 = Player, 1 = FieldOwner)
  const isOwner = user?.role === 1 || user?.role === 'FieldOwner';
  const isPlayer = user && !isOwner;

  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container">
      <Navbar 
        user={user} 
        onOpenAuth={handleOpenAuth} 
        onLogout={handleLogout} 
      />

      <main className="pt-20">
        {/* 1. VIZUALIZARE PROPRIETAR DE TEREN (FieldOwner) */}
        {isOwner && (
          <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
            <div className="bg-surface-container-low p-8 rounded-3xl border border-surface-container-high shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider border border-amber-500/30">
                  Panou Administrare Bază Sportivă
                </span>
                <h1 className="text-3xl font-extrabold text-on-surface mt-2">
                  Bine ai revenit, {user.fullName}!
                </h1>
                <p className="text-sm text-on-surface-variant mt-1">
                  Gestionează orarul terenurilor, rezervările primite și gradul de ocupare.
                </p>
              </div>
              <button 
                type="button" 
                className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-5 h-5" />
                Adaugă Teren Nou
              </button>
            </div>

            {/* Statistici rapide Proprietar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface-container p-6 rounded-2xl flex items-center justify-between border border-white/5">
                <div>
                  <p className="text-xs text-on-surface-variant">Terenuri Active</p>
                  <p className="text-2xl font-bold text-on-surface mt-1">2 Terenuri</p>
                </div>
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <div className="bg-surface-container p-6 rounded-2xl flex items-center justify-between border border-white/5">
                <div>
                  <p className="text-xs text-on-surface-variant">Rezervări Săptămâna Aceasta</p>
                  <p className="text-2xl font-bold text-on-surface mt-1">18 Sloturi</p>
                </div>
                <Calendar className="w-8 h-8 text-secondary" />
              </div>
              <div className="bg-surface-container p-6 rounded-2xl flex items-center justify-between border border-white/5">
                <div>
                  <p className="text-xs text-on-surface-variant">Încasări Estimate</p>
                  <p className="text-2xl font-bold text-primary mt-1">2.400 RON</p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </div>

            {/* Componenta B2BCallout pentru panoul proprietarului */}
            <B2BCallout />
          </div>
        )}

        {/* 2. VIZUALIZARE JUCĂTOR AUTENTIFICAT (Player) */}
        {isPlayer && (
          <>
            <Hero />
            <StatsTicker />
            <LiveMatches />
            <Faq />
          </>
        )}

        {/* 3. VIZUALIZARE VIZITATOR (GUEST / NEAUTENTIFICAT) */}
        {!user && (
          <>
            <Hero />
            <StatsTicker />
            <Features />
            <HowItWorks />
            <LiveMatches />
            <B2BCallout />
            <Faq />
            <FinalCta />
          </>
        )}
      </main>

      <Footer />

      {/* Modal Autentificare / Înregistrare */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(userData) => setUser(userData)}
        defaultTab={authTab}
      />
    </div>
  );
}

export default App;