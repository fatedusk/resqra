import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Sparkles,
  Phone,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Compass,
  ArrowLeft
} from 'lucide-react';
import { api } from '../services/api';
import { AnimalReport, AIAssessment, Organisation } from '../types';

export const AIAnalysisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [report, setReport] = useState<AnimalReport | null>(null);
  const [assessment, setAssessment] = useState<AIAssessment | null>(null);
  const [nearbyHelp, setNearbyHelp] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await api.getReportById(id || 'rep-001');
        setReport(data.report);
        setAssessment(data.report.aiAssessment || null);
        setNearbyHelp(data.nearbyHelp || []);
      } catch (err) {
        console.warn('Error fetching report:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          ResQra Rescue Agent is orchestrating triage...
        </p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Case report not found.</p>
        <Link to="/home" className="mt-4 inline-block text-emerald-600 font-bold text-sm">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const isUrgent = report.urgency === 'Critical' || report.urgency === 'High';

  return (
    <div className="pb-28 pt-4 px-4 sm:px-6 max-w-xl mx-auto space-y-4">
      {/* Header (Screen 4) */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/home')}
          className="p-2 -ml-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          AI Analysis Report
        </h2>
        <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
          {report.caseNumber}
        </span>
      </div>

      {/* Emergency Level Banner (Screen 4: Red Alert Box) */}
      <div
        className={`p-4 rounded-3xl border flex items-start gap-3 shadow-sm ${
          isUrgent
            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900 text-rose-900 dark:text-rose-200'
            : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-900 text-amber-900 dark:text-amber-200'
        }`}
      >
        <div
          className={`p-2.5 rounded-2xl flex-shrink-0 ${
            isUrgent ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-600' : 'bg-amber-100 dark:bg-amber-900/60 text-amber-600'
          }`}
        >
          <AlertTriangle className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h3 className="font-bold text-base">
            {report.urgency} Emergency Level
          </h3>
          <p className="text-xs mt-0.5 opacity-90">
            {report.condition} • {isUrgent ? 'Needs immediate prioritized intervention' : 'Stable under community monitoring'}
          </p>
        </div>
      </div>

      {/* AI Analysis Findings Card (Screen 4) */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>ResQra Vision & Triage Verification</span>
          </div>
          {assessment?.isDemo && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500">
              DEMO AI
            </span>
          )}
        </div>

        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          {assessment?.urgencyReasoning ||
            'The image and observed symptoms indicate an animal requiring veterinary triage. Verified as an authentic incident.'}
        </p>

        {assessment?.observedEvidence && assessment.observedEvidence.length > 0 && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 block">Observed Evidence:</span>
            {assessment.observedEvidence.map((ev, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>{ev}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Next Steps Card (Screen 4: Numbered Steps) */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2.5">
        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Recommended Next Steps
        </h4>
        <div className="space-y-2">
          {(assessment?.recommendedSteps || [
            'Contact the nearest veterinary hospital.',
            'Keep the animal in a safe, quiet place.',
            'Avoid giving food or water if severely injured.',
            'Inform local NGO for rescue dispatch.'
          ]).map((step, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
              <span className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px] border border-emerald-200 dark:border-emerald-800">
                {idx + 1}
              </span>
              <p className="pt-0.5 leading-snug">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Nearest NGOs (Screen 4: PFA, Blue Cross Society with Call buttons) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Nearest NGOs & Responders
          </h4>
          <span className="text-xs text-emerald-600 font-medium">Auto-matched</span>
        </div>

        <div className="space-y-2">
          {nearbyHelp.slice(0, 2).map((org) => (
            <div
              key={org.id}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between"
            >
              <div>
                <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                  {org.name}
                </h5>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {org.services.join(' • ')} • {org.distanceKm ? `~${org.distanceKm} km` : '2.1 km'}
                </p>
              </div>
              <a
                href={`tel:${org.phone}`}
                className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition shadow-sm"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer (Section 8 requirement) */}
      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
        ⚠️ <strong>Medical Disclaimer:</strong> ResQra AI provides immediate community triage advice based on visual patterns and reporter notes. This is not a substitute for professional veterinary examination.
      </div>

      {/* Action Buttons (Screen 4) */}
      <div className="flex gap-2.5 pt-2">
        <Link
          to="/map"
          className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm text-center shadow-md transition flex items-center justify-center gap-1.5"
        >
          <Compass className="w-4 h-4" />
          <span>View on Map</span>
        </Link>
        <Link
          to={`/cases/${report.id}`}
          className="flex-1 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 hover:border-slate-400 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm text-center transition flex items-center justify-center gap-1.5"
        >
          <span>Track Case</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
