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
  AttendanceSession,
  Announcement,
  GalleryAlbum,
  AuditLog,
  UserProfile,
  UserRole
} from '../types';

import {
  initialInstitution,
  initialAcademicYears,
  initialTeachers,
  initialClasses,
  initialSubjects,
  initialTeachingAssignments,
  initialStudents,
  initialFeeTypes,
  initialInvoices,
  initialPayments,
  initialAttendanceRecords,
  initialReportCards,
  initialAnnouncements,
  initialGalleryAlbums,
  initialAuditLogs,
  demoUserProfiles
} from './seedData';

// Indonesian number to words conversion for receipts (Terbilang)
export function angkaTerbilang(nilai: number): string {
  const bilangan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
  const n = Math.floor(Math.abs(nilai));
  
  if (n < 12) {
    return bilangan[n];
  } else if (n < 20) {
    return angkaTerbilang(n - 10) + ' Belas';
  } else if (n < 100) {
    return angkaTerbilang(Math.floor(n / 10)) + ' Puluh ' + angkaTerbilang(n % 10);
  } else if (n < 200) {
    return 'Seratus ' + angkaTerbilang(n - 100);
  } else if (n < 1000) {
    return angkaTerbilang(Math.floor(n / 100)) + ' Ratus ' + angkaTerbilang(n % 100);
  } else if (n < 2000) {
    return 'Seribu ' + angkaTerbilang(n - 1000);
  } else if (n < 1000000) {
    return angkaTerbilang(Math.floor(n / 1000)) + ' Ribu ' + angkaTerbilang(n % 1000);
  } else if (n < 1000000000) {
    return angkaTerbilang(Math.floor(n / 1000000)) + ' Juta ' + angkaTerbilang(n % 1000000);
  } else {
    return angkaTerbilang(Math.floor(n / 1000000000)) + ' Milyar ' + angkaTerbilang(n % 1000000000);
  }
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatTanggal(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(d);
  } catch {
    return dateStr;
  }
}

const STORAGE_KEY_PREFIX = 'mdtu_hidayah_';

