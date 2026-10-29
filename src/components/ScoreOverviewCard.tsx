import React from "react";
import {
  Award,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  FileEdit,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { AnalysisResult } from "../types";

interface ScoreOverviewCardProps {
  analysis: AnalysisResult;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const ScoreOverviewCard: React.FC<ScoreOverviewCardProps> = ({
  analysis,
  activeTab,
  setActiveTab,
}) => {
  const {
    overallMatchScore,
    matchTier,
    verdictSummary,
    targetJobTitle,
    missingSkills,
    matchedSkills,
    interviewQuestions,
    bulletPointSuggestions,
  } = analysis;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-indigo-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "from-emerald-500/20 via-slate-900 to-slate-900 border-emerald-500/40";
    if (score >= 60) return "from-amber-500/20 via-slate-900 to-slate-900 border-amber-500/40";
    return "from-indigo-500/20 via-slate-900 to-slate-900 border-indigo-500/40";
  };

  return (
    <div className={`rounded-3xl border bg-gradient-to-br ${getScoreBg(overallMatchScore)} p-6 sm:p-8 shadow-2xl space-y-6 text-white`}>
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div className="flex items-start sm:items-center gap-5">
          {/* Radial score circle */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="7"
                className="text-slate-800"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="7"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * overallMatchScore) / 100}
                strokeLinecap="round"
                className={`${getScoreColor(overallMatchScore)} transition-all duration-1000 ease-out`}
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className={`text-2xl font-black ${getScoreColor(overallMatchScore)}`}>
                {overallMatchScore}%
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Match</span>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700">
                {targetJobTitle || "Target Role"}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  overallMatchScore >= 80
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : overallMatchScore >= 60
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                }`}
              >
                {matchTier || (overallMatchScore >= 75 ? "Strong Candidate" : "Growth Opportunity")}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Role Fit Assessment &amp; Coaching Plan
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              {verdictSummary}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Interactive KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Missing Skills Card */}
        <button
          onClick={() => setActiveTab("missing")}
          className={`p-4 rounded-2xl text-left border transition cursor-pointer ${
            activeTab === "missing"
              ? "bg-rose-500/15 border-rose-500/50 shadow-lg shadow-rose-950/40"
              : "bg-slate-900/60 hover:bg-slate-800/80 border-slate-800"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Missing Skills</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400">
            {missingSkills.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
            Gaps to bridge or defend
          </p>
        </button>

        {/* Matched Skills Card */}
        <button
          onClick={() => setActiveTab("matched")}
          className={`p-4 rounded-2xl text-left border transition cursor-pointer ${
            activeTab === "matched"
              ? "bg-emerald-500/15 border-emerald-500/50 shadow-lg shadow-emerald-950/40"
              : "bg-slate-900/60 hover:bg-slate-800/80 border-slate-800"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Validated Skills</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {matchedSkills.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
            Verified overlaps in resume
          </p>
        </button>

        {/* Interview Questions Card */}
        <button
          onClick={() => setActiveTab("interview")}
          className={`p-4 rounded-2xl text-left border transition cursor-pointer ${
            activeTab === "interview"
              ? "bg-indigo-500/15 border-indigo-500/50 shadow-lg shadow-indigo-950/40"
              : "bg-slate-900/60 hover:bg-slate-800/80 border-slate-800"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Practice Questions</span>
            <HelpCircle className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-400">
            {interviewQuestions.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
            With AI simulator &amp; tips
          </p>
        </button>

        {/* Bullet Rewrites Card */}
        <button
          onClick={() => setActiveTab("bullets")}
          className={`p-4 rounded-2xl text-left border transition cursor-pointer ${
            activeTab === "bullets"
              ? "bg-sky-500/15 border-sky-500/50 shadow-lg shadow-sky-950/40"
              : "bg-slate-900/60 hover:bg-slate-800/80 border-slate-800"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Bullet Rewrites</span>
            <FileEdit className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-sky-400">
            {bulletPointSuggestions.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
            Grounded &amp; zero hallucination
          </p>
        </button>
      </div>
    </div>
  );
};
