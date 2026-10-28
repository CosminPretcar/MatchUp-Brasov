import React from 'react';
import { Calendar, Trophy } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Hero: React.FC = () => {
  const { t } = useLanguage();
  return (
    <section className="relative w-full px-6 pb-10 pt-6 md:pt-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-10 relative z-10">
        
        {/* Section Title and Main Description */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-high/90 shadow-[0_0_18px_rgba(16,185,129,0.25)]">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-ping"></span>
            <span className="text-xs text-secondary uppercase tracking-widest font-extrabold">Brașov Turf & Match Engine</span>
            <span className="text-xs text-on-surface-variant">• {t('18 Terenuri Verificate')}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight">
            {t('Rezervă terenul sintetic și ')}<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-container to-secondary">{t('strânge echipa')}</span>{t(' în câteva secunde.')}
          </h1>

          <p className="text-base md:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            {t('Singura platformă din Brașov unde verifici sloturi live pe nocturnă și completezi lotul când îți lipsesc 2-3 băieți pentru meci.')}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto">
            <a href="#meciuri-active" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary-container text-on-primary-container font-bold flex items-center justify-center gap-2 shadow-[0_0_24px_-2px_rgba(16,185,129,0.45)] hover:scale-[1.02] transition-all">
              <Trophy className="w-5 h-5" />
              {t('Caută un Meci Deschis')}
            </a>
            <a href="#panou-proprietari" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold flex items-center justify-center gap-2 transition-all shadow-md">
              <Calendar className="w-5 h-5 text-primary" />
              {t('Rezervă un Teren')}
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};