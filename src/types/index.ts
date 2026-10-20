/**
 * MDTU Nurul Hidayah - Type Definitions
 * Madrasah Diniyah Takmiliyah Ula
 */

export type UserRole = 
  | 'super_admin' 
  | 'operator' 
  | 'principal' 
  | 'teacher' 
  | 'treasurer' 
  | 'guardian';

export interface RoleAccessInfo {
  role: UserRole;
  title: string;
  category: string;
  defaultPasscode: string;
  landingPage: string;
  description: string;
  badge: string;
  allowedFeatures: string[];
}

export interface Institution {
  id: string;
  name: string;
  institution_type: string;
  logo_path?: string;
  address: string;
  village: string;
  district: string;
  city: string;
  province: string;
  postal_code: string;
  phone: string;
  email: string;
  website: string;
  founded_year: number;
  institution_number: string; // NSM
  operational_license: string; // SK Kemenag
  principal_name: string;
  foundation_name: string;
  vision: string;
  mission: string;
  history: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_path?: string;
  account_status: 'active' | 'suspended' | 'inactive';
  created_at: string;
  roles: UserRole[];
}

export interface AcademicYear {
  id: string;
  name: string; // e.g. '2026/2027'
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
}

export interface Teacher {
  id: string;
  profile_id?: string;
  teacher_number: string; // NIP/NPK
  full_name: string;
  gender: 'L' | 'P';
  birth_place: string;
  birth_date: string;
  address: string;
  education: string;
  employment_status: string;
  position: string;
  photo_path?: string;
  public_bio?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface SchoolClass {
  id: string;
  name: string;
  grade_level: number; // 1 - 4
  academic_year_id: string;
  homeroom_teacher_id?: string;
  homeroom_teacher_name?: string;
  description?: string;
  student_count?: number;
  created_at: string;
}

export interface Student {
  id: string;
  student_number: string; // NIS
  nisn?: string;
  full_name: string;
  nickname?: string;
  gender: 'L' | 'P';
  birth_place: string;
  birth_date: string;
  religion: string;
  address: string;
  enrollment_date: string;
  entry_academic_year_id?: string;
  current_status: 'active' | 'graduated' | 'moved' | 'archived';
  photo_path?: string;
  created_at: string;
  updated_at: string;
  class_id?: string;
  class_name?: string;
  guardian_name?: string;
  guardian_phone?: string;
}

export interface Guardian {
  id: string;
  profile_id?: string;
  full_name: string;
  relationship_type: string; // Ayah, Ibu, Wali
  phone: string;
  address: string;
  created_at: string;
}

export interface StudentGuardian {
  id: string;
  student_id: string;
  guardian_id: string;
  relationship_type: string;
  is_primary: boolean;
  can_view_academic: boolean;
  can_view_billing: boolean;
  created_at: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
}

export interface TeachingAssignment {
  id: string;
  teacher_id: string;
  teacher_name?: string;
  class_id: string;
  class_name?: string;
  subject_id: string;
  subject_name?: string;
  academic_year_id: string;
}

export type AttendanceStatus = 'present' | 'sick' | 'excused' | 'absent';

export interface AttendanceSession {
  id: string;
  class_id: string;
  attendance_date: string;
  session_name: string;
  recorded_by?: string;
  created_at: string;
}

export interface AttendanceRecord {
  id: string;
  session_id: string;
  student_id: string;
  student_name?: string;
  status: AttendanceStatus;
  note?: string;
  recorded_by?: string;
  updated_by?: string;
  created_at: string;
}

export interface FeeType {
  id: string;
  name: string;
  description?: string;
  default_amount: number;
  is_recurring: boolean;
  is_active: boolean;
}

export type InvoiceStatus = 'unpaid' | 'partial' | 'paid' | 'waived';

export interface StudentInvoice {
  id: string;
  invoice_number: string;
  student_id: string;
  student_name?: string;
  class_name?: string;
  fee_type_id: string;
  fee_type_name?: string;
  academic_year_id: string;
  billing_period: string; // e.g. 'Oktober 2026'
  due_date: string;
  amount: number;
  discount_amount: number;
  paid_amount: number; // calculated from valid payments
  status: InvoiceStatus;
  notes?: string;
  created_by?: string;
  created_at: string;
}

export interface Payment {
  id: string;
  receipt_number: string;
  invoice_id: string;
  invoice_number?: string;
  student_id?: string;
  student_name?: string;
  fee_type_name?: string;
  billing_period?: string;
  amount: number;
  payment_date: string;
  payment_method: 'cash' | 'bank_transfer' | 'other';
  received_by?: string;
  received_by_name?: string;
  notes?: string;
  status: 'posted' | 'reversed';
  reversed_at?: string;
  reversed_by?: string;
  reversal_reason?: string;
  created_at: string;
}

export interface SubjectGradeConfig {
  id: string;
  subject_id: string;
  subject_name?: string;
  class_id: string;
  academic_year_id: string;
  semester: 'Ganjil' | 'Genap';
  teacher_id: string;
  assessment_config: {
    assignment_weight: number;
    practice_weight: number;
    exam_weight: number;
  };
}

export interface StudentGrade {
  id: string;
  student_id: string;
  student_name?: string;
  subjects_grades_id: string;
  subject_name?: string;
  assignment_score: number;
  practice_score: number;
  exam_score: number;
  final_score: number;
  predicate: 'A' | 'B' | 'C' | 'D';
  description: string;
  entered_by?: string;
}

export type ReportCardStatus = 'draft' | 'pending_review' | 'approved' | 'published';

export interface ReportCard {
  id: string;
  student_id: string;
  student_name?: string;
  student_number?: string;
  class_id: string;
  class_name?: string;
  academic_year_id: string;
  academic_year_name?: string;
  semester: 'Ganjil' | 'Genap';
  attendance_summary: {
    present: number;
    sick: number;
    excused: number;
    absent: number;
  };
  general_comment: string;
  status: ReportCardStatus;
  grades: {
    subject_code: string;
    subject_name: string;
    kkm: number;
    final_score: number;
    predicate: string;
    description: string;
  }[];
  prepared_by?: string;
  reviewed_by?: string;
  approved_at?: string;
  published_at?: string;
  created_at: string;
}

export interface StudentDocument {
  id: string;
  student_id: string;
  document_type: string;
  document_name: string;
  storage_path: string;
  mime_type: string;
  file_size: number;
  uploaded_by?: string;
  created_at: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  description: string;
  category: string;
  event_date: string;
  is_published: boolean;
  cover_image: string;
  photos_count: number;
}

export interface Announcement {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_image_path?: string;
  status: 'draft' | 'published' | 'archived';
  category: string;
  published_at: string;
  author_name: string;
}

export interface AuditLog {
  id: string;
  actor_user_id: string;
  actor_name: string;
  action: string;
  entity_type: string;
  entity_id: string;
  safe_metadata: Record<string, any>;
  created_at: string;
}
