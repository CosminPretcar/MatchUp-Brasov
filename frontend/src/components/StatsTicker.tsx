import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const StatsTicker: React.FC = () => {
  const { language } = useLanguage();
  const text = language === 'ro'
    ? ['Terenuri Sintetice Partenere', 'în toate cartierele din Brașov', 'Meciuri Rezervate', 'în ultimul an competițional', 'Fotbaliști Amatori', 'activi în comunitatea locală', 'Rată de Desfășurare', 'fără meciuri anulate pe WhatsApp']
    : ['Partner Synthetic Fields', 'across all Brașov neighborhoods', 'Booked Matches', 'in the last competitive year', 'Amateur Footballers', 'active in the local community', 'Match Completion Rate', 'with no matches canceled on WhatsApp'];
  return (
    <section className="w-full bg-surface-container-lowest py-8 px-6 shadow-inner">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        
        <div className="flex flex-col items-center">
          <span className="text-3xl md:text-5xl text-primary font-extrabold tracking-tight">18+</span>
          <span className="text-sm md:text-base text-on-surface font-semibold mt-1">{text[0]}</span>
          <span className="text-xs text-on-surface-variant">{text[1]}</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-3xl md:text-5xl text-secondary font-extrabold tracking-tight">4.200+</span>
          <span className="text-sm md:text-base text-on-surface font-semibold mt-1">{text[2]}</span>
          <span className="text-xs text-on-surface-variant">{text[3]}</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-3xl md:text-5xl text-tertiary font-extrabold tracking-tight">2.800+</span>
          <span className="text-sm md:text-base text-on-surface font-semibold mt-1">{text[4]}</span>
          <span className="text-xs text-on-surface-variant">{text[5]}</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-3xl md:text-5xl text-on-surface font-extrabold tracking-tight">99.2%</span>
          <span className="text-sm md:text-base text-on-surface font-semibold mt-1">{text[6]}</span>
          <span className="text-xs text-on-surface-variant">{text[7]}</span>
        </div>

      </div>
    </section>
  );
};