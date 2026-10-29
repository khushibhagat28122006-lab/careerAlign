import React from "react";
import { Award, ArrowUpCircle, CheckCircle2, AlertCircle, Wrench } from "lucide-react";
import { StrengthItem, AreaToImprove } from "../types";

interface StrengthsAndImprovementsSectionProps {
  strengths: StrengthItem[];
  areasToImprove: AreaToImprove[];
}

export const StrengthsAndImprovementsSection: React.FC<StrengthsAndImprovementsSectionProps> = ({
  strengths,
  areasToImprove,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Strengths Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl flex flex-col">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Your Key Strengths for this Role</h3>
            <p className="text-xs text-slate-400">
              Unique advantages and verified achievements from your background
            </p>
          </div>
        </div>

        <div className="space-y-3.5 flex-1">
          {strengths.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-950/70 border border-emerald-500/20 rounded-2xl p-4.5 space-y-2 hover:border-emerald-500/40 transition"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <h4 className="text-sm font-bold text-slate-100">{item.title}</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {item.description}
              </p>
              {item.resumeEvidence && (
                <div className="mt-2 text-[11px] bg-slate-900/90 text-slate-400 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="font-semibold text-emerald-400 uppercase tracking-wider block text-[10px] mb-0.5">
                    Demonstrated In Resume:
                  </span>
                  <span className="italic text-slate-300">&ldquo;{item.resumeEvidence}&rdquo;</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Areas to Improve Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl flex flex-col">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <ArrowUpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Key Areas to Strengthen &amp; Address</h3>
            <p className="text-xs text-slate-400">
              Gaps, unevidenced qualifications, or presentation areas to tighten
            </p>
          </div>
        </div>

        <div className="space-y-3.5 flex-1">
          {areasToImprove.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-950/70 border border-amber-500/20 rounded-2xl p-4.5 space-y-2 hover:border-amber-500/40 transition"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <h4 className="text-sm font-bold text-slate-100">{item.title}</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {item.description}
              </p>
              {item.actionItem && (
                <div className="mt-2 text-[11px] bg-amber-950/20 text-amber-200/90 p-2.5 rounded-xl border border-amber-800/40">
                  <span className="font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1 text-[10px] mb-0.5">
                    <Wrench className="w-3 h-3" /> Recommended Action Item:
                  </span>
                  <span>{item.actionItem}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
