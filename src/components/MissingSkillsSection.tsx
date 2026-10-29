import React, { useState } from "react";
import {
  AlertTriangle,
  Flame,
  Star,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Filter,
  Lightbulb,
  Search
} from "lucide-react";
import { MissingSkill } from "../types";

interface MissingSkillsSectionProps {
  missingSkills: MissingSkill[];
  onJumpToInterviewSkill?: (skillName: string) => void;
}

export const MissingSkillsSection: React.FC<MissingSkillsSectionProps> = ({
  missingSkills,
  onJumpToInterviewSkill,
}) => {
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredSkills = missingSkills.filter((item) => {
    const matchesFilter =
      filter === "all" || item.importance.toLowerCase() === filter.toLowerCase();
    const matchesSearch =
      item.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.whyItMatters.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getImportanceBadge = (importance: string) => {
    const imp = importance.toLowerCase();
    if (imp.includes("crit") || imp.includes("must")) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
          <Flame className="w-3 h-3 text-rose-400" /> Critical Requirement
        </span>
      );
    }
    if (imp.includes("pref") || imp.includes("high")) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
          <Star className="w-3 h-3 text-amber-400" /> Preferred Skill
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-700/60 text-slate-300 border border-slate-600">
        <Lightbulb className="w-3 h-3 text-sky-400" /> Nice to Have / Bonus
      </span>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Skills Found in Job Description Missing from Resume
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            These are key requirements, technologies, and methodologies the employer asked for that aren&apos;t explicitly evidenced in your resume.
          </p>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search missing skills..."
              className="bg-slate-950/80 text-xs text-slate-200 placeholder-slate-500 rounded-xl pl-8 pr-3 py-1.5 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-44 sm:w-52"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          </div>

          <div className="flex items-center bg-slate-950/60 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setFilter("all")}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                filter === "all" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              All ({missingSkills.length})
            </button>
            <button
              onClick={() => setFilter("critical")}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                filter === "critical" ? "bg-rose-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Critical
            </button>
            <button
              onClick={() => setFilter("preferred")}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                filter === "preferred" ? "bg-amber-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Preferred
            </button>
          </div>
        </div>
      </div>

      {/* Skills Cards Grid */}
      {filteredSkills.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
          <p className="text-sm font-semibold text-white">No skills match your filter!</p>
          <p className="text-xs text-slate-500 mt-1">Try resetting the search or filter query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSkills.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-950/70 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between transition shadow-md group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition">
                      {item.skill}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Category: {item.category}
                    </span>
                  </div>
                  {getImportanceBadge(item.importance)}
                </div>

                {item.whereInJobDesc && (
                  <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800/80 text-xs text-slate-300">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                      Where In Job Description
                    </span>
                    <span className="italic text-slate-300 line-clamp-2">
                      &ldquo;{item.whereInJobDesc}&rdquo;
                    </span>
                  </div>
                )}

                <div className="text-xs space-y-1.5">
                  <p className="text-slate-300">
                    <strong className="text-slate-200">Why it matters:</strong> {item.whyItMatters}
                  </p>
                  <p className="text-sky-300/90 bg-sky-950/30 p-2.5 rounded-xl border border-sky-900/40">
                    <strong className="text-sky-200 flex items-center gap-1 mb-0.5">
                      <BookOpen className="w-3.5 h-3.5" /> How to bridge or discuss:
                    </strong>
                    {item.bridgingAdvice}
                  </p>
                </div>
              </div>

              {onJumpToInterviewSkill && (
                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => onJumpToInterviewSkill(item.skill)}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group/btn"
                  >
                    <span>Practice questions for {item.skill}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
