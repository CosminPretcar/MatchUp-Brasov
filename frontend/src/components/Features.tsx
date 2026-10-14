import React from 'react';
import { Zap, Users, BarChart3, ArrowRight } from 'lucide-react';

export const Features: React.FC = () => {
  return (
    <section className="w-full py-16 px-6 relative">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        
        {/* Section Title */}
        <div className="flex flex-col items-center text-center space-y-3 max-w-3xl mx-auto">
          <span className="px-4 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase">
            De ce MatchUp Brașov
          </span>
          <h2 className="text-2xl md:text-4xl text-on-surface font-extrabold">
            Tot ce ai nevoie pentru fotbalul de marți seara și de weekend
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant">
            Adio grupuri haotice de WhatsApp cu zeci de mesaje fără sens. Găsești teren liber sau oameni potriviți în doar câteva atingeri.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col justify-between hover:bg-surface-container transition-all group shadow-lg">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-8 h-8" />
                </div>
                <span className="px-3 py-1 rounded-full bg-surface-container-high text-primary text-xs font-bold uppercase">
                  Disponibilitate Live
                </span>
              </div>
              <h3 className="text-xl text-on-surface font-bold">Rezervări Online Rapid</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Vezi orele libere în timp real pe terenurile din Tractorul, Bartolomeu sau Noua. Confirmi și plătești direct online, fără telefoane date pe nocturnă.
              </p>
            </div>
            <div className="pt-6 flex items-center gap-2 text-primary text-sm font-bold">
              <span>Explorează terenurile disponibile</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col justify-between hover:bg-surface-container transition-all group shadow-xl relative overflow-hidden">
            <div className="pointer-events-none absolute -right-10 -bottom-10 w-40 h-40 bg-secondary/10 rounded-full blur-2xl"></div>
            <div className="flex flex-col gap-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-xl bg-secondary-container/30 text-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8" />
                </div>
                <span className="px-3 py-1 rounded-full bg-secondary-container/20 text-secondary text-xs font-bold uppercase">
                  Fără meciuri anulate
                </span>
              </div>
              <h3 className="text-xl text-on-surface font-bold">Sistem Inteligent de Matchmaking</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                A picat un fundaș sau nu aveți portar cu 2 ore înainte de fluier? Deschizi meciul în platformă și jucătorii din zonă primesc alertă instant.
              </p>
            </div>
            <div className="pt-6 flex items-center gap-2 text-secondary text-sm font-bold relative z-10">
              <span>Vezi cum găsești coechipieri</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col justify-between hover:bg-surface-container transition-all group shadow-lg">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-xl bg-tertiary-container/20 text-tertiary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-8 h-8" />
                </div>
                <span className="px-3 py-1 rounded-full bg-surface-container-high text-tertiary text-xs font-bold uppercase">
                  Grad Ocupare 95%
                </span>
              </div>
              <h3 className="text-xl text-on-surface font-bold">Panou pentru Administratori</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Dacă deții o bază sportivă în Brașov, elimini orele goale din orar, automatizezi avansurile și transmiți confirmări instant jucătorilor.
              </p>
            </div>
            <div className="pt-6 flex items-center gap-2 text-tertiary text-sm font-bold">
              <span>Funcții pentru baze sportive</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};