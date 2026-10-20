import React, { useState } from 'react';
import { GraduationCap, Plus, Edit, Trash2, Eye, EyeOff, X, CheckCircle, Shield } from 'lucide-react';
import { AppStorage } from '../../lib/storage';
import { Teacher } from '../../types';

interface TeachersAdminPageProps {
  onNavigate: (path: string) => void;
}

export const TeachersAdminPage: React.FC<TeachersAdminPageProps> = ({ onNavigate }) => {
  const [teachers, setTeachers] = useState<Teacher[]>(AppStorage.getTeachers());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState<Partial<Teacher>>({
    teacher_number: '',
    full_name: '',
    gender: 'L',
    birth_place: 'Bandung',
    birth_date: '1990-01-01',
    education: 'S1 Pendidikan Agama Islam',
    employment_status: 'Guru Tetap Yayasan',
    position: 'Guru Pengampu Diniyah',
    public_bio: '',
    is_public: true
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const reload = () => setTeachers(AppStorage.getTeachers());

  const handleTogglePublic = (teacher: Teacher) => {
    AppStorage.saveTeacher({
      ...teacher,
      is_public: !teacher.is_public
    });
    reload();
  };

  const handleDeleteTeacher = (id: string) => {
    AppStorage.deleteTeacher(id);
    setConfirmDeleteId(null);
    reload();
  };

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacher.full_name || !newTeacher.teacher_number) return;

    const tObj: Teacher = {
      id: 'tch-' + Date.now(),
      teacher_number: newTeacher.teacher_number || '',
      full_name: newTeacher.full_name || '',
      gender: (newTeacher.gender as 'L' | 'P') || 'L',
      birth_place: newTeacher.birth_place || 'Bandung',
      birth_date: newTeacher.birth_date || '1990-01-01',
      address: 'Bandung',
      education: newTeacher.education || 'S1',
      employment_status: newTeacher.employment_status || 'Guru Tetap',
      position: newTeacher.position || 'Pengajar',
      public_bio: newTeacher.public_bio || '',
      is_public: newTeacher.is_public ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    AppStorage.saveTeacher(tObj);
    setIsAddModalOpen(false);
    reload();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Data Dewan Asatidz & Ustadzah
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pengelolaan profil guru, kualifikasi ijazah, dan hak tampil profil publik (is_public).
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengajar Baru</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Nama Lengkap & NIP</th>
                <th className="py-3 px-4">Jabatan & Tugas</th>
                <th className="py-3 px-4">Pendidikan</th>
                <th className="py-3 px-4">Status Kepegawaian</th>
                <th className="py-3 px-4">Tampil Publik</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teachers.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{t.full_name}</div>
                    <div className="text-[11px] font-mono text-slate-500">{t.teacher_number}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-800">{t.position}</td>
                  <td className="py-3.5 px-4 text-slate-600">{t.education}</td>
                  <td className="py-3.5 px-4 text-slate-700">{t.employment_status}</td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleTogglePublic(t)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors ${
                        t.is_public ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {t.is_public ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{t.is_public ? 'Publik' : 'Internal'}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onNavigate(`/guru/${t.id}`)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium"
                      >
                        Detail
                      </button>
                      {confirmDeleteId === t.id ? (
                        <div className="inline-flex items-center gap-1 bg-rose-50 p-0.5 rounded border border-rose-200">
                          <button
                            onClick={() => handleDeleteTeacher(t.id)}
                            className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px] font-bold"
                          >
                            Hapus
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[10px]"
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(t.id)}
                          className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded text-[11px] font-medium flex items-center gap-1"
                          title="Hapus data guru"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Hapus</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-sm font-bold">Tambah Pengajar Baru</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTeacher} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ust. Fauzi, S.Pd.I"
                  value={newTeacher.full_name}
                  onChange={(e) => setNewTeacher({ ...newTeacher, full_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">NIP / NPK *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nomor induk pengajar"
                    value={newTeacher.teacher_number}
                    onChange={(e) => setNewTeacher({ ...newTeacher, teacher_number: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Jabatan</label>
                  <input
                    type="text"
                    placeholder="Wali Kelas / Guru Fiqih"
                    value={newTeacher.position}
                    onChange={(e) => setNewTeacher({ ...newTeacher, position: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Pendidikan Terakhir</label>
                <input
                  type="text"
                  placeholder="Contoh: S1 Pendidikan Agama Islam (UIN)"
                  value={newTeacher.education}
                  onChange={(e) => setNewTeacher({ ...newTeacher, education: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Biografi Publik Singkat</label>
                <textarea
                  rows={2}
                  placeholder="Profil pengajaran yang akan tampil pada website publik"
                  value={newTeacher.public_bio}
                  onChange={(e) => setNewTeacher({ ...newTeacher, public_bio: e.target.value })}
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
                  Simpan Pengajar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
