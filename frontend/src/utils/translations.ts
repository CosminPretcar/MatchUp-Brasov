export type Language = 'ro' | 'en';

export const playerTranslations = {
  positions: {
    unspecified: { ro: 'Neselectat', en: 'Not specified' },
    goalkeeper:  { ro: 'Portar', en: 'Goalkeeper' },
    defender:    { ro: 'Fundaș', en: 'Defender' },
    midfielder:  { ro: 'Mijlocaș', en: 'Midfielder' },
    forward:     { ro: 'Atacant', en: 'Forward' },
  },
  feet: {
    unspecified: { ro: 'Neselectat', en: 'Not specified' },
    right:       { ro: 'Drept', en: 'Right' },
    left:        { ro: 'Stâng', en: 'Left' },
    both:        { ro: 'Ambele (Ambidextru)', en: 'Both' },
  },
  skills: {
    unspecified: { ro: 'Neselectat', en: 'Not specified' },
    beginner:    { ro: 'Începător', en: 'Beginner' },
    amateur:     { ro: 'Amator', en: 'Amateur' },
    advanced:    { ro: 'Avansat', en: 'Advanced' },
  }
};

// Simple display helper
export const getLabel = (
  category: keyof typeof playerTranslations, 
  key: string, 
  lang: Language = 'ro'
): string => {
  const group = playerTranslations[category] as Record<string, { ro: string; en: string }>;
  return group[key]?.[lang] || group['unspecified']?.[lang] || key;
};