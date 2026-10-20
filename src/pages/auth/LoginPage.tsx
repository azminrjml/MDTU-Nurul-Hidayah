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
  UserCheck,
  GraduationCap,
  Users,
  CreditCard,
  Building,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { AppStorage, ROLE_ACCESS_CONFIG } from '../../lib/storage';
import { UserRole } from '../../types';
import { demoUserProfiles } from '../../lib/seedData';

interface LoginPageProps {
  onNavigate: (path: string) => void;
  onLoginSuccess: (role: UserRole) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('teacher');
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'role_portal' | 'manual_email'>('role_portal');

  // Manual email mode states
  const [manualEmail, setManualEmail] = useState('');
  const [manualPassword, setManualPassword] = useState('');

  const institution = AppStorage.getInstitution();
  const roleConfig = ROLE_ACCESS_CONFIG[selectedRole];
  const currentPasscodes = AppStorage.getRolePasscodes();

  const roleCards: {
    role: UserRole;
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    subtitle: string;
    colorClass: string;
    targetPageName: string;
    targetPath: string;
  }[] = [
    {
      role: 'teacher',
      icon: GraduationCap,
      title: 'Dewan Guru / Asatidz',
      subtitle: 'Presensi & Input Nilai Santri',
      colorClass: 'border-emerald-600 bg-emerald-50 text-emerald-900',
      targetPageName: 'Akademik & Nilai',
      targetPath: '/app/academics'
    },
    {
      role: 'guardian',
      icon: Users,
      title: 'Orang Tua / Wali Santri',
      subtitle: 'Portal Nilai, Rapor & SPP Santri',
      colorClass: 'border-amber-500 bg-amber-50 text-amber-950',
      targetPageName: 'Portal Khusus Wali Santri',
      targetPath: '/portal'
    },
    {
      role: 'super_admin',
      icon: ShieldCheck,
      title: 'Administrator / Yayasan',
      subtitle: 'Akses Penuh Manajemen & Lembaga',
      colorClass: 'border-blue-600 bg-blue-50 text-blue-950',
      targetPageName: 'Dashboard Utama Admin',
      targetPath: '/app'
    },
    {
      role: 'treasurer',
      icon: CreditCard,
      title: 'Bendahara Keuangan',
      subtitle: 'Tagihan Infaq, SPP & Kuitansi',
      colorClass: 'border-teal-600 bg-teal-50 text-teal-950',
      targetPageName: 'Keuangan & SPP',
      targetPath: '/app/billing'
    },
    {
      role: 'principal',
      icon: Building,
      title: 'Kepala MDTU',
      subtitle: 'Supervisi & Pengesahan Buku Rapor',
      colorClass: 'border-purple-600 bg-purple-50 text-purple-950',
      targetPageName: 'Ringkasan & Approval Rapor',
      targetPath: '/app'
    },
    {
      role: 'operator',
      icon: BookOpen,
      title: 'Operator Tata Usaha',
      subtitle: 'Buku Induk Santri & Rombel Kelas',
      colorClass: 'border-slate-600 bg-slate-50 text-slate-900',
      targetPageName: 'Buku Induk Santri',
      targetPath: '/app/students'
    }
  ];

  const handleRoleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const targetPasscode = passcode.trim();
    if (!targetPasscode) {
      setErrorMsg(`Mohon masukkan sandi khusus untuk peran ${roleConfig.title}.`);
      return;
    }

    const result = AppStorage.loginWithRole(selectedRole, targetPasscode);
    if (!result.success) {
      setErrorMsg(result.message);
      return;
    }

