import React from 'react';

export const StatsTicker: React.FC = () => {
  return (
    <section className="w-full bg-surface-container-lowest py-8 px-6 shadow-inner">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        
        <div className="flex flex-col items-center">
          <span className="text-3xl md:text-5xl text-primary font-extrabold tracking-tight">18+</span>
          <span className="text-sm md:text-base text-on-surface font-semibold mt-1">Terenuri Sintetice Partenere</span>
          <span className="text-xs text-on-surface-variant">în toate cartierele din Brașov</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-3xl md:text-5xl text-secondary font-extrabold tracking-tight">4.200+</span>
          <span className="text-sm md:text-base text-on-surface font-semibold mt-1">Meciuri Rezervate</span>
          <span className="text-xs text-on-surface-variant">în ultimul an competițional</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-3xl md:text-5xl text-tertiary font-extrabold tracking-tight">2.800+</span>
          <span className="text-sm md:text-base text-on-surface font-semibold mt-1">Fotbaliști Amatori</span>
          <span className="text-xs text-on-surface-variant">activi în comunitatea locală</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-3xl md:text-5xl text-on-surface font-extrabold tracking-tight">99.2%</span>
          <span className="text-sm md:text-base text-on-surface font-semibold mt-1">Rată de Desfășurare</span>
          <span className="text-xs text-on-surface-variant">fără meciuri anulate pe WhatsApp</span>
        </div>

      </div>
    </section>
  );
};