-- ========================================================================
-- MDTU NURUL HIDAYAH - COMPLETE POSTGRESQL & SUPABASE MIGRATION SCRIPT
-- Madrasah Diniyah Takmiliyah Ula
-- ========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. INSTITUTIONS TABLE
CREATE TABLE IF NOT EXISTS public.institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    institution_type VARCHAR(100) DEFAULT 'Madrasah Diniyah Takmiliyah Ula (MDTU)',
    logo_path TEXT,
    address TEXT NOT NULL,
    village VARCHAR(100),
    district VARCHAR(100),
    city VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(20),
    phone VARCHAR(50),
    email VARCHAR(100),
    website VARCHAR(150),
    founded_year INT,
    institution_number VARCHAR(100), -- NSM / Nomor Statistik Madrasah
    operational_license VARCHAR(100), -- Nomor Izin Operasional Kemenag
    principal_name VARCHAR(255) NOT NULL,
    foundation_name VARCHAR(255),
    vision TEXT,
    mission TEXT,
    history TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    avatar_path TEXT,
    account_status VARCHAR(50) DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. USER ROLES TABLE
CREATE TYPE user_role_enum AS ENUM ('super_admin', 'operator', 'principal', 'teacher', 'treasurer', 'guardian');

CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role user_role_enum NOT NULL,
    assigned_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_user_role UNIQUE (user_id, role)
);

-- 4. ACADEMIC YEARS TABLE
CREATE TABLE IF NOT EXISTS public.academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL, -- e.g. '2026/2027'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TEACHERS TABLE
CREATE TABLE IF NOT EXISTS public.teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    teacher_number VARCHAR(100) UNIQUE NOT NULL, -- NIP / NPK
    full_name VARCHAR(255) NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('L', 'P')),
    birth_place VARCHAR(100),
    birth_date DATE,
    address TEXT,
    education VARCHAR(150),
    employment_status VARCHAR(100) DEFAULT 'Tetap',
    position VARCHAR(150), -- e.g. 'Guru Al-Quran & Tajwid', 'Wali Kelas'
    photo_path TEXT,
    public_bio TEXT,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CLASSES TABLE
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL, -- e.g. 'Kelas 1 Awwaliyah A'
    grade_level INT NOT NULL, -- 1, 2, 3, 4
    academic_year_id UUID NOT NULL REFERENCES public.academic_years(id),
    homeroom_teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_number VARCHAR(100) UNIQUE NOT NULL, -- NIS
    nisn VARCHAR(100),
    full_name VARCHAR(255) NOT NULL,
    nickname VARCHAR(100),
    gender VARCHAR(10) CHECK (gender IN ('L', 'P')),
    birth_place VARCHAR(100),
    birth_date DATE,
    religion VARCHAR(50) DEFAULT 'Islam',
    address TEXT,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    entry_academic_year_id UUID REFERENCES public.academic_years(id),
    current_status VARCHAR(50) DEFAULT 'active' CHECK (current_status IN ('active', 'graduated', 'moved', 'archived')),
    photo_path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    archived_at TIMESTAMPTZ
);

-- 8. GUARDIANS TABLE
CREATE TABLE IF NOT EXISTS public.guardians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    relationship_type VARCHAR(50) NOT NULL, -- 'Ayah', 'Ibu', 'Wali'
    phone VARCHAR(50) NOT NULL,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. STUDENT GUARDIANS (Junction Table)
CREATE TABLE IF NOT EXISTS public.student_guardians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    guardian_id UUID NOT NULL REFERENCES public.guardians(id) ON DELETE CASCADE,
    relationship_type VARCHAR(50) NOT NULL,
    is_primary BOOLEAN DEFAULT true,
    can_view_academic BOOLEAN DEFAULT true,
    can_view_billing BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_student_guardian UNIQUE (student_id, guardian_id)
);

-- 10. CLASS ENROLLMENTS
CREATE TABLE IF NOT EXISTS public.class_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES public.academic_years(id),
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    enrollment_status VARCHAR(50) DEFAULT 'active' CHECK (enrollment_status IN ('active', 'completed', 'transferred', 'withdrawn')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_student_class_year UNIQUE (student_id, class_id, academic_year_id)
);

-- 11. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL, -- e.g. 'Fiqih Ibadah', 'Aqidah Akhlak'
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'FQH-01'
    description TEXT,
    is_active BOOLEAN DEFAULT true
);

-- 12. TEACHING ASSIGNMENTS
CREATE TABLE IF NOT EXISTS public.teaching_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES public.academic_years(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_teacher_class_subject UNIQUE (teacher_id, class_id, subject_id, academic_year_id)
);

-- 13. ATTENDANCE SESSIONS
CREATE TABLE IF NOT EXISTS public.attendance_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    session_name VARCHAR(100) NOT NULL DEFAULT 'Sesi Utama',
    recorded_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_attendance_session UNIQUE (class_id, attendance_date, session_name)
);

