import React, { useState } from 'react';
import { Layers, Plus, Users, UserCheck, X, CheckCircle } from 'lucide-react';
import { AppStorage } from '../../lib/storage';
import { SchoolClass } from '../../types';

interface ClassesAdminPageProps {
  onNavigate: (path: string) => void;
}

export const ClassesAdminPage: React.FC<ClassesAdminPageProps> = ({ onNavigate }) => {
  const [classes, setClasses] = useState<SchoolClass[]>(AppStorage.getClasses());
  const teachers = AppStorage.getTeachers();
  const students = AppStorage.getStudents();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newClass, setNewClass] = useState({
    name: '',
    grade_level: 1,
    homeroom_teacher_id: teachers[0]?.id || '',
    description: ''
  });

  const reload = () => setClasses(AppStorage.getClasses());

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClass.name) return;

    const teacher = teachers.find(t => t.id === newClass.homeroom_teacher_id);
    const activeYear = AppStorage.getActiveAcademicYear();

    const cObj: SchoolClass = {
      id: 'cls-' + Date.now(),
      name: newClass.name,
      grade_level: Number(newClass.grade_level),
      academic_year_id: activeYear.id,
      homeroom_teacher_id: teacher?.id,
      homeroom_teacher_name: teacher?.full_name,
      description: newClass.description,
      student_count: 0,
      created_at: new Date().toISOString()
    };

    AppStorage.saveClass(cObj);
    setIsAddModalOpen(false);
    reload();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Rombongan Belajar (Rombel Kelas)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Penetapan tingkat kelas, wali kelas penanggung jawab, dan distribusi santri aktif.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Rombel Kelas</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {classes.map((c) => {
          const count = students.filter(s => s.class_id === c.id && s.current_status === 'active').length || c.student_count || 0;

          return (
            <div key={c.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-bold">
                    Tingkat {c.grade_level} Ula
                  </span>
                  <div className="flex items-center gap-1 text-slate-500 font-mono text-xs font-bold">
                    <Users className="w-3.5 h-3.5" />
                    <span>{count} Santri</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {c.name}
                </h3>

                <div className="space-y-1 text-xs">
                  <span className="text-slate-400 block text-[11px]">Wali Kelas:</span>
                  <div className="font-semibold text-emerald-900 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{c.homeroom_teacher_name || 'Belum Ditugaskan'}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {c.description || 'Rombel pembelajaran Takmiliyah Ula.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => onNavigate('/app/students')}
                  className="text-emerald-800 font-semibold hover:underline"
                >
                  Daftar Santri →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-sm font-bold">Tambah Rombel Kelas Baru</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddClass} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Nama Rombel Kelas *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kelas 1 Awwaliyah B"
                  value={newClass.name}
                  onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Tingkat Kelas (Grade)</label>
                  <select
                    value={newClass.grade_level}
                    onChange={(e) => setNewClass({ ...newClass, grade_level: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value={1}>Tingkat 1 (Awwaliyah)</option>
                    <option value={2}>Tingkat 2 (Awwaliyah)</option>
                    <option value={3}>Tingkat 3 (Wustha)</option>
                    <option value={4}>Tingkat 4 (Ula)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Wali Kelas</label>
                  <select
                    value={newClass.homeroom_teacher_id}
                    onChange={(e) => setNewClass({ ...newClass, homeroom_teacher_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.full_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Deskripsi Ringkas</label>
                <textarea
                  rows={2}
                  placeholder="Keterangan kurikulum atau fokus pembiasaan kelas"
                  value={newClass.description}
                  onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold"
                >
                  Simpan Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
