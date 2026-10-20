import { BookOpen, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { AppStorage } from '../../lib/storage';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const institution = AppStorage.getInstitution();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-amber-300">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-lg font-bold text-white tracking-tight">
                  {institution.name}
                </span>
                <span className="block text-xs text-emerald-400 font-medium">
                  {institution.institution_type}
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Lembaga pendidikan Islam nonformal jenjang Takmiliyah Ula yang menyelenggarakan pembelajaran ilmu agama bagi santri usia sekolah dasar pada sore hari.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <div><span className="text-slate-200 font-medium">NSM:</span> {institution.institution_number}</div>
              <div><span className="text-slate-200 font-medium">SK Izin:</span> {institution.operational_license}</div>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Navigasi Cepat
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('/profil')} className="hover:text-amber-400 transition-colors">
                  Profil & Sejarah Madrasah
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/visi-misi')} className="hover:text-amber-400 transition-colors">
                  Visi, Misi & Kurikulum
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/guru')} className="hover:text-amber-400 transition-colors">
                  Dewan Asatidz & Ustadzah
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/galeri')} className="hover:text-amber-400 transition-colors">
                  Galeri Kegiatan & Tahfidz
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/berita')} className="hover:text-amber-400 transition-colors">
                  Berita & Pengumuman
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/pendaftaran')} className="hover:text-amber-400 transition-colors text-amber-300 font-medium">
                  Pendaftaran Santri Baru (PSB)
                </button>
              </li>
            </ul>
          </div>

          {/* Operational Hours */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Jadwal Belajar (KBM)
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-white font-medium">Senin — Minggu</span>
                  <span className="text-xs text-slate-400">Pukul 13.00 - 15.00 WIB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Sekretariat & Lokasi
            </h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">{institution.address}, {institution.city}, {institution.province} {institution.postal_code}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-mono">{institution.phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs">{institution.email}</span>
              </li>
            </ul>
            <div className="mt-5 pt-4 border-t border-slate-800">
              <button 
                onClick={() => onNavigate('/kebijakan-privasi')}
                className="text-xs text-slate-400 hover:text-white underline"
              >
                Kebijakan Privasi & Perlindungan Data Santri
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} {institution.name} ({institution.foundation_name}). Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('/login')} className="hover:text-emerald-300">
              Akses Sistem Administrasi
            </button>
            <span>·</span>
            <button onClick={() => onNavigate('/portal')} className="hover:text-amber-300">
              Portal Wali Santri
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
