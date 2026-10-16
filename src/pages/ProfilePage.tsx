import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  FileText,
  Heart,
  Bookmark,
  Coins,
  Settings,
  HelpCircle,
  Info,
  LogOut,
  LogIn,
  ChevronRight,
  Shield,
  Sparkles,
  CheckCircle2,
  Mail
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeSelector } from '../components/ThemeSelector';
import { Logo } from '../components/Logo';

export const ProfilePage: React.FC = () => {
  const { user, login, logout, switchRole } = useAuth();
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [privacyMaskGps, setPrivacyMaskGps] = useState(false);
  const [logoutNotice, setLogoutNotice] = useState(false);

  // Login form state for logged out view
  const [loginEmail, setLoginEmail] = useState('shivansh@example.com');
  const [loginName, setLoginName] = useState('Shivansh Patel');

  const menuItems = [
    { label: 'My Reports', icon: FileText, to: '/home', badge: '1 Active' },
    { label: 'My Pets', icon: Heart, to: '/pets', badge: '1 Registered' },
    { label: 'Saved Articles', icon: Bookmark, to: '/news', badge: '1 Saved' },
    { label: 'Donations', icon: Coins, to: '/fundraisers', badge: '₹5,000' },
    { label: 'Help & Support', icon: HelpCircle, to: '/about' },
    { label: 'About Us', icon: Info, to: '/about' }
  ];

  const handleLogout = () => {
    logout();
    setLogoutNotice(true);
    setTimeout(() => setLogoutNotice(false), 4000);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(loginEmail, loginName);
    setLogoutNotice(false);
  };

  return (
    <div className="pb-28 pt-4 px-4 sm:px-6 max-w-xl mx-auto space-y-4">
      {/* Logout Success Feedback Banner */}
      {logoutNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>You have successfully logged out of your ResQra session.</span>
        </div>
      )}

      {user ? (
        /* LOGGED IN VIEW */
        <>
          {/* User Avatar Card (Screen 12 Reference) */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-emerald-500/20">
                {user.fullName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    {user.fullName}
                  </h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                    {user.role === 'responder' ? 'Verified Responder' : 'Community Member'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                  Institution: {user.institution || 'BPIT'}
                </p>
              </div>
            </div>
          </div>

          {/* Role Switcher (For demo/testing purposes) */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-400 font-medium">
              Simulate User Role:
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => switchRole('user')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                  user.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                Citizen
              </button>
              <button
                onClick={() => switchRole('responder')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                  user.role === 'responder' ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                Responder
              </button>
            </div>
          </div>

          {/* Menu List Items (Screen 12 Reference) */}
          <div className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-700/60">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/40 transition group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center group-hover:text-emerald-500 transition-colors">
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })}

            {/* Settings Accordion Toggle */}
            <button
              onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
              className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/40 transition group text-left"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center group-hover:text-emerald-500 transition-colors">
                  <Settings className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Settings & Themes
                </span>
              </div>
              <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${showSettingsDrawer ? 'rotate-90' : ''}`} />
            </button>
          </div>

          {/* Settings Panel & Visual Theme Selector (Screen 13 Reference) */}
          {showSettingsDrawer && (
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-4 animate-in fade-in">
              <ThemeSelector />

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                  Privacy & Notification Preferences
                </h4>

                <label className="flex items-center justify-between cursor-pointer py-1">
                  <span className="text-slate-600 dark:text-slate-300">Push Notifications for Urgent Alerts</span>
                  <input
                    type="checkbox"
                    checked={pushNotifications}
                    onChange={(e) => setPushNotifications(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer py-1">
                  <span className="text-slate-600 dark:text-slate-300">Obfuscate Precise GPS Coordinates</span>
                  <input
                    type="checkbox"
                    checked={privacyMaskGps}
                    onChange={(e) => setPrivacyMaskGps(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Logout Button (Screen 12 Reference) */}
          <button
            onClick={handleLogout}
            className="w-full py-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-2 border border-rose-200 dark:border-rose-900/50 transition cursor-pointer active:scale-98"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout from ResQra</span>
          </button>
        </>
      ) : (
        /* LOGGED OUT VIEW / SIGN IN FORM */
        <div className="space-y-4 animate-in fade-in">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md text-center space-y-4">
            <div className="flex justify-center">
              <Logo size="md" showTagline={true} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Sign in to ResQra
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Access your reports, pet vaccination tracker, community alerts, and responder tools.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3 text-left text-xs pt-1">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  placeholder="e.g. Shivansh Patel"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. shivansh@example.com"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer mt-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Account</span>
              </button>
            </form>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => login('shivansh@example.com', 'Shivansh Patel')}
                className="w-full py-2.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>Quick Login as Shivansh (BPIT Responder)</span>
              </button>
            </div>
          </div>

          {/* Settings & Theme Selector is still fully available even when logged out */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <ThemeSelector />
          </div>
        </div>
      )}
    </div>
  );
};
