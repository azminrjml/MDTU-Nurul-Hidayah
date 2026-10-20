import {
  Institution,
  AcademicYear,
  Teacher,
  SchoolClass,
  Student,
  Subject,
  TeachingAssignment,
  FeeType,
  StudentInvoice,
  Payment,
  ReportCard,
  AttendanceRecord,
  Announcement,
  GalleryAlbum,
  AuditLog,
  UserProfile
} from '../types';

export const HERO_BUILDING_IMG = '/src/assets/images/hero_madrasah_building_1792457904270.jpg';
export const HERO_SANTRI_IMG = '/src/assets/images/hero_santri_learning_1792457905559.jpg';
export const HEADMASTER_IMG = '/src/assets/images/headmaster_portrait_1792457905930.jpg';
export const TAHFIDZ_IMG = '/src/assets/images/madrasah_tahfidz_event_1792457906852.jpg';

export const initialInstitution: Institution = {
  id: 'inst-001',
  name: 'MDTU Nurul Hidayah',
  institution_type: 'Madrasah Diniyah Takmiliyah Ula',
  logo_path: '',
  address: 'Kp. Dukuh Sari Dusun. Cigoong RT 03 RW 01 Desa. Sirnabaya Kec. Rajadesa',
  village: 'Sirnabaya',
  district: 'Rajadesa',
  city: 'Kab. Ciamis',
  province: 'Jawa Barat',
  postal_code: '46254',
  phone: '082315987599',
  email: 'nurulhidayah771@gmail.com',
  website: 'https://mdtu-nurulhidayah.sch.id',
  founded_year: 2012,
  institution_number: '311232010045', // NSM resmi Kemenag
  operational_license: 'Kd.10.01/4/PP.00.7/412/2018',
  principal_name: 'Ust. Ade Yusup, S.Pd.',
  foundation_name: 'Yayasan Nurul Hidayah',
  vision: 'Mewujudkan generasi santri Takmiliyah yang berakhlakul karimah, teguh dalam aqidah, fasih membaca Al-Quran, dan terampil mengamalkan ibadah sehari-hari.',
  mission: '1. Menyelenggarakan pendidikan diniyah takmiliyah yang terstruktur, menyenangkan, dan berpedoman pada kurikulum Kementerian Agama RI.\n2. Menanamkan adab, budi pekerti Islam, dan kecintaan kepada Rasulullah SAW sejak usia dini.\n3. Mengembangkan kemampuan membaca Al-Quran dengan kaidah tajwid yang benar serta hafalan juz 30.\n4. Membimbing santri agar mandiri dan istiqamah dalam menjalankan shalat fardhu dan sunnah.',
  history: 'Madrasah Diniyah Takmiliyah Ula (MDTU) Nurul Hidayah didirikan pada tahun 2012 atas inisiasi para tokoh agama dan sesepuh masyarakat di Kp. Dukuh Sari Dusun Cigoong, Desa Sirnabaya, Kec. Rajadesa, Kab. Ciamis yang peduli akan perlunya penguatan dasar-dasar ilmu agama Islam bagi anak-anak usia sekolah dasar di waktu sore hari. Berawal dari 18 santri di serambi masjid, kini MDTU Nurul Hidayah telah memiliki gedung madrasah representatif dengan izin operasional Kementerian Agama dan membina lebih dari 150 santri aktif.',
  created_at: '2026-01-01T08:00:00Z',
  updated_at: '2026-10-19T08:00:00Z'
};

export const initialAcademicYears: AcademicYear[] = [
  {
    id: 'ay-2026',
    name: '2026/2027',
    start_date: '2026-07-15',
    end_date: '2027-06-25',
    is_active: true,
    created_at: '2026-06-01T00:00:00Z'
  },
  {
    id: 'ay-2025',
    name: '2025/2026',
    start_date: '2025-07-15',
    end_date: '2026-06-20',
    is_active: false,
    created_at: '2025-06-01T00:00:00Z'
  }
];

