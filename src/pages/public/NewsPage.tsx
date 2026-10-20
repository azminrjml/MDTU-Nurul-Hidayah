import React from 'react';
import { Calendar, User, ArrowRight, Tag, BookOpen } from 'lucide-react';
import { AppStorage, formatTanggal } from '../../lib/storage';

interface NewsPageProps {
  onNavigate: (path: string) => void;
}

export const NewsPage: React.FC<NewsPageProps> = ({ onNavigate }) => {
  const news = AppStorage.getAnnouncements().filter(a => a.status === 'published');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-2">
          Pusat Informasi & Warta
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Berita & Pengumuman Madrasah
        </h1>
        <p className="text-slate-600 text-sm mt-3 leading-relaxed">
          Kumpulan informasi resmi seputar kegiatan belajar mengajar, pengumuman ujian, agenda santri, dan penerimaan santri baru.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.map((item) => (
          <article
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:border-emerald-600 transition-colors flex flex-col justify-between"
          >
            <div className="p-7 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                  {item.category}
                </span>
                <span className="font-mono text-[11px]">{formatTanggal(item.published_at)}</span>
              </div>

              <h2 className="text-lg font-bold text-slate-900 leading-snug hover:text-emerald-800 transition-colors">
                {item.title}
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {item.content}
              </p>
            </div>

            <div className="p-7 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px]">{item.author_name}</span>
              </div>
              <button
                onClick={() => onNavigate(`/berita/${item.slug}`)}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
              >
                <span>Baca Selengkapnya</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
