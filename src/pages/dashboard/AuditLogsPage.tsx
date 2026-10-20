import React from 'react';
import { ShieldAlert, ShieldCheck, Clock, User, FileText, ArrowLeft } from 'lucide-react';
import { AppStorage, formatTanggal } from '../../lib/storage';

interface AuditLogsPageProps {
  onNavigate: (path: string) => void;
}

export const AuditLogsPage: React.FC<AuditLogsPageProps> = ({ onNavigate }) => {
  const logs = AppStorage.getAuditLogs();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-emerald-800" />
            <span>Log Audit Keamanan Sistem</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Rekam jejak tidak dapat diubah (immutable trail) atas tindakan transaksi, revisi nilai, penerbitan rapor, dan perubahan akun.
          </p>
        </div>
      </div>

      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
        <span>
          Prinsip Keamanan: Log audit dicatat secara otomatis oleh backend database. Kata sandi, token autentikasi, dan isi dokumen privat tidak disimpan dalam audit log demi privasi.
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Waktu & Tanggal</th>
                <th className="py-3 px-4">Aktor Pengguna</th>
                <th className="py-3 px-4">Tindakan / Aksi</th>
                <th className="py-3 px-4">Entitas & ID</th>
                <th className="py-3 px-4">Metadata Aman</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                    {formatTanggal(log.created_at)}
                  </td>
                  <td className="py-3 px-4 font-sans font-semibold text-slate-900">
                    {log.actor_name}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-sm bg-slate-100 text-slate-800 font-bold text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-emerald-800 font-semibold text-[11px]">
                    {log.entity_type} ({log.entity_id})
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-[11px] font-mono">
                    {JSON.stringify(log.safe_metadata)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
