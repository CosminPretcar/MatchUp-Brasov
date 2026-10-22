import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, User, Shield, Trophy, MapPin, Phone, Mail, 
  Save, CheckCircle2, AlertCircle, Sparkles, Footprints, Flame 
} from 'lucide-react';
import { playerTranslations, getLabel, type Language } from '../utils/translations';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL } from '../utils/api';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  onProfileUpdated?: () => void;
}

interface ProfileData {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  position: string;
  preferredFoot: string;
  skillLevel: string;
  preferredZone: string;
  bio: string;
  fairPlayScore: number;
  matchesPlayed: number;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  token,
  onProfileUpdated 
}) => {
  const { language, t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [initialFormData, setInitialFormData] = useState<ProfileData | null>(null);
  const lang: Language = language;

  const [formData, setFormData] = useState<ProfileData>({
    id: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    role: '',
    position: 'unspecified',
    preferredFoot: 'unspecified',
    skillLevel: 'unspecified',
    preferredZone: 'all',
    bio: '',
    fairPlayScore: 5.0,
    matchesPlayed: 0
  });
  const hasUnsavedChanges = initialFormData !== null && (
    formData.phoneNumber !== initialFormData.phoneNumber ||
    formData.position !== initialFormData.position ||
    formData.preferredFoot !== initialFormData.preferredFoot ||
    formData.skillLevel !== initialFormData.skillLevel ||
    formData.preferredZone !== initialFormData.preferredZone ||
    formData.bio !== initialFormData.bio
  );

  const handleClose = useCallback(() => {
    if (hasUnsavedChanges && !window.confirm(t('Ai modificări nesalvate. Sigur vrei să închizi profilul?'))) {
      return;
    }
    onClose();
  }, [hasUnsavedChanges, onClose]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // Load the profile from the backend
  useEffect(() => {
    if (!isOpen || !token) return;

    const fetchProfile = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const response = await fetch(`${API_BASE_URL}/api/profile/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(t('Nu s-a putut încărca profilul.'));
        }

        const data: ProfileData = await response.json();
        setFormData({
          ...data,
          phoneNumber: data.phoneNumber || '',
          bio: data.bio || ''
        });
        setInitialFormData({
          ...data,
          phoneNumber: data.phoneNumber || '',
          bio: data.bio || ''
        });
      } catch (err: any) {
        setErrorMsg(err.message || t('Profilul nu a putut fi încărcat. Încearcă din nou.'));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isOpen, token]);

  // Save the profile to the backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/profile/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber || null,
          position: formData.position,
          preferredFoot: formData.preferredFoot,
          skillLevel: formData.skillLevel,
          preferredZone: formData.preferredZone,
          bio: formData.bio || null
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        if (response.status === 403) {
          throw new Error(t('Nu ai permisiunea de a modifica un profil de jucător.'));
        }
        const validationMessage = errData?.errors
          ? Object.values(errData.errors).flat().join(' ')
          : null;
        throw new Error(t(validationMessage || errData?.message || 'Profilul nu a putut fi salvat. Verifică datele introduse.'));
      }

      setInitialFormData(formData);
      setSuccessMsg(t('Profilul a fost actualizat cu succes!'));
      if (onProfileUpdated) onProfileUpdated();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || t('A apărut o eroare.'));
    } finally {
      setSaving(false);
    }
  };

if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={handleClose} 
        className="fixed inset-0 bg-[#090C12]/80 backdrop-blur-md transition-opacity"
      />

      {/* Centering wrapper that prevents the modal from being pushed above the viewport */}
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
        
        {/* Modal card with an adaptive maximum height */}
        <div className="relative z-10 w-full max-w-[640px] max-h-[85vh] flex flex-col bg-[#161B26]/95 border border-[#263042] rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl text-left">
          
          {/* Fixed header that remains visible */}
          <div className="relative px-6 pt-6 pb-4 sm:px-8 border-b border-[#263042]/60 flex items-center justify-between flex-shrink-0 bg-[#161B26]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">{t('Profil Jucător')}</h2>
                <p className="text-xs text-slate-400">{t('Personalizează-ți fișa de meci și atributele')}</p>
              </div>
            </div>

            <button 
              type="button" 
              onClick={handleClose}
              className="w-9 h-9 rounded-full bg-[#1D2433]/70 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#1D2433] transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal body with internal scrolling */}
          <div className="px-6 py-5 sm:px-8 overflow-y-auto flex-1">
            
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-semibold">{t('Se încarcă profilul...')}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Error and success messages */}
                {errorMsg && (
                  <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}
                {successMsg && (
                  <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {/* Statistics badges */}
                <div className="grid grid-cols-2 gap-3 p-4 bg-[#1D2433]/60 border border-white/5 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{t('Fair-Play Score')}</span>
                      <span className="text-lg font-black text-amber-400">{formData.fairPlayScore.toFixed(1)} / 5.0</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{t('Meciuri Jucate')}</span>
                      <span className="text-lg font-black text-emerald-400">{formData.matchesPlayed} {t('Meciuri')}</span>
                    </div>
                  </div>
                </div>

                {/* Personal information */}
                <div className="space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">{t('Date Personale')}</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-300">
                        {t('Nume Complet')} <span className="text-[10px] text-slate-500">({t('nu poate fi modificat')})</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                        <input 
                          type="text" 
                          value={formData.fullName}
                          readOnly
                          aria-readonly="true"
                          className="w-full pl-10 pr-4 py-2.5 bg-[#1D2433]/80 border border-[#263042] rounded-xl text-sm text-slate-400 cursor-not-allowed focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-300">{t('Telefon (pentru WhatsApp)')}</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                        <input 
                          type="tel" 
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                          maxLength={20}
                          pattern="^\+?[0-9\s()\-]{7,20}$"
                          placeholder="07xx xxx xxx"
                          className="w-full pl-10 pr-4 py-2.5 bg-[#1D2433]/80 border border-[#263042] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* On-field attributes */}
                <div className="space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">{t('Atribute pe Teren')}</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    
                    {/* Position */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-emerald-400" /> {t('Poziție Preferată')}
                      </label>
                      <select
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        className="w-full py-2.5 px-3 bg-[#1D2433]/80 border border-[#263042] rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
                      >
                        {Object.keys(playerTranslations.positions).map((key) => (
                          <option key={key} value={key} className="bg-[#161B26]">
                            {getLabel('positions', key, lang)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Preferred foot */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1">
                        <Footprints className="w-3.5 h-3.5 text-emerald-400" /> {t('Picior Bază')}
                      </label>
                      <select
                        value={formData.preferredFoot}
                        onChange={(e) => setFormData({ ...formData, preferredFoot: e.target.value })}
                        className="w-full py-2.5 px-3 bg-[#1D2433]/80 border border-[#263042] rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
                      >
                        {Object.keys(playerTranslations.feet).map((key) => (
                          <option key={key} value={key} className="bg-[#161B26]">
                            {getLabel('feet', key, lang)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Skill level */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> {t('Nivel de Joc')}
                      </label>
                      <select
                        value={formData.skillLevel}
                        onChange={(e) => setFormData({ ...formData, skillLevel: e.target.value })}
                        className="w-full py-2.5 px-3 bg-[#1D2433]/80 border border-[#263042] rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
                      >
                        {Object.keys(playerTranslations.skills).map((key) => (
                          <option key={key} value={key} className="bg-[#161B26]">
                            {getLabel('skills', key, lang)}
                          </option>
                        ))}
                      </select>
                    </div>

                  </div>

                  {/* Preferred neighborhood */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {t('Cartier Favorit în Brașov')}
                    </label>
                    <select
                      value={formData.preferredZone}
                      onChange={(e) => setFormData({ ...formData, preferredZone: e.target.value })}
                      className="w-full py-2.5 px-3 bg-[#1D2433]/80 border border-[#263042] rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
                    >
                      <option value="all" className="bg-[#161B26]">{t('Toate cartierele din Brașov')}</option>
                      <option value="tractorul" className="bg-[#161B26]">Tractorul (Coresi & Rulmentul)</option>
                      <option value="astra" className="bg-[#161B26]">Astra / Saturn</option>
                      <option value="bartolomeu" className="bg-[#161B26]">Bartolomeu & Stadionului</option>
                      <option value="noua" className="bg-[#161B26]">Noua & Dârste</option>
                      <option value="centru" className="bg-[#161B26]">Centrul Civic / Schei</option>
                    </select>
                  </div>

                  {/* Bio */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">{t('Scurtă Descriere / Bio')}</label>
                    <textarea
                      rows={2}
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      maxLength={500}
                      placeholder={t('ex: Joc din plăcere în timpul săptămânii după ora 19:00. Disponibil și ca rezervă de urgență.')}
                      className="w-full px-3 py-2 bg-[#1D2433]/80 border border-[#263042] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
                    />
                  </div>
                </div>

                {/* Save button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saving || !hasUnsavedChanges}
                    className="w-full py-3 px-6 rounded-xl font-extrabold text-sm text-slate-950 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 hover:from-lime-400 hover:to-emerald-400 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? t('Se salvează...') : hasUnsavedChanges ? t('Salvează Profilul') : t('Profil salvat')}</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};