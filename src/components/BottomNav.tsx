import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PlusCircle, Map, Compass, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const tabs = [
    { to: '/home', label: 'Home', icon: Home },
    { to: '/report', label: 'Rescue', icon: PlusCircle, isPrimary: true },
    { to: '/map', label: 'Map', icon: Map },
    { to: '/wildlife', label: 'Explore', icon: Compass },
    { to: '/profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 pb-safe">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          if (tab.isPrimary) {
            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center -mt-5 transition-transform active:scale-95 ${
                    isActive ? 'scale-105' : ''
                  }`
                }
              >
                <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 border-4 border-white dark:border-slate-900">
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {tab.label}
                </span>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`
              }
            >
              <Icon className="w-5 h-5 stroke-[2]" />
              <span className="text-[10px] mt-1">{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
