import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Building2,
  Stethoscope,
  Heart,
  Compass,
  Coins,
  ArrowRight,
  MapPin,
  Clock,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { api } from '../services/api';
import { AnimalReport, AreaAlert } from '../types';
import { UrgencyBadge } from '../components/UrgencyBadge';

export const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeRescues: 2,
    animalsHelped: 143,
    ngosConnected: 23,
    responseRate: '94%',
    totalRaised: 43300
  });
  const [recentReports, setRecentReports] = useState<AnimalReport[]>([]);
  const [urgentCases, setUrgentCases] = useState<AnimalReport[]>([]);
  const [adoptionReady, setAdoptionReady] = useState<AnimalReport[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<AreaAlert[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getDashboard();
        setStats(data.stats);
        setRecentReports(data.recentReports);
        setUrgentCases(data.urgentCases);
        setAdoptionReady(data.adoptionReady);
        setActiveAlerts(data.activeAlerts);
      } catch (err) {
        console.warn('Dashboard fetch fallback:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const quickActions = [
    {
      title: 'Report Animal',
      desc: 'Instant rescue dispatch',
      icon: PlusCircle,
      to: '/report',
      color: 'from-emerald-500 to-teal-600',
      highlight: true
    },
    {
      title: 'Find Nearby NGOs',
      desc: 'Verified rescue shelters',
      icon: Building2,
      to: '/map?type=ngo',
      color: 'from-teal-500 to-cyan-600'
    },
    {
      title: 'Vet Hospitals',
      desc: '24x7 Emergency clinics',
      icon: Stethoscope,
      to: '/map?type=hospital',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Pet Owner Portal',
      desc: 'Vaccines & records',
      icon: Heart,
      to: '/pets',
      color: 'from-rose-500 to-pink-600'
    },
    {
      title: 'Wildlife Info',
      desc: 'Species guide & safety',
      icon: Compass,
      to: '/wildlife',
      color: 'from-amber-500 to-orange-600'
    },
    {
      title: 'Raise Funds',
      desc: 'Medical treatments',
      icon: Coins,
      to: '/fundraisers',
      color: 'from-emerald-600 to-green-700'
    }
  ];

  return (
    <div className="pb-24 pt-4 px-4 sm:px-6 max-w-6xl mx-auto space-y-6">
      {/* 1. Welcoming Animal Rescue Banner (Screen 2 reference) */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white p-6 sm:p-8 shadow-xl border border-emerald-500/20">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-40 sm:opacity-70 pointer-events-none overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80"
            alt="Rescue Dog"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-slate-900/60 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-sm space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            AI-POWERED ANIMAL RESCUE
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            They can't ask for help... <br />
            <span className="text-emerald-400">But you can.</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Report injured or distressed stray animals. Our AI verifies symptoms, calculates urgency, and alerts nearby veterinary ambulances.
          </p>

          <div className="pt-2">
            <Link
              to="/report"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/30 transition transform active:scale-95"
            >
              <span>Report an Animal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Active Area Alerts Warning Banner (if any) */}
      {activeAlerts.length > 0 && (
        <div className="rounded-2xl border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 flex-shrink-0 animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                  {activeAlerts[0].severity}
                </span>
                <span className="text-xs text-rose-600 dark:text-rose-300 font-semibold">
                  {activeAlerts[0].locationName}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-1">
                {activeAlerts[0].details}
              </p>
            </div>
          </div>
          <Link
            to="/alerts"
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition flex-shrink-0"
          >
            View Details
          </Link>
        </div>
      )}

      {/* 3. Quick Action Grid (matching Screen 2: 6 Circular Actions) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500" />
            Quick Actions
          </h3>
          <span className="text-xs text-slate-400">Emergency & Care</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                to={action.to}
                className="group flex flex-col items-center p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-md transition text-center"
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${action.color} text-white flex items-center justify-center shadow-md shadow-emerald-500/10 group-hover:scale-110 transition-transform mb-2`}
                >
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                  {action.title}
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:block mt-0.5">
                  {action.desc}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 4. Live Community Statistics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
            Active Rescues
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
              {stats.activeRescues}
            </span>
            <span className="text-[10px] text-rose-500 font-semibold animate-pulse">● Live</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
            Animals Helped
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {stats.animalsHelped}+
            </span>
            <span className="text-[10px] text-emerald-500">Verified</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
            NGOs Connected
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-teal-600 dark:text-teal-400">
              {stats.ngosConnected}
            </span>
            <span className="text-[10px] text-teal-500">Delhi NCR</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
            Response Rate
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {stats.responseRate}
            </span>
            <span className="text-[10px] text-blue-500">Avg &lt; 40 min</span>
          </div>
        </div>
      </div>

      {/* 5. Recent Reports Near You (Screen 2 reference: Injured Dog card) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Reports Near You
            </h3>
            <p className="text-xs text-slate-500">Within 5 km radius of your location</p>
          </div>
          <Link
            to="/map"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {recentReports.map((report) => (
            <Link
              key={report.id}
              to={`/cases/${report.id}`}
              className="group p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-md transition flex items-center gap-3.5"
            >
              <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-700">
                <img
                  src={report.imageUrl}
                  alt={report.animalType}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {report.animalType} ({report.condition.split('/')[0].trim()})
                  </h4>
                  <UrgencyBadge urgency={report.urgency} size="sm" />
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span className="truncate">{report.locationName}</span>
                </div>

                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-700/60 text-[11px] text-slate-400">
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    {report.caseNumber}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {report.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 6. Ready for Adoption Spotlight (Screen 2 reference) */}
      {adoptionReady.length > 0 && (
        <div className="p-4 rounded-3xl bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-slate-800/80 dark:to-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={adoptionReady[0].imageUrl}
              alt="Adoption Ready"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-md flex-shrink-0"
            />
            <div>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full">
                Ready for Adoption
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                Give an Indie Pup a Loving Forever Home
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-1">
                {adoptionReady[0].description}
              </p>
            </div>
          </div>
          <Link
            to={`/cases/${adoptionReady[0].id}`}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs text-center flex-shrink-0 shadow-sm"
          >
            Meet Pup
          </Link>
        </div>
      )}
    </div>
  );
};