export const initialTeachers: Teacher[] = [
  {
    id: 'tch-001',
    profile_id: 'usr-principal',
    teacher_number: '197905142005011002',
    full_name: 'Ust. Ade Yusup, S.Pd.',
    gender: 'L',
    birth_place: 'Bandung',
    birth_date: '1979-05-14',
    address: 'Jl. Pesantren No. 14, Bandung',
    education: 'S2 Manajemen Pendidikan Islam (UIN SGD)',
    employment_status: 'Guru Tetap Yayasan',
    position: 'Kepala Madrasah & Pengajar Hadits',
    photo_path: HEADMASTER_IMG,
    public_bio: 'Lebih dari 18 tahun mengabdi dalam dunia pendidikan Islam dasar, membina kurikulum diniyah takmiliyah ula dan hafalan santri.',
    is_public: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-10-19T00:00:00Z'
  },
  {
    id: 'tch-002',
    profile_id: 'usr-teacher-1',
    teacher_number: '198809222014021005',
    full_name: 'Usth. Siti Saadah, S.Pd.',
    gender: 'P',
    birth_place: 'Bandung',
    birth_date: '1988-09-22',
    address: 'Jl. Cikadut No. 45, Bandung',
    education: 'S1 Pendidikan Agama Islam',
    employment_status: 'Guru Tetap Yayasan',
    position: 'Wali Kelas 1 & Guru Fiqih Ibadah',
    public_bio: 'Pengajar aktif bidang Fiqih Ibadah, Tahsin Al-Qur\'an dan bimbingan adab santri Takmiliyah Ula.',
    is_public: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-10-19T00:00:00Z'
  },
  {
    id: 'tch-003',
    profile_id: 'usr-teacher-1',
    teacher_number: '199507182020042011',
    full_name: 'Ust. Azmi M Nurjamil',
    gender: 'L',
    birth_place: 'Bandung',
    birth_date: '1995-07-18',
    address: 'Komp. Bumi Asri B-12',
    education: 'S1 Pendidikan Agama Islam',
    employment_status: 'Guru Tetap',
    position: 'Wali Kelas 2 & Guru Bahasa Arab Diniyah',
    public_bio: 'Pengajar interaktif Bahasa Arab diniyah, Al-Qur\'an dan sirah tarikh Islam santri.',
    is_public: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-10-19T00:00:00Z'
  }
];

export const initialClasses: SchoolClass[] = [
  {
    id: 'cls-001',
    name: 'Kelas 1 Awwaliyah',
    grade_level: 1,
    academic_year_id: 'ay-2026',
    homeroom_teacher_id: 'tch-002',
    homeroom_teacher_name: 'Usth. Siti Saadah, S.Pd.',
    description: 'Tingkat dasar pengenalan huruf hijaiyah, wudhu, shalat fardhu dan adab harian santri.',
    student_count: 24,
    created_at: '2026-07-01T00:00:00Z'
  },
  {
    id: 'cls-002',
    name: 'Kelas 2 Awwaliyah',
    grade_level: 2,
    academic_year_id: 'ay-2026',
    homeroom_teacher_id: 'tch-003',
    homeroom_teacher_name: 'Ust. Azmi M Nurjamil',
    description: 'Pemantapan tajwid Juz Amma, rukun iman dan rukun Islam, hafalan doa-doa harian.',
    student_count: 22,
    created_at: '2026-07-01T00:00:00Z'
  },
  {
    id: 'cls-003',
    name: 'Kelas 3 Wustha',
    grade_level: 3,
    academic_year_id: 'ay-2026',
    homeroom_teacher_id: 'tch-003',
    homeroom_teacher_name: 'Ust. Azmi M Nurjamil',
    description: 'Pengenalan Bahasa Arab dasar, fiqih thaharah & shalat jamaah, kisah 25 Nabi & Rasul.',
    student_count: 20,
    created_at: '2026-07-01T00:00:00Z'
  },
  {
    id: 'cls-004',
    name: 'Kelas 4 Ula',
    grade_level: 4,
    academic_year_id: 'ay-2026',
    homeroom_teacher_id: 'tch-001',
    homeroom_teacher_name: 'Ust. Ade Yusup, S.Pd.',
    description: 'Tingkat akhir Ula: Fiqih puasa & zakat, khot arab, persiapan imtihan akhir diniyah.',
    student_count: 18,
    created_at: '2026-07-01T00:00:00Z'
  }
];

export const initialSubjects: Subject[] = [
  { id: 'sbj-001', code: 'QRN-01', name: 'Al-Qur\'an & Tajwid', description: 'Kaidah makharijul huruf, sifat huruf, dan tahsin tilawah', is_active: true },
  { id: 'sbj-002', code: 'FQH-01', name: 'Fiqih Ibadah', description: 'Thaharah, wudhu, tayamum, shalat fardhu dan shalat sunnah', is_active: true },
  { id: 'sbj-003', code: 'AQD-01', name: 'Aqidah & Akhlak', description: 'Rukun Iman, sifat 20 bagi Allah, dan akhlak mahmudah', is_active: true },
  { id: 'sbj-004', code: 'SKI-01', name: 'Tarikh Islam (SKI)', description: 'Kisah Nabi Muhammad SAW dan para sahabat khulafaur rasyidin', is_active: true },
  { id: 'sbj-005', code: 'ARB-01', name: 'Bahasa Arab Diniyah', description: 'Kosakata madrasah, percakapan sehari-hari, dan tata bahasa dasar', is_active: true },
  { id: 'sbj-006', code: 'HDT-01', name: 'Hadits Pilihan', description: 'Hafalan hadits arbain tematik adab, niat, dan kejujuran', is_active: true },
  { id: 'sbj-007', code: 'PRA-01', name: 'Praktik Ibadah & Doa', description: 'Praktik gerakan shalat, bacaan shalat, dan doa harian', is_active: true },
  { id: 'sbj-008', code: 'KHT-01', name: 'Khot & Imla\'', description: 'Keterampilan menulis huruf Arab naskhi dan imla\'', is_active: true }
];

