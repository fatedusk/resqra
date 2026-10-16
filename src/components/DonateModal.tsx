import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Heart, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { Fundraiser } from '../types';

interface DonateModalProps {
  fundraiser: Fundraiser;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedFundraiser: Fundraiser) => void;
}

export const DonateModal: React.FC<DonateModalProps> = ({
  fundraiser,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [donorName, setDonorName] = useState('Kind Supporter');
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState<{ receiptId: string; amount: number } | null>(null);

  if (!isOpen) return null;

  const amounts = [500, 1000, 2500, 5000];

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = customAmount ? Number(customAmount) : selectedAmount;
    if (!finalAmount || finalAmount <= 0) return;

    setLoading(true);
    try {
      const res = await api.donateToCampaign(fundraiser.id, donorName, finalAmount, `${paymentMethod} (Demo)`);
      if (res.success) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        setReceipt({ receiptId: res.receiptId, amount: finalAmount });
        onSuccess(res.fundraiser);
      }
    } catch (err: any) {
      alert(err.message || 'Error processing donation');
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

        {receipt ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-3">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Thank You for Saving a Life!
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Your contribution directly supports medical care for {fundraiser.animalName}.
            </p>

            <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Contributed:</span>
                <span className="font-bold text-slate-900 dark:text-white">₹{receipt.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Receipt ID:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{receipt.receiptId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mode:</span>
                <span className="text-slate-700 dark:text-slate-300">Simulated Demo Transaction</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> ResQra Verified Case
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 font-bold text-[11px]">
                DEMO MODE
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Support {fundraiser.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              100% of verified contributions go toward urgent medical & veterinary treatment.
            </p>

            <form onSubmit={handleDonate} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Select Donation Amount (INR)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {amounts.map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => {
                        setSelectedAmount(amt);
                        setCustomAmount('');
                      }}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        selectedAmount === amt && !customAmount
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="Or enter custom amount in ₹"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(0);
                  }}
                  className="mt-2 w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Donor Name
                </label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="e.g. Shivansh Patel or Anonymous"
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Payment Simulation Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['UPI', 'Card', 'NetBanking'] as const).map((method) => (
                    <button
                      type="button"
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition ${
                        paymentMethod === method
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
                🔒 Protected test environment. No real payment card or bank credentials required.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <Heart className="w-4 h-4 fill-white" />
                {loading
                  ? 'Processing...'
                  : `Donate ₹${(customAmount ? Number(customAmount) : selectedAmount).toLocaleString('en-IN')}`}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
