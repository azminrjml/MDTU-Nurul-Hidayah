import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  UploadCloud, 
  Printer, 
  FileSpreadsheet, 
  Archive, 
  ChevronRight, 
  X, 
  CheckCircle, 
  AlertCircle,
  Eye
} from 'lucide-react';
import { AppStorage, formatTanggal } from '../../lib/storage';
import { Student } from '../../types';

interface StudentsPageProps {
  onNavigate: (path: string) => void;
}

export const StudentsPage: React.FC<StudentsPageProps> = ({ onNavigate }) => {
  const [students, setStudents] = useState<Student[]>(AppStorage.getStudents());
  const classes = AppStorage.getClasses();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('active');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [csvContent, setCsvContent] = useState('');
  const [csvReport, setCsvReport] = useState<{ success: number; errors: string[] } | null>(null);

  // Add Student Form State
  const [newStudent, setNewStudent] = useState({
    fullName: '',
    nis: '',
    nisn: '',
    gender: 'L',
    birthPlace: 'Bandung',
    birthDate: '2018-05-10',
    classId: classes[0]?.id || '',
    guardianName: '',
    guardianPhone: '',
    address: 'Bandung'
  });

  const reloadStudents = () => {
    setStudents(AppStorage.getStudents());
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.fullName || !newStudent.nis) return;

    const targetClass = classes.find(c => c.id === newStudent.classId) || classes[0];

    const studentObj: Student = {
      id: 'std-' + Date.now(),
      student_number: newStudent.nis,
      nisn: newStudent.nisn,
      full_name: newStudent.fullName,
      gender: newStudent.gender as 'L' | 'P',
      birth_place: newStudent.birthPlace,
      birth_date: newStudent.birthDate,
      religion: 'Islam',
      address: newStudent.address,
      enrollment_date: new Date().toISOString().split('T')[0],
      entry_academic_year_id: 'ay-2026',
      current_status: 'active',
      class_id: targetClass.id,
      class_name: targetClass.name,
      guardian_name: newStudent.guardianName || 'Wali Santri',
      guardian_phone: newStudent.guardianPhone || '-',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    AppStorage.saveStudent(studentObj);
    setIsAddModalOpen(false);
    reloadStudents();
  };

  const handleArchive = (id: string, name: string) => {
    if (window.confirm(`Yakin ingin mengarsipkan data santri "${name}"? Status akan berubah non-aktif tanpa menghapus riwayat akademik.`)) {
      AppStorage.archiveStudent(id);
      reloadStudents();
    }
  };

  const handleCsvImport = () => {
    if (!csvContent.trim()) return;
    const lines = csvContent.split('\n').map(l => l.trim()).filter(Boolean);
    const parsed: Array<{ nis: string; nisn?: string; nama: string; gender: string; kelas: string; wali: string; kontak: string }> = [];

    // Skip header line if exists
    const startIndex = lines[0]?.toLowerCase().includes('nis') ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const parts = lines[i].split(',').map(p => p.trim());
      if (parts.length >= 3) {
        parsed.push({
          nis: parts[0] || '',
          nama: parts[1] || '',
          gender: parts[2] || 'L',
          kelas: parts[3] || 'Kelas 1',
          wali: parts[4] || 'Wali Santri',
          kontak: parts[5] || '-'
        });
      }
    }

    const res = AppStorage.importStudentsCSV(parsed);
    setCsvReport(res);
    reloadStudents();
  };

  // Filtered
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.student_number.includes(searchQuery);
    const matchesClass = selectedClass === 'all' || s.class_id === selectedClass;
    const matchesStatus = selectedStatus === 'all' || s.current_status === selectedStatus;
    return matchesSearch && matchesClass && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Manajemen Data Santri MDTU
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pengelolaan biodata santri, riwayat rombel, berkas privat, dan relasi wali.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsCsvModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors shadow-xs"
          >
            <UploadCloud className="w-3.5 h-3.5 text-emerald-700" />
            <span>Impor CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Cetak Rekap</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Santri Baru</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari berdasarkan NIS atau Nama Santri..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Kelas:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:outline-none"
            >
              <option value="all">Semua Rombel</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="archived">Diarsipkan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">No</th>
                <th className="py-3 px-4">NIS</th>
                <th className="py-3 px-4">Nama Lengkap Santri</th>
                <th className="py-3 px-4">L/P</th>
                <th className="py-3 px-4">Rombel Kelas</th>
                <th className="py-3 px-4">Wali Santri & Telepon</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Tidak ada santri yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{s.student_number}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <button
                        onClick={() => onNavigate(`/app/students/${s.id}`)}
                        className="text-left hover:text-emerald-800 transition-colors"
                      >
                        {s.full_name}
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        s.gender === 'L' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {s.gender === 'L' ? 'Putra' : 'Putri'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {s.class_name || 'Belum Terdaftar'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="font-medium text-slate-900">{s.guardian_name || '-'}</div>
                      <div className="text-[11px] font-mono text-slate-500">{s.guardian_phone || '-'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-sm text-[11px] font-semibold ${
                        s.current_status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {s.current_status === 'active' ? 'Aktif' : 'Arsip'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onNavigate(`/app/students/${s.id}`)}
                          className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg transition-colors"
                          title="Lihat Detail & Dokumen"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {s.current_status === 'active' && (
                          <button
                            onClick={() => handleArchive(s.id, s.full_name)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                            title="Arsipkan Santri"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH SANTRI */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-sm font-bold">Tambah Santri Baru (Manual)</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Nama Lengkap Santri *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama lengkap santri"
                  value={newStudent.fullName}
                  onChange={(e) => setNewStudent({ ...newStudent, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Nomor Induk (NIS) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 202601015"
                    value={newStudent.nis}
                    onChange={(e) => setNewStudent({ ...newStudent, nis: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Jenis Kelamin</label>
                  <select
                    value={newStudent.gender}
                    onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                  >
                    <option value="L">Laki-laki (Putra)</option>
                    <option value="P">Perempuan (Putri)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Rombel Kelas *</label>
                  <select
                    value={newStudent.classId}
                    onChange={(e) => setNewStudent({ ...newStudent, classId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={newStudent.birthDate}
                    onChange={(e) => setNewStudent({ ...newStudent, birthDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Nama Orang Tua / Wali</label>
                  <input
                    type="text"
                    placeholder="Nama wali santri"
                    value={newStudent.guardianName}
                    onChange={(e) => setNewStudent({ ...newStudent, guardianName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">No. WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="0812-xxxx-xxxx"
                    value={newStudent.guardianPhone}
                    onChange={(e) => setNewStudent({ ...newStudent, guardianPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold"
                >
                  Simpan Santri
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL IMPOR CSV */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
            <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-sm font-bold flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-amber-300" />
                <span>Impor Data Santri Melalui CSV</span>
              </h2>
              <button onClick={() => { setIsCsvModalOpen(false); setCsvReport(null); }} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Format CSV (Kolom dipisahkan koma): <br />
                <code className="font-mono bg-slate-100 px-2 py-1 rounded block mt-1 text-[11px] text-slate-800">
                  NIS,Nama Lengkap,Jenis Kelamin (L/P),Kelas,Nama Wali,No Telp
                </code>
              </p>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Tempel Data CSV:</label>
                <textarea
                  rows={6}
                  placeholder={`202601020,Yusuf Mansur,L,Kelas 1,H. Mansur,081234567890\n202601021,Halimah Sa'diyah,P,Kelas 1,Ibu Maryam,081398765432`}
                  value={csvContent}
                  onChange={(e) => setCsvContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-[11px] focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              {csvReport && (
                <div className={`p-3 rounded-xl border ${csvReport.errors.length > 0 ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
                  <div className="font-bold text-slate-900 mb-1">
                    Hasil Impor: {csvReport.success} data santri berhasil ditambahkan.
                  </div>
                  {csvReport.errors.map((err, i) => (
                    <div key={i} className="text-red-600 text-[11px]">· {err}</div>
                  ))}
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setIsCsvModalOpen(false); setCsvReport(null); }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={handleCsvImport}
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold"
                >
                  Proses & Validasi Impor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
