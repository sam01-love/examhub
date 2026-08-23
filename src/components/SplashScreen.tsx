import React, { useEffect, useState } from 'react';
import { Logo } from './Logo';
import { ShieldCheck, Play } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing EXAMHUB Platform...');
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const stages = [
      { at: 15, text: 'Loading Question Datasets & Syllabuses...' },
      { at: 35, text: 'Configuring JAMB, WAEC & OAU CBT Engines...' },
      { at: 65, text: 'Initializing AI Study Assistant & Security...' },
      { at: 88, text: 'Finalizing Student & Admin Environment...' },
      { at: 100, text: 'Welcome to EXAMHUB!' },
    ];

    // Smooth unhurried 3-second loader
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }

        const next = prev + Math.floor(Math.random() * 6) + 4;
        const currentProgress = next > 100 ? 100 : next;

        const stage = stages.find((s) => currentProgress <= s.at) || stages[stages.length - 1];
        setLoadingText(stage.text);

        return currentProgress;
      });
    }, 110);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          onComplete();
        }, 500);
      }, 400);

      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  const handleSkip = () => {
    setFadeOut(true);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-6 transition-opacity duration-500 select-none ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
    >
      {/* Subtle Ambient Background Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-xl mx-auto space-y-8">
        {/* Large Centralized Official Logo Image */}
        <div className="transform scale-100 sm:scale-110 transition duration-300 py-2">
          <Logo size="xl" />
        </div>

        {/* Moving Progress Bar & Loading Indicator */}
        <div className="w-full max-w-xs sm:max-w-md space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700">
            <span className="flex items-center gap-2 text-blue-600">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
              </span>
              <span className="font-extrabold tracking-widest">loading...</span>
            </span>
            <span className="text-slate-900 font-extrabold text-sm">{progress}%</span>
          </div>

          {/* Animated Moving Progress Bar */}
          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-300 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 rounded-full transition-all duration-150 ease-out shadow-xs"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Dynamic Loading Step Text */}
          <p className="text-xs font-bold text-slate-600 h-5 transition-all duration-150">
            {loadingText}
          </p>
        </div>

        {/* Enter Early Button
        <div className="pt-2">
          <button
            onClick={handleSkip}
            className="px-5 py-2.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-300 transition flex items-center gap-2 shadow-xs"
          >
            <span>Enter EXAMHUB Homepage</span>
            <Play className="w-3.5 h-3.5 fill-current" />
          </button>
        </div> */}

        {/* Security Standards Badge */}
        <div className="pt-4 flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Official Nigerian Examination CBT Standards</span>
        </div>
      </div>
    </div>
  );
};
