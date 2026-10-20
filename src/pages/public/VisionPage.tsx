import React from 'react';
import { Target, Compass, Award, CheckCircle, BookOpen, GraduationCap } from 'lucide-react';
import { AppStorage } from '../../lib/storage';

interface VisionPageProps {
  onNavigate: (path: string) => void;
}

export const VisionPage: React.FC<VisionPageProps> = ({ onNavigate }) => {
  const institution = AppStorage.getInstitution();
  const missions = institution.mission.split('\n').filter(Boolean);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-2">
          Pedoman & Cita-Cita Pendidikan
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Visi, Misi & Tujuan Pendidikan
        </h1>
        <p className="text-slate-600 text-sm mt-3 leading-relaxed">
          Arah dasar pembinaan santri Madrasah Diniyah Takmiliyah Ula Nurul Hidayah berlandaskan nilai Islam Ahlussunnah wal Jama'ah.
        </p>
      </div>

      {/* Visi Card */}
      <div className="bg-gradient-to-br from-emerald-900 to-[#14532D] text-white p-8 sm:p-12 rounded-3xl shadow-md">
        <div className="flex items-center gap-3 mb-4 text-amber-300">
          <Target className="w-6 h-6" />
          <h2 className="text-base font-bold uppercase tracking-wider">Visi MDTU Nurul Hidayah</h2>
        </div>
        <p className="text-lg sm:text-2xl font-bold leading-relaxed text-emerald-50 italic">
          "{institution.vision}"
        </p>
      </div>

      {/* Misi List */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-3 text-emerald-900">
          <Compass className="w-6 h-6 text-emerald-700" />
          <h2 className="text-xl font-bold">Misi Madrasah</h2>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {missions.map((m, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-emerald-800 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {m.replace(/^\d+\.\s*/, '')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Tujuan Kelulusan (Standar Kompetensi Lulusan Diniyah) */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-3 text-emerald-900">
          <Award className="w-6 h-6 text-amber-600" />
          <h2 className="text-xl font-bold">Target & Profil Lulusan Santri Takmiliyah Ula</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 space-y-1">
            <h3 className="font-bold text-emerald-950">1. Hafalan Juz 30 & Tartil</h3>
            <p className="text-xs text-slate-600">Santri mampu membaca mushaf Al-Quran dengan kaidah tajwid yang benar dan menghafal surat An-Naba s.d. An-Nas.</p>
          </div>
          <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 space-y-1">
            <h3 className="font-bold text-emerald-950">2. Tertib Shalat Fardhu</h3>
            <p className="text-xs text-slate-600">Terampil berwudhu, hafal seluruh doa bacaan shalat, dan terbiasa melaksanakan shalat tepat waktu.</p>
          </div>
          <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 space-y-1">
            <h3 className="font-bold text-emerald-950">3. Akhlakul Karimah</h3>
            <p className="text-xs text-slate-600">Santun kepada orang tua, guru, dan teman sebaya, serta menjauhi perkataan kotor dan perbuatan tercela.</p>
          </div>
          <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 space-y-1">
            <h3 className="font-bold text-emerald-950">4. Wawasan Kitab Matan Dasar</h3>
            <p className="text-xs text-slate-600">Mengenal dasar aqidah 50, fikih mabadi' fiqhiyah, dasar hadits arbain, dan kosa kata bahasa Arab harian.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
