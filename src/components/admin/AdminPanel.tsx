import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  CheckCircle,
  XCircle,
  UserX,
  FileText,
  AlertTriangle,
  RefreshCw,
  X
} from 'lucide-react';
import { ReportItem } from '../../types';
import { StorageService } from '../../services/storage';
import { useToast } from '../common/Toast';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [reports, setReports] = useState<ReportItem[]>(() => StorageService.getReports());
  const [bannedUsers, setBannedUsers] = useState<string[]>(['bot_promo_99', 'spam_channel_02']);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleResolve = (id: string, action: 'resolved' | 'dismissed') => {
    StorageService.resolveReport(id, action);
    setReports(StorageService.getReports());
    showToast(action === 'resolved' ? 'Report marked resolved' : 'Report dismissed', 'info');
  };

  const handleUnban = (username: string) => {
    setBannedUsers(bannedUsers.filter((u) => u !== username));
    showToast(`Unbanned user @${username}`, 'success');
  };

  const pendingReports = reports.filter((r) => r.status === 'pending');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-3xl max-h-[90vh] rounded-3xl bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-brand text-base sm:text-lg font-bold text-white">
                DRISHYAM Admin & Trust Safety Console
              </h2>
              <p className="text-[11px] text-slate-400">Content Moderation & Policy Enforcement</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs">
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Pending Reports</span>
              <p className="font-mono text-xl font-bold text-amber-400 mt-1 tabular-nums">
                {pendingReports.length}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Total Reviewed</span>
              <p className="font-mono text-xl font-bold text-white mt-1 tabular-nums">
                {reports.length - pendingReports.length}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Banned Accounts</span>
              <p className="font-mono text-xl font-bold text-rose-400 mt-1 tabular-nums">
                {bannedUsers.length}
              </p>
            </div>
          </div>

          {/* Pending Reports Moderation Queue */}
          <div className="space-y-3">
            <h3 className="font-brand text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Content Moderation Queue ({pendingReports.length})
            </h3>

            {pendingReports.length > 0 ? (
              <div className="space-y-2.5">
                {pendingReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 font-semibold text-[10px] uppercase">
                          {report.targetType}
                        </span>
                        <span className="font-bold text-white truncate max-w-sm">
                          {report.targetTitle}
                        </span>
                      </div>
                      <span className="text-slate-500 text-[10px]">{report.timestamp}</span>
                    </div>

                    <p className="text-slate-300">
                      <strong className="text-amber-400">Reason:</strong> {report.reason}
                    </p>
                    {report.details && (
                      <p className="text-slate-400 italic">
                        &ldquo;{report.details}&rdquo;
                      </p>
                    )}

                    <div className="flex justify-end gap-2 pt-1 border-t border-slate-900">
                      <button
                        onClick={() => handleResolve(report.id, 'dismissed')}
                        className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                      >
                        Dismiss (Valid Content)
                      </button>
                      <button
                        onClick={() => handleResolve(report.id, 'resolved')}
                        className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
                      >
                        Enforce & Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 bg-slate-950/40 rounded-2xl border border-slate-800/60">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-1.5" />
                <p className="font-semibold text-white">All reports clear</p>
                <p className="text-[11px] text-slate-500 mt-0.5">DRISHYAM community guidelines are upheld.</p>
              </div>
            )}
          </div>

          {/* Banned Accounts Manager */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h3 className="font-brand text-sm font-bold text-white flex items-center gap-2">
              <UserX className="w-4 h-4 text-rose-400" />
              Restricted / Suspended Users
            </h3>
            <div className="space-y-1.5">
              {bannedUsers.map((username) => (
                <div
                  key={username}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800"
                >
                  <span className="font-mono text-slate-300">@{username}</span>
                  <button
                    onClick={() => handleUnban(username)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                  >
                    Lift Restriction
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
