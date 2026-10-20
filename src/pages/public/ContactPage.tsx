import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { AppStorage } from '../../lib/storage';

interface ContactPageProps {
  onNavigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const institution = AppStorage.getInstitution();
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;
    setSent(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-2">
          Komunikasi & Kunjungan
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Hubungi Sekretariat Madrasah
        </h1>
        <p className="text-slate-600 text-sm mt-3 leading-relaxed">
          Kami siap melayani pertanyaan seputar pendaftaran santri baru, kurikulum diniyah, iuran syahriah, maupun silaturahmi langsung.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info Card */}
        <div className="lg:col-span-5 bg-emerald-950 text-white rounded-3xl p-8 sm:p-10 shadow-lg space-y-8 flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-amber-300">
              Informasi Kontak Resmi
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-emerald-100">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-white">Alamat Sekretariat:</span>
                  <p className="leading-relaxed text-emerald-200">
                    {institution.address}, {institution.city}, {institution.province} {institution.postal_code}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-white">Telepon / WhatsApp:</span>
                  <p className="font-mono text-amber-300 font-bold">{institution.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-white">Surat Elektronik (Email):</span>
                  <p>{institution.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-white">Jadwal Belajar (KBM):</span>
                  <p className="text-emerald-200">Senin s.d. Minggu: 13.00 - 15.00 WIB</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-emerald-900 text-xs text-emerald-300">
            {institution.name} · {institution.foundation_name}
          </div>
        </div>

        {/* Message Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs">
          {sent ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Pesan Anda Telah Terkirim!</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Jazakallahu khairan. Tim sekretariat kami akan segera merespons melalui nomor telepon atau email yang Anda cantumkan.
              </p>
              <button
                onClick={() => {
                  setSent(false);
                  setFormData({ name: '', phone: '', subject: '', message: '' });
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Kirim Pesan Lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 mb-1">
                Kirim Pertanyaan / Pesan
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Sampaikan pesan Anda dan kami akan merespons sesegera mungkin.
              </p>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Anda"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Nomor Telepon / WhatsApp</label>
                <input
                  type="tel"
                  placeholder="0812-xxxx-xxxx"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Topik / Hal</label>
                <input
                  type="text"
                  placeholder="Misal: Info Pendaftaran, Mutasi Santri, Jadwal Belajar"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Isi Pesan *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan pertanyaan atau informasi yang dibutuhkan..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Pesan Sekarang</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
