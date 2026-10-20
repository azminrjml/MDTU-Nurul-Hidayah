import React from 'react';
import { Calendar, History, Sparkles, BookOpen } from 'lucide-react';
import { AppStorage } from '../../lib/storage';
import { HERO_BUILDING_IMG } from '../../lib/seedData';

interface HistoryPageProps {
  onNavigate: (path: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onNavigate }) => {
  const institution = AppStorage.getInstitution();

  const timeline = [
    {
      year: '2012',
      title: 'Awal Mula Pendirian & Pengajian Serambi',
      desc: 'Dimulai dengan inisiatif para ustadz dan sesepuh masyarakat yang prihatin atas kurangnya bekal membaca Quran dan shalat anak-anak sekolah dasar. Sebanyak 18 santri perdana belajar di serambi Masjid Jamie Nurul Hidayah.'
    },
    {
      year: '2015',
      title: 'Pembangunan Ruang Kelas Mandiri',
      desc: 'Melalui wakaf tanah dan gotong royong jamaah, didirikan 2 unit ruang belajar representatif untuk menampung pertambahan santri yang mencapai 50 anak.'
    },
    {
      year: '2018',
      title: 'Penerbitan Izin Operasional Kemenag RI',
      desc: 'MDTU Nurul Hidayah resmi mendapatkan SK Izin Operasional dari Kantor Kementerian Agama (SK Kd.10.01/4/PP.00.7/412/2018) dan memperoleh Nomor Statistik Madrasah (NSM 311232010045).'
    },
    {
      year: '2022',
      title: 'Pengembangan Gedung 2 Lantai & Perpustakaan',
      desc: 'Penyelesaian gedung madrasah baru 2 lantai dengan fasilitas ruang kelas ber-AC, laboratorium kitab, ruang guru, serta aula halaqah tahfidz.'
    },
    {
      year: '2026',
      title: 'Digitalisasi Sistem Administrasi & Rapor Santri',
      desc: 'Peluncuran Sistem Informasi dan Administrasi Digital terpadu untuk memudahkan pencatatan presensi, pembayaran kuitansi transparan, dan akses rapor santri online bagi wali santri.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-2">
          Jejak Langkah Dakwah
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Sejarah Berdirinya MDTU Nurul Hidayah
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
          Kisah perjalanan madrasah dari majelis sederhana hingga berkembang menjadi lembaga pendidikan diniyah takmiliyah yang mandiri dan terpercaya.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6">
        <h2 className="text-xl font-bold text-slate-900">Latar Belakang Gagasan</h2>
        <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
          {institution.history}
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 text-center">
          Tonggak Sejarah Perjalanan Madrasah
        </h2>
        <div className="relative border-l-2 border-emerald-700/30 ml-4 md:ml-32 space-y-8 pl-6">
          {timeline.map((item) => (
            <div key={item.year} className="relative group">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-emerald-700 border-4 border-white shadow-xs"></div>
              <div className="md:absolute md:-left-32 md:top-1 md:w-24 md:text-right font-mono font-bold text-emerald-800 text-sm">
                {item.year}
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