export const initialTeachingAssignments: TeachingAssignment[] = [
  { id: 'ta-001', teacher_id: 'tch-002', teacher_name: 'Usth. Siti Saadah, S.Pd.', class_id: 'cls-001', class_name: 'Kelas 1 Awwaliyah', subject_id: 'sbj-002', subject_name: 'Fiqih Ibadah', academic_year_id: 'ay-2026' },
  { id: 'ta-002', teacher_id: 'tch-002', teacher_name: 'Usth. Siti Saadah, S.Pd.', class_id: 'cls-001', class_name: 'Kelas 1 Awwaliyah', subject_id: 'sbj-001', subject_name: 'Al-Qur\'an & Tajwid', academic_year_id: 'ay-2026' },
  { id: 'ta-003', teacher_id: 'tch-002', teacher_name: 'Usth. Siti Saadah, S.Pd.', class_id: 'cls-002', class_name: 'Kelas 2 Awwaliyah', subject_id: 'sbj-001', subject_name: 'Al-Qur\'an & Tajwid', academic_year_id: 'ay-2026' },
  { id: 'ta-004', teacher_id: 'tch-003', teacher_name: 'Ust. Azmi M Nurjamil', class_id: 'cls-003', class_name: 'Kelas 3 Wustha', subject_id: 'sbj-005', subject_name: 'Bahasa Arab Diniyah', academic_year_id: 'ay-2026' },
  { id: 'ta-005', teacher_id: 'tch-003', teacher_name: 'Ust. Azmi M Nurjamil', class_id: 'cls-004', class_name: 'Kelas 4 Ula', subject_id: 'sbj-004', subject_name: 'Tarikh Islam (SKI)', academic_year_id: 'ay-2026' }
];

