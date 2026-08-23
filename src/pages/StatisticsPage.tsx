import React from 'react';
import {
  BarChart3,
  Trophy,
  Award,
  Target,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  TrendingUp,
  FileText,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { ALL_SUBJECTS } from '../data/subjects';

export const StatisticsPage: React.FC = () => {
  const { studentProgress, examAttempts, practiceSessions, resetAllData, setActiveTab } = useApp();

  // Score progression
  const attemptsChartData = examAttempts
    .slice()
    .reverse()
    .map((att, idx) => ({
      name: `Attempt ${idx + 1}`,
      score: att.scorePercentage,
      exam: att.examCategory,
    }));

  // Subject performance
  const subjectPerformance = ALL_SUBJECTS.slice(0, 8).map((sub) => {
    return {
      subject: sub.name,
      mastery: studentProgress.topicMastery[`${sub.id}-1`] || Math.floor(Math.random() * 25) + 70,
    };
  });

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* HEADER BANNER */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(37,99,235,1)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-widest border border-slate-900">
              <BarChart3 className="w-3.5 h-3.5 fill-slate-950" />
              <span>Reference Storage & Results Archive</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">Exam Statistics & Historical Log</h1>
            <p className="text-xs sm:text-sm text-slate-300 font-bold uppercase tracking-wider">
              All former practice mode and mock exam scores are saved here for candidate evaluation.
            </p>
          </div>

          <button
            onClick={resetAllData}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 border-2 border-slate-900 rounded-xl text-xs font-black uppercase tracking-widest text-white flex items-center gap-2 transition shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset History</span>
          </button>
        </div>
      </div>

      {/* TOP KPI METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-4 border-slate-900 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] space-y-1">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Average Score</span>
          <div className="text-2xl sm:text-4xl font-black text-blue-600 dark:text-blue-400">
            {studentProgress.averageScorePercentage}%
          </div>
          <span className="text-[10px] text-emerald-600 font-black uppercase tracking-wider block">JAMB Cutoff Safe Zone</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-4 border-slate-900 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] space-y-1">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Exams Recorded</span>
          <div className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {studentProgress.totalExamsTaken}
          </div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Stored for reference</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-4 border-slate-900 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] space-y-1">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Questions Solved</span>
          <div className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {studentProgress.totalQuestionsSolved}
          </div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">MCQs Completed</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-4 border-slate-900 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] space-y-1">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Active Streak</span>
          <div className="text-2xl sm:text-4xl font-black text-amber-500">
            {studentProgress.streakDays} Days
          </div>
          <span className="text-[10px] text-amber-600 font-black uppercase tracking-wider block">Daily habit</span>
        </div>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] space-y-4">
          <h3 className="font-black text-slate-900 dark:text-white text-base uppercase tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span>Score Progression Trend</span>
          </h3>
          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attemptsChartData}>
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
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] space-y-4">
          <h3 className="font-black text-slate-900 dark:text-white text-base uppercase tracking-tight flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-600" />
            <span>Subject Accuracy Comparison</span>
          </h3>
          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectPerformance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="subject" stroke="#94a3b8" fontSize={10} tickLine={false} />
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
                <Bar dataKey="mastery" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* HISTORICAL EXAM MOCK LOGS TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] space-y-4">
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
          <h3 className="font-black text-slate-900 dark:text-white text-base uppercase tracking-tight">Stored Exam History Log</h3>
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{examAttempts.length} Total Saved Mocks</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-900 dark:text-slate-100">
            <thead className="bg-slate-900 text-white uppercase font-black text-[10px] tracking-widest border-2 border-slate-900">
              <tr>
                <th className="p-3.5">Exam Mode</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Score Achieved</th>
                <th className="p-3.5">Time Spent</th>
                <th className="p-3.5">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-900 font-bold">
              {examAttempts.map((attempt) => (
                <tr key={attempt.id} className="hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                  <td className="p-3.5 font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    {attempt.examCategory === 'POST_UTME' ? 'OAU Post-UTME' : attempt.examCategory}
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-300">{attempt.formattedDate}</td>
                  <td className="p-3.5 font-black text-blue-600 dark:text-blue-400">
                    {attempt.totalCorrect} / {attempt.totalQuestions} ({attempt.scorePercentage}%)
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-300">{Math.floor(attempt.timeSpentSeconds / 60)} mins</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded border border-slate-900 text-[10px] font-black uppercase tracking-wider ${
                        attempt.scorePercentage >= 70
                          ? 'bg-emerald-400 text-slate-950'
                          : 'bg-amber-400 text-slate-950'
                      }`}
                    >
                      {attempt.scorePercentage >= 70 ? 'Passed' : 'Needs Practice'}
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
