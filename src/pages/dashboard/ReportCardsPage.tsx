import React, { useState } from 'react';
import { 
  Award, 
  Search, 
  CheckCircle, 
  Clock, 
  Send, 
  FileCheck, 
  Printer, 
  Eye, 
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { AppStorage, formatTanggal } from '../../lib/storage';
import { PrintReportCardModal } from '../../components/common/PrintReportCardModal';
import { ReportCard } from '../../types';

interface ReportCardsPageProps {
  onNavigate: (path: string) => void;
}

export const ReportCardsPage: React.FC<ReportCardsPageProps> = ({ onNavigate }) => {
  const [reportCards, setReportCards] = useState<ReportCard[]>(AppStorage.getReportCards());
  const [selectedReportCard, setSelectedReportCard] = useState<ReportCard | null>(null);
  const currentUser = AppStorage.getCurrentUser();
  const activeRole = currentUser.roles[0] || 'super_admin';

  const reloadCards = () => {
    setReportCards(AppStorage.getReportCards());
  };

  const handleUpdateStatus = (id: string, newStatus: 'pending_review' | 'approved' | 'published') => {
    AppStorage.updateReportCardStatus(id, newStatus);
    reloadCards();
  };

  const getStatusBadge = (status: ReportCard['status']) => {
    switch (status) {
      case 'draft':
        return <span className="px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 font-semibold uppercase text-[10px]">Draft Guru</span>;
      case 'pending_review':
        return <span className="px-2 py-0.5 rounded-sm bg-amber-100 text-amber-800 font-semibold uppercase text-[10px]">Menunggu Review</span>;
      case 'approved':
        return <span className="px-2 py-0.5 rounded-sm bg-blue-100 text-blue-800 font-semibold uppercase text-[10px]">Disetujui Kepala MDTU</span>;
      case 'published':
        return <span className="px-2 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px]">Diterbitkan (Online)</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Penerbitan Buku Rapor Santri
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Alur verifikasi bertingkat: Draft Guru → Review Kepala MDTU → Persetujuan Sah → Penerbitan Portal Wali.
          </p>
        </div>
      </div>

      {/* Workflow Explanation Banner */}
      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block text-sm">Alur Resmi Persetujuan Rapor MDTU</span>
          <p className="text-slate-600 leading-relaxed mt-0.5">
            Wali santri hanya dapat melihat rapor digital yang telah berstatus <strong>PUBLISHED</strong>. Guru pengampu mengajukan penilaian, Kepala Madrasah memverifikasi kelengkapan, dan menerbitkan secara digital.
          </p>
        </div>
      </div>

      {/* Report Cards Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Nama Santri</th>
                <th className="py-3 px-4">NIS</th>
                <th className="py-3 px-4">Rombel Kelas</th>
                <th className="py-3 px-4">Semester</th>
                <th className="py-3 px-4">Wali Kelas Penginput</th>
                <th className="py-3 px-4">Status Alur</th>
                <th className="py-3 px-4 text-center">Tindakan Alur & Cetak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reportCards.map((rc) => (
                <tr key={rc.id} className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{rc.student_name}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">{rc.student_number}</td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">{rc.class_name}</td>
                  <td className="py-3.5 px-4">{rc.semester} ({rc.academic_year_name})</td>
                  <td className="py-3.5 px-4 text-slate-500">{rc.prepared_by || 'Wali Kelas'}</td>
                  <td className="py-3.5 px-4">
                    {getStatusBadge(rc.status)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => setSelectedReportCard(rc)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded text-[11px] flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Pratinjau Rapor</span>
                      </button>

                      {/* Role Workflow Actions */}
                      {rc.status === 'draft' && (
                        <button
                          onClick={() => handleUpdateStatus(rc.id, 'pending_review')}
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded text-[11px] flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>Ajukan Review</span>
                        </button>
                      )}

                      {rc.status === 'pending_review' && (activeRole === 'principal' || activeRole === 'super_admin') && (
                        <button
                          onClick={() => handleUpdateStatus(rc.id, 'approved')}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-[11px] flex items-center gap-1"
                        >
                          <FileCheck className="w-3 h-3" />
                          <span>Setujui Rapor</span>
                        </button>
                      )}

                      {rc.status === 'approved' && (activeRole === 'principal' || activeRole === 'super_admin') && (
                        <button
                          onClick={() => handleUpdateStatus(rc.id, 'published')}
                          className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded text-[11px] flex items-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3" />
                          <span>Terbitkan ke Wali</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Report Card Modal */}
      {selectedReportCard && (
        <PrintReportCardModal
          reportCard={selectedReportCard}
          onClose={() => setSelectedReportCard(null)}
        />
      )}
    </div>
  );
};