export const initialStudents: Student[] = [
  {
    id: 'std-001',
    student_number: '202601001',
    nisn: '3156291001',
    full_name: 'Muhammad Farhan Al-Fatih',
    nickname: 'Farhan',
    gender: 'L',
    birth_place: 'Bandung',
    birth_date: '2018-04-12',
    religion: 'Islam',
    address: 'Jl. Sukamaju No. 24, Cibeunying, Bandung',
    enrollment_date: '2026-07-15',
    entry_academic_year_id: 'ay-2026',
    current_status: 'active',
    class_id: 'cls-001',
    class_name: 'Kelas 1 Awwaliyah',
    guardian_name: 'Bapak Hendra Wijaya',
    guardian_phone: '0812-3456-7890',
    created_at: '2026-07-15T00:00:00Z',
    updated_at: '2026-10-19T00:00:00Z'
  },
  {
    id: 'std-002',
    student_number: '202601002',
    nisn: '3156291002',
    full_name: 'Aisyah Putri Hanifah',
    nickname: 'Aisyah',
    gender: 'P',
    birth_place: 'Bandung',
    birth_date: '2018-08-20',
    religion: 'Islam',
    address: 'Jl. Sukamaju No. 24, Cibeunying, Bandung',
    enrollment_date: '2026-07-15',
    entry_academic_year_id: 'ay-2026',
    current_status: 'active',
    class_id: 'cls-001',
    class_name: 'Kelas 1 Awwaliyah',
    guardian_name: 'Bapak Hendra Wijaya',
    guardian_phone: '0812-3456-7890',
    created_at: '2026-07-15T00:00:00Z',
    updated_at: '2026-10-19T00:00:00Z'
  },
  {
    id: 'std-003',
    student_number: '202601003',
    nisn: '3156291003',
    full_name: 'Ahmad Bilal Al-Ghifari',
    nickname: 'Bilal',
    gender: 'L',
    birth_place: 'Bandung',
    birth_date: '2018-01-15',
    religion: 'Islam',
    address: 'Jl. Golf Barat No. 5, Arcamanik',
    enrollment_date: '2026-07-15',
    entry_academic_year_id: 'ay-2026',
    current_status: 'active',
    class_id: 'cls-001',
    class_name: 'Kelas 1 Awwaliyah',
    guardian_name: 'Bapak Surya Ramadhan',
    guardian_phone: '0813-8821-4321',
    created_at: '2026-07-15T00:00:00Z',
    updated_at: '2026-10-19T00:00:00Z'
  },
  {
    id: 'std-004',
    student_number: '202502001',
    nisn: '3146292004',
    full_name: 'Zahra Nurul Izzati',
    nickname: 'Zahra',
    gender: 'P',
    birth_place: 'Cimahi',
    birth_date: '2017-06-10',
    religion: 'Islam',
    address: 'Jl. Antapani Lama No. 18',
    enrollment_date: '2025-07-15',
    entry_academic_year_id: 'ay-2025',
    current_status: 'active',
    class_id: 'cls-002',
    class_name: 'Kelas 2 Awwaliyah',
    guardian_name: 'Ibu Ratna Dewi',
    guardian_phone: '0815-9988-7711',
    created_at: '2025-07-15T00:00:00Z',
    updated_at: '2026-10-19T00:00:00Z'
  },
  {
    id: 'std-005',
    student_number: '202403001',
    nisn: '3136293005',
    full_name: 'Raihan Dzaky Al-Farisi',
    nickname: 'Raihan',
    gender: 'L',
    birth_place: 'Bandung',
    birth_date: '2016-09-03',
    religion: 'Islam',
    address: 'Komp. Cisaranten Asri No. C-4',
    enrollment_date: '2024-07-15',
    entry_academic_year_id: 'ay-2024',
    current_status: 'active',
    class_id: 'cls-003',
    class_name: 'Kelas 3 Wustha',
    guardian_name: 'Bapak Dedi Suhendar',
    guardian_phone: '0821-1234-5678',
    created_at: '2024-07-15T00:00:00Z',
    updated_at: '2026-10-19T00:00:00Z'
  },
  {
    id: 'std-006',
    student_number: '202304001',
    nisn: '3126294006',
    full_name: 'Nabila Syakira Anwar',
    nickname: 'Nabila',
    gender: 'P',
    birth_place: 'Bandung',
    birth_date: '2015-11-28',
    religion: 'Islam',
    address: 'Jl. A.H. Nasution No. 88',
    enrollment_date: '2023-07-15',
    entry_academic_year_id: 'ay-2023',
    current_status: 'active',
    class_id: 'cls-004',
    class_name: 'Kelas 4 Ula',
    guardian_name: 'Bapak Anwar Sadat',
    guardian_phone: '0817-6655-4433',
    created_at: '2023-07-15T00:00:00Z',
    updated_at: '2026-10-19T00:00:00Z'
  }
];

export const initialFeeTypes: FeeType[] = [
  { id: 'fee-001', name: 'SPP Syahriah (Bulanan)', description: 'Iuran operasional bulanan pendidikan diniyah takmiliyah', default_amount: 150000, is_recurring: true, is_active: true },
  { id: 'fee-002', name: 'Infaq Gedung & Sarpras', description: 'Pengembangan sarana prasarana ruang belajar & musholla', default_amount: 350000, is_recurring: false, is_active: true },
  { id: 'fee-003', name: 'Kitab & Buku Panduan', description: 'Paket kitab matan fiqih, tajwid, hadits, dan buku tulis diniyah', default_amount: 200000, is_recurring: false, is_active: true },
  { id: 'fee-004', name: 'Ujian Imtihan & Rapor', description: 'Biaya pelaksanaan evaluasi tengah semester dan akhir semester', default_amount: 100000, is_recurring: false, is_active: true }
];