    onLoginSuccess(selectedRole);
    onNavigate(result.landingPage);
  };

  const handleQuickFillAndLogin = (role: UserRole) => {
    setSelectedRole(role);
    const validPasscode = AppStorage.getRolePasscode(role);
    setPasscode(validPasscode);
    setErrorMsg('');

    const result = AppStorage.loginWithRole(role, validPasscode);
    if (result.success) {
      onLoginSuccess(role);
      onNavigate(result.landingPage);
    }
  };

  const handleManualEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!manualEmail.trim() || !manualPassword.trim()) {
      setErrorMsg('Mohon lengkapi email dan kata sandi.');
      return;
    }

    const lowerEmail = manualEmail.toLowerCase();
    const pass = manualPassword.trim();

    // Determine target role from email or password
    let detectedRole: UserRole = 'super_admin';
    if (lowerEmail.includes('wali') || lowerEmail.includes('hendra') || pass === currentPasscodes.guardian) {
      detectedRole = 'guardian';
    } else if (lowerEmail.includes('bendahara') || lowerEmail.includes('keuangan') || pass === currentPasscodes.treasurer) {
      detectedRole = 'treasurer';
    } else if (lowerEmail.includes('kepala') || pass === currentPasscodes.principal) {
      detectedRole = 'principal';
    } else if (lowerEmail.includes('azmi') || lowerEmail.includes('saadah') || lowerEmail.includes('siti') || lowerEmail.includes('guru') || pass === currentPasscodes.teacher) {
      detectedRole = 'teacher';
    } else if (lowerEmail.includes('operator') || lowerEmail.includes('shofwan') || pass === currentPasscodes.operator) {
      detectedRole = 'operator';
    }

    const result = AppStorage.loginWithRole(detectedRole, pass);
    if (!result.success) {
      // If passcode didn't match, verify if pass is at least length 4 or matches default
      const defaultPass = AppStorage.getRolePasscode(detectedRole);
      if (pass !== defaultPass) {
        setErrorMsg(`Kata sandi tidak sesuai untuk akun ${detectedRole}. Silakan gunakan sandi khusus: "${defaultPass}"`);
        return;
      }
    }

    onLoginSuccess(detectedRole);
    onNavigate(AppStorage.getRoleLandingPage(detectedRole));
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center space-y-3">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-white px-3.5 py-1.5 rounded-full border border-emerald-200/80 shadow-xs mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Website Profil Publik</span>
        </button>

        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center shadow-md border border-emerald-700">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Akses Masuk Berbasis Kepentingan & Peran
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {institution.name} · Sistem Terintegrasi dengan Hak Akses Khusus
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
          {/* Tab Selector */}
          <div className="flex border-b border-slate-200 bg-slate-50/80 p-1.5 gap-1.5 text-xs">
            <button
              onClick={() => {
                setActiveTab('role_portal');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'role_portal'
                  ? 'bg-white text-emerald-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <KeyRound className="w-4 h-4 text-amber-600" />
              <span>Masuk Berdasarkan Kepentingan (Sandi Khusus)</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('manual_email');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'manual_email'
                  ? 'bg-white text-emerald-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Mail className="w-4 h-4 text-slate-500" />
              <span>Masuk dengan Email / Akun Manual</span>
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {activeTab === 'role_portal' ? (
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                    1. Pilih Jenis Pengguna / Kepentingan Anda:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {roleCards.map((item) => {
                      const Icon = item.icon;
                      const isSelected = selectedRole === item.role;
                      return (
                        <button
                          key={item.role}
                          type="button"
                          onClick={() => {
                            setSelectedRole(item.role);
                            setPasscode(currentPasscodes[item.role] || '');
                            setErrorMsg('');
                          }}
                          className={`p-3 rounded-2xl text-left border-2 transition-all flex items-start gap-3 relative ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-500/30'
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-emerald-700 text-amber-300' : 'bg-slate-100 text-slate-600'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-bold ${isSelected ? 'text-emerald-950' : 'text-slate-900'}`}>
                                {item.title}
                              </span>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                            </div>
                            <span className="block text-[11px] text-slate-500 truncate mt-0.5">
                              {item.subtitle}
                            </span>
                            <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-800 font-medium">
                              <span>Halaman:</span>
                              <span className="font-bold underline">{item.targetPageName}</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Role Form */}
                <form onSubmit={handleRoleLogin} className="space-y-4 pt-2 border-t border-slate-100">
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        Akses Terbatas: {roleConfig.title}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        {roleConfig.badge}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {roleConfig.description}
                    </p>
                    <div className="pt-1 flex items-center gap-2 text-[11px] text-emerald-900 font-medium">
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Masuk langsung ke: <strong className="font-bold">{roleConfig.landingPage}</strong></span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700">
                        2. Masukkan Sandi Khusus:
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const code = AppStorage.getRolePasscode(selectedRole);
                          setPasscode(code);
                        }}
                        className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 underline flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>Gunakan Sandi Khusus Default: "{currentPasscodes[selectedRole]}"</span>
                      </button>
                    </div>

                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        placeholder={`Masukkan sandi khusus ${roleConfig.title}`}
                        className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 absolute right-2.5 top-2"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Masuk ke Halaman {roleConfig.title}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickFillAndLogin(selectedRole)}
                      className="px-4 py-3 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-xs rounded-xl border border-amber-300 transition-all flex items-center justify-center gap-1.5"
                    >
                      <KeyRound className="w-4 h-4 text-amber-700" />
                      <span>Masuk Cepat 1-Klik</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Manual Email Mode */
              <form onSubmit={handleManualEmailLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Alamat Email Terdaftar
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="contoh: guru@mdtu-nurulhidayah.sch.id / azminrjml@gmail.com"
                      value={manualEmail}
                      onChange={(e) => setManualEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Kata Sandi / Sandi Khusus
                    </label>
                    <button
                      type="button"
                      onClick={() => onNavigate('/lupa-password')}
                      className="text-[11px] font-semibold text-emerald-800 hover:underline"
                    >
                      Lupa sandi?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={manualPassword}
                      onChange={(e) => setManualPassword(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Masuk ke Halaman Pengguna</span>
                </button>
              </form>
            )}

            {/* Security Notice */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div className="leading-relaxed text-[11px]">
                <span className="font-bold text-slate-700">Prinsip Akses Terbatas (Role-Based Access Control):</span>
                <p className="mt-0.5">
                  Setiap peran hanya dapat mengakses halaman dan modul yang diizinkan (Guru ke Presensi & Nilai, Ortu ke Portal Santri, Bendahara ke Keuangan SPP). Sandi khusus dapat dikelola oleh Administrator di menu Pengaturan Lembaga.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
