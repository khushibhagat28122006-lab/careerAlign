import React from "react";
import { X, History, Trash2, ArrowRight, Calendar, AlertTriangle, CheckCircle2, RotateCcw } from "lucide-react";
import { AnalysisResult } from "../types";

export interface HistoryItem {
  id: string;
  title: string;
  date: string;
  analysis: AnalysisResult;
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyItems: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onDeleteHistory: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  historyItems,
  onSelectHistory,
  onDeleteHistory,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Analysis History</h3>
              <p className="text-xs text-slate-400">
                {historyItems.length} saved assessment{historyItems.length === 1 ? "" : "s"} in this browser
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {historyItems.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs text-slate-400 hover:text-rose-400 transition flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-800"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-1">
          {historyItems.length === 0 ? (
            <div className="py-12 text-center space-y-3 text-slate-400">
              <History className="w-12 h-12 text-slate-600 mx-auto" />
              <div>
                <p className="text-sm font-semibold text-slate-200">No past analyses saved yet</p>
                <p className="text-xs text-slate-500 mt-1">
                  Run a match analysis to automatically record your role fit briefs here.
                </p>
              </div>
            </div>
          ) : (
            historyItems.map((item) => {
              const score = item.analysis.overallMatchScore;
              const scoreColor =
                score >= 80 ? "text-emerald-400" : score >= 60 ? "text-amber-400" : "text-indigo-400";
              const scoreBg =
                score >= 80 ? "bg-emerald-500/10 border-emerald-500/30" : score >= 60 ? "bg-amber-500/10 border-amber-500/30" : "bg-indigo-500/10 border-indigo-500/30";

              return (
                <div
                  key={item.id}
                  className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-black border ${scoreColor} ${scoreBg}`}>
                        {score}%
                      </span>
                      <h4 className="text-sm font-bold text-white line-clamp-1">
                        {item.title}
                      </h4>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {item.date}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        {item.analysis.matchedSkills?.length || 0} Matched
                      </span>
                      <span className="flex items-center gap-1 text-rose-400">
                        <AlertTriangle className="w-3 h-3" />
                        {item.analysis.missingSkills?.length || 0} Gaps
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    <button
                      type="button"
                      onClick={() => onDeleteHistory(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition"
                      title="Delete from history"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectHistory(item);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition shadow-sm"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Load Brief</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
