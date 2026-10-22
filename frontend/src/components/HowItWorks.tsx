import React from 'react';
import { Search, UserCheck, Trophy } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const HowItWorks: React.FC = () => {
  const { t } = useLanguage();
  return (
    <section className="w-full py-16 px-6 bg-surface-container-lowest/60">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-secondary text-xs font-bold tracking-widest uppercase">{t('Simplu, Clar & Fără Bătăi de Cap')}</span>
          <h2 className="text-2xl md:text-4xl text-on-surface font-extrabold">{t('De la idee la fluierul de start în 3 pași')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-surface-container-low p-6 rounded-2xl relative flex flex-col gap-4 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-4xl text-primary/40 font-extrabold leading-none">01</span>
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                <Search className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-xl text-on-surface font-bold">{t('Alege terenul sau meciul')}</h3>
            <p className="text-sm text-on-surface-variant">
              {t('Explorează terenurile sintetice din Brașov după dotări sau filtrează direct partidele amatoare care caută oameni.')}
            </p>
          </div>

          <div className="bg-surface-container-low p-6 rounded-2xl relative flex flex-col gap-4 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-4xl text-secondary/40 font-extrabold leading-none">02</span>
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-secondary">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-xl text-on-surface font-bold">{t('Confirmă slotul sau înscrie-te')}</h3>
            <p className="text-sm text-on-surface-variant">
              {t('Blochează ora dorită pentru echipa ta sau alătură-te cu un simplu click unui meci deschis. Plata cotei tale se face securizat în aplicație.')}
            </p>
          </div>

          <div className="bg-surface-container-low p-6 rounded-2xl relative flex flex-col gap-4 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-4xl text-tertiary/40 font-extrabold leading-none">03</span>
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-tertiary">
                <Trophy className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-xl text-on-surface font-bold">{t('Hai la fotbal!')}</h3>
            <p className="text-sm text-on-surface-variant">
              {t('Primești confirmarea instant pe WhatsApp cu instrucțiunile de acces, pinul de la vestiar și componența lotului. Vii direct încălzit.')}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};