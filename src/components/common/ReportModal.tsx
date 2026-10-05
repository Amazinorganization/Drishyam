import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { StorageService } from '../../services/storage';
import { useToast } from './Toast';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  targetTitle: string;
  targetType: 'video' | 'short' | 'comment' | 'post' | 'user';
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  targetId,
  targetTitle,
  targetType
}) => {
  const [reason, setReason] = useState('Misinformation / Fake News');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const REASONS = [
    'Misinformation / Fake News',
    'Hate speech or abusive content',
    'Copyright infringement',
    'Spam or commercial scams',
    'Harassment or privacy violation',
    'Inappropriate for minors'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.addReport({
      reporterId: StorageService.getCurrentUser().id,
      targetId,
      targetType,
      targetTitle,
      reason,
      details
    });

    setSubmitted(true);
    showToast('Report submitted for DRISHYAM moderation', 'info');
    setTimeout(() => {
      setSubmitted(false);
      setDetails('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 text-slate-100 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-brand text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            Report {targetType}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 flex flex-col items-center justify-center text-center gap-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
            <h4 className="text-base font-bold text-white">Thank You for Keeping DRISHYAM Safe</h4>
            <p className="text-xs text-slate-400 max-w-xs">
              Our safety and community trust team has queued this item for priority review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-1">Target</p>
              <p className="text-xs font-medium text-slate-200 bg-slate-950 p-2 rounded-xl border border-slate-800 truncate">
                {targetTitle}
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Why are you reporting this?
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {REASONS.map((r) => (
                  <label
                    key={r}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                      reason === r
                        ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={r}
                      checked={reason === r}
                      onChange={(e) => setReason(e.target.value)}
                      className="accent-amber-500"
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Additional context (optional)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={2}
                placeholder="Help our moderation team understand the issue..."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white transition shadow-lg shadow-rose-600/20"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