-- 14. ATTENDANCE RECORDS
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.attendance_sessions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'sick', 'excused', 'absent')),
    note TEXT,
    recorded_by UUID REFERENCES public.profiles(id),
    updated_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_session_student UNIQUE (session_id, student_id)
);

-- 15. FEE TYPES TABLE
CREATE TABLE IF NOT EXISTS public.fee_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL, -- e.g. 'SPP Bulanan', 'Uang Seragam & Kitab'
    description TEXT,
    default_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    is_recurring BOOLEAN DEFAULT true, -- true = bulanan
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. STUDENT INVOICES TABLE
CREATE TABLE IF NOT EXISTS public.student_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE RESTRICT,
    fee_type_id UUID NOT NULL REFERENCES public.fee_types(id),
    academic_year_id UUID NOT NULL REFERENCES public.academic_years(id),
    billing_period VARCHAR(50) NOT NULL, -- e.g. '2026-10' or '2026/Ganjil'
    due_date DATE NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
    discount_amount NUMERIC(12, 2) DEFAULT 0 CHECK (discount_amount >= 0),
    status VARCHAR(20) DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'partial', 'paid', 'waived')),
    notes TEXT,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_student_invoice_period UNIQUE (student_id, fee_type_id, billing_period)
);

-- 17. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    receipt_number VARCHAR(100) UNIQUE NOT NULL,
    invoice_id UUID NOT NULL REFERENCES public.student_invoices(id) ON DELETE RESTRICT,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method VARCHAR(50) DEFAULT 'cash' CHECK (payment_method IN ('cash', 'bank_transfer', 'other')),
    received_by UUID REFERENCES public.profiles(id),
    notes TEXT,
    status VARCHAR(20) DEFAULT 'posted' CHECK (status IN ('posted', 'reversed')),
    reversed_at TIMESTAMPTZ,
    reversed_by UUID REFERENCES public.profiles(id),
    reversal_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. SUBJECTS GRADES CONFIG
CREATE TABLE IF NOT EXISTS public.subjects_grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES public.academic_years(id),
    semester VARCHAR(20) NOT NULL CHECK (semester IN ('Ganjil', 'Genap')),
    teacher_id UUID NOT NULL REFERENCES public.teachers(id),
    assessment_config JSONB DEFAULT '{"assignment_weight": 0.3, "practice_weight": 0.3, "exam_weight": 0.4}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_subject_class_semester UNIQUE (subject_id, class_id, academic_year_id, semester)
);

-- 19. STUDENT GRADES
CREATE TABLE IF NOT EXISTS public.student_grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    subjects_grades_id UUID NOT NULL REFERENCES public.subjects_grades(id) ON DELETE CASCADE,
    assignment_score NUMERIC(5, 2) CHECK (assignment_score >= 0 AND assignment_score <= 100),
    practice_score NUMERIC(5, 2) CHECK (practice_score >= 0 AND practice_score <= 100),
    exam_score NUMERIC(5, 2) CHECK (exam_score >= 0 AND exam_score <= 100),
    final_score NUMERIC(5, 2) CHECK (final_score >= 0 AND final_score <= 100),
    predicate VARCHAR(5) CHECK (predicate IN ('A', 'B', 'C', 'D')),
    description TEXT,
    entered_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_student_subject_grade UNIQUE (student_id, subjects_grades_id)
);

-- 20. REPORT CARDS
CREATE TABLE IF NOT EXISTS public.report_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES public.academic_years(id),
    semester VARCHAR(20) NOT NULL CHECK (semester IN ('Ganjil', 'Genap')),
    attendance_summary JSONB DEFAULT '{"present": 0, "sick": 0, "excused": 0, "absent": 0}'::jsonb,
    general_comment TEXT,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'approved', 'published')),
    prepared_by UUID REFERENCES public.profiles(id),
    reviewed_by UUID REFERENCES public.profiles(id),
    approved_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_student_report_semester UNIQUE (student_id, academic_year_id, semester)
);

-- 21. STUDENT DOCUMENTS (Private Storage References)
CREATE TABLE IF NOT EXISTS public.student_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL, -- 'Akte Kelahiran', 'Kartu Keluarga', 'Ijazah RA/TK'
    document_name VARCHAR(255) NOT NULL,
    storage_path TEXT NOT NULL,
    mime_type VARCHAR(100),
    file_size BIGINT,
    uploaded_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. GALLERY ALBUMS
CREATE TABLE IF NOT EXISTS public.gallery_albums (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) DEFAULT 'Kegiatan Santri',
    event_date DATE,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. GALLERY ITEMS
