import React from 'react';
import { CheckCircle2, TrendingUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const B2BCallout: React.FC = () => {
  const { t } = useLanguage();
  return (
    <section className="w-full py-16 px-6" id="panou-proprietari">
      <div className="max-w-7xl mx-auto rounded-3xl bg-surface-container-low p-8 md:p-14 relative overflow-hidden shadow-2xl">
        <div className="pointer-events-none absolute -right-20 -top-20 w-96 h-96 bg-primary-container/20 rounded-full blur-[100px]"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          
          <div className="lg:col-span-7 flex flex-col gap-6">
            <span className="px-4 py-1 rounded-full bg-surface-container text-primary text-xs font-bold uppercase tracking-wider w-fit">
              {t('Parteneriate Baze Sportive Brașov')}
            </span>
            <h2 className="text-2xl md:text-4xl text-on-surface font-extrabold leading-tight">
              {t('Deții sau administrezi un teren sintetic în Brașov?')}
            </h2>
            <p className="text-base text-on-surface-variant leading-relaxed">
              {t('Elimină orele moarte de la prânz și din weekend. Fără apeluri la ore târzii și fără bătăi de cap cu avansurile. Ai o gestiune impecabilă a terenului într-un panou modern.')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm text-on-surface font-bold">{t('Calendar Auto')}</span>
                  <span className="text-xs text-on-surface-variant">{t('Sincronizat live')}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm text-on-surface font-bold">{t('Avans Garantat')}</span>
                  <span className="text-xs text-on-surface-variant">{t('Direct pe card')}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm text-on-surface font-bold">{t('3.000+ Jucători')}</span>
                  <span className="text-xs text-on-surface-variant">{t('Acces direct la audiență')}</span>
                </div>
              </div>
            </div>
            <div className="pt-2 flex flex-wrap gap-4">
              <button className="px-8 py-4 rounded-xl bg-primary text-on-primary font-bold shadow-[0_0_20px_rgba(78,222,163,0.3)] hover:brightness-105 transition-all">
                {t('Înregistrează Baza Sportivă')}
              </button>
              <button className="px-8 py-4 rounded-xl bg-surface-container hover:bg-surface-container-highest text-on-surface font-semibold transition-all">
                {t('Programează un Demo Gratuit')}
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-surface-container p-6 rounded-2xl shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary"></span>
                <span className="text-sm text-on-surface font-bold">{t('Ocupare Săptămânală')}</span>
              </div>
              <span className="text-xs text-primary font-bold">{t('+18% vs luna trecută')}</span>
            </div>
            <div className="space-y-2">
              <div className="bg-surface-container-high p-3 rounded-xl flex items-center justify-between">
                <span className="text-sm text-on-surface">{t('Luni - Vineri (18:00 - 23:00)')}</span>
                <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-xs font-bold">{t('100% Ocupat')}</span>
              </div>
              <div className="bg-surface-container-high p-3 rounded-xl flex items-center justify-between">
                <span className="text-sm text-on-surface">{t('Weekend Nocturnă')}</span>
                <span className="px-2 py-0.5 rounded bg-secondary/20 text-secondary text-xs font-bold">{t('92% Ocupat')}</span>
              </div>
              <div className="bg-surface-container-high p-3 rounded-xl flex items-center justify-between">
                <span className="text-sm text-on-surface">{t('Ore de Zi (12:00 - 17:00)')}</span>
                <span className="px-2 py-0.5 rounded bg-tertiary/20 text-tertiary text-xs font-bold">{t('Sloturi Reduse')}</span>
              </div>
            </div>
            <div className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between mt-2">
              <div>
                <p className="text-xs text-on-surface-variant">{t('Încasări intermediate săptămâna aceasta')}</p>
                <p className="text-xl text-on-surface font-extrabold text-primary">4.850 RON</p>
              </div>
              <TrendingUp className="w-7 h-7 text-primary" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};