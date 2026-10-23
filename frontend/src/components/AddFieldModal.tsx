import React, { useEffect, useState } from 'react';
import { X, MapPin, DollarSign, Dumbbell, Sun, DoorClosed, Car, Shield, AlertCircle, Loader2 } from 'lucide-react';
import { apiRequest } from '../utils/api';
import type { Field, FieldPayload } from '../types/field';
import { useLanguage } from '../context/LanguageContext';

interface AddFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  field?: Field | null;
}

const emptyForm: FieldPayload = {
  name: '',
  location: '',
  zone: 'tractorul',
  description: '',
  pricePerHour: 100,
  sportsType: 'football',
  hasLighting: false,
  hasChangingRooms: false,
  hasParking: false,
  isCovered: false,
};

export const AddFieldModal: React.FC<AddFieldModalProps> = ({ isOpen, onClose, onSuccess, field }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<FieldPayload>({ ...emptyForm });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    // Form state mirrors the field selected by the parent when the modal opens.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setError(null);
    setFormData(field ? {
      name: field.name,
      location: field.location,
      zone: field.zone,
      description: field.description || '',
      pricePerHour: field.pricePerHour,
      sportsType: field.sportsType,
      hasLighting: field.hasLighting,
      hasChangingRooms: field.hasChangingRooms,
      hasParking: field.hasParking,
      isCovered: field.isCovered,
    } : { ...emptyForm });
  }, [field, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !loading) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.name.trim() || !formData.location.trim()) {
        throw new Error(t('Numele și adresa terenului sunt obligatorii.'));
      }
      if (Number(formData.pricePerHour) < 0) {
        throw new Error(t('Prețul nu poate fi negativ.'));
      }

      const path = field ? `/api/field/${field.id}` : '/api/field';
      await apiRequest(path, {
        method: field ? 'PUT' : 'POST',
        body: JSON.stringify({
          ...formData,
          name: formData.name.trim(),
          location: formData.location.trim(),
          description: formData.description?.trim(),
          pricePerHour: Number(formData.pricePerHour),
        }),
      });

      setFormData({ ...emptyForm });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ceva nu a mers bine. Încearcă din nou.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !loading) onClose();
    }}>
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-white my-8" role="dialog" aria-modal="true" aria-labelledby="field-modal-title">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 id="field-modal-title" className="text-xl font-bold text-emerald-400">{field ? t('Editează terenul') : t('Adaugă Teren Nou')}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mesaj de eroare */}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Formular */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Nume Teren */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Nume Teren / Bază Sportivă
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="ex: Baza Sportivă ProSport Tractorul"
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Adresă și Cartier */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Adresă Fizică
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="ex: Str. Turnului nr. 5"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 pl-9 pr-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Cartier (Zona Brașov)
              </label>
              <select
                name="zone"
                value={formData.zone}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="tractorul">Tractorul</option>
                <option value="astra">Astra</option>
                <option value="bartolomeu">Bartolomeu</option>
                <option value="noua">Noua</option>
                <option value="centru">Centru</option>
                <option value="schei">Șchei</option>
                <option value="triaj">Triaj</option>
                <option value="florilor">Florilor</option>
              </select>
            </div>
          </div>

          {/* Sport și Preț */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Tip Sport
              </label>
              <div className="relative">
                <Dumbbell className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <select
                  name="sportsType"
                  value={formData.sportsType}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 pl-9 pr-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="football">Fotbal</option>
                  <option value="tennis">Tenis</option>
                  <option value="padel">Padel</option>
                  <option value="basketball">Baschet</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Preț / Oră (RON)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="number"
                  name="pricePerHour"
                  min="0"
                  step="5"
                  required
                  value={formData.pricePerHour}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 pl-9 pr-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Descriere */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Descriere / Reguli Teren (Opțional)
            </label>
            <textarea
              name="description"
              rows={2}
              value={formData.description}
              onChange={handleChange}
              placeholder="Detalii suplimentare despre suprafață, regulament etc."
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none resize-none"
            />
          </div>

          {/* Facilități (Checkboxes) */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Facilități Disponibile
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                formData.hasLighting ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : 'border-slate-800 bg-slate-950 text-slate-400'
              }`}>
                <input
                  type="checkbox"
                  name="hasLighting"
                  checked={formData.hasLighting}
                  onChange={handleChange}
                  className="hidden"
                />
                <Sun className="h-4 w-4" />
                <span className="text-xs font-medium">Nocturnă</span>
              </label>

              <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                formData.hasChangingRooms ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : 'border-slate-800 bg-slate-950 text-slate-400'
              }`}>
                <input
                  type="checkbox"
                  name="hasChangingRooms"
                  checked={formData.hasChangingRooms}
                  onChange={handleChange}
                  className="hidden"
                />
                <DoorClosed className="h-4 w-4" />
                <span className="text-xs font-medium">Vestiare / Dușuri</span>
              </label>

              <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                formData.hasParking ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : 'border-slate-800 bg-slate-950 text-slate-400'
              }`}>
                <input
                  type="checkbox"
                  name="hasParking"
                  checked={formData.hasParking}
                  onChange={handleChange}
                  className="hidden"
                />
                <Car className="h-4 w-4" />
                <span className="text-xs font-medium">Parcare Proprie</span>
              </label>

              <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                formData.isCovered ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : 'border-slate-800 bg-slate-950 text-slate-400'
              }`}>
                <input
                  type="checkbox"
                  name="isCovered"
                  checked={formData.isCovered}
                  onChange={handleChange}
                  className="hidden"
                />
                <Shield className="h-4 w-4" />
                <span className="text-xs font-medium">Teren Acoperit / Balon</span>
              </label>
            </div>
          </div>

          {/* Butoane Acțiune */}
          <div className="flex justify-end gap-3 border-t border-slate-800 pt-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Renunță
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50 transition-colors"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? t('Se salvează...') : field ? t('Salvează modificările') : t('Adaugă Teren')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
