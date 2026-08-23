import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Clock,
  Calculator,
  Flag,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  RotateCcw,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Bot,
  HelpCircle,
  BarChart3,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ALL_SUBJECTS, JAMB_MANDATORY_SUBJECT_ID } from '../data/subjects';
import { QUESTION_BANK } from '../data/questionBank';
import { SubjectId, Option, ExamAttempt } from '../types';
import { CalculatorModal } from '../components/CalculatorModal';

export const ExamModePage: React.FC = () => {
  const { selectedExam, saveExamAttempt, openAiModalForQuestion, setActiveTab } = useApp();

  // 1. JAMB 4-SUBJECT SELECTION MODAL STATE BEFORE STARTING
  const [examStarted, setExamStarted] = useState<boolean>(false);
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectId[]>([
    'english',
    'maths',
    'physics',
    'chemistry',
  ]);

  // Exam state
  const [activeSubjectTab, setActiveSubjectTab] = useState<SubjectId>('english');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D' | null>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<string[]>([]);
  const [calculatorOpen, setCalculatorOpen] = useState<boolean>(false);

  // Timer state
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(1800); // 30 minutes
  const [examFinished, setExamFinished] = useState<boolean>(false);
  const [finalAttempt, setFinalAttempt] = useState<ExamAttempt | null>(null);

  // Filter exam questions across selected subjects
  const examQuestions = QUESTION_BANK.filter((q) => selectedSubjects.includes(q.subjectId));

  const questionsForActiveSubject = examQuestions.filter((q) => q.subjectId === activeSubjectTab);
  const activeQuestion = questionsForActiveSubject[currentQuestionIdx] || questionsForActiveSubject[0];

  // Subject selection handler
  const handleToggleSubject = (subId: SubjectId) => {
    if (subId === JAMB_MANDATORY_SUBJECT_ID) return; // English is compulsory
    if (selectedSubjects.includes(subId)) {
      if (selectedSubjects.length <= 2) return;
      setSelectedSubjects((prev) => prev.filter((s) => s !== subId));
    } else {
      if (selectedSubjects.length >= 4) return; // max 4
      setSelectedSubjects((prev) => [...prev, subId]);
    }
  };

  const handleStartQuiz = () => {
    setExamStarted(true);
    setActiveSubjectTab(selectedSubjects[0]);
    setCurrentQuestionIdx(0);
    setTimeLeftSeconds(selectedSubjects.length * 450); // e.g. 30 mins
  };

  // Timer countdown hook
  useEffect(() => {
    if (!examStarted || examFinished) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishAndSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, examFinished]);

  // Answer selection
  const handleSelectAnswer = (optionKey: 'A' | 'B' | 'C' | 'D') => {
    if (!activeQuestion) return;
    setUserAnswers((prev) => ({
      ...prev,
      [activeQuestion.id]: optionKey,
    }));
  };

  // Flag toggle
  const handleToggleFlag = () => {
    if (!activeQuestion) return;
    setFlaggedQuestions((prev) =>
      prev.includes(activeQuestion.id)
        ? prev.filter((id) => id !== activeQuestion.id)
        : [...prev, activeQuestion.id]
    );
  };

  // Submit Exam
  const handleFinishAndSubmit = () => {
    setExamFinished(true);

    // Calculate score
    let totalCorrect = 0;
    const subjectBreakdown: Record<SubjectId, { total: number; correct: number; wrong: number; skipped: number }> =
      {} as any;

    selectedSubjects.forEach((sub) => {
      subjectBreakdown[sub] = { total: 0, correct: 0, wrong: 0, skipped: 0 };
    });

    examQuestions.forEach((q) => {
      const ans = userAnswers[q.id];
      const sub = q.subjectId;
      if (!subjectBreakdown[sub]) {
        subjectBreakdown[sub] = { total: 0, correct: 0, wrong: 0, skipped: 0 };
      }

      subjectBreakdown[sub].total += 1;

      if (!ans) {
        subjectBreakdown[sub].skipped += 1;
      } else if (ans === q.correctAnswer) {
        subjectBreakdown[sub].correct += 1;
        totalCorrect += 1;
      } else {
        subjectBreakdown[sub].wrong += 1;
      }
    });

    const totalQ = examQuestions.length || 1;
    const percentage = Math.round((totalCorrect / totalQ) * 100);
    const timeSpent = selectedSubjects.length * 450 - timeLeftSeconds;

    const attempt: ExamAttempt = {
      id: `attempt-${Date.now()}`,
      timestamp: Date.now(),
      formattedDate: new Date().toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' }),
      examCategory: selectedExam,
      subjects: selectedSubjects,
      totalQuestions: totalQ,
      totalCorrect,
      scorePercentage: percentage,
      timeSpentSeconds: timeSpent,
      timeLimitSeconds: selectedSubjects.length * 450,
      subjectBreakdown,
      userAnswers,
      flaggedQuestions,
    };

    setFinalAttempt(attempt);
    saveExamAttempt(attempt);

    // Trigger confetti celebration
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  // Format time (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ================= 1. SUBJECT SELECTION PRE-EXAM MODAL =================
  if (!examStarted) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 pb-12">
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(245,158,11,1)] space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-widest border border-slate-900">
            <Clock className="w-3.5 h-3.5 fill-slate-950" />
            <span>Official CBT Simulator Setup</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
            {selectedExam === 'JAMB'
              ? 'JAMB UTME 4-Subject Setup'
              : selectedExam === 'POST_UTME'
              ? 'OAU Post-UTME Screening Setup'
              : 'WAEC SSCE Exam Setup'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-bold uppercase tracking-wider leading-relaxed">
            {selectedExam === 'JAMB'
              ? 'Ensure that you pick Use of English (Mandatory) along with 3 other core subjects of your choice before starting the test.'
              : 'Select your subject combination to generate your timed CBT mock test paper.'}
          </p>
        </div>

        {/* Subjects Selector Grid */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] space-y-6">
          <div className="flex items-center justify-between border-b-2 border-slate-900 dark:border-slate-800 pb-4">
            <h3 className="font-black text-slate-900 dark:text-white text-lg uppercase tracking-tight">
              Selected Combination ({selectedSubjects.length} / 4 Subjects)
            </h3>
            <span className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
              {selectedSubjects.length === 4 ? 'Ready to launch!' : 'Select 4 subjects'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {ALL_SUBJECTS.map((sub) => {
              const isSelected = selectedSubjects.includes(sub.id);
              const isMandatory = sub.id === JAMB_MANDATORY_SUBJECT_ID;

              return (
                <button
                  key={sub.id}
                  onClick={() => handleToggleSubject(sub.id)}
                  className={`p-4 rounded-2xl border-2 border-slate-900 text-left transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 font-black shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold hover:bg-slate-100'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">
                      {sub.category}
                    </span>
                    <span className="text-xs font-black">{sub.name}</span>
                    {isMandatory && (
                      <span className="text-[9px] font-black text-rose-600 block mt-0.5 uppercase tracking-wider">
                        (Compulsory for JAMB)
                      </span>
                    )}
                  </div>
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border-2 border-slate-900 ${
                      isSelected
                        ? 'bg-slate-900 text-white'
                        : 'bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleStartQuiz}
            disabled={selectedSubjects.length < 2}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm uppercase tracking-widest rounded-2xl border-2 border-slate-900 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] transition active:translate-x-1 active:translate-y-1 flex items-center justify-center gap-2"
          >
            <Clock className="w-5 h-5" />
            <span>Begin CBT Exam Simulation ({selectedSubjects.length} Subjects)</span>
          </button>
        </div>
      </div>
    );
  }

  // ================= 2. POST-EXAM RESULTS & REVIEW SCREEN =================
  if (examFinished && finalAttempt) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-16">
        {/* Confetti Score Header */}
        <div className="bg-slate-900 text-white p-8 rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(37,99,235,1)] text-center space-y-4 relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-emerald-400 text-slate-950 text-xs font-black uppercase tracking-widest border border-slate-900">
            <Award className="w-4 h-4 fill-slate-950" />
            <span>Official CBT Result Summary</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
            Total Score: {finalAttempt.totalCorrect} / {finalAttempt.totalQuestions}
            <span className="block text-2xl font-black text-amber-400 mt-1 uppercase tracking-wider">
              ({finalAttempt.scorePercentage}% Overall Aggregate)
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-bold uppercase tracking-wider max-w-xl mx-auto">
            Exam completed in {Math.floor(finalAttempt.timeSpentSeconds / 60)} minutes and {finalAttempt.timeSpentSeconds % 60} seconds.
          </p>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => {
                setExamStarted(false);
                setExamFinished(false);
              }}
              className="px-5 py-3 bg-amber-400 text-slate-950 hover:bg-amber-300 font-black text-xs uppercase tracking-widest rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] transition flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Take Another Mock</span>
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] transition flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>View Analytics</span>
            </button>
          </div>
        </div>

        {/* Subject Breakdown Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] space-y-4">
          <h3 className="font-black text-slate-900 dark:text-white text-lg uppercase tracking-tight">Subject Performance Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(finalAttempt.subjectBreakdown).map(([subId, rawStats]) => {
              const stats = rawStats as { total: number; correct: number; wrong: number; skipped: number };
              const subObj = ALL_SUBJECTS.find((s) => s.id === subId);
              const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

              return (
                <div
                  key={subId}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-900 space-y-2 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]"
                >
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">
                    {subObj?.name || subId}
                  </span>
                  <div className="text-xl font-black text-blue-600 dark:text-blue-400">
                    {stats.correct} / {stats.total} <span className="text-xs text-slate-900 dark:text-slate-200 font-bold">({pct}%)</span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex justify-between pt-1 border-t-2 border-slate-900">
                    <span>Correct: {stats.correct}</span>
                    <span>Wrong: {stats.wrong}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Question Review with Step-by-Step Solutions */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] space-y-6">
          <h3 className="font-black text-slate-900 dark:text-white text-lg uppercase tracking-tight">
            Detailed Solution Review
          </h3>

          <div className="space-y-6">
            {examQuestions.map((q, idx) => {
              const userAns = finalAttempt.userAnswers[q.id];
              const isCorrect = userAns === q.correctAnswer;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border-2 border-slate-900 space-y-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] ${
                    isCorrect
                      ? 'bg-emerald-100 dark:bg-emerald-950/40'
                      : userAns
                      ? 'bg-rose-100 dark:bg-rose-950/40'
                      : 'bg-slate-50 dark:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                      Q{idx + 1}. [{q.subjectId.toUpperCase()}] {q.topic}
                    </span>
                    <span
                      className={`font-black px-2.5 py-0.5 rounded border border-slate-900 text-[10px] uppercase tracking-wider ${
                        isCorrect
                          ? 'bg-emerald-400 text-slate-950'
                          : userAns
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-200 text-slate-900'
                      }`}
                    >
                      {isCorrect ? 'Correct' : userAns ? 'Wrong' : 'Skipped'}
                    </span>
                  </div>

                  <p className="font-black text-sm text-slate-900 dark:text-white">{q.questionText}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt) => (
                      <div
                        key={opt.key}
                        className={`p-2.5 rounded-xl border-2 border-slate-900 flex items-center justify-between font-bold ${
                          opt.key === q.correctAnswer
                            ? 'bg-emerald-400 text-slate-950 font-black'
                            : opt.key === userAns
                            ? 'bg-rose-500 text-white font-black'
                            : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        <span>
                          {opt.key}. {opt.text}
                        </span>
                        {opt.key === q.correctAnswer && <CheckCircle2 className="w-4 h-4 text-slate-950 shrink-0" />}
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-900 text-xs text-slate-900 dark:text-slate-100 space-y-1 font-semibold">
                    <span className="font-black text-blue-600 dark:text-blue-400 block uppercase tracking-wider">
                      Explanation / Solution:
                    </span>
                    <p>{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ================= 3. ACTIVE REAL CBT EXAM SIMULATOR INTERFACE =================
  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* CBT HEADER BAR: TIMER, SUBJECT TABS & CALCULATOR */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border-4 border-slate-900">
        {/* Subject Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {selectedSubjects.map((subId) => {
            const subObj = ALL_SUBJECTS.find((s) => s.id === subId);
            const isActive = activeSubjectTab === subId;

            return (
              <button
                key={subId}
                onClick={() => {
                  setActiveSubjectTab(subId);
                  setCurrentQuestionIdx(0);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition whitespace-nowrap border-2 border-slate-900 ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                {subObj?.name || subId}
              </button>
            );
          })}
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-slate-900 text-xs font-mono font-black uppercase tracking-wider ${
              timeLeftSeconds < 300
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-emerald-400 text-slate-950'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeLeftSeconds)}</span>
          </div>

          <button
            onClick={() => setCalculatorOpen(true)}
            className="p-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition"
            title="Open CBT Calculator"
          >
            <Calculator className="w-5 h-5 fill-slate-950" />
          </button>

          <button
            onClick={handleFinishAndSubmit}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-widest rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition"
          >
            Submit Exam
          </button>
        </div>
      </div>

      {/* MAIN CBT WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT 3 COLS: QUESTION DISPLAY & MCQs */}
        <div className="lg:col-span-3 space-y-6">
          {activeQuestion ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] space-y-6">
              {/* Question Top Controls */}
              <div className="flex items-center justify-between border-b-2 border-slate-900 dark:border-slate-800 pb-4">
                <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                  Question {currentQuestionIdx + 1} of {questionsForActiveSubject.length}
                </span>

                <button
                  onClick={handleToggleFlag}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] ${
                    flaggedQuestions.includes(activeQuestion.id)
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{flaggedQuestions.includes(activeQuestion.id) ? 'Flagged' : 'Flag Question'}</span>
                </button>
              </div>

              {/* Question Text */}
              <div className="text-slate-900 dark:text-white text-base sm:text-xl font-black leading-relaxed">
                {activeQuestion.questionText}
              </div>

              {/* Options */}
              <div className="space-y-3">
                {activeQuestion.options.map((opt) => {
                  const isSelected = userAnswers[activeQuestion.id] === opt.key;

                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleSelectAnswer(opt.key)}
                      className={`w-full p-4 rounded-2xl border-2 border-slate-900 text-sm text-left transition flex items-center gap-3.5 font-bold ${
                        isSelected
                          ? 'bg-blue-600 text-white font-black shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-100'
                      }`}
                    >
                      <span
                        className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 border-2 border-slate-900 ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {opt.key}
                      </span>
                      <span>{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Prev / Next Bottom Navigation */}
              <div className="pt-4 flex items-center justify-between border-t-2 border-slate-900 dark:border-slate-800">
                <button
                  disabled={currentQuestionIdx === 0}
                  onClick={() => setCurrentQuestionIdx((prev) => Math.max(0, prev - 1))}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-900 disabled:opacity-40 text-slate-900 dark:text-slate-100 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  disabled={currentQuestionIdx === questionsForActiveSubject.length - 1}
                  onClick={() =>
                    setCurrentQuestionIdx((prev) => Math.min(questionsForActiveSubject.length - 1, prev + 1))
                  }
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white border-2 border-slate-900 font-black text-xs uppercase tracking-widest flex items-center gap-1.5 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-900 font-bold">
              No questions found for this subject.
            </div>
          )}
        </div>

        {/* RIGHT COL: QUESTION NAVIGATION PALETTE GRID */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] space-y-4">
          <h4 className="font-black text-xs uppercase tracking-widest text-slate-500">Question Palette</h4>

          {/* Grid Palette 1..N */}
          <div className="grid grid-cols-5 gap-2 max-h-80 overflow-y-auto p-1">
            {questionsForActiveSubject.map((q, idx) => {
              const isAnswered = !!userAnswers[q.id];
              const isFlagged = flaggedQuestions.includes(q.id);
              const isCurrent = idx === currentQuestionIdx;

              let style =
                'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100 border-2 border-slate-900';

              if (isCurrent) {
                style = 'bg-blue-600 text-white font-black border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]';
              } else if (isFlagged) {
                style = 'bg-amber-400 text-slate-950 font-black border-2 border-slate-900';
              } else if (isAnswered) {
                style = 'bg-emerald-400 text-slate-950 font-black border-2 border-slate-900';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIdx(idx)}
                  className={`h-9 rounded-xl text-xs font-black transition flex items-center justify-center ${style}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Color Legend */}
          <div className="pt-3 border-t-2 border-slate-900 dark:border-slate-800 space-y-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-400 border border-slate-900" />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-blue-600 border border-slate-900" />
              <span>Current</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-amber-400 border border-slate-900" />
              <span>Flagged</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-slate-200 border border-slate-900" />
              <span>Unanswered</span>
            </div>
          </div>
        </div>
      </div>

      {/* CBT Calculator Modal */}
      <CalculatorModal isOpen={calculatorOpen} onClose={() => setCalculatorOpen(false)} />
    </div>
  );
};