export const initialInvoices: StudentInvoice[] = [
  {
    id: 'inv-001',
    invoice_number: 'INV-2026-10-001',
    student_id: 'std-001',
    student_name: 'Muhammad Farhan Al-Fatih',
    class_name: 'Kelas 1 Awwaliyah',
    fee_type_id: 'fee-001',
    fee_type_name: 'SPP Syahriah (Bulanan)',
    academic_year_id: 'ay-2026',
    billing_period: 'Oktober 2026',
    due_date: '2026-10-10',
    amount: 150000,
    discount_amount: 0,
    paid_amount: 150000,
    status: 'paid',
    notes: 'SPP Oktober 2026 telah lunas',
    created_at: '2026-10-01T08:00:00Z'
  },
  {
    id: 'inv-002',
    invoice_number: 'INV-2026-10-002',
    student_id: 'std-002',
    student_name: 'Aisyah Putri Hanifah',
    class_name: 'Kelas 1 Awwaliyah',
    fee_type_id: 'fee-001',
    fee_type_name: 'SPP Syahriah (Bulanan)',
    academic_year_id: 'ay-2026',
    billing_period: 'Oktober 2026',
    due_date: '2026-10-10',
    amount: 150000,
    discount_amount: 0,
    paid_amount: 75000,
    status: 'partial',
    notes: 'Dibayar sebagian Rp 75.000, sisa Rp 75.000',
    created_at: '2026-10-01T08:00:00Z'
  },
  {
    id: 'inv-003',
    invoice_number: 'INV-2026-10-003',
    student_id: 'std-003',
    student_name: 'Ahmad Bilal Al-Ghifari',
    class_name: 'Kelas 1 Awwaliyah',
    fee_type_id: 'fee-001',
    fee_type_name: 'SPP Syahriah (Bulanan)',
    academic_year_id: 'ay-2026',
    billing_period: 'Oktober 2026',
    due_date: '2026-10-10',
    amount: 150000,
    discount_amount: 0,
    paid_amount: 0,
    status: 'unpaid',
    notes: 'Tunggakan SPP Oktober 2026',
    created_at: '2026-10-01T08:00:00Z'
  },
  {
    id: 'inv-004',
    invoice_number: 'INV-2026-10-004',
    student_id: 'std-004',
    student_name: 'Zahra Nurul Izzati',
    class_name: 'Kelas 2 Awwaliyah',
    fee_type_id: 'fee-001',
    fee_type_name: 'SPP Syahriah (Bulanan)',
    academic_year_id: 'ay-2026',
    billing_period: 'Oktober 2026',
    due_date: '2026-10-10',
    amount: 150000,
    discount_amount: 0,
    paid_amount: 150000,
    status: 'paid',
    notes: 'Lunas',
    created_at: '2026-10-01T08:00:00Z'
  },
  {
    id: 'inv-005',
    invoice_number: 'INV-2026-09-001',
    student_id: 'std-003',
    student_name: 'Ahmad Bilal Al-Ghifari',
    class_name: 'Kelas 1 Awwaliyah',
    fee_type_id: 'fee-001',
    fee_type_name: 'SPP Syahriah (Bulanan)',
    academic_year_id: 'ay-2026',
    billing_period: 'September 2026',
    due_date: '2026-09-10',
    amount: 150000,
    discount_amount: 0,
    paid_amount: 0,
    status: 'unpaid',
    notes: 'Tunggakan SPP September 2026',
    created_at: '2026-09-01T08:00:00Z'
  }
];

export const initialPayments: Payment[] = [
  {
    id: 'pay-001',
    receipt_number: 'KWT-2026-10-001',
    invoice_id: 'inv-001',
    invoice_number: 'INV-2026-10-001',
    student_id: 'std-001',
    student_name: 'Muhammad Farhan Al-Fatih',
    fee_type_name: 'SPP Syahriah (Bulanan)',
    billing_period: 'Oktober 2026',
    amount: 150000,
    payment_date: '2026-10-05',
    payment_method: 'cash',
    received_by_name: 'Hj. Nur Azizah, S.E. (Bendahara)',
    notes: 'Pembayaran tunai di kasir tata usaha',
    status: 'posted',
    created_at: '2026-10-05T09:30:00Z'
  },
  {
    id: 'pay-002',
    receipt_number: 'KWT-2026-10-002',
    invoice_id: 'inv-002',
    invoice_number: 'INV-2026-10-002',
    student_id: 'std-002',
    student_name: 'Aisyah Putri Hanifah',
    fee_type_name: 'SPP Syahriah (Bulanan)',
    billing_period: 'Oktober 2026',
    amount: 75000,
    payment_date: '2026-10-06',
    payment_method: 'cash',
    received_by_name: 'Hj. Nur Azizah, S.E. (Bendahara)',
    notes: 'Angsuran ke-1 (Sisa Rp 75.000)',
    status: 'posted',
    created_at: '2026-10-06T10:15:00Z'
  },
  {
    id: 'pay-003',
    receipt_number: 'KWT-2026-10-003',
    invoice_id: 'inv-004',
    invoice_number: 'INV-2026-10-004',
    student_id: 'std-004',
    student_name: 'Zahra Nurul Izzati',
    fee_type_name: 'SPP Syahriah (Bulanan)',
    billing_period: 'Oktober 2026',
    amount: 150000,
    payment_date: '2026-10-08',
    payment_method: 'bank_transfer',
    received_by_name: 'Hj. Nur Azizah, S.E. (Bendahara)',
    notes: 'Transfer Bank Syariah Indonesia',
    status: 'posted',
    created_at: '2026-10-08T11:00:00Z'
  }
];

