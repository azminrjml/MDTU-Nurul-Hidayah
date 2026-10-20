import React, { useState } from 'react';
import { Settings, Save, CheckCircle, Database, ShieldCheck, Download, Upload, AlertCircle } from 'lucide-react';
import { AppStorage } from '../../lib/storage';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Institution } from '../../types';

interface SettingsPageProps {
  onNavigate: (path: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const [institution, setInstitution] = useState<Institution>(AppStorage.getInstitution());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    AppStorage.updateInstitution(institution);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleBackupJSON = () => {
    const backupData = {
      institution: AppStorage.getInstitution(),
      students: AppStorage.getStudents(),
      teachers: AppStorage.getTeachers(),
      classes: AppStorage.getClasses(),
      invoices: AppStorage.getInvoices(),
      payments: AppStorage.getPayments(),
      reportCards: AppStorage.getReportCards(),
      auditLogs: AppStorage.getAuditLogs(),
      backup_date: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `backup_database_mdtu_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Pengaturan Lembaga & Konfigurasi Sistem
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Identitas resmi MDTU Nurul Hidayah, izin operasional Kemenag, dan status basis data.
          </p>
        </div>

        <button
          onClick={handleBackupJSON}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-emerald-700" />
          <span>Cadangkan Data (Backup JSON)</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-xs font-semibold">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Perubahan data lembaga berhasil diperbarui!</span>
        </div>
      )}

      {/* Database Connection Status Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-800" />
            <h2 className="text-sm font-bold text-slate-900">Status Basis Data & Supabase PostgreSQL</h2>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
            isSupabaseConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-900'
          }`}>
            {isSupabaseConfigured ? 'Terkoneksi ke Supabase Online' : 'Engine Relasional Lokal Aktif (Persisten)'}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          File migrasi SQL lengkap berisi 25 tabel, Row Level Security (RLS), kebijakan Storage, dan pemicu atomik tersedia di: <br />
          <code className="bg-slate-100 text-emerald-900 px-2 py-0.5 rounded font-mono text-[11px] font-bold">
            supabase/migrations/20261019000000_mdtu_nurul_hidayah_schema.sql
          </code>
        </p>
      </div>

      {/* Institution Settings Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6 text-xs">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
          Identitas Resmi Lembaga
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Nama Madrasah</label>
            <input
              type="text"
              required
              value={institution.name}
              onChange={(e) => setInstitution({ ...institution, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Jenis Satuan Pendidikan</label>
            <input
              type="text"
              value={institution.institution_type}
              onChange={(e) => setInstitution({ ...institution, institution_type: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Nomor Statistik Madrasah (NSM)</label>
            <input
              type="text"
              required
              value={institution.institution_number}
              onChange={(e) => setInstitution({ ...institution, institution_number: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Nomor SK Izin Operasional Kemenag</label>
            <input
              type="text"
              required
              value={institution.operational_license}
              onChange={(e) => setInstitution({ ...institution, operational_license: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Kepala MDTU</label>
            <input
              type="text"
              required
              value={institution.principal_name}
              onChange={(e) => setInstitution({ ...institution, principal_name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Yayasan Penyelenggara</label>
            <input
              type="text"
              value={institution.foundation_name}
              onChange={(e) => setInstitution({ ...institution, foundation_name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="font-semibold text-slate-700">Alamat Lengkap</label>
            <input
              type="text"
              value={institution.address}
              onChange={(e) => setInstitution({ ...institution, address: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Nomor Telepon</label>
            <input
              type="text"
              value={institution.phone}
              onChange={(e) => setInstitution({ ...institution, phone: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Alamat Email</label>
            <input
              type="email"
              value={institution.email}
              onChange={(e) => setInstitution({ ...institution, email: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Konfigurasi Lembaga</span>
          </button>
        </div>
      </form>
    </div>
  );
};
