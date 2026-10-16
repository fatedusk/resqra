import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Check, Sparkles, Sun, Moon, Droplets } from 'lucide-react';
import { AppTheme } from '../types';

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme, useSystemTheme, setUseSystemTheme } = useTheme();

  const themes: Array<{
    id: AppTheme;
    name: string;
    description: string;
    icon: any;
    previewBg: string;
    cardBg: string;
    accentBg: string;
  }> = [
    {
      id: 'light',
      name: 'Light',
      description: 'Crisp clean surfaces with fresh teal and emerald accents.',
      icon: Sun,
      previewBg: 'bg-slate-100',
      cardBg: 'bg-white border-slate-200',
      accentBg: 'bg-teal-500'
    },
    {
      id: 'dark',
      name: 'Dark',
      description: 'Deep midnight palette with vibrant emerald highlights.',
      icon: Moon,
      previewBg: 'bg-slate-900',
      cardBg: 'bg-slate-800 border-slate-700',
      accentBg: 'bg-emerald-400'
    },
    {
      id: 'liquid-glass',
      name: 'Liquid Glass',
      description: 'Translucent glassmorphic surfaces with luminous ambient depth.',
      icon: Droplets,
      previewBg: 'bg-gradient-to-br from-teal-900 via-slate-900 to-emerald-950',
      cardBg: 'bg-white/10 backdrop-blur-md border-white/20',
      accentBg: 'bg-gradient-to-r from-teal-400 to-emerald-400'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          Choose Visual Theme
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Select your preferred appearance. Changes apply across the entire interface.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {themes.map((t) => {
          const isSelected = theme === t.id && !useSystemTheme;
          const Icon = t.icon;

          return (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`relative text-left p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between group ${
                isSelected
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10 shadow-md'
                  : 'border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/60'
              }`}
            >
              {/* Mini visual mockup box */}
              <div
                className={`w-full h-20 rounded-xl mb-3 p-2 relative overflow-hidden flex flex-col justify-between border ${t.previewBg} ${
                  t.id === 'liquid-glass' ? 'border-white/20' : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                {t.id === 'liquid-glass' && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 via-emerald-500/20 to-transparent pointer-events-none" />
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  </div>
                  <span className={`w-3 h-3 rounded-full ${t.accentBg}`} />
                </div>
                <div className={`p-1.5 rounded-lg border text-[10px] font-medium flex items-center gap-1 ${t.cardBg}`}>
                  <Icon className="w-3 h-3 text-emerald-500" />
                  <span className="truncate">{t.name} Mode</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    {t.name}
                  </span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow-sm">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {t.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Use System Theme Toggle */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
        <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
          <div>
            <span className="text-sm font-medium text-slate-900 dark:text-white block">
              Use System Theme
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Follow your device's light or dark mode settings automatically.
            </span>
          </div>
          <div className="relative inline-flex items-center">
            <input
              type="checkbox"
              checked={useSystemTheme}
              onChange={(e) => setUseSystemTheme(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </div>
        </label>
      </div>
    </div>
  );
};
