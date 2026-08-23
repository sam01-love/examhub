import React from 'react';
import officialLogo from '../assets/images/examhub_official_logo_1786611968084.jpg';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  lightText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  lightText = false,
  className = '',
}) => {
  const heightMap = {
    sm: 'h-14 sm:h-12',
    md: 'h-20 sm:h-20',
    lg: 'h-24 sm:h-24',
    xl: 'h-32 sm:h-36 md:h-32',
  };

  const containerHeight = heightMap[size];

  return (
    <div
      className={`inline-flex items-center justify-center transition-all ${lightText ? 'bg-white/95 p-2 sm:p-2.5 rounded-2xl shadow-sm border border-slate-700/50' : ''
        } ${className}`}
    >
      <img
        src={officialLogo}
        alt="EXAMHUB - LEARN • PRACTICE • PASS • SUCCEED"
        className={`${containerHeight} w-auto object-contain shrink-0`}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
