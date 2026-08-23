import React, { useState } from 'react';
import {
  FileText,
  Video,
  Play,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Send,
  PlusCircle,
  Lightbulb,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ALL_SUBJECTS } from '../data/subjects';
import { READING_MATERIALS } from '../data/readingData';
import { SubjectId } from '../types';

export const ReadingModePage: React.FC = () => {
  const { selectedSubjectId, setSelectedSubjectId, selectedTopicId, updateCustomTopicVideo, updateTopicMastery, studentProgress, openAiModalForQuestion } = useApp();

  // Find material
  const materialsForSubject = READING_MATERIALS.filter((m) => m.subjectId === selectedSubjectId);
  const activeMaterial =
    materialsForSubject.find((m) => m.topicId === selectedTopicId) ||
    materialsForSubject[0] ||
    READING_MATERIALS[0];

  // Video URL override
  const customVideoUrl = studentProgress.customTopicVideos[activeMaterial.id] || '';
  const [videoInput, setVideoInput] = useState(customVideoUrl || activeMaterial.defaultVideoUrl);
  const [videoSaved, setVideoSaved] = useState(false);

  // Quick Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  const currentSubject = ALL_SUBJECTS.find((s) => s.id === selectedSubjectId) || ALL_SUBJECTS[0];

  const handleSaveVideoUrl = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomTopicVideo(activeMaterial.id, videoInput);
    setVideoSaved(true);
    setTimeout(() => setVideoSaved(false), 2500);
  };

  const handleSelectQuizOption = (quizId: string, optionIdx: number) => {
    setQuizAnswers((prev) => ({ ...prev, [quizId]: optionIdx }));
  };

  const handleSubmitQuiz = (quizId: string, correctIdx: number) => {
    setQuizSubmitted((prev) => ({ ...prev, [quizId]: true }));
    const isCorrect = quizAnswers[quizId] === correctIdx;
    if (isCorrect) {
      updateTopicMastery(activeMaterial.topicId, 90);
    }
  };

  // Convert normal YouTube links (youtube.com/watch?v=XYZ or youtu.be/XYZ) into embed URLs (youtube.com/embed/XYZ)
  const getEmbedUrl = (url: string) => {
    if (!url) return activeMaterial.defaultVideoUrl;
    if (url.includes('embed/')) return url;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return url;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER BANNER */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border-4 border-slate-900 shadow-[6px_6px_6px_0px_rgba(0,0,0,0.3)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-300 text-slate-950 text-xs font-black uppercase tracking-widest border border-slate-900">
              <FileText className="w-3.5 h-3.5 fill-slate-950" />
              <span>Interactive Reading & Video Module</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-white uppercase tracking-tight">{activeMaterial.topicTitle}</h1>
            <p className="text-xs sm:text-sm text-slate-300 font-bold uppercase tracking-wider">{activeMaterial.introduction}</p>
          </div>

          <div className="flex items-center gap-2 bg-blue-300 border-2 border-slate-900 text-slate-950 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shrink-0">
            <Award className="w-4 h-4 fill-slate-950" />
            <span>Mastery: {studentProgress.topicMastery[activeMaterial.topicId] || 75}%</span>
          </div>
        </div>

        {/* Subject Pills Horizontal Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 no-scrollbar">
          {ALL_SUBJECTS.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubjectId(sub.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition whitespace-nowrap shrink-0 border-2 border-slate-900 dark:text-black ${selectedSubjectId === sub.id
                ? 'bg-blue-200 text-slate-150 shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]'
                : 'bg-slate-400 text-slate-100 hover:bg-slate-100'
                }`}
            >
              {sub.name}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT: TEXT EXPLANATION & VIDEO PLAYER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT 2 COLS: DETAILED TOPIC TEXT, FORMULAS & SOLVED EXAMPLES */}
        <div className="lg:col-span-2 space-y-8">
          {/* Detailed Markdown Content Box */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-4 border-slate-900 shadow-[6px_6px_6px_0px_rgba(0,0,0,0.3)] space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b-2 border-slate-900  dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white border-2 border-slate-900 flex items-center justify-center font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Core Topic Explanation</h2>
            </div>

            <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-sm font-medium leading-relaxed space-y-4 whitespace-pre-line">
              {activeMaterial.contentMarkdown}
            </div>

            {/* Key Formulas Section */}
            {activeMaterial.keyFormulas && activeMaterial.keyFormulas.length > 0 && (
              <div className="p-5 rounded-2xl bg-amber-100 dark:bg-slate-800 border-2 border-slate-900 space-y-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-amber-400 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 fill-amber-500 text-slate-900" />
                  <span>Key Formulas & Memory Aids</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeMaterial.keyFormulas.map((f, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-900 space-y-1 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                    >
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">{f.name}</span>
                      <code className="text-sm font-mono font-black text-blue-600 dark:text-blue-400 block">
                        {f.formula}
                      </code>
                      <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 block">{f.note}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Built-in Gemini AI Tutor Card inside Reading Mode */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border-4 border-slate-900 shadow-[6px_6px_6px_0px_rgba(0,0,0,0.3)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-400 text-slate-950 border-2 border-slate-900 flex items-center justify-center font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  <Sparkles className="w-5 h-5 fill-slate-950" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-white">AI Reading Assistant</h2>
                  <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Have a question about {activeMaterial.topicTitle}?</p>
                </div>
              </div>

              <button
                onClick={() => openAiModalForQuestion({ question: `Explain the concept of ${activeMaterial.topicTitle} in simple terms with an example for secondary school candidates.`, subject: selectedSubjectId })}
                className="px-4 py-2 bg-green-400 hover:bg-green-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] transition flex items-center gap-1.5 shrink-0"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>Launch Deep AI Explanation</span>
              </button>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border-2 border-slate-800 text-xs font-semibold text-slate-300 space-y-2">
              <span className="text-amber-400 font-black uppercase text-[10px] tracking-widest block">Pro-Tip for Candidates:</span>
              <p>
                You can ask the AI Tutor to break down difficult formulas, generate additional practice problems, or explain OAU Post-UTME tricks for <strong>{activeMaterial.topicTitle}</strong>.
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-4 border-slate-900 shadow-[6px_6px_6px_0px_rgba(0,0,0,0.3)] space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b-2 border-slate-900 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-blue-400 text-slate-950 border-2 border-slate-900 flex items-center justify-center font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                <Sparkles className="w-5 h-5 fill-slate-950" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Step-by-Step Solved Questions</h2>
            </div>

            <div className="space-y-4">
              {activeMaterial.workedExamples.map((example, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-900 space-y-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
                >
                  <h4 className="font-black text-xs uppercase tracking-widest text-blue-600 dark:text-blue-400">{example.title}</h4>
                  <p className="text-xs font-black text-slate-900 dark:text-slate-100">{example.question}</p>
                  <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-900 text-xs text-slate-800 dark:text-slate-200 font-mono whitespace-pre-line leading-relaxed font-semibold">
                    {example.solution}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* END-OF-SECTION PRACTICE QUIZ */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-4 border-slate-900 shadow-[6px_6px_6px_0px_rgba(0,0,0,0.3)] space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b-2 border-slate-900 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white border-2 border-slate-900 flex items-center justify-center font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">End-of-Section Practice Test</h2>
            </div>

            <div className="space-y-6">
              {activeMaterial.quickQuiz.map((q) => {
                const selected = quizAnswers[q.id];
                const submitted = quizSubmitted[q.id];

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-900 space-y-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
                  >
                    <p className="font-black text-sm text-slate-900 dark:text-white">{q.question}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, oIdx) => {
                        const isChosen = selected === oIdx;
                        const isCorrectOpt = oIdx === q.correctIndex;

                        let style =
                          'bg-white dark:bg-slate-900 border-2 border-slate-900 text-slate-900 dark:text-slate-100 font-bold';

                        if (submitted) {
                          if (isCorrectOpt) {
                            style = 'bg-emerald-400 text-slate-950 border-2 border-slate-900 font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]';
                          } else if (isChosen) {
                            style = 'bg-rose-500 text-white border-2 border-slate-900 font-black';
                          }
                        } else if (isChosen) {
                          style = 'bg-blue-600 text-white border-2 border-slate-900 font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]';
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => !submitted && handleSelectQuizOption(q.id, oIdx)}
                            className={`p-3 rounded-xl text-xs text-left transition flex items-center justify-between ${style}`}
                          >
                            <span>{opt}</span>
                            {submitted && isCorrectOpt && <CheckCircle2 className="w-4 h-4 text-slate-950 shrink-0" />}
                            {submitted && isChosen && !isCorrectOpt && (
                              <XCircle className="w-4 h-4 text-white shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {!submitted ? (
                      <button
                        disabled={selected === undefined}
                        onClick={() => handleSubmitQuiz(q.id, q.correctIndex)}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] rounded-xl font-black text-xs uppercase tracking-widest transition"
                      >
                        Submit Answer
                      </button>
                    ) : (
                      <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 rounded-xl border-2 border-slate-900 text-xs text-slate-900 dark:text-emerald-200 font-medium">
                        <span className="font-black uppercase tracking-wider block mb-1">Explanation:</span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COL: VIDEO LESSON PLAYER & CUSTOM VIDEO INPUT (ROOM FOR VIDEO INPUT) */}
        <div className="space-y-6">
          {/* Embedded Video Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border-4 border-slate-900 shadow-[6px_6px_6px_0px_rgba(0,0,0,0.3)] space-y-4 sticky top-24">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-rose-600" />
                <h3 className="font-black text-slate-900 dark:text-white text-base uppercase tracking-tight">Video Lecture</h3>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-950 bg-amber-400 border border-slate-900 px-2 py-0.5 rounded">
                Interactive
              </span>
            </div>

            {/* Video Iframe Embed */}
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-900 shadow-md">
              <iframe
                src={getEmbedUrl(videoInput)}
                title="Lesson Video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* ROOM FOR VIDEO INPUT FORM */}
            <form onSubmit={handleSaveVideoUrl} className="space-y-2 pt-2 border-t-2 border-slate-900 dark:border-slate-800">
              <label className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
                <span>Video Input (Paste YouTube Embed URL)</span>
              </label>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={videoInput}
                  onChange={(e) => setVideoInput(e.target.value)}
                  placeholder="Paste YouTube video link here..."
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border-2 border-slate-900 rounded-xl text-xs font-bold dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] rounded-xl transition"
                >
                  Save Video URL
                </button>
              </div>
              {videoSaved && (
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Video updated!
                </span>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
