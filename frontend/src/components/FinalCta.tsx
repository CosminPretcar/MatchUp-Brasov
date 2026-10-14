import React from 'react';
import { Trophy } from 'lucide-react';

export const FinalCta: React.FC = () => {
  return (
    <section className="w-full py-16 px-6 relative overflow-hidden">
      <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-low p-10 text-center flex flex-col items-center gap-6 relative shadow-2xl">
        <div className="pointer-events-none absolute inset-0 bg-primary/5 rounded-3xl"></div>
        <span className="w-14 h-14 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-lg">
          <Trophy className="w-8 h-8" />
        </span>
        <h2 className="text-2xl md:text-4xl text-on-surface font-extrabold max-w-2xl">
          Ai meci diseară sau stai acasă pe canapea?
        </h2>
        <p className="text-base text-on-surface-variant max-w-xl">
          Alătură-te celor peste 2.800 de fotbaliști amatori din Brașov care nu mai depind de scuze.
        </p>
        <div className="pt-2 flex flex-wrap gap-4 justify-center">
          <a href="#meciuri-active" className="px-8 py-4 rounded-xl bg-primary text-on-primary font-bold shadow-[0_0_24px_rgba(78,222,163,0.4)] hover:scale-[1.02] transition-all">
            Găsește Meciul Tău Acum
          </a>
        </div>
      </div>
    </section>
  );
};