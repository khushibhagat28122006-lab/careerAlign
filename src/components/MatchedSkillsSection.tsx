import React from "react";
import { CheckCircle2, ShieldCheck, Tag } from "lucide-react";
import { MatchedSkill } from "../types";

interface MatchedSkillsSectionProps {
  matchedSkills: MatchedSkill[];
}

export const MatchedSkillsSection: React.FC<MatchedSkillsSectionProps> = ({
  matchedSkills,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Validated Matching Skills ({matchedSkills.length})
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Skills and qualifications explicitly asked for by the employer that your resume directly proves.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span>Core Competencies Confirmed</span>
        </div>
      </div>

      {/* Grid of matched skills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {matchedSkills.map((match, idx) => (
          <div
            key={idx}
            className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between space-y-2 hover:border-emerald-500/30 transition shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                {match.skill}
              </span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                {match.category}
              </span>
            </div>

            <div className="text-[11px] text-slate-400 bg-slate-900/90 rounded-lg p-2 border border-slate-800/60">
              <span className="text-slate-500 font-medium block text-[10px] uppercase">
                Evidenced In Resume:
              </span>
              <span className="text-slate-300 italic line-clamp-2">
                &ldquo;{match.foundInResume}&rdquo;
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
