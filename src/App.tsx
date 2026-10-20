/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/public/HomePage';
import { ProfilePage } from './pages/public/ProfilePage';
import { HistoryPage } from './pages/public/HistoryPage';
import { VisionPage } from './pages/public/VisionPage';
import { TeachersPage } from './pages/public/TeachersPage';
import { TeacherDetailPage } from './pages/public/TeacherDetailPage';
import { GalleryPage } from './pages/public/GalleryPage';
import { NewsPage } from './pages/public/NewsPage';
import { NewsDetailPage } from './pages/public/NewsDetailPage';
import { RegistrationPage } from './pages/public/RegistrationPage';
import { ContactPage } from './pages/public/ContactPage';
import { PrivacyPolicyPage } from './pages/public/PrivacyPolicyPage';
import { LoginPage } from './pages/auth/LoginPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { AdminOverviewPage } from './pages/dashboard/AdminOverviewPage';
import { StudentsPage } from './pages/dashboard/StudentsPage';
import { StudentDetailPage } from './pages/dashboard/StudentDetailPage';
import { AttendancePage } from './pages/dashboard/AttendancePage';
import { BillingPage } from './pages/dashboard/BillingPage';
import { AcademicsPage } from './pages/dashboard/AcademicsPage';
import { ReportCardsPage } from './pages/dashboard/ReportCardsPage';
import { TeachersAdminPage } from './pages/dashboard/TeachersAdminPage';
import { ClassesAdminPage } from './pages/dashboard/ClassesAdminPage';
import { ContentAdminPage } from './pages/dashboard/ContentAdminPage';
import { AuditLogsPage } from './pages/dashboard/AuditLogsPage';
import { ReportsPage } from './pages/dashboard/ReportsPage';
import { SettingsPage } from './pages/dashboard/SettingsPage';
import { ParentPortalPage } from './pages/portal/ParentPortalPage';
import { UserRole } from './types';
import { AppStorage } from './lib/storage';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (role: UserRole) => {
    if (role === 'guardian') {
      navigate('/portal');
    } else {
      navigate('/app');
    }
  };

  // Route matching
  const renderContent = () => {
    // 1. Auth routes (No standard navbar/footer)
    if (currentPath === '/login') {
      return <LoginPage onNavigate={navigate} onLoginSuccess={handleLoginSuccess} />;
    }
    if (currentPath === '/lupa-password') {
      return <ForgotPasswordPage onNavigate={navigate} />;
    }

    // 2. Guardian Portal
    if (currentPath.startsWith('/portal')) {
      return <ParentPortalPage onNavigate={navigate} />;
    }

    // 3. Admin & Staff Dashboard routes
    if (currentPath.startsWith('/app')) {
      let page = <AdminOverviewPage onNavigate={navigate} />;

      if (currentPath === '/app/students') {
        page = <StudentsPage onNavigate={navigate} />;
      } else if (currentPath.startsWith('/app/students/')) {
        const studentId = currentPath.replace('/app/students/', '');
        page = <StudentDetailPage studentId={studentId} onNavigate={navigate} />;
      } else if (currentPath === '/app/attendance') {
        page = <AttendancePage onNavigate={navigate} />;
      } else if (currentPath === '/app/billing') {
        page = <BillingPage onNavigate={navigate} />;
      } else if (currentPath === '/app/academics') {
        page = <AcademicsPage onNavigate={navigate} />;
      } else if (currentPath === '/app/report-cards') {
        page = <ReportCardsPage onNavigate={navigate} />;
      } else if (currentPath === '/app/teachers') {
        page = <TeachersAdminPage onNavigate={navigate} />;
      } else if (currentPath === '/app/classes') {
        page = <ClassesAdminPage onNavigate={navigate} />;
      } else if (currentPath === '/app/content') {
        page = <ContentAdminPage onNavigate={navigate} />;
      } else if (currentPath === '/app/audit-logs') {
        page = <AuditLogsPage onNavigate={navigate} />;
      } else if (currentPath === '/app/reports') {
        page = <ReportsPage onNavigate={navigate} />;
      } else if (currentPath === '/app/settings') {
        page = <SettingsPage onNavigate={navigate} />;
      }

      return (
        <DashboardLayout currentPath={currentPath} onNavigate={navigate}>
          {page}
        </DashboardLayout>
      );
    }

    // 4. Public Pages (With Navbar and Footer)
    let publicContent = <HomePage onNavigate={navigate} />;

    if (currentPath === '/profil') {
      publicContent = <ProfilePage onNavigate={navigate} />;
    } else if (currentPath === '/sejarah') {
      publicContent = <HistoryPage onNavigate={navigate} />;
    } else if (currentPath === '/visi-misi') {
      publicContent = <VisionPage onNavigate={navigate} />;
    } else if (currentPath === '/guru') {
      publicContent = <TeachersPage onNavigate={navigate} />;
    } else if (currentPath.startsWith('/guru/')) {
      const teacherId = currentPath.replace('/guru/', '');
      publicContent = <TeacherDetailPage teacherId={teacherId} onNavigate={navigate} />;
    } else if (currentPath === '/galeri') {
      publicContent = <GalleryPage onNavigate={navigate} />;
    } else if (currentPath === '/berita') {
      publicContent = <NewsPage onNavigate={navigate} />;
    } else if (currentPath.startsWith('/berita/')) {
      const slug = currentPath.replace('/berita/', '');
      publicContent = <NewsDetailPage slug={slug} onNavigate={navigate} />;
    } else if (currentPath === '/pendaftaran') {
      publicContent = <RegistrationPage onNavigate={navigate} />;
    } else if (currentPath === '/kontak') {
      publicContent = <ContactPage onNavigate={navigate} />;
    } else if (currentPath === '/kebijakan-privasi') {
      publicContent = <PrivacyPolicyPage onNavigate={navigate} />;
    }

    return (
      <div className="min-h-screen flex flex-col justify-between">
        <Navbar currentPath={currentPath} onNavigate={navigate} />
        <main className="flex-1">{publicContent}</main>
        <Footer onNavigate={navigate} />
      </div>
    );
  };

  return <>{renderContent()}</>;
}
