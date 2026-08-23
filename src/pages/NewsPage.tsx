import React, { useState } from 'react';
import { Newspaper, Search, Calendar, Tag, ExternalLink, Sparkles, Pin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NEWS_ITEMS } from '../data/newsData';

export const NewsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const filteredNews = NEWS_ITEMS.filter((news) => {
    const matchCategory = categoryFilter === 'All' || news.examCategory === categoryFilter;
    const matchSearch =
      news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.fullContent.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* HEADER BANNER */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(16,185,129,1)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-400 text-slate-950 text-xs font-black uppercase tracking-widest border border-slate-900">
              <Newspaper className="w-3.5 h-3.5 fill-slate-950" />
              <span>Live Educational News Portal</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">Exam News & OAU Updates</h1>
            <p className="text-xs sm:text-sm text-slate-300 font-bold uppercase tracking-wider">
              Verified announcements on JAMB registration, OAU Post-UTME cutoff marks, WAEC timetables & admission tips.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800 p-2 rounded-2xl border-2 border-slate-900 text-xs font-black">
            {['All', 'JAMB', 'POST_UTME', 'WAEC'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl uppercase tracking-wider transition border ${
                  categoryFilter === cat
                    ? 'bg-amber-400 text-slate-950 font-black border-slate-900 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]'
                    : 'text-slate-300 border-transparent hover:text-white'
                }`}
              >
                {cat === 'POST_UTME' ? 'OAU' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative pt-2">
          <Search className="w-4 h-4 absolute left-3.5 top-6 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search news articles, cutoff marks, OAU screening updates..."
            className="w-full pl-10 pr-4 py-3 bg-slate-950 border-2 border-slate-700 rounded-2xl text-xs font-bold text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-400"
          />
        </div>
      </div>

      {/* NEWS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredNews.map((news) => (
          <div
            key={news.id}
            className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] space-y-4 transition flex flex-col justify-between ${
              news.isImportant
                ? 'bg-emerald-50/20 dark:bg-emerald-950/20'
                : ''
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded border border-slate-900 bg-amber-400 text-slate-950">
                  {news.examCategory === 'POST_UTME' ? 'OAU Post-UTME' : news.examCategory}
                </span>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{news.date}</span>
                  {news.isImportant && (
                    <span className="flex items-center gap-1 text-rose-600 font-black ml-1 uppercase">
                      <Pin className="w-3.5 h-3.5 fill-rose-600" /> Important
                    </span>
                  )}
                </div>
              </div>

              <h3 className="font-black text-slate-900 dark:text-white text-lg leading-snug uppercase tracking-tight">{news.title}</h3>

              <p className="text-xs text-slate-700 dark:text-slate-300 font-bold leading-relaxed">{news.summary}</p>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 space-y-2 leading-relaxed whitespace-pre-line shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                {news.fullContent}
              </div>
            </div>

            <div className="pt-3 border-t-2 border-slate-900 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-bold">
              <span>Source: {news.source}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-wider flex items-center gap-1">
                Verified News <Sparkles className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
