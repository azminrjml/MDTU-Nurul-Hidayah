import React, { useState } from 'react';
import { FileText, Image as ImageIcon, Plus, CheckCircle, Eye, Calendar, X } from 'lucide-react';
import { AppStorage, formatTanggal } from '../../lib/storage';
import { Announcement, GalleryAlbum } from '../../types';

interface ContentAdminPageProps {
  onNavigate: (path: string) => void;
}

export const ContentAdminPage: React.FC<ContentAdminPageProps> = ({ onNavigate }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(AppStorage.getAnnouncements());
  const [albums] = useState<GalleryAlbum[]>(AppStorage.getGalleryAlbums());
  const [isAddNewsModalOpen, setIsAddNewsModalOpen] = useState(false);
  const [newNews, setNewNews] = useState({
    title: '',
    category: 'Kegiatan',
    content: ''
  });

  const reload = () => setAnnouncements(AppStorage.getAnnouncements());

  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNews.title || !newNews.content) return;

    const slug = newNews.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const currentUser = AppStorage.getCurrentUser();

    const annObj: Announcement = {
      id: 'ann-' + Date.now(),
      title: newNews.title,
      slug,
      content: newNews.content,
      category: newNews.category,
      status: 'published',
      published_at: new Date().toISOString().split('T')[0],
      author_name: currentUser.full_name
    };

    AppStorage.saveAnnouncement(annObj);
    setIsAddNewsModalOpen(false);
    setNewNews({ title: '', category: 'Kegiatan', content: '' });
    reload();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Pengelolaan Berita & Galeri Foto
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Publikasi informasi resmi dan dokumentasi kegiatan madrasah yang telah disetujui.
          </p>
        </div>

        <button
          onClick={() => setIsAddNewsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tulis Berita / Pengumuman</span>
        </button>
      </div>

      {/* Announcements Section */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-800" />
          <span>Daftar Warta & Berita Resmi ({announcements.length})</span>
        </h2>

        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Judul Artikel</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Tanggal Publikasi</th>
                  <th className="py-3 px-4">Penulis</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {announcements.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-bold text-slate-900">{a.title}</td>
                    <td className="py-3 px-4 text-slate-700">{a.category}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{formatTanggal(a.published_at)}</td>
                    <td className="py-3 px-4 text-slate-600">{a.author_name}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px]">
                        {a.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onNavigate(`/berita/${a.slug}`)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[11px] font-semibold"
                      >
                        Lihat Artikel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-emerald-800" />
          <span>Album Galeri Kegiatan Terpublikasi ({albums.length})</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {albums.map((alb) => (
            <div key={alb.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="h-40 overflow-hidden">
                <img
                  src={alb.cover_image}
                  alt={alb.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 space-y-1">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">{alb.category}</span>
                <h3 className="font-bold text-slate-900 text-sm">{alb.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{alb.description}</p>
                <div className="pt-2 text-[11px] text-slate-400 font-mono">
                  {alb.photos_count} Foto · Persetujuan Publikasi Aktif
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isAddNewsModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-sm font-bold">Tulis Berita / Pengumuman Baru</h2>
              <button onClick={() => setIsAddNewsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNews} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Judul Pengumuman *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Jadwal Ujian Imtihan Semester Ganjil"
                  value={newNews.title}
                  onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Kategori</label>
                <select
                  value={newNews.category}
                  onChange={(e) => setNewNews({ ...newNews, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Kegiatan">Kegiatan</option>
                  <option value="Akademik">Akademik</option>
                  <option value="Pendaftaran">Pendaftaran</option>
                  <option value="Pengumuman">Pengumuman</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Isi Berita *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Tuliskan isi pengumuman lengkap untuk santri dan wali santri..."
                  value={newNews.content}
                  onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddNewsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold"
                >
                  Publikasikan Berita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