export const initialAttendanceRecords: AttendanceRecord[] = [
  { id: 'att-001', session_id: 'sess-001', student_id: 'std-001', student_name: 'Muhammad Farhan Al-Fatih', status: 'present', created_at: '2026-10-19T07:30:00Z' },
  { id: 'att-002', session_id: 'sess-001', student_id: 'std-002', student_name: 'Aisyah Putri Hanifah', status: 'present', created_at: '2026-10-19T07:30:00Z' },
  { id: 'att-003', session_id: 'sess-001', student_id: 'std-003', student_name: 'Ahmad Bilal Al-Ghifari', status: 'sick', note: 'Surat dokter demam', created_at: '2026-10-19T07:30:00Z' }
];

export const initialReportCards: ReportCard[] = [
  {
    id: 'rc-001',
    student_id: 'std-001',
    student_name: 'Muhammad Farhan Al-Fatih',
    student_number: '202601001',
    class_id: 'cls-001',
    class_name: 'Kelas 1 Awwaliyah',
    academic_year_id: 'ay-2026',
    academic_year_name: '2026/2027',
    semester: 'Ganjil',
    attendance_summary: {
      present: 68,
      sick: 2,
      excused: 1,
      absent: 0
    },
    general_comment: 'Alhamdulillah, ananda Farhan menunjukkan semangat belajar yang sangat baik, tartil membaca Al-Quran sudah fasih, serta tertib dalam mempraktikkan wudhu dan shalat fardhu. Pertahankan dan istiqamah dalam muraja\'ah hafalan juz 30 di rumah.',
    status: 'published',
    grades: [
      { subject_code: 'QRN-01', subject_name: 'Al-Qur\'an & Tajwid', kkm: 75, final_score: 92, predicate: 'A', description: 'Sangat fasih melafalkan makharijul huruf dan hukum nun sukun/tanwin.' },
      { subject_code: 'FQH-01', subject_name: 'Fiqih Ibadah', kkm: 70, final_score: 88, predicate: 'A', description: 'Menguasai rukun dan syarat sah shalat serta mempraktikkannya dengan tertib.' },
      { subject_code: 'AQD-01', subject_name: 'Aqidah & Akhlak', kkm: 75, final_score: 90, predicate: 'A', description: 'Menunjukkan adab sopan santun yang mulia kepada asatidz dan sesama kawan.' },
      { subject_code: 'ARB-01', subject_name: 'Bahasa Arab Diniyah', kkm: 70, final_score: 84, predicate: 'B', description: 'Mampu menghafal mufrodat benda di madrasah dan percakapan salam.' },
      { subject_code: 'HDT-01', subject_name: 'Hadits Pilihan', kkm: 70, final_score: 89, predicate: 'A', description: 'Hafal 5 hadits adab dan kebersihan beserta maknanya.' },
      { subject_code: 'PRA-01', subject_name: 'Praktik Ibadah & Doa', kkm: 75, final_score: 94, predicate: 'A', description: 'Bacaan doa iftitah, ruku, sujud, dan tasyahud sangat lancar.' }
    ],
    prepared_by: 'Usth. Siti Saadah, S.Pd. (Wali Kelas)',
    reviewed_by: 'Ust. Ade Yusup, S.Pd. (Kepala Madrasah)',
    approved_at: '2026-10-15T10:00:00Z',
    published_at: '2026-10-16T08:00:00Z',
    created_at: '2026-10-10T00:00:00Z'
  },
  {
    id: 'rc-002',
    student_id: 'std-002',
    student_name: 'Aisyah Putri Hanifah',
    student_number: '202601002',
    class_id: 'cls-001',
    class_name: 'Kelas 1 Awwaliyah',
    academic_year_id: 'ay-2026',
    academic_year_name: '2026/2027',
    semester: 'Ganjil',
    attendance_summary: {
      present: 69,
      sick: 1,
      excused: 1,
      absent: 0
    },
    general_comment: 'Ananda Aisyah sangat tekun, santun, dan rajin mencatat. Bacaan surah An-Naba sampai Al-Muthaffifin sudah sangat rapi.',
    status: 'published',
    grades: [
      { subject_code: 'QRN-01', subject_name: 'Al-Qur\'an & Tajwid', kkm: 75, final_score: 95, predicate: 'A', description: 'Suara merdu, makhraj fasih, tajwid sangat tepat.' },
      { subject_code: 'FQH-01', subject_name: 'Fiqih Ibadah', kkm: 70, final_score: 91, predicate: 'A', description: 'Paham tata cara thaharah dan shalat berjamaah.' },
      { subject_code: 'AQD-01', subject_name: 'Aqidah & Akhlak', kkm: 75, final_score: 93, predicate: 'A', description: 'Berakhlak karimah, suka membantu teman yang kesulitan.' },
      { subject_code: 'ARB-01', subject_name: 'Bahasa Arab Diniyah', kkm: 70, final_score: 87, predicate: 'B', description: 'Menguasai isim dhomir dasar dan kalimat tanya sederhana.' },
      { subject_code: 'PRA-01', subject_name: 'Praktik Ibadah & Doa', kkm: 75, final_score: 96, predicate: 'A', description: 'Praktik shalat dan zikir setelah shalat sempurna.' }
    ],
    prepared_by: 'Usth. Siti Saadah, S.Pd. (Wali Kelas)',
    reviewed_by: 'Ust. Ade Yusup, S.Pd. (Kepala Madrasah)',
    approved_at: '2026-10-15T10:00:00Z',
    published_at: '2026-10-16T08:00:00Z',
    created_at: '2026-10-10T00:00:00Z'
  },
  {
    id: 'rc-003',
    student_id: 'std-003',
    student_name: 'Ahmad Bilal Al-Ghifari',
    student_number: '202601003',
    class_id: 'cls-001',
    class_name: 'Kelas 1 Awwaliyah',
    academic_year_id: 'ay-2026',
    academic_year_name: '2026/2027',
    semester: 'Ganjil',
    attendance_summary: {
      present: 61,
      sick: 6,
      excused: 3,
      absent: 1
    },
    general_comment: 'Ananda memiliki potensi hafalan yang kuat, perlu ditingkatkan kedisiplinan kehadiran di madrasah.',
    status: 'pending_review',
    grades: [
      { subject_code: 'QRN-01', subject_name: 'Al-Qur\'an & Tajwid', kkm: 75, final_score: 82, predicate: 'B', description: 'Tajwid cukup baik, perlu memperkuat mad wajib dan mad jaiz.' },
      { subject_code: 'FQH-01', subject_name: 'Fiqih Ibadah', kkm: 70, final_score: 79, predicate: 'C', description: 'Cukup memahami rukun shalat, perlu latihan gerakan tertib.' }
    ],
    prepared_by: 'Ust. Abdul Halim, S.Pd.I (Wali Kelas)',
    created_at: '2026-10-18T00:00:00Z'
  }
];

