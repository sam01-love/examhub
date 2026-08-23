import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import {
  Trophy,
  Target,
  Clock,
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Bookmark,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ALL_SUBJECTS } from '../data/subjects';

export const DashboardPage: React.FC = () => {
  const { studentProgress, examAttempts, setActiveTab, setSelectedSubjectId, resetAllData } = useApp();

  // Prepare trend chart data from past attempts
  const trendData = examAttempts
    .slice()
    .reverse()
    .map((attempt, idx) => ({
      name: `Test ${idx + 1}`,
      score: attempt.scorePercentage,
      category: attempt.examCategory,
    }));

  // Subject performance stats
  const subjectPerformanceData = ALL_SUBJECTS.slice(0, 6).map((sub) => {
    // mock mastery level or calculated from studentProgress
    const mastery = studentProgress.topicMastery[`${sub.id}-1`] || Math.floor(Math.random() * 30) + 65;
    return {
      subject: sub.name,
      mastery: mastery,
    };
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(37,99,235,1)]">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-widest border border-slate-900">
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            <span>Personalized Candidate Portal</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">Student Learning Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-300 font-bold uppercase tracking-wider">
            Track your mastery levels across subjects, monitor CBT speed, and analyze performance trends.
          </p>
        </div>

        <button
          onClick={resetAllData}
          className="self-start sm:self-center px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white border-2 border-slate-900 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Progress</span>
        </button>
      </div>

      {/* TOP STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-4 border-slate-900 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Avg Mock Score</span>
            <Trophy className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {studentProgress.averageScorePercentage}%
          </div>
          <p className="text-[10px] text-emerald-600 font-black uppercase tracking-wider">Top 15% Percentile</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-4 border-slate-900 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Exams Completed</span>
            <Award className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {studentProgress.totalExamsTaken}
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">JAMB & OAU Mocks</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-4 border-slate-900 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Questions Solved</span>
            <Target className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {studentProgress.totalQuestionsSolved}
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Past CBT MCQs Solved</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-4 border-slate-900 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Study Streak</span>
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {studentProgress.streakDays} Days
          </div>
          <p className="text-[10px] text-amber-600 font-black uppercase tracking-wider">Keep going!</p>
        </div>
      </div>

      {/* LEARNING TRENDS CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Score Progress Over Time */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-base uppercase tracking-tight flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span>Mock Score Progression</span>
              </h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Percentage score across recent practice attempts</p>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#2563eb"
                    strokeWidth={4}
                    dot={{ r: 6, fill: '#f59e0b', stroke: '#0f172a', strokeWidth: 2 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                No exam attempts recorded yet. Take a mock test to see your progress chart!
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Subject Mastery Bar Distribution */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-base uppercase tracking-tight flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600" />
                <span>Subject Mastery Levels</span>
              </h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estimated accuracy percentage per subject</p>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="subject" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="mastery" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* RECENT MOCK TEST ATTEMPTS TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] space-y-4">
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
          <div>
            <h3 className="font-black text-slate-900 dark:text-white text-base uppercase tracking-tight">Recent CBT Exam History</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Detailed results and breakdown of completed mocks</p>
          </div>
          <button
            onClick={() => setActiveTab('stats')}
            className="text-xs font-black text-blue-600 hover:text-blue-500 uppercase tracking-widest flex items-center gap-1"
          >
            <span>Full History & Stats</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-900 dark:text-slate-100">
            <thead className="bg-slate-900 text-white uppercase font-black text-[10px] tracking-widest border-2 border-slate-900">
              <tr>
                <th className="p-3">Exam Mode</th>
                <th className="p-3">Date</th>
                <th className="p-3">Score</th>
                <th className="p-3">Time Spent</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-900 font-bold">
              {examAttempts.map((attempt) => (
                <tr key={attempt.id} className="hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                  <td className="p-3 font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    {attempt.examCategory === 'POST_UTME' ? 'OAU Post-UTME' : attempt.examCategory}
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{attempt.formattedDate}</td>
                  <td className="p-3 font-black text-blue-600 dark:text-blue-400">
                    {attempt.totalCorrect} / {attempt.totalQuestions} ({attempt.scorePercentage}%)
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{Math.floor(attempt.timeSpentSeconds / 60)} mins</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded border border-slate-900 text-[10px] font-black uppercase tracking-wider ${
                        attempt.scorePercentage >= 70
                          ? 'bg-emerald-400 text-slate-950'
                          : 'bg-amber-400 text-slate-950'
                      }`}
                    >
                      {attempt.scorePercentage >= 70 ? 'Passed' : 'Needs Review'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
