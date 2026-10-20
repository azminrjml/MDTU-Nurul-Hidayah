import React, { useState } from 'react';
import { 
  BookOpen, 
  Layers, 
  Save, 
  CheckCircle, 
  GraduationCap, 
  Award,
  Sliders,
  Calculator
} from 'lucide-react';
import { AppStorage } from '../../lib/storage';
import { Subject, SchoolClass } from '../../types';

interface AcademicsPageProps {
  onNavigate: (path: string) => void;
}

export const AcademicsPage: React.FC<AcademicsPageProps> = ({ onNavigate }) => {
  const subjects = AppStorage.getSubjects();
  const classes = AppStorage.getClasses();
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');

  // Grade weight configuration
  const [assignmentWeight, setAssignmentWeight] = useState(30); // 30%
  const [practiceWeight, setPracticeWeight] = useState(30);     // 30%
  const [examWeight, setExamWeight] = useState(40);             // 40%

  // Students in class
  const classStudents = AppStorage.getStudents().filter(
    s => s.current_status === 'active' && s.class_id === selectedClassId
  );

  // Grades local state
  const [studentScores, setStudentScores] = useState<Record<string, { tugas: number; praktik: number; ujian: number }>>({
    'std-001': { tugas: 90, praktik: 95, ujian: 92 },
    'std-002': { tugas: 88, praktik: 92, ujian: 95 },
    'std-003': { tugas: 80, praktik: 82, ujian: 84 }
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleScoreChange = (studentId: string, field: 'tugas' | 'praktik' | 'ujian', val: number) => {
    const safeVal = Math.min(100, Math.max(0, val));
    setStudentScores(prev => ({
      ...prev,
      [studentId]: {
        tugas: field === 'tugas' ? safeVal : (prev[studentId]?.tugas || 80),
        praktik: field === 'praktik' ? safeVal : (prev[studentId]?.praktik || 80),
        ujian: field === 'ujian' ? safeVal : (prev[studentId]?.ujian || 80)
      }
    }));
  };

  const calculateFinal = (tugas: number, praktik: number, ujian: number) => {
    return Math.round((tugas * (assignmentWeight / 100)) + (praktik * (practiceWeight / 100)) + (ujian * (examWeight / 100)));
  };

  const getPredicate = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    return 'D';
  };

  const handleSaveGrades = () => {
    AppStorage.logAudit('RECORD_STUDENT_GRADES', 'GRADES', `${selectedClassId}-${selectedSubjectId}`, {
      subject_id: selectedSubjectId,
      class_id: selectedClassId,
      weights: { assignmentWeight, practiceWeight, examWeight }
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const currentSubject = subjects.find(s => s.id === selectedSubjectId);
  const currentClass = classes.find(c => c.id === selectedClassId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Penilaian Akademik & Mata Pelajaran
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Konfigurasi bobot komponen nilai, input capaian santri, dan penghitungan nilai akhir otomatis.
          </p>
        </div>

        <button
          onClick={handleSaveGrades}
          className="flex items-center gap-2 px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Nilai Santri</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-xs font-semibold">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Nilai mata pelajaran {currentSubject?.name} kelas {currentClass?.name} berhasil disimpan!</span>
        </div>
      )}

      {/* Selectors & Weight Config */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
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
            <label className="font-semibold text-slate-700 block">Mata Pelajaran Diniyah</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Assessment Weights Configuration */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
            <Sliders className="w-4 h-4 text-emerald-700" />
            <span>Konfigurasi Bobot Penilaian (Total Harus 100%)</span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block mb-1">Tugas / Hafalan Harian</span>
              <div className="flex items-center gap-1 font-mono">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={assignmentWeight}
                  onChange={(e) => setAssignmentWeight(Number(e.target.value))}
                  className="w-16 px-2 py-1 bg-white border border-slate-300 rounded text-center font-bold"
                />
                <span>%</span>
              </div>
            </div>

            <div>
              <span className="text-slate-500 block mb-1">Praktik Ibadah / Tilawah</span>
              <div className="flex items-center gap-1 font-mono">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={practiceWeight}
                  onChange={(e) => setPracticeWeight(Number(e.target.value))}
                  className="w-16 px-2 py-1 bg-white border border-slate-300 rounded text-center font-bold"
                />
                <span>%</span>
              </div>
            </div>

            <div>
              <span className="text-slate-500 block mb-1">Ujian Imtihan / PTS</span>
              <div className="flex items-center gap-1 font-mono">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={examWeight}
                  onChange={(e) => setExamWeight(Number(e.target.value))}
                  className="w-16 px-2 py-1 bg-white border border-slate-300 rounded text-center font-bold"
                />
                <span>%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grade Entry Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">
            Lembar Penilaian: {currentSubject?.name} ({currentClass?.name})
          </span>
          <span className="text-[11px] text-slate-500 font-mono">KKM Standar: 70</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4 w-28">NIS</th>
                <th className="py-3 px-4">Nama Lengkap Santri</th>
                <th className="py-3 px-3 text-center w-24">Tugas ({assignmentWeight}%)</th>
                <th className="py-3 px-3 text-center w-24">Praktik ({practiceWeight}%)</th>
                <th className="py-3 px-3 text-center w-24">Ujian ({examWeight}%)</th>
                <th className="py-3 px-3 text-center w-24">Nilai Akhir</th>
                <th className="py-3 px-3 text-center w-20">Predikat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((s, idx) => {
                const scores = studentScores[s.id] || { tugas: 85, praktik: 88, ujian: 86 };
                const finalScore = calculateFinal(scores.tugas, scores.praktik, scores.ujian);
                const predicate = getPredicate(finalScore);

                return (
                  <tr key={s.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 text-center text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{s.student_number}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{s.full_name}</td>
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={scores.tugas}
                        onChange={(e) => handleScoreChange(s.id, 'tugas', Number(e.target.value))}
                        className="w-16 px-2 py-1 text-center font-mono font-semibold rounded border border-slate-200"
                      />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={scores.praktik}
                        onChange={(e) => handleScoreChange(s.id, 'praktik', Number(e.target.value))}
                        className="w-16 px-2 py-1 text-center font-mono font-semibold rounded border border-slate-200"
                      />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={scores.ujian}
                        onChange={(e) => handleScoreChange(s.id, 'ujian', Number(e.target.value))}
                        className="w-16 px-2 py-1 text-center font-mono font-semibold rounded border border-slate-200"
                      />
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-black text-slate-900 text-sm">
                      {finalScore}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                        predicate === 'A' ? 'bg-emerald-100 text-emerald-800' :
                        predicate === 'B' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {predicate}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