export const initialAnnouncements: Announcement[] = [
  {
    id: 'ann-001',
    title: 'Penerimaan Santri Baru (PSB) Gelombang II Tahun Ajaran 2026/2027',
    slug: 'psb-gelombang-ii-2026-2027',
    content: 'MDTU Nurul Hidayah membuka pendaftaran santri baru untuk jenjang Takmiliyah Ula (Usia SD/MI kelas 1-4). Kegiatan belajar dilaksanakan setiap hari Senin hingga Minggu pukul 13.00 - 15.00 WIB. Formulir dapat diisi langsung melalui website atau sekretariat madrasah.',
    category: 'Pendaftaran',
    status: 'published',
    published_at: '2026-10-10',
    author_name: 'Sekretariat MDTU'
  },
  {
    id: 'ann-002',
    title: 'Jadwal Penilaian Tengah Semester (PTS) Ganjil Tahun Ajaran 2026/2027',
    slug: 'jadwal-pts-ganjil-2026-2027',
    content: 'Diberitahukan kepada seluruh wali santri bahwa ujian PTS praktik ibadah dan lisan Al-Quran akan diselenggarakan mulai tanggal 26 Oktober sampai 31 Oktober 2026. Mohon para orang tua membimbing muraja\'ah di rumah.',
    category: 'Akademik',
    status: 'published',
    published_at: '2026-10-14',
    author_name: 'Bagian Kurikulum'
  },
  {
    id: 'ann-003',
    title: 'Peringatan Maulid Nabi Muhammad SAW 1448 H & Wisuda Tahfidz Juz 30',
    slug: 'maulid-nabi-wisuda-tahfidz-1448h',
    content: 'Keluarga besar MDTU Nurul Hidayah mengundang bapak/ibu wali santri untuk menghadiri tabligh akbar maulid sekaligus prosesi wisuda tahfidz juz 30 yang akan bertempat di Masjid Jamie Nurul Hidayah.',
    category: 'Kegiatan',
    status: 'published',
    published_at: '2026-10-18',
    author_name: 'Panitia PHBI'
  }
];

