import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Send, Bot, User, BookOpen, Lightbulb, Zap, HelpCircle } from 'lucide-react';

export const AITutorPage: React.FC = () => {
  const { selectedSubjectId, selectedExam } = useApp();
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: `Hello! I am your EXAMHUB Gemini AI Study Partner. How can I help you master ${selectedExam} questions today?`,
      time: 'Just now',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputPrompt;
    if (!textToSend.trim() || isGenerating) return;

    const userMsg = { sender: 'user' as const, text: textToSend, time: 'Just now' };
    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputPrompt('');
    setIsGenerating(true);

    try {
      const response = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          subject: selectedSubjectId,
          examCategory: selectedExam,
        }),
      });

      const data = await response.json();
      const aiReply = data.reply || `Here is an explanation for ${selectedExam} candidates: Breakdown of concepts and step-by-step formula analysis.`;

      setMessages((prev) => [...prev, { sender: 'ai', text: aiReply, time: 'Just now' }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Key Concept Analysis (${selectedExam}):\n1. Formula Identification\n2. Substitution of values\n3. Verification of units and final answer.`,
          time: 'Just now',
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const quickPrompts = [
    `Explain the most repeated ${selectedExam} Physics questions`,
    `How to solve Chemistry stoichiometry in 30 seconds`,
    `OAU Post-UTME Mathematics shortcuts & time tricks`,
    `Key Concord rules for JAMB Use of English`,
  ];

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* BANNER */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(245,158,11,1)] space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest border border-slate-900">
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>Gemini AI Tutor Workspace</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">Interactive AI Study Partner</h1>
        <p className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider">
          Ask any question about JAMB UTME, WAEC SSCE, or OAU Post-UTME syllabus topics and receive instant step-by-step guidance.
        </p>
      </div>

      {/* QUICK PROMPTS */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-black uppercase text-slate-500 mr-2">Quick Prompts:</span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(qp)}
            className="px-3.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-black text-xs uppercase rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* CHAT CONTAINER */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] overflow-hidden flex flex-col h-[520px]">
        <div className="p-4 bg-slate-900 text-white font-black text-xs uppercase tracking-widest flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-amber-400" />
            <span>AI Tutor Active Session</span>
          </div>
          <span className="px-2 py-0.5 bg-emerald-400 text-slate-950 text-[10px] rounded font-black">
            Gemini 2.5 Engine
          </span>
        </div>

        {/* MESSAGES LOG */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-9 h-9 rounded-xl border-2 border-slate-900 flex items-center justify-center font-black shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-amber-400 text-slate-950'
                }`}
              >
                {m.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              <div
                className={`p-4 rounded-2xl border-2 border-slate-900 max-w-xl space-y-1 text-xs font-bold leading-relaxed whitespace-pre-line ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]'
                }`}
              >
                <p>{m.text}</p>
                <span className="text-[9px] opacity-70 uppercase block text-right">{m.time}</span>
              </div>
            </div>
          ))}

          {isGenerating && (
            <div className="flex items-center gap-2 text-xs font-black text-amber-500 animate-pulse">
              <Bot className="w-4 h-4" />
              <span>Gemini AI Tutor is generating solution...</span>
            </div>
          )}
        </div>

        {/* CHAT INPUT BAR */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-4 bg-slate-100 dark:bg-slate-800 border-t-2 border-slate-900 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder={`Ask AI Tutor about ${selectedExam} questions...`}
            className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden"
          />
          <button
            type="submit"
            disabled={isGenerating || !inputPrompt.trim()}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black text-xs uppercase tracking-widest rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] flex items-center gap-1.5 transition"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
