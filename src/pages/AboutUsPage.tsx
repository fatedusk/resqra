import React from 'react';
import { Logo } from '../components/Logo';
import { Heart, ShieldCheck, Sparkles, GraduationCap, User, GitPullRequest, Terminal } from 'lucide-react';

export const AboutUsPage: React.FC = () => {
  const founders = [
    {
      name: 'Shivansh Patel',
      role: 'Founder & Lead Developer',
      institution: 'BPIT',
      initials: 'SP',
      bio: 'Architected full-stack ResQra orchestration, database schemas, and AI agent rescue pipelines.'
    }
  ];

  return (
    <div className="pb-28 pt-4 px-4 sm:px-6 max-w-2xl mx-auto space-y-6">
      {/* Header Branding (Screen 14 Reference) */}
      <div className="text-center pt-2 space-y-2">
        <div className="flex justify-center mb-3">
          <Logo size="lg" showTagline={true} />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          About ResQra
        </h2>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
          🌐 Open to Open Source Contribution
        </span>
      </div>

      {/* Description Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm leading-relaxed text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-3">
        <p>
          ResQra is an animal welfare initiative focused on connecting people, rescue organisations, and veterinary services through technology. We aim to make animal reporting, emergency guidance, adoption discovery, and community coordination easier and more accessible.
        </p>
        <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> AI Triage Agent
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> NGO Dispatch Network
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
            <Heart className="w-3.5 h-3.5" /> Verified Welfare
          </span>
        </div>
      </div>

      {/* Founder Section (Shivansh Patel — BPIT) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-500" />
            Founder & Developer
          </h3>
          <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-500" /> BPIT
          </span>
        </div>

        <div className="max-w-md mx-auto w-full">
          {founders.map((f) => (
            <div
              key={f.name}
              className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-center space-y-3 hover:border-emerald-500 transition group"
            >
              {/* Neutral avatar illustration with initials */}
              <div className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                {f.initials}
              </div>

              <div>
                <h4 className="font-bold text-lg text-slate-900 dark:text-white">
                  {f.name}
                </h4>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                  {f.role}
                </p>
                <div className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-medium">
                  <GraduationCap className="w-3 h-3 text-slate-400" />
                  <span>{f.institution}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                  {f.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Powered by Google Antigravity & Open Source Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Terminal className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                Built with Google Antigravity
              </h4>
              <p className="text-[11px] text-slate-400">Advanced Agentic AI Assistant</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Agentic AI
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          ResQra was designed, architected, and pair-programmed using <strong>Google Antigravity</strong>. Antigravity helped formulate the 7-tool rescue agent, deterministic medical safety guardrails, spatial clustering algorithms, and the multi-theme design system.
        </p>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <GitPullRequest className="w-3.5 h-3.5" /> Open to Open Source Contribution
          </span>
          <span className="text-slate-400 text-[11px]">MIT License</span>
        </div>
      </div>

      {/* Closing Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-900 text-white p-6 shadow-xl border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[11px] font-bold tracking-wider text-emerald-400 uppercase">
            Our Mission
          </span>
          <h3 className="text-xl font-extrabold italic">
            "Together for a kinder world."
          </h3>
          <p className="text-xs text-slate-300 max-w-sm">
            Empowering every citizen to become an animal rescue hero through intelligent technology, open-source collaboration, and community compassion.
          </p>
        </div>

        <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/20 shadow-md flex-shrink-0">
          <img
            src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=400&q=80"
            alt="Animals"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
