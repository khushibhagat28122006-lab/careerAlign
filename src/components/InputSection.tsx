import React, { useState, useRef } from "react";
import {
  FileText,
  Briefcase,
  Sparkles,
  ClipboardPaste,
  Trash2,
  Building,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Upload
} from "lucide-react";
import { SAMPLE_PRESETS } from "../data/samplePresets";
import { PresetSample } from "../types";

interface InputSectionProps {
  resumeText: string;
  setResumeText: (text: string) => void;
  jobDescriptionText: string;
  setJobDescriptionText: (text: string) => void;
  jobTitle: string;
  setJobTitle: (title: string) => void;
  companyName: string;
  setCompanyName: (company: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  onSelectPreset: (preset: PresetSample) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  resumeText,
  setResumeText,
  jobDescriptionText,
  setJobDescriptionText,
  jobTitle,
  setJobTitle,
  companyName,
  setCompanyName,
  onAnalyze,
  isLoading,
  onSelectPreset,
}) => {
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const resumeFileRef = useRef<HTMLInputElement | null>(null);
  const jdFileRef = useRef<HTMLInputElement | null>(null);

  const getWordCount = (str: string) => {
    const trimmed = str.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  };

  const handlePasteResume = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setResumeText(text);
        showFeedback("Pasted resume from clipboard!");
      }
    } catch {
      // Fallback
    }
  };

  const handlePasteJD = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setJobDescriptionText(text);
        showFeedback("Pasted job description!");
      }
    } catch {
      // Fallback
    }
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (text: string) => void,
    label: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setter(text);
        showFeedback(`Uploaded ${file.name} to ${label}!`);
      }
    };
    reader.onerror = () => {
      showFeedback(`Failed to read file ${file.name}`);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const showFeedback = (msg: string) => {
    setCopyFeedback(msg);
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  const isReady =
    resumeText.trim().length >= 20 && jobDescriptionText.trim().length >= 20;

  return (
    <div className="w-full space-y-6">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={resumeFileRef}
        onChange={(e) => handleFileUpload(e, setResumeText, "Resume")}
        accept=".txt,.md,.json,.text"
        className="hidden"
      />
      <input
        type="file"
        ref={jdFileRef}
        onChange={(e) => handleFileUpload(e, setJobDescriptionText, "Job Description")}
        accept=".txt,.md,.json,.text"
        className="hidden"
      />

      {/* Quick Preset Selector Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                Interactive Quick-Start
              </p>
            </div>
            <h2 className="text-sm sm:text-base font-semibold text-slate-100">
              Paste your materials or try a real scenario
            </h2>
            <p className="text-xs text-slate-400">
              Test how the coach spots missing skills (e.g., JavaScript/HTML for a CS student) and prepares you for the interview.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {SAMPLE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset(preset)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/90 hover:bg-indigo-600 hover:text-white text-slate-200 border border-slate-700/80 transition shadow-sm hover:shadow-indigo-500/20"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {copyFeedback && (
          <div className="mt-2 text-xs font-medium text-emerald-400 flex items-center gap-1.5 animate-fadeIn">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {copyFeedback}
          </div>
        )}
      </div>

      {/* Two-Column Input Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Candidate Resume */}
        <div className="flex flex-col bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden focus-within:border-indigo-500/60 transition">
          <div className="px-5 py-3.5 bg-slate-800/70 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Your Resume Content</h3>
                <p className="text-[11px] text-slate-400">
                  {getWordCount(resumeText)} words &bull; {resumeText.length} chars
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => resumeFileRef.current?.click()}
                className="px-2.5 py-1 text-xs rounded-md bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1 transition"
                title="Upload resume file (.txt, .md)"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Upload</span>
              </button>
              <button
                type="button"
                onClick={handlePasteResume}
                className="px-2.5 py-1 text-xs rounded-md bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1 transition"
                title="Paste from clipboard"
              >
                <ClipboardPaste className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">Paste</span>
              </button>
              {resumeText && (
                <button
                  type="button"
                  onClick={() => setResumeText("")}
                  className="p-1 text-slate-400 hover:text-rose-400 transition"
                  title="Clear resume"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="p-4 flex-1 flex flex-col">
            <textarea
              value={resumeText}
              maxLength={30000}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here... (Experience, Projects, Technical Skills, Education)"
              rows={14}
              className="w-full flex-1 bg-slate-950/60 text-slate-100 placeholder-slate-500 text-xs sm:text-sm rounded-xl p-3.5 border border-slate-800/80 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono leading-relaxed resize-y"
            />
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Submitted text is processed for analysis. Results are saved in this browser's history until you clear it.
              </span>
              {resumeText.trim().length > 0 && resumeText.trim().length < 20 && (
                <span className="text-amber-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Minimum 20 characters needed
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Target Job Description */}
        <div className="flex flex-col bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden focus-within:border-indigo-500/60 transition">
          <div className="px-5 py-3.5 bg-slate-800/70 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Target Job Description</h3>
                <p className="text-[11px] text-slate-400">
                  {getWordCount(jobDescriptionText)} words &bull; {jobDescriptionText.length} chars
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => jdFileRef.current?.click()}
                className="px-2.5 py-1 text-xs rounded-md bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1 transition"
                title="Upload job description file (.txt, .md)"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Upload</span>
              </button>
              <button
                type="button"
                onClick={handlePasteJD}
                className="px-2.5 py-1 text-xs rounded-md bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1 transition"
                title="Paste from clipboard"
              >
                <ClipboardPaste className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Paste</span>
              </button>
              {jobDescriptionText && (
                <button
                  type="button"
                  onClick={() => setJobDescriptionText("")}
                  className="p-1 text-slate-400 hover:text-rose-400 transition"
                  title="Clear job description"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="p-4 flex-1 flex flex-col space-y-3">
            {/* Optional Role Metadata Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Target Job Title (Optional)
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  maxLength={200}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Frontend Intern or Full Stack Dev"
                  className="w-full bg-slate-950/60 text-slate-200 placeholder-slate-600 text-xs rounded-lg px-3 py-2 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Company Name (Optional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={companyName}
                    maxLength={200}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Corp or Startup Labs"
                    className="w-full bg-slate-950/60 text-slate-200 placeholder-slate-600 text-xs rounded-lg pl-8 pr-3 py-2 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <Building className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                </div>
              </div>
            </div>

            {/* Job Description Textarea */}
            <textarea
              value={jobDescriptionText}
              maxLength={20000}
              onChange={(e) => setJobDescriptionText(e.target.value)}
              placeholder="Paste full job posting requirements, responsibilities, tech stack, and qualifications..."
              rows={11}
              className="w-full flex-1 bg-slate-950/60 text-slate-100 placeholder-slate-500 text-xs sm:text-sm rounded-xl p-3.5 border border-slate-800/80 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono leading-relaxed resize-y"
            />

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Paste requirements, qualifications, and responsibilities.</span>
              {jobDescriptionText.trim().length > 0 && jobDescriptionText.trim().length < 20 && (
                <span className="text-amber-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Minimum 20 characters needed
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Action Call to Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Ready for comprehensive match analysis</h4>
            <p className="text-xs text-slate-400">
              Extracts missing skills, compiles role strengths &amp; areas to improve, drafts practice interview questions, and refines bullets.
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={!isReady || isLoading}
          onClick={onAnalyze}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition duration-200 ${
            !isReady || isLoading
              ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 via-indigo-600 to-sky-500 text-white hover:brightness-110 shadow-indigo-600/30 cursor-pointer"
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing Resume &amp; Role...</span>
            </>
          ) : (
            <>
              <span>Analyze Match &amp; Generate Plan</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
