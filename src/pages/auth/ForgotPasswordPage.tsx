import React, { useState } from 'react';
import { ArrowLeft, Mail, KeyRound, CheckCircle, ShieldCheck } from 'lucide-react';
import { AppStorage } from '../../lib/storage';

interface ForgotPasswordPageProps {
  onNavigate: (path: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const institution = AppStorage.getInstitution();

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <button
          onClick={() => onNavigate('/login')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Halaman Masuk</span>
        </button>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Pemulihan Kata Sandi Akun
        </h1>
        <p className="text-xs text-slate-500">
          {institution.name} · Sistem Autentikasi Terproteksi
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          {sent ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Tautan Pemulihan Dikirim!</h2>
              <p className="text-xs text-slate-600">
                Instruksi reset kata sandi telah dikirimkan ke alamat <strong>{email}</strong> melalui alur autentikasi resmi. Silakan periksa kotak masuk atau folder spam Anda.
              </p>
              <button
                onClick={() => onNavigate('/login')}
                className="w-full py-2.5 bg-emerald-800 text-white font-semibold text-xs rounded-xl hover:bg-emerald-900"
              >
                Kembali ke Halaman Masuk
              </button>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Masukkan alamat email yang terdaftar pada sistem madrasah. Tautan reset kata sandi resmi akan dikirimkan secara aman.
              </p>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Alamat Email Terdaftar</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="nama@mdtu-nurulhidayah.sch.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>Kirim Tautan Atur Ulang</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
