import React, { useEffect, useState } from 'react';
import {
  Coins,
  ShieldCheck,
  FileCheck,
  RefreshCw,
  Heart,
  Share2,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { Fundraiser } from '../types';
import { DonateModal } from '../components/DonateModal';

export const FundraisersPage: React.FC = () => {
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([]);
  const [selectedFundraiser, setSelectedFundraiser] = useState<Fundraiser | null>(null);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchFundraisers = async () => {
    try {
      const res = await api.getFundraisers();
      setFundraisers(res.fundraisers);
      if (res.fundraisers.length > 0 && !selectedFundraiser) {
        setSelectedFundraiser(res.fundraisers[0]); // Help Treat Luna
      }
    } catch (err) {
      console.warn('Error fetching fundraisers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFundraisers();
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading || !selectedFundraiser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const percent = Math.min(
    100,
    Math.round((selectedFundraiser.raisedAmount / selectedFundraiser.targetAmount) * 100)
  );

  return (
    <div className="pb-28 pt-4 px-4 sm:px-6 max-w-xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Coins className="w-5 h-5 text-emerald-500" />
          Raise Funds
        </h2>
        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/60">
          DEMO MODE
        </span>
      </div>

      {/* Featured Campaign Hero (Screen 10: Help Treat Luna) */}
      <div className="rounded-3xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
        <div className="relative w-full h-60 overflow-hidden bg-slate-100 dark:bg-slate-700">
          <img
            src={selectedFundraiser.imageUrl}
            alt={selectedFundraiser.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>Emergency Case</span>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Progress Bar (Screen 10 Reference: ₹24,800 of ₹50,000 - 50%) */}
          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <div>
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  ₹{selectedFundraiser.raisedAmount.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-400 ml-1.5">
                  raised of ₹{selectedFundraiser.targetAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                {percent}%
              </span>
            </div>

            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          {/* Campaign Title & Story */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {selectedFundraiser.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              {selectedFundraiser.story}
            </p>
          </div>

          {/* Verification Badges (Screen 10 Reference) */}
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 dark:border-slate-700/60">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 block leading-tight">
                ResQra Verified
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-center">
              <FileCheck className="w-4 h-4 text-blue-500 mx-auto mb-1" />
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 block leading-tight">
                Vet Report
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-center">
              <RefreshCw className="w-4 h-4 text-teal-500 mx-auto mb-1" />
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 block leading-tight">
                Updates Regularly
              </span>
            </div>
          </div>

          {/* CTA Buttons (Screen 10 Reference) */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => setIsDonateOpen(true)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-bold text-sm shadow-xl shadow-emerald-600/25 transition transform active:scale-98 flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Donate Now</span>
            </button>

            <button
              onClick={handleShare}
              className="w-full py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 hover:border-slate-400 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied to Clipboard!' : 'Share Campaign'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Supporter Contributions */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <Users className="w-4 h-4 text-emerald-500" />
          Recent Kind Contributors
        </h4>
        <div className="space-y-2">
          {selectedFundraiser.donations.slice(0, 4).map((d) => (
            <div
              key={d.id}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">{d.donorName}</span>
                <span className="text-[10px] text-slate-400">{d.paymentMethod} • {d.date}</span>
              </div>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                ₹{d.amount.toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Donate Modal */}
      {selectedFundraiser && (
        <DonateModal
          fundraiser={selectedFundraiser}
          isOpen={isDonateOpen}
          onClose={() => setIsDonateOpen(false)}
          onSuccess={(updated) => {
            setSelectedFundraiser(updated);
            fetchFundraisers();
          }}
        />
      )}
    </div>
  );
};
