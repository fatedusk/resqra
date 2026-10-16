import React from 'react';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', showTagline = false, size = 'md' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Original Paw + Heart SVG Icon */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-2 shadow-md shadow-emerald-500/20 text-white ${iconSizes[size]}`}>
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-sm">
          {/* Paw pads arranged with heart shape base */}
          <ellipse cx="6.5" cy="8" rx="2.2" ry="3" />
          <ellipse cx="11.5" cy="5.5" rx="2.2" ry="3.2" />
          <ellipse cx="16.5" cy="7" rx="2.2" ry="3" />
          <ellipse cx="20" cy="11.5" rx="2" ry="2.6" />
          {/* Main paw pad with embedded heart contour */}
          <path d="M12 21.5c-4.5 0-8-3.2-8-6.5 0-2.4 1.8-4.2 3.8-4.2 1.4 0 2.8.8 4.2 2.2 1.4-1.4 2.8-2.2 4.2-2.2 2 0 3.8 1.8 3.8 4.2 0 3.3-3.5 6.5-8 6.5z" opacity="0.95" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-bold tracking-tight text-slate-900 dark:text-white ${textSizes[size]}`}>
            Res<span className="text-emerald-500">Q</span>ra
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
        {showTagline && (
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 -mt-1 tracking-wide">
            Every Life Deserves a Rescue.
          </span>
        )}
      </div>
    </div>
  );
};
