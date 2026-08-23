import React from 'react';
import { Logo } from '../components/Logo';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Award,
  Users,
  Target,
  GraduationCap,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <div className="space-y-12 pb-16 max-w-5xl mx-auto">
      {/* HERO BANNER - White Canvas, Blue & Green Accents */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 font-bold uppercase text-xs tracking-widest">
          Empowering Nigerian Candidates
        </div>
        
        <div className="flex justify-center my-4">
          <Logo size="xl" />
        </div>

        <p className="text-base sm:text-xl font-medium text-slate-600 max-w-3xl mx-auto leading-relaxed">
          EXAMHUB is Nigeria's premier examination prep platform designed to empower every candidate to excel in JAMB UTME, WAEC SSCE, and OAU Post-UTME through intelligent study tools and interactive CBT simulation.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setActiveTab('register')}
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition flex items-center gap-2"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTab('tutorials')}
            className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition"
          >
            Explore Syllabuses
          </button>
        </div>
      </div>

      {/* CORE VALUES & MISSION */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
            Our Purpose
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 uppercase tracking-tight">
            Why EXAMHUB Exists
          </h2>
          <p className="text-xs sm:text-sm font-medium text-slate-500 max-w-xl mx-auto uppercase tracking-wider">
            Built with dedication to simplify candidate preparation and maximize exam success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Symbol 1: Location Pin */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 uppercase tracking-tight">
              One Stop Destination
            </h3>
            <p className="text-xs font-medium text-slate-600 leading-relaxed">
              Serving as the central, comprehensive hub for all entrance and national examination needs across Nigeria.
            </p>
          </div>

          {/* Symbol 2: Open Book */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 uppercase tracking-tight">
              Verified Syllabus Material
            </h3>
            <p className="text-xs font-medium text-slate-600 leading-relaxed">
              Curated study notes, step-by-step solved past questions, and video lectures matching official syllabuses.
            </p>
          </div>

          {/* Symbol 3: Checkmark */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 uppercase tracking-tight">
              Guaranteed CBT Success
            </h3>
            <p className="text-xs font-medium text-slate-600 leading-relaxed">
              Real-time score analytics, realistic time-bound exam simulation, and AI-driven weak topic remediation.
            </p>
          </div>
        </div>
      </div>

      {/* STUDENT JOURNEY (4 STEPS) */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
            The Pathway to Admission
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 uppercase tracking-tight">
            Student Journey
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <span className="px-3 py-1 bg-blue-600 text-white font-bold text-[10px] uppercase rounded">
              Step 01
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 uppercase">01. LEARN</h3>
            <p className="text-xs font-medium text-slate-600">
              Access quality video tutorials, comprehensive syllabus notes, and Gemini AI Tutor explanations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <span className="px-3 py-1 bg-blue-600 text-white font-bold text-[10px] uppercase rounded">
              Step 02
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 uppercase">02. PRACTICE</h3>
            <p className="text-xs font-medium text-slate-600">
              Solve thousands of verified past questions for JAMB, WAEC, and Post-UTME with worked steps.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <span className="px-3 py-1 bg-emerald-600 text-white font-bold text-[10px] uppercase rounded">
              Step 03
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 uppercase">03. PASS</h3>
            <p className="text-xs font-medium text-slate-600">
              Master speed, accuracy, and test timing inside our full-scale simulated CBT exam environment.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <span className="px-3 py-1 bg-emerald-600 text-white font-bold text-[10px] uppercase rounded">
              Step 04
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 uppercase">04. SUCCEED</h3>
            <p className="text-xs font-medium text-slate-600">
              Achieve top percentile scores, secure university admission, and build a brighter future.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
