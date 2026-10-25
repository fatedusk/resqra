import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const WelcomePage: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col justify-between items-center px-4 py-8 max-w-md mx-auto text-center relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header Branding */}
      <div className="pt-3 flex flex-col items-center">
        <div className="mb-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold shadow-sm">
          <span>🌐 Open to Open Source Contribution</span>
        </div>
        <Logo size="lg" showTagline={true} />
      </div>

      {/* Hero Visual Card */}
      <div className="my-6 w-full relative group">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-500/20 bg-slate-100 dark:bg-slate-800/80">
          <img
            src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80"
            alt="Rescue Dog"
            className="w-full h-80 object-cover object-center transform group-hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-5">
            <div className="text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-bold shadow-md">
                <Sparkles className="w-3.5 h-3.5" /> AI Powered Welfare
              </span>
              <p className="text-white text-xs font-medium mt-1.5 opacity-90">
                Connected with 23+ verified NGOs and emergency vet clinics in Delhi NCR.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="space-y-3 px-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          A safer world for <span className="text-emerald-500">all animals</span>
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xs mx-auto leading-relaxed">
          Report. Get Help. Adopt. Support. Together we can make a difference.
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="w-full space-y-3 pt-6">
        <Link
          to="/home"
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-bold text-base shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 group transition transform active:scale-98"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/profile"
          className="w-full py-3 px-6 rounded-2xl border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md text-slate-700 dark:text-slate-200 font-semibold text-sm flex items-center justify-center transition"
        >
          Login
        </Link>
      </div>

      {/* Theme Quick Bar */}
      <div className="pt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
        <span>Theme:</span>
        <button
          onClick={() => setTheme('light')}
          className={`px-2 py-0.5 rounded-md ${theme === 'light' ? 'bg-emerald-500 text-white font-bold' : 'hover:text-slate-600'}`}
        >
          Light
        </button>
        <span>•</span>
        <button
          onClick={() => setTheme('dark')}
          className={`px-2 py-0.5 rounded-md ${theme === 'dark' ? 'bg-emerald-500 text-white font-bold' : 'hover:text-slate-600'}`}
        >
          Dark
        </button>
        <span>•</span>
        <button
          onClick={() => setTheme('liquid-glass')}
          className={`px-2 py-0.5 rounded-md ${theme === 'liquid-glass' ? 'bg-emerald-500 text-white font-bold' : 'hover:text-slate-600'}`}
        >
          Liquid Glass
        </button>
      </div>
    </div>
  );
};
