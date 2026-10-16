import React, { useState } from 'react';
import { Users, Check, AlertCircle, HelpCircle } from 'lucide-react';
import { api } from '../services/api';

interface DuplicateVoteCardProps {
  reportId: string;
  candidate: {
    candidateId: string;
    distanceKm: number;
    description: string;
    imageUrl: string;
    status: string;
  };
}

export const DuplicateVoteCard: React.FC<DuplicateVoteCardProps> = ({ reportId, candidate }) => {
  const [voted, setVoted] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [voteCount, setVoteCount] = useState<number>(3); // Initial community votes baseline

  const handleVote = async (vote: 'same_case' | 'different_case' | 'not_sure') => {
    setLoading(true);
    try {
      await api.voteDuplicate(reportId, candidate.candidateId, vote);
      setVoted(vote);
      setVoteCount((prev) => prev + 1);
    } catch (e: any) {
      alert(e.message || 'Error recording vote');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 p-4 transition">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          Possible Duplicate Found!
        </span>
        <span className="text-[11px] font-medium text-amber-700/80 dark:text-amber-400/80 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-full">
          Within {candidate.distanceKm} km • 1h ago
        </span>
      </div>

      <div className="flex items-start gap-3 mt-3">
        <img
          src={candidate.imageUrl}
          alt="Candidate"
          className="w-16 h-16 rounded-xl object-cover border border-amber-200 dark:border-amber-800 flex-shrink-0"
        />
        <div className="flex-1">
          <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2">
            {candidate.description}
          </p>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{voteCount} community members voted</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-amber-200/80 dark:border-amber-900/40">
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
          Does this look like the same animal or incident?
        </p>

        {voted ? (
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Thank you! Your response helps responders avoid duplicate dispatches.</span>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleVote('same_case')}
              disabled={loading}
              className="py-1.5 px-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-emerald-600 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition text-center"
            >
              Yes, Same Case
            </button>
            <button
              onClick={() => handleVote('different_case')}
              disabled={loading}
              className="py-1.5 px-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400 transition text-center"
            >
              No, Different
            </button>
            <button
              onClick={() => handleVote('not_sure')}
              disabled={loading}
              className="py-1.5 px-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-500 hover:border-slate-400 transition text-center"
            >
              Not Sure
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