export const initialGalleryAlbums: GalleryAlbum[] = [
  {
    id: 'alb-001',
    title: 'Halaqah Tahfidz & Khotmil Quran',
    description: 'Kegiatan setoran hafalan juz 30 dan bimbingan tilawah santri Takmiliyah Ula',
    category: 'Tahfidz',
    event_date: '2026-09-28',
    is_published: true,
    cover_image: TAHFIDZ_IMG,
    photos_count: 14
  },
  {
    id: 'alb-002',
    title: 'Suasana Belajar Kelas Diniyah',
    description: 'Aktivitas santri putra dan putri mempelajari materi Fiqih, Aqidah, dan Bahasa Arab di kelas',
    category: 'KBM Madrasah',
    event_date: '2026-10-04',
    is_published: true,
    cover_image: HERO_SANTRI_IMG,
    photos_count: 20
  },
  {
    id: 'alb-003',
    title: 'Gedung & Fasilitas MDTU Nurul Hidayah',
    description: 'Fasilitas ruang belajar ber-AC, perpustakaan kitab islami, dan lingkungan asri',
    category: 'Sarana Prasarana',
    event_date: '2026-08-15',
    is_published: true,
    cover_image: HERO_BUILDING_IMG,
    photos_count: 8
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'log-001',
    actor_user_id: 'usr-treasurer',
    actor_name: 'Hj. Nur Azizah, S.E. (Bendahara)',
    action: 'PAYMENT_RECORDED',
    entity_type: 'PAYMENT',
    entity_id: 'KWT-2026-10-001',
    safe_metadata: { student: 'Muhammad Farhan Al-Fatih', amount: 150000, method: 'cash' },
    created_at: '2026-10-05T09:30:00Z'
  },
  {
    id: 'log-002',
    actor_user_id: 'usr-principal',
    actor_name: 'Ust. Ade Yusup, S.Pd. (Kepala Madrasah)',
    action: 'REPORT_CARD_APPROVED',
    entity_type: 'REPORT_CARD',
    entity_id: 'rc-001',
    safe_metadata: { student: 'Muhammad Farhan Al-Fatih', semester: 'Ganjil', year: '2026/2027' },
    created_at: '2026-10-15T10:00:00Z'
  },
  {
    id: 'log-003',
    actor_user_id: 'usr-principal',
    actor_name: 'Ust. Ade Yusup, S.Pd. (Kepala Madrasah)',
    action: 'REPORT_CARD_PUBLISHED',
    entity_type: 'REPORT_CARD',
    entity_id: 'rc-001',
    safe_metadata: { student: 'Muhammad Farhan Al-Fatih', status: 'published' },
    created_at: '2026-10-16T08:00:00Z'
  }
];

export const demoUserProfiles: Record<string, UserProfile> = {
  super_admin: {
    id: 'usr-superadmin',
    full_name: 'Ust. H. Abdullah (Ketua Yayasan)',
    email: 'yayasan@mdtu-nurulhidayah.sch.id',
    phone: '0811-2233-4455',
    account_status: 'active',
    created_at: '2026-01-01T00:00:00Z',
    roles: ['super_admin']
  },
  operator: {
    id: 'usr-operator',
    full_name: 'Ahmad Shofwan (Tata Usaha)',
    email: 'operator@mdtu-nurulhidayah.sch.id',
    phone: '0812-9900-1122',
    account_status: 'active',
    created_at: '2026-01-01T00:00:00Z',
    roles: ['operator']
  },
  principal: {
    id: 'usr-principal',
    full_name: 'Ust. Ade Yusup, S.Pd.',
    email: 'kepala@mdtu-nurulhidayah.sch.id',
    phone: '0813-4455-6677',
    avatar_path: HEADMASTER_IMG,
    account_status: 'active',
    created_at: '2026-01-01T00:00:00Z',
    roles: ['principal']
  },
  teacher: {
    id: 'usr-teacher-1',
    full_name: 'Ust. Azmi M Nurjamil',
    email: 'azminrjml@gmail.com',
    phone: '0817-2233-8899',
    account_status: 'active',
    created_at: '2026-01-01T00:00:00Z',
    roles: ['teacher']
  },
  treasurer: {
    id: 'usr-treasurer',
    full_name: 'Hj. Nur Azizah, S.E. (Bendahara)',
    email: 'keuangan@mdtu-nurulhidayah.sch.id',
    phone: '0819-3344-5566',
    account_status: 'active',
    created_at: '2026-01-01T00:00:00Z',
    roles: ['treasurer']
  },
  guardian: {
    id: 'usr-guardian',
    full_name: 'Bapak Hendra Wijaya (Wali Santri)',
    email: 'hendra.wijaya@gmail.com',
    phone: '0812-3456-7890',
    account_status: 'active',
    created_at: '2026-07-15T00:00:00Z',
    roles: ['guardian']
  }
};
