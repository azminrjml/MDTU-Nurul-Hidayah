# Panduan Integrasi Supabase - MDTU Nurul Hidayah

Aplikasi Sistem Informasi dan Administrasi MDTU Nurul Hidayah dirancang menggunakan arsitektur backend PostgreSQL di Supabase dengan autentikasi Supabase Auth, Row Level Security (RLS), dan Supabase Storage.

## 1. Langkah Koneksi Proyek Supabase
1. Buka dashboard [Supabase](https://supabase.com) dan buat proyek baru (contoh: `mdtu-nurul-hidayah`).
2. Masuk ke **Settings > API**, salin:
   - `Project URL`
   - `anon / public API key`
3. Tambahkan ke file `.env` di aplikasi Anda:
   ```env
   VITE_SUPABASE_URL="https://your-project-id.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-key-here"
   ```
4. Buka **SQL Editor** di Supabase, buka file migration:
   `supabase/migrations/20261019000000_mdtu_nurul_hidayah_schema.sql`
   dan jalankan (Run).

## 2. Pengaturan Storage Buckets
Buat bucket di menu **Storage** Supabase:
- `institution-public`: Public bucket untuk logo dan profil lembaga.
- `gallery-public`: Public bucket untuk foto kegiatan yang sudah disetujui.
- `student-photos-private`: Private bucket untuk pas foto santri.
- `student-documents-private`: Private bucket untuk berkas akte, KK santri.
- `teacher-files-private`: Private bucket untuk berkas ustadz/ustadzah.
- `report-cards-private`: Private bucket untuk file PDF rapor santri.

## 3. Akun Pengguna & Hak Akses (Role-Based Access Control)
Peran didaftarkan pada tabel `public.user_roles`:
- `super_admin`: Administrator sistem & pimpinan yayasan
- `operator`: Staf tata usaha & administrasi data
- `principal`: Kepala Madrasah (monitoring & pengesahan rapor)
- `teacher`: Ustadz/Ustadzah pengampu kelas & mata pelajaran
- `treasurer`: Bendahara madrasah (kelola tagihan, pembayaran manual & kuitansi)
- `guardian`: Orang tua / wali santri (portal khusus wali)

*Catatan: Aplikasi ini dilengkapi dengan Local Relational Storage Engine terintegrasi sehingga semua fitur dapat langsung diuji dan dijalankan secara interaktif dan persisten bahkan sebelum konfigurasi kunci API eksternal dimasukkan.*
