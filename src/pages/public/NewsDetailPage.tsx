import React from 'react';
import { ArrowLeft, Calendar, User, Tag, Share2, BookOpen } from 'lucide-react';
import { AppStorage, formatTanggal } from '../../lib/storage';

interface NewsDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const NewsDetailPage: React.FC<NewsDetailPageProps> = ({ slug, onNavigate }) => {
  const newsItem = AppStorage.getAnnouncements().find(a => a.slug === slug);

  if (!newsItem) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Berita Tidak Ditemukan</h2>
        <p className="text-sm text-slate-500">Artikel atau pengumuman yang Anda cari tidak tersedia.</p>
        <button
          onClick={() => onNavigate('/berita')}
          className="px-4 py-2 bg-emerald-800 text-white rounded-lg text-xs font-semibold"
        >
          Kembali ke Daftar Berita
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <button
        onClick={() => onNavigate('/berita')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 hover:text-emerald-950"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Berita & Pengumuman</span>
      </button>

      <article className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-8">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
              {newsItem.category}
            </span>
            <span>·</span>
            <div className="flex items-center gap-1.5 font-mono">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{formatTanggal(newsItem.published_at)}</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-400" />
              <span>{newsItem.author_name}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
            {newsItem.title}
          </h1>
        </div>

        <div className="border-t border-slate-100 pt-6 prose prose-emerald max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-4">
          <p>{newsItem.content}</p>
          <p>
            Untuk informasi lebih lanjut mengenai pengumuman ini, para wali santri dipersilakan menghubungi layanan informasi sekretariat MDTU Nurul Hidayah pada jam operasional (Senin-Minggu pukul 13.00 - 15.00 WIB).
          </p>
        </div>

        <div className="border-t border-slate-100 pt-6 flex items-center justify-between text-xs text-slate-500">
          <span>Diterbitkan resmi oleh Sekretariat MDTU Nurul Hidayah</span>
          <button
            onClick={() => onNavigate('/pendaftaran')}
            className="text-emerald-800 font-bold hover:underline"
          >
            Informasi Pendaftaran Santri Baru →
          </button>
        </div>
      </article>
    </div>
  );
};
