import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Clock,
  CheckSquare,
  Square,
  Sparkles,
  Edit3
} from 'lucide-react';
import { api } from '../services/api';
import { AnimalReport } from '../types';
import { UrgencyBadge } from '../components/UrgencyBadge';
import { DuplicateVoteCard } from '../components/DuplicateVoteCard';
import { UpdateStatusModal } from '../components/UpdateStatusModal';

export const CaseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [report, setReport] = useState<AnimalReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedActions, setCompletedActions] = useState<number[]>([0]); // First item completed by default
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchReport = async () => {
      try {
        const data = await api.getReportById(id || 'rep-001');
        if (isMounted) {
          setReport(data.report);
        }
      } catch (err) {
        console.warn('Error fetching report:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchReport();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const toggleAction = (idx: number) => {
    setCompletedActions((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Case report not found.</p>
        <Link to="/home" className="mt-3 inline-block text-emerald-600 font-bold text-sm">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const aiActions = report.aiAssessment?.recommendedSteps || [
    'Contact nearest vet hospital or emergency helpline',
    'Keep the animal calm, sheltered, and hydrated',
    'Update case status after clinical triage'
  ];

  return (
    <div className="pb-28 pt-4 px-4 sm:px-6 max-w-xl mx-auto space-y-4">
      {/* Top Header (Screen 6) */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/home')}
          className="p-2 -ml-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base font-bold text-slate-900 dark:text-white font-mono">
          {report.caseNumber}
        </h2>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
          {report.status}
        </span>
      </div>

      {/* Hero Image Card (Screen 6) */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg bg-slate-100 dark:bg-slate-800">
        <img
          src={report.imageUrl}
          alt={report.animalType}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-3 right-3">
          <UrgencyBadge urgency={report.urgency} size="md" />
        </div>
      </div>

      {/* Case Details Card (Screen 6) */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {report.animalType} ({report.condition.split('/')[0].trim()})
          </h3>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Updated 2h ago
          </span>
        </div>

        <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>{report.locationName}</span>
            <Link to="/map" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1 ml-auto">
              <span>View on Map</span>
            </Link>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Coordinates:</span>
            <span className="font-mono">{report.latitude}, {report.longitude}</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
          <span className="font-bold text-slate-900 dark:text-white block mb-1">Observed Findings</span>
          <p className="leading-relaxed">{report.description}</p>
        </div>
      </div>

      {/* Recommended Next Actions Checklist (Screen 6 Reference) */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            Recommended Next Actions
          </h3>
          <span className="text-xs text-slate-400">
            {completedActions.length}/{aiActions.length} completed
          </span>
        </div>

        <div className="space-y-2">
          {aiActions.map((action, idx) => {
            const isDone = completedActions.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => toggleAction(idx)}
                className={`w-full text-left p-3 rounded-2xl border text-xs font-medium flex items-start gap-2.5 transition ${
                  isDone
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 line-through opacity-80'
                    : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                {isDone ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                )}
                <span className="leading-snug">{action}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Related Cases / Duplicate Candidates (Screen 6 Reference) */}
      {report.duplicateCandidate && (
        <DuplicateVoteCard
          reportId={report.id}
          candidate={report.duplicateCandidate}
        />
      )}

      {/* Update Status Button (Screen 6) */}
      <div className="pt-2">
        <button
          onClick={() => setIsUpdateModalOpen(true)}
          className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
        >
          <Edit3 className="w-4 h-4" />
          <span>Update Status & Observations</span>
        </button>
      </div>

      {/* Update Status Modal */}
      <UpdateStatusModal
        reportId={report.id}
        currentStatus={report.status}
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onUpdated={(newStatus) => {
          setReport({ ...report, status: newStatus as any });
        }}
      />
    </div>
  );
};
