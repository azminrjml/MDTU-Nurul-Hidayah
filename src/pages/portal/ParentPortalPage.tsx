import React, { useState } from 'react';
import { 
  User, 
  Users, 
  CalendarCheck, 
  CreditCard, 
  Award, 
  FileText, 
  LogOut, 
  ArrowLeft, 
  Printer, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Send,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import { AppStorage, formatRupiah, formatTanggal } from '../../lib/storage';
import { PrintReceiptModal } from '../../components/common/PrintReceiptModal';
import { PrintReportCardModal } from '../../components/common/PrintReportCardModal';
import { Payment, ReportCard, Student } from '../../types';

interface ParentPortalPageProps {
  onNavigate: (path: string) => void;
}

export const ParentPortalPage: React.FC<ParentPortalPageProps> = ({ onNavigate }) => {
  const currentUser = AppStorage.getCurrentUser();
  const institution = AppStorage.getInstitution();
  
  // Hendra Wijaya is guardian of: Farhan (std-001) and Aisyah (std-002)
  const allStudents = AppStorage.getStudents();
  const children = allStudents.filter(s => 
    s.guardian_name?.toLowerCase().includes('hendra') || 
    s.id === 'std-001' || 
    s.id === 'std-002'
  );

  const [selectedChildId, setSelectedChildId] = useState(children[0]?.id || 'std-001');
  const [activePortalTab, setActivePortalTab] = useState<'overview' | 'attendance' | 'billing' | 'report' | 'correction'>('overview');

  // Modals
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);
  const [selectedReportCard, setSelectedReportCard] = useState<ReportCard | null>(null);

  // Correction request state
  const [correctionNote, setCorrectionNote] = useState('');
  const [correctionSent, setCorrectionSent] = useState(false);

  const selectedChild = children.find(c => c.id === selectedChildId) || children[0];

  // Specific data for the active child
  const childInvoices = AppStorage.getInvoices().filter(i => i.student_id === selectedChild?.id);
  const childPayments = AppStorage.getPayments().filter(p => p.student_id === selectedChild?.id && p.status === 'posted');
  const childAttendance = AppStorage.getAttendanceRecords().filter(a => a.student_id === selectedChild?.id);
  
  // Only published report cards are accessible for guardians (Strict RLS enforcement)
  const childReportCards = AppStorage.getReportCards().filter(
    r => r.student_id === selectedChild?.id && r.status === 'published'
  );

  const announcements = AppStorage.getAnnouncements().slice(0, 3);

  const handleSendCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionNote.trim()) return;

    AppStorage.logAudit('GUARDIAN_DATA_CORRECTION_REQUEST', 'STUDENT', selectedChild.id, {
      guardian_name: currentUser.full_name,
      student_name: selectedChild.full_name,
      note: correctionNote
    });

    setCorrectionSent(true);
    setTimeout(() => {
      setCorrectionSent(false);
      setCorrectionNote('');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Portal Top Bar */}
      <header className="bg-emerald-950 text-white sticky top-0 z-40 border-b border-emerald-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-sm font-bold tracking-tight">Portal Wali Santri</span>
              <span className="block text-[11px] text-emerald-300">{institution.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="hidden sm:block text-right">
              <span className="block font-semibold text-white">{currentUser.full_name}</span>
              <span className="block text-[10px] text-amber-300 font-mono">{currentUser.phone}</span>
            </div>
            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-slate-200 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8 w-full">
        {/* Child Selector (If parent has multiple children) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-1">
              Santri Terhubung dengan Akun Anda
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              Pilih Data Putra / Putri
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {children.map((child) => {
              const isSelected = child.id === selectedChildId;
              return (
                <button
                  key={child.id}
                  onClick={() => setSelectedChildId(child.id)}
                  className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isSelected 
                      ? 'bg-emerald-800 text-white shadow-md' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{child.full_name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${isSelected ? 'bg-emerald-900 text-emerald-200' : 'bg-white text-slate-500'}`}>
                    {child.class_name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Tabs for Selected Child */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActivePortalTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activePortalTab === 'overview' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Ringkasan Ananda
          </button>
          <button
            onClick={() => setActivePortalTab('attendance')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activePortalTab === 'attendance' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Presensi Kehadiran
          </button>
          <button
            onClick={() => setActivePortalTab('billing')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activePortalTab === 'billing' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Tagihan & Kuitansi SPP
          </button>
          <button
            onClick={() => setActivePortalTab('report')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activePortalTab === 'report' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Rapor Resmi (Published)
          </button>
          <button
            onClick={() => setActivePortalTab('correction')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activePortalTab === 'correction' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Permohonan Koreksi Data
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activePortalTab === 'overview' && (
          <div className="space-y-6">
            {/* Child Profile Info Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-white font-black text-2xl flex items-center justify-center shrink-0 border-2 border-emerald-700 shadow-xs">
                {selectedChild.full_name.charAt(0)}
              </div>
              <div className="space-y-1 flex-1">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block">
                  Santri Aktif Diniyah Takmiliyah
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">{selectedChild.full_name}</h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-mono pt-1">
                  <span>NIS: <strong className="text-slate-800">{selectedChild.student_number}</strong></span>
                  <span>·</span>
                  <span>Rombel: <strong className="text-emerald-800">{selectedChild.class_name}</strong></span>
                  <span>·</span>
                  <span>Tempat Lahir: <strong>{selectedChild.birth_place}</strong></span>
                </div>
              </div>
            </div>

            {/* Quick KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-medium">Presensi Terakhir</span>
                  <CalendarCheck className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="text-xl font-bold text-emerald-800">
                  {childAttendance[0]?.status === 'present' ? 'Hadir Tertib' : 'Tercatat'}
                </div>
                <p className="text-[11px] text-slate-400">
                  Kehadiran aktif {childAttendance.length} sesi
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-medium">Tagihan Bulan Ini</span>
                  <CreditCard className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-xl font-bold text-slate-900 font-mono">
                  {childInvoices[0]?.status === 'paid' ? 'Lunas' : formatRupiah(childInvoices[0]?.amount || 150000)}
                </div>
                <p className="text-[11px] text-slate-400">
                  SPP Syahriah Diniyah
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-medium">Buku Rapor Digital</span>
                  <Award className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="text-xl font-bold text-slate-900">
                  {childReportCards.length > 0 ? 'Tersedia' : 'Dalam Proses'}
                </div>
                <p className="text-[11px] text-slate-400">
                  Pengesahan resmi Kepala MDTU
                </p>
              </div>
            </div>

            {/* Announcements for Parents */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Pengumuman Terkini Madrasah</h3>
              <div className="divide-y divide-slate-100 text-xs">
                {announcements.map((item) => (
                  <div key={item.id} className="py-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{item.title}</span>
                      <span className="text-slate-400 font-mono text-[11px]">{formatTanggal(item.published_at)}</span>
                    </div>
                    <p className="text-slate-600 line-clamp-2 leading-relaxed">{item.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ATTENDANCE */}
        {activePortalTab === 'attendance' && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm">Riwayat Presensi {selectedChild.full_name}</h3>
              <p className="text-xs text-slate-500">Catatan kehadiran tercatat langsung oleh ustadz pengampu di kelas.</p>
            </div>
            <div className="p-6">
              {childAttendance.length === 0 ? (
                <p className="text-center text-slate-400 text-xs py-8">Belum ada riwayat presensi yang terekam.</p>
              ) : (
                <div className="space-y-2 text-xs">
                  {childAttendance.map((att) => (
                    <div key={att.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 capitalize text-sm">{att.status}</span>
                        <p className="text-[11px] text-slate-500">{att.note || 'Mengikuti KBM Diniyah Sore'}</p>
                      </div>
                      <span className="font-mono text-slate-500">{formatTanggal(att.created_at)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: BILLING & PAYMENTS */}
        {activePortalTab === 'billing' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Status Tagihan SPP & Iuran</h3>
              <div className="divide-y divide-slate-100 text-xs">
                {childInvoices.map((inv) => (
                  <div key={inv.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{inv.fee_type_name} ({inv.billing_period})</div>
                      <div className="text-[11px] text-slate-400 font-mono">No. Tagihan: {inv.invoice_number}</div>
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
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Riwayat Pembayaran & Kuitansi Sah</h3>
              <div className="divide-y divide-slate-100 text-xs">
                {childPayments.map((p) => (
                  <div key={p.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{p.fee_type_name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">No. Kuitansi: {p.receipt_number} · {formatTanggal(p.payment_date)}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-emerald-800">{formatRupiah(p.amount)}</span>
                      <button
                        onClick={() => setSelectedReceipt(p)}
                        className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold flex items-center gap-1.5"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Unduh Kuitansi</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: RAPOR RESMI (PUBLISHED) */}
        {activePortalTab === 'report' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Buku Laporan Capaian Santri (Rapor Digital)</h3>
            <p className="text-xs text-slate-500">
              Rapor resmi yang telah ditandatangani dan disahkan oleh Kepala Madrasah Diniyah Takmiliyah Ula.
            </p>

            {childReportCards.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                Rapor semester ini sedang dalam proses review dan penilaian akhir oleh dewan asatidz.
              </div>
            ) : (
              <div className="space-y-3">
                {childReportCards.map((rc) => (
                  <div key={rc.id} className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">
                        Rapor Semester {rc.semester} - Tahun Ajaran {rc.academic_year_name}
                      </span>
                      <span className="text-xs text-emerald-800 font-semibold">
                        Status: Sah & Diterbitkan ({formatTanggal(rc.published_at || '')})
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedReportCard(rc)}
                      className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs"
                    >
                      <Award className="w-4 h-4" />
                      <span>Buka & Cetak Rapor</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: PERMOHONAN KOREKSI DATA */}
        {activePortalTab === 'correction' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Permohonan Perbaikan / Koreksi Data Santri</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Jika terdapat kekeliruan penulisan nama, tanggal lahir, nomor induk, atau alamat santri, silakan ajukan permohonan koreksi di bawah ini untuk ditinjau oleh operator tata usaha madrasah.
            </p>

            {correctionSent ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-xs font-semibold">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Permohonan koreksi data untuk {selectedChild.full_name} berhasil dikirimkan ke bagian tata usaha!</span>
              </div>
            ) : (
              <form onSubmit={handleSendCorrection} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Rincian Koreksi yang Diajukan *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Sebutkan data yang salah dan data perbaikan yang benar (Contoh: Mohon koreksi tempat lahir Farhan dari 'Cimahi' menjadi 'Bandung' sesuai akte kelahiran terlampir)"
                    value={correctionNote}
                    onChange={(e) => setCorrectionNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-xs flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim Permohonan Koreksi</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </main>

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <PrintReceiptModal
          payment={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
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
