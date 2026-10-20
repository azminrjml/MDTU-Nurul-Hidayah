import React from 'react';
import { Printer, X, Award, CheckCircle2 } from 'lucide-react';
import { ReportCard } from '../../types';
import { AppStorage, formatTanggal } from '../../lib/storage';

interface PrintReportCardModalProps {
  reportCard: ReportCard;
  onClose: () => void;
}

export const PrintReportCardModal: React.FC<PrintReportCardModalProps> = ({ reportCard, onClose }) => {
  const institution = AppStorage.getInstitution();
  const teachers = AppStorage.getTeachers();
  const principal = teachers.find(t => t.position.toLowerCase().includes('kepala')) || {
    full_name: institution.principal_name,
    teacher_number: '197905142005011002'
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200">
        {/* Action Bar */}
        <div className="no-print bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-semibold text-sm">
              Rapor Santri: {reportCard.student_name} ({reportCard.status.toUpperCase()})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Rapor Santri</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Card Page */}
        <div className="p-8 sm:p-12 text-slate-900 bg-white">
          {/* Header Kop Resmi */}
          <div className="border-b-4 border-double border-emerald-900 pb-4 mb-6 text-center">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-900">
              Kementerian Agama Republik Indonesia
            </h2>
            <h1 className="text-xl sm:text-2xl font-black text-emerald-950 uppercase tracking-tight mt-0.5">
              {institution.name}
            </h1>
            <p className="text-xs font-semibold text-slate-700">
              {institution.institution_type} · NSM: {institution.institution_number} · Izin Kemenag: {institution.operational_license}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Alamat: {institution.address}, {institution.city} · Telp: {institution.phone}
            </p>
          </div>

          <div className="text-center mb-6">
            <h3 className="text-base sm:text-lg font-black uppercase text-slate-900 tracking-wider">
              Laporan Hasil Belajar Santri (Rapor)
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              Jenjang Pendidikan Diniyah Takmiliyah Ula
            </p>
          </div>

          {/* Student Identity Grid */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs sm:text-sm mb-6 pb-4 border-b border-slate-200">
            <div className="flex gap-2">
              <span className="text-slate-500 w-28 shrink-0">Nama Santri</span>
              <span className="font-bold text-slate-900">: {reportCard.student_name}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-slate-500 w-28 shrink-0">Tahun Ajaran</span>
              <span className="font-semibold text-slate-800">: {reportCard.academic_year_name || '2026/2027'}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-slate-500 w-28 shrink-0">Nomor Induk (NIS)</span>
              <span className="font-mono font-semibold text-slate-800">: {reportCard.student_number || '-'}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-slate-500 w-28 shrink-0">Semester</span>
              <span className="font-semibold text-slate-800">: {reportCard.semester}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-slate-500 w-28 shrink-0">Rombongan Belajar</span>
              <span className="font-semibold text-slate-800">: {reportCard.class_name}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-slate-500 w-28 shrink-0">Status Penerbitan</span>
              <span className="font-semibold text-emerald-800 uppercase">: {reportCard.status}</span>
            </div>
          </div>

          {/* Grades Table */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase text-slate-800 tracking-wider mb-2">
              A. Capaian Kompetensi Mata Pelajaran Diniyah
            </h4>
            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-emerald-950 text-white font-semibold">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center">No</th>
                    <th className="py-2.5 px-3">Mata Pelajaran</th>
                    <th className="py-2.5 px-2 w-16 text-center">KKM</th>
                    <th className="py-2.5 px-2 w-16 text-center">Nilai</th>
                    <th className="py-2.5 px-2 w-16 text-center">Predikat</th>
                    <th className="py-2.5 px-3">Deskripsi Capaian Kompetensi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {reportCard.grades.map((g, index) => (
                    <tr key={g.subject_code} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 text-center text-slate-500">{index + 1}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{g.subject_name}</td>
                      <td className="py-2.5 px-2 text-center font-mono text-slate-600">{g.kkm}</td>
                      <td className="py-2.5 px-2 text-center font-mono font-bold text-slate-900">{g.final_score}</td>
                      <td className="py-2.5 px-2 text-center font-bold">
                        <span className={g.predicate === 'A' ? 'text-emerald-700' : 'text-blue-700'}>
                          {g.predicate}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 leading-relaxed text-[11px]">{g.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Attendance & Comments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-xs">
            {/* Attendance Summary */}
            <div className="border border-slate-300 rounded-lg p-4 bg-slate-50/50">
              <h4 className="font-bold uppercase text-slate-800 tracking-wider mb-2">
                B. Rekapitulasi Kehadiran
              </h4>
              <div className="space-y-1.5 font-medium">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">1. Hadir</span>
                  <span className="font-mono font-bold text-slate-900">{reportCard.attendance_summary.present} Hari</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">2. Sakit (S)</span>
                  <span className="font-mono font-bold text-slate-900">{reportCard.attendance_summary.sick} Hari</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">3. Izin (I)</span>
                  <span className="font-mono font-bold text-slate-900">{reportCard.attendance_summary.excused} Hari</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">4. Tanpa Keterangan (A)</span>
                  <span className="font-mono font-bold text-slate-900">{reportCard.attendance_summary.absent} Hari</span>
                </div>
              </div>
            </div>

            {/* General Advice / Comment */}
            <div className="border border-slate-300 rounded-lg p-4 bg-slate-50/50 flex flex-col">
              <h4 className="font-bold uppercase text-slate-800 tracking-wider mb-2">
                C. Catatan & Nasehat Wali Kelas
              </h4>
              <p className="text-slate-700 italic leading-relaxed text-xs flex-1">
                "{reportCard.general_comment || 'Santri menunjukkan kedisiplinan dan budi pekerti yang baik selama proses pembelajaran di madrasah.'}"
              </p>
            </div>
          </div>

          {/* Signatures Area */}
          <div className="grid grid-cols-3 gap-4 pt-6 text-center text-xs">
            <div>
              <p className="text-slate-500 mb-16">Orang Tua / Wali Santri,</p>
              <p className="font-semibold text-slate-900 underline decoration-slate-400">
                ( ......................................... )
              </p>
            </div>
            <div>
              <p className="text-slate-500 mb-16">Wali Kelas,</p>
              <p className="font-bold text-slate-900 underline">
                {reportCard.prepared_by || 'Ustadz Wali Kelas'}
              </p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">
                {institution.city}, {formatTanggal(reportCard.published_at || new Date().toISOString())}
              </p>
              <p className="text-slate-500 mb-16">Kepala MDTU Nurul Hidayah,</p>
              <p className="font-bold text-slate-900 underline">
                {principal.full_name}
              </p>
              <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                NIP/NPK: {principal.teacher_number}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
