import React from 'react';
import { Building, ShieldCheck, MapPin, Award, BookOpen, CheckCircle } from 'lucide-react';
import { AppStorage } from '../../lib/storage';
import { HERO_BUILDING_IMG } from '../../lib/seedData';

interface ProfilePageProps {
  onNavigate: (path: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const institution = AppStorage.getInstitution();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-2">
          Identitas & Legalitas Lembaga
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Profil {institution.name}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
          Madrasah Diniyah Takmiliyah Ula resmi di bawah binaan Kementerian Agama Republik Indonesia dengan komitmen mencetak generasi santri yang berakhlak mulia dan berwawasan luas.
        </p>
      </div>

      {/* Hero Visual & Key Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-slate-200">
          <img
            src={HERO_BUILDING_IMG}
            alt="Gedung MDTU Nurul Hidayah"
            className="w-full h-80 object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Terdaftar & Berizin Operasional Kemenag</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            {institution.institution_type}
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            MDTU Nurul Hidayah berdiri untuk melengkapi dan menyempurnakan pendidikan agama bagi anak-anak usia 6 hingga 12 tahun yang pada pagi hari menempuh pendidikan di Sekolah Dasar (SD) atau Madrasah Ibtidaiyah (MI).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 block">Nomor Statistik Madrasah (NSM)</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{institution.institution_number}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 block">Surat Keputusan Izin Operasional</span>
              <span className="font-semibold text-slate-900 text-sm">{institution.operational_license}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 block">Yayasan Penyelenggara</span>
              <span className="font-semibold text-slate-900 text-sm">{institution.foundation_name}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 block">Kepala Madrasah</span>
              <span className="font-bold text-slate-900 text-sm">{institution.principal_name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Identitas Detail Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <h3 className="text-base font-bold text-slate-900">
            Tabel Rincian Administrasi & Alamat Lembaga
          </h3>
          <p className="text-xs text-slate-500">
            Data resmi tercatat pada Pangkalan Data Pendidikan Islam (EMIS/Kemenag).
          </p>
        </div>
        <div className="p-6 divide-y divide-slate-100 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 py-3">
            <span className="text-slate-500 font-medium">Nama Lembaga</span>
            <span className="md:col-span-2 font-bold text-slate-900">{institution.name}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 py-3">
            <span className="text-slate-500 font-medium">Jenjang Satuan</span>
            <span className="md:col-span-2 text-slate-800">{institution.institution_type}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 py-3">
            <span className="text-slate-500 font-medium">Tahun Berdiri</span>
            <span className="md:col-span-2 text-slate-800 font-mono">{institution.founded_year}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 py-3">
            <span className="text-slate-500 font-medium">Alamat Lengkap</span>
            <span className="md:col-span-2 text-slate-800">{institution.address}, {institution.city}, {institution.province} - Kode Pos {institution.postal_code}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 py-3">
            <span className="text-slate-500 font-medium">Kontak & Surel</span>
            <span className="md:col-span-2 text-slate-800 font-mono">{institution.phone} · {institution.email}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 py-3">
            <span className="text-slate-500 font-medium">Jam Pelaksanaan Belajar</span>
            <span className="md:col-span-2 text-slate-800">Senin s.d. Minggu pukul 13.00 - 15.00 WIB (KBM Diniyah)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
