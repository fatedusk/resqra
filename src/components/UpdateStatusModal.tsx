import React, { useState } from 'react';
import { X, CheckCircle, Shield } from 'lucide-react';
import { api } from '../services/api';

interface UpdateStatusModalProps {
  reportId: string;
  currentStatus: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (newStatus: string) => void;
}

export const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({
  reportId,
  currentStatus,
  isOpen,
  onClose,
  onUpdated
}) => {
  const [status, setStatus] = useState(currentStatus);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const validStatuses = [
    'Reported',
    'Under Review',
    'Help Requested',
    'Rescue In Progress',
    'Treatment In Progress',
    'Available for Adoption',
    'Resolved',
    'Rejected as Invalid'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.updateReportStatus(reportId, status, notes);
      onUpdated(status);
      onClose();
    } catch (e: any) {
      alert(e.message || 'Error updating status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
            <Shield className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Update Case Status
            </h3>
            <span className="text-xs text-slate-400">Responder & Community Action</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Select New Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            >
              {validStatuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Incident Observations or Treatment Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Dog transported to City Animal Hospital for wound cleansing and antibiotic course."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Status Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
