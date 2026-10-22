import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsTicker } from './components/StatsTicker';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { LiveMatches } from './components/LiveMatches';
import { B2BCallout } from './components/B2BCallout';
import { Faq } from './components/Faq';
import { FinalCta } from './components/FinalCta';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { AddFieldModal } from './components/AddFieldModal';
import { FieldsList } from './components/FieldsList';
import { isTokenExpired, msUntilTokenExpiry } from './utils/auth';
import { Building2, MapPin, Pencil, PlusCircle, Power, Trash2 } from 'lucide-react';
import { useLanguage } from './context/LanguageContext';
import { apiRequest } from './utils/api';
import type { Field } from './types/field';

export function App() {
  const { t } = useLanguage();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [fieldsLoading, setFieldsLoading] = useState(false);
  const [fieldsError, setFieldsError] = useState<string | null>(null);
  const [fieldActionId, setFieldActionId] = useState<string | null>(null);
  const [fieldSuccess, setFieldSuccess] = useState<string | null>(null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    if (isTokenExpired(parsed?.token)) {
      localStorage.removeItem('user');
      return null;
    }
    return parsed;
  });

  // Automatically log out when the JWT expires
  useEffect(() => {
    if (!user?.token) return;
    const ms = msUntilTokenExpiry(user.token);
    if (ms <= 0) {
      handleLogout();
      return;
    }
    const timer = setTimeout(() => {
      handleLogout();
    }, ms);
    return () => clearTimeout(timer);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleOpenAuth = (tab: 'login' | 'register' = 'login') => {
    setAuthTab(tab);
    setIsAuthModalOpen(true);
  };

  // Identify the user role (0 = Player, 1 = FieldOwner)
  const isOwner = user?.role === 1 || user?.role === 'FieldOwner';
  const isPlayer = user && !isOwner;

  const loadMyFields = async () => {
    if (!user?.token) return;

    setFieldsLoading(true);
    setFieldsError(null);
    try {
      setFields(await apiRequest<Field[]>('/api/field/my-fields'));
    } catch (error) {
      setFieldsError(error instanceof Error ? error.message : 'Terenurile nu au putut fi încărcate.');
    } finally {
      setFieldsLoading(false);
    }
  };

  const updateFieldStatus = async (field: Field) => {
    setFieldActionId(field.id);
    setFieldsError(null);
    setFieldSuccess(null);
    try {
      await apiRequest(`/api/field/${field.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify(!field.isActive),
      });
      await loadMyFields();
      setFieldSuccess(t(field.isActive ? 'Terenul a fost dezactivat.' : 'Terenul a fost reactivat.'));
    } catch (error) {
      setFieldsError(error instanceof Error ? error.message : 'Statusul terenului nu a putut fi actualizat.');
    } finally {
      setFieldActionId(null);
    }
  };

  const deleteField = async (field: Field) => {
    if (!window.confirm(`${t('Ștergi terenul')} "${field.name}"?`)) return;
    setFieldActionId(field.id);
    setFieldsError(null);
    setFieldSuccess(null);
    try {
      await apiRequest(`/api/field/${field.id}`, { method: 'DELETE' });
      await loadMyFields();
      setFieldSuccess(t('Terenul a fost șters.'));
    } catch (error) {
      setFieldsError(error instanceof Error ? error.message : 'Terenul nu a putut fi șters.');
    } finally {
      setFieldActionId(null);
    }
  };

  useEffect(() => {
    if (isOwner) {
      void loadMyFields();
    } else {
      setFields([]);
    }
  }, [isOwner, user?.token]);

  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container">
      <Navbar 
        user={user} 
        onOpenAuth={handleOpenAuth} 
        onLogout={handleLogout} 
      />

      <main className="pt-20">
        {/* 1. FIELD OWNER VIEW */}
        {isOwner && (
          <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
            <div className="bg-surface-container-low p-8 rounded-3xl border border-surface-container-high shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider border border-amber-500/30">
                  {t('Panou Administrare Bază Sportivă')}
                </span>
                <h1 className="text-3xl font-extrabold text-on-surface mt-2">
                  {t('Bine ai revenit')}, {user.fullName}!
                </h1>
                <p className="text-sm text-on-surface-variant mt-1">
                  {t('Gestionează orarul terenurilor, rezervările primite și gradul de ocupare.')}
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setIsAddFieldModalOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-5 h-5" />
                {t('Adaugă Teren Nou')}
              </button>
            </div>

            {/* Quick owner statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface-container p-6 rounded-2xl flex items-center justify-between border border-white/5">
                <div>
                  <p className="text-xs text-on-surface-variant">{t('Terenuri Active')}</p>
                  <p className="text-2xl font-bold text-on-surface mt-1">{fields.filter((field) => field.isActive).length} {t('Terenuri')}</p>
                </div>

                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <div className="bg-surface-container p-6 rounded-2xl flex items-center justify-between border border-white/5">
                <div>
                  <p className="text-xs text-on-surface-variant">{t('Terenuri inactive')}</p>
                  <p className="text-2xl font-bold text-on-surface mt-1">{fields.filter((field) => !field.isActive).length}</p>
                </div>
                <Power className="w-8 h-8 text-secondary" />
              </div>
              <div className="bg-surface-container p-6 rounded-2xl flex items-center justify-between border border-white/5">
                <div>
                  <p className="text-xs text-on-surface-variant">{t('Facilități disponibile')}</p>
                  <p className="text-2xl font-bold text-primary mt-1">
                    {fields.filter((field) => field.isActive).reduce((count, field) => count + Number(field.hasLighting) + Number(field.hasChangingRooms) + Number(field.hasParking) + Number(field.isCovered), 0)}
                  </p>
                </div>
                <Building2 className="w-8 h-8 text-primary" />
              </div>
            </div>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-on-surface">{t('Terenurile mele')}</h2>
                {fieldsLoading && (
                  <span className="text-sm text-on-surface-variant">{t('Se încarcă...')}</span>
                )}
              </div>

              {fieldsError && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                  {fieldsError}
                </div>
              )}
              {fieldSuccess && (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400">
                  {fieldSuccess}
                </div>
              )}

              {!fieldsLoading && !fieldsError && fields.length === 0 && (
                <div className="rounded-2xl border border-dashed border-surface-container-high bg-surface-container p-8 text-center text-on-surface-variant">
                  {t('Nu ai adăugat încă niciun teren.')}
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {fields.map((field) => (
                  <article key={field.id} className="rounded-2xl border border-white/5 bg-surface-container p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-on-surface">{field.name}</h3>
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-on-surface-variant">
                          <MapPin className="h-4 w-4 text-primary" />
                          {field.location}
                        </p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${field.isActive ? 'bg-primary/10 text-primary' : 'bg-slate-500/20 text-slate-400'}`}>
                        {field.isActive ? t('Activ') : t('Inactiv')} · {field.pricePerHour} RON/oră
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-on-surface-variant">
                      <span className="rounded-lg bg-surface-container-high px-2.5 py-1">{field.sportsType}</span>
                      <span className="rounded-lg bg-surface-container-high px-2.5 py-1">{field.zone}</span>
                      {field.hasLighting && <span className="rounded-lg bg-surface-container-high px-2.5 py-1">{t('Nocturnă')}</span>}
                      {field.isCovered && <span className="rounded-lg bg-surface-container-high px-2.5 py-1">{t('Acoperit')}</span>}
                    </div>
                    {field.description && (
                      <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">{field.description}</p>
                    )}
                    <div className="mt-5 flex gap-2">
                      <button type="button" onClick={() => { setEditingField(field); setIsAddFieldModalOpen(true); }} className="flex items-center gap-1.5 rounded-lg bg-surface-container-high px-3 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container-highest">
                        <Pencil className="h-3.5 w-3.5" /> {t('Editează')}
                      </button>
                      <button type="button" disabled={fieldActionId === field.id} onClick={() => void updateFieldStatus(field)} className="flex items-center gap-1.5 rounded-lg bg-surface-container-high px-3 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container-highest disabled:cursor-wait disabled:opacity-50">
                        <Power className="h-3.5 w-3.5" /> {field.isActive ? t('Dezactivează') : t('Reactivează')}
                      </button>
                      <button type="button" disabled={fieldActionId === field.id} onClick={() => void deleteField(field)} className="flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20 disabled:cursor-wait disabled:opacity-50">
                        <Trash2 className="h-3.5 w-3.5" /> {t('Șterge')}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* B2BCallout component for the owner dashboard */}
            <B2BCallout />
          </div>
        )}

        {/* 2. AUTHENTICATED PLAYER VIEW */}
        {isPlayer && (
          <>
            <Hero />
            <FieldsList />
            <StatsTicker />
            <LiveMatches />
            <Faq />
          </>
        )}

        {/* 3. GUEST VIEW */}
        {!user && (
          <>
            <Hero />
            <FieldsList />
            <StatsTicker />
            <Features />
            <HowItWorks />
            <LiveMatches />
            <B2BCallout />
            <Faq />
            <FinalCta />
          </>
        )}
      </main>

      <Footer />

      {/* Authentication / registration modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(userData) => setUser(userData)}
        defaultTab={authTab}
      />
      <AddFieldModal
        isOpen={isAddFieldModalOpen}
        field={editingField}
        onClose={() => {
          setIsAddFieldModalOpen(false);
          setEditingField(null);
        }}
        onSuccess={() => void loadMyFields()}
      />
    </div>
  );
}

export default App;