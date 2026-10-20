import React from 'react';
import { ShieldAlert, ArrowLeft, KeyRound, LogOut, Lock, CheckCircle2 } from 'lucide-react';
import { AppStorage, ROLE_ACCESS_CONFIG } from '../../lib/storage';
import { UserRole } from '../../types';

interface AccessRestrictedNoticeProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const AccessRestrictedNotice: React.FC<AccessRestrictedNoticeProps> = ({ currentPath, onNavigate }) => {
  const currentUser = AppStorage.getCurrentUser();
  const activeRole = (currentUser?.roles[0] || 'super_admin') as UserRole;
  const roleConfig = ROLE_ACCESS_CONFIG[activeRole] || ROLE_ACCESS_CONFIG.super_admin;
  const allowedRoles = AppStorage.getAllowedRolesForPath(currentPath);
  const myLandingPage = AppStorage.getRoleLandingPage(activeRole);

  const getPageTitle = (path: string): string => {
    if (path === '/app/billing') return 'Keuangan & Tagihan SPP';
    if (path === '/app/academics') return 'Akademik & Nilai Pembelajaran';
    if (path === '/app/attendance') return 'Presensi & Kehadiran Santri';
    if (path === '/app/report-cards') return 'Buku Rapor Digital Santri';
    if (path === '/app/teachers') return 'Kelola Dewan Asatidz';
    if (path === '/app/classes') return 'Kelola Rombel Kelas';
    if (path === '/app/content') return 'Kelola Konten & Berita';
    if (path === '/app/audit-logs') return 'Log Audit Keamanan Sistem';
    if (path === '/app/settings') return 'Pengaturan Lembaga & Sandi';
    if (path.startsWith('/portal')) return 'Portal Khusus Wali Santri';
    if (path.startsWith('/app')) return 'Dashboard Administrasi Internal';
    return 'Halaman Sistem';
  };

  const roleNameLabels: Record<UserRole, string> = {
    super_admin: 'Super Admin / Yayasan',
    operator: 'Operator Tata Usaha (TU)',
    principal: 'Kepala Madrasah',
    teacher: 'Dewan Asatidz / Guru',
    treasurer: 'Bendahara Keuangan',
    guardian: 'Orang Tua / Wali Santri'
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-amber-200/80 shadow-xl p-6 sm:p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
            Akses Dibatasi (Restricted Feature)
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Izin Khusus Diperlukan
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
            Halaman <span className="font-bold text-slate-900">"{getPageTitle(currentPath)}"</span> dikhususkan hanya untuk peran tertentu sesuai pembagian wewenang madrasah.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-500 font-medium">Status Pengguna Anda:</span>
            <span className="font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-md border border-emerald-200">
              {roleNameLabels[activeRole]}
            </span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block mb-1">Peran Yang Diberi Hak Akses:</span>
            <div className="flex flex-wrap gap-1.5">
              {allowedRoles.map((role) => (
                <span
                  key={role}
                  className="px-2 py-0.5 rounded-md bg-white border border-slate-300 font-semibold text-[11px] text-slate-700"
                >
                  {roleNameLabels[role]}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate(myLandingPage)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Halaman Utama Anda</span>
          </button>

          <button
            onClick={() => onNavigate('/login')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-300 transition-all flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4 text-amber-600" />
            <span>Masuk dengan Sandi Peran Lain</span>
          </button>
        </div>
      </div>
    </div>
  );
};
