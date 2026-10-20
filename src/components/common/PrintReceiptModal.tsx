import React from 'react';
import { Printer, X, CheckCircle, ShieldCheck } from 'lucide-react';
import { Payment } from '../../types';
import { AppStorage, formatRupiah, formatTanggal, angkaTerbilang } from '../../lib/storage';

interface PrintReceiptModalProps {
  payment: Payment;
  onClose: () => void;
}

export const PrintReceiptModal: React.FC<PrintReceiptModalProps> = ({ payment, onClose }) => {
  const institution = AppStorage.getInstitution();
  const terbilangStr = angkaTerbilang(payment.amount) + ' Rupiah';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200">
        {/* Action Header - will hide on print */}
        <div className="no-print bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-400" />
            <span className="font-semibold text-sm">Pratinjau Kuitansi Pembayaran Sah</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Kuitansi</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-8 sm:p-10 text-slate-900 bg-white">
          {/* Header Kop */}
          <div className="border-b-2 border-emerald-900 pb-4 mb-6 text-center relative">
            <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 text-[11px] font-bold tracking-widest uppercase mb-1 rounded-sm">
              Kementerian Agama Republik Indonesia
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-emerald-950 uppercase tracking-tight">
              {institution.name}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-emerald-800">
              {institution.institution_type} · NSM: {institution.institution_number}
            </p>
            <p className="text-[11px] text-slate-600 mt-1">
              {institution.address}, {institution.city} · Telp: {institution.phone}
            </p>
          </div>

          {/* Receipt Title & Meta */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-3 border-b border-dashed border-slate-300 gap-2">
            <div>
              <span className="text-xs font-bold text-emerald-900 tracking-wider uppercase block">
                Kuitansi Pembayaran
              </span>
              <span className="text-sm font-mono font-bold text-slate-800">
                No: {payment.receipt_number}
              </span>
            </div>
            <div className="text-right sm:text-right">
              <span className="text-xs text-slate-500 block">Tanggal Transaksi:</span>
              <span className="text-xs font-semibold text-slate-800 font-mono">
                {formatTanggal(payment.payment_date)}
              </span>
            </div>
          </div>

          {/* Receipt Body Table */}
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed mb-8">
            <div className="grid grid-cols-3 py-1.5 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Telah Diterima Dari</span>
              <span className="col-span-2 font-bold text-slate-900">
                {payment.student_name}
              </span>
            </div>
            <div className="grid grid-cols-3 py-1.5 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Uang Sejumlah</span>
              <span className="col-span-2 font-mono font-bold text-emerald-800 text-base">
                {formatRupiah(payment.amount)}
              </span>
            </div>
            <div className="grid grid-cols-3 py-1.5 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Terbilang</span>
              <span className="col-span-2 font-semibold italic text-slate-700 bg-slate-50 p-2 rounded-md border border-slate-200">
                "{terbilangStr}"
              </span>
            </div>
            <div className="grid grid-cols-3 py-1.5 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Untuk Pembayaran</span>
              <span className="col-span-2 font-semibold text-slate-800">
                {payment.fee_type_name} ({payment.billing_period})
              </span>
            </div>
            <div className="grid grid-cols-3 py-1.5 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Metode Pembayaran</span>
              <span className="col-span-2 capitalize font-medium text-slate-800">
                {payment.payment_method === 'cash' ? 'Tunai di Kasir MDTU' : payment.payment_method === 'bank_transfer' ? 'Transfer Bank' : 'Lainnya'}
              </span>
            </div>
            {payment.notes && (
              <div className="grid grid-cols-3 py-1.5 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Catatan</span>
                <span className="col-span-2 text-slate-600">
                  {payment.notes}
                </span>
              </div>
            )}
            {payment.status === 'reversed' && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-semibold">
                PERINGATAN: Pembayaran ini telah dibatalkan (Reversal) pada {formatTanggal(payment.reversed_at || '')}. Alasan: {payment.reversal_reason}.
              </div>
            )}
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-4 mt-6 text-center text-xs">
            <div>
              <p className="text-slate-500 mb-16">Penyetor / Wali Santri,</p>
              <p className="font-semibold text-slate-800 underline decoration-slate-400">
                ( ............................................ )
              </p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">
                {institution.city}, {formatTanggal(payment.payment_date)}
              </p>
              <p className="text-slate-500 mb-16">Penerima / Bendahara Madrasah,</p>
              <p className="font-bold text-slate-900 underline">
                {payment.received_by_name || 'Bendahara MDTU'}
              </p>
              <span className="text-[10px] text-emerald-800 font-medium block mt-1">
                Dicetak sah melalui Sistem Informasi MDTU Nurul Hidayah
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
