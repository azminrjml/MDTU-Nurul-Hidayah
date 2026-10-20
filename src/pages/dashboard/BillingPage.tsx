import React, { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  Search, 
  Printer, 
  AlertCircle, 
  CheckCircle, 
  FileText, 
  RotateCcw, 
  Layers, 
  Calendar,
  X,
  Clock,
  ArrowRight
} from 'lucide-react';
import { AppStorage, formatRupiah, formatTanggal } from '../../lib/storage';
import { PrintReceiptModal } from '../../components/common/PrintReceiptModal';
import { StudentInvoice, Payment } from '../../types';

interface BillingPageProps {
  onNavigate: (path: string) => void;
}

export const BillingPage: React.FC<BillingPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments' | 'arrears' | 'types'>('payments');
  const [invoices, setInvoices] = useState<StudentInvoice[]>(AppStorage.getInvoices());
  const [payments, setPayments] = useState<Payment[]>(AppStorage.getPayments());
  const feeTypes = AppStorage.getFeeTypes();
  const classes = AppStorage.getClasses();
  const students = AppStorage.getStudents().filter(s => s.current_status === 'active');

  // Modal states
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isBatchInvoiceModalOpen, setIsBatchInvoiceModalOpen] = useState(false);
  const [isReversalModalOpen, setIsReversalModalOpen] = useState(false);
  const [reversalPayment, setReversalPayment] = useState<Payment | null>(null);
  const [reversalReason, setReversalReason] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);

  // Form State for Recording Payment
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState<number>(150000);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank_transfer' | 'other'>('cash');
  const [paymentNote, setPaymentNote] = useState('');
  const [paymentError, setPaymentError] = useState('');

  // Form State for Batch Invoices
  const [batchFeeId, setBatchFeeId] = useState(feeTypes[0]?.id || '');
  const [batchPeriod, setBatchPeriod] = useState('November 2026');
  const [batchDueDate, setBatchDueDate] = useState('2026-11-10');
  const [batchClassId, setBatchClassId] = useState('all');
  const [batchReport, setBatchReport] = useState<{ created: number; skippedDuplicates: number } | null>(null);

  const refreshData = () => {
    setInvoices(AppStorage.getInvoices());
    setPayments(AppStorage.getPayments());
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError('');

    if (!selectedInvoiceId) {
      setPaymentError('Pilih tagihan santri terlebih dahulu.');
      return;
    }

    const res = AppStorage.recordPayment({
      invoice_id: selectedInvoiceId,
      amount: Number(paymentAmount),
      payment_method: paymentMethod,
      notes: paymentNote
    });

    if (!res.success) {
      setPaymentError(res.error || 'Gagal mencatat pembayaran.');
      return;
    }

    refreshData();
    setIsRecordModalOpen(false);
    setSelectedInvoiceId('');
    if (res.payment) {
      setSelectedReceipt(res.payment);
    }
  };

  const handleConfirmReversal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reversalPayment) return;

    const res = AppStorage.reversePayment(reversalPayment.id, reversalReason);
    if (!res.success) {
      alert(res.error);
      return;
    }

    refreshData();
    setIsReversalModalOpen(false);
    setReversalPayment(null);
    setReversalReason('');
  };

  const handleCreateBatchInvoices = (e: React.FormEvent) => {
    e.preventDefault();
    const fee = feeTypes.find(f => f.id === batchFeeId);
    const amount = fee ? fee.default_amount : 150000;

    const res = AppStorage.createBatchInvoices({
      fee_type_id: batchFeeId,
      billing_period: batchPeriod,
      due_date: batchDueDate,
      amount,
      class_id: batchClassId === 'all' ? undefined : batchClassId
    });

    setBatchReport(res);
    refreshData();
  };

  // Selected invoice helper for record payment modal
  const selectedInvObj = invoices.find(i => i.id === selectedInvoiceId);
  const remainingForSelected = selectedInvObj 
    ? (selectedInvObj.amount - selectedInvObj.discount_amount) - selectedInvObj.paid_amount 
    : 0;

  // Arrears list
  const arrearsInvoices = invoices.filter(i => i.status === 'unpaid' || i.status === 'partial');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Modul Keuangan & Pembayaran SPP
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pencatatan kasir bendahara, penerbitan kuitansi unik, pembatalan sah (reversal), dan monitoring tunggakan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsBatchInvoiceModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors shadow-xs"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-700" />
            <span>Terbitkan Tagihan Massal</span>
          </button>
          <button
            onClick={() => setIsRecordModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Pembayaran Manual</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'payments' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Riwayat Pembayaran & Kuitansi ({payments.length})
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'invoices' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Daftar Tagihan Santri ({invoices.length})
        </button>
        <button
          onClick={() => setActiveTab('arrears')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'arrears' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Daftar Tunggakan ({arrearsInvoices.length})
        </button>
      </div>

      {/* TAB 1: PAYMENTS */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Kuitansi Pembayaran Terposting</span>
            <span className="text-[11px] text-slate-500 font-medium">Nomor kuitansi unik & tidak dapat dihapus sembarangan</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">No. Kuitansi</th>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Nama Santri</th>
                  <th className="py-3 px-4">Jenis Tagihan</th>
                  <th className="py-3 px-4">Periode</th>
                  <th className="py-3 px-4 text-right">Nominal</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{p.receipt_number}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{formatTanggal(p.payment_date)}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{p.student_name}</td>
                    <td className="py-3 px-4 text-slate-700">{p.fee_type_name}</td>
                    <td className="py-3 px-4 text-slate-600">{p.billing_period}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-800">
                      {formatRupiah(p.amount)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase ${
                        p.status === 'posted' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {p.status === 'posted' ? 'Sah / Terposting' : 'Dibatalkan (Reversal)'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedReceipt(p)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded text-[11px] flex items-center gap-1"
                        >
                          <Printer className="w-3 h-3" />
                          <span>Cetak</span>
                        </button>
                        {p.status === 'posted' && (
                          <button
                            onClick={() => {
                              setReversalPayment(p);
                              setIsReversalModalOpen(true);
                            }}
                            className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                            title="Batalkan Transaksi (Reversal)"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
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
      )}

      {/* TAB 2: INVOICES */}
      {activeTab === 'invoices' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">No. Tagihan</th>
                  <th className="py-3 px-4">Nama Santri & Rombel</th>
                  <th className="py-3 px-4">Jenis & Periode</th>
                  <th className="py-3 px-4">Jatuh Tempo</th>
                  <th className="py-3 px-4 text-right">Total Tagihan</th>
                  <th className="py-3 px-4 text-right">Sudah Dibayar</th>
                  <th className="py-3 px-4 text-right">Sisa Tagihan</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => {
                  const net = inv.amount - inv.discount_amount;
                  const sisa = Math.max(0, net - inv.paid_amount);

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">{inv.invoice_number}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{inv.student_name}</div>
                        <div className="text-[11px] text-slate-400">{inv.class_name}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{inv.fee_type_name}</div>
                        <div className="text-[11px] text-emerald-800 font-medium">{inv.billing_period}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">{formatTanggal(inv.due_date)}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">{formatRupiah(net)}</td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-700">{formatRupiah(inv.paid_amount)}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-amber-700">{formatRupiah(sisa)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase ${
                          inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                          inv.status === 'partial' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ARREARS */}
      {activeTab === 'arrears' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-sm">Daftar Tunggakan Aktif Santri</span>
              <p>Menampilkan seluruh tagihan yang belum lunas atau dibayar sebagian untuk ditindaklanjuti oleh bendahara madrasah.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Nama Santri</th>
                    <th className="py-3 px-4">Rombel</th>
                    <th className="py-3 px-4">Tagihan & Periode</th>
                    <th className="py-3 px-4">Jatuh Tempo</th>
                    <th className="py-3 px-4 text-right">Sisa Tunggakan</th>
                    <th className="py-3 px-4 text-center">Aksi Bayar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {arrearsInvoices.map((inv) => {
                    const net = inv.amount - inv.discount_amount;
                    const sisa = Math.max(0, net - inv.paid_amount);

                    return (
                      <tr key={inv.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4 font-bold text-slate-900">{inv.student_name}</td>
                        <td className="py-3 px-4 text-slate-600">{inv.class_name}</td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-800">{inv.fee_type_name}</span>
                          <span className="text-slate-400 block text-[11px]">{inv.billing_period}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-red-600">{formatTanggal(inv.due_date)}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-red-700">{formatRupiah(sisa)}</td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => {
                              setSelectedInvoiceId(inv.id);
                              setPaymentAmount(sisa);
                              setIsRecordModalOpen(true);
                            }}
                            className="px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold"
                          >
                            Bayar Sekarang
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: RECORD PAYMENT MANUAL */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-sm font-bold flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-300" />
                <span>Pencatatan Pembayaran Manual Kasir</span>
              </h2>
              <button onClick={() => setIsRecordModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="p-6 space-y-4 text-xs">
              {paymentError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-medium">
                  {paymentError}
                </div>
              )}

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Pilih Tagihan Santri *</label>
                <select
                  required
                  value={selectedInvoiceId}
                  onChange={(e) => {
                    setSelectedInvoiceId(e.target.value);
                    const inv = invoices.find(i => i.id === e.target.value);
                    if (inv) {
                      const net = inv.amount - inv.discount_amount;
                      setPaymentAmount(Math.max(0, net - inv.paid_amount));
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white font-medium"
                >
                  <option value="">-- Pilih Tagihan Santri --</option>
                  {invoices.filter(i => i.status !== 'paid').map(inv => {
                    const sisa = (inv.amount - inv.discount_amount) - inv.paid_amount;
                    return (
                      <option key={inv.id} value={inv.id}>
                        {inv.student_name} ({inv.class_name}) - {inv.fee_type_name} {inv.billing_period} - Sisa {formatRupiah(sisa)}
                      </option>
                    );
                  })}
                </select>
              </div>

              {selectedInvObj && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                  <div className="text-[11px] text-emerald-900 font-semibold">
                    Tagihan: {selectedInvObj.fee_type_name} ({selectedInvObj.billing_period})
                  </div>
                  <div className="text-xs text-slate-700 flex justify-between font-mono">
                    <span>Sisa Tagihan:</span>
                    <strong className="text-emerald-800">{formatRupiah(remainingForSelected)}</strong>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Nominal Diterima (Rp) *</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    max={remainingForSelected || 9999999}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Metode Pembayaran</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                  >
                    <option value="cash">Tunai di Kasir TU</option>
                    <option value="bank_transfer">Transfer Bank (BSI)</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Catatan Tambahan (Opsional)</label>
                <input
                  type="text"
                  placeholder="Misal: Titipan wali via santri"
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold"
                >
                  Posting & Cetak Kuitansi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: BATCH INVOICES */}
      {isBatchInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-sm font-bold flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-300" />
                <span>Terbitkan Tagihan Bulanan Massal</span>
              </h2>
              <button onClick={() => { setIsBatchInvoiceModalOpen(false); setBatchReport(null); }} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBatchInvoices} className="p-6 space-y-4 text-xs">
              <p className="text-slate-600">
                Sistem akan membuatkan tagihan bagi santri yang belum memiliki tagihan pada periode ini (dilindungi proteksi anti duplikat).
              </p>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Jenis Tagihan</label>
                <select
                  value={batchFeeId}
                  onChange={(e) => setBatchFeeId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  {feeTypes.map(f => (
                    <option key={f.id} value={f.id}>{f.name} - Default: {formatRupiah(f.default_amount)}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Periode Tagihan</label>
                  <input
                    type="text"
                    value={batchPeriod}
                    onChange={(e) => setBatchPeriod(e.target.value)}
                    placeholder="Contoh: November 2026"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Jatuh Tempo</label>
                  <input
                    type="date"
                    value={batchDueDate}
                    onChange={(e) => setBatchDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Target Rombel Kelas</label>
                <select
                  value={batchClassId}
                  onChange={(e) => setBatchClassId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="all">Semua Kelas Santri Aktif</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {batchReport && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                  <span className="font-bold block">Hasil Pembuatan Tagihan:</span>
                  <div>· Berhasil dibuat: {batchReport.created} invoice baru</div>
                  <div>· Dilewati (sudah ada): {batchReport.skippedDuplicates} invoice</div>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setIsBatchInvoiceModalOpen(false); setBatchReport(null); }}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold"
                >
                  Jalankan Pembuatan Tagihan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: REVERSAL CONFIRMATION */}
      {isReversalModalOpen && reversalPayment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-red-900 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-sm font-bold flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                <span>Pembalikan Pembayaran (Reversal)</span>
              </h2>
              <button onClick={() => setIsReversalModalOpen(false)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReversal} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 space-y-1">
                <div>No. Kuitansi: <strong>{reversalPayment.receipt_number}</strong></div>
                <div>Santri: <strong>{reversalPayment.student_name}</strong></div>
                <div>Nominal: <strong>{formatRupiah(reversalPayment.amount)}</strong></div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Alasan Pembatalan Resmi *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Wajib mencantumkan alasan pembatalan (misal: salah input nominal oleh kasir)"
                  value={reversalReason}
                  onChange={(e) => setReversalReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReversalModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold"
                >
                  Konfirmasi Reversal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <PrintReceiptModal
          payment={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
};
