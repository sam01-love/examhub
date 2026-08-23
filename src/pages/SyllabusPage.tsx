import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  ChevronDown,
  ChevronUp,
  FileText,
  HelpCircle,
  Sparkles,
  Flame,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ALL_SUBJECTS } from '../data/subjects';
import { SYLLABUS_DATA } from '../data/syllabusData';
import { SubjectId, ExamCategory } from '../types';

export const SyllabusPage: React.FC = () => {
  const { selectedSubjectId, setSelectedSubjectId, selectedExam, setSelectedExam, setActiveTab, setSelectedTopicId } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>('phy-1');

  // Filter topics for selected subject
  const currentSubject = ALL_SUBJECTS.find((s) => s.id === selectedSubjectId) || ALL_SUBJECTS[0];

  const topicsForSubject = SYLLABUS_DATA.filter((t) => t.subjectId === selectedSubjectId);

  const filteredTopics = topicsForSubject.filter(
    (t) =>
      t.topicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subtopics.some((st) => st.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleStudyTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
    setActiveTab('reading');
  };

  const handlePracticeTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
    setActiveTab('practice');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(37,99,235,1)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest border border-slate-900">
              <BookOpen className="w-3.5 h-3.5 fill-slate-950" />
              <span>Official NERDC & JAMB Syllabus</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">Syllabus Curriculum</h1>
            <p className="text-xs sm:text-sm text-slate-300 font-bold uppercase tracking-wider">
              Complete list of exam topics, sub-topic analyses, and importance ratings.
            </p>
          </div>

          {/* Exam Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border-2 border-slate-800 text-xs font-black">
            {(['JAMB', 'WAEC', 'POST_UTME'] as ExamCategory[]).map((ex) => (
              <button
                key={ex}
                onClick={() => setSelectedExam(ex)}
                className={`px-3 py-1.5 rounded-lg transition uppercase tracking-wider ${
                  selectedExam === ex
                    ? 'bg-blue-600 text-white shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {ex === 'POST_UTME' ? 'OAU Post-UTME' : ex}
              </button>
            ))}
          </div>
        </div>

        {/* Subject Pills Horizontal Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 no-scrollbar">
          {ALL_SUBJECTS.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubjectId(sub.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition whitespace-nowrap flex items-center gap-1.5 shrink-0 border-2 border-slate-900 ${
                selectedSubjectId === sub.id
                  ? 'bg-amber-400 text-slate-950 shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <span>{sub.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SEARCH AND TOPIC OVERVIEW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-slate-900 dark:text-white">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white border-2 border-slate-900 flex items-center justify-center font-black shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight">{currentSubject.name} Syllabus</h2>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{topicsForSubject.length} Core Modules</span>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-900 dark:text-slate-200" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search ${currentSubject.name} topics...`}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-800 rounded-xl text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-600 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] dark:text-white"
          />
        </div>
      </div>

      {/* TOPIC ACCORDION CARDS LIST */}
      <div className="space-y-4">
        {filteredTopics.length > 0 ? (
          filteredTopics.map((topic) => {
            const isExpanded = expandedTopicId === topic.id;

            return (
              <div
                key={topic.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-900 dark:border-slate-800 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] overflow-hidden transition"
              >
                {/* Topic Header Bar */}
                <div
                  onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                  className="p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-slate-900 dark:text-white text-lg uppercase tracking-tight">
                        {topic.topicName}
                      </h3>
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded border border-slate-900 ${
                          topic.frequency === 'High'
                            ? 'bg-rose-500 text-white'
                            : 'bg-amber-400 text-slate-950'
                        }`}
                      >
                        {topic.frequency} Frequency
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl">
                      {topic.description}
                    </p>
                  </div>

                  <button className="p-2 text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {/* Subtopic Expansion Content */}
                {isExpanded && (
                  <div className="p-5 bg-slate-50 dark:bg-slate-950 border-t-2 border-slate-900 dark:border-slate-800 space-y-5">
                    {/* Importance Note */}
                    <div className="p-3 bg-amber-400 border-2 border-slate-900 rounded-xl text-xs font-black text-slate-950 flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                      <Sparkles className="w-4 h-4 shrink-0 fill-slate-950" />
                      <span>{topic.importanceNote}</span>
                    </div>

                    {/* Subtopics List */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">
                        Sub-topic Breakdown ({topic.subtopics.length} Sub-modules)
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {topic.subtopics.map((st) => (
                          <div
                            key={st.id}
                            className="p-4 bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-900 dark:border-slate-800 space-y-2 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]"
                          >
                            <div className="font-black text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1.5 uppercase">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{st.name}</span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">{st.description}</p>
                            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Key Objectives:</span>
                              <ul className="space-y-0.5 text-xs font-semibold text-slate-700 dark:text-slate-300 list-disc list-inside">
                                {st.keyPoints.map((kp, idx) => (
                                  <li key={idx}>{kp}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Direct Action Buttons */}
                    <div className="pt-2 flex flex-wrap gap-3">
                      <button
                        onClick={() => handleStudyTopic(topic.id)}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] flex items-center gap-2 transition"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Read Topic Notes & Video</span>
                      </button>

                      <button
                        onClick={() => handlePracticeTopic(topic.id)}
                        className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-widest border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] flex items-center gap-2 transition"
                      >
                        <HelpCircle className="w-4 h-4 fill-slate-950" />
                        <span>Practice MCQs for this Topic</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-900 p-6 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]">
            <p className="text-slate-900 dark:text-slate-100 font-bold text-sm">
              No syllabus topic found matching "{searchTerm}" in {currentSubject.name}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
