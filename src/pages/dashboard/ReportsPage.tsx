import React, { useState } from 'react';
import { BarChart3, Printer, Download, Users, CreditCard, CalendarCheck, FileSpreadsheet } from 'lucide-react';
import { AppStorage, formatRupiah, formatTanggal } from '../../lib/storage';

interface ReportsPageProps {
  onNavigate: (path: string) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ onNavigate }) => {
  const [reportType, setReportType] = useState<'students' | 'payments' | 'attendance'>('payments');
  const students = AppStorage.getStudents();
  const payments = AppStorage.getPayments().filter(p => p.status === 'posted');
  const attendance = AppStorage.getAttendanceRecords();

  const handleExportCSV = () => {
    let csvHeader = '';
    let csvRows = '';

    if (reportType === 'payments') {
      csvHeader = 'No Kuitansi,Nama Santri,Jenis Tagihan,Periode,Tanggal,Nominal,Metode\n';
      csvRows = payments.map(p => 
        `"${p.receipt_number}","${p.student_name}","${p.fee_type_name}","${p.billing_period}","${p.payment_date}",${p.amount},"${p.payment_method}"`
      ).join('\n');
    } else if (reportType === 'students') {
      csvHeader = 'NIS,Nama Lengkap,Gender,Rombel,Wali,No Kontak\n';
      csvRows = students.map(s => 
        `"${s.student_number}","${s.full_name}","${s.gender}","${s.class_name}","${s.guardian_name}","${s.guardian_phone}"`
      ).join('\n');
    } else {
      csvHeader = 'Tanggal,Nama Santri,Status,Catatan\n';
      csvRows = attendance.map(a => 
        `"${a.created_at}","${a.student_name}","${a.status}","${a.note || '-'}"`
      ).join('\n');
    }

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `rekap_${reportType}_mdtu_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Pusat Laporan & Rekapitulasi Data
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ekspor data siap cetak untuk pelaporan Kementerian Agama dan pengurus yayasan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Rekapitulasi</span>
          </button>
        </div>
      </div>

      {/* Report Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setReportType('payments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            reportType === 'payments' ? 'bg-emerald-800 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Rekap Keuangan & Kuitansi</span>
        </button>

        <button
          onClick={() => setReportType('students')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            reportType === 'students' ? 'bg-emerald-800 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Rekapitulasi Santri Aktif</span>
        </button>

        <button
          onClick={() => setReportType('attendance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            reportType === 'attendance' ? 'bg-emerald-800 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700'
          }`}
        >
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>Rekapitulasi Presensi Sesi</span>
        </button>
      </div>

      {/* Table Display */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {reportType === 'payments' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">No. Kuitansi</th>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Nama Santri</th>
                  <th className="py-3 px-4">Jenis Tagihan</th>
                  <th className="py-3 px-4">Periode</th>
                  <th className="py-3 px-4 text-right">Nominal Sah</th>
                  <th className="py-3 px-4">Metode Bayar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map(p => (
                  <tr key={p.id}>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{p.receipt_number}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{formatTanggal(p.payment_date)}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{p.student_name}</td>
                    <td className="py-3 px-4 text-slate-700">{p.fee_type_name}</td>
                    <td className="py-3 px-4 text-slate-600">{p.billing_period}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-800">{formatRupiah(p.amount)}</td>
                    <td className="py-3 px-4 capitalize">{p.payment_method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'students' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">NIS</th>
                  <th className="py-3 px-4">Nama Lengkap Santri</th>
                  <th className="py-3 px-4">Gender</th>
                  <th className="py-3 px-4">Rombel Kelas</th>
                  <th className="py-3 px-4">Wali Santri</th>
                  <th className="py-3 px-4 font-mono">No. WhatsApp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map(s => (
                  <tr key={s.id}>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{s.student_number}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{s.full_name}</td>
                    <td className="py-3 px-4">{s.gender === 'L' ? 'Putra' : 'Putri'}</td>
                    <td className="py-3 px-4 text-slate-700">{s.class_name}</td>
                    <td className="py-3 px-4 text-slate-800 font-medium">{s.guardian_name}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{s.guardian_phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'attendance' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Waktu Sesi</th>
                  <th className="py-3 px-4">Nama Santri</th>
                  <th className="py-3 px-4">Status Kehadiran</th>
                  <th className="py-3 px-4">Keterangan</th>
                  <th className="py-3 px-4">Dicatat Oleh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendance.map(a => (
                  <tr key={a.id}>
                    <td className="py-3 px-4 font-mono text-slate-500">{formatTanggal(a.created_at)}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{a.student_name}</td>
                    <td className="py-3 px-4 capitalize font-semibold text-emerald-800">{a.status}</td>
                    <td className="py-3 px-4 text-slate-600">{a.note || '-'}</td>
                    <td className="py-3 px-4 text-slate-500">{a.recorded_by || 'Ustadz Pengampu'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
