import React, { useState } from "react";
import {
  Sparkles,
  Briefcase,
  RefreshCw,
  FileText,
  Download,
  History,
  Printer,
  FileCode,
  ChevronDown
} from "lucide-react";
import { SAMPLE_PRESETS } from "../data/samplePresets";
import { PresetSample } from "../types";

interface HeaderProps {
  onSelectPreset: (preset: PresetSample) => void;
  onReset: () => void;
  hasResults: boolean;
  onExportMarkdown: () => void;
  onExportJson: () => void;
  onPrint: () => void;
  historyCount: number;
  onOpenHistory: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectPreset,
  onReset,
  hasResults,
  onExportMarkdown,
  onExportJson,
  onPrint,
  historyCount,
  onOpenHistory,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                CareerAlign
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  AI Coach
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Resume Gap Analysis &bull; Role-Specific Interview Simulator &bull; Grounded Bullet Rewrites
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Preset Selector Dropdown */}
          <div className="relative group">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Load example resumes and job descriptions"
            >
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Presets</span>
              <span className="text-[10px] text-slate-400">▼</span>
            </button>
            <div className="absolute right-0 mt-1 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 hidden group-hover:block group-focus-within:block z-50">
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700/60 mb-1">
                Try Example Roles
              </div>
              {SAMPLE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => onSelectPreset(preset)}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-700/80 transition flex flex-col gap-0.5 text-slate-200"
                >
                  <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
                    <Briefcase className="w-3 h-3 text-indigo-400" />
                    {preset.name}
                  </span>
                  <span className="text-[11px] text-slate-400 line-clamp-1">
                    {preset.subtitle}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* History Button */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition relative"
            title="View saved history"
          >
            <History className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 bg-indigo-500 text-white rounded-full text-[10px] font-bold">
                {historyCount}
              </span>
            )}
          </button>

          {hasResults && (
            <>
              {/* Export Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 transition"
                  title="Export analysis brief"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-300" />
                  <span className="hidden sm:inline">Export</span>
                  <ChevronDown className="w-3 h-3 text-indigo-400" />
                </button>

                {showExportMenu && (
                  <div className="absolute right-0 mt-1 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-1.5 z-50 animate-fadeIn">
                    <button
                      type="button"
                      onClick={() => {
                        onExportMarkdown();
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-slate-700 transition flex items-center gap-2 text-slate-200"
                    >
                      <Download className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Markdown Brief (.md)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onExportJson();
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-slate-700 transition flex items-center gap-2 text-slate-200"
                    >
                      <FileCode className="w-3.5 h-3.5 text-sky-400" />
                      <span>Raw Analysis (.json)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onPrint();
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-slate-700 transition flex items-center gap-2 text-slate-200"
                    >
                      <Printer className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Print / PDF Document</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Reset Button */}
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                title="Start a new analysis"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">New Check</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
