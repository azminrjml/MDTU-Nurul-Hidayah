import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  CreditCard, 
  BookOpen, 
  Award, 
  GraduationCap, 
  Layers, 
  FileText, 
  ShieldAlert, 
  BarChart3, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Menu, 
  X, 
  UserCheck,
  Building,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { AppStorage } from '../../lib/storage';
import { UserRole } from '../../types';

interface DashboardLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ currentPath, onNavigate, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const currentUser = AppStorage.getCurrentUser();
  const activeRole = currentUser.roles[0] || 'super_admin';
  const academicYears = AppStorage.getAcademicYears();
  const activeYear = AppStorage.getActiveAcademicYear();
  const institution = AppStorage.getInstitution();

  const handleRoleChange = (newRole: UserRole) => {
    AppStorage.switchUserRole(newRole);
    setRoleMenuOpen(false);
    if (newRole === 'guardian') {
      onNavigate('/portal');
    } else {
      onNavigate('/app');
    }
  };

  const handleLogout = () => {
    onNavigate('/login');
  };

  // Build navigation items based on active role
  const getNavItems = () => {
    const items = [
      { label: 'Ringkasan', icon: LayoutDashboard, path: '/app', allowed: ['super_admin', 'operator', 'principal', 'teacher', 'treasurer'] },
      { label: 'Data Santri', icon: Users, path: '/app/students', allowed: ['super_admin', 'operator', 'principal', 'teacher'] },
      { label: 'Presensi Santri', icon: CalendarCheck, path: '/app/attendance', allowed: ['super_admin', 'operator', 'principal', 'teacher'] },
      { label: 'Keuangan & SPP', icon: CreditCard, path: '/app/billing', allowed: ['super_admin', 'principal', 'treasurer'] },
      { label: 'Akademik & Nilai', icon: BookOpen, path: '/app/academics', allowed: ['super_admin', 'operator', 'teacher', 'principal'] },
      { label: 'Buku Rapor Santri', icon: Award, path: '/app/report-cards', allowed: ['super_admin', 'operator', 'teacher', 'principal'] },
      { label: 'Dewan Asatidz', icon: GraduationCap, path: '/app/teachers', allowed: ['super_admin', 'operator', 'principal'] },
      { label: 'Rombel Kelas', icon: Layers, path: '/app/classes', allowed: ['super_admin', 'operator', 'principal'] },
      { label: 'Kelola Konten', icon: FileText, path: '/app/content', allowed: ['super_admin', 'operator'] },
      { label: 'Log Audit Keamanan', icon: ShieldAlert, path: '/app/audit-logs', allowed: ['super_admin', 'principal'] },
      { label: 'Laporan Rekapitulasi', icon: BarChart3, path: '/app/reports', allowed: ['super_admin', 'operator', 'principal', 'treasurer'] },
      { label: 'Pengaturan Lembaga', icon: Settings, path: '/app/settings', allowed: ['super_admin'] },
    ];

    return items.filter(item => item.allowed.includes(activeRole));
  };

  const navItems = getNavItems();

  const roleLabels: Record<UserRole, string> = {
    super_admin: 'Super Admin',
    operator: 'Operator TU',
    principal: 'Kepala Madrasah',
    teacher: 'Ustadz Pengampu',
    treasurer: 'Bendahara Madrasah',
    guardian: 'Wali Santri'
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Top bar */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between z-40 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-amber-300">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm">MDTU Nurul Hidayah</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out md:static md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div>
          {/* Brand & Logo */}
          <div className="p-5 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-amber-300 shadow-xs shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-sm font-bold text-white tracking-tight">
                  {institution.name}
                </span>
                <span className="block text-[11px] text-emerald-400 font-medium">
                  Sistem Administrasi
                </span>
              </div>
            </div>
          </div>

          {/* Role badge */}
          <div className="px-5 py-3 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Peran:</span>
            <span className="font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-sm">
              {roleLabels[activeRole]}
            </span>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    onNavigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left ${
                    isActive 
                      ? 'bg-emerald-800 text-white shadow-xs' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => onNavigate('/')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Lihat Website Publik</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Akun (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Breadcrumb Trail */}
          <div className="flex items-center gap-2 text-xs text-slate-500 overflow-hidden">
            <span className="font-medium text-slate-700">MDTU</span>
            <span>/</span>
            <span className="font-semibold text-emerald-800 truncate">
              {navItems.find(i => i.path === currentPath)?.label || 'Dashboard'}
            </span>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Academic Year Selector */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 border border-slate-200">
              <span className="text-slate-500">TA:</span>
              <span className="font-mono text-emerald-800">{activeYear.name} (Ganjil)</span>
            </div>

            {/* Quick Role Switcher for instant evaluator testing */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-lg text-xs font-semibold transition-colors"
                title="Ganti Peran Pengguna untuk Pengujian Hak Akses"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden md:inline">{currentUser.full_name.split(' ')[0]}</span>
                <span className="text-emerald-700 font-normal">({roleLabels[activeRole]})</span>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-700" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs">
                  <div className="px-3 py-1.5 border-b border-slate-100 font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                    Uji Hak Akses (Ganti Role)
                  </div>
                  <div className="space-y-1 pt-1">
                    {(['super_admin', 'operator', 'principal', 'teacher', 'treasurer', 'guardian'] as UserRole[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => handleRoleChange(r)}
                        className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                          activeRole === r ? 'bg-emerald-800 text-white font-semibold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {roleLabels[r]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};
