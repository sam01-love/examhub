import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QUESTION_BANK } from '../data/questionBank';
import {
  ShieldCheck,
  Server,
  Zap,
  Users,
  BookOpen,
  Database,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Activity,
  Cpu,
  BarChart2,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { ExamCategory } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const { setSelectedExam, setActiveTab } = useApp();
  const [activeAdminTab, setActiveAdminTab] = useState<'questions' | 'courses' | 'students' | 'server'>('questions');
  const [filterExam, setFilterExam] = useState<ExamCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [questionsList, setQuestionsList] = useState(QUESTION_BANK);

  // Stats
  const totalQuestions = questionsList.length;
  const jambCount = questionsList.filter((q) => q.examCategory === 'JAMB').length;
  const waecCount = questionsList.filter((q) => q.examCategory === 'WAEC').length;
  const postUtmeCount = questionsList.filter((q) => q.examCategory === 'POST_UTME').length;

  const filteredQuestions = questionsList.filter((q) => {
    const matchesExam = filterExam === 'ALL' || q.examCategory === filterExam;
    const matchesSearch =
      q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.subjectId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesExam && matchesSearch;
  });

  const handleDeleteQuestion = (id: string) => {
    setQuestionsList((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* ADMIN HEADER BANNER */}
      <div className="bg-slate-900 text-white p-6 sm:p-10 rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(245,158,11,1)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-400 text-slate-950 font-black uppercase text-xs tracking-widest border border-slate-900">
              <ShieldCheck className="w-4 h-4 fill-slate-950" />
              <span>Administrative Operations Portal</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">Admin Control Center</h1>
            <p className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider">
              Manage question banks for JAMB, WAEC & Post-UTME, configure course tutorials, and monitor the 5,000 concurrent user cluster.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-3.5 py-2 rounded-xl border border-emerald-500/40 text-xs font-black uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              Server Status: 100% Healthy
            </span>
          </div>
        </div>

        {/* Admin Navigation Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-800">
          {[
            { id: 'questions', label: 'Question Bank', icon: <Database className="w-4 h-4" /> },
            { id: 'courses', label: 'Manage Courses', icon: <BookOpen className="w-4 h-4" /> },
            { id: 'students', label: 'Candidate Analytics', icon: <Users className="w-4 h-4" /> },
            { id: 'server', label: '5000 User Cluster Status', icon: <Server className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition border-2 border-slate-900 ${activeAdminTab === tab.id
                ? 'bg-amber-400 text-slate-950 shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: QUESTION BANK MANAGEMENT */}
      {activeAdminTab === 'questions' && (
        <div className="space-y-6">
          {/* Metrics summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-4 border-slate-900 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-500 block">Total Past MCQs</span>
              <div className="text-3xl font-black text-slate-900 dark:text-white">{totalQuestions}</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-4 border-slate-900 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] space-y-1">
              <span className="text-[10px] font-black uppercase text-blue-600 block">JAMB Questions</span>
              <div className="text-3xl font-black text-slate-900 dark:text-white">{jambCount}</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-4 border-slate-900 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] space-y-1">
              <span className="text-[10px] font-black uppercase text-emerald-600 block">WAEC Questions</span>
              <div className="text-3xl font-black text-slate-900 dark:text-white">{waecCount}</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-4 border-slate-900 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] space-y-1">
              <span className="text-[10px] font-black uppercase text-amber-500 block">OAU Post-UTME</span>
              <div className="text-3xl font-black text-slate-900 dark:text-white">{postUtmeCount}</div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter question text or topic..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border-2 border-slate-900 text-xs font-black">
                {['ALL', 'JAMB', 'WAEC', 'POST_UTME'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterExam(cat as any)}
                    className={`px-3 py-1.5 rounded-lg uppercase tracking-wider transition ${filterExam === cat
                      ? 'bg-amber-400 text-slate-950 font-black border border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                      : 'text-slate-600 dark:text-slate-300'
                      }`}
                  >
                    {cat === 'POST_UTME' ? 'OAU' : cat}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => alert('New Question Form Modal: Allows adding new JAMB, WAEC & Post-UTME questions with worked steps!')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition flex items-center gap-1.5 w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Question</span>
            </button>
          </div>

          {/* Question List Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
            <div className="p-4 bg-slate-900 text-white font-black text-xs uppercase tracking-widest flex items-center justify-between">
              <span>Verified Question Database</span>
              <span>Showing {filteredQuestions.length} Items</span>
            </div>

            <div className="divide-y-2 divide-slate-900">
              {filteredQuestions.map((q) => (
                <div key={q.id} className="p-5 space-y-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded border border-slate-900 bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                        {q.examCategory === 'POST_UTME' ? 'OAU Post-UTME' : q.examCategory}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-900 font-bold text-[10px] uppercase text-slate-700 dark:text-slate-300">
                        {q.subjectId} • {q.year}
                      </span>
                      <span className="text-xs font-bold text-slate-500 uppercase">{q.topic}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => alert(`Editing Question: ${q.id}`)}
                        className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg border border-slate-900 hover:bg-slate-200 transition"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-1.5 bg-rose-500 text-white rounded-lg border border-slate-900 hover:bg-rose-600 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">
                    {q.questionText}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-bold">
                    {q.options.map((opt) => (
                      <div
                        key={opt.key}
                        className={`p-2 rounded-xl border-2 border-slate-900 ${opt.key === q.correctAnswer
                          ? 'bg-emerald-400 text-slate-950'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                      >
                        <span className="font-black mr-1">{opt.key}:</span> {opt.text}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COURSES MANAGEMENT */}
      {activeAdminTab === 'courses' && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Subject Syllabus & Course Management
              </h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Configure subjects, upload video tutorials, and manage reading notes.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('my-courses')}
              className="px-4 py-2 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]"
            >
              View Student Course Mode
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Physics Mastery', 'Mathematics for UTME', 'Use of English & Concord', 'Chemistry Stoichiometry', 'Biology & Genetics', 'OAU General Aptitude'].map((course, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl border-2 border-slate-900 space-y-3">
                <span className="px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[10px] uppercase">
                  Active Course Module
                </span>
                <h3 className="font-black text-slate-900 dark:text-white text-lg uppercase">{course}</h3>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  Includes 12 video tutorials, 45 sub-topics, worked examples, and embedded Gemini AI Tutor.
                </p>
                <button
                  onClick={() => alert(`Managing course modules for ${course}`)}
                  className="w-full py-2 bg-slate-900 text-white font-black text-xs uppercase rounded-xl border border-slate-900 shadow-[2px_2px_0px_0px_rgba(37,99,235,1)]"
                >
                  Edit Course Content
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CANDIDATE ANALYTICS */}
      {activeAdminTab === 'students' && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Registered Student Performance Monitor
              </h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Real-time tracking of candidate scores across national mock tests.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest border-2 border-slate-900">
                <tr>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Target Exam</th>
                  <th className="p-3">Mocks Taken</th>
                  <th className="p-3">Avg Accuracy</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-900 font-bold">
                {[
                  { name: 'David Okonjo', exam: 'JAMB', mocks: 14, score: '82%', status: 'Top Percentile' },
                  { name: 'Blessing Adebayo', exam: 'POST_UTME', mocks: 9, score: '76%', status: 'Passed' },
                  { name: 'Chidi Nwosu', exam: 'WAEC', mocks: 21, score: '88%', status: 'Top Percentile' },
                  { name: 'Amina Bello', exam: 'JAMB', mocks: 11, score: '69%', status: 'Needs Practice' },
                ].map((s, idx) => (
                  <tr key={idx} className="hover:bg-slate-100 dark:hover:bg-slate-800">
                    <td className="p-3 font-black text-slate-900 dark:text-white uppercase">{s.name}</td>
                    <td className="p-3 text-blue-600 dark:text-blue-400 font-black">{s.exam}</td>
                    <td className="p-3 font-white dark:text-amber-200 text-amber-300">{s.mocks} Tests</td>
                    <td className="p-3 font-black text-emerald-600">{s.score}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded border border-slate-900 bg-emerald-400 text-slate-950 font-black text-[10px] uppercase">
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: 5000 CONCURRENT USER SERVER CLUSTER MONITOR */}
      {activeAdminTab === 'server' && (
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-3xl border-4 border-slate-900 shadow-[10px_10px_0px_0px_rgba(16,185,129,1)] space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b-2 border-slate-800 pb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-400 text-slate-950 font-black uppercase text-xs tracking-widest border border-slate-900 mb-2">
                  <Activity className="w-4 h-4 fill-slate-950" />
                  <span>Real-time Live Telemetry</span>
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tight">5,000 Concurrent User Engine Status</h2>
              </div>
              <button
                onClick={() => alert('Telemetric Heartbeat Refreshed!')}
                className="px-4 py-2 bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] flex items-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh Pulse</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-5 rounded-2xl border-2 border-slate-800 space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400 block">Active Users Right Now</span>
                <div className="text-3xl font-black text-emerald-400">4,892 / 5,000</div>
                <span className="text-[10px] font-bold text-slate-400 block">97.8% Capacity Load</span>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border-2 border-slate-800 space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400 block">Avg Response Latency</span>
                <div className="text-3xl font-black text-blue-400">12.4 ms</div>
                <span className="text-[10px] font-bold text-slate-400 block">Edge CDN Cached</span>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border-2 border-slate-800 space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400 block">CPU Container Load</span>
                <div className="text-3xl font-black text-amber-400">18.5%</div>
                <span className="text-[10px] font-bold text-slate-400 block">Autoscaled 8 Workers</span>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border-2 border-slate-800 space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400 block">Redis Query Rate</span>
                <div className="text-3xl font-black text-purple-400">14.2k req/s</div>
                <span className="text-[10px] font-bold text-slate-400 block">Connection Pool Active</span>
              </div>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border-2 border-slate-800 space-y-4">
              <h3 className="font-black text-lg uppercase text-white">Cluster Health Breakdown</h3>
              <div className="space-y-3 text-xs font-bold text-slate-300">
                <div className="flex justify-between items-center bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="uppercase">Stateless API Load Balancer</span>
                  <span className="px-2 py-0.5 bg-emerald-400 text-slate-950 rounded font-black uppercase text-[10px]">Healthy</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="uppercase">Edge Question Caching & Offline Fallback</span>
                  <span className="px-2 py-0.5 bg-emerald-400 text-slate-950 rounded font-black uppercase text-[10px]">Active</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="uppercase">Gemini AI Tutor Proxy Rate Limiter</span>
                  <span className="px-2 py-0.5 bg-emerald-400 text-slate-950 rounded font-black uppercase text-[10px]">Optimal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
