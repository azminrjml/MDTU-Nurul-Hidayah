import React, { useState } from 'react';
import { 
  BookOpen, 
  Menu, 
  X, 
  LogIn, 
  LayoutDashboard, 
  UserCheck, 
  ChevronRight 
} from 'lucide-react';
import { AppStorage } from '../../lib/storage';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentUser = AppStorage.getCurrentUser();
  const institution = AppStorage.getInstitution();

  const navLinks = [
    { label: 'Beranda', path: '/' },
    { label: 'Profil', path: '/profil' },
    { label: 'Visi & Misi', path: '/visi-misi' },
    { label: 'Dewan Guru', path: '/guru' },
    { label: 'Galeri', path: '/galeri' },
    { label: 'Berita', path: '/berita' },
    { label: 'Pendaftaran (PSB)', path: '/pendaftaran' },
    { label: 'Kontak', path: '/kontak' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-900/10 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-[#14532D] text-emerald-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium text-amber-300 text-left">Penerimaan Santri Baru (PSB) 2026/2027</span>
            <span>·</span>
            <span className="hidden sm:inline ml-0">Madrasah Diniyah Takmiliyah Ula Terakreditasi Kemenag</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>NSM: {institution.institution_number}</span>
            <span className="hidden md:inline">·</span>
            <span className="hidden md:inline font-mono">{institution.phone}</span>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Brand Zone */}
          <button 
            onClick={() => onNavigate('/')}
            className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-lg py-1"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#14532D] to-[#166534] flex items-center justify-center text-amber-300 shadow-sm border border-emerald-800">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-xl font-bold tracking-tight text-slate-900 group-hover:text-emerald-800 transition-colors whitespace-nowrap">
                MDTU Nurul Hidayah
              </span>
              <span className="block text-xs font-medium text-emerald-700 whitespace-nowrap">
                Madrasah Diniyah Takmiliyah Ula
              </span>
            </div>
          </button>

          {/* Nav Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => onNavigate(link.path)}
                  className={`transition-colors whitespace-nowrap shrink-0 hover:text-emerald-800 ${
                    isActive 
                      ? 'text-emerald-800 font-semibold border-b-2 border-emerald-700 pb-1' 
                      : 'text-slate-600'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Action Zone */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-2">
                {currentUser.roles.includes('guardian') ? (
                  <button
                    onClick={() => onNavigate('/portal')}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shadow-xs"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Portal Wali</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigate('/app')}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#166534] rounded-lg transition-colors whitespace-nowrap shadow-xs"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard Admin</span>
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => onNavigate('/login')}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#166534] rounded-lg transition-colors whitespace-nowrap shadow-xs"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk Sistem</span>
              </button>
            )}

            {/* Mobile menu toggle button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => {
                    onNavigate(link.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-left ${
                    isActive ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              );
            })}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  onNavigate('/login');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-800 text-white rounded-lg text-sm font-semibold hover:bg-emerald-900"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk Sistem Informasi</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
