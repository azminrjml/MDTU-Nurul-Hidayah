import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Users, 
  CalendarCheck, 
  CreditCard, 
  Award, 
  FileText, 
  Image as ImageIcon, 
  Activity, 
  Edit, 
  Printer, 
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { AppStorage, formatRupiah, formatTanggal } from '../../lib/storage';
import { PrintReceiptModal } from '../../components/common/PrintReceiptModal';
import { PrintReportCardModal } from '../../components/common/PrintReportCardModal';
import { Payment, ReportCard } from '../../types';

interface StudentDetailPageProps {
  studentId: string;
  onNavigate: (path: string) => void;
}

export const StudentDetailPage: React.FC<StudentDetailPageProps> = ({ studentId, onNavigate }) => {
  const student = AppStorage.getStudentById(studentId);
  const [activeTab, setActiveTab] = useState<'biodata' | 'guardian' | 'attendance' | 'billing' | 'report' | 'documents' | 'history'>('biodata');

  // Modals for receipt / report card
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [selectedReportCard, setSelectedReportCard] = useState<ReportCard | null>(null);

  if (!student) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Santri Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500">ID Santri tidak valid atau telah dihapus.</p>
        <button
          onClick={() => onNavigate('/app/students')}
          className="px-4 py-2 bg-emerald-800 text-white rounded-lg text-xs font-semibold"
        >
          Kembali ke Data Santri
        </button>
      </div>
    );
  }

  // Relations
  const studentInvoices = AppStorage.getInvoices().filter(i => i.student_id === studentId);
  const studentPayments = AppStorage.getPayments().filter(p => p.student_id === studentId);
  const studentAttendance = AppStorage.getAttendanceRecords().filter(a => a.student_id === studentId);
  const studentReportCard = AppStorage.getReportCards().find(r => r.student_id === studentId);
  const studentLogs = AppStorage.getAuditLogs().filter(l => 
    l.safe_metadata?.student?.includes(student.full_name) || l.entity_id === studentId
  );

  const tabs = [
    { id: 'biodata', label: 'Biodata Santri', icon: User },
    { id: 'guardian', label: 'Orang Tua / Wali', icon: Users },
    { id: 'attendance', label: 'Presensi Kehadiran', icon: CalendarCheck },
    { id: 'billing', label: 'Tagihan & SPP', icon: CreditCard },
    { id: 'report', label: 'Nilai & Rapor', icon: Award },
    { id: 'documents', label: 'Dokumen Privat', icon: FileText },
    { id: 'history', label: 'Riwayat Aktivitas', icon: Activity },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <button
          onClick={() => onNavigate('/app/students')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 hover:text-emerald-950"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Santri</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Profil</span>
          </button>
        </div>
      </div>

      {/* Student Banner Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-emerald-800 text-white font-black text-2xl flex items-center justify-center shrink-0 border-2 border-emerald-700 shadow-xs">
          {student.full_name.charAt(0)}
        </div>
        <div className="space-y-1 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">{student.full_name}</h1>
            <span className="px-2 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 text-xs font-bold uppercase">
              {student.current_status}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-mono">
            <span>NIS: <strong className="text-slate-800">{student.student_number}</strong></span>
            <span>·</span>
            <span>Rombel: <strong className="text-emerald-800">{student.class_name}</strong></span>
            <span>·</span>
            <span>Gender: <strong>{student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</strong></span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 pb-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                isActive ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        {/* 1. BIODATA */}
        {activeTab === 'biodata' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Biodata Lengkap Santri
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 block">Nama Lengkap</span>
                <span className="font-bold text-slate-900 text-sm">{student.full_name}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 block">Nama Panggilan</span>
                <span className="font-semibold text-slate-900 text-sm">{student.nickname || '-'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 block">Nomor Induk Santri (NIS)</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{student.student_number}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 block">NISN Nasional</span>
                <span className="font-mono font-semibold text-slate-900 text-sm">{student.nisn || '-'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 block">Tempat & Tanggal Lahir</span>
                <span className="font-semibold text-slate-900 text-sm">{student.birth_place}, {formatTanggal(student.birth_date)}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 block">Agama</span>
                <span className="font-semibold text-slate-900 text-sm">{student.religion}</span>
              </div>
              <div className="md:col-span-2 p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 block">Alamat Domisili</span>
                <span className="font-semibold text-slate-900 text-sm">{student.address}</span>
              </div>
            </div>
          </div>
        )}

        {/* 2. ORANG TUA / WALI */}
        {activeTab === 'guardian' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Informasi Relasi Orang Tua / Wali
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 block">Nama Orang Tua / Wali</span>
                <span className="font-bold text-slate-900 text-sm">{student.guardian_name || '-'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 block">Nomor WhatsApp / Telepon</span>
                <span className="font-mono font-bold text-emerald-800 text-sm">{student.guardian_phone || '-'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 block">Hak Akses Portal Akademik</span>
                <span className="font-semibold text-emerald-700">Diizinkan (Row Level Security Aktif)</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 block">Hak Akses Riwayat Tagihan SPP</span>
                <span className="font-semibold text-emerald-700">Diizinkan</span>
              </div>
            </div>
          </div>
        )}

        {/* 3. PRESENSI */}
        {activeTab === 'attendance' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Rekapitulasi Presensi Sesi Diniyah
            </h3>
            {studentAttendance.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Belum ada catatan presensi terekam.</p>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-2 px-3">Tanggal & Sesi</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentAttendance.map((att) => (
                    <tr key={att.id}>
                      <td className="py-2 px-3 font-mono">{formatTanggal(att.created_at)}</td>
                      <td className="py-2 px-3 capitalize font-semibold text-emerald-800">{att.status}</td>
                      <td className="py-2 px-3 text-slate-500">{att.note || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* 4. BILLING */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">Tagihan Diterbitkan</h3>
              <div className="divide-y divide-slate-100 text-xs border border-slate-200 rounded-xl overflow-hidden">
                {studentInvoices.length === 0 ? (
                  <p className="p-4 text-center text-slate-400">Tidak ada tagihan aktif.</p>
                ) : (
                  studentInvoices.map((inv) => (
                    <div key={inv.id} className="p-3 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">{inv.fee_type_name} ({inv.billing_period})</div>
                        <div className="text-[11px] font-mono text-slate-500">No: {inv.invoice_number}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-slate-900">{formatRupiah(inv.amount)}</div>
                        <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase ${
                          inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {inv.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">Riwayat Pembayaran Sah</h3>
              <div className="divide-y divide-slate-100 text-xs border border-slate-200 rounded-xl overflow-hidden">
                {studentPayments.length === 0 ? (
                  <p className="p-4 text-center text-slate-400">Belum ada pembayaran terekam.</p>
                ) : (
                  studentPayments.map((p) => (
                    <div key={p.id} className="p-3 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">{p.fee_type_name}</div>
                        <div className="text-[11px] font-mono text-slate-500">Kuitansi: {p.receipt_number} · {formatTanggal(p.payment_date)}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-emerald-800">{formatRupiah(p.amount)}</span>
                        <button
                          onClick={() => setSelectedPayment(p)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded text-[11px]"
                        >
                          Cetak Kuitansi
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* 5. RAPOR */}
        {activeTab === 'report' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Buku Laporan Hasil Belajar (Rapor)
            </h3>
            {studentReportCard ? (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Rapor Semester {studentReportCard.semester} ({studentReportCard.academic_year_name})
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Status: <strong className="uppercase text-emerald-800">{studentReportCard.status}</strong>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedReportCard(studentReportCard)}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Award className="w-4 h-4" />
                  <span>Buka Rapor Santri</span>
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">Belum ada rapor yang diterbitkan.</p>
            )}
          </div>
        )}

        {/* 6. DOKUMEN PRIVAT */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Berkas Privat Santri (Supabase Storage Private Bucket)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                <FileText className="w-5 h-5 text-emerald-700" />
                <span className="font-bold text-slate-900 block">Akte Kelahiran Santri</span>
                <span className="text-[10px] text-emerald-700 font-semibold block">Telah Terverifikasi TU</span>
              </div>
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                <FileText className="w-5 h-5 text-emerald-700" />
                <span className="font-bold text-slate-900 block">Kartu Keluarga (KK)</span>
                <span className="text-[10px] text-emerald-700 font-semibold block">Telah Terverifikasi TU</span>
              </div>
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                <FileText className="w-5 h-5 text-emerald-700" />
                <span className="font-bold text-slate-900 block">Ijazah RA / TK</span>
                <span className="text-[10px] text-slate-500 font-semibold block">Berkas Pelengkap</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              Dokumen tersimpan pada bucket privat <code>student-documents-private</code> dengan autentikasi berumur pendek demi keamanan data keluarga.
            </p>
          </div>
        )}

        {/* 7. RIWAYAT AKTIVITAS */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Log Riwayat Aktivitas & Perubahan
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-900">Registrasi Santri Baru</span>
                  <p className="text-[11px] text-slate-500">Penempatan rombel: {student.class_name}</p>
                </div>
                <span className="font-mono text-slate-400">{formatTanggal(student.created_at)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Printable Receipt Modal */}
      {selectedPayment && (
        <PrintReceiptModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}

      {/* Printable Report Card Modal */}
      {selectedReportCard && (
        <PrintReportCardModal
          reportCard={selectedReportCard}
          onClose={() => setSelectedReportCard(null)}
        />
      )}
    </div>
  );
};
