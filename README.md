import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const DATA_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'mdtu.db');
export const db = new DatabaseSync(DB_PATH);

// Helper for secure password hashing
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, combinedHash: string): boolean {
  try {
    const [salt, originalHash] = combinedHash.split(':');
    if (!salt || !originalHash) return false;
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(originalHash, 'hex'));
  } catch {
    return false;
  }
}

// 40 distinct parent accounts definition with unique passwords
export const FORTY_PARENTS_DATA = [
  { username: 'ortu01', pass: 'Fauzi#2026', parent: 'Bpk. Ahmad Fauzi', mother: 'Ibu Nurul Fatimah', phone: '081234567801', student: 'Muhammad Fatih Al-Hidayah', nis: '20260401', classId: 4, className: 'Kelas 4', gender: 'L' },
  { username: 'ortu02', pass: 'Dedi$9182', parent: 'Bpk. Dedi Supriadi', mother: 'Ibu Rina Marlina', phone: '081234567802', student: 'Aisyah Nur Salsabila', nis: '20260202', classId: 2, className: 'Kelas 2', gender: 'P' },
  { username: 'ortu03', pass: 'Aminah@7741', parent: 'Bpk. Hendra Gunawan', mother: 'Ibu Siti Aminah', phone: '081234567803', student: 'Ahmad Rayyan Pratama', nis: '20260103', classId: 1, className: 'Kelas 1', gender: 'L' },
  { username: 'ortu04', pass: 'Hendra*6623', parent: 'Bpk. Asep Saepudin', mother: 'Ibu Eni Rohaeni', phone: '081234567804', student: 'Bilal Habibi', nis: '20260304', classId: 3, className: 'Kelas 3', gender: 'L' },
  { username: 'ortu05', pass: 'Mulyana!5519', parent: 'Bpk. Ujang Sulaeman', mother: 'Ibu Cucu Cahyati', phone: '081234567805', student: 'Fatimah Zahra', nis: '20260405', classId: 4, className: 'Kelas 4', gender: 'P' },
  { username: 'ortu06', pass: 'Sulaeman&4412', parent: 'Bpk. Rahmat Hidayat', mother: 'Ibu Ai Komariah', phone: '081234567806', student: 'Salman Al-Farisi', nis: '20260106', classId: 1, className: 'Kelas 1', gender: 'L' },
  { username: 'ortu07', pass: 'Hidayati%3321', parent: 'Bpk. Kusnadi', mother: 'Ibu Titin Sumarni', phone: '081234567807', student: 'Hana Humaira', nis: '20260207', classId: 2, className: 'Kelas 2', gender: 'P' },
  { username: 'ortu08', pass: 'Rahmat^8824', parent: 'Bpk. Sudrajat', mother: 'Ibu Yuyun Yuningsih', phone: '081234567808', student: 'Zaid bin Haritsah', nis: '20260308', classId: 3, className: 'Kelas 3', gender: 'L' },
  { username: 'ortu09', pass: 'Kusnadi#1923', parent: 'Bpk. Rosyid Ridho', mother: 'Ibu Dewi Sartika', phone: '081234567809', student: 'Maryam Khansa', nis: '20260409', classId: 4, className: 'Kelas 4', gender: 'P' },
  { username: 'ortu10', pass: 'Maryani$5562', parent: 'Bpk. Iskandar Zulkarnain', mother: 'Ibu Nining Ratna', phone: '081234567810', student: 'Umar Al-Faruq', nis: '20260110', classId: 1, className: 'Kelas 1', gender: 'L' },
  { username: 'ortu11', pass: 'Sudrajat@4489', parent: 'Bpk. Wahyudi', mother: 'Ibu Lilis Suryani', phone: '081234567811', student: 'Khadijah Al-Kubra', nis: '20260211', classId: 2, className: 'Kelas 2', gender: 'P' },
  { username: 'ortu12', pass: 'Mubarok*7712', parent: 'Bpk. Ahmad Mubarok', mother: 'Ibu Ani Suryani', phone: '081234567812', student: 'Fatih Robbani', nis: '20260312', classId: 3, className: 'Kelas 3', gender: 'L' },
  { username: 'ortu13', pass: 'Fatimah!9921', parent: 'Bpk. Permana Sidik', mother: 'Ibu Elis Susanti', phone: '081234567813', student: 'Ibrahim Al-Khalil', nis: '20260413', classId: 4, className: 'Kelas 4', gender: 'L' },
  { username: 'ortu14', pass: 'Iskandar&7745', parent: 'Bpk. Syarif Hidayatulloh', mother: 'Ibu Neneng Hasanah', phone: '081234567814', student: 'Ruqayyah Azzahra', nis: '20260114', classId: 1, className: 'Kelas 1', gender: 'P' },
  { username: 'ortu15', pass: 'Yuliana%8816', parent: 'Bpk. Junaedi', mother: 'Ibu Kokom Komalasari', phone: '081234567815', student: 'Usamah bin Zaid', nis: '20260215', classId: 2, className: 'Kelas 2', gender: 'L' },
  { username: 'ortu16', pass: 'Wahyudi^2234', parent: 'Bpk. Solihin', mother: 'Ibu Ati Nurhayati', phone: '081234567816', student: 'Safiyyah Nur', nis: '20260316', classId: 3, className: 'Kelas 3', gender: 'P' },
  { username: 'ortu17', pass: 'Permana@1187', parent: 'Bpk. Suhendar', mother: 'Ibu Euis Ratnasari', phone: '081234567817', student: 'Hamzah Asadullah', nis: '20260417', classId: 4, className: 'Kelas 4', gender: 'L' },
  { username: 'ortu18', pass: 'Sulastri$4452', parent: 'Bpk. Kurniawan', mother: 'Ibu Wiwin Winarti', phone: '081234567818', student: 'Asma binti Abu Bakar', nis: '20260118', classId: 1, className: 'Kelas 1', gender: 'P' },
  { username: 'ortu19', pass: 'Syarif*9932', parent: 'Bpk. Lukman Hakim', mother: 'Ibu Lina Marlina', phone: '081234567819', student: 'Muadz bin Jabal', nis: '20260219', classId: 2, className: 'Kelas 2', gender: 'L' },
  { username: 'ortu20', pass: 'Junaedi!8876', parent: 'Bpk. Khoiruddin', mother: 'Ibu Ida Farida', phone: '081234567820', student: 'Zainab Al-Ghazali', nis: '20260320', classId: 3, className: 'Kelas 3', gender: 'P' },
  { username: 'ortu21', pass: 'Nurhasanah&3345', parent: 'Bpk. Mansyur', mother: 'Ibu Teti Rohayati', phone: '081234567821', student: 'Zubair bin Awwam', nis: '20260421', classId: 4, className: 'Kelas 4', gender: 'L' },
  { username: 'ortu22', pass: 'Solihin%6621', parent: 'Bpk. Badruzzaman', mother: 'Ibu Nunung Nurjanah', phone: '081234567822', student: 'Juwairiyah', nis: '20260122', classId: 1, className: 'Kelas 1', gender: 'P' },
  { username: 'ortu23', pass: 'Zubaedah^5518', parent: 'Bpk. Zakaria', mother: 'Ibu Yeti Sumiati', phone: '081234567823', student: 'Thariq bin Ziyad', nis: '20260223', classId: 2, className: 'Kelas 2', gender: 'L' },
  { username: 'ortu24', pass: 'Suhendar#7789', parent: 'Bpk. Komarudin', mother: 'Ibu Enok Rohanah', phone: '081234567824', student: 'Hafshah binti Umar', nis: '20260324', classId: 3, className: 'Kelas 3', gender: 'P' },
  { username: 'ortu25', pass: 'Kurniawan$2241', parent: 'Bpk. Rohman', mother: 'Ibu Mumun Munawaroh', phone: '081234567825', student: 'Ammar bin Yasir', nis: '20260425', classId: 4, className: 'Kelas 4', gender: 'L' },
  { username: 'ortu26', pass: 'Nursyamsi@4490', parent: 'Bpk. Saprudin', mother: 'Ibu Ai Mulyati', phone: '081234567826', student: 'Halimah As-Sa diyah', nis: '20260126', classId: 1, className: 'Kelas 1', gender: 'P' },
  { username: 'ortu27', pass: 'Gunawan*8812', parent: 'Bpk. Tatang Supriatna', mother: 'Ibu Imas Masitoh', phone: '081234567827', student: 'Khalid bin Walid', nis: '20260227', classId: 2, className: 'Kelas 2', gender: 'L' },
  { username: 'ortu28', pass: 'Marwah!5534', parent: 'Bpk. Yana Mulyana', mother: 'Ibu Tati Haryati', phone: '081234567828', student: 'Ummu Kultsum', nis: '20260328', classId: 3, className: 'Kelas 3', gender: 'P' },
  { username: 'ortu29', pass: 'Lukman&9918', parent: 'Bpk. Cecep Hidayat', mother: 'Ibu Eli Rohaeli', phone: '081234567829', student: 'Abdullah bin Mas ud', nis: '20260429', classId: 4, className: 'Kelas 4', gender: 'L' },
  { username: 'ortu30', pass: 'Fitriani%7723', parent: 'Bpk. Nanang Kosim', mother: 'Ibu Oneng Rohanah', phone: '081234567830', student: 'Barakah Ummu Aiman', nis: '20260130', classId: 1, className: 'Kelas 1', gender: 'P' },
  { username: 'ortu31', pass: 'Khoiruddin^3365', parent: 'Bpk. Iwan Setiawan', mother: 'Ibu Popon Rohani', phone: '081234567831', student: 'Abu Ubaidah', nis: '20260231', classId: 2, className: 'Kelas 2', gender: 'L' },
  { username: 'ortu32', pass: 'Mansyur#4419', parent: 'Bpk. Agus Gunawan', mother: 'Ibu Cicih Sukaesih', phone: '081234567832', student: 'Maimunah', nis: '20260332', classId: 3, className: 'Kelas 3', gender: 'P' },
  { username: 'ortu33', pass: 'Khotimah$8892', parent: 'Bpk. Endang Suhendi', mother: 'Ibu Iis Aisyah', phone: '081234567833', student: 'Saad bin Abi Waqqas', nis: '20260433', classId: 4, className: 'Kelas 4', gender: 'L' },
  { username: 'ortu34', pass: 'Badruzzaman@1127', parent: 'Bpk. Aang Kunaefi', mother: 'Ibu Nani Suryani', phone: '081234567834', student: 'Atikah binti Zaid', nis: '20260134', classId: 1, className: 'Kelas 1', gender: 'P' },
  { username: 'ortu35', pass: 'Zakaria*6634', parent: 'Bpk. Dadang Darmawan', mother: 'Ibu Yayah Rokayah', phone: '081234567835', student: 'Talhah bin Ubaidillah', nis: '20260235', classId: 2, className: 'Kelas 2', gender: 'L' },
  { username: 'ortu36', pass: 'SitiNur!5589', parent: 'Bpk. Wawan Hermawan', mother: 'Ibu Mimin Mintarsih', phone: '081234567836', student: 'Nusaibah binti Ka ab', nis: '20260336', classId: 3, className: 'Kelas 3', gender: 'P' },
  { username: 'ortu37', pass: 'Komarudin&4471', parent: 'Bpk. Oding Hasanudin', mother: 'Ibu Oom Komariah', phone: '081234567837', student: 'Ja far bin Abi Thalib', nis: '20260437', classId: 4, className: 'Kelas 4', gender: 'L' },
  { username: 'ortu38', pass: 'Rohman%9928', parent: 'Bpk. Aceng Syihabudin', mother: 'Ibu Cucun Cuhaeti', phone: '081234567838', student: 'Al-Khansa', nis: '20260138', classId: 1, className: 'Kelas 1', gender: 'P' },
  { username: 'ortu39', pass: 'Saprudin^3312', parent: 'Bpk. Didin Syamsudin', mother: 'Ibu Emi Suhaemi', phone: '081234567839', student: 'Mus ab bin Umair', nis: '20260239', classId: 2, className: 'Kelas 2', gender: 'L' },
  { username: 'ortu40', pass: 'Eman#8821', parent: 'Bpk. Eman Suherman', mother: 'Ibu Kokom Kuraesin', phone: '081234567840', student: 'Syifa Nur Azizah', nis: '20260340', classId: 3, className: 'Kelas 3', gender: 'P' },
];