CREATE TABLE IF NOT EXISTS public.gallery_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    album_id UUID NOT NULL REFERENCES public.gallery_albums(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    caption TEXT,
    alt_text TEXT,
    sort_order INT DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    consent_confirmed BOOLEAN DEFAULT true,
    uploaded_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 24. ANNOUNCEMENTS / NEWS
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    cover_image_path TEXT,
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 25. AUDIT LOGS (Immutable Security Records)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_user_id UUID REFERENCES public.profiles(id),
    action VARCHAR(100) NOT NULL, -- e.g. 'PAYMENT_RECORDED', 'PAYMENT_REVERSED', 'ROLE_CHANGED'
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    safe_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================
-- SECURITY HELPER FUNCTIONS & ROW LEVEL SECURITY (RLS)
-- ========================================================================

-- Helper: Check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(req_user_id UUID, req_role user_role_enum)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = req_user_id AND role = req_role
    );
$$;

-- Helper: Check if current authenticated user has role
CREATE OR REPLACE FUNCTION public.current_user_has_role(req_role user_role_enum)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT public.has_role(auth.uid(), req_role);
$$;

-- Helper: Check if current authenticated user is guardian of student
CREATE OR REPLACE FUNCTION public.is_guardian_of_student(req_student_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM public.student_guardians sg
        JOIN public.guardians g ON g.id = sg.guardian_id
        WHERE sg.student_id = req_student_id
          AND g.profile_id = auth.uid()
    );
$$;

-- Enable RLS on all internal tables
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teaching_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES
CREATE POLICY "Public can view institution profile" ON public.institutions FOR SELECT USING (true);
CREATE POLICY "Public can view public teachers" ON public.teachers FOR SELECT USING (is_public = true);
CREATE POLICY "Public can view published announcements" ON public.announcements FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view published gallery albums" ON public.gallery_albums FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published gallery items" ON public.gallery_items FOR SELECT USING (is_published = true AND consent_confirmed = true);

-- STAFF / ADMIN POLICIES
CREATE POLICY "Staff view profiles" ON public.profiles FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin manage all roles" ON public.user_roles FOR ALL USING (public.current_user_has_role('super_admin'));
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Staff view students" ON public.students FOR SELECT USING (
    public.current_user_has_role('super_admin') OR 
    public.current_user_has_role('operator') OR 
    public.current_user_has_role('principal') OR 
    public.current_user_has_role('teacher') OR 
    public.current_user_has_role('treasurer') OR
    public.is_guardian_of_student(id)
);

CREATE POLICY "Admin & Operator manage students" ON public.students FOR ALL USING (
    public.current_user_has_role('super_admin') OR public.current_user_has_role('operator')
);

CREATE POLICY "Admin & Treasurer manage fees" ON public.fee_types FOR ALL USING (
    public.current_user_has_role('super_admin') OR public.current_user_has_role('treasurer')
);

CREATE POLICY "View student invoices" ON public.student_invoices FOR SELECT USING (
    public.current_user_has_role('super_admin') OR 
    public.current_user_has_role('treasurer') OR 
    public.current_user_has_role('principal') OR
    public.is_guardian_of_student(student_id)
);

CREATE POLICY "Treasurer manage invoices" ON public.student_invoices FOR ALL USING (
    public.current_user_has_role('super_admin') OR public.current_user_has_role('treasurer')
);

CREATE POLICY "Treasurer record payments" ON public.payments FOR INSERT WITH CHECK (
    public.current_user_has_role('super_admin') OR public.current_user_has_role('treasurer')
);

CREATE POLICY "View payments" ON public.payments FOR SELECT USING (
    public.current_user_has_role('super_admin') OR 
    public.current_user_has_role('treasurer') OR 
    public.current_user_has_role('principal') OR
    EXISTS (
        SELECT 1 FROM public.student_invoices si
        WHERE si.id = invoice_id AND public.is_guardian_of_student(si.student_id)
    )
);

CREATE POLICY "View published report cards" ON public.report_cards FOR SELECT USING (
    public.current_user_has_role('super_admin') OR 
    public.current_user_has_role('operator') OR 
    public.current_user_has_role('principal') OR 
    public.current_user_has_role('teacher') OR
    (status = 'published' AND public.is_guardian_of_student(student_id))
);

-- AUDIT LOGS (Read-only for super_admin and principal)
CREATE POLICY "Admin view audit logs" ON public.audit_logs FOR SELECT USING (
    public.current_user_has_role('super_admin') OR public.current_user_has_role('principal')
);

-- ========================================================================
-- STORAGE BUCKET CONFIGURATION NOTES:
-- 1. institution-public (Public read, staff upload)
-- 2. gallery-public (Public read, staff upload)
-- 3. student-photos-private (Staff & authenticated parent read only)
-- 4. student-documents-private (Private, strict RLS, signed URLs)
-- 5. teacher-files-private (Private, staff read only)
-- 6. report-cards-private (Private, published report signed URLs)
-- ========================================================================
