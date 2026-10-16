import React from 'react';
import { Logo } from '../components/Logo';
import { Heart, ShieldCheck, Sparkles, Building, GraduationCap, Users } from 'lucide-react';

export const AboutUsPage: React.FC = () => {
  const founders = [
    {
      name: 'Shivansh Patel',
      role: 'Founder & Developer',
      institution: 'BPIT',
      initials: 'SP'
    },
    {
      name: 'Shourya Sharma',
      role: 'Co-Founder & Developer',
      institution: 'BPIT',
      initials: 'SS'
    },
    {
      name: 'Soham',
      role: 'Co-Founder & Designer',
      institution: 'BPIT',
      initials: 'S'
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
      </div>

      {/* Description Card (Exact copy from prompt Section 18) */}
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

      {/* Founders Section (Screen 14 Reference: Shivansh Patel, Shourya Sharma, Soham - BPIT) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-500" />
            Our Founders
          </h3>
          <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-500" /> BPIT
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {founders.map((f) => (
            <div
              key={f.name}
              className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-center space-y-2 hover:border-emerald-500 transition group"
            >
              {/* Neutral avatar illustration with initials as required by rules */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white font-black text-xl flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                {f.initials}
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {f.name}
                </h4>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                  {f.role}
                </p>
                <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-medium">
                  <GraduationCap className="w-3 h-3 text-slate-400" />
                  <span>{f.institution}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Closing Banner (Screen 14 Reference: Together for a kinder world) */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-900 text-white p-6 shadow-xl border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[11px] font-bold tracking-wider text-emerald-400 uppercase">
            Our Mission
          </span>
          <h3 className="text-xl font-extrabold italic">
            "Together for a kinder world."
          </h3>
          <p className="text-xs text-slate-300 max-w-sm">
            Empowering every citizen to become an animal rescue hero through intelligent technology and community compassion.
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
