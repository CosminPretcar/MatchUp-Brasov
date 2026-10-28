import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  return (
    <footer className="w-full bg-transparent">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="text-base font-bold text-on-surface">MatchUp Brașov</span>
          <p className="text-xs text-on-surface-variant">{t('Făcut cu pasiune pentru fotbalul amator din Brașov.')}</p>
        </div>
        <div className="text-center md:text-right">
          <p className="text-xs text-on-surface-variant">© 2026 MatchUp Brașov. {t('Toate drepturile rezervate.')}</p>
        </div>
      </div>
    </footer>
  );
};