function getStored<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export class AppStorage {
  // Current user state
  static getCurrentUser(): UserProfile {
    const user = getStored<UserProfile>('current_user', demoUserProfiles.super_admin);
    if (user && (user.full_name?.toLowerCase().includes('azmi') || user.id === 'usr-teacher-1')) {
      return demoUserProfiles.teacher;
    }
    return user;
  }

  static setCurrentUser(user: UserProfile): void {
    setStored('current_user', user);
  }

  static switchUserRole(role: UserRole): UserProfile {
    const user = demoUserProfiles[role] || demoUserProfiles.super_admin;
    this.setCurrentUser(user);
    this.logAudit('USER_ROLE_SWITCH', 'USER', user.id, { switched_to_role: role });
    return user;
  }

  // Audit Logs
  static getAuditLogs(): AuditLog[] {
    return getStored<AuditLog[]>('audit_logs', initialAuditLogs);
  }

  static logAudit(action: string, entity_type: string, entity_id: string, safe_metadata: Record<string, any> = {}): void {
    const currentUser = this.getCurrentUser();
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      actor_user_id: currentUser.id,
      actor_name: currentUser.full_name,
      action,
      entity_type,
      entity_id,
      safe_metadata,
      created_at: new Date().toISOString()
    };
    setStored('audit_logs', [newLog, ...logs]);
  }

  // Institution
  static getInstitution(): Institution {
    const inst = getStored<Institution>('institution', initialInstitution);
    let changed = false;
    if (inst && (inst.principal_name === 'Ust. Ahmad Fauzi, S.Ag., M.Pd.' || !inst.principal_name)) {
      inst.principal_name = 'Ust. Ade Yusup, S.Pd.';
      changed = true;
    }
    if (inst && (!inst.address.includes('Dukuh Sari') || !inst.city.includes('Ciamis'))) {
      inst.address = 'Kp. Dukuh Sari Dusun. Cigoong RT 03 RW 01 Desa. Sirnabaya Kec. Rajadesa';
      inst.village = 'Sirnabaya';
      inst.district = 'Rajadesa';
      inst.city = 'Kab. Ciamis';
      inst.province = 'Jawa Barat';
      inst.postal_code = '46254';
      inst.foundation_name = 'Yayasan Nurul Hidayah';
      changed = true;
    }
    if (inst && (inst.phone !== '082315987599' || inst.email !== 'nurulhidayah771@gmail.com')) {
      inst.phone = '082315987599';
      inst.email = 'nurulhidayah771@gmail.com';
      changed = true;
    }
    if (changed) {
      setStored('institution', inst);
    }
    return inst;
  }

  static updateInstitution(inst: Institution): void {
    setStored('institution', inst);
    this.logAudit('UPDATE_INSTITUTION', 'INSTITUTION', inst.id, { name: inst.name });
  }

  // Academic Years
  static getAcademicYears(): AcademicYear[] {
    return getStored<AcademicYear[]>('academic_years', initialAcademicYears);
  }

  static getActiveAcademicYear(): AcademicYear {
    const years = this.getAcademicYears();
    return years.find(y => y.is_active) || years[0];
  }

  static setActiveAcademicYear(id: string): void {
    const years = this.getAcademicYears().map(y => ({
      ...y,
      is_active: y.id === id
    }));
    setStored('academic_years', years);
    this.logAudit('SET_ACTIVE_ACADEMIC_YEAR', 'ACADEMIC_YEAR', id);
  }

  // Teachers
  static getTeachers(): Teacher[] {
    const raw = getStored<Teacher[]>('teachers', initialTeachers);
    // Filter out deleted teachers (Fitri Hermawati)
    let teachers = raw.filter(t => 
      !t.full_name.toLowerCase().includes('fitri hermawati')
    );
    let changed = raw.length !== teachers.length;

    teachers.forEach(t => {
      if (t.id === 'tch-001' && t.full_name !== 'Ust. Ade Yusup, S.Pd.') {
        t.full_name = 'Ust. Ade Yusup, S.Pd.';
        changed = true;
      }
      if (t.id === 'tch-002' && t.full_name !== 'Usth. Siti Saadah, S.Pd.') {
        t.full_name = 'Usth. Siti Saadah, S.Pd.';
        t.gender = 'P';
        t.public_bio = 'Pengajar aktif bidang Fiqih Ibadah, Tahsin Al-Qur\'an dan bimbingan adab santri Takmiliyah Ula.';
        changed = true;
      }
      if (t.id === 'tch-003' || t.id === 'tch-005') {
        t.id = 'tch-003';
        t.full_name = 'Ust. Azmi M Nurjamil';
        t.gender = 'L';
        t.position = 'Wali Kelas 2 & Guru Bahasa Arab Diniyah';
        t.education = 'S1 Pendidikan Agama Islam';
        t.public_bio = 'Pengajar interaktif Bahasa Arab diniyah, Al-Qur\'an dan sirah tarikh Islam santri.';
        changed = true;
      }
    });

    if (!teachers.some(t => t.full_name.includes('Azmi'))) {
      teachers.push(initialTeachers[2]);
      changed = true;
    }

    if (changed) {
      setStored('teachers', teachers);
    }
    return teachers;
  }

  static getTeacherById(id: string): Teacher | undefined {
    return this.getTeachers().find(t => t.id === id);
  }

  static saveTeacher(teacher: Teacher): void {
    const teachers = this.getTeachers();
    const existingIndex = teachers.findIndex(t => t.id === teacher.id);
    if (existingIndex >= 0) {
      teachers[existingIndex] = { ...teacher, updated_at: new Date().toISOString() };
      this.logAudit('UPDATE_TEACHER', 'TEACHER', teacher.id, { name: teacher.full_name });
    } else {
      teachers.push({ ...teacher, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
      this.logAudit('CREATE_TEACHER', 'TEACHER', teacher.id, { name: teacher.full_name });
    }
    setStored('teachers', teachers);
  }

  static deleteTeacher(id: string): void {
    const teachers = this.getTeachers().filter(t => t.id !== id);
    setStored('teachers', teachers);
    this.logAudit('DELETE_TEACHER', 'TEACHER', id);
  }

  // Classes
  static getClasses(): SchoolClass[] {
    const classes = getStored<SchoolClass[]>('classes', initialClasses);
    let changed = false;
    classes.forEach(c => {
      if (c.id === 'cls-001' && (c.homeroom_teacher_name !== 'Usth. Siti Saadah, S.Pd.' || c.homeroom_teacher_id !== 'tch-002')) {
        c.homeroom_teacher_name = 'Usth. Siti Saadah, S.Pd.';
        c.homeroom_teacher_id = 'tch-002';
        changed = true;
      }
      if (c.id === 'cls-002' && (c.homeroom_teacher_name !== 'Ust. Azmi M Nurjamil' || c.homeroom_teacher_id !== 'tch-003')) {
        c.homeroom_teacher_name = 'Ust. Azmi M Nurjamil';
        c.homeroom_teacher_id = 'tch-003';
        changed = true;
      }
      if (c.id === 'cls-003' && (c.homeroom_teacher_name !== 'Ust. Azmi M Nurjamil' || c.homeroom_teacher_id !== 'tch-003')) {
        c.homeroom_teacher_name = 'Ust. Azmi M Nurjamil';
        c.homeroom_teacher_id = 'tch-003';
        changed = true;
      }
      if (c.id === 'cls-004' && (c.homeroom_teacher_name !== 'Ust. Ade Yusup, S.Pd.' || c.homeroom_teacher_id !== 'tch-001')) {
        c.homeroom_teacher_name = 'Ust. Ade Yusup, S.Pd.';
        c.homeroom_teacher_id = 'tch-001';
        changed = true;
      }
    });
    if (changed) {
      setStored('classes', classes);
    }
    return classes;
  }

  static saveClass(schoolClass: SchoolClass): void {
    const classes = this.getClasses();
    const existingIndex = classes.findIndex(c => c.id === schoolClass.id);
    if (existingIndex >= 0) {
      classes[existingIndex] = schoolClass;
      this.logAudit('UPDATE_CLASS', 'CLASS', schoolClass.id, { name: schoolClass.name });
    } else {
      classes.push(schoolClass);
      this.logAudit('CREATE_CLASS', 'CLASS', schoolClass.id, { name: schoolClass.name });
    }
    setStored('classes', classes);
  }

  // Subjects
  static getSubjects(): Subject[] {
    return getStored<Subject[]>('subjects', initialSubjects);
  }

  // Teaching Assignments
  static getTeachingAssignments(): TeachingAssignment[] {
    return getStored<TeachingAssignment[]>('teaching_assignments', initialTeachingAssignments);
  }

  // Students
  static getStudents(): Student[] {
    return getStored<Student[]>('students', initialStudents);
  }

  static getStudentById(id: string): Student | undefined {
    return this.getStudents().find(s => s.id === id);
  }

  static saveStudent(student: Student): void {
    const students = this.getStudents();
    const existingIndex = students.findIndex(s => s.id === student.id);
    if (existingIndex >= 0) {
      students[existingIndex] = { ...student, updated_at: new Date().toISOString() };
      this.logAudit('UPDATE_STUDENT', 'STUDENT', student.id, { name: student.full_name, nis: student.student_number });
    } else {
      students.push({ ...student, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
      this.logAudit('CREATE_STUDENT', 'STUDENT', student.id, { name: student.full_name, nis: student.student_number });
    }
    setStored('students', students);
  }

  static archiveStudent(id: string): void {
    const students = this.getStudents().map(s => {
      if (s.id === id) {
        return { ...s, current_status: 'archived' as const, updated_at: new Date().toISOString() };
      }
      return s;
    });
    setStored('students', students);
    this.logAudit('ARCHIVE_STUDENT', 'STUDENT', id);
  }

  static importStudentsCSV(parsedData: Array<{ nis: string; nisn?: string; nama: string; gender: string; kelas: string; wali: string; kontak: string }>): { success: number; errors: string[] } {
    const existingStudents = this.getStudents();
    const classes = this.getClasses();
    const errors: string[] = [];
    let successCount = 0;

    parsedData.forEach((row, index) => {
      if (!row.nis || !row.nama) {
        errors.push(`Baris ${index + 1}: NIS dan Nama Lengkap wajib diisi.`);
        return;
      }
      if (existingStudents.some(s => s.student_number === row.nis)) {
        errors.push(`Baris ${index + 1}: NIS ${row.nis} sudah terdaftar.`);
        return;
      }
      const targetClass = classes.find(c => c.name.toLowerCase().includes(row.kelas.toLowerCase())) || classes[0];

      const newStudent: Student = {
        id: 'std-' + Date.now() + '-' + index,
        student_number: row.nis,
        nisn: row.nisn || '',
        full_name: row.nama,
        gender: (row.gender?.toUpperCase() === 'P' ? 'P' : 'L') as 'L' | 'P',
        birth_place: 'Bandung',
        birth_date: '2018-01-01',
        religion: 'Islam',
        address: 'Bandung',
        enrollment_date: new Date().toISOString().split('T')[0],
        entry_academic_year_id: 'ay-2026',
        current_status: 'active',
        class_id: targetClass.id,
        class_name: targetClass.name,
        guardian_name: row.wali || 'Wali Santri',
        guardian_phone: row.kontak || '-',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      existingStudents.push(newStudent);
      successCount++;
    });

    if (successCount > 0) {
      setStored('students', existingStudents);
      this.logAudit('IMPORT_STUDENTS_CSV', 'STUDENT', 'bulk', { count: successCount });
    }

    return { success: successCount, errors };
  }

  // Fees & Invoices
  static getFeeTypes(): FeeType[] {
    return getStored<FeeType[]>('fee_types', initialFeeTypes);
  }

  static getInvoices(): StudentInvoice[] {
    return getStored<StudentInvoice[]>('invoices', initialInvoices);
  }

  static getInvoiceById(id: string): StudentInvoice | undefined {
    return this.getInvoices().find(inv => inv.id === id);
  }

  static createBatchInvoices(data: {
    fee_type_id: string;
    billing_period: string;
    due_date: string;
    amount: number;
    class_id?: string;
  }): { created: number; skippedDuplicates: number } {
    const feeTypes = this.getFeeTypes();
    const fee = feeTypes.find(f => f.id === data.fee_type_id);
    const students = this.getStudents().filter(s => s.current_status === 'active' && (!data.class_id || s.class_id === data.class_id));
    const invoices = this.getInvoices();
    const activeYear = this.getActiveAcademicYear();

    let created = 0;
    let skippedDuplicates = 0;

    students.forEach((student, index) => {
      // Check duplicate invoice constraint (student_id + fee_type_id + billing_period)
      const isDuplicate = invoices.some(
        inv => inv.student_id === student.id && inv.fee_type_id === data.fee_type_id && inv.billing_period === data.billing_period
      );

      if (isDuplicate) {
        skippedDuplicates++;
        return;
      }

      const invNumber = `INV-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(invoices.length + created + 1).padStart(4, '0')}`;
      const newInvoice: StudentInvoice = {
        id: 'inv-' + Date.now() + '-' + index,
        invoice_number: invNumber,
        student_id: student.id,
        student_name: student.full_name,
        class_name: student.class_name,
        fee_type_id: data.fee_type_id,
        fee_type_name: fee?.name || 'Biaya Diniyah',
        academic_year_id: activeYear.id,
        billing_period: data.billing_period,
        due_date: data.due_date,
        amount: data.amount,
        discount_amount: 0,
        paid_amount: 0,
        status: 'unpaid',
        notes: `Tagihan ${fee?.name} Periode ${data.billing_period}`,
        created_at: new Date().toISOString()
      };
      invoices.push(newInvoice);
      created++;
    });

    if (created > 0) {
      setStored('invoices', invoices);
      this.logAudit('CREATE_BATCH_INVOICES', 'INVOICE', 'batch', {
        created_count: created,
        period: data.billing_period,
        amount: data.amount
      });
    }

    return { created, skippedDuplicates };
  }

  // Payments & Atomic Transactions
  static getPayments(): Payment[] {
    return getStored<Payment[]>('payments', initialPayments);
  }

  static recordPayment(data: {
    invoice_id: string;
    amount: number;
    payment_method: 'cash' | 'bank_transfer' | 'other';
    notes?: string;
  }): { success: boolean; payment?: Payment; error?: string } {
    const invoices = this.getInvoices();
    const invIndex = invoices.findIndex(i => i.id === data.invoice_id);

    if (invIndex === -1) {
      return { success: false, error: 'Tagihan tidak ditemukan.' };
    }

    const invoice = invoices[invIndex];
    const netBill = invoice.amount - invoice.discount_amount;
    const remainingBalance = netBill - invoice.paid_amount;

    if (data.amount <= 0) {
      return { success: false, error: 'Nominal pembayaran harus lebih besar dari 0.' };
    }

    if (data.amount > remainingBalance) {
      return {
        success: false,
        error: `Nominal melebihi sisa tagihan (${formatRupiah(remainingBalance)}). Kelebihan bayar tidak diizinkan tanpa mekanisme saldo.`
      };
    }

    const payments = this.getPayments();
    const now = new Date();
    const receiptNumber = `KWT-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(payments.length + 1).padStart(4, '0')}`;
    const currentUser = this.getCurrentUser();

    const newPayment: Payment = {
      id: 'pay-' + Date.now(),
      receipt_number: receiptNumber,
      invoice_id: invoice.id,
      invoice_number: invoice.invoice_number,
      student_id: invoice.student_id,
      student_name: invoice.student_name,
      fee_type_name: invoice.fee_type_name,
      billing_period: invoice.billing_period,
      amount: data.amount,
      payment_date: now.toISOString().split('T')[0],
      payment_method: data.payment_method,
      received_by_name: currentUser.full_name,
      notes: data.notes || '',
      status: 'posted',
      created_at: now.toISOString()
    };

    // Update invoice atomically
    const newPaidAmount = invoice.paid_amount + data.amount;
    invoice.paid_amount = newPaidAmount;
    if (newPaidAmount >= netBill) {
      invoice.status = 'paid';
    } else {
      invoice.status = 'partial';
    }
    invoices[invIndex] = invoice;

    payments.unshift(newPayment);
    setStored('payments', payments);
    setStored('invoices', invoices);

    this.logAudit('RECORD_PAYMENT', 'PAYMENT', receiptNumber, {
      amount: data.amount,
      student: invoice.student_name,
      invoice_number: invoice.invoice_number
    });

    return { success: true, payment: newPayment };
  }

  static reversePayment(paymentId: string, reason: string): { success: boolean; error?: string } {
    if (!reason || reason.trim().length < 5) {
      return { success: false, error: 'Alasan pembatalan/reversal wajib diisi minimal 5 karakter.' };
    }

    const payments = this.getPayments();
    const payIndex = payments.findIndex(p => p.id === paymentId);

    if (payIndex === -1) {
      return { success: false, error: 'Pembayaran tidak ditemukan.' };
    }

    const payment = payments[payIndex];
    if (payment.status === 'reversed') {
      return { success: false, error: 'Pembayaran ini sudah pernah dibatalkan sebelumnya.' };
    }

    const invoices = this.getInvoices();
    const invIndex = invoices.findIndex(i => i.id === payment.invoice_id);

    if (invIndex === -1) {
      return { success: false, error: 'Tagihan terkait tidak ditemukan.' };
    }

    const currentUser = this.getCurrentUser();
    const now = new Date().toISOString();

    // Reversal payment object
    payment.status = 'reversed';
    payment.reversed_at = now;
    payment.reversed_by = currentUser.full_name;
    payment.reversal_reason = reason;
    payments[payIndex] = payment;

    // Recalculate invoice
    const invoice = invoices[invIndex];
    invoice.paid_amount = Math.max(0, invoice.paid_amount - payment.amount);
    const netBill = invoice.amount - invoice.discount_amount;

    if (invoice.paid_amount <= 0) {
      invoice.status = 'unpaid';
    } else if (invoice.paid_amount < netBill) {
      invoice.status = 'partial';
    } else {
      invoice.status = 'paid';
    }
    invoices[invIndex] = invoice;

    setStored('payments', payments);
    setStored('invoices', invoices);

    this.logAudit('REVERSE_PAYMENT', 'PAYMENT', payment.receipt_number, {
      reversal_reason: reason,
      reversed_by: currentUser.full_name,
      amount: payment.amount
    });

    return { success: true };
  }

  // Attendance
  static getAttendanceRecords(): AttendanceRecord[] {
    return getStored<AttendanceRecord[]>('attendance_records', initialAttendanceRecords);
  }

  static recordAttendanceSession(data: {
    class_id: string;
    date: string;
    session_name: string;
    records: Array<{ student_id: string; student_name: string; status: 'present' | 'sick' | 'excused' | 'absent'; note?: string }>;
  }): { success: boolean; savedCount: number } {
    const existing = this.getAttendanceRecords();
    const sessionId = `sess-${data.class_id}-${data.date}`;
    const currentUser = this.getCurrentUser();

    // Remove any previous records for same session to prevent duplication
    const filtered = existing.filter(r => r.session_id !== sessionId);

    const newRecords: AttendanceRecord[] = data.records.map((r, i) => ({
      id: 'att-' + Date.now() + '-' + i,
      session_id: sessionId,
      student_id: r.student_id,
      student_name: r.student_name,
      status: r.status,
      note: r.note,
      recorded_by: currentUser.full_name,
      created_at: new Date().toISOString()
    }));

    setStored('attendance_records', [...newRecords, ...filtered]);
    this.logAudit('RECORD_ATTENDANCE', 'ATTENDANCE', sessionId, {
      class_id: data.class_id,
      date: data.date,
      count: newRecords.length
    });

    return { success: true, savedCount: newRecords.length };
  }

  // Report Cards
  static getReportCards(): ReportCard[] {
    return getStored<ReportCard[]>('report_cards', initialReportCards);
  }

  static getReportCardById(id: string): ReportCard | undefined {
    return this.getReportCards().find(rc => rc.id === id);
  }

  static updateReportCardStatus(
    id: string,
    status: 'draft' | 'pending_review' | 'approved' | 'published',
    comment?: string
  ): { success: boolean } {
    const cards = this.getReportCards();
    const cardIndex = cards.findIndex(c => c.id === id);
    if (cardIndex === -1) return { success: false };

    const card = cards[cardIndex];
    const currentUser = this.getCurrentUser();
    card.status = status;
    if (comment) card.general_comment = comment;

    if (status === 'approved') {
      card.approved_at = new Date().toISOString();
      card.reviewed_by = currentUser.full_name;
    } else if (status === 'published') {
      card.published_at = new Date().toISOString();
    }

    cards[cardIndex] = card;
    setStored('report_cards', cards);
    this.logAudit('UPDATE_REPORT_CARD_STATUS', 'REPORT_CARD', id, {
      student_name: card.student_name,
      new_status: status
    });

    return { success: true };
  }

  // Announcements & Gallery
  static getAnnouncements(): Announcement[] {
    return getStored<Announcement[]>('announcements', initialAnnouncements);
  }

  static saveAnnouncement(ann: Announcement): void {
    const anns = this.getAnnouncements();
    const index = anns.findIndex(a => a.id === ann.id);
    if (index >= 0) {
      anns[index] = ann;
    } else {
      anns.unshift(ann);
    }
    setStored('announcements', anns);
    this.logAudit('SAVE_ANNOUNCEMENT', 'ANNOUNCEMENT', ann.id, { title: ann.title });
  }

  static getGalleryAlbums(): GalleryAlbum[] {
    return getStored<GalleryAlbum[]>('gallery_albums', initialGalleryAlbums);
  }
}
