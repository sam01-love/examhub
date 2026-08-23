import React from 'react';
import { Sparkles, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  const { setActiveTab, setSelectedExam, userRole, triggerSplash } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand Logo */}
          <div className="space-y-4 md:col-span-1">
            <Logo size="md" lightText={true} />
            <p className="text-xs font-medium text-slate-400 leading-relaxed pt-2">
              Standard CBT MCQ simulation, syllabus breakdown, interactive video-embedded reading mode, practice questions, and result analytics for JAMB, WAEC, and OAU Post-UTME.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 fill-emerald-400" />
              <span>OAU Post-UTME Specialist</span>
            </div>
          </div>

          {/* Col 2: Exam Target Shortcuts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Exam Targets</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li>
                <button
                  onClick={() => {
                    setSelectedExam('JAMB');
                    if (userRole === 'public') setActiveTab('login');
                    else setActiveTab('cbt');
                  }}
                  className="hover:text-blue-400 transition flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                  <span>JAMB UTME CBT (4 Subjects)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedExam('POST_UTME');
                    if (userRole === 'public') setActiveTab('login');
                    else setActiveTab('cbt');
                  }}
                  className="hover:text-emerald-400 transition flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                  <span>OAU Post-UTME Screening</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedExam('WAEC');
                    if (userRole === 'public') setActiveTab('login');
                    else setActiveTab('cbt');
                  }}
                  className="hover:text-blue-400 transition flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                  <span>WAEC SSCE Prep</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Quick Links</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-white transition">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('tutorials')} className="hover:text-white transition">
                  Tutorials & Syllabuses
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-white transition">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('contact')} className="hover:text-white transition">
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Account Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Portal Access</h4>
            <p className="text-xs font-medium text-slate-400">
              Log in with your candidate or administrator account to enter the student study environment or admin center.
            </p>
            <button
              onClick={() => setActiveTab('login')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase rounded-xl transition shadow-xs"
            >
              Portal Login
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 font-medium">
          © {new Date().getFullYear()} EXAMHUB Nigeria. All rights reserved. Built for JAMB, WAEC, and OAU Post-UTME candidates.
        </div>
      </div>
    </footer>
  );
};
