import React, { useState } from 'react';
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

export function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container">
      <Navbar 
        user={user} 
        onOpenAuth={() => setIsAuthModalOpen(true)} 
        onLogout={handleLogout} 
      />
      <main className="pt-20">
        <Hero />
        <StatsTicker />
        <Features />
        <HowItWorks />
        <LiveMatches />
        <B2BCallout />
        <Faq />
        <FinalCta />
      </main>
      <Footer />

      {/* Authentication/registration modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(userData) => setUser(userData)}
      />
    </div>
  );
}

export default App;