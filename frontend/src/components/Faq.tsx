import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const Faq: React.FC = () => {
  const { t } = useLanguage();
  return (
    <section className="w-full py-16 px-6 bg-surface-container-lowest/40" id="faq">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <div className="text-center space-y-2">
          <span className="text-primary text-xs font-bold tracking-widest uppercase">{t('Întrebări Frecvente')}</span>
          <h2 className="text-2xl md:text-4xl text-on-surface font-extrabold">{t('Tot ce vrei să știi înainte de meci')}</h2>
        </div>
        <div className="flex flex-col gap-4 pt-4">
          <details className="group bg-surface-container-low rounded-xl p-5 transition-all open:bg-surface-container cursor-pointer">
            <summary className="flex items-center justify-between text-lg text-on-surface list-none font-bold">
              <span>{t('Cum funcționează dacă sunt singur și nu am echipă în Brașov?')}</span>
            </summary>
            <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
              {t('Intri la secțiunea „Meciuri Deschise”, alegi terenul și ora convenabilă și apeși „Mă alătur”. Îți alegi poziția, plătești cota ta și ești adăugat automat în lot cu confirmare pe WhatsApp.')}
            </p>
          </details>
          <details className="group bg-surface-container-low rounded-xl p-5 transition-all open:bg-surface-container cursor-pointer">
            <summary className="flex items-center justify-between text-lg text-on-surface list-none font-bold">
              <span>{t('Ce se întâmplă dacă un jucător confirmat nu mai apare la meci?')}</span>
            </summary>
            <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
              {t('Fiecare jucător are un scor de Fair-Play. Dacă cineva renunță fără să anunțe cu cel puțin 3 ore înainte, cota este reținută, iar sistemul activează automat o alertă de înlocuire în zonă.')}
            </p>
          </details>
          <details className="group bg-surface-container-low rounded-xl p-5 transition-all open:bg-surface-container cursor-pointer">
            <summary className="flex items-center justify-between text-lg text-on-surface list-none font-bold">
              <span>{t('Cum se face plata pentru închirierea unui teren întreg?')}</span>
            </summary>
            <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
              {t('Poți achita avansul online sau poți folosi opțiunea „Împarte plata” generând un link rapid trimis prietenilor pe WhatsApp.')}
            </p>
          </details>
        </div>
      </div>
    </section>
  );
};