export function initDatabase() {
  db.exec('PRAGMA foreign_keys = ON;');

  // 1. Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'guru', 'ortu')),
      full_name TEXT NOT NULL,
      phone TEXT,
      must_change_password INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );
  `);

  // 2. Parent profiles
  db.exec(`
    CREATE TABLE IF NOT EXISTS parent_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      father_name TEXT,
      mother_name TEXT,
      guardian_name TEXT,
      phone TEXT,
      address TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 3. Parent Access List (For admin to view / export / print slips)
  db.exec(`
    CREATE TABLE IF NOT EXISTS parent_access_list (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE,
      username TEXT UNIQUE NOT NULL,
      initial_password TEXT NOT NULL,
      parent_name TEXT NOT NULL,
      phone TEXT,
      student_name TEXT,
      student_nis TEXT,
      class_name TEXT,
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );
  `);

  // 4. Classes
  db.exec(`
    CREATE TABLE IF NOT EXISTS classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      level INTEGER NOT NULL,
      academic_year TEXT NOT NULL,
      teacher_id INTEGER,
      room_name TEXT
    );
  `);

  // 5. Teacher profiles
  db.exec(`
    CREATE TABLE IF NOT EXISTS teacher_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE,
      full_name TEXT NOT NULL,
      title TEXT NOT NULL,
      nip TEXT,
      phone TEXT,
      email TEXT,
      photo_url TEXT,
      assigned_class_id INTEGER,
      is_active INTEGER DEFAULT 1,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (assigned_class_id) REFERENCES classes(id) ON DELETE SET NULL
    );
  `);

  // 6. Students
  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nis TEXT UNIQUE,
      full_name TEXT NOT NULL,
      gender TEXT NOT NULL CHECK(gender IN ('L', 'P')),
      birth_place TEXT,
      birth_date TEXT,
      address TEXT,
      previous_school TEXT,
      class_id INTEGER,
      parent_user_id INTEGER,
      academic_year TEXT NOT NULL,
      status TEXT DEFAULT 'Aktif' CHECK(status IN ('Aktif', 'Lulus', 'Pindah', 'Non-Aktif')),
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL,
      FOREIGN KEY (parent_user_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  // 7. Attendance
  db.exec(`
    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      class_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('Hadir', 'Sakit', 'Izin', 'Alpa')),
      notes TEXT,
      recorded_by_user_id INTEGER,
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      UNIQUE(student_id, date),
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    );
  `);

  // 8. Academic Notes
  db.exec(`
    CREATE TABLE IF NOT EXISTS academic_notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      subject TEXT NOT NULL,
      title TEXT NOT NULL,
      notes TEXT NOT NULL,
      score TEXT,
      teacher_user_id INTEGER,
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    );
  `);

  // 9. Schedules
  db.exec(`
    CREATE TABLE IF NOT EXISTS schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      class_id INTEGER NOT NULL,
      day TEXT NOT NULL,
      time_slot TEXT NOT NULL,
      subject TEXT NOT NULL,
      teacher_name TEXT,
      FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
    );
  `);

  // 10. News & Announcements
  db.exec(`
    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      excerpt TEXT,
      content TEXT NOT NULL,
      cover_image TEXT,
      author_name TEXT,
      status TEXT DEFAULT 'Published' CHECK(status IN ('Draft', 'Published')),
      published_at TEXT DEFAULT (datetime('now', 'localtime')),
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );
  `);

  // 11. Admissions (PPDB)
  db.exec(`
    CREATE TABLE IF NOT EXISTS admissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      registration_no TEXT UNIQUE NOT NULL,
      student_name TEXT NOT NULL,
      gender TEXT NOT NULL,
      birth_place TEXT NOT NULL,
      birth_date TEXT NOT NULL,
      address TEXT NOT NULL,
      previous_school TEXT,
      target_class TEXT NOT NULL,
      academic_year TEXT NOT NULL,
      father_name TEXT NOT NULL,
      mother_name TEXT NOT NULL,
      guardian_name TEXT,
      parent_phone TEXT NOT NULL,
      parent_address TEXT,
      doc_photo TEXT,
      doc_kk TEXT,
      doc_akta TEXT,
      status TEXT DEFAULT 'Menunggu Verifikasi' CHECK(status IN ('Menunggu Verifikasi', 'Diterima', 'Perlu Perbaikan')),
      admin_notes TEXT,
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );
  `);

  // 12. Payment Types
  db.exec(`
    CREATE TABLE IF NOT EXISTS payment_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      default_amount INTEGER DEFAULT 0,
      description TEXT,
      is_active INTEGER DEFAULT 1
    );
  `);

  // 13. Student Bills
  db.exec(`
    CREATE TABLE IF NOT EXISTS student_bills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bill_no TEXT UNIQUE NOT NULL,
      student_id INTEGER NOT NULL,
      payment_type_id INTEGER NOT NULL,
      month TEXT NOT NULL,
      year INTEGER NOT NULL,
      academic_year TEXT NOT NULL,
      due_date TEXT,
      amount INTEGER NOT NULL,
      amount_paid INTEGER DEFAULT 0,
      status TEXT DEFAULT 'Belum Bayar' CHECK(status IN ('Belum Bayar', 'Menunggu Verifikasi', 'Sebagian Dibayar', 'Lunas', 'Ditolak')),
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      UNIQUE(student_id, payment_type_id, month, year),
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (payment_type_id) REFERENCES payment_types(id) ON DELETE RESTRICT
    );
  `);

  // 14. Payment Reports
  db.exec(`
    CREATE TABLE IF NOT EXISTS payment_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bill_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      reported_by_user_id INTEGER NOT NULL,
      amount INTEGER NOT NULL,
      payment_date TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      reference_no TEXT,
      proof_image TEXT,
      status TEXT DEFAULT 'Menunggu Verifikasi' CHECK(status IN ('Menunggu Verifikasi', 'Disetujui', 'Ditolak')),
      admin_notes TEXT,
      verified_by_user_id INTEGER,
      verified_at TEXT,
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (bill_id) REFERENCES student_bills(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (reported_by_user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 15. Payment Transactions
  db.exec(`
    CREATE TABLE IF NOT EXISTS payment_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      receipt_no TEXT UNIQUE NOT NULL,
      bill_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      report_id INTEGER,
      amount INTEGER NOT NULL,
      payment_date TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      reference_no TEXT,
      cashier_name TEXT NOT NULL,
      cashier_user_id INTEGER,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (bill_id) REFERENCES student_bills(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    );
  `);

  // 16. Payment Audit Logs
  db.exec(`
    CREATE TABLE IF NOT EXISTS payment_audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id INTEGER,
      actor_name TEXT NOT NULL,
      details TEXT,
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );
  `);

  // 17. Site Settings & Official Accounts
  db.exec(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      institution_name TEXT NOT NULL,
      headmaster_name TEXT NOT NULL,
      address TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      academic_year TEXT NOT NULL,
      dana_account TEXT DEFAULT '081324168105',
      bri_account TEXT DEFAULT '405601013846503',
      welcome_text TEXT,
      history_text TEXT,
      vision_text TEXT,
      mission_text TEXT,
      operating_hours TEXT,
      registration_open INTEGER DEFAULT 1,
      map_embed_url TEXT,
      updated_at TEXT DEFAULT (datetime('now', 'localtime'))
    );
  `);

  // 18. Contact Messages
  db.exec(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'Baru' CHECK(status IN ('Baru', 'Dibaca', 'Dibalas')),
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );
  `);

  // Check and run migrations for missing columns in existing database
  try {
    const tableInfo = db.prepare('PRAGMA table_info(site_settings)').all() as Array<{ name: string }>;
    const columnNames = tableInfo.map((c) => c.name);
    if (!columnNames.includes('dana_account')) {
      db.exec("ALTER TABLE site_settings ADD COLUMN dana_account TEXT DEFAULT '081324168105';");
    }
    if (!columnNames.includes('bri_account')) {
      db.exec("ALTER TABLE site_settings ADD COLUMN bri_account TEXT DEFAULT '405601013846503';");
    }
    // Guarantee official payment accounts match requested values
    db.prepare(`
      UPDATE site_settings SET
        dana_account = '081324168105',
        bri_account = '405601013846503',
        updated_at = datetime('now', 'localtime')
      WHERE id = 1
    `).run();
  } catch (err) {
    console.warn('Migration note:', err);
  }

  seedInitialData();
  ensureFortyParents();
}

function seedInitialData() {
  const userCount = (db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }).count;
  if (userCount > 0) return;

  console.log('🌱 Seeding initial MDTU Nurul Hidayah database...');

  const insertUser = db.prepare(`
    INSERT INTO users (username, email, password_hash, role, full_name, phone, must_change_password)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  // Admin & Guru
  insertUser.run('admin334', 'nurulhidayah177@gmail.com', hashPassword('admin334'), 'admin', 'Administrator MDTU', '182315987599', 0);
  insertUser.run('guru445', 'guru.mdtu@gmail.com', hashPassword('guru445'), 'guru', 'Ust. Ade Yusup, S.Pd.', '182315987599', 0);

  // Classes
  const insertClass = db.prepare(`
    INSERT INTO classes (name, level, academic_year, room_name)
    VALUES (?, ?, ?, ?)
  `);
  insertClass.run('Kelas 1', 1, '2025/2026', 'Ruang Ali bin Abi Thalib');
  insertClass.run('Kelas 2', 2, '2025/2026', 'Ruang Utsman bin Affan');
  insertClass.run('Kelas 3', 3, '2025/2026', 'Ruang Umar bin Khattab');
  insertClass.run('Kelas 4', 4, '2025/2026', 'Ruang Abu Bakar Ash-Shiddiq');

  // Teachers
  const guruUser = db.prepare("SELECT id FROM users WHERE username = 'guru445'").get() as { id: number };
  const insertTeacher = db.prepare(`
    INSERT INTO teacher_profiles (user_id, full_name, title, nip, phone, email, photo_url, assigned_class_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertTeacher.run(
    guruUser.id,
    'Ust. Ade Yusup, S.Pd.',
    'Kepala Lembaga & Wali Kelas 4',
    '197805122005011002',
    '182315987599',
    'adeyusup@mdtu-nurulhidayah.sch.id',
    '/src/assets/images/ustadz_ade_yusup_1792486709696.jpg',
    4
  );

  insertTeacher.run(null, 'Usth. Siti Saadah, S.Pd.', 'Wali Kelas 1 & Pengajar Al-Quran Hadits', '198503142010022001', '081394123456', 'sitisaadah@mdtu-nurulhidayah.sch.id', '', 1);
  insertTeacher.run(null, 'Usth. Fitri Hermawati', 'Wali Kelas 2 & Pengajar Akidah Akhlak', '199008202014032002', '081394234567', 'fitri@mdtu-nurulhidayah.sch.id', '', 2);
  insertTeacher.run(null, 'Ust. Azmi M Nurjamil', 'Wali Kelas 3 & Pengajar Fiqih & Bahasa Arab', '198811052012011003', '081394345678', 'azminrjml@gmail.com', '', 3);

  db.prepare('UPDATE classes SET teacher_id = 2 WHERE id = 1').run();
  db.prepare('UPDATE classes SET teacher_id = 3 WHERE id = 2').run();
  db.prepare('UPDATE classes SET teacher_id = 4 WHERE id = 3').run();
  db.prepare('UPDATE classes SET teacher_id = 1 WHERE id = 4').run();

  // Payment Types
  const insertPaymentType = db.prepare(`
    INSERT INTO payment_types (code, name, default_amount, description, is_active)
    VALUES (?, ?, ?, ?, ?)
  `);
  insertPaymentType.run('SPP', 'SPP Bulanan MDTU', 35000, 'Iuran pendidikan bulanan santri MDTU Nurul Hidayah', 1);
  insertPaymentType.run('INFAQ_BANGUNAN', 'Infaq Pembangunan Madrasah', 50000, 'Infaq gotong royong pemeliharaan sarana prasarana', 1);
  insertPaymentType.run('UJIAN_KITAB', 'Iuran Ujian & Kitab Kuning', 25000, 'Biaya evaluasi semester dan pengadaan bahan ajar', 1);

  // Site Settings (with updated accounts DANA 081324168105 & BRI 405601013846503)
  db.prepare(`
    INSERT INTO site_settings (id, institution_name, headmaster_name, address, phone, email, academic_year, dana_account, bri_account, welcome_text, history_text, vision_text, mission_text, operating_hours, registration_open, map_embed_url)
    VALUES (1, ?, ?, ?, ?, ?, ?, '081324168105', '405601013846503', ?, ?, ?, ?, ?, 1, ?)
  `).run(
    'MDTU Nurul Hidayah',
    'Ust. Ade Yusup, S.Pd.',
    'Kp. Dukuh Sari, Dusun Cigoong, RT 03 RW 01, Desa Sirnabaya, Kecamatan Rajadesa, Kabupaten Ciamis, Jawa Barat 46254',
    '182315987599',
    'nurulhidayah177@gmail.com',
    '2025/2026',
    'Selamat Datang di Portal Resmi MDTU Nurul Hidayah. Kami berikhtiar mendidik generasi santri yang berakhlak mulia, berilmu amaliah, dan beriman teguh dengan menanamkan nilai-nilai Al-Quran dan As-Sunnah sejak dini.',
    'MDTU Nurul Hidayah didirikan sebagai wujud khidmah dan ikhtiar bersama para tokoh agama serta masyarakat Dusun Cigoong, Desa Sirnabaya, Kecamatan Rajadesa, Kabupaten Ciamis. Lembaga ini hadir untuk menjawab kebutuhan pendidikan keagamaan Islam bagi anak-anak usia sekolah dasar agar memperoleh pemahaman agama yang kokoh, penguasaan baca tulis Al-Quran, dan pembiasaan adab islami dalam kehidupan sehari-hari.',
    'Terwujudnya generasi santri yang beriman kokoh, berakhlak karimah, cerdas dalam pemahaman ilmu agama, dan beramal shalih untuk agama, bangsa, dan keluarga.',
    '1. Menyelenggarakan pendidikan agama Islam yang berakar pada Al-Quran dan Sunnah Rasulullah SAW.\n2. Menanamkan adab dan akhlak mulia dalam tutur kata dan perilaku sehari-hari.\n3. Melatih kemampuan membaca, menghafal, dan memahami Al-Quran dengan kaidah tajwid yang benar.\n4. Menyelenggarakan pembelajaran fiqih ibadah praktis yang aplikatif.\n5. Membangun sinergi harmonis antara dewan guru, orang tua/wali santri, dan masyarakat.',
    'Senin - Sabtu: 13.30 - 17.30 WIB (Pagi: Pelayanan Administrasi 08.00 - 12.00 WIB)',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15829.138407421257!2d108.432!3d-7.208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6f477611a2fdf1%3A0x633512803b9f6f69!2sSirnabaya%2C%20Kec.%20Rajadesa%2C%20Kabupaten%20Ciamis%2C%20Jawa%20Barat!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid'
  );

  // News & Announcements
  db.prepare(`
    INSERT INTO news (title, slug, category, excerpt, content, cover_image, author_name, status, published_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'Penerimaan Santri Baru (PPDB) MDTU Nurul Hidayah Tahun Ajaran 2026/2027 Resmi Dibuka',
    'penerimaan-santri-baru-2026-2027',
    'Pengumuman',
    'MDTU Nurul Hidayah membuka kesempatan bagi putra-putri untuk menimba ilmu agama Islam, Al-Quran, dan pembentukan akhlak mulia.',
    'Alhamdulillah, pendaftaran calon santri baru Madrasah Diniyah Takmiliyah Ula (MDTU) Nurul Hidayah Ciamis untuk tahun ajaran baru telah resmi dibuka. Pembayaran SPP dan infaq dapat disalurkan melalui Rekening BRI 405601013846503 atau DANA 081324168105 a.n. MDTU Nurul Hidayah.',
    '/src/assets/images/gedung_madrasah_1792486708897.jpg',
    'Ust. Ade Yusup, S.Pd.',
    'Published',
    '2026-10-15 08:00:00'
  );
}

