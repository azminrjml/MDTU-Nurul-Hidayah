import React from 'react';
import { ShieldCheck, Lock, FileCheck, EyeOff, UserCheck } from 'lucide-react';
import { AppStorage } from '../../lib/storage';

interface PrivacyPolicyPageProps {
  onNavigate: (path: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
  const institution = AppStorage.getInstitution();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block">
          Perlindungan Data Anak & Keluarga
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Kebijakan Privasi & Keamanan Data
        </h1>
        <p className="text-slate-600 text-sm max-w-xl mx-auto leading-relaxed">
          Komitmen {institution.name} dalam melindungi integritas data pribadi santri, dokumen kependudukan, rekapitulasi nilai, dan catatan keuangan madrasah.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-8 text-slate-700 text-sm leading-relaxed">
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
            <Lock className="w-5 h-5 text-emerald-700" />
            <h2>1. Ruang Lingkup Perlindungan Data Anak</h2>
          </div>
          <p>
            MDTU Nurul Hidayah memandang data pribadi santri (nama lengkap, tanggal lahir, nama orang tua, alamat tempat tinggal, riwayat kesehatan, dan nomor kontak keluarga) sebagai amanah yang bersifat rahasia dan terlindungi. Data ini dikumpulkan semata-mata untuk keperluan penyelenggaraan pendidikan agama, registrasi pada Kementerian Agama (EMIS), pemantauan presensi, dan pelaporan hasil belajar santri.
          </p>
        </section>

        <section className="space-y-3 border-t border-slate-100 pt-6">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
            <EyeOff className="w-5 h-5 text-emerald-700" />
            <h2>2. Kebijakan Publikasi Foto & Media Santri</h2>
          </div>
          <p>
            Sesuai regulasi perlindungan anak, kami menerapkan aturan ketat terhadap dokumentasi visual:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Foto atau video yang menampilkan wajah santri di website publik atau media sosial hanya diunggah setelah memperoleh persetujuan (consent) tertulis dari orang tua/wali santri saat pendaftaran.</li>
            <li>Foto santri untuk keperluan rapor, kartu santri, dan berkas internal disimpan dalam <strong>Private Storage</strong> yang tidak dapat diakses oleh publik tanpa otentikasi resmi.</li>
            <li>Identitas sensitif seperti nomor telepon orang tua, alamat detail rumah, atau kondisi ekonomi keluarga tidak akan pernah dipublikasikan di halaman terbuka.</li>
          </ul>
        </section>

        <section className="space-y-3 border-t border-slate-100 pt-6">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
            <UserCheck className="w-5 h-5 text-emerald-700" />
            <h2>3. Hak Akses Berjenjang (Role-Based Access Control)</h2>
          </div>
          <p>
            Sistem informasi MDTU Nurul Hidayah menerapkan kontrol keamanan berbasis peran (Role-Based Access Control dan Row Level Security):
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>Orang Tua/Wali:</strong> Hanya dapat mengakses data, tagihan, presensi, dan rapor santri yang terhubung secara sah dengan akunnya.</li>
            <li><strong>Ustadz/Guru:</strong> Hanya berhak menginput absensi dan nilai pada kelas dan mata pelajaran yang ditugaskan secara resmi oleh kepala madrasah.</li>
            <li><strong>Bendahara:</strong> Mengelola tagihan dan kuitansi pembayaran tanpa dapat mengubah riwayat rapor santri.</li>
            <li><strong>Super Admin & Kepala Madrasah:</strong> Mengawasi jalannya sistem dengan pencatatan audit log otomatis untuk setiap aktivitas sensitif.</li>
          </ul>
        </section>

        <section className="space-y-3 border-t border-slate-100 pt-6">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
            <FileCheck className="w-5 h-5 text-emerald-700" />
            <h2>4. Integritas Keuangan & Kuitansi Sah</h2>
          </div>
          <p>
            Setiap pencatatan pembayaran manual SPP atau iuran wajib menghasilkan nomor kuitansi unik dan tercatat secara permanen. Pembatalan transaksi (reversal) hanya dapat dilakukan dengan alasan yang jelas dan terekam dalam log audit demi mencegah penyalahgunaan dana umat.
          </p>
        </section>
      </div>
    </div>
  );
};
