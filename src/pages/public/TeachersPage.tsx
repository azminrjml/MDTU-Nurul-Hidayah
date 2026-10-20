import React from 'react';
import { Users, BookOpen, ArrowRight, Award, GraduationCap } from 'lucide-react';
import { AppStorage } from '../../lib/storage';

interface TeachersPageProps {
  onNavigate: (path: string) => void;
}

export const TeachersPage: React.FC<TeachersPageProps> = ({ onNavigate }) => {
  const teachers = AppStorage.getTeachers().filter(t => t.is_public);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-2">
          Pendidik Berakhlak & Berkompeten
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Dewan Asatidz & Ustadzah
        </h1>
        <p className="text-slate-600 text-sm mt-3 leading-relaxed">
          Para pengajar berdedikasi tinggi yang membimbing santri dengan ketulusan hati, keteladanan akhlak, dan keilmuan yang bersanad.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {teachers.map((t) => (
          <div 
            key={t.id} 
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:border-emerald-500 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="h-60 bg-slate-100 relative overflow-hidden">
                {t.photo_path ? (
                  <img
                    src={t.photo_path}
                    alt={t.full_name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-emerald-800 text-white font-bold text-4xl">
                    {t.full_name.charAt(0)}
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-emerald-900/90 text-amber-300 text-[11px] font-semibold px-2.5 py-1 rounded-md backdrop-blur-xs">
                  {t.employment_status}
                </div>
              </div>

              <div className="p-6 space-y-3">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide block">
                  {t.position}
                </span>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {t.full_name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="line-clamp-1">{t.education}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 pt-1">
                  {t.public_bio || 'Pengajar aktif bidang keagamaan Diniyah Takmiliyah Ula.'}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-slate-100 mt-2">
              <button
                onClick={() => onNavigate(`/guru/${t.id}`)}
                className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Lihat Profil Lengkap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
