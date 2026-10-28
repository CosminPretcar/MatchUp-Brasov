import { useEffect, useState } from 'react';
import { MapPin, Sun, Car, DoorClosed, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { apiRequest } from '../utils/api';
import type { Field } from '../types/field';
import { BookingModal } from './BookingModal';

type FieldsListProps = {
  onRequireAuth?: () => void;
};

export function FieldsList({ onRequireAuth }: FieldsListProps) {
  const { t } = useLanguage();
  const [fields, setFields] = useState<Field[]>([]);
  const [zone, setZone] = useState('all');
  const [sportsType, setSportsType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const zoneLabels: Record<string, string> = {
    tractorul: 'Tractorul',
    astra: 'Astra',
    bartolomeu: 'Bartolomeu',
    noua: 'Noua',
    centru: 'Centru',
    schei: 'Șchei',
    triaj: 'Triaj',
    florilor: 'Florilor',
  };
  const sportLabels: Record<string, string> = {
    football: 'Fotbal',
    tennis: 'Tenis',
    padel: 'Padel',
    basketball: 'Baschet',
  };
  const [selectedField, setSelectedField] = useState<Field | null>(null);

  useEffect(() => {
    const params = new URLSearchParams({ zone, sportsType });
    // The request state is intentionally reset before each external fetch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);
    apiRequest<Field[]>(`/api/field?${params}`)
      .then(setFields)
      .catch((requestError) => {
        setError(requestError instanceof Error ? requestError.message : 'Terenurile nu au putut fi încărcate.');
      })
      .finally(() => setLoading(false));
  }, [zone, sportsType]);

  return (
    <section id="gaseste-terenuri" className="mx-auto max-w-7xl px-6 py-12">
      <div className="rounded-3xl border border-white/5 bg-surface-container/60 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.2)] md:p-7">
        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-on-surface">{t('Găsește Terenuri')}</h2>
            <p className="mt-1 text-sm text-on-surface-variant">{t('Alege terenul potrivit pentru următorul tău meci.')}</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex min-w-44 flex-col gap-1 text-xs font-bold text-on-surface-variant">
              {t('Zonă')}
              <select value={zone} onChange={(event) => setZone(event.target.value)} className="h-11 rounded-xl bg-surface-container-high px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="all">{t('Toate zonele')}</option>
                {['tractorul', 'astra', 'bartolomeu', 'noua', 'centru', 'schei', 'triaj', 'florilor'].map((value) => (
                  <option key={value} value={value}>{zoneLabels[value]}</option>
                ))}
              </select>
            </label>
            <label className="flex min-w-44 flex-col gap-1 text-xs font-bold text-on-surface-variant">
              {t('Sport')}
              <select value={sportsType} onChange={(event) => setSportsType(event.target.value)} className="h-11 rounded-xl bg-surface-container-high px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="all">{t('Toate sporturile')}</option>
                {['football', 'tennis', 'padel', 'basketball'].map((value) => (
                  <option key={value} value={value}>{sportLabels[value]}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

      {loading && <p className="text-sm text-on-surface-variant">{t('Se încarcă...')}</p>}
      {error && <p className="rounded-xl bg-red-500/10 p-4 text-sm text-red-400">{error}</p>}
      {!loading && !error && fields.length === 0 && <p className="rounded-xl border border-dashed border-surface-container-high p-8 text-center text-on-surface-variant">{t('Nu există terenuri disponibile.')}</p>}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {fields.map((field) => (
          <article key={field.id} className="rounded-2xl border border-white/5 bg-surface-container p-5">
            <h3 className="text-lg font-bold text-on-surface">{field.name}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-on-surface-variant"><MapPin className="h-4 w-4 text-primary" />{field.location}</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              {sportLabels[field.sportsType] || field.sportsType} · {zoneLabels[field.zone] || field.zone}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-sm font-bold text-primary">{field.pricePerHour} RON/oră</span>
              <span className="text-xs text-on-surface-variant">{field.ownerName}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-on-surface-variant">
              {field.hasLighting && <span className="flex items-center gap-1 rounded-lg bg-surface-container-high px-2 py-1"><Sun className="h-3.5 w-3.5" />{t('Nocturnă')}</span>}
              {field.hasChangingRooms && <span className="flex items-center gap-1 rounded-lg bg-surface-container-high px-2 py-1"><DoorClosed className="h-3.5 w-3.5" />{t('Vestiare')}</span>}
              {field.hasParking && <span className="flex items-center gap-1 rounded-lg bg-surface-container-high px-2 py-1"><Car className="h-3.5 w-3.5" />{t('Parcare')}</span>}
              {field.isCovered && <span className="flex items-center gap-1 rounded-lg bg-surface-container-high px-2 py-1"><Shield className="h-3.5 w-3.5" />{t('Acoperit')}</span>}
            </div>
            <button
              type="button"
              onClick={() => {
                if (onRequireAuth) {
                  onRequireAuth();
                  return;
                }
                setSelectedField(field);
              }}
              className="mt-5 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-on-primary transition hover:brightness-110"
            >
              {t('Rezervă terenul')}
            </button>
          </article>
        ))}
      </div>
      </div>
      {selectedField && (
        <BookingModal
          field={selectedField}
          onClose={() => setSelectedField(null)}
        />
      )}
    </section>
  );
}
