import React from 'react';
import { Search, MapPin, Calendar, Clock, Trophy } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Hero: React.FC = () => {
  const { t } = useLanguage();
  return (
    <section id="gaseste-terenuri" className="relative w-full overflow-hidden px-6 pb-10 pt-6 md:pt-12">
      {/* Glow effects */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-primary/15 blur-[120px] rounded-full"></div>
      <div className="pointer-events-none absolute top-72 -left-32 w-80 h-80 bg-secondary/10 blur-[100px] rounded-full"></div>

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

        {/* Search Bar */}
        <div className="w-full bg-surface-container/85 backdrop-blur-xl p-4 md:p-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.55)]">
          <form className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1">
                <MapPin className="w-4 h-4 text-primary" /> {t('Zona / Cartier Brașov')}
              </label>
              <select className="w-full h-12 bg-surface-container-high text-on-surface text-sm rounded-xl px-4 appearance-none focus:outline-none cursor-pointer">
                <option value="toate">{t('Toate cartierele')}</option>
                <option value="tractorul">{t('Tractorul (Rulmentul & Coresi)')}</option>
                <option value="astra">{t('Astra / Saturn')}</option>
                <option value="bartolomeu">{t('Bartolomeu & Stadionului')}</option>
                <option value="noua">{t('Noua & Dârste')}</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1">
                <Calendar className="w-4 h-4 text-primary" /> {t('Data Meciului')}
              </label>
              <select className="w-full h-12 bg-surface-container-high text-on-surface text-sm rounded-xl px-4 appearance-none focus:outline-none cursor-pointer">
                <option>{t('Azi, 24 Mai')}</option>
                <option>{t('Mâine, 25 Mai')}</option>
                <option>{t('Sâmbătă (Weekend)')}</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1">
                <Clock className="w-4 h-4 text-primary" /> {t('Interval Orar')}
              </label>
              <select className="w-full h-12 bg-surface-container-high text-on-surface text-sm rounded-xl px-4 appearance-none focus:outline-none cursor-pointer">
                <option>{t('20:00 - 22:00 (Nocturnă Prime)')}</option>
                <option>{t('18:00 - 20:00 (După job)')}</option>
                <option>{t('22:00 - 24:00 (Late kick)')}</option>
              </select>
            </div>

            <button type="button" className="w-full h-12 bg-primary text-on-primary font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_-2px_rgba(78,222,163,0.35)] hover:bg-primary/90 transition-all">
              <Search className="w-5 h-5" />
              <span>{t('Găsește Terenuri')}</span>
            </button>

          </form>
        </div>

      </div>
    </section>
  );
};