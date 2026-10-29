import React, { useState } from "react";
import {
  FileEdit,
  ShieldCheck,
  Check,
  Copy,
  Sparkles,
  ArrowRight,
  Send,
  Wand2,
  AlertCircle
} from "lucide-react";
import { BulletPointSuggestion, BulletRewriteResult } from "../types";

interface BulletOptimizerSectionProps {
  bulletSuggestions: BulletPointSuggestion[];
  roleTitle: string;
}

export const BulletOptimizerSection: React.FC<BulletOptimizerSectionProps> = ({
  bulletSuggestions,
  roleTitle,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedCustomIndex, setCopiedCustomIndex] = useState<number | null>(null);

  // Custom Bullet Rewriter Studio state
  const [customBullet, setCustomBullet] = useState<string>("");
  const [customGoal, setCustomGoal] = useState<string>("");
  const [isRewriting, setIsRewriting] = useState<boolean>(false);
  const [rewriteResult, setRewriteResult] = useState<BulletRewriteResult | null>(null);
  const [bulletNotification, setBulletNotification] = useState<string | null>(null);
  const showBulletNotification = (msg: string) => { setBulletNotification(msg); setTimeout(() => setBulletNotification(null), 4000); };

  const handleCopy = (text: string, index: number, isCustom = false) => {
    navigator.clipboard.writeText(text);
    if (isCustom) {
      setCopiedCustomIndex(index);
      setTimeout(() => setCopiedCustomIndex(null), 2000);
    } else {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const handleRewriteCustomBullet = async () => {
    if (!customBullet || customBullet.trim().length < 5) return;
    setIsRewriting(true);

    try {
      const res = await fetch("/api/rewrite-bullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalBullet: customBullet,
          targetSkillOrGoal: customGoal || "Impact and technical precision",
          roleContext: roleTitle || "Technical Role",
        }),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok) {
        showBulletNotification(typeof json?.error === "string" ? json.error : "Request failed. Please try again.");
        return;
      }
      if (json?.success && json.data && typeof json.data === "object") {
        setRewriteResult(json.data);
      } else {
        showBulletNotification(json.error || "Failed to rewrite bullet.");
      }
    } catch (err) {
      console.error(err);
      showBulletNotification("Error generating rewrites. Please try again.");
    } finally {
      setIsRewriting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Main Rewrites List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <FileEdit className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Resume Bullet Point Optimizations
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Transform passive task descriptions into active, result-oriented statements without fabricating experience.
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Strict Anti-Hallucination Guardrail</span>
          </div>
        </div>

        {/* Anti-Hallucination Guarantee Banner */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-300">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-white block mb-0.5">
              100% Truthful Alignment
            </span>
            <p className="text-slate-400 leading-relaxed">
              We never fabricate achievements, companies, or tools you didn&apos;t use. Where quantitative results strengthen the bullet, we insert clean prompts like{" "}
              <code className="text-indigo-300 font-mono bg-indigo-950/60 px-1 py-0.5 rounded border border-indigo-800/40">[X%]</code> or{" "}
              <code className="text-indigo-300 font-mono bg-indigo-950/60 px-1 py-0.5 rounded border border-indigo-800/40">[N users]</code> so you can fill in your real verified metrics.
            </p>
          </div>
        </div>

        {/* List of bullet suggestions */}
        <div className="space-y-4">
          {bulletSuggestions.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition shadow-sm"
            >
              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2">
                {item.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Side-by-side or stacked diff */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Original */}
                <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800/90 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Original Bullet from Resume:
                  </span>
                  <p className="text-slate-300 line-through decoration-rose-500/60 leading-relaxed">
                    &ldquo;{item.originalBullet}&rdquo;
                  </p>
                </div>

                {/* Rewritten */}
                <div className="bg-slate-900/90 rounded-xl p-3.5 border border-sky-500/40 space-y-2 relative group">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-sky-400 block">
                      Optimized Bullet (Action + Context + Impact):
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(item.rewrittenBullet, idx)}
                      className="px-2 py-1 rounded-md text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1 transition"
                      title="Copy rewritten bullet"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-white font-medium leading-relaxed">
                    &bull; {item.rewrittenBullet}
                  </p>
                </div>
              </div>

              {/* Rationale & Note */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 pt-1">
                <p>
                  <strong className="text-slate-300">Why it works:</strong> {item.rationale}
                </p>
                <span className="text-sky-300/80 text-[11px] shrink-0 font-medium">
                  {item.impactNote}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Custom Bullet Rewriter Studio */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Interactive Bullet Rewriter Studio</h3>
            <p className="text-xs text-slate-400">
              Want to polish any other line from your resume? Paste it below to generate 3 tailored variations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Your Resume Bullet Point
            </label>
            <input
              type="text"
              value={customBullet}
              onChange={(e) => setCustomBullet(e.target.value)}
              placeholder="e.g. Worked on a team website project using React and helped debug errors..."
              className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Skill or Angle to Highlight
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                placeholder="e.g. JavaScript or Performance"
                className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="button"
                disabled={isRewriting || customBullet.trim().length < 5}
                onClick={handleRewriteCustomBullet}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition shrink-0 ${
                  isRewriting || customBullet.trim().length < 5
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shadow-md shadow-indigo-600/30"
                }`}
              >
                {isRewriting ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Rewrite</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {bulletNotification && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-200 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{bulletNotification}</span>
            </div>
            <button type="button" onClick={() => setBulletNotification(null)} className="text-amber-400 hover:text-white transition text-xs font-semibold">Dismiss</button>
          </div>
        )}

        {/* Results of Custom Rewrite */}
        {rewriteResult && (
          <div className="space-y-4 pt-2 border-t border-slate-800/80 animate-fadeIn">
            <div className="flex items-center justify-between text-xs text-indigo-300">
              <span className="font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> 3 Tailored Variations Generated:
              </span>
              <span className="text-slate-400">{rewriteResult.quickTip}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {rewriteResult.variations.map((v, i) => (
                <div
                  key={i}
                  className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-indigo-500/40 transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {v.style}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(v.rewrittenText, i, true)}
                        className="text-slate-400 hover:text-white transition flex items-center gap-1 text-[11px]"
                      >
                        {copiedCustomIndex === i ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedCustomIndex === i ? "Copied" : "Copy"}</span>
                      </button>
                    </div>

                    <p className="text-xs text-white leading-relaxed font-medium">
                      &bull; {v.rewrittenText}
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                    <strong className="text-slate-300">Verb:</strong> {v.actionVerbUsed} &bull; {v.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
