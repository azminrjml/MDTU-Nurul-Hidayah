import React, { useState } from 'react';
import { 
  LogIn, 
  Lock, 
  Mail, 
  BookOpen, 
  ShieldCheck, 
  ArrowLeft, 
  AlertCircle,
  KeyRound,
  UserCheck
} from 'lucide-react';
import { AppStorage } from '../../lib/storage';
import { UserRole } from '../../types';

interface LoginPageProps {
  onNavigate: (path: string) => void;
  onLoginSuccess: (role: UserRole) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const institution = AppStorage.getInstitution();

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Mohon masukkan alamat email dan kata sandi.');
      return;
    }

    // Check credentials or default to super_admin / teacher / guardian
    if (email.includes('wali') || email.includes('hendra')) {
      AppStorage.switchUserRole('guardian');
      onLoginSuccess('guardian');
      onNavigate('/portal');
    } else if (email.includes('bendahara') || email.includes('keuangan')) {
      AppStorage.switchUserRole('treasurer');
      onLoginSuccess('treasurer');
      onNavigate('/app');
    } else if (email.includes('kepala')) {
      AppStorage.switchUserRole('principal');
      onLoginSuccess('principal');
      onNavigate('/app');
    } else if (email.includes('azmi') || email.includes('saadah') || email.includes('siti') || email.includes('guru')) {
      AppStorage.switchUserRole('teacher');
      onLoginSuccess('teacher');
      onNavigate('/app');
    } else {
      AppStorage.switchUserRole('super_admin');
      onLoginSuccess('super_admin');
      onNavigate('/app');
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    AppStorage.switchUserRole(role);
    onLoginSuccess(role);
    if (role === 'guardian') {
      onNavigate('/portal');
    } else {
      onNavigate('/app');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Website Publik</span>
        </button>

        <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center mx-auto shadow-md border border-emerald-700">
          <BookOpen className="w-8 h-8" />
        </div>
        
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Masuk Sistem Administrasi
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {institution.name} · {institution.institution_type}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleManualLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Alamat Email Pengguna
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="nama@mdtu-nurulhidayah.sch.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 block">
                  Kata Sandi
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('/lupa-password')}
                  className="text-[11px] font-semibold text-emerald-800 hover:underline"
                >
                  Lupa kata sandi?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk Sekarang</span>
            </button>
          </form>

          {/* Quick Demo Role Switcher */}
          <div className="pt-6 border-t border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <KeyRound className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Uji Coba Cepat (Akun Demo)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              Pilih peran di bawah ini untuk langsung menguji fitur sesuai hak akses (RLS & kewenangan):
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('super_admin')}
                className="p-2 text-left bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-lg border border-emerald-200 font-semibold"
              >
                1. Super Admin
                <span className="block text-[10px] text-emerald-700 font-normal">Semua Modul & Audit</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('operator')}
                className="p-2 text-left bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-lg border border-slate-200 font-semibold"
              >
                2. Operator TU
                <span className="block text-[10px] text-slate-500 font-normal">Siswa, Guru & Kelas</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('principal')}
                className="p-2 text-left bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-lg border border-slate-200 font-semibold"
              >
                3. Kepala MDTU
                <span className="block text-[10px] text-slate-500 font-normal">Statistik & Approval Rapor</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('teacher')}
                className="p-2 text-left bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-lg border border-slate-200 font-semibold"
              >
                4. Guru / Ustadz
                <span className="block text-[10px] text-slate-500 font-normal">Absensi & Input Nilai</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('treasurer')}
                className="p-2 text-left bg-amber-50 hover:bg-amber-100 text-amber-950 rounded-lg border border-amber-200 font-semibold"
              >
                5. Bendahara
                <span className="block text-[10px] text-amber-800 font-normal">Tagihan & Kuitansi SPP</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('guardian')}
                className="p-2 text-left bg-emerald-50 hover:bg-emerald-100 text-emerald-950 rounded-lg border border-emerald-300 font-semibold"
              >
                6. Orang Tua / Wali
                <span className="block text-[10px] text-emerald-800 font-normal">Portal Santri & Rapor</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
