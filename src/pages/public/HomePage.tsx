import React from 'react';
import { 
  BookOpen, 
  Award, 
  Users, 
  GraduationCap, 
  Calendar, 
  ArrowRight, 
  CheckCircle, 
  Quote, 
  MapPin, 
  Clock, 
  Sparkles, 
  FileText,
  ShieldCheck,
  Building
} from 'lucide-react';
import { AppStorage, formatTanggal } from '../../lib/storage';
import { 
  HERO_BUILDING_IMG, 
  HERO_SANTRI_IMG, 
  HEADMASTER_IMG, 
  TAHFIDZ_IMG 
} from '../../lib/seedData';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const institution = AppStorage.getInstitution();
  const teachers = AppStorage.getTeachers().filter(t => t.is_public);
  const announcements = AppStorage.getAnnouncements().slice(0, 3);
  const albums = AppStorage.getGalleryAlbums();
  const students = AppStorage.getStudents();
  const classes = AppStorage.getClasses();

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-emerald-950 via-[#14532D] to-emerald-900 text-white overflow-hidden">
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Pendidikan Islam Diniyah Takmiliyah Ula</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight" style={{ textWrap: 'balance' }}>
                Membentuk Generasi Santri Berakhlak Mulia, Fasih Al-Qur'an, dan Gemar Beribadah
              </h1>

              <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-2xl">
                Selamat datang di portal resmi {institution.name}. Kami menyelenggarakan pendidikan diniyah terstruktur bagi anak usia sekolah dasar pada waktu sore hari dengan bimbingan asatidz berpengalaman dan kurikulum resmi Kementerian Agama RI.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-3">
                <button
                  onClick={() => onNavigate('/pendaftaran')}
                  className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <span>Daftar Santri Baru (PSB)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('/profil')}
                  className="px-6 py-3.5 bg-emerald-800/80 hover:bg-emerald-800 border border-emerald-600 text-white font-semibold text-sm rounded-xl transition-all flex items-center gap-2"
                >
                  <Building className="w-4 h-4 text-emerald-300" />
                  <span>Profil & Legalitas</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-emerald-800/60 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-emerald-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>NSM: {institution.institution_number}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Izin Kemenag Resmi</span>
                </div>
                <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Tahfidz Juz 30 & Tajwid</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Photo */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-emerald-500/30 group">
                  <img
                    src={HERO_BUILDING_IMG}
                    alt="Gedung MDTU Nurul Hidayah"
                    className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent flex items-end p-6">
                    <div>
                      <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider block">
                        Lingkungan Belajar Asri & Representatif
                      </span>
                      <p className="text-sm font-medium text-white">
                        Gedung dan Kompleks Belajar MDTU Nurul Hidayah
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Highlight Stats Strip */}
        <div className="bg-emerald-900/90 border-t border-emerald-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono tabular-nums">
                  {students.length * 15}+
                </span>
                <span className="text-xs text-emerald-200 uppercase tracking-wider font-medium">Santri Diniyah</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                  {teachers.length}
                </span>
                <span className="text-xs text-emerald-200 uppercase tracking-wider font-medium">Dewan Asatidz</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono tabular-nums">
                  {classes.length}
                </span>
                <span className="text-xs text-emerald-200 uppercase tracking-wider font-medium">Rombongan Belajar</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                  14 Tahun
                </span>
                <span className="text-xs text-emerald-200 uppercase tracking-wider font-medium">Pengabdian Dakwah</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SAMBUTAN KEPALA MADRASAH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative">
                <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-2xl overflow-hidden shadow-lg border-4 border-emerald-100">
                  <img
                    src={HEADMASTER_IMG}
                    alt={institution.principal_name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-4 -right-2 bg-emerald-800 text-amber-300 text-xs px-3 py-1.5 rounded-lg shadow-md font-semibold">
                  Kepala Madrasah
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-widest">
                <Quote className="w-4 h-4 text-amber-500" />
                <span>Sambutan Kepala MDTU Nurul Hidayah</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Menanamkan Nilai Islam Sejak Dini untuk Fondasi Masa Depan Ananda
              </h2>

              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                "Bismillahirrohmanirrohim. Pendidikan agama adalah benteng utama bagi putra-putri kita di tengah arus deras perkembangan zaman. Di MDTU Nurul Hidayah, kami membimbing anak-anak belajar membaca Al-Quran dengan tajwid yang sahih, mempraktikkan wudhu dan shalat fardhu secara tertib, serta membiasakan adab kesantunan islami dalam keseharian mereka."
              </p>

              <div className="pt-2">
                <h4 className="font-bold text-slate-900 text-base">{institution.principal_name}</h4>
                <p className="text-xs text-slate-500">{institution.name} · {institution.foundation_name}</p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('/sejarah')}
                  className="text-emerald-800 hover:text-emerald-900 font-semibold text-xs flex items-center gap-1.5 group"
                >
                  <span>Baca Sejarah & Perjalanan Madrasah Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 4 PILAR KEUNGGULAN PENDIDIKAN DINIYAH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-2">
            Kurikulum & Pembiasaan
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Empat Pilar Unggulan Pendidikan Santri
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Dirancang secara berjenjang untuk santri usia sekolah dasar agar ilmu agama mudah dicerna dan diamalkan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 transition-colors shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Tahsin & Tahfidz Al-Qur'an</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bimbingan makharijul huruf, kaidah hukum tajwid, serta target hafalan Juz 30 bersanad secara tartil.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 transition-colors shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Praktik Fiqih Ibadah</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pelatihan langsung tata cara wudhu, tayamum, shalat fardhu berjamaah, adzan, dan doa sehari-hari.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 transition-colors shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Aqidah & Adab Santun</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Penanaman tauhid yang kokoh, birrul walidain (berbakti pada orang tua), dan akhlak mulia kepada sesama.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 transition-colors shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Bahasa Arab & Khot</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pengenalan kosakata diniyah, dasar kaidah kalimat Arab sederhana, serta seni menulis indah huruf hijaiyah.
            </p>
          </div>
        </div>
      </section>

      {/* 4. KEGIATAN & GALERI VISUAL */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-1">
                Aktivitas & Pembelajaran
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Dokumentasi Kegiatan Santri
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/galeri')}
              className="px-4 py-2 text-xs font-semibold text-emerald-900 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>Lihat Semua Galeri</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs group">
              <div className="h-48 overflow-hidden">
                <img
                  src={TAHFIDZ_IMG}
                  alt="Halaqah Tahfidz Quran"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-5">
                <span className="text-[11px] font-semibold text-emerald-800 uppercase block mb-1">Halaqah Tahfidz</span>
                <h3 className="text-sm font-bold text-slate-900 mb-2">Bimbingan Tilawah & Khotmil Quran</h3>
                <p className="text-xs text-slate-600 line-clamp-2">
                  Santri rutin menyetorkan hafalan surat-surat pendek Juz Amma setiap sore dengan bimbingan ustadz.
                </p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs group">
              <div className="h-48 overflow-hidden">
                <img
                  src={HERO_SANTRI_IMG}
                  alt="KBM Madrasah"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-5">
                <span className="text-[11px] font-semibold text-emerald-800 uppercase block mb-1">Kelas Diniyah</span>
                <h3 className="text-sm font-bold text-slate-900 mb-2">Pembelajaran Interaktif Kitab Matan</h3>
                <p className="text-xs text-slate-600 line-clamp-2">
                  Suasana belajar menyenangkan di kelas dengan papan tulis, kitab pegangan, dan diskusi adab.
                </p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs group">
              <div className="h-48 overflow-hidden">
                <img
                  src={HERO_BUILDING_IMG}
                  alt="Fasilitas Madrasah"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-5">
                <span className="text-[11px] font-semibold text-emerald-800 uppercase block mb-1">Sarana Belajar</span>
                <h3 className="text-sm font-bold text-slate-900 mb-2">Ruang Kelas & Tempat Ibadah Bersih</h3>
                <p className="text-xs text-slate-600 line-clamp-2">
                  Fasilitas madrasah yang bersih, nyaman, berkarpet rapi, dan aman bagi anak-anak.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DEWAN ASATIDZ UNGGULAN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-1">
              Tenaga Pendidik
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Dewan Asatidz & Ustadzah
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Guru berdedikasi tinggi, berlatar belakang pesantren dan perguruan tinggi Islam ternama.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/guru')}
            className="px-4 py-2 text-xs font-semibold text-emerald-900 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>Lihat Semua Pendidik</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 ${teachers.length <= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6`}>
          {teachers.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow">
              <div className="h-44 bg-slate-100 relative">
                {t.photo_path ? (
                  <img
                    src={t.photo_path}
                    alt={t.full_name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-emerald-800 text-white font-bold text-2xl">
                    {t.full_name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="p-4 space-y-2">
                <span className="text-[11px] font-semibold text-emerald-700 block">
                  {t.position}
                </span>
                <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1">
                  {t.full_name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {t.public_bio || t.education}
                </p>
                <button
                  onClick={() => onNavigate(`/guru/${t.id}`)}
                  className="text-xs font-medium text-emerald-800 hover:text-emerald-950 pt-2 flex items-center gap-1"
                >
                  <span>Lihat Profil Guru</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BERITA & PENGUMUMAN TERKINI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-1">
              Warta & Informasi
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Pengumuman & Berita Terbaru
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/berita')}
            className="px-4 py-2 text-xs font-semibold text-emerald-900 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>Arsip Berita</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {announcements.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:border-emerald-600 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-emerald-800">{item.category}</span>
                  <span className="font-mono">{formatTanggal(item.published_at)}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {item.content}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Oleh: {item.author_name}</span>
                <button
                  onClick={() => onNavigate(`/berita/${item.slug}`)}
                  className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                >
                  <span>Baca</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CTA PENDAFTARAN SANTRI BARU */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-900 to-[#14532D] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-700/50">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest block">
              Tahun Ajaran Baru 2026/2027
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Daftarkan Putra-Putri Anda di MDTU Nurul Hidayah
            </h2>
            <p className="text-emerald-100 text-sm leading-relaxed">
              Kuota santri baru terbatas untuk memastikan rasio santri dan asatidz optimal sehingga pembelajaran berlangsung tertib dan terpantau dengan baik. Formulir online dapat diisi dalam waktu 3 menit.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('/pendaftaran')}
                className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <span>Isi Formulir Pendaftaran Online</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('/kontak')}
                className="px-6 py-3.5 bg-emerald-800/80 hover:bg-emerald-800 border border-emerald-600 text-white font-semibold text-sm rounded-xl transition-all"
              >
                Hubungi Sekretariat
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
