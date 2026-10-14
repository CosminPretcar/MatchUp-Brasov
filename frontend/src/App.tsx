import React from 'react';
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

export function App() {
  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container">
      <Navbar />
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
    </div>
  );
}

export default App;