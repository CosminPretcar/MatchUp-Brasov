import React, { useState } from 'react';
import { 
  X, Zap, LogIn, UserPlus, Mail, Lock, Eye, EyeOff, 
  ArrowRight, Users, Building2, User, Phone, CheckCircle2, ShieldCheck 
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (userData: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'Player' | 'FieldOwner'>('Player');

  // Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // UI feedback states
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Endpoint backend local
  const API_BASE_URL = 'http://localhost:5056/api/auth';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Autentificare eșuată.');
      }

      // Salvăm utilizatorul autentificat în localStorage
      localStorage.setItem('user', JSON.stringify(data));
      if (onSuccess) onSuccess(data);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'A apărut o eroare la conectare.');
    } finally {
      setLoading(false);
    }
  };

const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrorMsg('');
  setLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: regFullName,
        email: regEmail,
        phoneNumber: regPhone || null,
        password: regPassword,
        role: selectedRole === 'Player' ? 0 : 1, // 0 = Player, 1 = FieldOwner
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Dacă backend-ul trimite erori de validare
      if (data.errors) {
        const firstError = Object.values(data.errors)[0] as string[];
        throw new Error(firstError[0] || 'Datele introduse sunt invalide.');
      }
      throw new Error(data.message || 'Înregistrare eșuată.');
    }

    localStorage.setItem('user', JSON.stringify(data));
    if (onSuccess) onSuccess(data);
    onClose();
  } catch (err: any) {
    setErrorMsg(err.message || 'A apărut o eroare la înregistrare.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 antialiased selection:bg-emerald-500 selection:text-black">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-[#090C12]/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-[540px] my-4 sm:my-8 bg-[#161B26]/95 border border-[#263042] rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
        
        {/* Ambient Glows */}
        <div className="absolute -top-24 -left-20 w-56 h-56 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-20 w-56 h-56 bg-lime-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 sm:px-8 sm:pt-8 border-b border-[#263042]/60">
          <button 
            type="button" 
            onClick={onClose}
            className="absolute top-5 right-5 sm:top-6 sm:right-6 w-9 h-9 rounded-full bg-[#1D2433]/70 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#1D2433] transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="relative flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-slate-900 border border-emerald-500/40 flex items-center justify-center">
              <Zap className="w-5 h-5 text-lime-400 fill-lime-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white">Match<span className="text-emerald-400">Up</span></span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-lime-400 tracking-wider">BRAȘOV</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Terenuri sintetice • Matchmaking rapid</p>
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {activeTab === 'login' ? 'Bine ai revenit pe teren!' : 'Alătură-te comunității!'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {activeTab === 'login' 
                ? 'Conectează-te pentru a rezerva terenuri și a te alătura meciurilor din oraș.' 
                : 'Creează un cont gratuit în mai puțin de un minut pentru meciuri rapide.'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="mt-5 p-1 bg-[#1D2433]/90 rounded-2xl border border-white/5 grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
              className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'login' 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Autentificare</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
              className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'register' 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Înregistrare</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="px-6 py-5 sm:px-8 sm:py-6 max-h-[72vh] overflow-y-auto">
          
          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Adresă de Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="nume@exemplu.ro"
                    className="w-full pl-10 pr-4 py-3 bg-[#1D2433]/70 border border-[#263042] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Parolă
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-[#1D2433]/70 border border-[#263042] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-6 rounded-xl font-extrabold text-sm text-slate-950 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 hover:from-lime-400 hover:to-emerald-400 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                <span>{loading ? 'Se conectează...' : 'Intră în cont'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              {/* Role Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Alege Tipul de Cont *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setSelectedRole('Player')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedRole === 'Player'
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-[#263042] bg-[#1D2433]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Users className="w-4 h-4" />
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${selectedRole === 'Player' ? 'border-emerald-400 bg-emerald-500' : 'border-slate-600'}`} />
                    </div>
                    <div className="font-bold text-sm text-white">Jucător</div>
                    <p className="text-xs text-slate-400 mt-1">Rezervă terenuri și găsește meciuri.</p>
                  </div>

                  <div
                    onClick={() => setSelectedRole('FieldOwner')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedRole === 'FieldOwner'
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-[#263042] bg-[#1D2433]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${selectedRole === 'FieldOwner' ? 'border-emerald-400 bg-emerald-500' : 'border-slate-600'}`} />
                    </div>
                    <div className="font-bold text-sm text-slate-200">Proprietar Teren</div>
                    <p className="text-xs text-slate-400 mt-1">Administrează baza sportivă.</p>
                  </div>
                </div>
              </div>

              {/* Nume complet */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Nume și Prenume
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="ex: Andrei Popescu"
                    className="w-full pl-10 pr-4 py-3 bg-[#1D2433]/70 border border-[#263042] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="andrei@email.ro"
                      className="w-full pl-10 pr-3 py-3 bg-[#1D2433]/70 border border-[#263042] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">Telefon</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="07xx xxx xxx"
                      className="w-full pl-10 pr-3 py-3 bg-[#1D2433]/70 border border-[#263042] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">Parolă</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Minim 6 caractere"
                    className="w-full pl-10 pr-10 py-3 bg-[#1D2433]/70 border border-[#263042] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 py-3.5 px-6 rounded-xl font-extrabold text-sm text-slate-950 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 hover:from-lime-400 hover:to-emerald-400 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                <span>{loading ? 'Se creează contul...' : `Creează Cont ${selectedRole === 'Player' ? 'Jucător' : 'Proprietar'}`}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#1D2433]/40 border-t border-[#263042]/50 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Date protejate prin criptare SSL</span>
          </div>
          <span>MatchUp Brașov</span>
        </div>

      </div>
    </div>
  );
};