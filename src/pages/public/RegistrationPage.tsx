import React, { useState } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  Send, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  BookOpen, 
  GraduationCap, 
  FileText 
} from 'lucide-react';
import { AppStorage } from '../../lib/storage';
import { Student } from '../../types';

interface RegistrationPageProps {
  onNavigate: (path: string) => void;
}

export const RegistrationPage: React.FC<RegistrationPageProps> = ({ onNavigate }) => {
  const classes = AppStorage.getClasses();
  const [formData, setFormData] = useState({
    fullName: '',
    nickname: '',
    gender: 'L',
    birthPlace: 'Bandung',
    birthDate: '2019-05-10',
    targetClassId: classes[0]?.id || '',
    schoolOrigin: 'SD Negeri 1 Cibeunying',
    guardianName: '',
    guardianRelation: 'Ayah',
    guardianPhone: '',
    address: '',
    parentConsent: false
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.fullName.trim()) {
      setErrorMsg('Nama lengkap calon santri wajib diisi.');
      return;
    }
    if (!formData.guardianName.trim()) {
      setErrorMsg('Nama orang tua / wali wajib diisi.');
      return;
    }
    if (!formData.guardianPhone.trim() || formData.guardianPhone.length < 10) {
      setErrorMsg('Nomor telepon / WhatsApp orang tua tidak valid (minimal 10 digit).');
      return;
    }
    if (!formData.parentConsent) {
      setErrorMsg('Mohon centang persetujuan tata tertib dan kurikulum diniyah.');
      return;
    }

    const students = AppStorage.getStudents();
    const newNIS = `202601${String(students.length + 1).padStart(3, '0')}`;
    const targetClass = classes.find(c => c.id === formData.targetClassId) || classes[0];

    const newStudent: Student = {
      id: 'std-' + Date.now(),
      student_number: newNIS,
      full_name: formData.fullName,
      nickname: formData.nickname,
      gender: formData.gender as 'L' | 'P',
      birth_place: formData.birthPlace,
      birth_date: formData.birthDate,
      religion: 'Islam',
      address: formData.address || 'Bandung',
      enrollment_date: new Date().toISOString().split('T')[0],
      entry_academic_year_id: 'ay-2026',
      current_status: 'active',
      class_id: targetClass.id,
      class_name: targetClass.name,
      guardian_name: `${formData.guardianName} (${formData.guardianRelation})`,
      guardian_phone: formData.guardianPhone,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    AppStorage.saveStudent(newStudent);
    AppStorage.logAudit('PSB_REGISTRATION_ONLINE', 'STUDENT', newStudent.id, {
      student_name: newStudent.full_name,
      guardian_name: formData.guardianName
    });

    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block">
          Penerimaan Santri Baru (PSB) Tahun Ajaran 2026/2027
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Formulir Pendaftaran Calon Santri
        </h1>
        <p className="text-slate-600 text-sm max-w-xl mx-auto leading-relaxed">
          Pendidikan Diniyah Takmiliyah Ula jenjang usia sekolah dasar. Mohon isi data calon santri dan wali dengan benar.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white rounded-3xl border border-emerald-200 p-8 sm:p-12 text-center shadow-lg space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Pendaftaran Berhasil Dikirim!</h2>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              Alhamdulillah, data calon santri <strong className="text-slate-900">{formData.fullName}</strong> telah masuk ke dalam sistem panitia PSB MDTU Nurul Hidayah.
            </p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 max-w-md mx-auto text-xs text-left space-y-1.5 text-slate-700">
            <div><span className="font-semibold text-emerald-950">Wali Santri:</span> {formData.guardianName} ({formData.guardianRelation})</div>
            <div><span className="font-semibold text-emerald-950">Nomor WhatsApp:</span> {formData.guardianPhone}</div>
            <div><span className="font-semibold text-emerald-950">Tingkat Kelas:</span> {classes.find(c => c.id === formData.targetClassId)?.name}</div>
          </div>
          <p className="text-xs text-slate-500">
            Tim sekretariat kami akan menghubungi nomor WhatsApp terdaftar dalam 1x24 jam untuk konfirmasi berkas dan jadwal penempatan halaqah.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  fullName: '',
                  nickname: '',
                  gender: 'L',
                  birthPlace: 'Bandung',
                  birthDate: '2019-05-10',
                  targetClassId: classes[0]?.id || '',
                  schoolOrigin: '',
                  guardianName: '',
                  guardianRelation: 'Ayah',
                  guardianPhone: '',
                  address: '',
                  parentConsent: false
                });
              }}
              className="px-5 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-semibold"
            >
              Daftar Santri Lain
            </button>
            <button
              onClick={() => onNavigate('/')}
              className="px-5 py-2.5 bg-emerald-800 text-white hover:bg-emerald-900 rounded-xl text-xs font-semibold"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-8">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Bagian A: Calon Santri */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <User className="w-5 h-5 text-emerald-700" />
              <span>A. Biodata Calon Santri</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-700">Nama Lengkap Santri *</label>
                <input
                  type="text"
                  required
                  placeholder="Sesuai Akte Kelahiran / Kartu Keluarga"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Nama Panggilan</label>
                <input
                  type="text"
                  placeholder="Nama panggilan sehari-hari"
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Jenis Kelamin *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                >
                  <option value="L">Laki-laki (Santri Putra)</option>
                  <option value="P">Perempuan (Santri Putri)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Tempat Lahir</label>
                <input
                  type="text"
                  value={formData.birthPlace}
                  onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Tanggal Lahir</label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Pilihan Rombel Kelas Diniyah *</label>
                <select
                  value={formData.targetClassId}
                  onChange={(e) => setFormData({ ...formData, targetClassId: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name} (Tingkat {c.grade_level})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Asal Sekolah Dasar (Pagi)</label>
                <input
                  type="text"
                  placeholder="Contoh: SD Negeri / MI ..."
                  value={formData.schoolOrigin}
                  onChange={(e) => setFormData({ ...formData, schoolOrigin: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Bagian B: Orang Tua / Wali */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Phone className="w-5 h-5 text-emerald-700" />
              <span>B. Data Orang Tua / Wali Santri</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Nama Orang Tua / Wali *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama lengkap wali"
                  value={formData.guardianName}
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Hubungan Kekeluargaan</label>
                <select
                  value={formData.guardianRelation}
                  onChange={(e) => setFormData({ ...formData, guardianRelation: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                >
                  <option value="Ayah">Ayah Kandung</option>
                  <option value="Ibu">Ibu Kandung</option>
                  <option value="Wali">Wali Santri</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">No. WhatsApp / Telepon Aktif *</label>
                <input
                  type="tel"
                  required
                  placeholder="0812-xxxx-xxxx"
                  value={formData.guardianPhone}
                  onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Alamat Tempat Tinggal</label>
                <input
                  type="text"
                  placeholder="Alamat domisili"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Persetujuan */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-700">
              <input
                type="checkbox"
                checked={formData.parentConsent}
                onChange={(e) => setFormData({ ...formData, parentConsent: e.target.checked })}
                className="mt-0.5 rounded-sm border-slate-300 text-emerald-800 focus:ring-emerald-700"
              />
              <span className="leading-relaxed">
                Saya menyatakan bahwa data yang diisikan adalah benar. Saya bersedia mematuhi tata tertib, jadwal KBM sore hari, dan mendukung proses pendidikan diniyah ananda di MDTU Nurul Hidayah.
              </span>
            </label>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-8 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Pendaftaran Santri Baru</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
