import React, { useState } from "react";
import { CalendarCheck, CheckCircle2, Circle, Compass, Sparkles, BookOpen } from "lucide-react";
import { QuickStudyStep } from "../types";

interface QuickStudyPlanSectionProps {
  plan: QuickStudyStep[];
  targetRole: string;
}

export const QuickStudyPlanSection: React.FC<QuickStudyPlanSectionProps> = ({
  plan,
  targetRole,
}) => {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / (plan.length || 1)) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Targeted Skill-Bridging Roadmap
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            A fast sprint to bridge missing requirements for {targetRole} prior to your interview.
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3 bg-slate-950/70 px-4 py-2 rounded-2xl border border-slate-800">
          <div className="text-right">
            <span className="text-xs font-bold text-white block">
              {completedCount} of {plan.length} Steps
            </span>
            <span className="text-[10px] text-slate-400">{progressPercent}% Ready</span>
          </div>
          <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-sky-400 to-indigo-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Plan Steps Timeline */}
      <div className="space-y-3.5">
        {plan.map((step, idx) => {
          const isDone = !!completedSteps[idx];

          return (
            <div
              key={idx}
              onClick={() => toggleStep(idx)}
              className={`p-4 rounded-2xl border transition duration-150 flex items-start gap-3.5 cursor-pointer select-none ${
                isDone
                  ? "bg-slate-950/40 border-emerald-500/30 text-slate-400"
                  : "bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-200"
              }`}
            >
              <button
                type="button"
                className="mt-0.5 shrink-0 text-slate-500 hover:text-emerald-400 transition"
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </button>

              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {step.stepOrDay}
                  </span>
                  <span className="text-xs font-bold text-sky-400">
                    Focus: {step.focusSkill}
                  </span>
                </div>

                <p className={`text-xs sm:text-sm font-semibold leading-snug ${isDone ? "line-through text-slate-400" : "text-white"}`}>
                  {step.resourceOrAction}
                </p>

                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-0.5">
                  <BookOpen className="w-3 h-3 text-indigo-400 shrink-0" />
                  <span>
                    <strong className="text-slate-300">Core Concept:</strong> {step.keyConcept}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