// Ensure 40 distinct parent accounts with 40 distinct passwords exist
export function ensureFortyParents() {
  const insertUser = db.prepare(`
    INSERT INTO users (username, email, password_hash, role, full_name, phone, must_change_password)
    VALUES (?, ?, ?, 'ortu', ?, ?, 0)
  `);

  const insertParentProfile = db.prepare(`
    INSERT INTO parent_profiles (user_id, father_name, mother_name, guardian_name, phone, address)
    VALUES (?, ?, ?, '', ?, ?)
  `);

  const insertParentAccess = db.prepare(`
    INSERT INTO parent_access_list (user_id, username, initial_password, parent_name, phone, student_name, student_nis, class_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(username) DO UPDATE SET
      initial_password = excluded.initial_password,
      parent_name = excluded.parent_name,
      student_name = excluded.student_name,
      class_name = excluded.class_name
  `);

  const insertStudent = db.prepare(`
    INSERT INTO students (nis, full_name, gender, birth_place, birth_date, address, previous_school, class_id, parent_user_id, academic_year, status)
    VALUES (?, ?, ?, 'Ciamis', '2016-06-15', ?, 'SDN Sirnabaya', ?, ?, '2025/2026', 'Aktif')
    ON CONFLICT(nis) DO UPDATE SET
      full_name = excluded.full_name,
      class_id = excluded.class_id,
      parent_user_id = excluded.parent_user_id
  `);

  const insertBill = db.prepare(`
    INSERT INTO student_bills (bill_no, student_id, payment_type_id, month, year, academic_year, due_date, amount, amount_paid, status)
    VALUES (?, ?, 1, ?, 2026, '2025/2026', '2026-15-10', 35000, ?, ?)
    ON CONFLICT(student_id, payment_type_id, month, year) DO NOTHING
  `);

  for (const item of FORTY_PARENTS_DATA) {
    let user = db.prepare('SELECT id FROM users WHERE username = ?').get(item.username) as { id: number } | undefined;

    if (!user) {
      const email = `${item.username}@mdtu-nurulhidayah.sch.id`;
      const result = insertUser.run(
        item.username,
        email,
        hashPassword(item.pass),
        item.parent,
        item.phone
      );
      const userId = Number(result.lastInsertRowid);
      user = { id: userId };

      insertParentProfile.run(
        userId,
        item.parent,
        item.mother,
        item.phone,
        `Kp. Dukuh Sari RT 0${(item.classId % 3) + 1} RW 01, Dusun Cigoong, Sirnabaya, Ciamis`
      );
    } else {
      // Ensure each parent's credentials strictly match their distinct password
      db.prepare(`
        UPDATE users SET
          password_hash = ?,
          full_name = ?,
          phone = ?
        WHERE id = ?
      `).run(hashPassword(item.pass), item.parent, item.phone, user.id);
    }

    // Insert or update student
    const studentAddress = `Kp. Dukuh Sari, Dusun Cigoong, RT 0${(item.classId % 3) + 1} RW 01, Sirnabaya, Ciamis`;
    insertStudent.run(
      item.nis,
      item.student,
      item.gender,
      studentAddress,
      item.classId,
      user.id
    );

    const studentRecord = db.prepare('SELECT id FROM students WHERE nis = ?').get(item.nis) as { id: number };

    // Record in parent_access_list for Admin credentials distribution
    insertParentAccess.run(
      user.id,
      item.username,
      item.pass,
      item.parent,
      item.phone,
      item.student,
      item.nis,
      item.className
    );

    // Seed bills for this student
    if (studentRecord) {
      const isJanPaid = item.nis.endsWith('1') || item.nis.endsWith('2') || item.nis.endsWith('3') || item.username === 'ortu01';
      insertBill.run(`TAG-2026-JAN-${item.nis}`, studentRecord.id, 'Januari', isJanPaid ? 35000 : 0, isJanPaid ? 'Lunas' : 'Belum Bayar');
      insertBill.run(`TAG-2026-FEB-${item.nis}`, studentRecord.id, 'Februari', 0, 'Belum Bayar');
      insertBill.run(`TAG-2026-MAR-${item.nis}`, studentRecord.id, 'Maret', 0, 'Belum Bayar');
    }
  }

  console.log('✅ Ensured 40 distinct parent accounts and 40 distinct credentials exist.');
}
