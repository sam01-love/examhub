import React, { useState, useEffect } from 'react';
import { X, Sparkles, Bot, Loader2, Send } from 'lucide-react';

interface AITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: {
    question?: string;
    options?: any[];
    correctAnswer?: string;
    userSelectedAnswer?: string;
    subject?: string;
  } | null;
}

export const AITutorModal: React.FC<AITutorModalProps> = ({ isOpen, onClose, context }) => {
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [customQuery, setCustomQuery] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);

  useEffect(() => {
    if (isOpen && context?.question) {
      fetchAiExplanation();
    }
  }, [isOpen, context]);

  const fetchAiExplanation = async () => {
    if (!context?.question) return;
    setLoading(true);
    setExplanation('');
    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: context.question,
          options: context.options,
          correctAnswer: context.correctAnswer,
          userSelectedAnswer: context.userSelectedAnswer,
          subject: context.subject,
        }),
      });

      const data = await res.json();
      if (data.explanation) {
        setExplanation(data.explanation);
        setChatHistory([{ role: 'assistant', text: data.explanation }]);
      } else if (data.fallbackExplanation) {
        setExplanation(data.fallbackExplanation);
      }
    } catch (e) {
      setExplanation('AI Tutor explanation unavailable right now. Please review the built-in step-by-step solution below.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendCustomQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim() || loading) return;

    const userText = customQuery;
    setCustomQuery('');
    setChatHistory((prev) => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${userText}\n(Context question: ${context?.question || 'General Study'})`,
          subject: context?.subject || 'Secondary Education',
        }),
      });

      const data = await res.json();
      if (data.text) {
        setChatHistory((prev) => [...prev, { role: 'assistant', text: data.text }]);
      }
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        { role: 'assistant', text: 'Sorry, I could not connect to EXAMHUB AI Tutor servers right now.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 border-4 border-slate-900 rounded-3xl shadow-[10px_10px_0px_0px_rgba(15,23,42,1)] w-full max-w-2xl h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-900 text-white border-b-4 border-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-400 text-slate-950 border border-slate-900">
              <Sparkles className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <h3 className="font-black text-lg leading-tight flex items-center gap-2 uppercase tracking-tight">
                EXAMHUB AI Tutor
                <span className="text-[10px] uppercase tracking-widest bg-emerald-400 text-slate-950 px-2 py-0.5 rounded border border-slate-900 font-black">
                  Gemini Powered
                </span>
              </h3>
              <p className="text-xs text-slate-300 font-bold uppercase tracking-wider">Instant step-by-step guidance & solution analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-slate-800 p-1.5 rounded-xl border-2 border-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50 dark:bg-slate-950">
          {context?.question && (
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-900 text-sm shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-1">
                Question Focus
              </span>
              <p className="text-slate-900 dark:text-slate-100 font-bold">{context.question}</p>
            </div>
          )}

          {loading && chatHistory.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500 space-y-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-xs font-black uppercase tracking-wider">Analyzing question & deriving step-by-step explanation...</p>
            </div>
          )}

          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 border-2 border-slate-900 flex items-center justify-center shrink-0 mt-1 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  <Bot className="w-5 h-5 fill-slate-950" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed font-bold border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && chatHistory.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider p-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span>AI Tutor is typing...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendCustomQuery} className="p-3 bg-white dark:bg-slate-900 border-t-4 border-slate-900 flex gap-2">
          <input
            type="text"
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            placeholder="Ask AI Tutor to clarify further or explain a specific formula..."
            className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 border-2 border-slate-900 rounded-xl text-xs font-bold focus:outline-hidden focus:border-amber-400 text-slate-900 dark:text-slate-100"
          />
          <button
            type="submit"
            disabled={!customQuery.trim() || loading}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white border-2 border-slate-900 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask</span>
          </button>
        </form>
      </div>
    </div>
  );
};
