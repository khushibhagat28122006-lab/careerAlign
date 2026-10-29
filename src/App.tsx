import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { InputSection } from "./components/InputSection";
import { ScoreOverviewCard } from "./components/ScoreOverviewCard";
import { MissingSkillsSection } from "./components/MissingSkillsSection";
import { MatchedSkillsSection } from "./components/MatchedSkillsSection";
import { StrengthsAndImprovementsSection } from "./components/StrengthsAndImprovementsSection";
import { InterviewCoachSection } from "./components/InterviewCoachSection";
import { BulletOptimizerSection } from "./components/BulletOptimizerSection";
import { QuickStudyPlanSection } from "./components/QuickStudyPlanSection";
import { HistoryModal, HistoryItem } from "./components/HistoryModal";
import { SAMPLE_PRESETS } from "./data/samplePresets";
import { AnalysisResult, PresetSample } from "./types";
import confetti from "canvas-confetti";
import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  FileEdit,
  HelpCircle,
  Sparkles,
  History,
  X,
  FileText,
  Key,
  Info
} from "lucide-react";

export default function App() {
  const [resumeText, setResumeText] = useState<string>("");
  const [jobDescriptionText, setJobDescriptionText] = useState<string>("");
  const [jobTitle, setJobTitle] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const [activeTab, setActiveTab] = useState<string>("all");
  const [focusSkillQuery, setFocusSkillQuery] = useState<string>("");
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);

  // Load history & initial preset
  useEffect(() => {
    try {
      const saved = localStorage.getItem("careeralign_history");
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setHistoryItems(parsed.filter((item): item is HistoryItem =>
            Boolean(item && typeof item === "object" && typeof item.id === "string" &&
              typeof item.title === "string" && item.analysis && typeof item.analysis === "object" &&
              Array.isArray(item.analysis.matchedSkills) && Array.isArray(item.analysis.missingSkills) &&
              Array.isArray(item.analysis.strengths) && Array.isArray(item.analysis.areasToImprove) &&
              Array.isArray(item.analysis.interviewQuestions) && Array.isArray(item.analysis.bulletPointSuggestions) &&
              Array.isArray(item.analysis.quickStudyPlan))
          ).slice(0, 10));
        }
      }
    } catch {
      // Storage may be disabled or contain malformed data; continue without history.
    }

    // Default to the student example from presets to give immediate delight
    const defaultPreset = SAMPLE_PRESETS[0];
    setResumeText(defaultPreset.resumeText);
    setJobDescriptionText(defaultPreset.jobDescriptionText);
    setJobTitle(defaultPreset.roleTitle);
    setCompanyName(defaultPreset.companyName);
  }, []);

  const handleSelectPreset = (preset: PresetSample) => {
    setResumeText(preset.resumeText);
    setJobDescriptionText(preset.jobDescriptionText);
    setJobTitle(preset.roleTitle);
    setCompanyName(preset.companyName);
    setError(null);
  };

  const handleReset = () => {
    setAnalysis(null);
    setError(null);
    setActiveTab("all");
    setFocusSkillQuery("");
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobDescriptionText.trim()) {
      setError("Please provide both your resume and the job description to run an analysis.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobDescriptionText,
          jobTitle: jobTitle.trim(),
          companyName: companyName.trim(),
        }),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(typeof json?.error === "string" ? json.error : "Analysis request failed. Please try again.");
      }
      if (json?.success && json.data && typeof json.data === "object") {
        const result: AnalysisResult = {
          ...json.data,
          analyzedAt: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        };
        setAnalysis(result);
        setActiveTab("all");

        // Confetti celebration if score is solid!
        if (result.overallMatchScore >= 70) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        }

        // Save to local history
        const newHistoryItem: HistoryItem = {
          id: Date.now().toString(),
          title: result.targetJobTitle || jobTitle || "Target Role",
          date: new Date().toLocaleDateString(),
          analysis: result,
        };
        const updatedHistory = [newHistoryItem, ...historyItems.slice(0, 9)];
        setHistoryItems(updatedHistory);
        try {
          localStorage.setItem("careeralign_history", JSON.stringify(updatedHistory));
        } catch {
          setError("Analysis completed, but browser storage is unavailable so this result was not saved to history.");
        }
      } else {
        setError(typeof json?.error === "string" ? json.error : "The server returned an invalid analysis response.");
      }
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Error connecting to analysis server.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJumpToInterviewSkill = (skillName: string) => {
    setFocusSkillQuery(skillName);
    setActiveTab("interview");
  };

  const handleExportMarkdown = () => {
    if (!analysis) return;

    let md = `# CareerAlign Role Fit & Interview Prep Brief\n`;
    md += `Target Role: ${analysis.targetJobTitle || jobTitle}\n`;
    md += `Company: ${companyName || "Target Company"}\n`;
    md += `Overall Match Score: ${analysis.overallMatchScore}% (${analysis.matchTier})\n\n`;

    md += `## Executive Verdict\n${analysis.verdictSummary}\n\n`;

    md += `## Missing Skills Identified\n`;
    analysis.missingSkills.forEach((s) => {
      md += `### ${s.skill} (${s.importance.toUpperCase()} - Category: ${s.category})\n`;
      if (s.whereInJobDesc) md += `- Context in JD: "${s.whereInJobDesc}"\n`;
      md += `- Why it matters: ${s.whyItMatters}\n`;
      md += `- Bridging advice: ${s.bridgingAdvice}\n\n`;
    });

    md += `## Validated Matching Skills\n`;
    analysis.matchedSkills.forEach((s) => {
      md += `- **${s.skill}** (${s.category}) — Found in resume: "${s.foundInResume}"\n`;
    });
    md += `\n`;

    md += `## Key Strengths\n`;
    analysis.strengths.forEach((st) => {
      md += `- **${st.title}**: ${st.description}\n  Evidence: "${st.resumeEvidence}"\n`;
    });
    md += `\n`;

    md += `## Areas to Strengthen\n`;
    analysis.areasToImprove.forEach((a) => {
      md += `- **${a.title}**: ${a.description}\n  Action item: ${a.actionItem}\n`;
    });
    md += `\n`;

    md += `## Tailored Interview Practice Questions\n`;
    analysis.interviewQuestions.forEach((q, i) => {
      md += `### ${i + 1}. [${q.categoryLabel || q.category}] ${q.question}\n`;
      md += `- **Why asked**: ${q.contextWhyAsked}\n`;
      md += `- **STAR Guide**: ${q.tipsOrStarGuide}\n`;
      md += `- **Exemplary Answer**: "${q.sampleGoodResponse}"\n\n`;
    });

    md += `## Grounded Resume Bullet Point Rewrites\n`;
    analysis.bulletPointSuggestions.forEach((b, i) => {
      md += `### Bullet ${i + 1}: ${b.tags.join(", ")}\n`;
      md += `- Original: "${b.originalBullet}"\n`;
      md += `- Optimized: "${b.rewrittenBullet}"\n`;
      md += `- Rationale: ${b.rationale}\n\n`;
    });

    md += `## 7-Day Targeted Study Roadmap\n`;
    analysis.quickStudyPlan.forEach((p) => {
      md += `- **${p.stepOrDay} (${p.focusSkill})**: ${p.resourceOrAction} (Core concept: ${p.keyConcept})\n`;
    });

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `CareerAlign_Prep_${(analysis.targetJobTitle || "Role").replace(/\s+/g, "_")}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    if (!analysis) return;
    const jsonStr = JSON.stringify(analysis, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `CareerAlign_${(analysis.targetJobTitle || "Role").replace(/\s+/g, "_")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = historyItems.filter((item) => item.id !== id);
    setHistoryItems(updated);
    try {
      localStorage.setItem("careeralign_history", JSON.stringify(updated));
    } catch {
      setError("History changed for this session, but browser storage is unavailable.");
    }
  };

  const handleClearAllHistory = () => {
    setHistoryItems([]);
    try {
      localStorage.removeItem("careeralign_history");
    } catch {
      setError("History cleared for this session, but browser storage could not be updated.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Global Navigation Header */}
      <Header
        onSelectPreset={handleSelectPreset}
        onReset={handleReset}
        hasResults={Boolean(analysis)}
        onExportMarkdown={handleExportMarkdown}
        onExportJson={handleExportJson}
        onPrint={() => window.print()}
        historyCount={historyItems.length}
        onOpenHistory={() => setShowHistoryModal(true)}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        historyItems={historyItems}
        onSelectHistory={(item) => {
          setAnalysis(item.analysis);
          setJobTitle(item.title);
          setActiveTab("all");
        }}
        onDeleteHistory={handleDeleteHistoryItem}
        onClearAll={handleClearAllHistory}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Error notification banner */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/40 rounded-2xl p-4 flex items-center justify-between text-rose-200 text-sm">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="p-1 text-rose-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input Form Section */}
        {!analysis && (
          <div className="space-y-6">
            {/* Hero Welcome */}
            <div className="text-center max-w-3xl mx-auto space-y-3 pt-2 pb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Next-Gen Career Match &amp; Interview Intelligence</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
                Match Your Resume to Any Role with Total Confidence
              </h1>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                Identify critical missing skills, summarize true strengths and growth opportunities, simulate role-specific interview questions, and rewrite resume bullets without inventing qualifications.
              </p>
            </div>

            <InputSection
              resumeText={resumeText}
              setResumeText={setResumeText}
              jobDescriptionText={jobDescriptionText}
              setJobDescriptionText={setJobDescriptionText}
              jobTitle={jobTitle}
              setJobTitle={setJobTitle}
              companyName={companyName}
              setCompanyName={setCompanyName}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              onSelectPreset={handleSelectPreset}
            />
          </div>
        )}

        {/* Loading State Spinner Display */}
        {isLoading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-4 text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
              <Sparkles className="w-6 h-6 text-indigo-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">
                Analyzing Fit &amp; Generating Role-Specific Plan...
              </h3>
              <p className="text-xs text-slate-400 max-w-md">
                Cross-referencing requirements, identifying skill gaps, constructing interview scenarios, and crafting grounded bullet points.
              </p>
            </div>
          </div>
        )}

        {/* Analysis Results View */}
        {analysis && !isLoading && (
          <div className="space-y-8 animate-fadeIn">
            {/* Offline Mode / Live Gemini Banner */}
            {analysis.isOfflineDemo && (
              <div className="bg-sky-500/10 border border-sky-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-sky-200">
                <div className="flex items-start sm:items-center gap-2.5">
                  <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5 sm:mt-0" />
                  <span>
                    <strong>Offline Preview Mode:</strong> Analyzed with a local keyword-based estimate; results may be less nuanced than Gemini analysis. To switch to live Gemini AI generation, set your <code className="bg-sky-950/80 px-1.5 py-0.5 rounded font-mono text-sky-300 border border-sky-800/60">GEMINI_API_KEY</code> in <code className="bg-sky-950/80 px-1.5 py-0.5 rounded font-mono text-sky-300 border border-sky-800/60">.env.local</code>.
                  </span>
                </div>
              </div>
            )}

            {/* Top Overview & KPI Dashboard */}
            <ScoreOverviewCard
              analysis={analysis}
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setFocusSkillQuery("");
              }}
            />

            {/* Navigation Tabs Bar */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("all");
                  setFocusSkillQuery("");
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === "all"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                <span>Full Brief</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("missing")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === "missing"
                    ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Missing Skills ({analysis.missingSkills.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("matched")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === "matched"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Validated Skills ({analysis.matchedSkills.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("strengths")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === "strengths"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Strengths &amp; Improvements</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("interview")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === "interview"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Interview Simulator ({analysis.interviewQuestions.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("bullets")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === "bullets"
                    ? "bg-sky-600 text-white shadow-md shadow-sky-600/30"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                <FileEdit className="w-3.5 h-3.5" />
                <span>Bullet Rewrites ({analysis.bulletPointSuggestions.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("roadmap")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === "roadmap"
                    ? "bg-sky-600 text-white shadow-md shadow-sky-600/30"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Study Roadmap</span>
              </button>

              <div className="ml-auto">
                <button
                  type="button"
                  onClick={() => setAnalysis(null)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition"
                >
                  Edit Input Text
                </button>
              </div>
            </div>

            {/* Sections Rendering */}
            {(activeTab === "all" || activeTab === "missing") && (
              <MissingSkillsSection
                missingSkills={analysis.missingSkills}
                onJumpToInterviewSkill={handleJumpToInterviewSkill}
              />
            )}

            {(activeTab === "all" || activeTab === "matched") && (
              <MatchedSkillsSection matchedSkills={analysis.matchedSkills} />
            )}

            {(activeTab === "all" || activeTab === "strengths") && (
              <StrengthsAndImprovementsSection
                strengths={analysis.strengths}
                areasToImprove={analysis.areasToImprove}
              />
            )}

            {(activeTab === "all" || activeTab === "interview") && (
              <InterviewCoachSection
                questions={analysis.interviewQuestions}
                targetRole={analysis.targetJobTitle || jobTitle || "Target Position"}
                focusSkillQuery={focusSkillQuery}
              />
            )}

            {(activeTab === "all" || activeTab === "bullets") && (
              <BulletOptimizerSection
                bulletSuggestions={analysis.bulletPointSuggestions}
                roleTitle={analysis.targetJobTitle || jobTitle || "Software Engineer"}
              />
            )}

            {(activeTab === "all" || activeTab === "roadmap") && (
              <QuickStudyPlanSection
                plan={analysis.quickStudyPlan}
                targetRole={analysis.targetJobTitle || jobTitle || "Target Position"}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-900/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            CareerAlign AI &bull; Grounded Resume Optimization &amp; Interview Coaching
          </p>
          <p className="text-[11px] text-slate-500">
            Strict No-Hallucination Guardrail &bull; Zero Fabricated Experience
          </p>
        </div>
      </footer>
    </div>
  );
}
