import React, { useState } from 'react';
import { Camera, Calendar, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { AppStorage, formatTanggal } from '../../lib/storage';
import { 
  HERO_BUILDING_IMG, 
  HERO_SANTRI_IMG, 
  TAHFIDZ_IMG 
} from '../../lib/seedData';

interface GalleryPageProps {
  onNavigate: (path: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ onNavigate }) => {
  const albums = AppStorage.getGalleryAlbums().filter(a => a.is_published);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const galleryItems = [
    { id: 'item-1', title: 'Halaqah Tahfidz & Tilawah Sore', category: 'Tahfidz', image: TAHFIDZ_IMG, date: '2026-09-28', desc: 'Santri putra membaca dan menyetorkan hafalan surat pendek Juz 30.' },
    { id: 'item-2', title: 'Suasana Belajar Aktif di Kelas', category: 'KBM Madrasah', image: HERO_SANTRI_IMG, date: '2026-10-04', desc: 'Pembelajaran kitab fiqih ibadah dan buku Bahasa Arab diniyah.' },
    { id: 'item-3', title: 'Gedung Utama MDTU Nurul Hidayah', category: 'Sarana Prasarana', image: HERO_BUILDING_IMG, date: '2026-08-15', desc: 'Gedung madrasah yang asri, nyaman, dan terawat dengan baik.' },
    { id: 'item-4', title: 'Khotmil Quran & Doa Bersama', category: 'Tahfidz', image: TAHFIDZ_IMG, date: '2026-10-12', desc: 'Doa khotmil quran santri kelas akhir Ula.' },
  ];

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(i => i.category === selectedCategory);

  const categories = ['all', 'Tahfidz', 'KBM Madrasah', 'Sarana Prasarana'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-2">
          Dokumentasi & Syiar
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Galeri Kegiatan Santri MDTU
        </h1>
        <p className="text-slate-600 text-sm mt-3 leading-relaxed">
          Semua foto yang ditampilkan telah melalui konfirmasi persetujuan (consent) publikasi demi menjaga kehormatan dan privasi santri.
        </p>
      </div>

      {/* Category Filter Controls */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              selectedCategory === cat
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {cat === 'all' ? 'Semua Dokumentasi' : cat}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow group">
            <div className="h-64 overflow-hidden relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-black/60 text-white backdrop-blur-xs text-[10px] font-semibold px-2.5 py-1 rounded-md">
                {item.category}
              </div>
            </div>
            <div className="p-6 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                <span>{formatTanggal(item.date)}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
