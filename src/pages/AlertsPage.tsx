import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  MapPin,
  Clock,
  Sparkles,
  Shield,
  Activity,
  CheckCircle2,
  XCircle,
  BarChart2,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { AreaAlert, AreaIncident } from '../types';
import { MapComponent } from '../components/MapComponent';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<AreaAlert[]>([]);
  const [incidents, setIncidents] = useState<AreaIncident[]>([]);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationFeedback, setEvaluationFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const data = await api.getAlerts();
      setAlerts(data.alerts);
      setIncidents(data.incidents);
    } catch (err) {
      console.warn('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleEvaluateRisk = async () => {
    setEvaluating(true);
    setEvaluationFeedback(null);
    try {
      const res = await api.evaluateAreaRisk(28.5697, 77.3208, 2500);
      setAlerts(res.alerts);
      setEvaluationFeedback(res.evaluation.summary);
    } catch (e: any) {
      alert(e.message || 'Error running evaluation');
    } finally {
      setEvaluating(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.updateAlertStatus(id, status);
      fetchAlerts();
    } catch (e: any) {
      alert(e.message || 'Error updating alert status');
    }
  };

  const activeAlert = alerts[0];

  return (
    <div className="pb-28 pt-4 px-4 sm:px-6 max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            Area Alerts & Incident Analytics
          </h2>
          <span className="text-xs text-slate-400">Sector 12, Noida Zone</span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Cluster detection & threshold rules for animal bites, injuries, and community welfare flags.
        </p>
      </div>

      {/* Red Alert Banner (Screen 11 Reference) */}
      {activeAlert && activeAlert.status === 'active' && (
        <div className="p-4 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 shadow-sm space-y-3">
          <div className="flex items-start gap-3">
            <span className="p-2.5 rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 flex-shrink-0 animate-pulse">
              <AlertTriangle className="w-6 h-6" />
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                  {activeAlert.severity}
                </span>
                <span className="text-[11px] text-rose-600 font-semibold">
                  {activeAlert.incidentCount} Clustered Reports
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                {activeAlert.details}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                <strong>Public Guidance:</strong> {activeAlert.guidance}
              </p>
            </div>
          </div>

          {/* Moderator Actions (Section 12 requirement) */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-rose-200/80 dark:border-rose-900/40 text-xs">
            <span className="text-slate-400 text-[11px] mr-auto">Moderator Controls:</span>
            <button
              onClick={() => handleUpdateStatus(activeAlert.id, 'resolved')}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition"
            >
              Mark Resolved
            </button>
            <button
              onClick={() => handleUpdateStatus(activeAlert.id, 'dismissed')}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Interactive Incident Map with Circular Zone (Screen 11 Reference) */}
      <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg">
        <MapComponent
          center={[28.5697, 77.3208]}
          zoom={14}
          alerts={alerts}
          height="340px"
        />
      </div>

      {/* AI Tool G Trigger Button */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              ResQra Agent Tool G: evaluate_area_risk
            </h4>
            <p className="text-[11px] text-slate-500">
              Evaluates 24h rolling incident density against configured alert thresholds.
            </p>
          </div>
        </div>
        <button
          onClick={handleEvaluateRisk}
          disabled={evaluating}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition flex-shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${evaluating ? 'animate-spin' : ''}`} />
          <span>{evaluating ? 'Evaluating Cluster...' : 'Evaluate Area Risk'}</span>
        </button>
      </div>

      {evaluationFeedback && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
          ✓ {evaluationFeedback}
        </div>
      )}

      {/* Recent Incidents List (Screen 11 Reference) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Recent Incidents in Cluster
          </h3>
          <span className="text-xs text-slate-400">{incidents.length} recorded events</span>
        </div>

        <div className="space-y-2">
          {incidents.map((inc) => (
            <div
              key={inc.id}
              className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    inc.incidentType === 'Dog Bite' || inc.incidentType === 'Suspected Rabies'
                      ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600'
                      : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    {inc.incidentType}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {inc.locationName} • {inc.timeAgo}
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
                Under Review
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
