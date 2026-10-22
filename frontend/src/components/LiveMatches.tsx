import React from 'react';
import { Clock, UserPlus, ShieldAlert, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const LiveMatches: React.FC = () => {
  const { t } = useLanguage();
  return (
    <section className="w-full py-16 px-6" id="meciuri-active">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-3 h-3 rounded-full bg-secondary animate-pulse"></span>
              <span className="text-xs text-secondary font-extrabold uppercase tracking-widest">{t('Feed Live Brașov')}</span>
            </div>
            <h2 className="text-2xl md:text-4xl text-on-surface font-extrabold">{t('Meciuri Deschise Chiar Acum')}</h2>
            <p className="text-sm md:text-base text-on-surface-variant">{t('Alătură-te ca jucător individual sau cu încă un prieten în partidele de diseară.')}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 bg-surface-container p-1 rounded-xl">
            <button className="px-4 py-1.5 rounded-lg bg-surface-container-high text-on-surface text-sm font-bold shadow-sm">{t('Toate')}</button>
            <button className="px-4 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface text-sm transition-colors">{t('Azi')}</button>
            <button className="px-4 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface text-sm transition-colors">{t('Mâine')}</button>
            <button className="px-4 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface text-sm transition-colors">{t('Weekend')}</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between hover:bg-surface-container transition-all shadow-xl group">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-secondary-container/20 text-secondary text-xs font-bold flex items-center gap-1 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span> {t('Se caută 3 jucători')}
                </span>
                <span className="text-sm text-primary font-extrabold">30 RON / om</span>
              </div>
              <div>
                <h3 className="text-lg text-on-surface font-bold group-hover:text-primary transition-colors">
                  {t('Teren Sintetic Tractorul')}
                </h3>
                <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-1">
                  <Clock className="w-4 h-4 text-primary" /> {t('Azi, 20:00 - 21:30 (90 min)')}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 py-1">
                <div className="bg-surface-container p-2 rounded-lg flex flex-col">
                  <span className="text-[10px] text-on-surface-variant uppercase">{t('Format')}</span>
                  <span className="text-xs text-on-surface font-bold">{t('6 vs 6 Sintetic')}</span>
                </div>
                <div className="bg-surface-container p-2 rounded-lg flex flex-col">
                  <span className="text-[10px] text-on-surface-variant uppercase">{t('Nivel Joc')}</span>
                  <span className="text-xs text-on-surface font-bold">{t('Mediu / Tehnic')}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs text-on-surface-variant">
                  <span>{t('Ocupare lot: 9/12 confirmați')}</span>
                  <span className="text-secondary font-bold">{t('3 sloturi libere')}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-secondary w-3/4 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="pt-4">
              <button className="w-full py-2.5 rounded-xl bg-primary-container text-on-primary-container text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:brightness-105 transition-all">
                <UserPlus className="w-4 h-4" /> {t('Mă alătur meciului')}
              </button>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between hover:bg-surface-container transition-all shadow-xl group">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-tertiary-container/20 text-tertiary text-xs font-bold flex items-center gap-1 shadow-sm">
                  <ShieldAlert className="w-3.5 h-3.5 animate-pulse" /> {t('Urgență: 1 Portar')}
                </span>
                <span className="text-sm text-primary font-extrabold">25 RON / om</span>
              </div>
              <div>
                <h3 className="text-lg text-on-surface font-bold group-hover:text-primary transition-colors">
                  {t('Baza Sportivă Bartolomeu')}
                </h3>
                <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-1">
                  <Clock className="w-4 h-4 text-primary" /> {t('Azi, 21:30 - 22:30 (60 min)')}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 py-1">
                <div className="bg-surface-container p-2 rounded-lg flex flex-col">
                  <span className="text-[10px] text-on-surface-variant uppercase">{t('Format')}</span>
                  <span className="text-xs text-on-surface font-bold">{t('5 vs 5 Clasic')}</span>
                </div>
                <div className="bg-surface-container p-2 rounded-lg flex flex-col">
                  <span className="text-[10px] text-on-surface-variant uppercase">{t('Nivel Joc')}</span>
                  <span className="text-xs text-on-surface font-bold">{t('Amator / Relaxat')}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs text-on-surface-variant">
                  <span>{t('Ocupare lot: 9/10 confirmați')}</span>
                  <span className="text-tertiary font-bold">{t('Portar lipsă!')}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-tertiary w-[90%] rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="pt-4">
              <button className="w-full py-2.5 rounded-xl bg-tertiary text-on-tertiary text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:brightness-105 transition-all">
                <Sparkles className="w-4 h-4" /> {t('Intru ca Portar')}
              </button>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between hover:bg-surface-container transition-all shadow-xl group">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-bold shadow-sm">
                  {t('Mâine seară • 2 locuri libere')}
                </span>
                <span className="text-sm text-primary font-extrabold">35 RON / om</span>
              </div>
              <div>
                <h3 className="text-lg text-on-surface font-bold group-hover:text-primary transition-colors">
                  Arena Astra Sud
                </h3>
                <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-1">
                  <Clock className="w-4 h-4 text-primary" /> {t('Mâine, 19:30 - 21:00 (90 min)')}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 py-1">
                <div className="bg-surface-container p-2 rounded-lg flex flex-col">
                  <span className="text-[10px] text-on-surface-variant uppercase">{t('Format')}</span>
                  <span className="text-xs text-on-surface font-bold">{t('6 vs 6 Competițional')}</span>
                </div>
                <div className="bg-surface-container p-2 rounded-lg flex flex-col">
                  <span className="text-[10px] text-on-surface-variant uppercase">{t('Nivel Joc')}</span>
                  <span className="text-xs text-on-surface font-bold">{t('Competitiv / Rapid')}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs text-on-surface-variant">
                  <span>{t('Ocupare lot: 10/12 confirmați')}</span>
                  <span className="text-primary font-bold">{t('2 sloturi libere')}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                  <div className="h-full bg-primary w-[83%] rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="pt-4">
              <button className="w-full py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-sm font-bold flex items-center justify-center gap-2 transition-all">
                <UserPlus className="w-4 h-4" /> {t('Rezervă locul')}
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};