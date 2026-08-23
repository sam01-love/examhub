import React from 'react';
import {
  GraduationCap,
  Clock,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Sparkles,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Logo';
import { ExamCategory } from '../types';

export const HomePage: React.FC = () => {
  const { setActiveTab, setSelectedExam, userRole, setUserRole } = useApp();

  const handleStartExam = (exam: ExamCategory) => {
    setSelectedExam(exam);
    if (userRole === 'public') {
      setActiveTab('login');
    } else {
      setActiveTab('cbt');
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* HERO SECTION - White background, Blue secondary, Green complementary */}
      <section className="relative overflow-hidden bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-50/50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="flex items-center gap-3">
            <Logo size="lg" />
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight uppercase leading-[1.0] text-slate-900">
            Master Your <span className="text-blue-600">JAMB, WAEC</span> & <span className="text-emerald-600">OAU Post-UTME</span>
          </h1>

          <p className="text-slate-600 text-base sm:text-xl leading-relaxed font-medium max-w-3xl">
            Nigeria's standard CBT exam simulator and study hub. Explore full curriculum syllabuses, video tutorial lectures, untimed practice tests with AI assistance, and real-time score analytics.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => handleStartExam('JAMB')}
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-widest shadow-md transition-all flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              <span>Launch JAMB CBT</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleStartExam('POST_UTME')}
              className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest shadow-md transition-all flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4" />
              <span>OAU Post-UTME</span>
            </button>

            <button
              onClick={() => {
                if (userRole === 'public') {
                  setActiveTab('tutorials');
                } else {
                  setActiveTab('my-courses');
                }
              }}
              className="px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs uppercase tracking-widest border border-slate-300 transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Tutorials & Syllabuses</span>
            </button>
          </div>
        </div>
      </section>

      {/* EXAM TARGET CARDS */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-3xl font-extrabold uppercase tracking-tight text-slate-900">
              Select Exam Target
            </h2>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">
              Engineered according to official Nigerian exam body standards
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* JAMB Card */}
          <div className="bg-white border-2 border-slate-200 p-6 rounded-2xl shadow-sm hover:border-blue-600 transition-all flex flex-col justify-between min-h-[320px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded bg-blue-100 text-blue-800">
                  4 Subjects Combination
                </span>
                <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
              </div>
              <div>
                <h3 className="text-4xl font-extrabold mb-1 leading-none uppercase tracking-tight text-slate-900">
                  JAMB
                </h3>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Joint Admissions Board
                </p>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Compulsory Use of English + 3 chosen subjects. Standard timer, calculator & question navigation grid.
                </p>
              </div>
              <ul className="space-y-1.5 text-xs font-bold text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Use of English + 3 Science/Arts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>On-Screen Scientific Calculator</span>
                </li>
              </ul>
            </div>
            <div className="pt-4">
              <button
                onClick={() => handleStartExam('JAMB')}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                <span>Start Simulation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* WAEC Card */}
          <div className="bg-white border-2 border-slate-200 p-6 rounded-2xl shadow-sm hover:border-emerald-600 transition-all flex flex-col justify-between min-h-[320px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded bg-emerald-100 text-emerald-800">
                  Senior Secondary
                </span>
                <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
              </div>
              <div>
                <h3 className="text-4xl font-extrabold mb-1 leading-none uppercase tracking-tight text-slate-900">
                  WAEC
                </h3>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  West African Examination Council
                </p>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Complete objective question coverage with worked theory solutions across Science, Arts, and Commercial subjects.
                </p>
              </div>
              <ul className="space-y-1.5 text-xs font-bold text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Topic-by-Topic Breakdown</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Worked Theory Solutions</span>
                </li>
              </ul>
            </div>
            <div className="pt-4">
              <button
                onClick={() => handleStartExam('WAEC')}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                <span>Curriculum & Prep</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* OAU Post-UTME Card */}
          <div className="bg-white border-2 border-slate-200 p-6 rounded-2xl shadow-sm hover:border-blue-600 transition-all flex flex-col justify-between min-h-[320px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded bg-blue-100 text-blue-800">
                  Great Ife Specialist
                </span>
                <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
              </div>
              <div>
                <h3 className="text-4xl font-extrabold mb-1 leading-none uppercase tracking-tight text-slate-900">
                  OAU
                </h3>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Post-UTME Screening Specialist
                </p>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Tailored specifically for Obafemi Awolowo University aspirants. Fast 30-min CBT screening simulator matching OAU e-Testing Centre format.
                </p>
              </div>
              <ul className="space-y-1.5 text-xs font-bold text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>OAU High Tech Centre Standards</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Aptitude & Speed Challenge</span>
                </li>
              </ul>
            </div>
            <div className="pt-4">
              <button
                onClick={() => handleStartExam('POST_UTME')}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                <span>Practice Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
