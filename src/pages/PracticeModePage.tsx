import React, { useState } from 'react';
import {
  HelpCircle,
  Filter,
  CheckCircle2,
  XCircle,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Bot,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ALL_SUBJECTS } from '../data/subjects';
import { QUESTION_BANK } from '../data/questionBank';
import { SubjectId, Option } from '../types';

export const PracticeModePage: React.FC = () => {
  const {
    selectedSubjectId,
    setSelectedSubjectId,
    selectedExam,
    setSelectedExam,
    openAiModalForQuestion,
    toggleQuestionBookmark,
    studentProgress,
    savePracticeSession,
  } = useApp();

  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({});

  // Filter Questions
  const filteredQuestions = QUESTION_BANK.filter((q) => {
    const matchSubject = q.subjectId === selectedSubjectId;
    const matchExam = q.examCategory === selectedExam;
    const matchYear = selectedYear === 'All' || String(q.year) === selectedYear;
    return matchSubject && matchExam && matchYear;
  });

  // If filtered questions is empty, fallback to subject match only
  const activeQuestions =
    filteredQuestions.length > 0
      ? filteredQuestions
      : QUESTION_BANK.filter((q) => q.subjectId === selectedSubjectId);

  const currentQuestion = activeQuestions[currentIdx] || activeQuestions[0];

  const handleOptionSelect = (optionKey: 'A' | 'B' | 'C' | 'D') => {
    if (!currentQuestion) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionKey }));
  };

  const handleSubmitQuestion = () => {
    if (!currentQuestion) return;
    setSubmittedQuestions((prev) => ({ ...prev, [currentQuestion.id]: true }));

    // record session
    savePracticeSession({
      id: `practice-${Date.now()}`,
      timestamp: Date.now(),
      formattedDate: new Date().toLocaleDateString(),
      subjectId: selectedSubjectId,
      totalAttempted: 1,
      totalCorrect: selectedAnswers[currentQuestion.id] === currentQuestion.correctAnswer ? 1 : 0,
      scorePercentage: selectedAnswers[currentQuestion.id] === currentQuestion.correctAnswer ? 100 : 0,
    });
  };

  const isBookmarked = studentProgress.bookmarkedQuestionIds.includes(currentQuestion?.id || '');

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* HEADER BANNER */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(37,99,235,1)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest border border-slate-900">
              <HelpCircle className="w-3.5 h-3.5 fill-slate-950" />
              <span>Untimed CBT Practice</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">Practice & Solution Center</h1>
            <p className="text-xs sm:text-sm text-slate-300 font-bold uppercase tracking-wider">
              Practice past questions at your own pace with instant step-by-step solution reveals and AI assistance.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border-2 border-slate-800 text-xs font-black">
            {['JAMB', 'WAEC', 'POST_UTME'].map((ex) => (
              <button
                key={ex}
                onClick={() => setSelectedExam(ex as any)}
                className={`px-3 py-1.5 rounded-lg transition uppercase tracking-wider ${
                  selectedExam === ex ? 'bg-blue-600 text-white shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]' : 'text-slate-400 hover:text-white'
                }`}
              >
                {ex === 'POST_UTME' ? 'OAU Post-UTME' : ex}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Row: Subject + Year */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t-2 border-slate-800">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {ALL_SUBJECTS.map((sub) => (
              <button
                key={sub.id}
                onClick={() => {
                  setSelectedSubjectId(sub.id);
                  setCurrentIdx(0);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition whitespace-nowrap shrink-0 border-2 border-slate-900 ${
                  selectedSubjectId === sub.id
                    ? 'bg-amber-400 text-slate-950 shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-black shrink-0 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span>Year:</span>
            {['All', '2024', '2023', '2022', '2021'].map((yr) => (
              <button
                key={yr}
                onClick={() => {
                  setSelectedYear(yr);
                  setCurrentIdx(0);
                }}
                className={`px-3 py-1 rounded-lg transition border border-slate-700 ${
                  selectedYear === yr
                    ? 'bg-blue-600 text-white font-black'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* QUESTION CARD */}
      {currentQuestion ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] space-y-6">
          {/* Question Metadata Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                Question {currentIdx + 1} of {activeQuestions.length}
              </span>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded border border-slate-900 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200">
                {currentQuestion.year} • {currentQuestion.topic}
              </span>
            </div>

            <button
              onClick={() => toggleQuestionBookmark(currentQuestion.id)}
              className={`p-2 rounded-xl transition border-2 border-slate-900 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] ${
                isBookmarked
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-200'
              }`}
            >
              {isBookmarked ? (
                <>
                  <BookmarkCheck className="w-4 h-4 fill-slate-950" />
                  <span className="hidden sm:inline">Saved</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span className="hidden sm:inline">Save</span>
                </>
              )}
            </button>
          </div>

          {/* Question Text */}
          <div className="text-slate-900 dark:text-white text-base sm:text-xl font-black leading-relaxed">
            {currentQuestion.questionText}
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            {currentQuestion.options.map((opt: Option) => {
              const selectedKey = selectedAnswers[currentQuestion.id];
              const isSelected = selectedKey === opt.key;
              const isSubmitted = submittedQuestions[currentQuestion.id];
              const isCorrectOpt = opt.key === currentQuestion.correctAnswer;

              let btnStyle =
                'bg-slate-50 dark:bg-slate-800 border-2 border-slate-900 text-slate-900 dark:text-slate-100 font-bold';

              if (isSubmitted) {
                if (isCorrectOpt) {
                  btnStyle =
                    'bg-emerald-400 text-slate-950 border-2 border-slate-900 font-black shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]';
                } else if (isSelected) {
                  btnStyle =
                    'bg-rose-500 text-white border-2 border-slate-900 font-black';
                }
              } else if (isSelected) {
                btnStyle =
                  'bg-blue-600 text-white border-2 border-slate-900 font-black shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]';
              }

              return (
                <button
                  key={opt.key}
                  onClick={() => !isSubmitted && handleOptionSelect(opt.key)}
                  className={`w-full p-4 rounded-2xl text-sm text-left transition flex items-center justify-between ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
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
                  </div>

                  {isSubmitted && isCorrectOpt && <CheckCircle2 className="w-5 h-5 text-slate-950 shrink-0" />}
                  {isSubmitted && isSelected && !isCorrectOpt && (
                    <XCircle className="w-5 h-5 text-white shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Action Buttons: Submit & Instant Solution Reveal */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t-2 border-slate-900 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-900 disabled:opacity-40 text-slate-900 dark:text-slate-100 font-black text-xs uppercase tracking-wider flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              <button
                disabled={currentIdx === activeQuestions.length - 1}
                onClick={() => setCurrentIdx((prev) => Math.min(activeQuestions.length - 1, prev + 1))}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-900 disabled:opacity-40 text-slate-900 dark:text-slate-100 font-black text-xs uppercase tracking-wider flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {!submittedQuestions[currentQuestion.id] ? (
                <button
                  disabled={!selectedAnswers[currentQuestion.id]}
                  onClick={handleSubmitQuestion}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-black text-xs uppercase tracking-widest border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={() =>
                    openAiModalForQuestion({
                      question: currentQuestion.questionText,
                      options: currentQuestion.options,
                      correctAnswer: currentQuestion.correctAnswer,
                      userSelectedAnswer: selectedAnswers[currentQuestion.id],
                      subject: currentQuestion.subjectId,
                    })
                  }
                  className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-black text-xs uppercase tracking-widest border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] flex items-center gap-1.5 transition"
                >
                  <Bot className="w-4 h-4" />
                  <span>Ask AI Tutor</span>
                </button>
              )}
            </div>
          </div>

          {/* Solution & Explanation Box */}
          {submittedQuestions[currentQuestion.id] && (
            <div className="p-5 rounded-2xl bg-amber-100 dark:bg-slate-800 border-2 border-slate-900 space-y-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-sm uppercase tracking-tight">
                <Sparkles className="w-4 h-4 fill-amber-500" />
                <span>Answer Key & Step-by-Step Solution:</span>
              </div>
              <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-900 text-xs text-slate-900 dark:text-slate-100 space-y-2 leading-relaxed font-semibold">
                <div className="font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Correct Answer: Option {currentQuestion.correctAnswer}
                </div>
                <p>{currentQuestion.explanation}</p>
                {currentQuestion.workedSteps && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 font-mono text-slate-800 dark:text-slate-300 text-[11px] space-y-1">
                    <span className="font-black block uppercase tracking-wider">Worked Calculation Steps:</span>
                    {currentQuestion.workedSteps.map((step, idx) => (
                      <div key={idx}>• {step}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-900 p-8 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]">
          <p className="text-slate-900 dark:text-slate-100 font-bold text-sm">No practice questions available for this filter.</p>
        </div>
      )}
    </div>
  );
};
