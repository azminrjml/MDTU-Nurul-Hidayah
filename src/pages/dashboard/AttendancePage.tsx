import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Save, 
  UserCheck, 
  Clock, 
  Users,
  Search,
  Printer
} from 'lucide-react';
import { AppStorage, formatTanggal } from '../../lib/storage';
import { AttendanceStatus } from '../../types';

interface AttendancePageProps {
  onNavigate: (path: string) => void;
}

export const AttendancePage: React.FC<AttendancePageProps> = ({ onNavigate }) => {
  const classes = AppStorage.getClasses();
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [sessionName, setSessionName] = useState('Sesi Pembelajaran Diniyah (13.00 - 15.00 WIB)');

  // Get students for selected class
  const classStudents = AppStorage.getStudents().filter(
    s => s.current_status === 'active' && s.class_id === selectedClassId
  );

  // Local state for recording statuses
  const [statuses, setStatuses] = useState<Record<string, { status: AttendanceStatus; note: string }>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize or fetch existing
  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setStatuses(prev => ({
      ...prev,
      [studentId]: {
        status,
        note: prev[studentId]?.note || ''
      }
    }));
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setStatuses(prev => ({
      ...prev,
      [studentId]: {
        status: prev[studentId]?.status || 'present',
        note
      }
    }));
  };

  const setAllPresent = () => {
    const updated: Record<string, { status: AttendanceStatus; note: string }> = {};
    classStudents.forEach(s => {
      updated[s.id] = { status: 'present', note: '' };
    });
    setStatuses(updated);
  };

  const handleSaveAttendance = () => {
    const records = classStudents.map(s => ({
      student_id: s.id,
      student_name: s.full_name,
      status: statuses[s.id]?.status || 'present',
      note: statuses[s.id]?.note || ''
    }));

    AppStorage.recordAttendanceSession({
      class_id: selectedClassId,
      date: attendanceDate,
      session_name: sessionName,
      records
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const currentClass = classes.find(c => c.id === selectedClassId);

  // Calculations
  const presentCount = classStudents.filter(s => (statuses[s.id]?.status || 'present') === 'present').length;
  const sickCount = classStudents.filter(s => statuses[s.id]?.status === 'sick').length;
  const excusedCount = classStudents.filter(s => statuses[s.id]?.status === 'excused').length;
  const absentCount = classStudents.filter(s => statuses[s.id]?.status === 'absent').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Pencatatan Presensi Kehadiran Santri
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Validasi kehadiran harian per rombongan belajar dengan pencegahan sesi duplikat.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Rekap Presensi</span>
          </button>
          <button
            onClick={handleSaveAttendance}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Presensi</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-xs font-semibold">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Presensi kelas {currentClass?.name} tanggal {formatTanggal(attendanceDate)} berhasil disimpan ke database!</span>
        </div>
      )}

      {/* Control Panel: Class, Date & Session */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">Pilih Rombel Kelas</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">Tanggal Presensi</label>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">Sesi Diniyah</label>
            <input
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Attendance Summary Strip */}
        <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 text-xs gap-4">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-slate-700">Ringkasan:</span>
            <span className="text-emerald-700 font-bold">Hadir: {presentCount}</span>
            <span className="text-blue-700 font-bold">Sakit: {sickCount}</span>
            <span className="text-amber-700 font-bold">Izin: {excusedCount}</span>
            <span className="text-red-700 font-bold">Alpa: {absentCount}</span>
          </div>
          <button
            onClick={setAllPresent}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            Tandai Semua Hadir
          </button>
        </div>
      </div>

      {/* Attendance Sheet Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4 w-28">NIS</th>
                <th className="py-3 px-4">Nama Lengkap Santri</th>
                <th className="py-3 px-4 text-center">Status Kehadiran</th>
                <th className="py-3 px-4">Catatan / Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Tidak ada santri aktif di rombel kelas ini.
                  </td>
                </tr>
              ) : (
                classStudents.map((s, idx) => {
                  const currentStatus = statuses[s.id]?.status || 'present';
                  const currentNote = statuses[s.id]?.note || '';

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 text-center text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">{s.student_number}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{s.full_name}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(s.id, 'present')}
                            className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                              currentStatus === 'present' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Hadir
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(s.id, 'sick')}
                            className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                              currentStatus === 'sick' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Sakit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(s.id, 'excused')}
                            className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                              currentStatus === 'excused' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Izin
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(s.id, 'absent')}
                            className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                              currentStatus === 'absent' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Alpa
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          placeholder="Keterangan opsional (misal: sakit demam)"
                          value={currentNote}
                          onChange={(e) => handleNoteChange(s.id, e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
