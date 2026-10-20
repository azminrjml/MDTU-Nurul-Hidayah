import React from 'react';
import { ArrowLeft, BookOpen, GraduationCap, CheckCircle, Award, Calendar } from 'lucide-react';
import { AppStorage } from '../../lib/storage';

interface TeacherDetailPageProps {
  teacherId: string;
  onNavigate: (path: string) => void;
}

export const TeacherDetailPage: React.FC<TeacherDetailPageProps> = ({ teacherId, onNavigate }) => {
  const teacher = AppStorage.getTeacherById(teacherId);
  const assignments = AppStorage.getTeachingAssignments().filter(a => a.teacher_id === teacherId);

  if (!teacher || !teacher.is_public) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Profil Pendidik Tidak Ditemukan</h2>
        <p className="text-sm text-slate-500">Profil guru yang Anda cari tidak tersedia atau belum dipublikasikan.</p>
        <button
          onClick={() => onNavigate('/guru')}
          className="px-4 py-2 bg-emerald-800 text-white rounded-lg text-xs font-semibold"
        >
          Kembali ke Daftar Guru
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <button
        onClick={() => onNavigate('/guru')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 hover:text-emerald-950"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Dewan Asatidz</span>
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
          <div className="w-44 h-44 rounded-2xl overflow-hidden bg-slate-100 border-2 border-emerald-100 shrink-0 shadow-xs">
            {teacher.photo_path ? (
              <img
                src={teacher.photo_path}
                alt={teacher.full_name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-emerald-800 text-white font-bold text-4xl">
                {teacher.full_name.charAt(0)}
              </div>
            )}
          </div>

          <div className="space-y-3 text-center sm:text-left flex-1">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block">
              {teacher.position}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {teacher.full_name}
            </h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-600 pt-1">
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                <span>{teacher.education}</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>{teacher.employment_status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Biografi */}
        <div className="border-t border-slate-100 pt-6 space-y-3">
          <h2 className="text-base font-bold text-slate-900">Biografi & Pengalaman Pengabdian</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            {teacher.public_bio || 'Pengajar tetap di Madrasah Diniyah Takmiliyah Ula Nurul Hidayah yang berdedikasi membimbing para santri dengan keteladanan akhlak dan kaidah ilmu agama yang lurus.'}
          </p>
        </div>

        {/* Tugas Mengajar */}
        {assignments.length > 0 && (
          <div className="border-t border-slate-100 pt-6 space-y-3">
            <h2 className="text-base font-bold text-slate-900">Mata Pelajaran & Kelas Ampuan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {assignments.map((a) => (
                <div key={a.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{a.subject_name}</span>
                  <span className="text-emerald-800 font-medium">{a.class_name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
